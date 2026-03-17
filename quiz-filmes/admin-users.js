import { auth, db } from './firebase-config.js';
import {
  onAuthStateChanged,
  signOut
} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';

import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';

const usersList = document.getElementById('usersList');
const logoutBtn = document.getElementById('logoutBtn');
const toast = document.getElementById('toast');

let currentUser = null;
let currentUserData = null;

function showToast(message) {
  toast.textContent = message;
  toast.classList.remove('hidden');

  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3000);
}

async function loadUsers() {
  usersList.innerHTML = '<p>Carregando usuários...</p>';

  const usersSnapshot = await getDocs(collection(db, 'users'));
  const rankingSnapshot = await getDocs(collection(db, 'ranking'));

  const rankingMap = new Map();
  rankingSnapshot.docs.forEach((docItem) => {
    rankingMap.set(docItem.id, docItem.data());
  });

  if (usersSnapshot.empty) {
    usersList.innerHTML = '<p>Nenhum usuário cadastrado.</p>';
    return;
  }

  usersList.innerHTML = '';

  usersSnapshot.docs.forEach((docItem) => {
    const userId = docItem.id;
    const userData = docItem.data();
    const rankingData = rankingMap.get(userId);
    const score = rankingData?.bestScore || 0;

    const isSelf = currentUser && currentUser.uid === userId;
    const banned = userData.banned === true;
    const removed = userData.removed === true;
    const isAdmin = userData.isAdmin === true;

    const item = document.createElement('div');
    item.className = 'admin-movie-item';
    item.innerHTML = `
      <strong>${userData.username || 'Usuário sem nome'}</strong>
      <p>Pontos: ${score}</p>
      <p>Admin: ${isAdmin ? 'Sim' : 'Não'}</p>
      <p>Status: ${removed ? 'Removido do app' : (banned ? 'Bloqueado' : 'Ativo')}</p>
      <div class="inline-actions">
        <button class="ghost-btn reset-score-btn" ${isSelf ? 'disabled' : ''}>Resetar pontos</button>
        <button class="ghost-btn toggle-ban-btn" ${isSelf ? 'disabled' : ''}>${banned ? 'Desbloquear' : 'Bloquear'}</button>
        <button class="danger-btn remove-user-btn" ${isSelf ? 'disabled' : ''}>Remover do app</button>
      </div>
    `;

    const resetBtn = item.querySelector('.reset-score-btn');
    const toggleBtn = item.querySelector('.toggle-ban-btn');
    const removeBtn = item.querySelector('.remove-user-btn');

    resetBtn.addEventListener('click', async () => {
      await resetUserScore(userId, userData.username || 'Usuário');
    });

    toggleBtn.addEventListener('click', async () => {
      await toggleUserBan(userId, userData);
    });

    removeBtn.addEventListener('click', async () => {
      const confirmed = window.confirm(`Tem certeza que deseja remover "${userData.username}" do app?`);
      if (!confirmed) return;
      await removeUserFromApp(userId, userData);
    });

    usersList.appendChild(item);
  });
}

async function resetUserScore(userId, username) {
  try {
    await setDoc(doc(db, 'ranking', userId), {
      username,
      bestScore: 0,
      updatedAt: serverTimestamp()
    }, { merge: true });

    showToast('Pontuação resetada com sucesso.');
    await loadUsers();
  } catch (error) {
    showToast('Erro ao resetar pontuação.');
    console.error(error);
  }
}

async function toggleUserBan(userId, userData) {
  try {
    await updateDoc(doc(db, 'users', userId), {
      banned: userData.banned === true ? false : true,
      removed: false
    });

    showToast(userData.banned === true ? 'Usuário desbloqueado.' : 'Usuário bloqueado.');
    await loadUsers();
  } catch (error) {
    showToast('Erro ao alterar status do usuário.');
    console.error(error);
  }
}

async function removeUserFromApp(userId, userData) {
  try {
    await updateDoc(doc(db, 'users', userId), {
      banned: true,
      removed: true,
      removedAt: serverTimestamp()
    });

    await setDoc(doc(db, 'ranking', userId), {
      username: userData.username || 'Usuário',
      bestScore: 0,
      hidden: true,
      updatedAt: serverTimestamp()
    }, { merge: true });

    showToast('Usuário removido do app.');
    await loadUsers();
  } catch (error) {
    showToast('Erro ao remover usuário do app.');
    console.error(error);
  }
}

logoutBtn.addEventListener('click', async () => {
  await signOut(auth);
  window.location.href = 'index.html';
});

onAuthStateChanged(auth, async (user) => {
  currentUser = user;

  if (!user) {
    window.location.href = 'index.html';
    return;
  }

  const userSnap = await getDoc(doc(db, 'users', user.uid));

  if (!userSnap.exists()) {
    window.location.href = 'index.html';
    return;
  }

  currentUserData = userSnap.data();

  if (currentUserData.isAdmin !== true || currentUserData.banned === true || currentUserData.removed === true) {
    window.location.href = 'index.html';
    return;
  }

  await loadUsers();
});