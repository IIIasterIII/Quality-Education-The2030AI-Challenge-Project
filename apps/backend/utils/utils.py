from db.session import get_db
from fastapi import Depends, HTTPException, Request
from sqlalchemy.orm import Session
from schemas.user import UserTokenSchema
from db.models import User
from jose import jwt
import os
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials
import json

load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

def get_current_user(request: Request, db: Session = Depends(get_db)) -> User:
    token = request.cookies.get("session_token")
    if not token:
        raise HTTPException(status_code=401, detail="No session token provided")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        firebase_uid = payload.get("firebase_uid")
        user = db.query(User).filter(User.firebase_uid == firebase_uid).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid session token: {str(e)}")

def init_firebase():
    cert_json_str = os.getenv("FIREBASE_SERVICE_ACCOUNT_JSON")
    if not cert_json_str:
        return
    try:
        cert_dict = json.loads(cert_json_str, strict=False)
        if "private_key" in cert_dict:
            cert_dict["private_key"] = cert_dict["private_key"].replace("\\n", "\n")
        cred = credentials.Certificate(cert_dict)
        if not firebase_admin._apps:
            firebase_admin.initialize_app(cred)
    except Exception as e:
        print(f"CRITICAL ERROR: {e}")

def extract_image_urls(content):
    urls = []
    if isinstance(content, dict):
        if content.get("type") == "image":
            src = content.get("attrs", {}).get("src")
            if src: urls.append(src)
        for val in content.values():
            urls.extend(extract_image_urls(val))
    elif isinstance(content, list):
        for item in content:
            urls.extend(extract_image_urls(item))
    return list(set(urls))