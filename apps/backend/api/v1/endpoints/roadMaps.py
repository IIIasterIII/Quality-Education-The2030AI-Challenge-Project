from db.models import User
from fastapi import APIRouter, Depends, Form, File, UploadFile
from dotenv import load_dotenv
from utils.utils import get_current_user, get_db
from sqlalchemy.orm import Session
from typing import Optional

load_dotenv()

router = APIRouter(prefix="/roadmap", tags=["roadmap"])

@router.post("/create")
def create_roadmap(
    title: str = Form(...),
    description: Optional[str] = Form(None),
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    print(f"Title: {title}")
    print(f"Image: {image.filename}")
    print(f"User: {current_user.email}")
    print(f"Description: {description}")
    print(f"Image: {image}")
    return {"message": "Roadmap created successfully", "title": title}