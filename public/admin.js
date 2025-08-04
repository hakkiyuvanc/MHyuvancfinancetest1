
document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.querySelector("#userTable tbody");
  const form = document.getElementById("addUserForm");
  const nameInput = document.getElementById("newName");
  const emailInput = document.getElementById("newEmail");
  const roleInput = document.getElementById("newRole");

  async function fetchUsers() {
    const token = localStorage.getItem("token");
    const res = await fetch("/admin/users", {
      headers: {
        "Authorization": "Bearer " + token
      }
    });
    const users = await res.json();
    renderUsers(users);
  }

  async function deleteUser(id) {
    const token = localStorage.getItem("token");
    if (!confirm("Silmek istediğinize emin misiniz?")) return;
    await fetch(`/admin/users/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": "Bearer " + token
      }
    });
    fetchUsers();
  }

  async function changeRole(id, newRole) {
    const token = localStorage.getItem("token");
    await fetch(`/admin/users/${id}/role?new_role=${newRole}`, {
      method: "PUT",
      headers: {
        "Authorization": "Bearer " + token
      }
    });
    fetchUsers();
  }

  function renderUsers(users) {
    tableBody.innerHTML = "";
    users.forEach(u => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${u.username}</td>
        <td>${u.email}</td>
        <td>
          <select onchange="changeRole(${u.id}, this.value)">
            <option value="admin" ${u.role === "admin" ? "selected" : ""}>Admin</option>
            <option value="muhasebeci" ${u.role === "muhasebeci" ? "selected" : ""}>Muhasebeci</option>
            <option value="görüntüleyici" ${u.role === "görüntüleyici" ? "selected" : ""}>Görüntüleyici</option>
          </select>
        </td>
        <td><button onclick="deleteUser(${u.id})">🗑 Sil</button></td>
      `;
      tableBody.appendChild(row);
    });
  }

  window.deleteUser = deleteUser;
  window.changeRole = changeRole;

  fetchUsers();
});
