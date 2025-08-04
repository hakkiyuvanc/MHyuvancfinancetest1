from sqlalchemy import Column, Integer, String, DateTime, func
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Log(Base):
    __tablename__ = "logs"
    id = Column(Integer, primary_key=True, index=True)
    kullanici = Column(String)
    islem = Column(String)
    detay = Column(String)
    zaman = Column(DateTime, default=func.now())