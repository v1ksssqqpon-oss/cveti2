/* ░░░ Витрина «ДаЦветы» ░░░ */

const CAT_ICONS = { pions: '🌸', roses: '🌹', author: '💐', mono: '🌷', seasonal: '🍂' };

// —— Полезное: уход за букетом (свой для каждой категории) ——
const CARE_TIPS = {
  pions:    ['Подрезайте стебли наискось каждые 2 дня', 'Меняйте воду ежедневно и держите вдали от солнца', 'Пионы любят прохладу — полностью раскроются за 1–2 дня'],
  roses:    ['Обновляйте срез под струёй воды раз в 2 дня', 'Удалите нижние листья, чтобы вода дольше была чистой', 'Прохладная вода и комната продлят свежесть роз'],
  author:   ['Меняйте воду раз в день', 'Держите букет вдали от фруктов и батарей', 'Подрезайте стебли наискось острым ножом'],
  mono:     ['Подрезайте стебли каждые 2 дня', 'Мойте вазу и наливайте свежую воду', 'Избегайте прямого солнца и сквозняков'],
  seasonal: ['Сезонные цветы любят свежую прохладную воду', 'Подрезайте стебли под углом', 'Убирайте увядшие бутоны, чтобы продлить букет'],
};
const CARE_TIPS_DEFAULT = ['Меняйте воду каждый день', 'Подрезайте стебли наискось раз в 2 дня', 'Держите вдали от солнца, фруктов и сквозняков'];

function usefulHtml(catId) {
  const tips = CARE_TIPS[catId] || CARE_TIPS_DEFAULT;
  return '<span class="prod__useful-title">❀ Полезное · уход за букетом</span><ul class="prod__useful-list">'
    + tips.map(t => `<li>${escapeHtml(t)}</li>`).join('') + '</ul>';
}

// —— Появление при прокрутке (reveal) ——
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
function observeReveal(el) { io.observe(el); }

