
from fastapi import APIRouter, Depends
from backend.verify_token import verify_jwt_token

router = APIRouter()

@router.get("/secure-data")
def get_secure_data(user=Depends(verify_jwt_token)):
    return {
        "message": "Gizli API erişimi başarılı.",
        "user": user
    }
