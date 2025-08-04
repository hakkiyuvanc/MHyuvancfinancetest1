document.addEventListener("DOMContentLoaded", () => {
  fetch("/api/faturalar/grafik")
    .then(res => res.json())
    .then(data => {
      renderAylikChart(data.aylar, data.gelirler, data.giderler);
      renderKategoriChart(data.kategoriler);
      yorumUret(data.kategoriler);
    });

  function renderAylikChart(aylar, gelirler, giderler) {
    new Chart(document.getElementById("aylikChart"), {
      type: "line",
      data: {
        labels: aylar,
        datasets: [
          {
            label: "Gelir",
            data: gelirler,
            borderColor: "#4CAF50",
            backgroundColor: "rgba(76,175,80,0.2)",
            tension: 0.4
          },
          {
            label: "Gider",
            data: giderler,
            borderColor: "#F44336",
            backgroundColor: "rgba(244,67,54,0.2)",
            tension: 0.4
          }
        ]
      }
    });
  }

  function renderKategoriChart(kategoriler) {
    const labels = Object.keys(kategoriler);
    const data = Object.values(kategoriler);
    new Chart(document.getElementById("kategoriChart"), {
      type: "bar",
      data: {
        labels,
        datasets: [{
          label: "Toplam Gider",
          data,
          backgroundColor: "#3F51B5"
        }]
      }
    });
  }

  function yorumUret(kategoriler) {
    const sorted = Object.entries(kategoriler).sort((a, b) => b[1] - a[1]);
    const yorum = `En çok harcama yapılan kategori: ${sorted[0][0]} (${sorted[0][1]} ₺)`;
    document.getElementById("aiYorum").textContent = yorum;
  }
});