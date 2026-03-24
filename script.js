function faq(el){
  const item=el.parentElement;
  const open=item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i=>i.classList.remove('open'));
  if(!open)item.classList.add('open');
}

// ── INTERACTIVE PILLS ──
const pillData = {
  engajamento: { icon:'⊙', desc:'Construímos audiência qualificada e aumentamos o engajamento com sua marca em todos os canais digitais.' },
  aquisicao:   { icon:'↗', desc:'Atraímos novos clientes com campanhas pagas e orgânicas otimizadas para o seu perfil de comprador.' },
  monetizacao: { icon:'◆', desc:'Transformamos tráfego em faturamento real. Cada real investido deve gerar retorno mensurável.' },
  retencao:    { icon:'↻', desc:'Fidelizamos clientes com automações, nutrição e relacionamento para aumentar o LTV da sua base.' },
  ativacao:    { icon:'↗', desc:'Reativamos clientes inativos e aceleramos o ciclo de compra com estratégias de CRM e remarketing.' },
  indicacao:   { icon:'🤝', desc:'Criamos mecanismos de indicação que transformam clientes satisfeitos nos melhores promotores da sua marca.' }
};

function activatePill(id) {
  // pills
  document.querySelectorAll('.m-pill').forEach(p => p.classList.remove('active'));
  const pill = document.querySelector(`.m-pill[data-id="${id}"]`);
  if(pill) pill.classList.add('active');
  // labels
  document.querySelectorAll('.m-label-item').forEach(l => l.classList.remove('lbl-active'));
  const lbl = document.querySelector(`.m-label-item[data-pill="${id}"]`);
  if(lbl) lbl.classList.add('lbl-active');
  // desc box
  const data = pillData[id];
  if(data) {
    const txt = document.getElementById('metodoDescText');
    const icon = document.querySelector('.metodo-desc-icon');
    txt.style.opacity = '0';
    setTimeout(() => {
      txt.textContent = data.desc;
      if(icon) icon.textContent = data.icon;
      txt.style.opacity = '1';
    }, 150);
  }
}

// Pill click
document.querySelectorAll('.m-pill').forEach(pill => {
  pill.addEventListener('click', () => activatePill(pill.dataset.id));
  pill.addEventListener('mouseenter', () => activatePill(pill.dataset.id));
});
// Label click/hover
document.querySelectorAll('.m-label-item').forEach(lbl => {
  lbl.addEventListener('click', () => activatePill(lbl.dataset.pill));
  lbl.addEventListener('mouseenter', () => activatePill(lbl.dataset.pill));
});

// Auto-cycle pills
let cycleIds = ['engajamento','aquisicao','monetizacao','retencao','ativacao'];
let cycleIdx = 2; // start at monetizacao
let cycleTimer = setInterval(() => {
  cycleIdx = (cycleIdx + 1) % cycleIds.length;
  activatePill(cycleIds[cycleIdx]);
}, 3000);
// Pause cycle on user interaction
document.getElementById('metodoPills').addEventListener('mouseenter', () => clearInterval(cycleTimer));
document.getElementById('metodoPills').addEventListener('mouseleave', () => {
  cycleTimer = setInterval(() => {
    cycleIdx = (cycleIdx + 1) % cycleIds.length;
    activatePill(cycleIds[cycleIdx]);
  }, 3000);
});
// ── PLAN TABS ──
document.querySelectorAll('.plan-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.plan-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.plan-content').forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('plan-' + tab.dataset.plan).classList.add('active');
  });
});

// Coverflow removed

