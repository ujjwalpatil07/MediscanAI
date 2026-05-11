# app/routes.py
import json
import asyncio
import re
import logging
from fastapi import APIRouter, UploadFile, File, Form, Request, HTTPException
from fastapi.responses import StreamingResponse, JSONResponse
from app.schemas import SymptomInput
from app.groq_ai import analyze_symptoms, ask_groq
from app.wound_detection import analyze_wound_image

logger = logging.getLogger("routes")
router = APIRouter()

@router.get("/")
async def health_check():
    return {"status": "ok", "service": "MediScan AI API"}

@router.post("/analyze")
async def analyze(symptom_input: SymptomInput):
    res = await analyze_symptoms(symptom_input.symptoms)
    
    # If AI response is successful, structure it for better display
    if res.get("status") == "success":
        structured_response = structure_symptom_analysis(res.get("analysis", ""))
        return JSONResponse(content={
            "status": "success",
            "data": structured_response,
            "model_used": res.get("model_used")
        })
    
    return JSONResponse(content=res)

# Provide a root alias so frontend that posts to "/" will get wound analysis
@router.post("/")
async def root_wound_analysis(image: UploadFile = File(...), description: str = Form(None)):
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
        f"Please provide a structured analysis with the following sections:\n"
        f"1. DIAGNOSIS: What type of wound this appears to be\n"
        f"2. SEVERITY ASSESSMENT: Detailed assessment of severity\n"
        f"3. IMMEDIATE CARE: Step-by-step immediate care instructions\n"
        f"4. MEDICATIONS: Suggested medications (if any)\n"
        f"5. WHEN TO SEEK HELP: Clear indicators for medical attention\n"
        f"6. FOLLOW-UP CARE: Ongoing care instructions"
    )
    
    ai_response = await ask_groq(prompt)
    
    # Structure wound analysis response
    structured_wound = structure_wound_analysis(ai_response.get("analysis", "") if ai_response.get("status") == "success" else "")
    
    if ai_response.get("status") != "success":
        return JSONResponse(content={
            "status": "success", 
            "wound_result": wound_result, 
            "analysis": structured_wound,
            "model_used": None
        })
    
    return JSONResponse(content={
        "status": "success", 
        "wound_result": wound_result, 
        "analysis": structured_wound,
        "model_used": ai_response.get("model_used")
    })

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
            
            # Structure the response
            structured_data = structure_symptom_analysis(full_text)
            
            # Send model info
            yield f'data: {json.dumps({"type":"meta","model": res.get("model_used", "unknown")})}\n\n'
            await asyncio.sleep(0.05)
            
            # Send analysis section
            if structured_data.get("analysis"):
                yield f'data: {json.dumps({"type":"section","section":"analysis","content": structured_data["analysis"]})}\n\n'
                await asyncio.sleep(0.05)
            
            # Send possible conditions
            if structured_data.get("possible_conditions"):
                yield f'data: {json.dumps({"type":"section","section":"conditions","content": structured_data["possible_conditions"]})}\n\n'
                await asyncio.sleep(0.05)
            
            # Send urgency level
            if structured_data.get("urgency"):
                yield f'data: {json.dumps({"type":"section","section":"urgency","content": structured_data["urgency"]})}\n\n'
                await asyncio.sleep(0.05)
            
            # Send red flags
            if structured_data.get("red_flags"):
                yield f'data: {json.dumps({"type":"section","section":"red_flags","content": structured_data["red_flags"]})}\n\n'
                await asyncio.sleep(0.05)
            
            # Send home remedies
            if structured_data.get("home_remedies"):
                yield f'data: {json.dumps({"type":"section","section":"remedies","content": structured_data["home_remedies"]})}\n\n'
                await asyncio.sleep(0.05)
            
            # Send recommended actions
            if structured_data.get("recommended_actions"):
                yield f'data: {json.dumps({"type":"section","section":"actions","content": structured_data["recommended_actions"]})}\n\n'
                await asyncio.sleep(0.05)
            
            # Send disclaimer
            if structured_data.get("disclaimer"):
                yield f'data: {json.dumps({"type":"section","section":"disclaimer","content": structured_data["disclaimer"]})}\n\n'
            
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
        f"Please provide a structured analysis with the following sections:\n"
        f"1. DIAGNOSIS: What type of wound this appears to be\n"
        f"2. SEVERITY ASSESSMENT: Detailed assessment of severity\n"
        f"3. IMMEDIATE CARE: Step-by-step immediate care instructions\n"
        f"4. MEDICATIONS: Suggested medications (if any)\n"
        f"5. WHEN TO SEEK HELP: Clear indicators for medical attention\n"
        f"6. FOLLOW-UP CARE: Ongoing care instructions"
    )

    ai_resp = await ask_groq(prompt)
    structured_wound = structure_wound_analysis(ai_resp.get("analysis", "") if ai_resp.get("status") == "success" else "")

    async def event_generator():
        # meta info - include model if available
        yield f'data: {json.dumps({"type":"meta","model": ai_resp.get("model_used") if isinstance(ai_resp, dict) else None})}\n\n'
        await asyncio.sleep(0.05)

        # short wound info first
        summary = f"Wound Analysis: Severity: {wound_result['severity']} | Area: {int(wound_result['wound_area'])} px | Red Percentage: {wound_result.get('red_pct', 0):.2f}%"
        yield f'data: {json.dumps({"type":"section","section":"wound_info","content": summary})}\n\n'
        await asyncio.sleep(0.1)

        if ai_resp.get("status") != "success" or not structured_wound.get("diagnosis"):
            fallback_text = f"Wound detected: {wound_result['severity']} severity. Area: {int(wound_result['wound_area'])} pixels. Please keep the wound clean and dry. Seek medical attention if you notice signs of infection such as increased redness, swelling, or discharge."
            yield f'data: {json.dumps({"type":"section","section":"analysis","content": fallback_text})}\n\n'
            yield f'data: {json.dumps({"type":"meta","status":"done"})}\n\n'
            return

        # Send diagnosis
        if structured_wound.get("diagnosis"):
            yield f'data: {json.dumps({"type":"section","section":"diagnosis","content": structured_wound["diagnosis"]})}\n\n'
            await asyncio.sleep(0.08)
        
        # Send severity assessment
        if structured_wound.get("severity_assessment"):
            yield f'data: {json.dumps({"type":"section","section":"severity","content": structured_wound["severity_assessment"]})}\n\n'
            await asyncio.sleep(0.08)
        
        # Send immediate care
        if structured_wound.get("immediate_care"):
            yield f'data: {json.dumps({"type":"section","section":"immediate_care","content": structured_wound["immediate_care"]})}\n\n'
            await asyncio.sleep(0.08)
        
        # Send medications
        if structured_wound.get("medications"):
            yield f'data: {json.dumps({"type":"section","section":"medications","content": structured_wound["medications"]})}\n\n'
            await asyncio.sleep(0.08)
        
        # Send when to seek help
        if structured_wound.get("when_to_seek_help"):
            yield f'data: {json.dumps({"type":"section","section":"seek_help","content": structured_wound["when_to_seek_help"]})}\n\n'
            await asyncio.sleep(0.08)
        
        # Send follow-up care
        if structured_wound.get("follow_up_care"):
            yield f'data: {json.dumps({"type":"section","section":"follow_up","content": structured_wound["follow_up_care"]})}\n\n'
        
        yield f'data: {json.dumps({"type":"meta","status":"done"})}\n\n'

    return StreamingResponse(event_generator(), media_type="text/event-stream")

