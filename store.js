/* ░░░ Общее хранилище данных (используется и витриной, и админкой) ░░░ */
const STORE_KEY = 'dacvety_bouquets_v2';        // бумпнули версию — подхватятся новые примеры
const ADMIN_PASS = 'dacvety2026';               // пароль для входа в админку — поменяйте здесь

/* Категории витрины.
   cover — фото-обложка карточки категории (можно поменять на любое фото). */
const CATEGORIES = [
  { id: 'pions',    label: 'Пионы',           tagline: 'Пышные и нежные',            cover: 'bouquet-1.jpg' },
  { id: 'roses',    label: 'Розы',            tagline: 'Классика на все случаи',      cover: 'bouquet-3.jpg' },
  { id: 'author',   label: 'Авторские',       tagline: 'Уникальные композиции',       cover: 'bouquet-2.jpg' },
  { id: 'mono',     label: 'Монобукеты',       tagline: 'Один цветок — целое настроение', cover: 'bouquet-6.jpg' },
  { id: 'seasonal', label: 'Сезонные',        tagline: 'Самые свежие и выгодные',     cover: 'bouquet-4.jpg' },
];

/* Демо-букеты. Замените фото/названия/цены в админке или здесь.
   Поля: id, name, category, composition (из чего букет), price, img, hidden. */
const DEFAULT_BOUQUETS = [
  // —— Пионы (6 — полная сетка) ——
  { id: 'p1', name: 'Малиновое облако', category: 'pions', composition: 'Малиновые пионы, жемчужный декор, пастельная упаковка', price: 5490, img: 'p1.jpg', hidden: false },
  { id: 'p2', name: 'Нежные пионы',  category: 'pions', composition: 'Розовые пионы, эвкалипт, крафт-упаковка',        price: 4990, img: 'p2.jpg', hidden: false },
  { id: 'p3', name: 'Коралловая нежность', category: 'pions', composition: 'Коралловые пионы, гербера, нигелла',       price: 6990, img: 'bouquet-2.jpg', hidden: false },
  { id: 'p4', name: 'Пионовый шёлк',  category: 'pions', composition: 'Пионовидные розы, эустома, эвкалипт',     price: 7490, img: 'p4.jpg', hidden: false },
  { id: 'p5', name: 'Белые пионы',   category: 'pions', composition: 'Светлые пионы, нигелла, жемчужный декор',  price: 5990, img: 'p5.jpg', hidden: false },
  { id: 'p6', name: 'Королевские пионы', category: 'pions', composition: 'Плотный букет коралловых пионов',       price: 9990, img: 'bouquet-1.jpg', hidden: false },

  // —— Розы ——
  { id: 'r1', name: 'Алый закат',     category: 'roses', composition: 'Красные розы, пионовидные розы, эвкалипт', price: 5990, img: 'bouquet-3.jpg', hidden: false },
  { id: 'r2', name: 'Для любимых',   category: 'roses', composition: 'Красные розы, эустома, эвкалипт',         price: 7490, img: 'bouquet-3.jpg', hidden: false },
  { id: 'r3', name: 'Розовый рассвет', category: 'roses', composition: 'Пионовидные розы, пастельная гамма',  price: 4990, img: 'p4.jpg', hidden: false },
  { id: 'r4', name: 'Бордо',          category: 'roses', composition: 'Бордовые розы, благородная упаковка',      price: 6490, img: 'bouquet-6.jpg', hidden: false },

  // —— Авторские ——
  { id: 'a1', name: 'Терракота',     category: 'author', composition: 'Гербера, коралловые пионы, гвоздика',    price: 5490, img: 'bouquet-2.jpg', hidden: false },
  { id: 'a2', name: 'Городской сад',  category: 'author', composition: 'Микс сезонных цветов и зелени',          price: 6990, img: 'bouquet-4.jpg', hidden: false },
  { id: 'a3', name: 'Пастель',        category: 'author', composition: 'Пастельные пионы и розы, жемчуг',         price: 5990, img: 'bouquet-1.jpg', hidden: false },
  { id: 'a4', name: 'Закатный',       category: 'author', composition: 'Тёплая кораллово-терракотовая гамма',  price: 7990, img: 'bouquet-4.jpg', hidden: false },

  // —— Монобукеты ——
  { id: 'm1', name: 'Моно-пионы',    category: 'mono', composition: 'Монобукет из коралловых пионов',         price: 4490, img: 'bouquet-6.jpg', hidden: false },
  { id: 'm2', name: 'Моно-розы',     category: 'mono', composition: 'Монобукет из роз одного оттенка',         price: 3990, img: 'bouquet-3.jpg', hidden: false },
  { id: 'm3', name: 'Моно-гербера',  category: 'mono', composition: 'Яркий монобукет из гербер',              price: 3490, img: 'bouquet-2.jpg', hidden: false },

  // —— Сезонные ——
  { id: 's1', name: 'Весенний',       category: 'seasonal', composition: 'Сезонные весенние цветы',             price: 4290, img: 'p2.jpg', hidden: false },
  { id: 's2', name: 'Летний микс',    category: 'seasonal', composition: 'Яркий микс сезонных цветов',        price: 4890, img: 'bouquet-2.jpg', hidden: false },
  { id: 's3', name: 'Осенний',        category: 'seasonal', composition: 'Тёплые осенние оттенки и сухоцветы',    price: 5290, img: 'bouquet-4.jpg', hidden: false },
];

function loadBouquets() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* ignore */ }
  saveBouquets(DEFAULT_BOUQUETS);
  return DEFAULT_BOUQUETS.slice();
}

function saveBouquets(list) {
  localStorage.setItem(STORE_KEY, JSON.stringify(list));
}

function categoryLabel(id) {
  const c = CATEGORIES.find(c => c.id === id);
  return c ? c.label : id;
}

function formatPrice(n) {
  return Number(n).toLocaleString('ru-RU') + ' ₽';
}
