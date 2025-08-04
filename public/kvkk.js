fetch("/static/kvkk.txt")
  .then(response => response.text())
  .then(text => {
    document.getElementById("kvkkText").innerText = text;
  });
