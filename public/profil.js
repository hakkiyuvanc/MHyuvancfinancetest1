document.addEventListener("DOMContentLoaded", () => {
  const nameField = document.getElementById("profileName");
  const emailField = document.getElementById("profileEmail");
  const roleField = document.getElementById("profileRole");

  // Kullanıcıyı yerelden çek
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (!user) {
    alert("Oturum bulunamadı. Lütfen giriş yapın.");
    window.location.href = "login.html";
    return;
  }

  // Bilgileri göster
  nameField.textContent = user.name;
  emailField.textContent = user.email;
  roleField.textContent = user.role;

  // Şifre değiştirme
  document.getElementById("changePasswordForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const oldPass = document.getElementById("oldPass").value;
    const newPass = document.getElementById("newPass").value;

    // Demo amaçlı şifre kontrolü yok (gerçek sistemde kontrol gerekir)
    user.password = newPass;
    localStorage.setItem("currentUser", JSON.stringify(user));
    alert("Şifre güncellendi.");
  });

  // Hesap silme
  window.deleteProfile = () => {
    if (confirm("Hesabınızı silmek istediğinize emin misiniz?")) {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const filtered = users.filter(u => u.email !== user.email);
      localStorage.setItem("users", JSON.stringify(filtered));
      localStorage.removeItem("currentUser");
      alert("Hesabınız silindi.");
      window.location.href = "login.html";
    }
  };
});