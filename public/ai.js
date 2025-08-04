document.getElementById("ozetForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const data = new FormData(this);
  fetch("/ai/ozet", { method: "POST", body: data })
    .then(res => res.json()).then(d => {
      document.getElementById("ozetSonuc").innerText = d.ozet;
    });
});

document.getElementById("tahminForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const data = new FormData(this);
  fetch("/ai/tahmin", { method: "POST", body: data })
    .then(res => res.json()).then(d => {
      document.getElementById("tahminSonuc").innerText =
        `Net Kar: ${d.net_kar}, Risk: ${d.risk_skoru}, Öneri: ${d.öneri}`;
    });
});
