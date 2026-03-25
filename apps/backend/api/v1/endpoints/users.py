from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from db.session import get_db
from db.models import User, Notes, RoadMap
from utils.s3 import upload_file_to_s3
from utils.utils import get_current_user
from pydantic import BaseModel
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/avatar")
async def upload_avatar(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    url = await upload_file_to_s3(file, folder="avatars")
    current_user.avatar = url
    db.commit()
    return {"url": url}

class UserUpdate(BaseModel):
    username: Optional[str] = None
    avatar: Optional[str] = None

@router.get("/{uid}")
async def get_user_profile(uid: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.firebase_uid == uid).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    notes_count = db.query(Notes).filter(Notes.user_id == user.id).count()
    roadmaps_count = db.query(RoadMap).filter(RoadMap.user_id == user.id).count()
    
    return {
        "id": user.id,
        "firebase_uid": user.firebase_uid,
        "username": user.username,
        "email": user.email,
        "avatar": user.avatar,
        "stats": {
            "notes": notes_count,
            "roadmaps": roadmaps_count,
            "learning_hours": 12, 
            "quiz_score": 850    
        }
    }

@router.put("/me")
async def update_profile(
    data: UserUpdate, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    if data.username is not None:
        current_user.username = data.username
    if data.avatar is not None:
        current_user.avatar = data.avatar
    
    db.commit()
    db.refresh(current_user)
    return current_user
