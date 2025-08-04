from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from pathlib import Path
import shutil
import os

router = APIRouter()
UPLOAD_DIR = "public/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/api/upload")
async def upload_file(
    dosya: UploadFile = File(...),
    fatura_id: str = Form(""),
):
    ext = Path(dosya.filename).suffix.lower()
    if ext not in [".jpg", ".jpeg", ".png", ".pdf"]:
        raise HTTPException(status_code=400, detail="Desteklenmeyen dosya türü.")

    file_path = f"{UPLOAD_DIR}/{fatura_id}_{dosya.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(dosya.file, buffer)

    return {"message": "Dosya yüklendi", "path": file_path}