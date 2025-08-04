
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
import datetime

router = APIRouter()
security = HTTPBearer()
SECRET_KEY = "supersecretkey"
ALGORITHM = "HS256"

@router.post("/logout")
def logout(credentials: HTTPAuthorizationCredentials = Depends(security)):
    # Statik JWT sisteminde logout sadece frontend'de token'ı silmektir
    return {"message": "Çıkış başarılı, token artık kullanılmamalı."}

@router.post("/token/refresh")
def refresh_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        new_payload = {
            "sub": payload["sub"],
            "role": payload.get("role", "user"),
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        }
        new_token = jwt.encode(new_payload, SECRET_KEY, algorithm=ALGORITHM)
        return {"token": new_token}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token süresi dolmuş, yeniden giriş yapın.")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=403, detail="Geçersiz token")
