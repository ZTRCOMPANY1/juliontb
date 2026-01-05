if (localStorage.getItem("logado") !== "true") {
    location.href = "index.html";
}

let dados = JSON.parse(localStorage.getItem("projetos")) || [];

const lista = document.getElementById("lista");

const nomeInput = document.getElementById("nome");
const urlInput = document.getElementById("url");
const repoInput = document.getElementById("repo");
const categoriaInput = document.getElementById("categoria");

const buscaInput = document.getElementById("busca");
const filtroCategoria = document.getElementById("filtroCategoria");

const total = document.getElementById("total");
const games = document.getElementById("games");
const sites = document.getElementById("sites");
const apis = document.getElementById("apis");

function logout() {
    localStorage.removeItem("logado");
    location.href = "index.html";
}

function addSite() {
    const nome = nomeInput.value.trim();
    const url = urlInput.value.trim();
    const repo = repoInput.value.trim();
    const categoria = categoriaInput.value;

    if (!nome || !url) {
        alert("Preencha nome e URL");
        return;
    }

    dados.push({ nome, url, repo, categoria });
    salvar();

    nomeInput.value = "";
    urlInput.value = "";
    repoInput.value = "";
}

function salvar() {
    localStorage.setItem("projetos", JSON.stringify(dados));
    render();
}

function del(i) {
    if (!confirm("Excluir este site?")) return;
    dados.splice(i, 1);
    salvar();
}

function render() {
    lista.innerHTML = "";

    const busca = buscaInput.value.toLowerCase();
    const filtro = filtroCategoria.value;

    let stats = { Games: 0, Sites: 0, APIs: 0 };

    dados.forEach(p => stats[p.categoria]++);
    total.textContent = dados.length;
    games.textContent = stats.Games;
    sites.textContent = stats.Sites;
    apis.textContent = stats.APIs;

    dados.forEach((p, i) => {
        if (
            (filtro !== "Todos" && p.categoria !== filtro) ||
            !p.nome.toLowerCase().includes(busca)
        ) return;

        lista.innerHTML += `
            <div class="card">
                <h3>${p.nome}</h3>
                <p>${p.categoria}</p>

                <button onclick="window.open('${p.url}','_blank')">Abrir</button>
                ${p.repo ? `<button class="repo" onclick="window.open('${p.repo}','_blank')">Repositório</button>` : ""}
                <button class="del" onclick="del(${i})">Excluir</button>
            </div>
        `;
    });
}

function exportarBackup() {
    const blob = new Blob(
        [JSON.stringify(dados, null, 2)],
        { type: "application/json" }
    );

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "backup-ztr-company.json";
    a.click();
}

function importarBackup(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
        try {
            const importado = JSON.parse(e.target.result);
            if (!Array.isArray(importado)) throw "erro";

            if (confirm("Deseja substituir os dados atuais?")) {
                dados = importado;
            } else {
                dados = dados.concat(importado);
            }

            salvar();
        } catch {
            alert("Arquivo inválido");
        }
    };
    reader.readAsText(file);
}

render();
