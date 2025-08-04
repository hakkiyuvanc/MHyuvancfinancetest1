from fastapi import APIRouter, Response
from models import Fatura
from db import get_db
from sqlalchemy.orm import Session
import io
import csv
import xlsxwriter
from fpdf import FPDF

router = APIRouter()

@router.get("/api/export/excel")
def export_excel(db: Session = next(get_db())):
    veriler = db.query(Fatura).all()
    output = io.BytesIO()
    workbook = xlsxwriter.Workbook(output, {'in_memory': True})
    sheet = workbook.add_worksheet("Faturalar")

    headers = ["ID", "Ad", "Açıklama", "Tutar", "Tarih"]
    for i, h in enumerate(headers):
        sheet.write(0, i, h)

    for row_idx, f in enumerate(veriler, start=1):
        sheet.write(row_idx, 0, f.id)
        sheet.write(row_idx, 1, f.ad)
        sheet.write(row_idx, 2, f.aciklama)
        sheet.write(row_idx, 3, f.tutar)
        sheet.write(row_idx, 4, str(f.tarih))

    workbook.close()
    output.seek(0)
    return Response(
        content=output.read(),
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=faturalar.xlsx"}
    )

@router.get("/api/export/pdf")
def export_pdf(db: Session = next(get_db())):
    veriler = db.query(Fatura).all()
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    pdf.cell(200, 10, txt="Fatura Raporu", ln=True, align="C")

    for f in veriler:
        line = f"{f.tarih} | {f.ad} | {f.aciklama} | {f.tutar}₺"
        pdf.cell(200, 10, txt=line, ln=True)

    pdf_output = pdf.output(dest='S').encode('latin-1')
    return Response(
        content=pdf_output,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=faturalar.pdf"}
    )