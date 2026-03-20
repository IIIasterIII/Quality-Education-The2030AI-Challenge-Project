from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    firebase_uid = Column(String(100), unique=True, nullable=False) 
    username = Column(String(100))
    email = Column(String(100))
    avatar = Column(String(255), nullable=True)
    profile = relationship("Profile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    roadmaps = relationship("RoadMap", back_populates="user", cascade="all, delete-orphan")

class Profile(Base):
    __tablename__ = 'profiles' 
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete="CASCADE"), unique=True)
    saved = Column(Boolean, default=False)
    user = relationship("User", back_populates="profile")    

class RoadMap(Base):
    __tablename__ = 'roadmaps'
    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    description = Column(String(255), nullable=True)
    image_url = Column(String(255), nullable=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete="CASCADE"), nullable=False)
    user = relationship("User", back_populates="roadmaps")
    