async function loadLang() {
    const lang = localStorage.getItem("lang") || "tr";
    const res = await fetch("/frontend/langs/" + lang + ".json");
    const strings = await res.json();

    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (strings[key]) {
            el.innerText = strings[key];
        }
        if (el.placeholder && strings[key]) {
            el.placeholder = strings[key];
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const langSelector = document.getElementById("langSelector");
    if (langSelector) {
        langSelector.value = localStorage.getItem("lang") || "tr";
        langSelector.addEventListener("change", (e) => {
            localStorage.setItem("lang", e.target.value);
            location.reload();
        });
    }
    loadLang();
});