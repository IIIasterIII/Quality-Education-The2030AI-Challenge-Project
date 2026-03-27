from pydantic import BaseModel
from typing import Optional

class YouTubeLink(BaseModel):
    url: str

class IngestionResult(BaseModel):
    content: str
    source: str
    video_id: Optional[str] = None
