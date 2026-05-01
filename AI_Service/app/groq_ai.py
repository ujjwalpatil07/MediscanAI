# app/groq_ai.py
import os
import asyncio
import random
import logging
import re
import json
from typing import List, Dict, Any, Optional, Tuple
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger("groq_ai")
logger.setLevel(logging.INFO)

# --- Use the Async SDK for the provider you have (example uses Groq/OpenAI bridge) ---
# Keep same import as you used previously; adjust if your provider/SDK differs.
try:
    from openai import AsyncOpenAI
except Exception:
    # If the package is named differently in your environment, change accordingly
    raise

client = AsyncOpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url=os.getenv("GROQ_BASE_URL", "https://api.groq.com/openai/v1")
)

MODEL_PRIORITIES = [
    m.strip() for m in os.getenv(
        "MODEL_PRIORITIES",
        "llama-3.3-70b-versatile,llama-3.1-8b-instant"
    ).split(",") if m.strip()
]
MAX_RETRIES_PER_MODEL = int(os.getenv("MAX_RETRIES_PER_MODEL", "3"))
BASE_BACKOFF = float(os.getenv("BASE_BACKOFF_SECONDS", "1.0"))


def strip_markdown(md_text: str) -> str:
    if not md_text:
        return ""
    text = re.sub(r"[*_#>`~\-]+", "", md_text)
    text = re.sub(r"\s{2,}", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def _is_transient_error(exc: Exception) -> bool:
    s = str(exc).lower()
    return any(t in s for t in [
        "over capacity", "503", "rate limit", "too many requests",
        "temporarily unavailable", "internal_server_error"
    ])


def _is_decommissioned_error(exc: Exception) -> bool:
    return "decommissioned" in str(exc).lower() or "model_decommissioned" in str(exc).lower()


async def _call_model_once(model: str, messages: List[Dict[str, str]], temperature=0.5, max_tokens=800):
    # Using the OpenAI-like chat completions API wrapper your SDK provides
    return await client.chat.completions.create(
        model=model,
        messages=messages,
        temperature=temperature,
        max_tokens=max_tokens
    )


async def call_with_fallback(messages: List[Dict[str, str]], temperature: float = 0.5, max_tokens: int = 800) -> Dict[str, Any]:
    last_error = None
    for model in MODEL_PRIORITIES:
        logger.info(f"Trying model: {model}")
        for attempt in range(1, MAX_RETRIES_PER_MODEL + 1):
            try:
                resp = await _call_model_once(model, messages, temperature, max_tokens)
                if not getattr(resp, "choices", None):
                    raise ValueError("Empty response from model.")
                return {"status": "success", "response": resp, "model_used": model}
            except Exception as e:
                last_error = e
                logger.warning(f"Model {model} failed (attempt {attempt}): {e}")
                if _is_decommissioned_error(e):
                    break
                if _is_transient_error(e):
                    wait = BASE_BACKOFF * (2 ** (attempt - 1)) + random.uniform(0, 0.5)
                    logger.info(f"Transient error, retrying after {wait:.1f}s")
                    await asyncio.sleep(wait)
                    continue
                break
    return {"status": "error", "message": "All models failed", "detail": str(last_error)}


def extract_json_and_text(text: str) -> Tuple[Optional[dict], str]:
    if not text:
        return None, ""
    match = re.search(r"```json\s*(\{.*?\})\s*```", text, re.DOTALL)
    if not match:
        match = re.search(r"(\{(?:[^{}]|\{[^{}]*\})*\})", text, re.DOTALL)
    if not match:
        return None, text
    try:
        data = json.loads(match.group(1))
        clean_text = text.replace(match.group(0), "").strip()
        return data, clean_text
    except Exception:
        return None, text


SYSTEM_PROMPT = (
    "You are a medically knowledgeable and safe assistant. "
    "You analyze symptoms and wound descriptions responsibly. "
    "Your tone should be clear, concise, empathetic, and formatted neatly with headings. "
    "Always remind the user to consult a medical professional for real diagnosis."
)


async def analyze_symptoms(symptoms: str) -> dict:
    if not symptoms or not symptoms.strip():
        return {"status": "error", "message": "No symptoms provided."}

    prompt = (
        f"A patient reports the following symptoms:\n\n{symptoms}\n\n"
        "Provide a structured medical assessment including:\n"
        "1. Possible Medical Conditions (brief explanations)\n"
        "2. Urgency Level: Low / Moderate / Critical\n"
        "3. Key Red Flags (if any)\n"
        "4. Suggested Home Remedies or First-Aid\n"
        "5. Recommended Next Steps (doctor type or test)\n"
        "6. Disclaimer: This is not a diagnosis, just general guidance."
    )

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": prompt}
    ]

    result = await call_with_fallback(messages, temperature=0.4, max_tokens=900)
    if result.get("status") != "success":
        return {"status": "error", "message": result.get("message"), "detail": result.get("detail")}

    resp = result["response"]
    model_used = result.get("model_used")
    try:
        content = resp.choices[0].message.content or ""
        json_part, text_part = extract_json_and_text(content)
        clean_text = strip_markdown(text_part or content)
        return {
            "status": "success",
            "analysis": clean_text,
            "json": json_part,
            "model_used": model_used
        }
    except Exception as e:
        logger.exception("Parsing error in analyze_symptoms")
        return {"status": "error", "message": "Failed to parse AI response", "detail": str(e)}


async def ask_groq(prompt: str) -> dict:
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": prompt}
    ]
    result = await call_with_fallback(messages, temperature=0.5, max_tokens=900)
    if result.get("status") != "success":
        return {"status": "error", "message": result.get("message"), "detail": result.get("detail")}

    try:
        content = result["response"].choices[0].message.content or ""
        json_part, text_part = extract_json_and_text(content)
        clean_text = strip_markdown(text_part or content)
        return {
            "status": "success",
            "analysis": clean_text,
            "json": json_part,
            "model_used": result.get("model_used")
        }
    except Exception as e:
        logger.exception("Parsing error in ask_groq")
        return {"status": "error", "message": "Failed to parse AI response", "detail": str(e)}
