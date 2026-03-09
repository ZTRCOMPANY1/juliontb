import { auth, db } from './firebase-config.js';
import {
  onAuthStateChanged,
  signOut
} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';

import {
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  deleteDoc,
  updateDoc,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';

const movieDraftForm = document.getElementById('movieDraftForm');
const draftQuestionForm = document.getElementById('draftQuestionForm');
const saveMovieWithQuestionsBtn = document.getElementById('saveMovieWithQuestionsBtn');

const movieTitleInput = document.getElementById('movieTitle');
const movieImageInput = document.getElementById('movieImage');
const movieDescriptionInput = document.getElementById('movieDescription');

const draftQuestionInput = document.getElementById('draftQuestionInput');
const draftOption1 = document.getElementById('draftOption1');
const draftOption2 = document.getElementById('draftOption2');
const draftOption3 = document.getElementById('draftOption3');
const draftOption4 = document.getElementById('draftOption4');
const draftCorrectAnswer = document.getElementById('draftCorrectAnswer');
const addDraftQuestionBtn = document.getElementById('addDraftQuestionBtn');
const cancelDraftEditBtn = document.getElementById('cancelDraftEditBtn');
const draftQuestionsList = document.getElementById('draftQuestionsList');
const draftCount = document.getElementById('draftCount');

const adminMovieList = document.getElementById('adminMovieList');

const questionManagerSection = document.getElementById('questionManagerSection');
const questionManagerTitle = document.getElementById('questionManagerTitle');
const existingQuestionsList = document.getElementById('existingQuestionsList');

const existingEditSection = document.getElementById('existingEditSection');
const existingQuestionForm = document.getElementById('existingQuestionForm');
const existingQuestionMovieId = document.getElementById('existingQuestionMovieId');
const existingQuestionId = document.getElementById('existingQuestionId');
const existingQuestionInput = document.getElementById('existingQuestionInput');
const existingOption1 = document.getElementById('existingOption1');
const existingOption2 = document.getElementById('existingOption2');
const existingOption3 = document.getElementById('existingOption3');
const existingOption4 = document.getElementById('existingOption4');
const existingCorrectAnswer = document.getElementById('existingCorrectAnswer');
const cancelExistingEditBtn = document.getElementById('cancelExistingEditBtn');

const logoutBtn = document.getElementById('logoutBtn');
const toast = document.getElementById('toast');

let currentUser = null;
let currentIsAdmin = false;
let movies = [];
let draftQuestions = [];
let editingDraftIndex = -1;
let currentManagedMovieId = '';
let currentManagedMovieTitle = '';

function showToast(message) {
  toast.textContent = message;
  toast.classList.remove('hidden');

  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3000);
}

function resetDraftQuestionForm() {
  draftQuestionForm.reset();
  editingDraftIndex = -1;
  addDraftQuestionBtn.textContent = 'Adicionar ao rascunho';
  cancelDraftEditBtn.classList.add('hidden');
}

function resetMovieDraft() {
  movieDraftForm.reset();
  draftQuestionForm.reset();
  draftQuestions = [];
  editingDraftIndex = -1;
  renderDraftQuestions();
  resetDraftQuestionForm();
}

