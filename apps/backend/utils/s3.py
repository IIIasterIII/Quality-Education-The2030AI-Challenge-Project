import os
from fastapi import UploadFile
from uuid import uuid4
import aioboto3

AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_BUCKET_NAME = os.getenv("AWS_BUCKET_NAME")
AWS_REGION = os.getenv("AWS_REGION")

async def upload_file_to_s3(file: UploadFile, folder: str = "roadmaps") -> str:
    file_extension = file.filename.split(".")[-1]
    file_name = f"{folder}/{uuid4()}.{file_extension}"

    session = aioboto3.Session()
    async with session.client(
        "s3",
        region_name=AWS_REGION,
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    ) as s3:
        file_content = await file.read()
        await s3.put_object(
            Bucket=AWS_BUCKET_NAME,
            Key=file_name,
            Body=file_content,
            ContentType=file.content_type,
        )
        return f"https://{AWS_BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/{file_name}"