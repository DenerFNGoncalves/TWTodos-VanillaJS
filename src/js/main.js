// Todo app logic with translations, persistence, validation, delete and drag-from-handle reorder

const STORAGE_KEY = 'twTodos.v1';
const LANG_KEY = 'twTodos.lang';
const STORAGE_POPUP_KEY = 'twTodos.hideStoragePopup';
let todos = [];
let dragSrcIndex = null;
let lang = 'en';

const TRANSLATIONS = {
  en: {
    add: 'Add',
    placeholder: 'New todo (min 3 chars, start with capital)',
    feedback: 'Todo must be at least 3 chars and start with a capital letter.',
    total: 'Total:',
    drag: 'Drag to reorder',
    del: 'Delete todo',
    langFlag: '🇺🇸',
    langLabel: 'English',
    langIcon: '<svg class="flag-svg" width="20" height="14" viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" fill="#b22234"/><text x="5" y="14" font-size="10" fill="#fff">US</text></svg>',
    storageTitle: 'Storage notice',
    storageMsg: 'Your todos are stored using your browser storage. Do not clear browser storage if you want to keep your todos.',
    storageAction: 'OK, got it',
    storageDontShow: "Don't show again"
  },
  es: {
    add: 'Agregar',
    placeholder: 'Nuevo todo (mín 3 caracteres, empieza con mayúscula)',
    feedback: 'El todo debe tener al menos 3 caracteres y empezar con mayúscula.',
    total: 'Total:',
    drag: 'Arrastrar para reordenar',
    del: 'Eliminar todo',
    langFlag: '🇪🇸',
    langLabel: 'Español',
    langIcon: '<svg class="flag-svg" width="20" height="14" viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" fill="#aa151b"/><text x="5" y="14" font-size="10" fill="#fff">ES</text></svg>',
    storageTitle: 'Aviso de almacenamiento',
    storageMsg: 'Tus tareas se almacenan en el almacenamiento del navegador. No borres el almacenamiento si quieres conservar tus tareas.',
    storageAction: 'Entendido',
    storageDontShow: 'No mostrar de nuevo'
  },
  pt: {
    add: 'Adicionar',
    placeholder: 'Nova tarefa (min 3 caracteres, começa com maiúscula)',
    feedback: 'A tarefa deve ter ao menos 3 caracteres e começar com letra maiúscula.',
    total: 'Total:',
    drag: 'Arraste para reordenar',
    del: 'Excluir tarefa',
    langFlag: '🇧🇷',
    langLabel: 'Português (BR)',
    langIcon: '<svg class="flag-svg" width="20" height="14" viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" fill="#009c3b"/><text x="4" y="14" font-size="10" fill="#fff">BR</text></svg>',
    storageTitle: 'Aviso de armazenamento',
    storageMsg: 'Suas tarefas são salvas no armazenamento do navegador. Não limpe o armazenamento se quiser manter suas tarefas.',
    storageAction: 'Entendi',
    storageDontShow: 'Não mostrar novamente'
  }
};

function loadTodos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    todos = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(todos)) todos = [];
  } catch {
    todos = [];
  }
}

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function loadLang() {
  const stored = localStorage.getItem(LANG_KEY);
  if (stored && TRANSLATIONS[stored]) lang = stored;
  else lang = 'en';
  applyTranslations();
}

function setLanguage(l) {
  if (!TRANSLATIONS[l]) return;
  lang = l;
  localStorage.setItem(LANG_KEY, l);
  applyTranslations();
  // re-render to update tooltips/titles
  renderTodos();
}

function applyTranslations() {
  const t = TRANSLATIONS[lang];
  const addBtn = document.getElementById('addBtn');
  const input = document.getElementById('todoInput');
  const feedback = document.getElementById('todoFeedback');
  const flagEl = document.getElementById('currentLangFlag');
  const labelEl = document.getElementById('currentLangLabel');

  if (addBtn) addBtn.textContent = t.add;
  if (input) input.placeholder = t.placeholder;
  if (feedback) feedback.textContent = t.feedback;
  if (flagEl) flagEl.innerHTML = t.langIcon + ' ';
  if (labelEl) labelEl.textContent = t.langLabel;

  // populate language menu items (icon + label)
  document.querySelectorAll('.lang-select').forEach(btn => {
    const code = btn.getAttribute('data-lang');
    if (code && TRANSLATIONS[code]) btn.innerHTML = TRANSLATIONS[code].langIcon + ' ' + TRANSLATIONS[code].langLabel;
  });

  updateCount();
  // update any existing action titles (dispose+recreate handled by renderTodos on re-render)
}

