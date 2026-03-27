from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, JSON, Text, Float, DateTime, Table
from datetime import datetime, timezone
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

note_links = Table(
    "note_links",
    Base.metadata,
    Column("parent_id", Integer, ForeignKey("notes.id"), primary_key=True),
    Column("child_id", Integer, ForeignKey("notes.id"), primary_key=True)
)

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, autoincrement=True)
    firebase_uid = Column(String(100), unique=True, nullable=False) 
    username = Column(String(100))
    email = Column(String(100))
    avatar = Column(String(255), nullable=True)
    profile = relationship("Profile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    roadmaps = relationship("RoadMap", back_populates="user", cascade="all, delete-orphan")
    notes = relationship("Notes", back_populates="user", cascade="all, delete-orphan")

class Profile(Base):
    __tablename__ = 'profiles' 
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete="CASCADE"), unique=True)
    saved = Column(Boolean, default=False)
    user = relationship("User", back_populates="profile")    

style_default = {"stroke": "#71fd64ff", "strokeWidth": 2}
marker_default = {"type": "arrow", "color": "#71fd64ff"}

class RoadMap(Base):
    __tablename__ = 'roadmaps'
    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    description = Column(String(255), nullable=True)
    image_url = Column(String(255), nullable=True)
    animated = Column(Boolean, default=True)
    style = Column(JSON, default=style_default)
    markerEndStyle = Column(JSON, default=marker_default)
    user_id = Column(Integer, ForeignKey('users.id', ondelete="CASCADE"), nullable=False)
    is_public = Column(Boolean, default=False)
    is_verified = Column(Boolean, default=False)
    tags = Column(JSON, default=list)
    user = relationship("User", back_populates="roadmaps")
    nodes = relationship("NodeModel", back_populates="roadmap", cascade="all, delete-orphan")
    edges = relationship("EdgeModel", back_populates="roadmap", cascade="all, delete-orphan")

position_default = {"x": 200, "y": 200}

class NodeModel(Base):
    __tablename__ = "nodes"
    id = Column(String(255), primary_key=True)
    roadmap_id = Column(Integer, ForeignKey("roadmaps.id", ondelete="CASCADE"), primary_key=True)
    type = Column(String(50))
    position = Column(JSON, default=position_default)
    data = Column(JSON)
    roadmap = relationship("RoadMap", back_populates="nodes")

class EdgeModel(Base):
    __tablename__ = "edges"
    id = Column(String(255), primary_key=True)
    roadmap_id = Column(Integer, ForeignKey("roadmaps.id", ondelete="CASCADE"), primary_key=True)
    source = Column(String(255))
    target = Column(String(255))
    sourceHandle = Column(String(255), nullable=True)
    targetHandle = Column(String(255), nullable=True)
    roadmap = relationship("RoadMap", back_populates="edges")

class Notes(Base):
    __tablename__ = "notes"
    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    preview = Column(String(255), nullable=True)
    notesCount = Column(Integer, nullable=False, default=0)
    updatedAt = Column(DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    accentColor = Column(String(255), nullable=False)
    type = Column(String(50), nullable=False)
    content = Column(JSON, nullable=True)
    complexity = Column(String(50), nullable=False, default="beginner")
    time_spent = Column(Integer, nullable=False, default=0)
    last_opened = Column(DateTime(timezone=True), nullable=True)
    summary = Column(Text, nullable=True)

    user_id = Column(Integer, ForeignKey('users.id', ondelete="CASCADE"), nullable=False)
    user = relationship("User", back_populates="notes")
    related_notes = relationship(
        "Notes",
        secondary=note_links,
        primaryjoin=(id == note_links.c.parent_id),
        secondaryjoin=(id == note_links.c.child_id),
        backref="referenced_by"
    )
    subnotes = relationship("SubNotes", back_populates="parent_note", cascade="all, delete-orphan")

class SubNotes(Base):
    __tablename__ = "subNotes"
    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    content = Column(JSON, nullable=True)
    summary = Column(Text, nullable=True)
    note_id = Column(Integer, ForeignKey("notes.id", ondelete="CASCADE"), nullable=False)
    parent_note = relationship("Notes", back_populates="subnotes")
