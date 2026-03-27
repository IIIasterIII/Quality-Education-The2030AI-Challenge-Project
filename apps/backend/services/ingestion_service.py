import os
import fitz
from youtube_transcript_api import YouTubeTranscriptApi
import re

def extract_youtube_id(url: str) -> str:
    regex = r"(?:v=|\/)([0-9A-Za-z_-]{11}).*"
    match = re.search(regex, url)
    return match.group(1) if match else url

def get_youtube_transcript(video_id: str) -> str:
    try:
        transcript_list = YouTubeTranscriptApi.get_transcript(video_id, languages=['en'])
        return " ".join([t['text'] for t in transcript_list])
    except Exception as e:
        try:
           transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
           try:
               transcript = transcript_list.find_transcript(['en'])
           except:
               transcript = transcript_list.find_generated_transcript(['en'])
           
           return " ".join([t['text'] for t in transcript.fetch()])
        except Exception as inner_e:
           raise Exception(f"YouTube Transcription Failed: {str(inner_e)}")

def process_pdf(file_path: str) -> str:
    try:
        doc = fitz.open(file_path)
        text = ""
        for page in doc:
            text += page.get_text()
        doc.close()
        return text
    except Exception as e:
        raise Exception(f"PDF Processing Failed: {str(e)}")
