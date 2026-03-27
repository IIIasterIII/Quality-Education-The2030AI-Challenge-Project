from fastapi import APIRouter, UploadFile, File, HTTPException
from services.ingestion_service import extract_youtube_id, get_youtube_transcript, process_pdf
from schemas.ingestion import YouTubeLink, IngestionResult
import shutil
import os
import tempfile
import re

router = APIRouter(prefix="/ingestion", tags=["ingestion"])

@router.post("/youtube", response_model=IngestionResult)
async def process_youtube(data: YouTubeLink):
    regex = r"(?:v=|\/)([0-9A-Za-z_-]{11}).*"
    match = re.search(regex, data.url)
    video_id = match.group(1) if match else data.url
    
    if len(video_id) != 11:
         raise HTTPException(status_code=400, detail="Invalid YouTube Video ID format")
    
    try:
        text = get_youtube_transcript(video_id)
        return {
            "content": text, 
            "source": "YouTube", 
            "video_id": video_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/pdf", response_model=IngestionResult)
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="File must be a PDF")
    
    tmp_path = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            shutil.copyfileobj(file.file, tmp)
            tmp_path = tmp.name
        text = process_pdf(tmp_path)
        os.unlink(tmp_path)
        return { "content": text, "source": f"PDF: {file.filename}" }
    except Exception as e:
        if tmp_path and os.path.exists(tmp_path):
            os.unlink(tmp_path)
        raise HTTPException(status_code=500, detail=str(e))
