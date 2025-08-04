
// grafik.js – Chart.js ile gelir-gider ve kategori dağılımı grafikleri

async function fetchAylikTrend() {
    const res = await authorizedFetch("/grafik/aylik");
    const data = await res.json();
    const labels = data.trend.map(d => d.ay);
    const gelir = data.trend.map(d => d.gelir);
    const gider = data.trend.map(d => d.gider);

    new Chart(document.getElementById("barChart"), {
        type: "bar",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Gelir",
                    data: gelir,
                    backgroundColor: "rgba(75, 192, 192, 0.7)"
                },
                {
                    label: "Gider",
                    data: gider,
                    backgroundColor: "rgba(255, 99, 132, 0.7)"
                }
            ]
        }
    });
}

async function fetchKategoriDagilimi() {
    const res = await authorizedFetch("/grafik/kategori");
    const data = await res.json();
    const labels = Object.keys(data.kategori);
    const values = Object.values(data.kategori);

    new Chart(document.getElementById("pieChart"), {
        type: "pie",
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: [
                    "rgba(255, 99, 132, 0.6)",
                    "rgba(54, 162, 235, 0.6)",
                    "rgba(255, 206, 86, 0.6)",
                    "rgba(75, 192, 192, 0.6)",
                    "rgba(153, 102, 255, 0.6)"
                ]
            }]
        }
    });
}

window.onload = function () {
    checkAuthAndRedirect();
    fetchAylikTrend();
    fetchKategoriDagilimi();
};
