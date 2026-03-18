from fastapi import APIRouter
from db.session import get_db
from db.models import User, Profile
from firebase_admin import auth
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, Response
from jose import jwt
import os
from dotenv import load_dotenv
from utils.utils import init_firebase

load_dotenv()
init_firebase()
router = APIRouter(prefix="/auth", tags=["auth"])
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

@router.post("/login")
def login(response: Response, payload: dict, db: Session = Depends(get_db)):
    id_token = payload.get("idToken")
    if not id_token:
        print("DEBUG: [Login] No ID Token in payload")
        raise HTTPException(status_code=400, detail="No ID Token provided")
    
    try:
        print(f"DEBUG: [Firebase] Starting verification...")
        decoded_token = auth.verify_id_token(id_token)
        uid = decoded_token['uid']
        print(f"DEBUG: [Firebase] Success! UID: {uid}")
    except Exception as e:
        print(f"❌ FIREBASE ERROR: {str(e)}")
        raise HTTPException(status_code=401, detail=f"Firebase timeout/error: {str(e)}")

    try:
        print(f"DEBUG: [DB] Searching for user {uid}...")
        user = db.query(User).filter(User.firebase_uid == uid).first()
        
        if not user:
            print(f"📝 [DB] Registering new user...")
            user = User(
                firebase_uid=uid,
                username=decoded_token.get('name', 'Anonymous'),
                email=decoded_token.get('email'),
                avatar=decoded_token.get('picture'),
            )
            user.profile = Profile()
            db.add(user)
        else:
            print(f"👋 [DB] User found, updating login...")
            if not user.profile:
                user.profile = Profile()
        
        db.commit()
        db.refresh(user)
        print(f"DEBUG: [DB] Successfully saved.")
    except Exception as e:
        print(f"❌ DATABASE ERROR: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    try:
        user_data = {
            "uid": str(user.firebase_uid),
            "username": user.username or "Anonymous",
            "email": user.email,
        }
        
        token = jwt.encode(user_data, SECRET_KEY, algorithm=ALGORITHM)
        
        response.set_cookie(
            key="session_token",
            value=token,
            httponly=True,
            secure=True,     
            samesite="none", 
            max_age=604800,
            path="/"         
        )
        print("DEBUG: [Login] Success, cookie set")
        return {"status": "success", "user": user_data}
    except Exception as e:
        print(f"❌ JWT ERROR: {str(e)}")
        raise HTTPException(status_code=500, detail=f"JWT generation failed: {str(e)}")

@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(key="session_token", httponly=True, secure=False, samesite="lax", path="/")
    return {"status": "success"}