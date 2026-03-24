from typing import List, Optional, Any
from pydantic import BaseModel
from datetime import datetime

class Note(BaseModel):
    id: int
    title: str
    preview: Optional[str] = None
    notesCount: int
    updatedAt: datetime
    accentColor: str
    type: str
    content: Optional[Any] = None
    
    class Config:
        from_attributes = True

class NoteToCreate(BaseModel):
    title: str
    preview: Optional[str] = None
    accentColor: str
    type: str
    content: Optional[Any] = None

class NoteToEdit(BaseModel):
    title: Optional[str] = None
    preview: Optional[str] = None
    accentColor: Optional[str] = None
    content: Optional[Any] = None

class SubNote(BaseModel):
    id: int
    title: str
    content: Optional[Any] = None
    
    class Config:
        from_attributes = True

class SubNoteToCreate(BaseModel):
    title: str
    content: Optional[Any] = None

class SubNoteToEdit(BaseModel):
    title: Optional[str] = None
    content: Optional[Any] = None