import redis
import os
from dotenv import load_dotenv

load_dotenv()

REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = os.getenv("REDIS_PORT", 6379)
REDIS_PASSWORD = os.getenv("REDIS_PASSWORD", None)

print(f"Connecting to Redis: {REDIS_HOST}:{REDIS_PORT}")

redis_client = redis.StrictRedis(
    host=REDIS_HOST,
    port=REDIS_PORT,
    password=REDIS_PASSWORD,
    decode_responses=True
)

def ping_redis():
    try:
        return redis_client.ping()
    except Exception as e:
        print(f"Redis Connection Error: {e}")
        return False
