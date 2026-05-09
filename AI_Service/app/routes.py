# app/routes.py
import json
import asyncio
from fastapi import APIRouter, UploadFile, File, Form, Request, HTTPException
from fastapi.responses import StreamingResponse, JSONResponse
from app.schemas import SymptomInput
from app.groq_ai import analyze_symptoms, ask_groq
from app.wound_detection import analyze_wound_image

router = APIRouter()

@router.get("/")
async def health_check():
    return {"status": "ok", "service": "MediScan AI API"}

@router.post("/analyze")
async def analyze(symptom_input: SymptomInput):
    res = await analyze_symptoms(symptom_input.symptoms)
    # return as-is (client expects status/analysis/json)
    return JSONResponse(content=res)

# Provide a root alias so frontend that posts to "/" will get wound analysis
@router.post("/")
async def root_wound_analysis(image: UploadFile = File(...), description: str = Form(None)):
    # delegate to the same logic as /wound-analysis
    return await wound_analysis(image=image, description=description)

@router.post("/wound-analysis")
async def wound_analysis(
    image: UploadFile = File(...),
    description: str = Form(None)
):
    wound_result = await analyze_wound_image(image)
    if wound_result.get("status") != "success":
        return JSONResponse(content={"status": "error", "message": wound_result.get("error", "Image analysis failed"), "wound_result": wound_result})

    prompt = (
        f"The image analysis shows: {wound_result['severity']} wound, "
        f"area: {int(wound_result['wound_area'])} px (red%: {wound_result.get('red_pct', 0):.2f}).\n"
        f"Patient says: {description or 'No extra details'}.\n"
        f"Suggest diagnosis and care.\n"
        f"Suggest medications and tablets."
    )
    ai_response = await ask_groq(prompt)
    # if ai_response is error, create fallback
    if ai_response.get("status") != "success":
        fallback = {
            "status": "success",
            "analysis": f"AI service unavailable. Wound detected: {wound_result['severity']}, area: {int(wound_result['wound_area'])} px, red%={wound_result.get('red_pct', 0):.2f}.",
            "json": None,
            "model_used": None
        }
        return JSONResponse(content={"status": "success", "wound_result": wound_result, "ai": fallback})
    # success
    return JSONResponse(content={"status": "success", "wound_result": wound_result, "ai": ai_response})

@router.post("/stream-analyze")
async def stream_analyze(request: Request):
    try:
        payload = await request.json()
        symptoms = payload.get("symptoms", "")
        
        if not symptoms or not symptoms.strip():
            return StreamingResponse(
                generator_error("Symptoms are required"),
                media_type="text/event-stream"
            )
        
        res = await analyze_symptoms(symptoms)
        
        async def event_generator():
            if res.get("status") != "success":
                yield f'data: {json.dumps({"type":"error","message": res.get("message", "Unknown error")})}\n\n'
                return
            
            full_text = res.get("analysis", "")
            if not full_text:
                yield f'data: {json.dumps({"type":"error","message": "No analysis generated"})}\n\n'
                return
            
            # Send model info with proper formatting
            yield f'data: {json.dumps({"type":"meta","model": res.get("model_used", "unknown")})}\n\n'
            
            # Stream in smaller chunks for better readability
            chunks = chunk_text(full_text)
            for chunk in chunks:
                # Each chunk on its own line with proper SSE format
                yield f'data: {json.dumps({"type":"chunk","chunk": chunk})}\n\n'
                await asyncio.sleep(0.05)  # Slight delay for smooth streaming
            
            # Send completion
            yield f'data: {json.dumps({"type":"meta","status":"done"})}\n\n'
        
        return StreamingResponse(event_generator(), media_type="text/event-stream")
        
    except Exception as e:
        logger.exception("Stream analysis error")
        return StreamingResponse(
            generator_error(str(e)),
            media_type="text/event-stream"
        )


@router.post("/stream-wound-analysis")
async def stream_wound_analysis(image: UploadFile = File(...), description: str = Form(None)):
    wound_result = await analyze_wound_image(image)
    if wound_result.get("status") != "success":
        async def err_gen():
            yield json.dumps({"type":"error","message": wound_result.get("error","Image processing failed")}) + "\n"
        return StreamingResponse(err_gen(), media_type="text/event-stream")

    prompt = (
        f"The image analysis shows: {wound_result['severity']} wound, "
        f"area: {int(wound_result['wound_area'])} px (red%: {wound_result.get('red_pct', 0):.2f}).\n"
        f"Patient says: {description or 'No extra details'}.\n"
        f"Suggest diagnosis and care.\n"
        f"Suggest medications and tablets."
    )

    # ask_groq returns dict with status/analysis/json
    ai_resp = await ask_groq(prompt)
    ai_text = ai_resp.get("analysis") if ai_resp.get("status") == "success" else None

    async def event_generator():
        # meta info - include model if available
        yield json.dumps({"type":"meta","model": ai_resp.get("model_used") if isinstance(ai_resp, dict) else None}) + "\n"

        # short wound info first
        summary = f"Wound: severity={wound_result['severity']}, area={int(wound_result['wound_area'])} px, red%={wound_result.get('red_pct', 0):.2f}."
        yield json.dumps({"type":"chunk","chunk":summary}) + "\n"
        await asyncio.sleep(0.14)

        if not ai_text:
            # fallback if AI unavailable
            yield json.dumps({"type":"chunk","chunk":"AI service unavailable. Cannot provide expanded analysis."}) + "\n"
            yield json.dumps({"type":"meta","status":"done"}) + "\n"
            return

        for chunk in chunk_text(ai_text):
            yield json.dumps({"type":"chunk","chunk":chunk}) + "\n"
            await asyncio.sleep(0.12)
        yield json.dumps({"type":"meta","status":"done"}) + "\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")


def chunk_text(text: str):
    """Split text into smaller, readable chunks"""
    if not text:
        return []
    
    # Split by sentences for natural breaks
    import re
    sentences = re.split(r'(?<=[.!?])\s+', text)
    chunks = []
    current_chunk = ""
    
    for sentence in sentences:
        # If adding this sentence would exceed chunk size, yield current chunk
        if len(current_chunk) + len(sentence) > 200:
            if current_chunk:
                chunks.append(current_chunk.strip())
            current_chunk = sentence
        else:
            current_chunk += (" " + sentence if current_chunk else sentence)
    
    if current_chunk:
        chunks.append(current_chunk.strip())
    
    # If still no chunks or chunks are too large, split by words
    if not chunks or any(len(chunk) > 300 for chunk in chunks):
        words = text.split()
        chunks = []
        current_chunk = ""
        
        for word in words:
            if len(current_chunk) + len(word) < 150:
                current_chunk += (" " + word if current_chunk else word)
            else:
                if current_chunk:
                    chunks.append(current_chunk)
                current_chunk = word
        
        if current_chunk:
            chunks.append(current_chunk)
    
    return chunks

async def generator_error(message: str):
    """Generate error response for streaming"""
    yield f'data: {json.dumps({"type":"error","message": message})}\n\n'