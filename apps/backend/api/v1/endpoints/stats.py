from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from db.session import get_db
from db.models import User, NodeModel, Notes, RoadMap
import time

router = APIRouter(prefix="/v1/stats", tags=["stats"])
cache = { "data": None, "last_updated": 0 }
CACHE_EXPIRE = 3600

@router.get("/")
def get_platform_stats(db: Session = Depends(get_db)):
    current_time = time.time()
    if cache["data"] and (current_time - cache["last_updated"] < CACHE_EXPIRE):
        return cache["data"]
    total_users = db.query(func.count(User.id)).scalar()
    total_nodes = db.query(func.count(NodeModel.id)).scalar()
    total_notes = db.query(func.count(Notes.id)).scalar()
    verified_proofs = db.query(func.count(RoadMap.id)).filter(RoadMap.is_verified == True).scalar()
    
    data = {
        "nodes": total_nodes,
        "proofs": verified_proofs,
        "users": total_users,
    }
    
    cache["data"] = data
    cache["last_updated"] = current_time
    
    return data
