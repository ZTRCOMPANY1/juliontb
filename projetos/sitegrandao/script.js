const nao = document.getElementById("nao");
const overlay = document.getElementById("overlay");
const ok = document.getElementById("ok");

if (nao) {
    nao.addEventListener("click", () => {
        overlay.style.display = "flex";
    });
}

if (ok) {
    ok.addEventListener("click", () => {
        overlay.style.display = "none";
        nao.style.display = "none";
    });
}
