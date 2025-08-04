from fastapi import Request, HTTPException

def require_token(request: Request):
    token = request.headers.get("Authorization")
    if not token or token != "Bearer demo-token":
        raise HTTPException(status_code=403, detail="Geçersiz veya eksik token.")