// ── FAZEMOS SLIDER ──
(function(){
  let cur = 0;
  const total = 10;
  const track = document.getElementById('fzTrack');
  const slides = Array.from(document.querySelectorAll('.fz-slide'));
  const dots = Array.from(document.querySelectorAll('.fz-dot'));

  function getOffset(index){
    const slideW = slides[0].offsetWidth;
    const gap = 16;
    const trackPad = track.parentElement.offsetWidth * 0.12; // 12% padding
    // Center the active slide
    const center = track.parentElement.offsetWidth / 2;
    const slideCenter = slideW / 2;
    const offset = index * (slideW + gap) - (center - slideCenter - trackPad);
    return Math.max(0, offset);
  }

  function goTo(n){
    cur = ((n % total) + total) % total;
    slides.forEach((s,i) => {
      s.classList.toggle('active', i === cur);
    });
    dots.forEach((d,i) => d.classList.toggle('on', i === cur));
    track.style.transform = `translateX(-${getOffset(cur)}px)`;
  }

  // Recalculate on resize
  window.addEventListener('resize', () => goTo(cur));

  slides.forEach((s,i) => s.addEventListener('click', () => { if(i !== cur) goTo(i); }));
  document.getElementById('fz-next').addEventListener('click', () => goTo(cur + 1));
  document.getElementById('fz-prev').addEventListener('click', () => goTo(cur - 1));
  dots.forEach(d => d.addEventListener('click', () => goTo(+d.dataset.slide)));

  // Touch swipe
  let tx = 0;
  track.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, {passive:true});
  track.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - tx;
    if(Math.abs(dx) > 50) goTo(dx < 0 ? cur + 1 : cur - 1);
  }, {passive:true});

  // Auto-advance
  let auto = setInterval(() => goTo(cur + 1), 5000);
  track.parentElement.addEventListener('mouseenter', () => clearInterval(auto));
  track.parentElement.addEventListener('mouseleave', () => { auto = setInterval(() => goTo(cur + 1), 5000); });

  // Init
  goTo(0);
})();
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      e.target.classList.remove('hidden');
    } else {
      e.target.classList.remove('visible');
      e.target.classList.add('hidden');
    }
  });
}, { threshold: 0.07, rootMargin: '0px 0px -30px 0px' });

// Todos os elementos com classe de reveal
document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.section-reveal').forEach(el => {
  revealObs.observe(el);
});

// Auto-aplicar animação em todos os filhos diretos das seções principais
// que ainda não tenham classe reveal
const autoRevealSections = document.querySelectorAll(
  '.quem-somos, .deps, .metodo, .fazemos, .planos, .time-sec, .faq-sec'
);
autoRevealSections.forEach((section, si) => {
  Array.from(section.children).forEach((child, ci) => {
    if (!child.classList.contains('reveal') &&
        !child.classList.contains('reveal-left') &&
        !child.classList.contains('reveal-right') &&
        !child.classList.contains('section-reveal') &&
        !child.classList.contains('visible')) {
      child.classList.add('reveal');
      if (ci > 0) child.classList.add(`reveal-delay-${Math.min(ci, 5)}`);
      revealObs.observe(child);
    }
  });
});

document.querySelectorAll('a[href="#formulario"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    document.getElementById('formulario').scrollIntoView({ behavior: 'smooth' });
  });
});

// ── CASES SLIDER (mobile) ──
(function(){
  var track = document.getElementById('casesTrack');
  if(!track) return;
  var cards = Array.from(track.querySelectorAll('.case-card'));
  var dots = Array.from(document.querySelectorAll('.cases-dot'));
  var cur = 0;
  var total = cards.length;

  function goTo(n){
    cur = ((n % total) + total) % total;
    // Scroll to card position
    var card = cards[cur];
    var cardLeft = card.offsetLeft;
    var cardW = card.offsetWidth;
    var trackW = track.offsetWidth;
    // Center the card
    track.scrollTo({ left: cardLeft - (trackW - cardW) / 2, behavior: 'smooth' });
    dots.forEach(function(d,i){ d.classList.toggle('on', i===cur); });
  }

  // Update dot on scroll
  track.addEventListener('scroll', function(){
    var center = track.scrollLeft + track.offsetWidth / 2;
    var closest = 0;
    var minDist = Infinity;
    cards.forEach(function(c, i){
      var cardCenter = c.offsetLeft + c.offsetWidth / 2;
      var dist = Math.abs(cardCenter - center);
      if(dist < minDist){ minDist = dist; closest = i; }
    });
    cur = closest;
    dots.forEach(function(d,i){ d.classList.toggle('on', i===cur); });
  }, {passive:true});

  var prevBtn = document.getElementById('cases-prev');
  var nextBtn = document.getElementById('cases-next');
  if(prevBtn) prevBtn.addEventListener('click', function(){ goTo(cur-1); });
  if(nextBtn) nextBtn.addEventListener('click', function(){ goTo(cur+1); });
  dots.forEach(function(d){ d.addEventListener('click', function(){ goTo(+d.dataset.case); }); });
  goTo(0);
})();
