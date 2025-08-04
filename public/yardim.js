document.addEventListener("DOMContentLoaded", () => {
  const yardımBtn = document.createElement("button");
  yardımBtn.innerText = "🛈 Yardım";
  yardımBtn.className = "yardim-button";
  document.body.appendChild(yardımBtn);

  const popup = document.createElement("div");
  popup.className = "yardim-popup hidden";
  popup.innerHTML = `
    <h3>Yardım Paneli</h3>
    <ul>
      <li><strong>AI Paneli:</strong> Gelir/gider verilerinize göre risk skoru ve tahmin üretir.</li>
      <li><strong>PDF/CSV Dışa Aktarma:</strong> Rapor sayfasında ilgili butonlara tıklayın.</li>
      <li><strong>Kullanıcı Ekleme:</strong> Admin panelde formu doldurun.</li>
    </ul>
    <button onclick="this.parentElement.classList.add('hidden')">Kapat</button>
  `;
  document.body.appendChild(popup);

  yardımBtn.addEventListener("click", () => {
    popup.classList.toggle("hidden");
  });
});