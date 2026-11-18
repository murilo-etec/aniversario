(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const pianoVolume = $('#pianoVolume');
  const pianoVolumeValue = $('#pianoVolumeValue');
  const keyboard = $('#pianoKeysContainer');
  const noteDisplay = $('#pianoNoteDisplay');
  const visualizer = $('#pianoVisualizer');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const pitchClasses = [
    { pitch: 'C', offset: 0, type: 'white', key: 'A' }, { pitch: 'C#', offset: 1, type: 'black', key: 'W' },
    { pitch: 'D', offset: 2, type: 'white', key: 'S' }, { pitch: 'D#', offset: 3, type: 'black', key: 'E' },
    { pitch: 'E', offset: 4, type: 'white', key: 'D' }, { pitch: 'F', offset: 5, type: 'white', key: 'F' },
    { pitch: 'F#', offset: 6, type: 'black', key: 'T' }, { pitch: 'G', offset: 7, type: 'white', key: 'G' },
    { pitch: 'G#', offset: 8, type: 'black', key: 'Y' }, { pitch: 'A', offset: 9, type: 'white', key: 'H' },
    { pitch: 'A#', offset: 10, type: 'black', key: 'U' }, { pitch: 'B', offset: 11, type: 'white', key: 'J' },
    { pitch: 'C', offset: 12, type: 'white', key: 'K' }
  ];
  const localized = { C: 'Dó', 'C#': 'Dó sustenido', D: 'Ré', 'D#': 'Ré sustenido', E: 'Mi', F: 'Fá', 'F#': 'Fá sustenido', G: 'Sol', 'G#': 'Sol sustenido', A: 'Lá', 'A#': 'Lá sustenido', B: 'Si' };
  const semitones = { C: 0, 'C#': 1, D: 2, 'D#': 3, E: 4, F: 5, 'F#': 6, G: 7, 'G#': 8, A: 9, 'A#': 10, B: 11 };
  let octave = 4;
  let pianoNotes = [];
  let audioContext = null;
  let masterGain = null;
  let analyser = null;
  let frequencyData = null;
  let visualFrame = 0;
  let voiceCounter = 0;
  let sustainOn = false;
  let recording = false;
  let recordStartedAt = 0;
  let recordEvents = [];
  let recordTimer = 0;
  let playbackTimers = [];
  let lessonTimers = [];
  let playingRecording = false;
  const activeVoices = new Map();
  const heldKeys = new Map();
  const heldPointers = new Map();
  const maxVoices = 24;

  function setRecordStatus(message) {
    const node = $('#pianoRecordStatus');
    if (node) node.textContent = message;
  }

  function updateVolume() {
    if (!pianoVolume || !pianoVolumeValue) return;
    const volume = Number(pianoVolume.value);
    pianoVolumeValue.value = `${volume}%`;
    pianoVolumeValue.textContent = `${volume}%`;
    if (masterGain && audioContext) masterGain.gain.setTargetAtTime(volume / 100, audioContext.currentTime, 0.015);
  }

  function initAudio() {
    if (!audioContext) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) {
        setRecordStatus('Seu navegador não oferece Web Audio. O restante da sala continua disponível.');
        return false;
      }
      try {
        audioContext = new AudioContextClass();
        masterGain = audioContext.createGain();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.82;
        frequencyData = new Uint8Array(analyser.frequencyBinCount);
        masterGain.gain.value = Number(pianoVolume?.value || 45) / 100;
        masterGain.connect(analyser);
        analyser.connect(audioContext.destination);
      } catch (error) {
        audioContext = null;
        setRecordStatus('Não foi possível iniciar o áudio neste dispositivo. Toque novamente ou use outro navegador.');
        return false;
      }
    }
    if (audioContext.state === 'suspended') audioContext.resume().catch(() => setRecordStatus('O navegador bloqueou a reprodução. Toque novamente para ativar o áudio.'));
    return true;
  }

  function updateVisualizerCanvas() {
    if (!visualizer || !analyser || !frequencyData) return;
    const rect = visualizer.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    const width = Math.max(1, Math.round(rect.width * ratio));
    const height = Math.max(1, Math.round(rect.height * ratio));
    if (visualizer.width !== width || visualizer.height !== height) { visualizer.width = width; visualizer.height = height; }
    const ctx = visualizer.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, rect.width, rect.height);
    analyser.getByteFrequencyData(frequencyData);
    const bars = 36, gap = 3, barWidth = Math.max(1, (rect.width - gap * (bars - 1) - 18) / bars);
    const total = bars * barWidth + (bars - 1) * gap;
    const start = (rect.width - total) / 2;
    const step = Math.max(1, Math.floor(frequencyData.length / bars));
    for (let i = 0; i < bars; i++) {
      const energy = frequencyData[i * step] / 255;
      const barHeight = Math.max(2, energy * (rect.height - 12));
      const x = start + i * (barWidth + gap), y = (rect.height - barHeight) / 2;
      const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
      gradient.addColorStop(0, '#f2d7ff'); gradient.addColorStop(0.55, '#bda0f3'); gradient.addColorStop(1, '#7a5dbb');
      ctx.fillStyle = gradient;
      ctx.globalAlpha = 0.48 + energy * 0.52;
      ctx.fillRect(x, y, barWidth, barHeight);
    }
    ctx.globalAlpha = 1;
  }

  function animateVisualizer() {
    if (reducedMotion.matches) { updateVisualizerCanvas(); return; }
    if (visualFrame) return;
    const frame = () => {
      updateVisualizerCanvas();
      if (document.hidden || activeVoices.size === 0) visualFrame = 0;
      else visualFrame = requestAnimationFrame(frame);
    };
    visualFrame = requestAnimationFrame(frame);
  }

  function recordEvent(type, note, id, extra = {}) {
    if (!recording) return;
    recordEvents.push({ type, note, id, time: Math.max(0, performance.now() - recordStartedAt), ...extra });
  }

  function updateNoteDisplay(noteName) {
    if (noteDisplay) noteDisplay.textContent = `Nota: ${noteName}`;
  }

  function startVoice(id, frequency, noteName, element = null, shouldRecord = true) {
    if (activeVoices.has(id) || !initAudio()) return;
    if (activeVoices.size >= maxVoices) releaseVoice(activeVoices.keys().next().value, true, shouldRecord);
    const now = audioContext.currentTime;
    const envelope = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();
    const partials = [
      { type: 'triangle', ratio: 1, level: 0.72 },
      { type: 'sine', ratio: 2, level: 0.2 },
      { type: 'sine', ratio: 3, level: 0.065 }
    ];
    filter.type = 'lowpass'; filter.frequency.setValueAtTime(Math.min(6200, Math.max(1500, frequency * 8)), now); filter.Q.value = 0.55;
    const oscillators = [];
    partials.forEach(partial => {
      const oscillator = audioContext.createOscillator();
      const partialGain = audioContext.createGain();
      oscillator.type = partial.type;
      oscillator.frequency.setValueAtTime(frequency * partial.ratio, now);
      partialGain.gain.value = partial.level;
      oscillator.connect(partialGain); partialGain.connect(filter); oscillator.start(now);
      oscillators.push(oscillator);
    });
    filter.connect(envelope); envelope.connect(masterGain);
    envelope.gain.setValueAtTime(0.0001, now);
    envelope.gain.linearRampToValueAtTime(0.33, now + 0.008);
    envelope.gain.exponentialRampToValueAtTime(0.13, now + 0.15);
    const voice = { id, frequency, noteName, envelope, oscillators, element, pendingRelease: false, didRecordOff: false, shouldRecord };
    activeVoices.set(id, voice);
    if (element) element.classList.add('active');
    updateNoteDisplay(noteName);
    if (shouldRecord) recordEvent('on', noteName, id);
    animateVisualizer();
  }

  function releaseVoice(id, force = false, shouldRecord = true) {
    const voice = activeVoices.get(id);
    if (!voice) return;
    if (shouldRecord && voice.shouldRecord && !voice.didRecordOff) {
      recordEvent('off', voice.noteName, voice.id);
      voice.didRecordOff = true;
    }
    if (sustainOn && !force) { voice.pendingRelease = true; return; }
    const now = audioContext.currentTime;
    voice.envelope.gain.cancelScheduledValues(now);
    voice.envelope.gain.setValueAtTime(Math.max(0.0001, voice.envelope.gain.value), now);
    voice.envelope.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
    voice.oscillators.forEach(oscillator => { try { oscillator.stop(now + 0.2); } catch (_) {} });
    if (voice.element) voice.element.classList.remove('active');
    activeVoices.delete(id);
    if (activeVoices.size === 0) animateVisualizer();
  }

  function releaseAllVoices(shouldRecord = true) {
    Array.from(activeVoices.keys()).forEach(id => releaseVoice(id, true, shouldRecord));
    heldKeys.clear(); heldPointers.clear();
  }

  function playNote(frequency, noteName, element = null, duration = 340, shouldRecord = true) {
    const id = `oneshot:${++voiceCounter}`;
    startVoice(id, frequency, noteName, element, shouldRecord);
    window.setTimeout(() => releaseVoice(id, false, shouldRecord), duration);
    return id;
  }

  function noteForMidi(midi) {
    const pitches = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const pitch = pitches[midi % 12], noteOctave = Math.floor(midi / 12) - 1;
    return `${pitch}${noteOctave}`;
  }

  function frequencyForMidi(midi) { return 440 * Math.pow(2, (midi - 69) / 12); }
  function midiForNote(note) {
    const match = /^([A-G]#?)(-?\d+)$/.exec(note || '');
    return match ? 12 * (Number(match[2]) + 1) + (semitones[match[1]] ?? 0) : 60;
  }

  function buildNotes() {
    pianoNotes = pitchClasses.map(item => {
      const noteOctave = octave + (item.offset === 12 ? 1 : 0);
      const midi = 12 * (noteOctave + 1) + (item.offset % 12);
      return { ...item, octave: noteOctave, note: `${item.pitch}${noteOctave}`, frequency: frequencyForMidi(midi) };
    });
    const range = $('#pianoOctaveRange');
    if (range) range.textContent = `Dó ${octave} — Dó ${octave + 1}`;
    const down = $('#pianoOctaveDown'), up = $('#pianoOctaveUp');
    if (down) down.disabled = octave <= 2 || playingRecording;
    if (up) up.disabled = octave >= 6 || playingRecording;
  }

  function renderKeyboard() {
    if (!keyboard) return;
    keyboard.replaceChildren();
    keyboard.setAttribute('aria-label', `Notas de Dó ${octave} a Dó ${octave + 1}`);
    const whiteKeys = pianoNotes.filter(note => note.type === 'white');
    const blackToNextWhite = { [`C#${octave}`]: `D${octave}`, [`D#${octave}`]: `E${octave}`, [`F#${octave}`]: `G${octave}`, [`G#${octave}`]: `A${octave}`, [`A#${octave}`]: `B${octave}` };
    const whiteElements = new Map();
    function makeKey(note, black = false) {
      const button = document.createElement('button');
      button.type = 'button'; button.dataset.note = note.note; button.dataset.key = note.key;
      button.setAttribute('aria-label', `Tecla ${localized[note.pitch]} ${note.octave} (${note.note}), atalho físico ${note.key}. Segure para tocar.`);
      button.className = black
        ? 'piano-key piano-key-black absolute top-0 w-10 sm:w-9 h-28 sm:h-32 bg-gray-900 border border-black rounded-b-md cursor-pointer flex flex-col justify-end items-center pb-2 transition-all duration-100 shadow-lg z-20 text-white focus:outline-none'
        : 'piano-key w-11 sm:w-14 h-44 sm:h-52 bg-gradient-to-b from-gray-100 to-gray-300 border border-gray-400 rounded-b-lg cursor-pointer flex flex-col justify-end items-center pb-3 transition-all duration-100 shadow-sm relative z-10 text-gray-800 focus:outline-none';
      button.innerHTML = `<span class="text-[10px] font-semibold">${note.note}</span><span class="text-[9px] ${black ? 'text-gray-300 bg-gray-700' : 'text-gray-500 bg-gray-200'} mt-0.5 uppercase px-1 rounded">${note.key}</span>`;
      const voiceId = pointerId => `pointer:${pointerId}:${note.note}`;
      button.addEventListener('pointerdown', event => {
        if (event.button !== undefined && event.button !== 0) return;
        event.preventDefault();
        try { button.setPointerCapture(event.pointerId); } catch (_) {}
        const id = voiceId(event.pointerId); heldPointers.set(event.pointerId, id); startVoice(id, note.frequency, note.note, button);
      });
      const releasePointer = event => { const id = heldPointers.get(event.pointerId); if (id) { releaseVoice(id); heldPointers.delete(event.pointerId); } };
      button.addEventListener('pointerup', releasePointer);
      button.addEventListener('pointercancel', releasePointer);
      button.addEventListener('lostpointercapture', releasePointer);
      button.addEventListener('click', event => { if (event.detail === 0) playNote(note.frequency, note.note, button, 650); });
      return button;
    }
    whiteKeys.forEach(note => { const button = makeKey(note); whiteElements.set(note.note, button); keyboard.append(button); });
    pianoNotes.filter(note => note.type === 'black').forEach(note => {
      const button = makeKey(note, true), nextWhite = whiteElements.get(blackToNextWhite[note.note]);
      if (nextWhite) { button.style.left = `${nextWhite.offsetLeft}px`; button.style.transform = 'translateX(-50%)'; }
      keyboard.append(button);
    });
    window.keyMap = Object.fromEntries(pianoNotes.map(note => [note.key.toLowerCase(), { frequency: note.frequency, note: note.note, element: keyboard.querySelector(`[data-note="${note.note}"]`) }]));
  }

  function setOctave(nextOctave) {
    releaseAllVoices();
    octave = Math.max(2, Math.min(6, nextOctave));
    buildNotes(); renderKeyboard();
    updateNoteDisplay(`Oitava ${octave} selecionada`);
  }

  function updateSustainButton() {
    const button = $('#pianoSustain');
    if (!button) return;
    button.setAttribute('aria-pressed', String(sustainOn));
    button.textContent = sustainOn ? 'Sustain ligado' : 'Sustain desligado';
  }

  function setSustain(enabled, shouldRecord = true) {
    if (sustainOn === enabled) return;
    sustainOn = enabled;
    updateSustainButton();
    if (shouldRecord) recordEvent('pedal', '', `pedal:${voiceCounter}`, { enabled });
    if (!sustainOn) Array.from(activeVoices.values()).filter(voice => voice.pendingRelease).forEach(voice => releaseVoice(voice.id, true, shouldRecord));
  }

  const recordButton = $('#pianoRecord');
  const playbackButton = $('#pianoPlayback');
  const exportButton = $('#pianoExportMidi');

  function updateRecordControls() {
    if (recordButton) { recordButton.textContent = recording ? 'Encerrar gravação' : 'Gravar'; recordButton.setAttribute('aria-pressed', String(recording)); recordButton.disabled = playingRecording; }
    const hasNotes = recordEvents.some(event => event.type === 'on');
    if (playbackButton) { playbackButton.disabled = recording || !hasNotes; playbackButton.textContent = playingRecording ? 'Parar reprodução' : 'Reproduzir'; }
    if (exportButton) exportButton.disabled = recording || !hasNotes;
    const lessonButton = $('#pianoLessonPlay');
    if (lessonButton) lessonButton.disabled = recording || playingRecording;
    buildNotes();
  }

  function stopRecording() {
    if (!recording) return;
    setSustain(false);
    releaseAllVoices(true);
    recording = false;
    window.clearTimeout(recordTimer); recordTimer = 0;
    updateRecordControls();
    const count = recordEvents.filter(event => event.type === 'on').length;
    setRecordStatus(count ? `Gravação concluída: ${count} notas. Você pode reproduzir ou exportar em MIDI.` : 'Nenhuma nota foi gravada. Toque no piano e tente novamente.');
  }

  function startRecording() {
    if (playingRecording) return;
    releaseAllVoices(false);
    recordEvents = []; recording = true; recordStartedAt = performance.now();
    updateRecordControls();
    setRecordStatus('Gravando por até 2 minutos. Toque as teclas e selecione Encerrar gravação quando terminar.');
    recordTimer = window.setTimeout(() => { stopRecording(); setRecordStatus('Gravação encerrada automaticamente após 2 minutos.'); }, 120000);
  }

  function stopPlayback() {
    playbackTimers.forEach(window.clearTimeout); playbackTimers = [];
    releaseAllVoices(false); playingRecording = false; setSustain(false, false);
    updateRecordControls();
    if (playbackButton) playbackButton.textContent = 'Reproduzir';
  }

  function playRecording() {
    if (playingRecording) { stopPlayback(); setRecordStatus('Reprodução interrompida.'); return; }
    if (recording || !recordEvents.some(event => event.type === 'on') || !initAudio()) return;
    releaseAllVoices(false); playingRecording = true; updateRecordControls();
    const events = recordEvents.slice().sort((a, b) => a.time - b.time || ({ off: 0, pedal: 1, on: 2 }[a.type] - { off: 0, pedal: 1, on: 2 }[b.type]));
    const end = events[events.length - 1].time;
    events.forEach(event => {
      const timer = window.setTimeout(() => {
        if (!playingRecording) return;
        if (event.type === 'on') startVoice(`playback:${event.id}`, frequencyForMidi(midiForNote(event.note)), event.note, null, false);
        else if (event.type === 'off') releaseVoice(`playback:${event.id}`, false, false);
        else if (event.type === 'pedal') setSustain(event.enabled, false);
      }, event.time);
      playbackTimers.push(timer);
    });
    playbackTimers.push(window.setTimeout(() => { stopPlayback(); setRecordStatus('Reprodução concluída.'); }, end + 280));
    setRecordStatus('Reproduzindo a gravação.');
  }

  function variableLength(value) {
    let buffer = Math.max(0, Math.floor(value)) & 0x7f;
    const bytes = [];
    while ((value = Math.floor(value / 128)) > 0) { buffer <<= 8; buffer |= ((value & 0x7f) | 0x80); }
    while (true) { bytes.push(buffer & 0xff); if (buffer & 0x80) buffer >>= 8; else break; }
    return bytes;
  }

  function midiBytes() {
    const priority = { off: 0, pedal: 1, on: 2 };
    const events = recordEvents.filter(event => event.type === 'on' || event.type === 'off' || event.type === 'pedal')
      .map(event => ({ ...event, tick: Math.round(event.time * 0.96) }))
      .sort((a, b) => a.tick - b.tick || priority[a.type] - priority[b.type]);
    const track = []; let previousTick = 0;
    events.forEach(event => {
      const tick = Math.max(previousTick, event.tick), delta = tick - previousTick;
      track.push(...variableLength(delta));
      if (event.type === 'on') track.push(0x90, midiForNote(event.note), 88);
      else if (event.type === 'off') track.push(0x80, midiForNote(event.note), 0);
      else track.push(0xb0, 64, event.enabled ? 127 : 0);
      previousTick = tick;
    });
    track.push(0x00, 0xff, 0x2f, 0x00);
    const trackHeader = [0x4d, 0x54, 0x72, 0x6b, (track.length >>> 24) & 255, (track.length >>> 16) & 255, (track.length >>> 8) & 255, track.length & 255];
    const header = [0x4d, 0x54, 0x68, 0x64, 0, 0, 0, 6, 0, 0, 0, 1, 1, 0xe0];
    return new Uint8Array([...header, ...trackHeader, ...track]);
  }

  function exportMidi() {
    if (recording || !recordEvents.some(event => event.type === 'on')) return;
    const blob = new Blob([midiBytes()], { type: 'audio/midi' });
    const url = URL.createObjectURL(blob), link = document.createElement('a');
    link.href = url; link.download = 'purple-dreams-piano.mid'; link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1500);
    setRecordStatus('Arquivo MIDI exportado para o seu dispositivo.');
  }

  function clearLesson() {
    lessonTimers.forEach(window.clearTimeout); lessonTimers = [];
  }

  function playLesson() {
    if (recording) return;
    if (playingRecording) stopPlayback();
    clearLesson();
    if (!initAudio()) return;
    const lesson = $('#pianoLesson')?.value || 'scale';
    const baseMidi = 12 * (octave + 1);
    let intervals = [0, 2, 4, 5, 7, 9, 11, 12, 11, 9, 7, 5, 4, 2, 0];
    let step = 300, duration = 270, simultaneous = false;
    if (lesson === 'chord') { intervals = [0, 4, 7]; step = 0; duration = 1000; simultaneous = true; }
    if (lesson === 'arpeggio') { intervals = [0, 4, 7, 12, 7, 4, 0]; step = 230; duration = 240; }
    const names = intervals.map(interval => noteForMidi(baseMidi + interval));
    setRecordStatus(`Demonstração: ${lesson === 'scale' ? 'escala de Dó maior' : lesson === 'chord' ? 'acorde de Dó maior' : 'arpejo de Dó maior'}.`);
    intervals.forEach((interval, index) => {
      const timer = window.setTimeout(() => playNote(frequencyForMidi(baseMidi + interval), names[index], null, duration, false), simultaneous ? 0 : index * step);
      lessonTimers.push(timer);
    });
    const total = simultaneous ? duration + 250 : (intervals.length - 1) * step + duration + 200;
    lessonTimers.push(window.setTimeout(() => { lessonTimers = []; setRecordStatus('Demonstração concluída. Escolha outra prática ou toque você mesma.'); }, total));
  }

  function addKeyListeners() {
    window.addEventListener('keydown', event => {
      const target = event.target, tag = target?.tagName?.toLowerCase() || '';
      if (['input', 'textarea', 'select'].includes(tag) || target?.isContentEditable || event.ctrlKey || event.altKey || event.metaKey || event.repeat) return;
      const key = event.key.toLowerCase(), note = window.keyMap?.[key];
      if (!note || playingRecording) return;
      event.preventDefault();
      const id = `keyboard:${key}`;
      heldKeys.set(key, id); startVoice(id, note.frequency, note.note, note.element);
    });
    window.addEventListener('keyup', event => {
      const key = event.key.toLowerCase(), id = heldKeys.get(key);
      if (id) { releaseVoice(id); heldKeys.delete(key); }
    });
    window.addEventListener('blur', () => { releaseAllVoices(true); stopPlayback(); clearLesson(); });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { releaseAllVoices(true); stopPlayback(); clearLesson(); }
      else if (activeVoices.size) animateVisualizer();
    });
  }

  pianoVolume?.addEventListener('input', updateVolume);
  $('#pianoOctaveDown')?.addEventListener('click', () => setOctave(octave - 1));
  $('#pianoOctaveUp')?.addEventListener('click', () => setOctave(octave + 1));
  $('#pianoSustain')?.addEventListener('click', () => setSustain(!sustainOn));
  recordButton?.addEventListener('click', () => recording ? stopRecording() : startRecording());
  playbackButton?.addEventListener('click', playRecording);
  exportButton?.addEventListener('click', exportMidi);
  $('#pianoLessonPlay')?.addEventListener('click', playLesson);
  window.addEventListener('resize', () => { if (activeVoices.size) animateVisualizer(); }, { passive: true });
  if (reducedMotion.addEventListener) reducedMotion.addEventListener('change', () => { if (visualFrame) { cancelAnimationFrame(visualFrame); visualFrame = 0; } if (activeVoices.size) animateVisualizer(); });

  buildNotes(); renderKeyboard(); updateVolume(); updateSustainButton(); updateRecordControls(); addKeyListeners();
  window.initAudio = initAudio;
  window.playNote = playNote;
})();
