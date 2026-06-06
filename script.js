// ░░░ Header on scroll ░░░
const header = document.getElementById('header');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 30);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// ░░░ Mobile menu ░░░
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
burger.addEventListener('click', () => {
  burger.classList.toggle('active');
  nav.classList.toggle('open');
});
nav.querySelectorAll('.nav__link').forEach(link =>
  link.addEventListener('click', () => {
    burger.classList.remove('active');
    nav.classList.remove('open');
  })
);

// ░░░ Reveal on scroll ░░░
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ░░░ Vitrina filters ░░░
const filters = document.querySelectorAll('.filter');
const products = document.querySelectorAll('.product');
filters.forEach(btn => {
  btn.addEventListener('click', () => {
    filters.forEach(f => f.classList.remove('is-active'));
    btn.classList.add('is-active');
    const cat = btn.dataset.filter;
    products.forEach(p => {
      const show = cat === 'all' || p.dataset.category === cat;
      p.classList.toggle('is-hidden', !show);
    });
  });
});

// ░░░ Order modal ░░░
const modal = document.getElementById('modal');
const modalProduct = document.getElementById('modalProduct');
const modalBody = document.getElementById('modalBody');
const modalSuccess = document.getElementById('modalSuccess');
const commentField = document.getElementById('comment');
const form = document.getElementById('orderForm');

function openModal(name, price) {
  modalProduct.textContent = name ? `«${name}» — ${price}` : 'Авторский букет под ваш повод';
  if (commentField && name) commentField.value = `Букет «${name}». `;
  modalBody.classList.remove('hide');
  modalSuccess.classList.remove('show');
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('.js-order').forEach(btn => {
  btn.addEventListener('click', () => openModal(btn.dataset.bouquet, btn.dataset.price));
});
document.querySelectorAll('.js-close').forEach(el => el.addEventListener('click', closeModal));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ░░░ Order form submit ░░░
form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!form.checkValidity()) { form.reportValidity(); return; }
  // Here you would POST to your backend / CRM / Telegram bot.
  modalBody.classList.add('hide');
  modalSuccess.classList.add('show');
  form.reset();
});

// ░░░ Lead form (секция «Оставить заявку») ░░░
const leadForm = document.getElementById('leadForm');
const leadSuccess = document.getElementById('leadSuccess');
if (leadForm) {
  leadForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!leadForm.checkValidity()) { leadForm.reportValidity(); return; }
    // Here you would POST to your backend / CRM / Telegram bot.
    leadSuccess.classList.add('show');
    leadForm.reset();
    setTimeout(() => leadSuccess.classList.remove('show'), 5000);
  });
}

// ░░░ Set min date = today (на всех полях даты) ░░░
const today = new Date().toISOString().split('T')[0];
document.querySelectorAll('input[type="date"]').forEach(el => { el.min = today; });
