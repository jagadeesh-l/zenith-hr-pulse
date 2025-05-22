from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import os

from app.config import config
from app.routers import employees
from app.feature_flags import FeatureFlags

# Create FastAPI app
app = FastAPI(
    title=config.get("app.name"),
    description=config.get("app.description"),
    version=config.get("app.version")
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.get("cors.allow_origins", ["*"]),
    allow_credentials=True,
    allow_methods=config.get("cors.allow_methods", ["*"]),
    allow_headers=config.get("cors.allow_headers", ["*"])
)

# Include routers
app.include_router(employees.router)

# Health check endpoint
@app.get("/api/health", tags=["health"])
async def health_check():
    return {"status": "healthy"}

# Root endpoint
@app.get("/", tags=["root"])
async def root():
    return {"message": f"Welcome to {config.get('app.name')}"}

if __name__ == "__main__":
    uvicorn.run(
        "main:app", 
        host="0.0.0.0", 
        port=8000, 
        reload=config.get("app.debug", False)
    ) 