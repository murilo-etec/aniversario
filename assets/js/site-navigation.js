(() => {
  'use strict';
  if (document.querySelector('.pd-nav')) return;
  const links = [
    ['index.html', 'Abertura'], ['page1.html', 'Mapa de experiências'],
    ['solar.html', 'Sistema solar'], ['index (2).html', 'Observatório'], ['santuarios.html', 'Jardins e aquário'],
    ['laboratorio-ciencias.html', 'Estúdio de ciências'], ['MUSICA.HTML', 'Sala de música'],
    ['MEMORIAS.HTML', 'Memórias'], ['jogo.html', 'Portal secreto'],
    ['cubo.html', 'Cubo mágico'], ['math-rush.html', 'Math Rush'], ['chess.html', 'Xadrez'],
    ['fisica.html', 'FísicaLab'], ['pagina1_laboratorio_fisica_schrodinger_especial.html', 'Laboratório quântico']
  ];
  const nav = document.createElement('nav');
  nav.className = 'pd-nav'; nav.setAttribute('aria-label', 'Navegação do Purple Dreams');
  if (document.querySelector('.butterfly-guide')) nav.classList.add('pd-nav--above-guide');
  else if (document.querySelector('.audio, [data-floating-corner="bottom-right"]')) nav.classList.add('pd-nav--raised');
  nav.innerHTML = '<button class="pd-nav__toggle" type="button" aria-expanded="false" aria-controls="pdUniversalNavPanel"><span class="pd-nav__mark" aria-hidden="true"></span><span>Explorar</span></button><div class="pd-nav__panel" id="pdUniversalNavPanel" hidden><p class="pd-nav__heading">Um universo, muitas descobertas</p><div class="pd-nav__links"></div></div>';
  const button = nav.querySelector('.pd-nav__toggle');
  const panel = nav.querySelector('.pd-nav__panel');
  const list = nav.querySelector('.pd-nav__links');
  const currentPath = decodeURIComponent(location.pathname.split('/').pop() || 'index.html').toLocaleLowerCase('pt-BR');
  links.forEach(([href, label]) => {
    const link = document.createElement('a'); link.href = href; link.textContent = label;
    const path = decodeURIComponent(new URL(href, document.baseURI).pathname.split('/').pop()).toLocaleLowerCase('pt-BR');
    if (path === currentPath) { link.setAttribute('aria-current', 'page'); link.setAttribute('aria-label', `${label}, página atual`); }
    list.append(link);
  });
  function setOpen(open, moveFocus = false) {
    button.setAttribute('aria-expanded', String(open)); panel.hidden = !open;
    if (open && moveFocus) list.querySelector('a')?.focus();
    if (!open) button.focus({ preventScroll: true });
  }
  button.addEventListener('click', () => setOpen(button.getAttribute('aria-expanded') !== 'true', true));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') { event.preventDefault(); setOpen(false); } });
  document.addEventListener('pointerdown', event => { if (!nav.contains(event.target) && button.getAttribute('aria-expanded') === 'true') { panel.hidden = true; button.setAttribute('aria-expanded', 'false'); } }, { passive: true });
  document.body.append(nav);
  function syncModalState() {
    const explicitModalOpen = Boolean(document.querySelector('dialog[open], .modal.active, .lightbox.active, [data-modal-open="true"]'));
    const isActuallyVisible = element => {
      let current = element;
      while (current && current !== document.body) {
        const style = getComputedStyle(current);
        if (current.hidden || current.getAttribute('aria-hidden') === 'true' || style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity || 1) <= .01) return false;
        current = current.parentElement;
      }
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    };
    const visibleDialogOpen = Array.from(document.querySelectorAll('[role="dialog"][aria-modal="true"]')).some(element => {
      return isActuallyVisible(element);
    });
    const modalOpen = explicitModalOpen || visibleDialogOpen;
    if (modalOpen) {
      // Só escrever atributos quando o estado realmente mudou. O observer
      // também observa `hidden`; reescrevê-lo a cada callback criava um ciclo
      // de MutationObserver ao abrir um modal.
      if (!nav.hidden) nav.hidden = true;
      if (!panel.hidden) panel.hidden = true;
      if (button.getAttribute('aria-expanded') !== 'false') button.setAttribute('aria-expanded', 'false');
    } else {
      const shouldHide = nav.getAttribute('aria-hidden') === 'true';
      if (nav.hidden !== shouldHide) nav.hidden = shouldHide;
    }
  }
  new MutationObserver(syncModalState).observe(document.body, { subtree:true, childList:true, attributes:true, attributeFilter:['class','open','hidden','aria-hidden','aria-modal'] });
  syncModalState();
})();
