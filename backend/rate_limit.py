from fastapi import APIRouter, Request, HTTPException
import time

router = APIRouter()
ip_access = {}

@router.middleware("http")
async def rate_limiter(request: Request, call_next):
    ip = request.client.host
    now = time.time()

    if ip not in ip_access:
        ip_access[ip] = []
    ip_access[ip] = [t for t in ip_access[ip] if now - t < 60]

    if len(ip_access[ip]) >= 20:
        raise HTTPException(status_code=429, detail="Çok fazla istek: Lütfen bekleyin.")

    ip_access[ip].append(now)
    response = await call_next(request)
    return response
