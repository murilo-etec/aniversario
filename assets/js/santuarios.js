(() => {
  'use strict';
  const shell = document.querySelector('#siteShell');
  const toast = document.querySelector('#toast');
  const storageStatus = document.querySelector('#storageStatus');
  const STORAGE = {
    discoveries: 'purpleDreamsDiscoveries_v2',
    photos: 'purpleDreamsPhotoAlbum_v1',
    weather: 'purpleDreamsAtmosphere_v1'
  };
  const atmosphereCopy = {
    dusk: 'Luz dourada, flores em repouso e céu violeta.',
    rain: 'Chuva suave percorre os vidros e aprofunda as cores.',
    aurora: 'Luzes lilases e azuis atravessam o jardim.',
    night: 'A noite estrelada ilumina o caminho com delicadeza.'
  };
  let inMemoryDiscoveries = [];
  let inMemoryPhotos = [];
  let toastTimer;
  let toastReturnFocus = null;

  const storageListName = key => key === STORAGE.photos ? 'fotografias' : 'descobertas';
  const setStorageWarning = message => {
    storageStatus.textContent = message;
    storageStatus.hidden = !message;
  };
  const mergeLists = (memory, stored) => {
    const merged = [...memory];
    const known = new Set(memory.map(item => item && item.id).filter(Boolean));
    stored.forEach(item => {
      if (!item || !item.id || !known.has(item.id)) {
        merged.push(item);
        if (item && item.id) known.add(item.id);
      }
    });
    return merged;
  };
  const readList = (key, fallback) => {
    let raw;
    try { raw = localStorage.getItem(key); }
    catch (_) {
      setStorageWarning('O navegador bloqueou o acesso ao diário. Os registros desta sessão continuam disponíveis, mas não serão mantidos após sair.');
      return [...fallback];
    }
    if (raw === null) return [...fallback];
    try {
      const value = JSON.parse(raw);
      if (Array.isArray(value)) return mergeLists(fallback, value);
    } catch (_) { /* o aviso abaixo explica o conteúdo inválido */ }
    setStorageWarning(`O diário salvo de ${storageListName(key)} está inválido e não pôde ser lido. Os registros desta sessão continuam disponíveis; dados anteriores podem não ser recuperáveis.`);
    return [...fallback];
  };
  const saveList = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch (_) {
      setStorageWarning(`Não foi possível salvar as ${storageListName(key)} neste navegador. Os registros desta sessão continuam disponíveis até você sair.`);
      return false;
    }
  };
  const getDiscoveries = () => readList(STORAGE.discoveries, inMemoryDiscoveries).slice(0, 40);
  const getPhotos = () => readList(STORAGE.photos, inMemoryPhotos).slice(0, 8);
  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const dateLabel = (value) => {
    try { return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(value)); }
    catch (_) { return 'agora'; }
  };

  function showToast(text, focusTarget = null) {
    toastReturnFocus = focusTarget || document.activeElement;
    toast.textContent = text;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('is-visible');
      if (toastReturnFocus && toastReturnFocus.isConnected) toastReturnFocus.focus({ preventScroll: true });
    }, 3400);
  }

  function renderDiary() {
    const discoveries = getDiscoveries();
    const photos = getPhotos();
    const combined = [...discoveries, ...photos].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);
    const list = document.querySelector('#diaryList');
    const total = discoveries.length + photos.length;
    document.querySelector('#discoveryCount').textContent = String(total);
    document.querySelector('#progressCount').textContent = String(total);
    document.querySelector('#progressBar').style.width = `${Math.min(100, total * 12.5)}%`;
    if (!combined.length) {
      list.innerHTML = '<p class="diary-empty">As primeiras descobertas aparecem aqui, guardadas neste navegador.</p>';
      return;
    }
    list.innerHTML = combined.map(item => `
      <article class="diary-item">
        ${item.photo ? `<img src="${escapeHtml(item.photo)}" alt="${escapeHtml(item.title || 'Fotografia guardada no diário')}" loading="lazy">` : ''}
        <div class="diary-item-body"><span class="diary-item-type">${item.photo ? 'Fotografia' : 'Descoberta'}</span>
          <h3>${escapeHtml(item.title || 'Um instante especial')}</h3>
          <p>${escapeHtml(item.detail || '')}</p><time datetime="${escapeHtml(item.date)}">${dateLabel(item.date)}</time></div>
      </article>`).join('');
  }

  function addDiscovery(title, detail) {
    const entry = { id: `${Date.now()}-${Math.random().toString(16).slice(2)}`, title, detail, date: new Date().toISOString() };
    const entries = getDiscoveries();
    entries.unshift(entry);
    inMemoryDiscoveries = entries.slice(0, 40);
    if (!saveList(STORAGE.discoveries, inMemoryDiscoveries)) {
      showToast('Descoberta registrada nesta sessão. O navegador não permitiu o salvamento permanente.');
    }
    renderDiary();
  }

  document.querySelectorAll('[data-discovery-title]').forEach(button => {
    button.addEventListener('click', () => {
      const title = button.dataset.discoveryTitle || 'Nova descoberta';
      const detail = button.dataset.discoveryText || 'Uma lembrança do seu passeio.';
      addDiscovery(title, detail);
      showToast(`${title} — ${detail}`, button);
    });
  });

  const weatherButtons = [...document.querySelectorAll('[data-atmosphere]')];
  function setAtmosphere(mode, persist = true) {
    const safeMode = Object.hasOwn(atmosphereCopy, mode) ? mode : 'dusk';
    shell.dataset.weather = safeMode;
    weatherButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.atmosphere === safeMode)));
    document.querySelector('#atmosphereStatus').textContent = atmosphereCopy[safeMode];
    if (persist) {
      try { localStorage.setItem(STORAGE.weather, safeMode); } catch (_) { /* visual state remains available */ }
    }
  }
  weatherButtons.forEach(button => button.addEventListener('click', () => setAtmosphere(button.dataset.atmosphere)));
  try { setAtmosphere(localStorage.getItem(STORAGE.weather) || 'dusk', false); } catch (_) { setAtmosphere('dusk', false); }

  const guide = document.querySelector('#butterflyGuide');
  const stops = ['jardim', 'estufa', 'aquario', 'mascotes', 'diario'];
  let guideIndex = -1;
  guide.addEventListener('click', () => {
    guideIndex = (guideIndex + 1) % stops.length;
    const target = document.getElementById(stops[guideIndex]);
    target?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    showToast(`A borboleta-guia levou você até ${target?.querySelector('h2')?.textContent || 'a próxima descoberta'}.`, guide);
  });

  const companionNote = document.querySelector('#companionNote');
  const companionLines = {
    Milo: ['Milo fareja uma flor nova e aprova o caminho.', 'Milo ronrona baixinho: ainda há muito para explorar.', 'Milo escolheu o lugar mais quentinho do jardim.'],
    Pipo: ['Pipo encontrou uma semente imaginária e guardou no bolso.', 'Pipo acena para você do meio das folhas.', 'Pipo vai devagar, mas não perde nenhuma descoberta.']
  };
  document.querySelectorAll('[data-companion]').forEach(button => {
    button.addEventListener('click', () => {
      const name = button.dataset.companion;
      const options = companionLines[name] || [];
      const line = options[Math.floor(Math.random() * options.length)];
      companionNote.textContent = line;
      document.querySelector('.companion-art').classList.add('is-reacting');
      setTimeout(() => document.querySelector('.companion-art').classList.remove('is-reacting'), 900);
      addDiscovery(`Um encontro com ${name}`, line);
      showToast(line, button);
    });
  });

  const dialog = document.querySelector('#photoDialog');
  const photoFile = document.querySelector('#photoFile');
  const preview = document.querySelector('#photoPreview');
  const previewImage = document.querySelector('#photoPreviewImage');
  const previewCaption = document.querySelector('#photoPreviewCaption');
  const caption = document.querySelector('#photoCaption');
  const feedback = document.querySelector('#photoFeedback');
  const saveButton = document.querySelector('#savePhoto');
  let selectedImage = null;
  let openedFrom = null;
  function openPhotoDialog() {
    openedFrom = document.activeElement;
    selectedImage = null;
    photoFile.value = '';
    caption.value = '';
    preview.hidden = true;
    previewImage.removeAttribute('src');
    previewCaption.textContent = '';
    feedback.textContent = '';
    saveButton.disabled = true;
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else { dialog.setAttribute('open', ''); }
    setTimeout(() => document.querySelector('#photoFile').focus(), 0);
  }
  function closePhotoDialog() {
    if (dialog.open && typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
    if (openedFrom?.isConnected) openedFrom.focus({ preventScroll: true });
  }
  document.querySelector('#openPhoto').addEventListener('click', openPhotoDialog);
  document.querySelector('#openPhotoBottom').addEventListener('click', openPhotoDialog);
  document.querySelector('#closePhoto').addEventListener('click', closePhotoDialog);
  document.querySelector('#cancelPhoto').addEventListener('click', closePhotoDialog);
  dialog.addEventListener('click', event => { if (event.target === dialog) closePhotoDialog(); });

  function compressImage(file) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      const source = URL.createObjectURL(file);
      image.onload = () => {
        const scale = Math.min(1, 1280 / Math.max(image.naturalWidth, image.naturalHeight));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
        canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(source);
        canvas.toBlob(blob => {
          if (!blob) { reject(new Error('Não foi possível preparar esta foto.')); return; }
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = () => reject(new Error('Não foi possível ler esta foto.'));
          reader.readAsDataURL(blob);
        }, 'image/webp', .78);
      };
      image.onerror = () => { URL.revokeObjectURL(source); reject(new Error('Este arquivo não parece ser uma imagem válida.')); };
      image.src = source;
    });
  }
  photoFile.addEventListener('change', async () => {
    const file = photoFile.files?.[0];
    selectedImage = null;
    saveButton.disabled = true;
    if (!file) return;
    if (!file.type.startsWith('image/')) { feedback.textContent = 'Escolha um arquivo de imagem.'; return; }
    if (file.size > 12 * 1024 * 1024) { feedback.textContent = 'A fotografia precisa ter até 12 MB.'; return; }
    feedback.textContent = 'Preparando sua fotografia…';
    try {
      selectedImage = await compressImage(file);
      previewImage.src = selectedImage;
      previewCaption.textContent = file.name;
      preview.hidden = false;
      feedback.textContent = 'Pronta para guardar no diário.';
      saveButton.disabled = false;
    } catch (error) { feedback.textContent = error.message; }
  });
  caption.addEventListener('input', () => { previewCaption.textContent = caption.value.trim() || photoFile.files?.[0]?.name || ''; });

  document.querySelector('#photoForm').addEventListener('submit', event => {
    event.preventDefault();
    if (!selectedImage) { feedback.textContent = 'Escolha uma fotografia antes de salvar.'; return; }
    const photos = getPhotos();
    if (photos.length >= 8) { feedback.textContent = 'O diário já guarda oito fotografias. Abra a galeria de memórias para organizar seu acervo.'; return; }
    const entry = {
      id: `photo-${Date.now()}`,
      title: caption.value.trim() || 'Um instante no universo',
      detail: `Fotografia guardada a partir de ${photoFile.files?.[0]?.name || 'uma imagem local'}.`,
      photo: selectedImage,
      date: new Date().toISOString()
    };
    photos.unshift(entry);
    inMemoryPhotos = photos.slice(0, 8);
    if (!saveList(STORAGE.photos, inMemoryPhotos)) {
      feedback.textContent = 'O navegador não tem espaço disponível. Exporte suas fotos e tente novamente.';
      return;
    }
    renderDiary();
    closePhotoDialog();
    document.querySelector('#diario').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    showToast('A fotografia foi guardada no seu diário neste navegador.');
  });

  renderDiary();
})();