def structure_symptom_analysis(analysis_text: str) -> dict:
    """Structure the raw AI analysis into organized sections"""
    
    result = {
        "analysis": "",
        "possible_conditions": [],
        "urgency": {},
        "red_flags": [],
        "home_remedies": [],
        "recommended_actions": [],
        "disclaimer": ""
    }
    
    if not analysis_text:
        return result
    
    # Extract analysis section
    analysis_match = re.search(r'Medical Assessment[\s:]*\n?(.*?)(?=Possible|\d\.|Urgency|$)', analysis_text, re.IGNORECASE | re.DOTALL)
    if analysis_match:
        result["analysis"] = analysis_match.group(1).strip()
    
    # Extract possible conditions
    conditions_match = re.search(r'Possible Medical Conditions[\s:]*\n?(.*?)(?=Urgency|\d\.|$)', analysis_text, re.IGNORECASE | re.DOTALL)
    if conditions_match:
        conditions_text = conditions_match.group(1).strip()
        conditions = re.split(r'\n\s*(?:\d+\.|\•|\-|\*)\s*', conditions_text)
        result["possible_conditions"] = [c.strip() for c in conditions if c.strip()]
    
    # Extract urgency level
    urgency_match = re.search(r'Urgency Level[\s:]*\n?(.*?)(?=Key Red Flags|\d\.|$)', analysis_text, re.IGNORECASE | re.DOTALL)
    if urgency_match:
        urgency_text = urgency_match.group(1).strip()
        if "critical" in urgency_text.lower():
            level = "critical"
        elif "high" in urgency_text.lower():
            level = "high"
        elif "moderate" in urgency_text.lower():
            level = "moderate"
        else:
            level = "low"
        
        result["urgency"] = {
            "level": level,
            "message": urgency_text,
            "timeframe": get_urgency_timeframe(level)
        }
    
    # Extract red flags
    red_flags_match = re.search(r'Key Red Flags[\s:]*\n?(.*?)(?=Suggested Home|Home Remedies|\d\.|$)', analysis_text, re.IGNORECASE | re.DOTALL)
    if red_flags_match:
        flags_text = red_flags_match.group(1).strip()
        flags = re.split(r'\n\s*(?:\d+\.|\•|\-|\*)\s*', flags_text)
        result["red_flags"] = [f.strip() for f in flags if f.strip()]
    
    # Extract home remedies
    remedies_match = re.search(r'(?:Suggested Home Remedies|Home Remedies|First[- ]?Aid)[\s:]*\n?(.*?)(?=Recommended Next Steps|\d\.|$)', analysis_text, re.IGNORECASE | re.DOTALL)
    if remedies_match:
        remedies_text = remedies_match.group(1).strip()
        remedies = re.split(r'\n\s*(?:\d+\.|\•|\-|\*)\s*', remedies_text)
        result["home_remedies"] = [r.strip() for r in remedies if r.strip()]
    
    # Extract recommended actions
    actions_match = re.search(r'Recommended Next Steps[\s:]*\n?(.*?)(?=Disclaimer|\d\.|$)', analysis_text, re.IGNORECASE | re.DOTALL)
    if actions_match:
        actions_text = actions_match.group(1).strip()
        actions = re.split(r'\n\s*(?:\d+\.|\•|\-|\*)\s*', actions_text)
        result["recommended_actions"] = [a.strip() for a in actions if a.strip()]
    
    # Extract disclaimer
    disclaimer_match = re.search(r'Disclaimer[\s:]*\n?(.*?)$', analysis_text, re.IGNORECASE | re.DOTALL)
    if disclaimer_match:
        result["disclaimer"] = disclaimer_match.group(1).strip()
    else:
        result["disclaimer"] = "This is not a diagnosis, just general guidance. Please consult a medical professional for proper evaluation."
    
    return result

