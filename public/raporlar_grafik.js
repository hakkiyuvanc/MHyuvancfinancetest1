document.addEventListener("DOMContentLoaded", () => {
  const ctx = document.getElementById("raporChart").getContext("2d");

  fetch("/api/grafik-verisi")
    .then(res => res.json())
    .then(data => {
      const labels = data.map(item => item.ay);
      const gelir = data.map(item => item.gelir);
      const gider = data.map(item => item.gider);
      const kar = gelir.map((g, i) => g - gider[i]);

      new Chart(ctx, {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: "Gelir",
              data: gelir,
              backgroundColor: "#4CAF50"
            },
            {
              label: "Gider",
              data: gider,
              backgroundColor: "#F44336"
            },
            {
              label: "Kar",
              data: kar,
              backgroundColor: "#2196F3"
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: "Veritabanından Aylık Gelir-Gider-Kar"
            }
          },
          scales: {
            y: { beginAtZero: true }
          }
        }
      });
    });
});