function validateTodo(text) {
  if (typeof text !== 'string') return { ok: false, msg: TRANSLATIONS[lang].feedback };
  const trimmed = text.trim();
  if (trimmed.length < 3) return { ok: false, msg: TRANSLATIONS[lang].feedback };
  if (!/^[A-Z]/.test(trimmed)) return { ok: false, msg: TRANSLATIONS[lang].feedback };
  return { ok: true, value: trimmed };
}

function updateCount() {
  const el = document.getElementById('totalCount');
  if (el) el.textContent = `${TRANSLATIONS[lang].total} ${todos.length}`;
}

function disposeTooltips(root = document) {
  root.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
    const inst = bootstrap.Tooltip.getInstance(el);
    if (inst) {
      try { inst.hide(); } catch {}
      inst.dispose();
    }
  });
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function renderTodos() {
  const container = document.getElementById('todoList');
  if (!container) return;

  // dispose tooltips before removing nodes to avoid stuck tooltips
  disposeTooltips(document);

  container.innerHTML = '';
  todos.forEach((t, i) => {
    const card = document.createElement('div');
    card.className = 'card todo-card position-relative';
    card.dataset.index = i;

    const titles = TRANSLATIONS[lang];
    card.innerHTML = `
      <div class="card-actions" role="toolbar" aria-label="Todo actions">
        <div class="d-flex gap-2">
          <button class="btn btn-sm btn-light drag-handle" draggable="true" data-bs-toggle="tooltip" title="${titles.drag}" type="button" aria-label="${titles.drag}">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M3 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM3 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
            </svg>
          </button>
          <button class="btn btn-sm btn-danger delete-icon" data-bs-toggle="tooltip" title="${titles.del}" data-index="${i}" type="button" aria-label="${titles.del}">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M5.5 5.5A.5.5 0 0 1 6 5h4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5H6a.5.5 0 0 1-.5-.5v-7z"/>
              <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9.5A1.5 1.5 0 0 1 11.5 15h-7A1.5 1.5 0 0 1 3 13.5V4H2.5a1 1 0 1 1 0-2h3.646a1 1 0 0 1 .707.293l.353.353h2l.353-.353A1 1 0 0 1 10.854 1H14.5a1 1 0 0 1 0 2zM4.118 4L4 4.059V13.5a.5.5 0 0 0 .5.5H11.5a.5.5 0 0 0 .5-.5V4.059L11.882 4H4.118z"/>
            </svg>
          </button>
        </div>
      </div>
      <div class="card-body d-flex flex-column justify-content-between" style="min-height:120px;">
        <div class="todo-text mb-3">${escapeHtml(t)}</div>
      </div>
    `;

    // attach drop events to card
    card.addEventListener('dragover', onDragOver);
    card.addEventListener('dragenter', e => e.currentTarget.classList.add('drag-over'));
    card.addEventListener('dragleave', e => e.currentTarget.classList.remove('drag-over'));
    card.addEventListener('drop', onDrop);

    container.appendChild(card);

    // attach dragstart only to handle
    const handle = card.querySelector('.drag-handle');
    if (handle) {
      handle.addEventListener('dragstart', onHandleDragStart);
      handle.addEventListener('dragend', onDragEnd);
    }

    // init tooltips for the action buttons
    const tips = [].slice.call(card.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tips.forEach(el => new bootstrap.Tooltip(el));
  });

  // delete handlers
  document.querySelectorAll('.delete-icon').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = Number(e.currentTarget.dataset.index);
      if (!Number.isNaN(idx)) deleteTodo(idx);
    });
  });

  updateCount();
}

function onHandleDragStart(e) {
  const card = e.target.closest('.todo-card');
  if (!card) { e.preventDefault(); return; }
  dragSrcIndex = Number(card.dataset.index);
  try { e.dataTransfer.setData('text/plain', String(dragSrcIndex)); } catch {}
  e.dataTransfer.effectAllowed = 'move';
  card.classList.add('dragging');
  const handle = card.querySelector('.drag-handle');
  if (handle) handle.classList.add('dragging-handle');
}

