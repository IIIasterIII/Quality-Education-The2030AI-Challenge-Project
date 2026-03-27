from db.models import User, RoadMap, NodeModel, EdgeModel
from fastapi import APIRouter, Depends, Form, File, UploadFile, HTTPException
from dotenv import load_dotenv
from utils.utils import get_current_user, get_db
from sqlalchemy.orm import Session, joinedload
from typing import Optional, List
from utils.s3 import upload_file_to_s3, delete_file_from_s3, copy_s3_file
from schemas.roadmap import SaveRoadmapRequest, RoadmapResponse, RoadmapShareRequest

load_dotenv()
router = APIRouter(prefix="/roadmap", tags=["roadmap"])

@router.post("/create")
async def create_roadmap(
    title: str = Form(...),
    description: Optional[str] = Form(None),
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    image_url = await upload_file_to_s3(image)
    new_roadmap = RoadMap(title=title, description=description, image_url=image_url, user_id=current_user.id)
    db.add(new_roadmap)
    db.commit()
    db.refresh(new_roadmap)
    return new_roadmap

@router.get("/", response_model=List[RoadmapResponse])
async def pagination_roadmaps(
    page: int = 1, limit: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    offset = (page - 1) * limit
    roadmaps = db.query(RoadMap).filter(RoadMap.user_id == current_user.id).offset(offset).limit(limit).all()
    return roadmaps

@router.get("/community", response_model=List[RoadmapResponse])
async def get_community_roadmaps(
    page: int = 1, limit: int = 20,
    tag: Optional[str] = None,
    db: Session = Depends(get_db)
):
    offset = (page - 1) * limit
    query = db.query(RoadMap).filter(RoadMap.is_public == True, RoadMap.is_verified == True)
    if tag:
        query = query.filter(RoadMap.tags.contains([tag]))
    roadmaps = query.options(joinedload(RoadMap.user)).order_by(RoadMap.id.desc()).offset(offset).limit(limit).all()
    return roadmaps

@router.get("/{id}", response_model=RoadmapResponse)
async def get_roadmap(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    roadmap = db.query(RoadMap).filter(RoadMap.id == id).first()
    if not roadmap:
        raise HTTPException(status_code=404, detail="Roadmap not found")
    if roadmap.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You are not authorized to view this roadmap")
    return roadmap

@router.get("/{id}/all")
async def get_all_roadmap_data(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    roadmap = db.query(RoadMap).filter(RoadMap.id == id).first()
    if not roadmap:
        raise HTTPException(status_code=404, detail="Roadmap not found")
    if roadmap.is_public == False and current_user.id != roadmap.user_id:
        raise HTTPException(status_code=403, detail="You are not authorized to view this roadmap")
    nodes = db.query(NodeModel).filter(NodeModel.roadmap_id == id).all()
    edges = db.query(EdgeModel).filter(EdgeModel.roadmap_id == id).all()
    return {"nodes": nodes, "edges": edges, "user_id": roadmap.user_id}

@router.post("/{id}/save")
async def save_roadmap(
    id: int,
    request: SaveRoadmapRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    roadmap = db.query(RoadMap).filter(RoadMap.id == id).first()
    if not roadmap:
        raise HTTPException(status_code=404, detail="Roadmap not found")
    
    if roadmap.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You are not authorized to edit this roadmap")

    try:
        db.query(NodeModel).filter(NodeModel.roadmap_id == id).delete()
        db.query(EdgeModel).filter(EdgeModel.roadmap_id == id).delete()
        db.flush() 

        for node in request.nodes:
            new_node = NodeModel(
                id=node.id,
                roadmap_id=id,
                type=node.type,
                position=node.position,
                data=node.data
            )
            db.add(new_node)
        
        for edge in request.edges:
            new_edge = EdgeModel(
                id=edge.id,
                roadmap_id=id,
                source=edge.source,
                target=edge.target,
                sourceHandle=edge.sourceHandle,
                targetHandle=edge.targetHandle
            )
            db.add(new_edge)
        
        db.commit()
    except Exception as e:
        db.rollback()
        print(f"Error saving roadmap: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to save roadmap: {str(e)}")
    db.refresh(roadmap)
    return {"message": "Roadmap saved successfully", "id": roadmap.id}
    
@router.patch("/{id}/share", response_model=RoadmapResponse)
async def share_roadmap(
    id: int,
    request: RoadmapShareRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    roadmap = db.query(RoadMap).filter(RoadMap.id == id).first()
    if not roadmap:
        raise HTTPException(status_code=404, detail="Roadmap not found")
    if roadmap.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You are not authorized to share this roadmap")
    roadmap.is_public = request.is_public
    roadmap.tags = request.tags
    db.commit()
    db.refresh(roadmap)
    return roadmap

@router.patch("/{id}/verify", response_model=RoadmapResponse)
async def verify_roadmap(
    id: int,
    is_verified: bool = True,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    roadmap = db.query(RoadMap).filter(RoadMap.id == id).first()
    if not roadmap:
        raise HTTPException(status_code=404, detail="Roadmap not found")
    roadmap.is_verified = is_verified
    db.commit()
    db.refresh(roadmap)
    return roadmap

@router.post("/{id}/copy")
async def copy_roadmap(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    original_roadmap = db.query(RoadMap).filter(RoadMap.id == id).first()
    if not original_roadmap:
        raise HTTPException(status_code=404, detail="Roadmap not found")
    new_image_url = None
    if original_roadmap.image_url:
        new_image_url = await copy_s3_file(original_roadmap.image_url)
    new_roadmap = RoadMap(
        title=f"{original_roadmap.title} (Copy)",
        description=original_roadmap.description,
        image_url=new_image_url or original_roadmap.image_url,
        user_id=current_user.id,
        is_public=False,
        is_verified=False,
        tags=original_roadmap.tags
    )
    db.add(new_roadmap)
    db.flush()
    nodes = db.query(NodeModel).filter(NodeModel.roadmap_id == id).all()
    for node in nodes:
        new_node = NodeModel(
            id=node.id,
            roadmap_id=new_roadmap.id,
            type=node.type,
            position=node.position,
            data=node.data
        )
        db.add(new_node)
        
    # Copy edges
    edges = db.query(EdgeModel).filter(EdgeModel.roadmap_id == id).all()
    for edge in edges:
        new_edge = EdgeModel(
            id=edge.id,
            roadmap_id=new_roadmap.id,
            source=edge.source,
            target=edge.target,
            sourceHandle=edge.sourceHandle,
            targetHandle=edge.targetHandle
        )
        db.add(new_edge)
        
    db.commit()
    return {"message": "Roadmap copied", "new_id": new_roadmap.id}



@router.patch("/{id}/update", response_model=RoadmapResponse)
async def update_roadmap_metadata(
    id: int,
    title: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    roadmap = db.query(RoadMap).filter(RoadMap.id == id, RoadMap.user_id == current_user.id).first()
    if not roadmap:
        raise HTTPException(status_code=404, detail="Roadmap not found or not owner")
        
    if title:
        roadmap.title = title
    if description is not None:
        roadmap.description = description
        
    if image:
        if roadmap.image_url:
            await delete_file_from_s3(roadmap.image_url)
        new_url = await upload_file_to_s3(image)
        roadmap.image_url = new_url
    db.commit()
    db.refresh(roadmap)
    return roadmap

@router.delete("/{id}")
async def delete_roadmap(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    roadmap = db.query(RoadMap).filter(RoadMap.id == id, RoadMap.user_id == current_user.id).first()
    if not roadmap:
        raise HTTPException(status_code=404, detail="Roadmap not found or not owner")
    if roadmap.image_url:
        await delete_file_from_s3(roadmap.image_url)
    db.delete(roadmap)
    db.commit()
    return {"message": "Roadmap deleted successfully"}
