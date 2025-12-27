from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine
import models  # models import zaroori hai
from routers import locations, projects, feedback, dashboard, ai

# ✅ IMPORTANT: yahi tables create karega agar DB khali ho
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Bharat Panchayat Transparency - Backend",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],   # dev ke liye theek hai
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers mount
app.include_router(locations.router)
app.include_router(projects.router)
app.include_router(feedback.router)
app.include_router(dashboard.router)
app.include_router(ai.router)


@app.get("/")
def root():
    return {"message": "Bharat Panchayat Transparency API OK"}

from fastapi.staticfiles import StaticFiles

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

from routers import contractor
app.include_router(contractor.router)