function renderDraftQuestions() {
  draftCount.textContent = String(draftQuestions.length);

  if (!draftQuestions.length) {
    draftQuestionsList.className = 'question-admin-list empty-state';
    draftQuestionsList.innerHTML = '<p>Nenhuma pergunta adicionada ao rascunho ainda.</p>';
    return;
  }

  draftQuestionsList.className = 'question-admin-list';
  draftQuestionsList.innerHTML = '';

  draftQuestions.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'question-admin-item';

    const optionsHtml = item.options
      .map((option, optionIndex) => {
        const correct = optionIndex === item.correctIndex ? ' <span class="correct-label">(correta)</span>' : '';
        return `<li>${option}${correct}</li>`;
      })
      .join('');

    div.innerHTML = `
      <strong>${index + 1}. ${item.question}</strong>
      <ol>${optionsHtml}</ol>
      <div class="inline-actions" style="margin-top:12px;">
        <button class="ghost-btn edit-draft-btn" data-index="${index}">Editar</button>
        <button class="danger-btn remove-draft-btn" data-index="${index}">Remover</button>
      </div>
    `;

    draftQuestionsList.appendChild(div);
  });

  document.querySelectorAll('.edit-draft-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const index = Number(button.getAttribute('data-index'));
      editDraftQuestion(index);
    });
  });

  document.querySelectorAll('.remove-draft-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const index = Number(button.getAttribute('data-index'));
      removeDraftQuestion(index);
    });
  });
}