function plural(n) {
  const a = Math.abs(n) % 100, b = a % 10;
  if (a > 10 && a < 20) return 'букетов';
  if (b > 1 && b < 5) return 'букета';
  if (b === 1) return 'букет';
  return 'букетов';
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/* ═══ УРОВЕНЬ 1 — КАРТОЧКИ КАТЕГОРИЙ ═══ */
function renderCategories() {
  const grid = document.getElementById('catGrid');
  if (!grid) return;
  const all = loadBouquets().filter(b => !b.hidden);
  grid.innerHTML = '';

  CATEGORIES.forEach((cat, i) => {
    const items = all.filter(b => b.category === cat.id);
    if (!items.length) return; // пустые категории не показываем
    const shots = items.slice(0, 3);
    const layers = shots
      .map((b, idx) => ({ b, depth: idx }))
      .sort((a, c) => c.depth - a.depth)
      .map(o => `<span class="cat-stack__layer" style="--i:${o.depth}"><img src="images/${escapeHtml(o.b.img)}" alt="${escapeHtml(o.b.name || cat.label)}" loading="lazy" onerror="this.classList.add('img--placeholder')" /></span>`)
      .join('');

    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'cat-card reveal';
    card.style.transitionDelay = (i % 3) * 0.09 + 's';
    card.dataset.cat = cat.id;
    card.innerHTML = `
      <div class="cat-card__media">
        <div class="cat-stack">${layers}</div>
      </div>
      <span class="cat-card__badge">${CAT_ICONS[cat.id] || '❀'}</span>
      <div class="cat-card__body">
        <span class="cat-card__tagline">${escapeHtml(cat.tagline || '')}</span>
        <h3 class="cat-card__name">${escapeHtml(cat.label)}</h3>
        <span class="cat-card__count">${items.length} ${plural(items.length)} <i>→</i></span>
      </div>`;
    card.addEventListener('click', () => openCatalog(cat.id));
    grid.appendChild(card);
    observeReveal(card);
  });
}

/* ═══ УРОВЕНЬ 2 — КАТАЛОГ КАТЕГОРИИ (6 фото) ═══ */
const catalog = document.getElementById('catalog');

function openCatalog(catId) {
  const cat = CATEGORIES.find(c => c.id === catId);
  const items = loadBouquets().filter(b => !b.hidden && b.category === catId);
  document.getElementById('catEyebrow').textContent = 'Витрина · ' + items.length + ' ' + plural(items.length);
  document.getElementById('catTitle').textContent = cat ? cat.label : 'Категория';

  const grid = document.getElementById('catalogGrid');
  grid.innerHTML = items.map(b => `
    <article class="tile" data-id="${b.id}" role="button" tabindex="0" aria-label="${escapeHtml(b.name)}">
      <div class="tile__media">
        <img src="images/${escapeHtml(b.img)}" alt="${escapeHtml(b.name)}" loading="lazy" onerror="this.classList.add('img--placeholder')" />
        <span class="tile__zoom">Подробнее</span>
      </div>
      <div class="tile__body">
        <h4 class="tile__title">${escapeHtml(b.name)}</h4>
        <p class="tile__desc">${escapeHtml(b.composition)}</p>
        <div class="tile__footer">
          <span class="tile__price">${formatPrice(b.price)}</span>
        </div>
      </div>
    </article>`).join('');

  grid.querySelectorAll('.tile').forEach(t => {
    const open = () => openProduct(t.dataset.id);
    t.addEventListener('click', open);
    t.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  });

  catalog.classList.add('open');
  catalog.scrollTop = 0;
  const dialog = catalog.querySelector('.sheet__dialog');
  if (dialog) dialog.scrollTop = 0;
  document.body.style.overflow = 'hidden';
  // ступенчатое появление плиток
  requestAnimationFrame(() => {
    grid.querySelectorAll('.tile').forEach((t, i) => setTimeout(() => t.classList.add('in'), 40 + i * 55));
  });
}

function closeCatalog() {
  catalog.classList.remove('open');
  if (!modal.classList.contains('open')) document.body.style.overflow = '';
}

/* ═══ УРОВЕНЬ 3 — КАРТОЧКА БУКЕТА + ЗАКАЗ ═══ */
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modalBody');
const modalSuccess = document.getElementById('modalSuccess');
const orderForm = document.getElementById('orderForm');

function openProduct(id) {
  const b = loadBouquets().find(x => x.id === id);
  if (!b) return;
  document.getElementById('modalName').textContent = b.name;
  document.getElementById('modalComp').textContent = b.composition || '';
  document.getElementById('modalPrice').textContent = formatPrice(b.price);
  const useful = document.getElementById('modalUseful');
  if (useful) useful.innerHTML = usefulHtml(b.category);
  const img = document.getElementById('modalImg');
  img.classList.remove('img--placeholder');
  img.src = b.img ? 'images/' + b.img : '';
  const c = document.getElementById('comment');
  if (c) c.value = `Букет «${b.name}» (${formatPrice(b.price)}). `;
  modalBody.classList.remove('hide');
  modalSuccess.classList.remove('show');
  modal.classList.add('open');
  const dialog = modal.querySelector('.modal__dialog');
  if (dialog) dialog.scrollTop = 0;
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('open');
  // если под ним открыт каталог — остаёмся в нём, иначе разблокируем скролл
  if (!catalog.classList.contains('open')) document.body.style.overflow = '';
}

// Кнопки закрытия
document.querySelectorAll('.js-close').forEach(el => el.addEventListener('click', closeModal));
document.querySelectorAll('.js-cat-close').forEach(el => el.addEventListener('click', closeCatalog));
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (modal.classList.contains('open')) closeModal();
  else if (catalog.classList.contains('open')) closeCatalog();
});

// Отправка заказа
orderForm.addEventListener('submit', e => {
  e.preventDefault();
  if (!orderForm.checkValidity()) { orderForm.reportValidity(); return; }
  // TODO: отправка в Telegram-бот / CRM / на почту
  modalBody.classList.add('hide');
  modalSuccess.classList.add('show');
  orderForm.reset();
});

/* ═══ Форма заявки (секция) ═══ */
const leadForm = document.getElementById('leadForm');
const leadSuccess = document.getElementById('leadSuccess');
leadForm.addEventListener('submit', e => {
  e.preventDefault();
  if (!leadForm.checkValidity()) { leadForm.reportValidity(); return; }
  leadSuccess.classList.add('show');
  leadForm.reset();
  setTimeout(() => leadSuccess.classList.remove('show'), 5000);
});

/* ═══ Header / меню / reveal / даты ═══ */
const header = document.getElementById('header');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 30);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
burger.addEventListener('click', () => { burger.classList.toggle('active'); nav.classList.toggle('open'); });
nav.querySelectorAll('.nav__link').forEach(l => l.addEventListener('click', () => { burger.classList.remove('active'); nav.classList.remove('open'); }));

const today = new Date().toISOString().split('T')[0];
document.querySelectorAll('input[type="date"]').forEach(el => { el.min = today; });

/* ═══ Старт ═══ */
renderCategories();
document.querySelectorAll('.reveal').forEach(el => observeReveal(el));
