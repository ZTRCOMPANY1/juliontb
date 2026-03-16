const API_BASE_URL = "https://SEU-BACKEND.onrender.com";

const form = document.getElementById("loginForm");
const errorBox = document.getElementById("loginError");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  errorBox.textContent = "";

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (!response.ok || !data.ok) {
      errorBox.textContent = data.error || "Erro no login";
      return;
    }

    localStorage.setItem("pc_monitor_token", data.token);
    window.location.href = "index.html";
  } catch (error) {
    errorBox.textContent = "Não foi possível conectar ao servidor.";
  }
});