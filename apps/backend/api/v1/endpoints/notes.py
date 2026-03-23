from fastapi import APIRouter, Depends, status, HTTPException, UploadFile, File
from schemas.notes import *
from db.models import User, Notes, SubNotes
from utils.utils import get_current_user, get_db
from utils.s3 import upload_file_to_s3
from sqlalchemy.orm import Session

router = APIRouter(prefix="/notes", tags=["notes"])

@router.get("/", response_model=list[Note])
def get_notes(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    notes = db.query(Notes).filter(Notes.user_id == current_user.id).all()
    return notes

@router.post("/", response_model=Note)
def create_note(data: NoteToCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if db.query(Notes).filter(Notes.user_id == current_user.id, Notes.title == data.title).first():
        raise HTTPException(status_code=400, detail="Note with this title already exists")
    new_note = Notes(
        user_id=current_user.id,
        title=data.title,
        preview=data.preview,
        accentColor=data.accentColor,
        type=data.type
    )
    db.add(new_note)
    db.commit()
    db.refresh(new_note)
    return new_note

@router.delete('/', status_code=status.HTTP_204_NO_CONTENT)
def delete_note(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    note = db.query(Notes).filter(Notes.id == id, Notes.user_id == current_user.id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    db.delete(note)
    db.commit()
    return

@router.patch('/', response_model=Note)
def update_note(id: int, data: NoteToEdit, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    note = db.query(Notes).filter(Notes.id == id, Notes.user_id == current_user.id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    if db.query(Notes).filter(Notes.id != id, Notes.user_id == current_user.id, Notes.title == data.title).first():
        raise HTTPException(status_code=400, detail="Note with this title already exists")
    if data.title:
        note.title = data.title
    if data.preview:
        note.preview = data.preview
    if data.accentColor:
        note.accentColor = data.accentColor
    db.commit()
    db.refresh(note)
    return note

@router.post("/upload")
async def upload_note_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    url = await upload_file_to_s3(file, folder="notes")
    return {"url": url}

@router.post("/{page_id}/subnotes", response_model=SubNote)
def create_subnote(
    page_id: int,
    data: SubNoteToCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    note = db.query(Notes).filter(Notes.id == page_id, Notes.user_id == current_user.id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    new_subnote = SubNotes( note_id=page_id, title=data.title )
    db.add(new_subnote)
    db.commit()
    db.refresh(new_subnote)
    return new_subnote

@router.get("/{page_id}/subnotes", response_model=list[SubNote])
def get_subnotes(page_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    note = db.query(Notes).filter(Notes.id == page_id, Notes.user_id == current_user.id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    subnotes = db.query(SubNotes).filter(SubNotes.note_id == page_id).all()
    return subnotes