(function () {
  // Contato (mesmo número do site publicado)
  var WA_NUMERO = '556198171503';
  var WA_MSG = 'Olá, Solange! Vim pelo seu site e gostaria de agendar minha consulta de avaliação.';
  var WA = 'https://wa.me/' + WA_NUMERO + '?text=' + encodeURIComponent(WA_MSG);
  document.querySelectorAll('[data-wa]').forEach(function (e) { e.href = WA; e.target = '_blank'; e.rel = 'noopener'; });
  document.getElementById('ano').textContent = new Date().getFullYear();

  // Header ao rolar
  var header = document.querySelector('.header');
  var onHeader = function () { header.classList.toggle('is-scrolled', scrollY > 40); };
  onHeader(); addEventListener('scroll', onHeader, { passive: true });

  // Menu mobile
  var burger = document.querySelector('.burger'), menu = document.getElementById('menu');
  var setMenu = function (open) {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    menu.classList.toggle('is-open', open);
    document.body.classList.toggle('no-scroll', open);
  };
  burger.addEventListener('click', function () { setMenu(burger.getAttribute('aria-expanded') !== 'true'); });
  menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  // Entrada ao rolar (escalonada)
  var reveals = document.querySelectorAll('.reveal');
  reveals.forEach(function (el) {
    var i = Array.prototype.filter.call(el.parentElement.children, function (c) { return c.classList.contains('reveal'); }).indexOf(el);
    el.style.setProperty('--d', Math.max(i, 0) * 90 + 'ms');
  });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('is-visible'); io.unobserve(x.target); } });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else { reveals.forEach(function (el) { el.classList.add('is-visible'); }); }

  // Link ativo no menu
  var links = Array.prototype.slice.call(menu.querySelectorAll('ul a'));
  var spy = new IntersectionObserver(function (en) {
    en.forEach(function (x) {
      if (x.isIntersecting) links.forEach(function (l) { l.classList.toggle('is-active', l.getAttribute('href') === '#' + x.target.id); });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  links.forEach(function (l) { var s = document.querySelector(l.getAttribute('href')); if (s) spy.observe(s); });

  // Barra dourada de progresso de leitura
  var bar = document.createElement('div');
  bar.className = 'progress'; bar.setAttribute('aria-hidden', 'true');
  document.body.prepend(bar);
  var onProgress = function () {
    var h = document.documentElement.scrollHeight - innerHeight;
    bar.style.setProperty('--p', h > 0 ? Math.min(scrollY / h, 1) : 0);
  };
  onProgress(); addEventListener('scroll', onProgress, { passive: true });

  // Brilho dourado que acompanha o cursor nos cards
  if (matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.card, .mini').forEach(function (c) {
      c.addEventListener('pointermove', function (e) {
        var r = c.getBoundingClientRect();
        c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        c.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  // Parallax suave na foto do hero
  var img = document.querySelector('.hx__photo img');
  if (img && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    addEventListener('scroll', function () {
      if (scrollY < innerHeight * 1.5) img.style.transform = 'translateY(' + (-scrollY * 0.1) + 'px)';
    }, { passive: true });
  }
})();
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

  // Seta nos botões de ação
  var arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  document.querySelectorAll('.btn--gold, .btn--wine').forEach(function (b) {
    if (b.classList.contains('nav__cta') || b.querySelector('.btn__arrow')) return;
    var s = document.createElement('span'); s.className = 'btn__arrow'; s.innerHTML = arrow; b.appendChild(s);
  });
  // O CTA principal do hero "respira"
  var heroCta = document.querySelector('.hx__cta .btn');
  if (heroCta) heroCta.classList.add('btn--breath');

  // Ondulação ao tocar/clicar
  document.addEventListener('pointerdown', function (e) {
    var b = e.target.closest && e.target.closest('.btn');
    if (!b || reduce) return;
    var r = b.getBoundingClientRect(), d = Math.max(r.width, r.height) * 2.2;
    var s = document.createElement('span'); s.className = 'ripple';
    s.style.width = s.style.height = d + 'px';
    s.style.left = (e.clientX - r.left - d / 2) + 'px';
    s.style.top = (e.clientY - r.top - d / 2) + 'px';
    b.appendChild(s); setTimeout(function () { s.remove(); }, 800);
  });

  // Botões "magnéticos" no desktop
  if (fine && !reduce) {
    document.querySelectorAll('.btn--gold:not(.nav__cta), .btn--wine').forEach(function (b) {
      b.addEventListener('pointermove', function (e) {
        var r = b.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) / r.width, y = (e.clientY - r.top - r.height / 2) / r.height;
        b.style.transform = 'translate(' + (x * 8) + 'px,' + (y * 6 - 3) + 'px)';
      });
      b.addEventListener('pointerleave', function () { b.style.transform = ''; });
    });
    // Inclinação 3D suave nos cards
    document.querySelectorAll('#abordagem .card, .mini').forEach(function (c) {
      c.addEventListener('pointermove', function (e) {
        var r = c.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        c.style.setProperty('--ry', (x * 7).toFixed(2) + 'deg');
        c.style.setProperty('--rx', (-y * 7).toFixed(2) + 'deg');
      });
      c.addEventListener('pointerleave', function () { c.style.setProperty('--rx', '0deg'); c.style.setProperty('--ry', '0deg'); });
    });
  }

  // Contagem do "+30 anos"
  var big = document.querySelector('.creds__list li strong');
  if (big && /\d/.test(big.textContent) && 'IntersectionObserver' in window) {
    var txt = big.textContent, n = parseInt(txt.replace(/\D/g, ''), 10);
    var co = new IntersectionObserver(function (en) {
      if (!en[0].isIntersecting) return; co.disconnect();
      if (reduce) return;
      var t0 = performance.now();
      (function step(t) {
        var p = Math.min((t - t0) / 1600, 1), v = Math.round(n * (1 - Math.pow(1 - p, 3)));
        big.textContent = txt.replace(/\d+/, v);
        if (p < 1) requestAnimationFrame(step);
      })(t0);
    }, { threshold: .6 });
    co.observe(big);
  }

  // Linha do tempo que se preenche ao rolar
  var tl = document.querySelector('.timeline');
  if (tl) {
    var fill = document.createElement('span'); fill.className = 'timeline__fill'; fill.setAttribute('aria-hidden', 'true');
    tl.prepend(fill);
    var items = tl.querySelectorAll('li');
    var onTl = function () {
      var r = tl.getBoundingClientRect(), mid = innerHeight * .62;
      var p = Math.max(0, Math.min(1, (mid - r.top) / r.height));
      tl.style.setProperty('--tp', reduce ? 1 : p.toFixed(3));
      items.forEach(function (li) { li.classList.toggle('is-lit', li.getBoundingClientRect().top + 22 < mid); });
    };
    onTl(); addEventListener('scroll', onTl, { passive: true }); addEventListener('resize', onTl);
  }

  // FAQ: abre e fecha com suavidade, um de cada vez
  document.querySelectorAll('.faq details').forEach(function (d) {
    var sum = d.querySelector('summary'), body = d.querySelector('p');
    if (!sum || !body || reduce) return;
    sum.addEventListener('click', function (e) {
      e.preventDefault();
      if (d.open) {
        body.animate([{ height: body.offsetHeight + 'px', opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 320, easing: 'ease' })
          .onfinish = function () { d.open = false; };
      } else {
        document.querySelectorAll('.faq details[open]').forEach(function (o) { if (o !== d) o.open = false; });
        d.open = true;
        var h = body.offsetHeight;
        body.animate([{ height: '0px', opacity: 0 }, { height: h + 'px', opacity: 1 }], { duration: 380, easing: 'cubic-bezier(.2,.7,.2,1)' });
      }
    });
  });
})();
