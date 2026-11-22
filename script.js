// ===== 1. DARK / LIGHT MODE (saved in the browser) =====
const root = document.documentElement;
const themeBtn = document.getElementById('themeToggle');

function applyTheme(theme) {
  root.setAttribute('data-bs-theme', theme);
  themeBtn.textContent = theme === 'dark' ? '☀️ Light' : '🌙 Dark';
}
function getSavedTheme() {
  try { return localStorage.getItem('theme'); } catch (e) { return null; }
}
const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
applyTheme(getSavedTheme() || (prefersDark ? 'dark' : 'light'));

themeBtn.addEventListener('click', () => {
  const next = root.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  try { localStorage.setItem('theme', next); } catch (e) {}
});

// ===== 2. SMOOTH SCROLL + CLOSE MOBILE MENU =====
const menu = document.getElementById('menu');
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href');
    if (id.length < 2) { e.preventDefault(); return; }   // placeholder links like href="#"
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
    if (menu.classList.contains('show')) bootstrap.Collapse.getOrCreateInstance(menu).hide();
  });
});

// ===== 3. HIGHLIGHT ACTIVE NAV LINK WHILE SCROLLING =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
function updateActiveLink() {
  let current = 'home';
  sections.forEach(sec => { if (window.scrollY >= sec.offsetTop - 120) current = sec.id; });
  navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current));
}
window.addEventListener('scroll', updateActiveLink);
updateActiveLink();

// ===== 4. TYPING TEXT ANIMATION =====
const words = ['Web Developer', 'UI Designer', 'Creative Thinker', 'Lifelong Learner'];
const typedEl = document.getElementById('typed');
let wordIndex = 0, charIndex = 0, deleting = false;
function type() {
  const word = words[wordIndex];
  charIndex += deleting ? -1 : 1;
  typedEl.textContent = word.substring(0, charIndex);
  let delay = deleting ? 50 : 100;
  if (!deleting && charIndex === word.length) { deleting = true; delay = 1500; }
  else if (deleting && charIndex === 0) { deleting = false; wordIndex = (wordIndex + 1) % words.length; delay = 400; }
  setTimeout(type, delay);
}
type();

// ===== 5. SCROLL REVEAL + SKILL BARS =====
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('show');
    entry.target.querySelectorAll('.fill').forEach(bar => bar.style.width = bar.dataset.level + '%');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ===== 6. TOAST MESSAGE =====
const toast = document.getElementById('toast');
function showToast(text) {
  toast.textContent = text;
  toast.classList.add('visible');
  setTimeout(() => toast.classList.remove('visible'), 2500);
}
document.getElementById('cvBtn').addEventListener('click', () => showToast('📄 Downloading CV...'));
document.querySelectorAll('.demo-link').forEach(b =>
  b.addEventListener('click', () => showToast('🚧 Add your real project link here!')));

// ===== 7. CONTACT FORM VALIDATION =====
const form = document.getElementById('contactForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');
const success = document.getElementById('formSuccess');

const rules = [
  [nameInput, v => v.trim().length >= 2],
  [emailInput, v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())],
  [messageInput, v => v.trim().length >= 10]
];
function check(input, isValid) {
  const ok = isValid(input.value);
  input.classList.toggle('is-invalid', !ok);
  input.classList.toggle('is-valid', ok);
  return ok;
}
rules.forEach(([input, isValid]) => input.addEventListener('input', () => { check(input, isValid); success.classList.add('d-none'); }));

form.addEventListener('submit', e => {
  e.preventDefault();
  const allValid = rules.map(([input, isValid]) => check(input, isValid)).every(Boolean);
  if (!allValid) return;
  success.classList.remove('d-none');
  form.reset();
  rules.forEach(([input]) => input.classList.remove('is-valid'));
  showToast('✅ Message sent!');
});
