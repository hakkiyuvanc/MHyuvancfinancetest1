
// Basit bildirim sistemi (localStorage ile)
const NOTIFICATION_KEY = "notifications";

function getNotifications() {
  return JSON.parse(localStorage.getItem(NOTIFICATION_KEY) || "[]");
}

function addNotification(msg) {
  const current = getNotifications();
  const now = new Date().toLocaleString("tr-TR");
  current.unshift({ message: msg, time: now });
  localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(current.slice(0, 10))); // max 10
  updateNotificationBadge();
}

function updateNotificationBadge() {
  const badge = document.getElementById("notificationBadge");
  if (badge) {
    const count = getNotifications().length;
    badge.textContent = count > 0 ? `🔔 (${count})` : "🔔";
  }
}

function renderNotifications() {
  const container = document.getElementById("notificationList");
  if (!container) return;
  const notifs = getNotifications();
  container.innerHTML = "";
  notifs.forEach(n => {
    const item = document.createElement("div");
    item.className = "notification-item";
    item.innerHTML = `<strong>${n.time}</strong><br/>${n.message}`;
    container.appendChild(item);
  });
}

// Sayfa yüklendiğinde rozet güncelle
document.addEventListener("DOMContentLoaded", updateNotificationBadge);
