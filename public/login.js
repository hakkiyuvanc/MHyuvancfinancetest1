
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = document.getElementById("role").value;
  const errorBox = document.getElementById("loginError");

  if (!role) {
    errorBox.textContent = "Lütfen bir rol seçiniz.";
    return;
  }

  // Basit doğrulama (demo kullanıcı: admin/1234)
  if (username === "admin" && password === "1234") {
    localStorage.setItem("loggedInUser", username);
    localStorage.setItem("userRole", role);
    window.location.href = "gelirgider.html";
  } else {
    errorBox.textContent = "Hatalı kullanıcı adı veya şifre!";
  }
});
