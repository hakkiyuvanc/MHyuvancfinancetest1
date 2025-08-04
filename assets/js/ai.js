
// ai.js – AI Panel işlevleri

async function fetchGPTSummary() {
    const res = await authorizedFetch("/ai/summary");
    const data = await res.json();
    document.getElementById("aiSummary").innerText = data.summary || "Özet bulunamadı.";
}

async function fetchPrediction() {
    const res = await authorizedFetch("/ai/predict");
    const data = await res.json();
    document.getElementById("aiPrediction").innerText = data.prediction || "Tahmin verisi yok.";
}

async function fetchRiskScore() {
    const res = await authorizedFetch("/ai/risk-score");
    const data = await res.json();
    document.getElementById("aiRiskScore").innerText = "Risk Skoru: " + (data.risk || "-");
}

window.onload = function () {
    checkAuthAndRedirect();
    fetchGPTSummary();
    fetchPrediction();
    fetchRiskScore();
};
