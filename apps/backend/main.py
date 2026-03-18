from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db.session import create_tables
from api.v1.endpoints.auth import router as auth_router
from utils.utils import init_firebase

app = FastAPI()
init_firebase()
create_tables()

app.include_router(auth_router)

origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)