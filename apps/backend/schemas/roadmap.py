from typing import List, Optional, Any
from pydantic import BaseModel, field_validator

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
    is_public: bool = False
    is_verified: bool = False
    tags: List[str] = []
    owner_username: Optional[str] = None
    owner_avatar: Optional[str] = None
    owner_firebase_uid: Optional[str] = None
    nodes: List[NodeSchema] = []
    edges: List[EdgeSchema] = []

    @field_validator('is_public', 'is_verified', mode='before')
    @classmethod
    def validate_bool(cls, v):
        return v if v is not None else False

    @field_validator('tags', mode='before')
    @classmethod
    def validate_tags(cls, v):
        return v if v is not None else []

    class Config:
        from_attributes = True

class RoadmapShareRequest(BaseModel):
    is_public: bool
    tags: List[str]
