let sites = JSON.parse(localStorage.getItem("sites")) || [];

const lista = document.getElementById("listaSites");
const modal = document.getElementById("modal");

function abrirModal() {
    modal.style.display = "flex";
}

function fecharModal() {
    modal.style.display = "none";
}

function salvarSite() {
    const nome = document.getElementById("nome").value;
    const url = document.getElementById("url").value;
    const descricao = document.getElementById("descricao").value;

    if (!nome || !url) {
        alert("Preencha nome e URL");
        return;
    }

    sites.push({ nome, url, descricao });
    localStorage.setItem("sites", JSON.stringify(sites));

    fecharModal();
    renderizar();
}

function excluirSite(index) {
    sites.splice(index, 1);
    localStorage.setItem("sites", JSON.stringify(sites));
    renderizar();
}

function renderizar() {
    lista.innerHTML = "";

    sites.forEach((site, index) => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <h3>${site.nome}</h3>
            <p>${site.descricao || "Sem descrição"}</p>
            <button class="abrir" onclick="window.open('${site.url}', '_blank')">Abrir</button>
            <button class="excluir" onclick="excluirSite(${index})">Excluir</button>
        `;

        lista.appendChild(card);
    });
}

renderizar();
