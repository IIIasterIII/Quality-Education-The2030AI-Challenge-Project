from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List, Any

class Note(BaseModel):
    id: int
    title: str
    preview: Optional[str] = None
    notesCount: int
    updatedAt: datetime
    accentColor: str
    type: str
    content: Optional[Any] = None
    complexity: str
    time_spent: int
    last_opened: Optional[datetime] = None
    summary: Optional[str] = Field(None, max_length=200)
    
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
    complexity: Optional[str] = None
    summary: Optional[str] = Field(None, max_length=200)

class SubNote(BaseModel):
    id: int
    title: str
    content: Optional[Any] = None
    summary: Optional[str] = Field(None, max_length=200)
    
    class Config:
        from_attributes = True

class SubNoteToCreate(BaseModel):
    title: str
    content: Optional[Any] = None
    summary: Optional[str] = Field(None, max_length=200)

class SubNoteToEdit(BaseModel):
    title: Optional[str] = None
    content: Optional[Any] = None
    summary: Optional[str] = Field(None, max_length=200)

class GraphLink(BaseModel):
    source: int
    target: int
    type: str

class GraphDataSubNote(BaseModel):
    id: int
    title: str

class GraphNote(BaseModel):
    id: int
    title: str
    preview: Optional[str] = None
    notesCount: int
    updatedAt: datetime
    accentColor: str
    type: str
    complexity: str
    time_spent: int
    last_opened: Optional[datetime] = None
    summary: Optional[str] = None
    subNotes: List[GraphDataSubNote]
    links: List[GraphLink]
    
    class Config:
        from_attributes = True

class NoteStatsUpdate(BaseModel):
    time_spent: Optional[int] = None
    last_opened: Optional[datetime] = None
    complexity: Optional[str] = None