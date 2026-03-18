from db.session import get_db
from fastapi import Depends, HTTPException, Request
from sqlalchemy.orm import Session
from schemas.user import UserTokenSchema
from jose import jwt
import os
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials
import json

load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

def get_current_user(request: Request, db: Session = Depends(get_db)) -> UserTokenSchema:
    token = request.cookies.get("session_token")
    if not token:
        raise HTTPException(status_code=401, detail="No session token provided")
    try:
        user = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return user
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid session token: {str(e)}")

def init_firebase():
    cert_json_str = os.getenv("FIREBASE_SERVICE_ACCOUNT_JSON")
    if not cert_json_str:
        print("WARNING: FIREBASE_SERVICE_ACCOUNT_JSON is not set. Firebase Auth will not work.")
        return
    try:
        if "\\n" in cert_json_str:
            print("WARNING: Found escaped newlines (\\n). Fixing...")
        cert_dict = json.loads(cert_json_str, strict=False)
        if "private_key" in cert_dict:
            cert_dict["private_key"] = cert_dict["private_key"].replace("\\n", "\n")
        cred = credentials.Certificate(cert_dict)
        if not firebase_admin._apps:
            firebase_admin.initialize_app(cred)
        print("Firebase Admin SDK successfully initialized")
    except Exception as e:
        print(f"CRITICAL ERROR: {e}")