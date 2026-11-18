(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  function canvasContext(canvas) {
    const context = canvas.getContext('2d');
    if (!context) return null;
    const rect = canvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.round(rect.width * ratio));
    const height = Math.max(1, Math.round(rect.height * ratio));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width; canvas.height = height;
    }
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    return { ctx: context, width: rect.width, height: rect.height };
  }

  function drawGraph(canvas, fn, options = {}) {
    if (!canvas) return;
    const frame = canvasContext(canvas); if (!frame) return;
    const { ctx, width: w, height: h } = frame;
    ctx.clearRect(0, 0, w, h);
    const pad = { l: 42, r: 18, t: 18, b: 28 };
    const pw = Math.max(1, w - pad.l - pad.r), ph = Math.max(1, h - pad.t - pad.b);
    const xMin = options.xMin ?? -Math.PI * 2, xMax = options.xMax ?? Math.PI * 2;
    const yMin = options.yMin ?? -3.3, yMax = options.yMax ?? 3.3;
    const X = x => pad.l + (x - xMin) / (xMax - xMin) * pw;
    const Y = y => pad.t + (yMax - y) / (yMax - yMin) * ph;
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(212,193,239,.10)';
    for (let i = 0; i <= 8; i++) { const x = pad.l + pw * i / 8; ctx.beginPath(); ctx.moveTo(x, pad.t); ctx.lineTo(x, pad.t + ph); ctx.stroke(); }
    for (let i = 0; i <= 6; i++) { const y = pad.t + ph * i / 6, value = yMax - (yMax - yMin) * i / 6; ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(pad.l + pw, y); ctx.stroke(); ctx.fillStyle = '#b7a8c9'; ctx.font = '10px system-ui,sans-serif'; ctx.fillText(Math.abs(value) < .05 ? '0' : Number(value.toFixed(1)).toString(), 5, y + 3); }
    ctx.strokeStyle = 'rgba(233,220,250,.56)'; ctx.lineWidth = 1.25;
    ctx.beginPath(); ctx.moveTo(X(0), pad.t); ctx.lineTo(X(0), pad.t + ph); ctx.moveTo(pad.l, Y(0)); ctx.lineTo(pad.l + pw, Y(0)); ctx.stroke();
    ctx.fillStyle = '#b7a8c9'; ctx.font = '10px system-ui,sans-serif';
    ctx.fillText('−2π', X(-Math.PI * 2) - 5, h - 7); ctx.fillText('0', X(0) - 3, h - 7); ctx.fillText('2π', X(Math.PI * 2) - 8, h - 7);
    ctx.save(); ctx.shadowColor = 'rgba(186,143,255,.45)'; ctx.shadowBlur = 12;
    ctx.beginPath(); let started = false;
    for (let i = 0; i <= pw; i++) {
      const x = xMin + (xMax - xMin) * i / pw;
      const y = clamp(fn(x), yMin - 1, yMax + 1);
      if (!Number.isFinite(y)) { started = false; continue; }
      const px = X(x), py = Y(y);
      if (!started) { ctx.moveTo(px, py); started = true; } else ctx.lineTo(px, py);
    }
    ctx.strokeStyle = options.color || '#c4a2ff'; ctx.lineWidth = 2.7; ctx.lineJoin = 'round'; ctx.stroke(); ctx.restore();
  }

  const mathFunction = $('#mathFunction');
  const mathAmplitude = $('#mathAmplitude');
  const mathFrequency = $('#mathFrequency');
  const mathEquation = $('#mathEquation');
  function updateMath() {
    if (!mathFunction || !mathAmplitude || !mathFrequency) return;
    const a = Number(mathAmplitude.value), b = Number(mathFrequency.value), type = mathFunction.value;
    $('#mathAmplitudeValue').value = a.toFixed(1).replace('.', ',');
    $('#mathFrequencyValue').value = b.toFixed(1).replace('.', ',');
    const fn = type === 'parabola' ? x => a * (x / Math.PI) ** 2 - 1.5 : type === 'cosine' ? x => a * Math.cos(b * x) : x => a * Math.sin(b * x);
    const label = type === 'parabola' ? `y = ${a.toFixed(1)} · (x/π)² − 1,5` : `y = ${a.toFixed(1)} · ${type === 'cosine' ? 'cos' : 'sen'}(${b.toFixed(1)}x)`;
    mathEquation.textContent = label;
    const canvas = $('#mathCanvas');
    if (type === 'parabola') drawGraph(canvas, fn, { xMin: -Math.PI * 2, xMax: Math.PI * 2, yMin: -2, yMax: 10, color: '#dfb0e4' });
    else drawGraph(canvas, fn, { color: type === 'cosine' ? '#a9d9ff' : '#c4a2ff' });
  }
  [mathFunction, mathAmplitude, mathFrequency].filter(Boolean).forEach(el => el.addEventListener('input', updateMath));

  const waveCanvas = $('#waveCanvas'), waveFrequency = $('#waveFrequency'), waveLength = $('#waveLength');
  let waveTime = 0, waveFrame = 0, waveVisible = true, wavePaused = false, waveMotionOptIn = false;
  function drawWave() {
    if (!waveCanvas) return;
    const frame = canvasContext(waveCanvas); if (!frame) return;
    const { ctx, width: w, height: h } = frame; ctx.clearRect(0, 0, w, h);
    const frequency = Number(waveFrequency.value), lambda = Number(waveLength.value);
    const mid = h * .52, amplitude = Math.min(54, h * .19), phase = waveTime * frequency * 1.45;
    ctx.strokeStyle = 'rgba(194,178,218,.18)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(12, mid); ctx.lineTo(w - 10, mid); ctx.stroke();
    ctx.beginPath();
    for (let x = 0; x <= w; x += 2) { const y = mid - amplitude * Math.sin((x / w) * (w / 105) * (2 * Math.PI / lambda) - phase); x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
    ctx.strokeStyle = '#a9d9ff'; ctx.lineWidth = 2.7; ctx.shadowColor = 'rgba(119,190,255,.5)'; ctx.shadowBlur = 12; ctx.stroke(); ctx.shadowBlur = 0;
    ctx.fillStyle = '#a9d9ff'; ctx.beginPath(); ctx.arc(w * .5, mid - amplitude, 4, 0, Math.PI * 2); ctx.fill();
    $('#waveFrequencyValue').value = `${frequency.toFixed(1).replace('.', ',')} Hz`;
    $('#waveLengthValue').value = `${lambda.toFixed(1).replace('.', ',')} m`;
    $('#waveVelocity').innerHTML = `${(frequency * lambda).toFixed(2).replace('.', ',')} <small>m/s</small>`;
  }
  function waveLoop() { if (!waveVisible || document.hidden || wavePaused || (reduceMotion.matches && !waveMotionOptIn)) { waveFrame = 0; return; } waveTime += .025; drawWave(); waveFrame = requestAnimationFrame(waveLoop); }
  function startWave() { drawWave(); if (waveVisible && !document.hidden && !wavePaused && (!reduceMotion.matches || waveMotionOptIn) && !waveFrame) waveFrame = requestAnimationFrame(waveLoop); }
  function updateWaveToggle() {
    const button = $('#waveToggle'); if (!button) return;
    button.setAttribute('aria-pressed', String(wavePaused));
    button.textContent = wavePaused ? 'Retomar animação' : (reduceMotion.matches && !waveMotionOptIn ? 'Ativar movimento' : 'Pausar animação');
  }
  [waveFrequency, waveLength].filter(Boolean).forEach(el => el.addEventListener('input', drawWave));
  const waveObserver = waveCanvas && 'IntersectionObserver' in window ? new IntersectionObserver(entries => { waveVisible = entries[0].isIntersecting; if (waveVisible) startWave(); else if (waveFrame) { cancelAnimationFrame(waveFrame); waveFrame = 0; } }, { threshold: .05 }) : null;
  if (waveObserver && waveCanvas) waveObserver.observe(waveCanvas);
  $('#waveToggle')?.addEventListener('click', () => {
    if (reduceMotion.matches && !waveMotionOptIn && !wavePaused) { waveMotionOptIn = true; wavePaused = false; }
    else { wavePaused = !wavePaused; if (!wavePaused) waveMotionOptIn = true; }
    updateWaveToggle();
    if (wavePaused && waveFrame) { cancelAnimationFrame(waveFrame); waveFrame = 0; }
    else startWave();
  });

  const categoryPt = { 'Nonmetal':'Não metal', 'Noble gas':'Gás nobre', 'Alkali metal':'Metal alcalino', 'Alkaline earth metal':'Metal alcalino-terroso', 'Metalloid':'Semimetal', 'Halogen':'Halogênio', 'Transition metal':'Metal de transição', 'Post-transition metal':'Metal pós-transição', 'Lanthanide':'Lantanídeo', 'Actinide':'Actinídeo' };
  function positionOf(z, groupBlock) {
    if (z === 1) return [1, 1]; if (z === 2) return [18, 1];
    if (z >= 3 && z <= 4) return [z - 2, 2];
    if (z >= 5 && z <= 10) return [z + 8, 2];
    if (z >= 11 && z <= 12) return [z - 10, 3];
    if (z >= 13 && z <= 18) return [z, 3];
    if (z >= 19 && z <= 36) return [z - 18, 4];
    if (z >= 37 && z <= 54) return [z - 36, 5];
    if (z === 55 || z === 56) return [z - 54, 6];
    if (z >= 57 && z <= 71) return [z - 54, 8];
    if (z >= 72 && z <= 86) return [z - 68, 6];
    if (z === 87 || z === 88) return [z - 86, 7];
    if (z >= 89 && z <= 103) return [z - 86, 9];
    if (z >= 104 && z <= 118) return [z - 100, 7];
    return [1, 1];
  }
  const elements = window.PD_PERIODIC_ELEMENTS || [];
  const periodicGrid = $('#periodicGrid');
  const elementByNumber = new Map(elements.map(el => [el.number, el]));
  function showElement(element) {
    if (!element) return;
    $('#elementNumber').textContent = String(element.number).padStart(2, '0');
    $('#elementName').textContent = element.namePt;
    $('#elementSymbol').textContent = element.symbol;
    const mass = element.atomicMass && !String(element.atomicMass).includes('0.0') ? element.atomicMass : 'ver tabela IUPAC';
    const config = String(element.configuration || '—').replace(/\s*\(predicted\)/i, ' (prevista)');
    $('#elementFacts').innerHTML = '';
    [['Massa atômica', mass], ['Família', categoryPt[element.groupBlock] || element.groupBlock], ['Estado padrão', (element.state || '—').replace('Expected to be a ', 'Previsto: ').replace('Gas','gasoso').replace('Solid','sólido').replace('Liquid','líquido')], ['Configuração eletrônica', config]].forEach(([term, value]) => {
      const row = document.createElement('div'), dt = document.createElement('dt'), dd = document.createElement('dd'); dt.textContent = term; dd.textContent = value; row.append(dt, dd); $('#elementFacts').append(row);
    });
    $$('.element-button', periodicGrid).forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.number) === element.number)));
  }
  function renderPeriodicTable() {
    if (!periodicGrid || !elements.length) return;
    const fragment = document.createDocumentFragment();
    elements.forEach(el => {
      const button = document.createElement('button'), [column, row] = positionOf(el.number, el.groupBlock);
      button.type = 'button'; button.className = 'element-button'; button.dataset.number = el.number; button.dataset.search = `${el.number} ${el.symbol} ${el.namePt.toLocaleLowerCase('pt-BR')} ${el.nameEn.toLocaleLowerCase('en')}`;
      button.style.gridColumn = String(column); button.style.gridRow = String(row);
      const palette = { 'Nonmetal':'#92c8d8','Noble gas':'#d1a2ec','Alkali metal':'#e0a4bb','Alkaline earth metal':'#e8c088','Metalloid':'#9dc59d','Halogen':'#c4a0dc','Transition metal':'#a39bd6','Post-transition metal':'#7dbdb4','Lanthanide':'#e3a88b','Actinide':'#dc8caa' };
      button.style.setProperty('--element-color', palette[el.groupBlock] || '#aa8dd2');
      button.setAttribute('role','gridcell'); button.setAttribute('aria-pressed','false'); button.setAttribute('aria-label',`${el.number}, ${el.namePt}, símbolo ${el.symbol}`);
      button.setAttribute('aria-rowindex', String(row)); button.setAttribute('aria-colindex', String(column)); button.tabIndex = el.number === 6 ? 0 : -1;
      button.innerHTML = `<span class="element-z">${el.number}</span><span class="element-symbol">${el.symbol}</span><span class="element-short-name">${el.namePt}</span>`;
      button.addEventListener('focus', () => $$('.element-button', periodicGrid).forEach(item => { item.tabIndex = item === button ? 0 : -1; }));
      button.addEventListener('keydown', event => {
        if (event.key === 'Home' || event.key === 'End') {
          const visible = elements.filter(item => { const node = $(`.element-button[data-number="${item.number}"]`, periodicGrid); return node && !node.hidden; });
          const target = event.key === 'Home' ? visible[0] : visible[visible.length - 1];
          if (target) { event.preventDefault(); $(`.element-button[data-number="${target.number}"]`, periodicGrid).focus(); }
          return;
        }
        const directions = { ArrowLeft:[-1,0], ArrowRight:[1,0], ArrowUp:[0,-1], ArrowDown:[0,1] };
        const direction = directions[event.key]; if (!direction) return;
        event.preventDefault();
        const [currentColumn,currentRow] = positionOf(el.number, el.groupBlock);
        const candidates = elements.map(item => { const [column,row] = positionOf(item.number,item.groupBlock); return {item,column,row}; })
          .filter(entry => { const node = $(`.element-button[data-number="${entry.item.number}"]`, periodicGrid); if (!node || node.hidden) return false; if (direction[0] < 0) return entry.row === currentRow && entry.column < currentColumn; if (direction[0] > 0) return entry.row === currentRow && entry.column > currentColumn; if (direction[1] < 0) return entry.row < currentRow; return entry.row > currentRow; })
          .sort((a,b) => direction[0] ? Math.abs(a.column-currentColumn)-Math.abs(b.column-currentColumn) : Math.abs(a.row-currentRow)-Math.abs(b.row-currentRow) || Math.abs(a.column-currentColumn)-Math.abs(b.column-currentColumn));
        if (candidates[0]) $(`.element-button[data-number="${candidates[0].item.number}"]`, periodicGrid).focus();
      });
      button.addEventListener('click', () => showElement(el)); fragment.append(button);
    });
    periodicGrid.append(fragment);
    const search = $('#periodicSearch');
    search?.addEventListener('input', () => {
      const query = search.value.trim().toLocaleLowerCase('pt-BR'); let visible = 0;
      $$('.element-button', periodicGrid).forEach(button => { const match = !query || button.dataset.search.includes(query); button.hidden = !match; if (match) visible++; });
      const activeStop = $('.element-button[tabindex="0"]', periodicGrid);
      if (activeStop?.hidden) { const firstVisible = $('.element-button:not([hidden])', periodicGrid); if (firstVisible) { $$('.element-button', periodicGrid).forEach(button => { button.tabIndex = button === firstVisible ? 0 : -1; }); } }
      $('#periodicCount').textContent = `${visible} ${visible === 1 ? 'elemento' : 'elementos'}`;
    });
    showElement(elementByNumber.get(6) || elements[0]);
  }

  const molecules = {
    water: { name:'Água', formula:'H₂O', shape:'Angular · ângulo H–O–H ≈ 104,5°.', desc:'Forma angular, com ângulo H–O–H de aproximadamente 104,5°. O oxigênio tem dois pares de elétrons não ligantes.', atoms:[{e:'O',p:[0,0,0]},{e:'H',p:[-.791,.611,0]},{e:'H',p:[.791,.611,0]}], bonds:[[0,1,1],[0,2,1]] },
    'carbon-dioxide': { name:'Dióxido de carbono', formula:'CO₂', shape:'Linear · ângulo O–C–O = 180°.', desc:'Forma linear. O carbono central tem uma ligação dupla com cada oxigênio.', atoms:[{e:'O',p:[-1.2,0,0]},{e:'C',p:[0,0,0]},{e:'O',p:[1.2,0,0]}], bonds:[[0,1,2],[1,2,2]] },
    methane: { name:'Metano', formula:'CH₄', shape:'Tetraédrica · ângulo H–C–H ≈ 109,5°.', desc:'Forma tetraédrica, com quatro ligações C–H equivalentes e ângulos próximos de 109,5°.', atoms:[{e:'C',p:[0,0,0]},{e:'H',p:[.577,.577,.577]},{e:'H',p:[.577,-.577,-.577]},{e:'H',p:[-.577,.577,-.577]},{e:'H',p:[-.577,-.577,.577]}], bonds:[[0,1,1],[0,2,1],[0,3,1],[0,4,1]] },
    ammonia: { name:'Amônia', formula:'NH₃', shape:'Trigonal piramidal · ângulo H–N–H ≈ 107°.', desc:'Forma trigonal piramidal. Um par não ligante no nitrogênio reduz o ângulo H–N–H para cerca de 107°.', atoms:[{e:'N',p:[0,0,0]},{e:'H',p:[.931,0,.366]},{e:'H',p:[-.466,.807,.366]},{e:'H',p:[-.466,-.807,.366]}], bonds:[[0,1,1],[0,2,1],[0,3,1]] }
  };
  const moleculeCanvas=$('#moleculeCanvas'), moleculeContext=moleculeCanvas?.getContext('2d');
  let currentMolecule='water', moleculeYaw=.45, moleculePitch=-.22, moleculeDrag=null;
  const atomPalette={H:['#ffffff','#e8f0ff','#77849b','#263449'],C:['#e0e5f0','#8995aa','#374055','#ffffff'],O:['#ffd3d7','#ed6471','#7d263e','#ffffff'],N:['#d9e7ff','#6691e3','#203f81','#ffffff']};
  function drawMoleculeModel() {
    const item=molecules[currentMolecule]; if (!item || !moleculeCanvas || !moleculeContext) return;
    const box=moleculeCanvas.getBoundingClientRect(), width=Math.max(1,box.width), height=Math.max(1,box.height), dpr=Math.min(window.devicePixelRatio||1,2);
    moleculeCanvas.width=Math.round(width*dpr); moleculeCanvas.height=Math.round(height*dpr);
    const ctx=moleculeContext;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,width,height);
    const glow=ctx.createRadialGradient(width*.5,height*.49,2,width*.5,height*.49,height*.66);glow.addColorStop(0,'rgba(203,174,255,.13)');glow.addColorStop(1,'rgba(22,15,34,0)');ctx.fillStyle=glow;ctx.fillRect(0,0,width,height);
    const cy=Math.cos(moleculeYaw),sy=Math.sin(moleculeYaw),cx=Math.cos(moleculePitch),sx=Math.sin(moleculePitch),focal=Math.min(width*1.1,height*1.8),distance=4.25;
    const points=item.atoms.map(atom=>{const [x,y,z]=atom.p;const rx=x*cy-z*sy,rz=x*sy+z*cy,ry=y*cx-rz*sx,rz2=y*sx+rz*cx,scale=focal/(distance-rz2);return {e:atom.e,x:width*.5+rx*scale,y:height*.51-ry*scale,z:rz2,scale};});
    const segments=[];item.bonds.forEach(([ai,bi,order])=>{const a=points[ai],b=points[bi],dx=b.x-a.x,dy=b.y-a.y,len=Math.max(1,Math.hypot(dx,dy)),px=-dy/len,py=dx/len,offset=order===2?3.8:0,shifts=order===2?[-offset,offset]:[0];shifts.forEach(shift=>segments.push({a,b,px,py,shift,z:(a.z+b.z)/2}));});
    segments.sort((a,b)=>a.z-b.z);
    segments.forEach(({a,b,px,py,shift})=>{const xa=a.x+px*shift,ya=a.y+py*shift,xb=b.x+px*shift,yb=b.y+py*shift,grad=ctx.createLinearGradient(xa,ya,xb,yb);grad.addColorStop(0,atomPalette[a.e][1]);grad.addColorStop(1,atomPalette[b.e][1]);ctx.beginPath();ctx.moveTo(xa,ya);ctx.lineTo(xb,yb);ctx.lineCap='round';ctx.strokeStyle='rgba(8,6,17,.74)';ctx.lineWidth=9;ctx.stroke();ctx.strokeStyle=grad;ctx.lineWidth=5.5;ctx.stroke();});
    points.slice().sort((a,b)=>a.z-b.z).forEach(point=>{const palette=atomPalette[point.e],radius=(point.e==='H'?12:18)*point.scale/52;ctx.save();ctx.shadowColor=palette[1];ctx.shadowBlur=12;const sphere=ctx.createRadialGradient(point.x-radius*.36,point.y-radius*.42,radius*.06,point.x,point.y,radius);sphere.addColorStop(0,palette[0]);sphere.addColorStop(.48,palette[1]);sphere.addColorStop(1,palette[2]);ctx.fillStyle=sphere;ctx.beginPath();ctx.arc(point.x,point.y,radius,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle='rgba(255,255,255,.3)';ctx.lineWidth=1;ctx.stroke();ctx.fillStyle=palette[3];ctx.font='700 11px system-ui,sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(point.e,point.x,point.y+.4);ctx.restore();});
  }
  function drawMolecule(key) {
    const item=molecules[key];if(!item)return;currentMolecule=key;moleculeYaw=.45;moleculePitch=-.22;
    $('#moleculeName').textContent=item.name;$('#moleculeFormula').textContent=item.formula;$('#moleculeDescription').textContent=item.shape;
    moleculeCanvas?.setAttribute('aria-label',`Modelo 3D esquemático de ${item.name}, fórmula ${item.formula}. ${item.shape} Use arraste ou as setas do teclado para girar.`);
    $$('.molecule-choices button').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.molecule===key)));
    drawMoleculeModel();
  }
  function rotateMolecule(yaw,pitch=0){moleculeYaw+=yaw;moleculePitch=Math.max(-1.05,Math.min(1.05,moleculePitch+pitch));drawMoleculeModel();}
  $$('.molecule-choices button').forEach(button=>button.addEventListener('click',()=>drawMolecule(button.dataset.molecule)));
  $('#moleculeRotateLeft')?.addEventListener('click',()=>rotateMolecule(-.3));
  $('#moleculeRotateRight')?.addEventListener('click',()=>rotateMolecule(.3));
  $('#moleculeReset')?.addEventListener('click',()=>{moleculeYaw=.45;moleculePitch=-.22;drawMoleculeModel();moleculeCanvas?.focus({preventScroll:true});});
  moleculeCanvas?.addEventListener('keydown',event=>{const step=.18;if(event.key==='ArrowLeft')rotateMolecule(-step);else if(event.key==='ArrowRight')rotateMolecule(step);else if(event.key==='ArrowUp')rotateMolecule(0,-step);else if(event.key==='ArrowDown')rotateMolecule(0,step);else if(event.key==='Home'){moleculeYaw=.45;moleculePitch=-.22;drawMoleculeModel();}else return;event.preventDefault();});
  moleculeCanvas?.addEventListener('pointerdown',event=>{moleculeDrag={x:event.clientX,y:event.clientY};moleculeCanvas.setPointerCapture?.(event.pointerId);moleculeCanvas.classList.add('is-dragging');});
  moleculeCanvas?.addEventListener('pointermove',event=>{if(!moleculeDrag)return;const dx=event.clientX-moleculeDrag.x,dy=event.clientY-moleculeDrag.y;moleculeDrag={x:event.clientX,y:event.clientY};rotateMolecule(dx*.009,dy*.009);});
  const stopMoleculeDrag=()=>{moleculeDrag=null;moleculeCanvas?.classList.remove('is-dragging');};
  moleculeCanvas?.addEventListener('pointerup',stopMoleculeDrag);moleculeCanvas?.addEventListener('pointercancel',stopMoleculeDrag);window.addEventListener('resize',drawMoleculeModel,{passive:true});
  if(moleculeCanvas&&!moleculeContext){$('#moleculeDescription').textContent='O desenho em 3D não está disponível neste navegador; consulte a geometria e as fontes abaixo.';moleculeCanvas.setAttribute('aria-label','Canvas 3D não disponível. As informações de geometria molecular permanecem em texto.');}
  drawMolecule('water');

  const organelles = {
    membrane:['Membrana plasmática','Delimita a célula e regula a passagem de substâncias entre o interior e o ambiente.'],
    nucleus:['Núcleo','Armazena a maior parte do DNA e participa da regulação das atividades celulares.'],
    mitochondria:['Mitocôndria','Participa de etapas da respiração celular e da produção de ATP.'],
    er:['Retículo endoplasmático','O retículo rugoso participa da síntese de proteínas; o liso atua, entre outras funções, na síntese de lipídios.'],
    golgi:['Complexo de Golgi','Modifica, organiza e encaminha proteínas e lipídios para destinos celulares.'],
    ribosome:['Ribossomos','Estruturas que participam da síntese de proteínas.']
  };
  $$('.organelle-list button').forEach(button => button.addEventListener('click', () => {
    const entry = organelles[button.dataset.organelle]; if (!entry) return;
    $('#organelleName').textContent = entry[0]; $('#organelleDescription').textContent = entry[1];
    $$('.organelle-list button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  }));

  const neuronCanvas = $('#neuronCanvas'), neuronInput = $('#neuronInput');
  function drawNeuron() {
    if (!neuronCanvas || !neuronInput) return;
    const frame=canvasContext(neuronCanvas);if(!frame)return;
    const {ctx,width:w,height:h}=frame;ctx.clearRect(0,0,w,h);
    const pad={l:48,r:14,t:20,b:34}, pw=w-pad.l-pad.r, ph=h-pad.t-pad.b;
    const ymin=-85,ymax=50, X=t=>pad.l+t*pw, Y=v=>pad.t+(ymax-v)/(ymax-ymin)*ph;
    ctx.strokeStyle='rgba(212,193,239,.1)';ctx.lineWidth=1;
    [-80,-60,-40,-20,0,20,40].forEach(v=>{ctx.beginPath();ctx.moveTo(pad.l,Y(v));ctx.lineTo(w-pad.r,Y(v));ctx.stroke();ctx.fillStyle='#b6a6c7';ctx.font='10px system-ui';ctx.fillText(`${v}`,5,Y(v)+3);});
    const resting=-65, stimulus=Number(neuronInput.value), fired=stimulus>=58;
    ctx.setLineDash([4,5]);ctx.strokeStyle='rgba(208,173,255,.55)';ctx.beginPath();ctx.moveTo(pad.l,Y(resting));ctx.lineTo(w-pad.r,Y(resting));ctx.stroke();ctx.setLineDash([]);
    if(fired){const points=[[0,resting],[.2,resting],[.28,-58],[.34,-25],[.39,34],[.43,25],[.48,-15],[.54,-77],[.62,-70],[.76,resting],[1,resting]];ctx.beginPath();points.forEach(([x,v],i)=>i?ctx.lineTo(X(x),Y(v)):ctx.moveTo(X(x),Y(v)));}
    else {const peak=resting+stimulus*.17;ctx.beginPath();ctx.moveTo(X(0),Y(resting));ctx.lineTo(X(.2),Y(resting));ctx.quadraticCurveTo(X(.35),Y(peak+4),X(.48),Y(peak));ctx.quadraticCurveTo(X(.65),Y(peak-4),X(.76),Y(resting));ctx.lineTo(X(1),Y(resting));}
    ctx.strokeStyle='#e0b4ee';ctx.lineWidth=2.6;ctx.shadowColor='rgba(218,167,244,.38)';ctx.shadowBlur=10;ctx.stroke();ctx.shadowBlur=0;
    $('#neuronInputValue').value=`${stimulus}%`;
    $('#neuronReadout').textContent=fired?'Estímulo suficiente para ilustrar um potencial de ação.':'Resposta sub-limiar esquemática: a membrana retorna ao repouso.';
  }
  neuronInput?.addEventListener('input',drawNeuron);

  const barsEl=$('#sortBars');let original=[12,5,17,8,3,14,9,2], values=original.slice(), i=0,j=0, comparisons=0, sorted=false;
  function renderBars(compareA=-1,compareB=-1){if(!barsEl)return;barsEl.replaceChildren();const max=Math.max(...values,1);values.forEach((value,index)=>{const bar=document.createElement('div');bar.className='sort-bar';bar.style.height=`${Math.max(12,value/max*92)}%`;bar.textContent=String(value);bar.setAttribute('aria-label',`Valor ${value}`);if(sorted)bar.classList.add('is-sorted');else if(index===compareA||index===compareB)bar.classList.add('is-compare');barsEl.append(bar);});barsEl.setAttribute('aria-label',`Sequência: ${values.join(', ')}`);}
  function finishSort(){sorted=true;$('#sortStatus').textContent='Sequência ordenada.';$('#sortStep').disabled=true;renderBars();}
  function resetSort(next=original.slice()){original=next.slice();values=next.slice();i=0;j=0;comparisons=0;sorted=false;$('#sortStep').disabled=false;$('#sortStatus').textContent='Pronta para ordenar.';$('#sortStepCount').textContent='Passos: 0';$('#sortCompare').textContent='Comparações: —';renderBars();}
  function nextSortStep(){if(sorted)return;const n=values.length;if(j>=n-i-1){if(i>=n-2){finishSort();return;}i++;j=0;}const left=j,right=j+1,leftValue=values[left],rightValue=values[right];comparisons++;const didSwap=leftValue>rightValue;if(didSwap)[values[left],values[right]]=[values[right],values[left]];j++;$('#sortStatus').textContent=didSwap?`Troca: ${rightValue} passa para a esquerda de ${leftValue}.`:`Sem troca: ${leftValue} ≤ ${rightValue}.`;$('#sortStepCount').textContent=`Passos: ${comparisons}`;$('#sortCompare').textContent=`Comparações: ${comparisons}`;renderBars(left,right);if(i>=n-2&&j>=n-i-1)finishSort();}
  $('#sortStep')?.addEventListener('click',nextSortStep);
  $('#sortNew')?.addEventListener('click',()=>{const next=Array.from({length:8},()=>Math.floor(Math.random()*18)+2);resetSort(next);$('#sortStatus').textContent='Nova sequência pronta.';});
  $('#sortReset')?.addEventListener('click',()=>resetSort());

  function redrawStatic(){updateMath();drawWave();drawNeuron();}
  renderPeriodicTable(); drawMolecule('water'); drawNeuron(); updateMath(); drawWave(); updateWaveToggle(); resetSort();
  let resizeTimer=0;window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(redrawStatic,100);},{passive:true});
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&waveFrame){cancelAnimationFrame(waveFrame);waveFrame=0;}else if(!document.hidden)startWave();});
  if(reduceMotion.addEventListener)reduceMotion.addEventListener('change',()=>{if(reduceMotion.matches){waveMotionOptIn=false;if(waveFrame){cancelAnimationFrame(waveFrame);waveFrame=0;}}else startWave();updateWaveToggle();});
})();
