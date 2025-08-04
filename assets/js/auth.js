
// auth.js – Token yönetimi

// Token'ı localStorage'a kaydet
function saveToken(token) {
    localStorage.setItem('jwt_token', token);
}

// Token'ı al
function getToken() {
    return localStorage.getItem('jwt_token');
}

// Token'ı sil (logout)
function removeToken() {
    localStorage.removeItem('jwt_token');
}

// Yetkili istek gönderme örneği
async function authorizedFetch(url, options = {}) {
    const token = getToken();
    if (!options.headers) {
        options.headers = {};
    }
    options.headers['Authorization'] = 'Bearer ' + token;
    return fetch(url, options);
}

// Oturum kontrolü (örnek kullanım)
function checkAuthAndRedirect() {
    const token = getToken();
    if (!token) {
        window.location.href = "/login.html";
    }
}
