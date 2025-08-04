
function parseJWT(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = decodeURIComponent(atob(base64Url).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(base64);
  } catch (e) {
    return null;
  }
}

function getSession() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  const payload = parseJWT(token);
  return payload ? { username: payload.sub, role: payload.role } : null;
}

function isLoggedIn() {
  return !!getSession();
}

function isAdmin() {
  const s = getSession();
  return s && s.role === "admin";
}

function renderUserBadge() {
  const badge = document.getElementById("userBadge");
  if (!badge) return;
  const s = getSession();
  if (!s) {
    badge.innerHTML = '<a href="login.html">Giriş</a>';
    return;
  }
  badge.innerHTML = `
    <span class="user-info">👤 ${s.username} (${s.role})</span>
    <a href="logout.html" id="logoutLink" class="logout-btn">Çıkış</a>
  `;
}

function toggleAdminNav() {
  const adminNav = document.getElementById("adminNav");
  if (!adminNav) return;
  if (isAdmin()) {
    adminNav.style.display = "inline-block";
  } else {
    adminNav.style.display = "none";
  }
}

function enforceRole() {
  const req = document.body.getAttribute("data-require-role");
  if (!req) return;
  const s = getSession();
  if (!s) {
    window.location.href = "login.html";
    return;
  }
  if (req === "admin" && s.role !== "admin") {
    alert("Bu sayfa yalnızca admin kullanıcılar içindir.");
    window.location.href = "index.html";
  }
}

function clearSession() {
  localStorage.removeItem("token");
}

document.addEventListener("DOMContentLoaded", () => {
  renderUserBadge();
  toggleAdminNav();
  enforceRole();
});