function onDragOver(e) {
  e.preventDefault();
  try { e.dataTransfer.dropEffect = 'move'; } catch {}
  e.currentTarget.classList.add('drag-over');
}

function onDrop(e) {
  e.preventDefault();
  const target = e.currentTarget;
  const targetIndex = Number(target.dataset.index);
  if (dragSrcIndex === null || Number.isNaN(targetIndex)) { cleanupDrag(); return; }
  if (dragSrcIndex === targetIndex) { cleanupDrag(); return; }
  const [moved] = todos.splice(dragSrcIndex, 1);
  todos.splice(targetIndex, 0, moved);
  saveTodos();
  renderTodos();
  cleanupDrag();
}

function onDragEnd() { cleanupDrag(); }

function cleanupDrag() {
  dragSrcIndex = null;
  document.querySelectorAll('.dragging, .drag-over, .dragging-handle').forEach(el => {
    el.classList.remove('dragging', 'drag-over', 'dragging-handle');
  });
}

function addTodo(text) {
  const input = document.getElementById('todoInput');
  const feedback = document.getElementById('todoFeedback');
  const v = validateTodo(text);
  if (!v.ok) {
    if (input) input.classList.add('is-invalid');
    if (feedback) feedback.textContent = v.msg;
    return false;
  }
  if (input) input.classList.remove('is-invalid');
  todos.push(v.value);
  saveTodos();
  renderTodos();
  if (input) { input.value = ''; input.focus(); }
  return true;
}

function deleteTodo(index) {
  if (index >= 0 && index < todos.length) {
    todos.splice(index, 1);
    saveTodos();
    renderTodos();
  }
}

function showStoragePopup(opts = { force: false }) {
  // if not forced and user opted out, skip
  if (!opts.force && localStorage.getItem(STORAGE_POPUP_KEY) === '1') return;
  const t = TRANSLATIONS[lang];
  const modalEl = document.getElementById('storageModal');
  if (!modalEl) return;
  const titleEl = modalEl.querySelector('#storageModalLabel');
  const msgEl = modalEl.querySelector('#storageModalMsg');
  const btnOk = modalEl.querySelector('#storageModalOk');
  const dontLabel = modalEl.querySelector('#dontShowPopupLabel');
  const formCheck = modalEl.querySelector('.form-check');
  const cb = modalEl.querySelector('#dontShowPopup');

  if (titleEl) titleEl.textContent = t.storageTitle;
  if (msgEl) msgEl.textContent = t.storageMsg;
  if (btnOk) btnOk.textContent = t.storageAction;
  if (dontLabel) dontLabel.textContent = t.storageDontShow;

  // show checkbox only when not forced (page-load); hide when forced (info button)
  if (formCheck) {
    if (opts.force) {
      formCheck.classList.add('d-none');
      if (cb) cb.checked = false;
    } else {
      formCheck.classList.remove('d-none');
      if (cb) cb.checked = false;
    }
  }

  const modal = new bootstrap.Modal(modalEl, { backdrop: 'static' });
  modal.show();

  // persist preference only when popup was shown on page load (not forced)
  modalEl.addEventListener('hidden.bs.modal', () => {
    if (!opts.force) {
      const cb2 = document.getElementById('dontShowPopup');
      if (cb2 && cb2.checked) localStorage.setItem(STORAGE_POPUP_KEY, '1');
    }
  }, { once: true });
}

document.addEventListener('DOMContentLoaded', () => {
  // initialize any tooltips already on page
  const list = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  list.forEach(el => new bootstrap.Tooltip(el));

  loadTodos();
  loadLang(); // loadLang calls applyTranslations
  renderTodos();

  // show storage modal (translated)
  showStoragePopup();

  const form = document.getElementById('todoForm');
  const input = document.getElementById('todoInput');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (input) addTodo(input.value);
    });
  }
  if(input) {
    input.addEventListener('input', () => input.classList.remove('is-invalid'));
  }

  // language menu listeners
  document.querySelectorAll('.lang-select').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const l = e.currentTarget.getAttribute('data-lang');
      if (l) setLanguage(l);
    });
  });

  // storage info button: force-open popup (shows checkbox)
  const infoBtn = document.getElementById('storageInfoBtn');
  if (infoBtn) {
    infoBtn.addEventListener('click', () => showStoragePopup({ force: true }));
  }
});