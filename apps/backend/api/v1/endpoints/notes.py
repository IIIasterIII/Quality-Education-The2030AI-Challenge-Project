from fastapi import APIRouter, Depends, status, HTTPException, UploadFile, File
from schemas.notes import *
from db.models import User, Notes, SubNotes, note_links
from utils.utils import get_current_user, get_db, extract_image_urls
from utils.s3 import upload_file_to_s3, delete_file_from_s3
from sqlalchemy.orm import Session
from services.ai_service import generate_roadmap_content, generate_exercise_content, generate_note_summary, refine_note_content

router = APIRouter(prefix="/notes", tags=["notes"])

@router.get("/", response_model=list[Note])
def get_notes(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    notes = db.query(Notes).filter(Notes.user_id == current_user.id).all()
    if not notes:
        return []
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
    db.flush() 
    user_notes = db.query(Notes).filter(Notes.user_id == current_user.id, Notes.id != new_note.id).all()
    new_note.related_notes = user_notes
    for note in user_notes:
        if new_note not in note.related_notes:
            note.related_notes.append(new_note)
    db.commit()
    db.refresh(new_note)
    return new_note

@router.post("/{note_id}/generate-exercise")
async def generate_exercise(
    note_id: int,
    level: str = "foundational",
    type: str = "quiz",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    note = db.query(Notes).filter(Notes.id == note_id, Notes.user_id == current_user.id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    import json
    content_str = json.dumps(note.content, ensure_ascii=False) if note.content else note.title
    return await generate_exercise_content(content_str, level, type)

@router.post("/{note_id}/generate-summary")
async def generate_summary(
    note_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    note = db.query(Notes).filter(Notes.id == note_id, Notes.user_id == current_user.id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    import json
    content_str = json.dumps(note.content, ensure_ascii=False) if note.content else ""
    return await generate_note_summary(content_str)

@router.post("/generate-random-exercise")
async def generate_random_exercise(
    topic: str,
    level: str = "foundational",
    current_user: User = Depends(get_current_user)
):
    if len(topic.strip()) < 3:
        import json
        async def err_gen():
            yield json.dumps({"error": "insufficient_content"})
        return StreamingResponse(err_gen(), media_type="text/plain")
        
    return await generate_exercise_content(f"Topic: {topic}. Generate random high-quality challenging questions.", level, "quiz")

@router.post("/refine")
async def refine_note(content: str, current_user: User = Depends(get_current_user)):
    return await refine_note_content(content)

@router.delete('/', status_code=status.HTTP_204_NO_CONTENT)
async def delete_note(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    note = db.query(Notes).filter(Notes.id == id, Notes.user_id == current_user.id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    urls = extract_image_urls(note.content)
    for sub in note.subnotes:
        urls.extend(extract_image_urls(sub.content))
    for url in set(urls):
        await delete_file_from_s3(url)
    db.delete(note)
    db.commit()
    return

@router.patch('/', response_model=Note)
async def update_note(id: int, data: NoteToEdit, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    note = db.query(Notes).filter(Notes.id == id, Notes.user_id == current_user.id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    if data.title and db.query(Notes).filter(Notes.id != id, Notes.user_id == current_user.id, Notes.title == data.title).first():
        raise HTTPException(status_code=400, detail="Note with this title already exists")
    if data.content is not None:
        old_urls = set(extract_image_urls(note.content))
        new_urls = set(extract_image_urls(data.content))
        removed_urls = old_urls - new_urls
        for url in removed_urls:
            await delete_file_from_s3(url)
        note.content = data.content
    if data.title:
        note.title = data.title
    if data.preview:
        note.preview = data.preview
    if data.accentColor:
        note.accentColor = data.accentColor
    if data.complexity:
        note.complexity = data.complexity
    if data.summary:
        note.summary = data.summary
    db.commit()
    db.refresh(note)
    return note

@router.patch("/{id}/stats", response_model=Note)
async def update_note_stats(id: int, data: NoteStatsUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    note = db.query(Notes).filter(Notes.id == id, Notes.user_id == current_user.id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    if data.time_spent is not None:
        note.time_spent += data.time_spent
    if data.last_opened:
        note.last_opened = data.last_opened
    if data.complexity:
        note.complexity = data.complexity
    db.commit()
    db.refresh(note)
    return note

from sqlalchemy.orm import selectinload

@router.get("/graph", response_model=list[GraphNote])
async def get_graph_data(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    notes = (
        db.query(Notes)
        .filter(Notes.user_id == current_user.id)
        .options(selectinload(Notes.subnotes), selectinload(Notes.related_notes))
        .all()
    )
    result = []
    for note in notes:
        links = [{"source": note.id, "target": sub.id, "type": "sub"} for sub in note.subnotes]
        note_to_note_links = [{"source": note.id, "target": related.id, "type": "main"} for related in note.related_notes]
        all_links = links + note_to_note_links
        data = {
            "id": note.id,
            "title": note.title,
            "preview": note.preview,
            "notesCount": note.notesCount,
            "updatedAt": note.updatedAt,
            "accentColor": note.accentColor,
            "type": note.type,
            "complexity": note.complexity,
            "time_spent": note.time_spent,
            "last_opened": note.last_opened,
            "summary": note.summary,
            "subNotes": note.subnotes,
            "links": all_links,
        }
        result.append(data)
    return result

@router.get("/{id}", response_model=Note)
def get_note(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    note = db.query(Notes).filter(Notes.id == id, Notes.user_id == current_user.id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note

@router.post("/upload")
async def upload_note_image( file: UploadFile = File(...), current_user: User = Depends(get_current_user) ):
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
    if db.query(SubNotes).filter(SubNotes.note_id == page_id, SubNotes.title == data.title).first():
        raise HTTPException(status_code=400, detail="Subnote with this title already exists")
    new_subnote = SubNotes(note_id=page_id, title=data.title, content=data.content, summary=data.summary)
    note.notesCount += 1
    db.add(new_subnote)
    db.commit()
    db.refresh(new_subnote)
    return new_subnote

@router.delete("/{page_id}/subnotes/{subnote_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_subnote(
    page_id: int,
    subnote_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    note = db.query(Notes).filter(Notes.id == page_id, Notes.user_id == current_user.id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    subnote = db.query(SubNotes).filter(SubNotes.id == subnote_id, SubNotes.note_id == page_id).first()
    if not subnote:
        raise HTTPException(status_code=404, detail="Subnote not found")
    urls = extract_image_urls(subnote.content)
    for url in urls:
        await delete_file_from_s3(url)
    note.notesCount -= 1
    db.delete(subnote)
    db.commit()
    return

@router.get("/{page_id}/subnotes", response_model=list[SubNote])
def get_subnotes(page_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    note = db.query(Notes).filter(Notes.id == page_id, Notes.user_id == current_user.id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    subnotes = db.query(SubNotes).filter(SubNotes.note_id == page_id).all()
    return subnotes

@router.get("/{page_id}/subnotes/{subnote_id}", response_model=SubNote)
def get_subnote(page_id: int, subnote_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    note = db.query(Notes).filter(Notes.id == page_id, Notes.user_id == current_user.id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    subnote = db.query(SubNotes).filter(SubNotes.id == subnote_id, SubNotes.note_id == page_id).first()
    if not subnote:
        raise HTTPException(status_code=404, detail="Subnote not found")
    return subnote

@router.patch("/{page_id}/subnotes/{subnote_id}", response_model=SubNote)
async def update_subnote(page_id: int, subnote_id: int, data: SubNoteToEdit, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    note = db.query(Notes).filter(Notes.id == page_id, Notes.user_id == current_user.id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    subnote = db.query(SubNotes).filter(SubNotes.id == subnote_id, SubNotes.note_id == page_id).first()
    if not subnote:
        raise HTTPException(status_code=404, detail="Subnote not found")
    if data.content is not None:
        old_urls = set(extract_image_urls(subnote.content))
        new_urls = set(extract_image_urls(data.content))
        removed_urls = old_urls - new_urls
        for url in removed_urls:
            await delete_file_from_s3(url)
        subnote.content = data.content
    if data.title:
        subnote.title = data.title
    if data.summary is not None:
        subnote.summary = data.summary
    db.commit()
    db.refresh(subnote)
    return subnote

@router.post("/{page_id}/subnotes/{subnote_id}/generate-summary")
async def generate_subnote_summary(
    page_id: int,
    subnote_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    note = db.query(Notes).filter(Notes.id == page_id, Notes.user_id == current_user.id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    subnote = db.query(SubNotes).filter(SubNotes.id == subnote_id, SubNotes.note_id == page_id).first()
    if not subnote:
        raise HTTPException(status_code=404, detail="Subnote not found")
    
    import json
    content_str = json.dumps(subnote.content, ensure_ascii=False) if subnote.content else ""
    return await generate_note_summary(content_str)