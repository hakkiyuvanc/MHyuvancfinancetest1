

async function faturaGonder() {
  const musteri = document.getElementById("musteri").value;
  const urun = document.getElementById("urun").value;
  const adet = document.getElementById("adet").value;
  const fiyat = document.getElementById("fiyat").value;
  const email = document.getElementById("aliciEmail").value;

  const token = localStorage.getItem("token");

  const veri = {
    musteri,
    urun,
    adet: parseInt(adet),
    fiyat: parseFloat(fiyat),
    email
  };

  const res = await fetch("/send-pdf-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify(veri)
  });

  const sonuc = await res.json();
  alert(sonuc.message || "Fatura gönderildi.");
}

async function sendPDFToEmail(pdfBlob, email) {
  const formData = new FormData();
  formData.append("email", email);
  formData.append("file", new File([pdfBlob], "rapor.pdf", { type: "application/pdf" }));

  const token = localStorage.getItem("token");
  try {
    const response = await fetch("http://localhost:8000/send-pdf-email", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: "Bearer " + token
      }
    });
    const result = await response.json();
    alert(result.message || "Rapor gönderildi!");
  } catch (err) {
    alert("Gönderim sırasında hata oluştu.");
    console.error(err);
  }
}

function exportToCSV() {
  let rows = [["Tarih", "Açıklama", "Tutar", "Tür"]];
  document.querySelectorAll("table tbody tr").forEach(tr => {
    const cols = Array.from(tr.querySelectorAll("td")).map(td => td.textContent.trim());
    if (cols.length === 4) rows.push(cols);
  });
  const csv = rows.map(e => e.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "gelir_gider.csv";
  a.click();
}

function exportToPDF() {
  const doc = new window.jspdf.jsPDF();
  doc.text("Gelir-Gider Raporu", 20, 10);
  let y = 20;
  document.querySelectorAll("table tbody tr").forEach(tr => {
    const line = Array.from(tr.querySelectorAll("td")).map(td => td.textContent.trim()).join(" | ");
    doc.text(line, 10, y);
    y += 10;
  });
  doc.save("gelir_gider.pdf");
}