from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from .models import Invoice
from .db import get_session
from .roles import role_check
from jose import jwt, JWTError
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime

router = APIRouter(prefix="/invoice", tags=["Invoice"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
SECRET_KEY = "secret"
ALGORITHM = "HS256"

def get_user_id_from_token(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return int(payload.get("sub"))
    except JWTError:
        raise HTTPException(status_code=401, detail="Geçersiz token")

@router.post("/", dependencies=[Depends(role_check("user"))])
def create_invoice(invoice: Invoice, session: Session = Depends(get_session), user_id: int = Depends(get_user_id_from_token)):
    invoice.user_id = user_id
    invoice.total = round(invoice.amount * (1 + invoice.tax_rate / 100), 2)
    session.add(invoice)
    session.commit()
    session.refresh(invoice)
    return invoice

@router.get("/", dependencies=[Depends(role_check("user"))])
def get_invoices(session: Session = Depends(get_session), user_id: int = Depends(get_user_id_from_token)):
    invoices = session.exec(select(Invoice).where(Invoice.user_id == user_id).order_by(Invoice.date.desc())).all()
    return invoices