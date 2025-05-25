import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
import warnings
from contextlib import asynccontextmanager

# Suppress the pydantic warning
warnings.filterwarnings("ignore", message="Valid config keys have changed in V2")

# MongoDB connection
MONGODB_URL = "mongodb://localhost:27017"
client = AsyncIOMotorClient(MONGODB_URL)
db = client.hr_pulse

# Password hashing configuration
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    try:
        # Test the connection
        await db.command("ping")
        print("Connected successfully to MongoDB")
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")
    yield
    # Shutdown
    client.close()

app = FastAPI(lifespan=lifespan)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],  # Your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import and include your routers
from routes import auth, employees, users

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(employees.router, prefix="/api/employees", tags=["employees"])
app.include_router(users.router, prefix="/api/users", tags=["users"])

if __name__ == "__main__":
    uvicorn.run("run:app", host="0.0.0.0", port=8000, reload=True) 