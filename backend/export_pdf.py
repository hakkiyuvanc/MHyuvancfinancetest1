
from fpdf import FPDF
from fastapi import APIRouter, Response
from io import BytesIO

router = APIRouter()

@router.post("/export/pdf")
def export_to_pdf(data: list[dict]):
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)

    pdf.cell(200, 10, txt="Finansal Rapor", ln=True, align='C')
    pdf.ln(10)

    for item in data:
        line = f"{item.get('kategori', '')}: {item.get('miktar', '')}"
        pdf.cell(200, 10, txt=line, ln=True)

    buffer = BytesIO()
    pdf.output(buffer)
    buffer.seek(0)
    return Response(content=buffer.read(), media_type="application/pdf")
