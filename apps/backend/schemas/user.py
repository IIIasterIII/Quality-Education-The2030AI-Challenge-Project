from pydantic import BaseModel, EmailStr, Field, HttpUrl
from datetime import datetime, timedelta, timezone
from typing import Optional

class UserTokenSchema(BaseModel):
    uid: str
    username: str = "Anonymous"
    email: EmailStr
    photo: Optional[str] = None
    exp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc) + timedelta(days=7))

    class Config:
        from_attributes = True

class RoadMapCreateSchema(BaseModel):
    title: str
    description: Optional[str] = None
    image: str