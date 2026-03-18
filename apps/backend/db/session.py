from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine, AsyncSession
import os
from dotenv import load_dotenv
from .models import *

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_async_engine(DATABASE_URL, echo=True)

AsyncSessionLocal = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)

async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

async def get_db():
    async with AsyncSessionLocal() as db:
        try: 
            yield db
        finally: 
            await db.close()