# app/main.py
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import router

app = FastAPI(
    title="MediScan AI API",
    description="AI-powered medical assistance for symptom and wound analysis.",
    version="1.0.0",
)

# Ideally configure allowed origins via env var; fallback to common dev urls
FRONTEND_ORIGINS = os.getenv(
    "FRONTEND_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,http://127.0.0.1:3000"
)
origins = [o.strip() for o in FRONTEND_ORIGINS.split(",") if o.strip()]

# If you want to accept all in dev, set ALLOW_ALL_ORIGINS=1 in .env
if os.getenv("ALLOW_ALL_ORIGINS", "0") == "1":
    origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# include routes at root (no prefix) so frontend can call "/" if needed
app.include_router(router)
