from fastapi import APIRouter, HTTPException, status, Form
from db.session import get_db
from db.models import User, Profile
from firebase_admin import auth
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, Response
from jose import jwt
from dotenv import load_dotenv
from utils.utils import init_firebase, get_current_user
from fastapi.responses import RedirectResponse
from services.ai_service import generate_roadmap_content
import os

load_dotenv()
init_firebase()
router = APIRouter(prefix="/auth", tags=["auth"])
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

@router.post("/login")
def login(response: Response, payload: dict, db: Session = Depends(get_db)):
    id_token = payload.get("idToken")
    if not id_token:
        print("No ID Token in payload")
        raise HTTPException(status_code=400, detail="No ID Token provided")
    
    try:
        print(f"Starting verification...")
        decoded_token = auth.verify_id_token(id_token)
        uid = decoded_token['uid']
        print(f"Success! UID: {uid}")
    except Exception as e:
        print(f"FIREBASE ERROR: {str(e)}")
        raise HTTPException(status_code=401, detail=f"Firebase timeout/error: {str(e)}")

    try:
        print(f"Searching for user {uid}...")
        user = db.query(User).filter(User.firebase_uid == uid).first()
        
        if not user:
            print(f"Registering new user...")
            user = User(
                firebase_uid=uid,
                username=decoded_token.get('name', 'Anonymous'),
                email=decoded_token.get('email'),
                avatar=decoded_token.get('picture'),
            )
            user.profile = Profile()
            db.add(user)
        else:
            print(f"User found, updating login...")
            if not user.profile:
                user.profile = Profile()
        
        db.commit()
        db.refresh(user)
        print(f"Successfully saved.")
    except Exception as e:
        print(f"DATABASE ERROR: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    try:
        user_data = {
            "id": user.id,
            "firebase_uid": user.firebase_uid,
            "username": user.username,
            "avatar": user.avatar,
            "email": user.email,
        }
        
        token = jwt.encode(user_data, SECRET_KEY, algorithm=ALGORITHM)
        
        response.set_cookie(
            key="session_token",
            value=token,
            httponly=True,
            secure=False, # Not for production
            samesite="lax", 
            max_age=5*60*60,
            path="/"         
        )
        print("Success, cookie set")
        return user_data
    except Exception as e:
        print(f"JWT ERROR: {str(e)}")
        raise HTTPException(status_code=500, detail=f"JWT generation failed: {str(e)}")

@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(key="session_token", httponly=True, secure=False, samesite="lax", path="/")
    return {"status": "success"}

@router.get("/me")
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user

from pydantic import BaseModel
from typing import Optional, List

class GenerateRoadmapRequest(BaseModel):
    topic: str
    nodes: Optional[List[dict]] = None
    edges: Optional[List[dict]] = None

@router.post("/generate")
async def generate_roadmap(request: GenerateRoadmapRequest):
    content = await generate_roadmap_content(
        topic=request.topic,
        existing_nodes=request.nodes,
        existing_edges=request.edges
    )
    return content