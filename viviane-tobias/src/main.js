import { WHATSAPP, WHATSAPP_MENSAGEM } from './config.js';

// WhatsApp: monta o link a partir do config. Sem número, abre o seletor de contato do WhatsApp.
const texto = encodeURIComponent(WHATSAPP_MENSAGEM);
const linkWhats = WHATSAPP
  ? `https://wa.me/${WHATSAPP}?text=${texto}`
  : `https://wa.me/?text=${texto}`;
document.querySelectorAll('[data-whatsapp]').forEach((a) => {
  a.href = linkWhats;
  a.target = '_blank';
  a.rel = 'noopener';
});
if (!WHATSAPP) document.querySelectorAll('[data-wa-falta]').forEach((el) => (el.hidden = false));

// Fotos: se o arquivo não existir, mostra o espaço reservado.
document.querySelectorAll('[data-foto]').forEach((box) => {
  const img = box.querySelector('img');
  const ok = () => box.classList.add('tem-foto');
  const falhou = () => img.remove();
  if (img.complete) {
    img.naturalWidth ? ok() : falhou();
  } else {
    img.addEventListener('load', ok, { once: true });
    img.addEventListener('error', falhou, { once: true });
  }
});

// Tema claro/escuro
const raiz = document.documentElement;
const botao = document.getElementById('tema');
const escuroSistema = window.matchMedia('(prefers-color-scheme: dark)');
const temaAtual = () => raiz.getAttribute('data-theme') || (escuroSistema.matches ? 'dark' : 'light');

function mostrarEstado() {
  const escuro = temaAtual() === 'dark';
  botao.setAttribute('aria-pressed', String(escuro));
  botao.setAttribute('aria-label', 'Tema escuro');
}
botao.addEventListener('click', () => {
  const novo = temaAtual() === 'dark' ? 'light' : 'dark';
  raiz.setAttribute('data-theme', novo);
  try { localStorage.setItem('tema', novo); } catch (e) { /* sem armazenamento */ }
  mostrarEstado();
});
mostrarEstado();
