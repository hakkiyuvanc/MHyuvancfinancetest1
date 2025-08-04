
fetch("/grafik/gelirgider")
  .then(res => res.json())
  .then(data => {
    const ctx = document.getElementById("gelirgiderChart").getContext("2d");
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: data.labels,
        datasets: [
          {
            label: "Gelir",
            data: data.gelir,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1
          },
          {
            label: "Gider",
            data: data.gider,
            backgroundColor: "rgba(255, 99, 132, 0.6)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Aylık Gelir-Gider Analizi',
            font: {
              size: 20
            }
          },
          legend: {
            labels: {
              font: {
                size: 14
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              font: {
                size: 13
              }
            }
          },
          x: {
            ticks: {
              font: {
                size: 13
              }
            }
          }
        }
      }
    });
  });
