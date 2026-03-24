from typing import List, Optional, Any
from pydantic import BaseModel

class NodeDataSchema(BaseModel):
    label: str
    description: Optional[str] = None
    isCompleted: bool = False
    customHandles: Optional[List[dict]] = None

class NodeSchema(BaseModel):
    id: str
    type: Optional[str] = "roadmap"
    position: dict
    data: dict

    class Config:
        extra = "allow"

class EdgeSchema(BaseModel):
    id: str
    source: str
    target: str
    sourceHandle: Optional[str] = None
    targetHandle: Optional[str] = None

    class Config:
        extra = "allow"

class SaveRoadmapRequest(BaseModel):
    nodes: List[NodeSchema]
    edges: List[EdgeSchema]

class RoadmapResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    image_url: Optional[str]
    nodes: List[NodeSchema] = []
    edges: List[EdgeSchema] = []

    class Config:
        from_attributes = True
