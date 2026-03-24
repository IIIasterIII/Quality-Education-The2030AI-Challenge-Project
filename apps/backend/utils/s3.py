from fastapi import UploadFile
from uuid import uuid4
import aioboto3
import os

AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_S3_DOMEN = os.getenv("AWS_S3_DOMEN", "").rstrip("/")
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_BUCKET_NAME = os.getenv("AWS_BUCKET_NAME")
AWS_REGION = os.getenv("AWS_REGION")
session = aioboto3.Session()

async def upload_file_to_s3(file: UploadFile, folder: str = "roadmaps") -> str:
    file_ext = os.path.splitext(file.filename)[1] if file.filename else ".jpg"
    file_key = f"{folder}/{uuid4()}{file_ext}"
    async with session.client(
        "s3",
        region_name=AWS_REGION,
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    ) as s3:
        file_content = await file.read()
        await s3.put_object(
            Bucket=AWS_BUCKET_NAME,
            Key=file_key,
            Body=file_content,
            ContentType=file.content_type,
        )
        return f"{AWS_S3_DOMEN}/{file_key}"

async def delete_file_from_s3(url: str):
    if not url or AWS_S3_DOMEN not in url: return
    file_key = url.replace(f"{AWS_S3_DOMEN}/", "")
    async with session.client(
        "s3",
        region_name=AWS_REGION,
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    ) as s3:
        try:
            await s3.delete_object(Bucket=AWS_BUCKET_NAME, Key=file_key)
        except Exception as e:
            print(f"S3 Delete Error: {e}")