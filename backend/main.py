from starlette.middleware.sessions import SessionMiddleware


import bcrypt

from fastapi import FastAPI, Form, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import os

app = FastAPI()

app.add_middleware(SessionMiddleware, secret_key="mh_yuvanc_finance_super_secret")


# Statik ve template klasörlerini bağla
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
templates = Jinja2Templates(directory=os.path.join(BASE_DIR, "templates"))
app.mount("/static", StaticFiles(directory=os.path.join(BASE_DIR, "static")), name="static")

@app.get("/", response_class=HTMLResponse)
def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/login", response_class=HTMLResponse)
def login_page(request: Request):
    lang = request.session.get("lang", "tr")
    t = get_translations(lang)
    return templates.TemplateResponse("login.html", {"request": request, "t": t})

@app.post("/login")
def login(request: Request, username: str = Form(...), password: str = Form(...)):
    import sqlite3
    conn = sqlite3.connect("veritabani.db")
    cursor = conn.cursor()
    cursor.execute("SELECT password FROM users WHERE username=?", (username,))
    result = cursor.fetchone()
    conn.close()
    if result and bcrypt.checkpw(password.encode('utf-8'), result[0]):
        request.session["user"] = username
    return RedirectResponse(url="/dashboard?msg=Giriş+başarılı", status_code=302)
    return RedirectResponse(url="/login?msg=Giriş+başarısız", status_code=302)
    return RedirectResponse(url="/login?msg=Kayıt+başarılı", status_code=302)

@app.get("/dashboard", response_class=HTMLResponse)
def dashboard(request: Request):
    if not request.session.get("user"):
        return RedirectResponse(url="/login?msg=Hesap+silindi", status_code=302)
    lang = request.session.get("lang", "tr")
    t = get_translations(lang)
    return templates.TemplateResponse("dashboard.html", {"request": request, "t": t})

@app.get("/fatura", response_class=HTMLResponse)
def fatura_page(request: Request):
    return templates.TemplateResponse("fatura.html", {
        "request": request,
        "t": {
            "invoices": "Faturalar"
        }
    })
    
@app.post("/fatura/ekle")
def fatura_ekle(tarih: str = Form(...), fatura_no: str = Form(...), musteri: str = Form(...), tutar: float = Form(...)):
    print(f"Yeni Fatura: {tarih}, {fatura_no}, {musteri}, {tutar} ₺")  # Simülasyon
    return RedirectResponse(url="/fatura", status_code=302)

@app.get("/rapor", response_class=HTMLResponse)
def rapor_page(request: Request):
    return templates.TemplateResponse("rapor.html", {
        "request": request,
        "t": {
            "reports": "Raporlar"
        }
    })
@app.get("/ai", response_class=HTMLResponse)
def ai_page(request: Request):
    return templates.TemplateResponse("ai.html", {
        "request": request,
        "t": {
            "ai_analysis": "AI Analizi"
        }
    })
    
@app.get("/logout")
def logout(request: Request):
    request.session.clear()
    return RedirectResponse(url="/login", status_code=302)

@app.get("/register", response_class=HTMLResponse)
def register_page(request: Request):
    return templates.TemplateResponse("register.html", {"request": request})

@app.post("/register")
def register_user(username: str = Form(...), password: str = Form(...)):
    import sqlite3
    hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    conn = sqlite3.connect("veritabani.db")
    cursor = conn.cursor()
    try:
        cursor.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, hashed_pw))
        conn.commit()
    except sqlite3.IntegrityError:
        return RedirectResponse(url="/register", status_code=302)
    finally:
        conn.close()
    return RedirectResponse(url="/login", status_code=302)

@app.get("/admin", response_class=HTMLResponse)
def admin_panel(request: Request):
    if request.session.get("user") != "admin":
        return RedirectResponse(url="/login", status_code=302)
    import sqlite3
    conn = sqlite3.connect("veritabani.db")
    cursor = conn.cursor()
    cursor.execute("SELECT id, username, password, role FROM users")
    users = cursor.fetchall()
    conn.close()
    return templates.TemplateResponse("admin.html", {"request": request, "users": users})

@app.post("/admin/sil")
def admin_sil(user_id: int = Form(...), request: Request = None):
    if request.session.get("user") != "admin":
        return RedirectResponse(url="/login", status_code=302)
    import sqlite3
    conn = sqlite3.connect("veritabani.db")
    cursor = conn.cursor()
    cursor.execute("DELETE FROM users WHERE id=? AND username!='admin'", (user_id,))
    conn.commit()
    conn.close()
    return RedirectResponse(url="/admin", status_code=302)

@app.get("/profil", response_class=HTMLResponse)
def profil_page(request: Request):
    if not request.session.get("user"):
        return RedirectResponse(url="/login", status_code=302)
    return templates.TemplateResponse("profil.html", {"request": request})

@app.post("/profil/sifre")
def sifre_degistir(request: Request, new_password: str = Form(...)):
    if not request.session.get("user"):
        return RedirectResponse(url="/login", status_code=302)
    import sqlite3
    username = request.session["user"]
    hashed_pw = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())
    conn = sqlite3.connect("veritabani.db")
    cursor = conn.cursor()
    cursor.execute("UPDATE users SET password=? WHERE username=?", (hashed_pw, username))
    conn.commit()
    conn.close()
    return RedirectResponse(url="/profil?msg=Şifre+güncellendi", status_code=302)

@app.post("/profil/sil")
def hesap_sil(request: Request):
    if not request.session.get("user"):
        return RedirectResponse(url="/login", status_code=302)
    import sqlite3
    username = request.session["user"]
    if username == "admin":
        return RedirectResponse(url="/profil", status_code=302)
    conn = sqlite3.connect("veritabani.db")
    cursor = conn.cursor()
    cursor.execute("DELETE FROM users WHERE username=?", (username,))
    conn.commit()
    conn.close()
    request.session.clear()
    return RedirectResponse(url="/login", status_code=302)

from fastapi.responses import FileResponse
from reportlab.pdfgen import canvas
from openpyxl import Workbook

@app.get("/export/pdf")
def export_pdf():
    output_dir = "exports/pdf"
    os.makedirs(output_dir, exist_ok=True)
    file_path = os.path.join(output_dir, "faturalar.pdf")
    c = canvas.Canvas(file_path)
    c.drawString(100, 800, "Fatura Listesi - MH YUVANC FINANCE")
    c.drawString(100, 780, "1. 01/08/2025 - INV-1001 - ACME A.Ş. - 12.500₺")
    c.save()
    return FileResponse(path=file_path, filename="faturalar.pdf", media_type='application/pdf')

@app.get("/export/excel")
def export_excel():
    output_dir = "exports/excel"
    os.makedirs(output_dir, exist_ok=True)
    file_path = os.path.join(output_dir, "faturalar.xlsx")
    wb = Workbook()
    ws = wb.active
    ws.append(["Tarih", "Fatura No", "Müşteri", "Tutar"])
    ws.append(["01/08/2025", "INV-1001", "ACME A.Ş.", "12500₺"])
    wb.save(file_path)
    return FileResponse(path=file_path, filename="faturalar.xlsx", media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')

import json

def get_translations(lang_code):
    path = os.path.join(BASE_DIR, "lang", f"{lang_code}.json")
    if not os.path.exists(path):
        path = os.path.join(BASE_DIR, "lang", "tr.json")
    with open(path, encoding="utf-8") as f:
        return json.load(f)

@app.get("/lang")
def set_language(request: Request, set: str = "tr"):
    request.session["lang"] = set
    return RedirectResponse(url=request.headers.get("referer") or "/", status_code=302)
