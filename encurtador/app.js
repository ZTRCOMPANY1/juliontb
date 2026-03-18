import {
  db,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  orderBy
} from "./firebase.js";

const originalUrlInput = document.getElementById("originalUrl");
const customSlugInput = document.getElementById("customSlug");
const createBtn = document.getElementById("createBtn");
const clearBtn = document.getElementById("clearBtn");
const messageBox = document.getElementById("message");
const resultCard = document.getElementById("resultCard");
const shortUrlOutput = document.getElementById("shortUrlOutput");
const copyBtn = document.getElementById("copyBtn");
const downloadQrBtn = document.getElementById("downloadQrBtn");
const qrcodeContainer = document.getElementById("qrcode");
const linksTableBody = document.getElementById("linksTableBody");
const refreshBtn = document.getElementById("refreshBtn");
const searchInput = document.getElementById("searchInput");

const linksCollection = collection(db, "short_links");
let allLinks = [];
let currentShortUrl = "";

function getBaseShortenerUrl() {
  const origin = window.location.origin;
  const pathParts = window.location.pathname.split("/").filter(Boolean);

  const encurtadorIndex = pathParts.indexOf("encurtador");

  if (encurtadorIndex !== -1) {
    return `${origin}/${pathParts.slice(0, encurtadorIndex + 1).join("/")}`;
  }

  return origin;
}

function isValidUrl(value) {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
}

function sanitizeSlug(slug) {
  return slug
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

function generateRandomSlug(length = 6) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let slug = "";
  for (let i = 0; i < length; i++) {
    slug += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return slug.toLowerCase();
}

async function generateUniqueSlug() {
  let slug = generateRandomSlug();
  let exists = true;

  while (exists) {
    const ref = doc(db, "short_links", slug);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      exists = false;
    } else {
      slug = generateRandomSlug();
    }
  }

  return slug;
}

function showMessage(text, type = "success") {
  messageBox.textContent = text;
  messageBox.className = `message ${type}`;
  messageBox.classList.remove("hidden");
}

function hideMessage() {
  messageBox.textContent = "";
  messageBox.className = "message hidden";
}

function showResult(shortUrl) {
  currentShortUrl = shortUrl;
  shortUrlOutput.value = shortUrl;
  resultCard.classList.remove("hidden");
  renderQrCode(shortUrl);
}

function clearForm() {
  originalUrlInput.value = "";
  customSlugInput.value = "";
  hideMessage();
}

function renderQrCode(url) {
  qrcodeContainer.innerHTML = "";

  QRCode.toCanvas(url, { width: 220, margin: 1 }, (err, canvas) => {
    if (err) {
      qrcodeContainer.innerHTML = "<p style='color:black;'>Erro ao gerar QR Code</p>";
      return;
    }
    qrcodeContainer.appendChild(canvas);
  });
}

function downloadQrCode() {
  const canvas = qrcodeContainer.querySelector("canvas");
  if (!canvas) return;

  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = "qrcode-link-curto.png";
  link.click();
}

async function createShortLink() {
  hideMessage();

  const originalUrl = originalUrlInput.value.trim();
  let customSlug = sanitizeSlug(customSlugInput.value);

  if (!originalUrl) {
    showMessage("Digite a URL original.", "error");
    return;
  }

  if (!isValidUrl(originalUrl)) {
    showMessage("Digite uma URL válida começando com http:// ou https://", "error");
    return;
  }

  let slug = customSlug;

  if (slug) {
    const existingSlugRef = doc(db, "short_links", slug);
    const existingSlugSnap = await getDoc(existingSlugRef);

    if (existingSlugSnap.exists()) {
      showMessage("Esse slug já existe. Escolha outro.", "error");
      return;
    }
  } else {
    slug = await generateUniqueSlug();
  }

  const shortLinkRef = doc(db, "short_links", slug);

  const payload = {
    slug,
    url: originalUrl,
    clicks: 0,
    createdAt: new Date().toISOString(),
    lastClick: null
  };

  await setDoc(shortLinkRef, payload);

  const shortUrl = `${getBaseShortenerUrl()}/${slug}`;
  showResult(shortUrl);
  showMessage("Link encurtado criado com sucesso.");
  await loadLinks();
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("pt-BR");
}

function escapeHtml(str = "") {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getFilteredLinks() {
  const term = searchInput.value.trim().toLowerCase();
  if (!term) return allLinks;

  return allLinks.filter((item) => {
    return (
      item.slug.toLowerCase().includes(term) ||
      item.url.toLowerCase().includes(term)
    );
  });
}

function renderLinksTable() {
  const items = getFilteredLinks();

  if (!items.length) {
    linksTableBody.innerHTML = `
      <tr>
        <td colspan="6" class="empty-state">Nenhum link encontrado.</td>
      </tr>
    `;
    return;
  }

  linksTableBody.innerHTML = items
    .map((item) => {
      const shortUrl = `${getBaseShortenerUrl()}/${item.slug}`;

      return `
        <tr>
          <td><span class="slug-badge">${escapeHtml(item.slug)}</span></td>
          <td class="link-destination">${escapeHtml(item.url)}</td>
          <td>${item.clicks ?? 0}</td>
          <td>${formatDate(item.lastClick)}</td>
          <td>${formatDate(item.createdAt)}</td>
          <td>
            <div class="row-actions">
              <button class="small-btn" data-copy="${escapeHtml(shortUrl)}">Copiar</button>
              <button class="small-btn" data-open="${escapeHtml(shortUrl)}">Abrir</button>
              <button class="small-btn delete" data-delete="${escapeHtml(item.slug)}">Excluir</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");
}

async function loadLinks() {
  linksTableBody.innerHTML = `
    <tr>
      <td colspan="6" class="empty-state">Carregando links...</td>
    </tr>
  `;

  const q = query(linksCollection, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  allLinks = snapshot.docs.map((docItem) => ({
    id: docItem.id,
    ...docItem.data()
  }));

  renderLinksTable();
}

async function deleteLink(slug) {
  const confirmed = window.confirm(`Deseja excluir o link "${slug}"?`);
  if (!confirmed) return;

  await deleteDoc(doc(db, "short_links", slug));
  showMessage("Link excluído com sucesso.");
  await loadLinks();
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    showMessage("Link copiado.");
  } catch {
    showMessage("Não foi possível copiar automaticamente.", "error");
  }
}

createBtn.addEventListener("click", createShortLink);

clearBtn.addEventListener("click", () => {
  clearForm();
  resultCard.classList.add("hidden");
  currentShortUrl = "";
});

copyBtn.addEventListener("click", () => {
  if (!currentShortUrl) return;
  copyText(currentShortUrl);
});

downloadQrBtn.addEventListener("click", downloadQrCode);

refreshBtn.addEventListener("click", loadLinks);
searchInput.addEventListener("input", renderLinksTable);

linksTableBody.addEventListener("click", async (event) => {
  const copyTarget = event.target.getAttribute("data-copy");
  const openTarget = event.target.getAttribute("data-open");
  const deleteTarget = event.target.getAttribute("data-delete");

  if (copyTarget) {
    await copyText(copyTarget);
    return;
  }

  if (openTarget) {
    window.open(openTarget, "_blank");
    return;
  }

  if (deleteTarget) {
    await deleteLink(deleteTarget);
  }
});

loadLinks();