/* ░░░ Админка «ДаЦветы» ░░░ */

// ── Авторизация по паролю ──
const loginEl = document.getElementById('login');
const adminEl = document.getElementById('admin');
const loginForm = document.getElementById('loginForm');
const loginErr = document.getElementById('loginErr');

function showAdmin() {
  loginEl.style.display = 'none';
  adminEl.style.display = '';
  initAdmin();
}

if (sessionStorage.getItem('dacvety_admin_ok') === '1') {
  showAdmin();
}

loginForm.addEventListener('submit', e => {
  e.preventDefault();
  const val = document.getElementById('pass').value;
  if (val === ADMIN_PASS) {
    sessionStorage.setItem('dacvety_admin_ok', '1');
    showAdmin();
  } else {
    loginErr.textContent = 'Неверный пароль';
    document.getElementById('pass').value = '';
  }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  sessionStorage.removeItem('dacvety_admin_ok');
  location.reload();
});

// ── Инициализация интерфейса ──
let imgData = ''; // dataURL загруженного фото

function initAdmin() {
  // селект категорий
  const sel = document.getElementById('f-cat');
  sel.innerHTML = CATEGORIES.map(c => `<option value="${c.id}">${c.label}</option>`).join('');

  renderList();

  // загрузка фото -> dataURL + превью
  const fileInput = document.getElementById('f-img');
  const nameInput = document.getElementById('f-imgname');
  const preview = document.getElementById('preview');

  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      imgData = reader.result;
      nameInput.value = '';
      preview.src = imgData;
      preview.classList.add('show');
    };
    reader.readAsDataURL(file);
  });
  nameInput.addEventListener('input', () => {
    if (nameInput.value) { imgData = ''; preview.classList.remove('show'); }
  });

  // форма добавления/редактирования
  document.getElementById('bouquetForm').addEventListener('submit', onSubmit);
  document.getElementById('cancelEdit').addEventListener('click', resetForm);

  // сброс к примерам
  document.getElementById('resetBtn').addEventListener('click', () => {
    if (confirm('Сбросить витрину к стартовым примерам? Текущие изменения будут удалены.')) {
      saveBouquets(DEFAULT_BOUQUETS.slice());
      renderList();
    }
  });
}

function onSubmit(e) {
  e.preventDefault();
  const id = document.getElementById('editId').value;
  const name = document.getElementById('f-name').value.trim();
  const category = document.getElementById('f-cat').value;
  const composition = document.getElementById('f-comp').value.trim();
  const price = Number(document.getElementById('f-price').value);
  const imgname = document.getElementById('f-imgname').value.trim();
  const img = imgData || imgname || '';

  if (!name || !price) { alert('Заполните название и цену'); return; }

  const list = loadBouquets();
  if (id) {
    const b = list.find(x => x.id === id);
    if (b) { b.name = name; b.category = category; b.composition = composition; b.price = price; if (img) b.img = img; }
  } else {
    list.push({ id: 'b' + Date.now(), name, category, composition, price, img, hidden: false });
  }
  saveBouquets(list);
  resetForm();
  renderList();
}

function resetForm() {
  const f = document.getElementById('bouquetForm');
  f.reset();
  document.getElementById('editId').value = '';
  imgData = '';
  document.getElementById('preview').classList.remove('show');
  document.getElementById('formTitle').textContent = 'Добавить букет';
  document.getElementById('submitBtn').textContent = 'Добавить букет';
  document.getElementById('cancelEdit').style.display = 'none';
}

function startEdit(id) {
  const b = loadBouquets().find(x => x.id === id);
  if (!b) return;
  document.getElementById('editId').value = b.id;
  document.getElementById('f-name').value = b.name;
  document.getElementById('f-cat').value = b.category;
  document.getElementById('f-comp').value = b.composition;
  document.getElementById('f-price').value = b.price;
  const isData = String(b.img).startsWith('data:');
  document.getElementById('f-imgname').value = isData ? '' : b.img;
  imgData = isData ? b.img : '';
  const preview = document.getElementById('preview');
  if (b.img) { preview.src = b.img; preview.classList.add('show'); } else { preview.classList.remove('show'); }
  document.getElementById('formTitle').textContent = 'Редактировать букет';
  document.getElementById('submitBtn').textContent = 'Сохранить изменения';
  document.getElementById('cancelEdit').style.display = '';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleHidden(id) {
  const list = loadBouquets();
  const b = list.find(x => x.id === id);
  if (b) { b.hidden = !b.hidden; saveBouquets(list); renderList(); }
}

function removeBouquet(id) {
  if (!confirm('Удалить этот букет?')) return;
  saveBouquets(loadBouquets().filter(x => x.id !== id));
  renderList();
}

function renderList() {
  const root = document.getElementById('adminList');
  const list = loadBouquets();
  if (!list.length) { root.innerHTML = '<p class="hint">Букетов пока нет. Добавьте первый слева.</p>'; return; }
  root.innerHTML = list.map(b => `
    <div class="row ${b.hidden ? 'is-hidden' : ''}">
      <img class="row__img" src="${b.img || ''}" alt="" onerror="this.style.visibility='hidden'" />
      <div class="row__info">
        <div class="row__name">${esc(b.name)}</div>
        <div class="row__meta">${categoryLabel(b.category)} · ${b.hidden ? 'скрыт' : 'показан'}</div>
      </div>
      <span class="row__price">${formatPrice(b.price)}</span>
      <button class="icon-btn" title="Редактировать" onclick="startEdit('${b.id}')">✎</button>
      <button class="icon-btn" title="${b.hidden ? 'Показать' : 'Скрыть'}" onclick="toggleHidden('${b.id}')">${b.hidden ? '🙈' : '👁'}</button>
      <button class="icon-btn icon-btn--danger" title="Удалить" onclick="removeBouquet('${b.id}')">🗑</button>
    </div>`).join('');
}

function esc(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
