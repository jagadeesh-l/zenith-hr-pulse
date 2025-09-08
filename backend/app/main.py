from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from dotenv import load_dotenv

from .routers import auth, employees, goals, feedback, ai
from .database import initialize_dynamodb
from .services.s3_service import initialize_s3
from .services.bedrock_service import initialize_bedrock

load_dotenv()

app = FastAPI(title="ZenithHR API")

# Configure CORS
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:8080").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount the uploads directory (for backward compatibility)
if os.path.exists("uploads"):
    app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Include routers
app.include_router(auth.router)
app.include_router(employees.router)
app.include_router(goals.router)
app.include_router(feedback.router)
app.include_router(ai.router)

@app.on_event("startup")
async def startup_event():
    """Initialize AWS services on startup"""
    print("Initializing AWS services...")
    
    # Initialize DynamoDB
    await initialize_dynamodb()
    
    # Initialize S3
    await initialize_s3()
    
    # Initialize Bedrock
    await initialize_bedrock()
    
    print("AWS services initialization completed")

@app.get("/")
async def root():
    return {"message": "ZenithHR API is running with AWS services"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "services": {
            "dynamodb": "initialized",
            "s3": "initialized", 
            "bedrock": "initialized"
        }
    }