async function loadDashboard() {
  const statsRes = await fetch("/dashboard-stats");
  const stats = await statsRes.json();

  const aiRes = await fetch("/dashboard-ai-summary");
  const ai = await aiRes.json();

  document.getElementById("totalInvoices").innerText = "📦 Toplam Fatura: " + stats.total_invoices;
  document.getElementById("monthlyIncome").innerText = "💰 Aylık Gelir: " + stats.monthly_income + " ₺";
  document.getElementById("monthlyExpense").innerText = "📉 Aylık Gider: " + stats.monthly_expense + " ₺";
  document.getElementById("aiAdvice").innerText = "🤖 AI Önerisi: " + ai.advice;
}

loadDashboard();
