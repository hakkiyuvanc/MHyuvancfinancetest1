fetch("/get-logs")
  .then(res => res.json())
  .then(data => {
    const tbody = document.getElementById("logTable");
    data.forEach(log => {
      const row = `<tr><td>${log.user}</td><td>${log.action}</td><td>${log.timestamp}</td></tr>`;
      tbody.innerHTML += row;
    });
  });
