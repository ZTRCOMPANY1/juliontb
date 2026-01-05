const SENHA_HASH = btoa("ztr123"); // <<< TROQUE A SENHA AQUI

function login() {
    const senha = document.getElementById("senha").value;

    if (btoa(senha) === SENHA_HASH) {
        localStorage.setItem("logado", "true");
        location.href = "dashboard.html";
    } else {
        alert("Senha incorreta");
    }
}
