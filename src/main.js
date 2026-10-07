import './style.css';

// WhatsApp de Solange: +55 61 9817-1503 (55 + DDD + número, só dígitos).
const WHATSAPP_NUMBER = '5561981715031';
const WHATSAPP_MESSAGE = 'Olá, Solange! Gostaria de agendar uma conversa.';
const ADDRESS = 'SHIN QI 7, Conjunto 15, Casa 05, Lago Norte, Brasília, DF, 71515-150';

const q = encodeURIComponent(ADDRESS);
const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${q}`;
const wazeUrl = `https://waze.com/ul?q=${q}&navigate=yes`;

document.querySelectorAll('[data-wa]').forEach((a) => {
  a.href = waUrl;
  a.target = '_blank';
  a.rel = 'noopener';
});
document.getElementById('btn-maps').href = mapsUrl;
document.getElementById('btn-waze').href = wazeUrl;
document.getElementById('ano').textContent = new Date().getFullYear();

// Header: translúcido ao rolar
const header = document.querySelector('.header');
const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 40);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Menu mobile
const burger = document.querySelector('.burger');
const nav = document.getElementById('menu');
const setMenu = (open) => {
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  nav.classList.toggle('is-open', open);
  document.body.classList.toggle('no-scroll', open);
};
burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (e) => e.key === 'Escape' && setMenu(false));

// Animações de entrada (stagger por irmãos)
const reveals = document.querySelectorAll('.reveal');
reveals.forEach((el) => {
  const idx = [...el.parentElement.children].filter((c) => c.classList.contains('reveal')).indexOf(el);
  el.style.setProperty('--d', `${Math.max(idx, 0) * 90}ms`);
});
const io = new IntersectionObserver(
  (entries) =>
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    }),
  { threshold: 0.12 }
);
reveals.forEach((el) => io.observe(el));

// Destaque da seção ativa no menu
const links = [...nav.querySelectorAll('ul a')];
const sections = links.map((l) => document.querySelector(l.getAttribute('href'))).filter(Boolean);
const spy = new IntersectionObserver(
  (entries) =>
    entries.forEach((e) => {
      if (e.isIntersecting) {
        links.forEach((l) => l.classList.toggle('is-active', l.getAttribute('href') === `#${e.target.id}`));
      }
    }),
  { rootMargin: '-45% 0px -50% 0px' }
);
sections.forEach((s) => spy.observe(s));

// Mapa: iframe criado só ao entrar na viewport; camada de clique evita sequestrar o scroll
const map = document.getElementById('map');
const cover = map.querySelector('.map__cover');
const mapObs = new IntersectionObserver(
  (entries) => {
    if (!entries[0].isIntersecting) return;
    mapObs.disconnect();
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.google.com/maps?q=${q}&output=embed`;
    iframe.title = 'Mapa do local de atendimento — Lago Norte, Brasília';
    iframe.loading = 'lazy';
    iframe.referrerPolicy = 'no-referrer-when-downgrade';
    iframe.allowFullscreen = true;
    map.insertBefore(iframe, cover);
  },
  { rootMargin: '200px' }
);
mapObs.observe(map);
const activateMap = () => {
  map.classList.add('is-active');
  cover.remove();
};
cover.addEventListener('click', activateMap);
map.addEventListener('mouseleave', () => {
  // reativa a proteção de scroll em desktop ao sair do mapa
  if (map.classList.contains('is-active') && matchMedia('(hover: hover)').matches) {
    map.classList.remove('is-active');
    map.append(cover);
  }
});
