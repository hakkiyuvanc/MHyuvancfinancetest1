__package__ = "backend"

from fastapi import APIRouter, Depends
from .verify_token import verify_jwt_token
import json
import os

router = APIRouter()

DATA_PATH = os.path.join(os.path.dirname(__file__), "../data/istatistikler.json")

def load_data():
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

@router.get("/grafik/aylik")
def aylik_gelir_gider(user=Depends(verify_jwt_token)):
    data = load_data()
    return {"trend": data["aylik_trend"]}

@router.get("/grafik/kategori")
def kategori_dagilimi(user=Depends(verify_jwt_token)):
    data = load_data()
    return {"kategori": data["kategori_bazli"]}
