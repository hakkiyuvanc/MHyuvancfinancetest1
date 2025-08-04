from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from models import User
from db import get_session
from roles import role_check

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.get("/users", dependencies=[Depends(role_check("admin"))])
def get_all_users(session: Session = Depends(get_session)):
    users = session.exec(select(User)).all()
    return users

@router.delete("/users/{user_id}", dependencies=[Depends(role_check("admin"))])
def delete_user(user_id: int, session: Session = Depends(get_session)):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı")
    session.delete(user)
    session.commit()
    return {"message": "Kullanıcı silindi"}

@router.put("/users/{user_id}/role", dependencies=[Depends(role_check("admin"))])
def update_user_role(user_id: int, new_role: str, session: Session = Depends(get_session)):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı")
    user.role = new_role
    session.add(user)
    session.commit()
    return {"message": f"Kullanıcının rolü '{new_role}' olarak güncellendi"}