function editDraftQuestion(index) {
  const item = draftQuestions[index];
  if (!item) return;

  editingDraftIndex = index;
  draftQuestionInput.value = item.question;
  draftOption1.value = item.options[0];
  draftOption2.value = item.options[1];
  draftOption3.value = item.options[2];
  draftOption4.value = item.options[3];
  draftCorrectAnswer.value = String(item.correctIndex);

  addDraftQuestionBtn.textContent = 'Salvar edição da pergunta';
  cancelDraftEditBtn.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function removeDraftQuestion(index) {
  draftQuestions.splice(index, 1);
  renderDraftQuestions();

  if (editingDraftIndex === index) {
    resetDraftQuestionForm();
  } else if (editingDraftIndex > index) {
    editingDraftIndex -= 1;
  }

  showToast('Pergunta removida do rascunho.');
}

async function loadMovies() {
  adminMovieList.innerHTML = '<p>Carregando filmes...</p>';

  const snapshot = await getDocs(collection(db, 'movies'));
  movies = snapshot.docs.map((docItem) => ({
    id: docItem.id,
    ...docItem.data()
  }));

  if (!movies.length) {
    adminMovieList.innerHTML = '<p>Nenhum filme cadastrado.</p>';
    return;
  }

  adminMovieList.innerHTML = '';

  for (const movie of movies) {
    const questionsSnapshot = await getDocs(collection(db, 'movies', movie.id, 'questions'));
    const totalQuestions = questionsSnapshot.size;

    const item = document.createElement('div');
    item.className = 'admin-movie-item';
    item.innerHTML = `
      <strong>${movie.title}</strong>
      <span>${movie.description}</span>
      <p style="margin:8px 0 14px;">Perguntas cadastradas: ${totalQuestions}</p>
      <div class="inline-actions">
        <button class="ghost-btn manage-movie-btn" data-id="${movie.id}" data-title="${movie.title}">
          Ver perguntas
        </button>
        <button class="danger-btn remove-movie-btn" data-id="${movie.id}" data-title="${movie.title}">
          Remover filme
        </button>
      </div>
    `;

    adminMovieList.appendChild(item);
  }

  document.querySelectorAll('.manage-movie-btn').forEach((button) => {
    button.addEventListener('click', async () => {
      const movieId = button.getAttribute('data-id');
      const movieTitle = button.getAttribute('data-title');
      await openMovieQuestionManager(movieId, movieTitle);
    });
  });

  document.querySelectorAll('.remove-movie-btn').forEach((button) => {
    button.addEventListener('click', async () => {
      const movieId = button.getAttribute('data-id');
      const movieTitle = button.getAttribute('data-title');

      const confirmed = window.confirm(`Tem certeza que deseja remover o filme "${movieTitle}"? Isso vai apagar o filme e todas as perguntas dele.`);
      if (!confirmed) return;

      await removeMovie(movieId, movieTitle);
    });
  });
}

async function removeMovie(movieId, movieTitle) {
  if (!currentIsAdmin) {
    showToast('Acesso negado.');
    return;
  }

  try {
    const questionsRef = collection(db, 'movies', movieId, 'questions');
    const questionsSnapshot = await getDocs(questionsRef);

    for (const questionDoc of questionsSnapshot.docs) {
      await deleteDoc(doc(db, 'movies', movieId, 'questions', questionDoc.id));
    }

    await deleteDoc(doc(db, 'movies', movieId));

    if (currentManagedMovieId === movieId) {
      questionManagerSection.classList.add('hidden');
      existingEditSection.classList.add('hidden');
      currentManagedMovieId = '';
      currentManagedMovieTitle = '';
    }

    showToast(`Filme "${movieTitle}" removido com sucesso.`);
    await loadMovies();
  } catch (error) {
    showToast('Erro ao remover filme.');
    console.error(error);
  }
}

async function openMovieQuestionManager(movieId, movieTitle) {
  currentManagedMovieId = movieId;
  currentManagedMovieTitle = movieTitle;
  questionManagerTitle.textContent = `Perguntas de ${movieTitle}`;
  questionManagerSection.classList.remove('hidden');
  existingEditSection.classList.add('hidden');

  existingQuestionsList.innerHTML = '<p>Carregando perguntas...</p>';

  const snapshot = await getDocs(collection(db, 'movies', movieId, 'questions'));
  const questions = snapshot.docs.map((docItem) => ({
    id: docItem.id,
    ...docItem.data()
  }));

  if (!questions.length) {
    existingQuestionsList.innerHTML = '<p>Nenhuma pergunta cadastrada nesse filme.</p>';
    return;
  }

  existingQuestionsList.innerHTML = '';

  questions.forEach((item, index) => {
    const optionsHtml = (item.options || [])
      .map((option, optionIndex) => {
        const correct = optionIndex === item.correctIndex ? ' <span class="correct-label">(correta)</span>' : '';
        return `<li>${option}${correct}</li>`;
      })
      .join('');

    const div = document.createElement('div');
    div.className = 'question-admin-item';
    div.innerHTML = `
      <strong>${index + 1}. ${item.question}</strong>
      <ol>${optionsHtml}</ol>
      <div class="inline-actions" style="margin-top:12px;">
        <button
          class="ghost-btn edit-existing-btn"
          data-movie-id="${movieId}"
          data-id="${item.id}">
          Editar
        </button>
        <button
          class="danger-btn remove-existing-btn"
          data-movie-id="${movieId}"
          data-id="${item.id}">
          Remover
        </button>
      </div>
    `;

    existingQuestionsList.appendChild(div);

    div.querySelector('.edit-existing-btn').addEventListener('click', () => {
      openExistingQuestionEditor(movieId, item);
    });

    div.querySelector('.remove-existing-btn').addEventListener('click', async () => {
      const confirmed = window.confirm('Tem certeza que deseja remover esta pergunta?');
      if (!confirmed) return;

      await removeExistingQuestion(movieId, item.id);
    });
  });

  questionManagerSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function openExistingQuestionEditor(movieId, item) {
  existingQuestionMovieId.value = movieId;
  existingQuestionId.value = item.id;
  existingQuestionInput.value = item.question || '';
  existingOption1.value = item.options?.[0] || '';
  existingOption2.value = item.options?.[1] || '';
  existingOption3.value = item.options?.[2] || '';
  existingOption4.value = item.options?.[3] || '';
  existingCorrectAnswer.value = String(item.correctIndex ?? '');

  existingEditSection.classList.remove('hidden');
  existingEditSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function removeExistingQuestion(movieId, questionId) {
  if (!currentIsAdmin) {
    showToast('Acesso negado.');
    return;
  }

  try {
    await deleteDoc(doc(db, 'movies', movieId, 'questions', questionId));
    showToast('Pergunta removida com sucesso.');
    await openMovieQuestionManager(movieId, currentManagedMovieTitle);
    await loadMovies();
  } catch (error) {
    showToast('Erro ao remover pergunta.');
    console.error(error);
  }
}

draftQuestionForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const question = draftQuestionInput.value.trim();
  const options = [
    draftOption1.value.trim(),
    draftOption2.value.trim(),
    draftOption3.value.trim(),
    draftOption4.value.trim()
  ];
  const correctIndex = Number(draftCorrectAnswer.value);

  if (!question) {
    showToast('Digite a pergunta.');
    return;
  }

  if (options.some((option) => !option)) {
    showToast('Preencha todas as opções.');
    return;
  }

  if (Number.isNaN(correctIndex)) {
    showToast('Escolha a alternativa correta.');
    return;
  }

  const payload = {
    question,
    options,
    correctIndex
  };

  if (editingDraftIndex >= 0) {
    draftQuestions[editingDraftIndex] = payload;
    showToast('Pergunta do rascunho editada com sucesso.');
  } else {
    draftQuestions.push(payload);
    showToast('Pergunta adicionada ao rascunho.');
  }

  renderDraftQuestions();
  resetDraftQuestionForm();
});

cancelDraftEditBtn.addEventListener('click', () => {
  resetDraftQuestionForm();
});

saveMovieWithQuestionsBtn.addEventListener('click', async () => {
  if (!currentIsAdmin) {
    showToast('Acesso negado.');
    return;
  }

  const title = movieTitleInput.value.trim();
  const image = movieImageInput.value.trim();
  const description = movieDescriptionInput.value.trim();

  if (!title || !image || !description) {
    showToast('Preencha os dados do filme.');
    return;
  }

  if (!draftQuestions.length) {
    showToast('Adicione pelo menos uma pergunta antes de salvar o filme.');
    return;
  }

  try {
    const movieRef = await addDoc(collection(db, 'movies'), {
      title,
      image,
      description,
      createdAt: serverTimestamp()
    });

    for (const item of draftQuestions) {
      await addDoc(collection(db, 'movies', movieRef.id, 'questions'), {
        question: item.question,
        options: item.options,
        correctIndex: item.correctIndex,
        createdAt: serverTimestamp()
      });
    }

    showToast('Filme e perguntas salvos com sucesso.');
    resetMovieDraft();
    await loadMovies();
  } catch (error) {
    showToast('Erro ao salvar filme com perguntas.');
    console.error(error);
  }
});

existingQuestionForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!currentIsAdmin) {
    showToast('Acesso negado.');
    return;
  }

  const movieId = existingQuestionMovieId.value;
  const questionId = existingQuestionId.value;
  const question = existingQuestionInput.value.trim();
  const options = [
    existingOption1.value.trim(),
    existingOption2.value.trim(),
    existingOption3.value.trim(),
    existingOption4.value.trim()
  ];
  const correctIndex = Number(existingCorrectAnswer.value);

  if (!movieId || !questionId) {
    showToast('Pergunta inválida para edição.');
    return;
  }

  if (!question || options.some((option) => !option) || Number.isNaN(correctIndex)) {
    showToast('Preencha todos os campos da pergunta.');
    return;
  }

  try {
    await updateDoc(doc(db, 'movies', movieId, 'questions', questionId), {
      question,
      options,
      correctIndex
    });

    showToast('Pergunta atualizada com sucesso.');
    existingQuestionForm.reset();
    existingEditSection.classList.add('hidden');
    await openMovieQuestionManager(movieId, currentManagedMovieTitle);
  } catch (error) {
    showToast('Erro ao atualizar pergunta.');
    console.error(error);
  }
});

cancelExistingEditBtn.addEventListener('click', () => {
  existingQuestionForm.reset();
  existingEditSection.classList.add('hidden');
});

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

  currentIsAdmin = userSnap.data().isAdmin === true;

  if (!currentIsAdmin) {
    window.location.href = 'index.html';
    return;
  }

  renderDraftQuestions();
  await loadMovies();
});