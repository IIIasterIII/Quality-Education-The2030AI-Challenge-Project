from db.models import User
from fastapi import APIRouter, Depends, Form, File, UploadFile
from dotenv import load_dotenv
from utils.utils import get_current_user, get_db
from sqlalchemy.orm import Session
from typing import Optional
from utils.s3 import upload_file_to_s3
from db.models import RoadMap

load_dotenv()

router = APIRouter(prefix="/roadmap", tags=["roadmap"])

@router.post("/create")
async def create_roadmap(
    title: str = Form(...),
    description: Optional[str] = Form(None),
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    image_url = await upload_file_to_s3(image)
    new_roadmap = RoadMap(
        title=title,
        description=description,
        image_url=image_url,
        user_id=current_user.id
    )
    db.add(new_roadmap)
    db.commit()
    db.refresh(new_roadmap)
    return new_roadmap

@router.get("/")
async def pagination_roadmaps(
    page: int = 1, limit: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    offset = (page - 1) * limit
    roadmaps = db.query(RoadMap).join(User).filter(User.id == current_user.id).offset(offset).limit(limit).all()
    return roadmaps