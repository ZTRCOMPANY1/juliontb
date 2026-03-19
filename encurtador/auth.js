import {
  auth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "./firebase.js";

const authMessage = document.getElementById("authMessage");

function showMessage(text, type = "success") {
  authMessage.textContent = text;
  authMessage.className = `message ${type}`;
  authMessage.classList.remove("hidden");
}

function getFriendlyError(errorCode) {
  const errors = {
    "auth/invalid-email": "E-mail inválido.",
    "auth/missing-password": "Digite a senha.",
    "auth/user-not-found": "Conta não encontrada.",
    "auth/wrong-password": "Senha incorreta.",
    "auth/invalid-credential": "E-mail ou senha incorretos.",
    "auth/email-already-in-use": "Esse e-mail já está em uso.",
    "auth/weak-password": "A senha precisa ter pelo menos 6 caracteres.",
    "auth/network-request-failed": "Falha de conexão. Tente novamente."
  };

  return errors[errorCode] || "Ocorreu um erro. Tente novamente.";
}

const loginBtn = document.getElementById("loginBtn");
if (loginBtn) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      window.location.href = "./index.html";
    }
  });

  loginBtn.addEventListener("click", async () => {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    if (!email || !password) {
      showMessage("Preencha e-mail e senha.", "error");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "./index.html";
    } catch (error) {
      showMessage(getFriendlyError(error.code), "error");
    }
  });
}

const registerBtn = document.getElementById("registerBtn");
if (registerBtn) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      window.location.href = "./index.html";
    }
  });

  registerBtn.addEventListener("click", async () => {
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value;

    if (!email || !password) {
      showMessage("Preencha e-mail e senha.", "error");
      return;
    }

    if (password.length < 6) {
      showMessage("A senha precisa ter pelo menos 6 caracteres.", "error");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      window.location.href = "./index.html";
    } catch (error) {
      showMessage(getFriendlyError(error.code), "error");
    }
  });
}