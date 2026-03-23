from pydantic import BaseModel
from typing import List, Optional, Any
from datetime import datetime

class Note(BaseModel):
    id: int
    title: str
    preview: Optional[str] = None
    notesCount: int
    updatedAt: datetime
    accentColor: str
    type: str
    
    class Config:
        from_attributes = True

class NoteToCreate(BaseModel):
    title: str
    preview: Optional[str] = None
    accentColor: str
    type: str

class NoteToEdit(BaseModel):
    title: Optional[str] = None
    preview: Optional[str] = None
    accentColor: Optional[str]

class SubNote(BaseModel):
    id: int
    title: str
    
    class Config:
        from_attributes = True

class SubNoteToCreate(BaseModel):
    title: str