def structure_wound_analysis(analysis_text: str) -> dict:
    """Structure wound analysis response"""
    result = {
        "diagnosis": "",
        "severity_assessment": "",
        "immediate_care": [],
        "medications": [],
        "when_to_seek_help": [],
        "follow_up_care": []
    }
    
    if not analysis_text:
        return result
    
    # Extract diagnosis
    diagnosis_match = re.search(r'DIAGNOSIS[\s:]*\n?(.*?)(?=SEVERITY|$)', analysis_text, re.IGNORECASE | re.DOTALL)
    if diagnosis_match:
        result["diagnosis"] = diagnosis_match.group(1).strip()
    
    # Extract severity assessment
    severity_match = re.search(r'SEVERITY ASSESSMENT[\s:]*\n?(.*?)(?=IMMEDIATE|$)', analysis_text, re.IGNORECASE | re.DOTALL)
    if severity_match:
        result["severity_assessment"] = severity_match.group(1).strip()
    
    # Extract immediate care
    care_match = re.search(r'IMMEDIATE CARE[\s:]*\n?(.*?)(?=MEDICATIONS|$)', analysis_text, re.IGNORECASE | re.DOTALL)
    if care_match:
        care_text = care_match.group(1).strip()
        care_items = re.split(r'\n\s*(?:\d+\.|\•|\-|\*)\s*', care_text)
        result["immediate_care"] = [c.strip() for c in care_items if c.strip()]
    
    # Extract medications
    meds_match = re.search(r'MEDICATIONS[\s:]*\n?(.*?)(?=WHEN TO SEEK|$)', analysis_text, re.IGNORECASE | re.DOTALL)
    if meds_match:
        meds_text = meds_match.group(1).strip()
        meds_items = re.split(r'\n\s*(?:\d+\.|\•|\-|\*)\s*', meds_text)
        result["medications"] = [m.strip() for m in meds_items if m.strip()]
    
    # Extract when to seek help
    seek_match = re.search(r'WHEN TO SEEK HELP[\s:]*\n?(.*?)(?=FOLLOW-UP|$)', analysis_text, re.IGNORECASE | re.DOTALL)
    if seek_match:
        seek_text = seek_match.group(1).strip()
        seek_items = re.split(r'\n\s*(?:\d+\.|\•|\-|\*)\s*', seek_text)
        result["when_to_seek_help"] = [s.strip() for s in seek_items if s.strip()]
    
    # Extract follow-up care
    followup_match = re.search(r'FOLLOW-UP CARE[\s:]*\n?(.*?)$', analysis_text, re.IGNORECASE | re.DOTALL)
    if followup_match:
        followup_text = followup_match.group(1).strip()
        followup_items = re.split(r'\n\s*(?:\d+\.|\•|\-|\*)\s*', followup_text)
        result["follow_up_care"] = [f.strip() for f in followup_items if f.strip()]
    
    return result

def get_urgency_timeframe(level: str) -> str:
    """Get timeframe based on urgency level"""
    timeframes = {
        "critical": "Immediate - Seek emergency care now",
        "high": "Within 24 hours - Schedule urgent appointment",
        "moderate": "Within 2-3 days - Monitor symptoms",
        "low": "1-2 weeks - Schedule regular checkup"
    }
    return timeframes.get(level, "Varies - Consult doctor")

def chunk_text(text: str):
    """Split text into smaller, readable chunks"""
    if not text:
        return []
    
    # Split by sentences for natural breaks
    sentences = re.split(r'(?<=[.!?])\s+', text)
    chunks = []
    current_chunk = ""
    
    for sentence in sentences:
        if len(current_chunk) + len(sentence) > 200:
            if current_chunk:
                chunks.append(current_chunk.strip())
            current_chunk = sentence
        else:
            current_chunk += (" " + sentence if current_chunk else sentence)
    
    if current_chunk:
        chunks.append(current_chunk.strip())
    
    if not chunks:
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