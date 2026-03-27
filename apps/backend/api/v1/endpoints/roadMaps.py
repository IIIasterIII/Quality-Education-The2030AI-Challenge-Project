from db.models import User, RoadMap, NodeModel, EdgeModel
from fastapi import APIRouter, Depends, Form, File, UploadFile, HTTPException
from dotenv import load_dotenv
from utils.utils import get_current_user, get_db
from sqlalchemy.orm import Session
from typing import Optional, List
from utils.s3 import upload_file_to_s3
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
        # Simple JSON search for tag
        query = query.filter(RoadMap.tags.contains([tag]))
        
    roadmaps = query.order_by(RoadMap.id.desc()).offset(offset).limit(limit).all()
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
    if current_user.id != roadmap.user_id:
        raise HTTPException(status_code=403, detail="You are not authorized to view this roadmap")
    nodes = db.query(NodeModel).filter(NodeModel.roadmap_id == id).all()
    edges = db.query(EdgeModel).filter(EdgeModel.roadmap_id == id).all()
    return {"nodes": nodes, "edges": edges}

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
    # In a real app, check if current_user is admin
    roadmap = db.query(RoadMap).filter(RoadMap.id == id).first()
    if not roadmap:
        raise HTTPException(status_code=404, detail="Roadmap not found")
        
    roadmap.is_verified = is_verified
    db.commit()
    db.refresh(roadmap)
    return roadmap
