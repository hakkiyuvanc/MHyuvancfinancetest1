from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import date

class Fatura(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    kullanici: str
    ad: str
    tutar: float
    kdv: float
    tarih: date