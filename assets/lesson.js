/* ===== 關卡播放器 + 巧克力互動元件 =====
   一次只出現一小步：可可貓說話 → 互動畫面 → 小問題 → 答對才能繼續。
   依賴 common.js 的 JH（Store、renderMath）。 */
(function () {
  'use strict';
  const { Store, renderMath } = JH;
  const NS = 'http://www.w3.org/2000/svg';

  /* ---------- 小工具 ---------- */
  function h(html) { const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; }
  function svgEl(tag, attrs, parent) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const fmt = n => String(parseFloat(Number(n).toFixed(10)));
  function parse(s) {
    s = String(s == null ? '' : s).replace(/[,，\s]/g, '').replace(/[−–－]/g, '-').replace(/．/g, '.');
    if (!/^[+-]?(\d+(\.\d*)?|\.\d+)$/.test(s)) return NaN;
    return Number(s);
  }
  const eq = (a, b) => Math.abs(a - b) < 1e-9;

  /* ---------- 彩帶 ---------- */
  function confetti() {
    const box = h('<div class="confetti" aria-hidden="true"></div>');
    document.body.appendChild(box);
    const icons = ['🍫', '⭐', '✨', '🎉', '🍬'];
    for (let i = 0; i < 28; i++) {
      const s = document.createElement('span');
      s.textContent = icons[i % icons.length];
      s.style.left = Math.random() * 100 + 'vw';
      s.style.animationDelay = Math.random() * 0.5 + 's';
      s.style.fontSize = 18 + Math.random() * 18 + 'px';
      box.appendChild(s);
    }
    setTimeout(() => box.remove(), 2600);
  }

  /* =========================================================
     巧克力格子 Choco
     opts: {rows, cols, cell(px), flavor}
     ========================================================= */
  const FLAVOR = {
    choco: { fill: '#8a5a3c', name: '巧克力' },
    milk: { fill: '#e9cfa6', name: '牛奶' },
    berry: { fill: '#f28fad', name: '草莓' },
    matcha: { fill: '#8cc084', name: '抹茶' },
    orange: { fill: '#f6a54b', name: '橘子' },
    blue: { fill: '#9aa8f5', name: '藍莓' },
    ghost: { fill: 'none', name: '' }
  };

  function Choco(host, opts) {
    const R = opts.rows, C = opts.cols;
    const S = opts.cell || Math.max(18, Math.min(56, Math.floor(300 / Math.max(R, C))));
    const pad = opts.pad == null ? 34 : opts.pad;
    const extraW = opts.extraW || 0, extraH = opts.extraH || 0;
    const W = C * S + pad * 2 + extraW, H = R * S + pad * 2 + extraH;
    const wrap = h('<div class="choco-wrap"></div>');
    host.appendChild(wrap);
    const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, class: 'choco', role: 'img' }, wrap);
    const layer = svgEl('g', {}, svg);
    const over = svgEl('g', {}, svg);
    const cells = [];
    for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
      const g = svgEl('g', { class: 'cell' }, layer);
      const x = pad + c * S, y = pad + r * S;
      const base = svgEl('rect', { x: x + 1.5, y: y + 1.5, width: S - 3, height: S - 3, rx: Math.min(6, S / 5), class: 'cell-body', fill: FLAVOR[opts.flavor || 'choco'].fill }, g);
      svgEl('rect', { x: x + 4, y: y + 4, width: S - 8, height: Math.max(2, (S - 8) * 0.28), rx: 3, class: 'cell-shine' }, g);
      const num = svgEl('text', { x: x + S / 2, y: y + S / 2 + 1, 'text-anchor': 'middle', 'dominant-baseline': 'middle', class: 'cell-num', 'font-size': Math.max(10, S * 0.42) }, g);
      g.style.transformOrigin = `${x + S / 2}px ${y + S / 2}px`;
      cells.push({ r, c, g, base, num, x, y, dx: 0, dy: 0 });
    }
    const at = (r, c) => cells[r * C + c];
    const api = {
      svg, over, S, pad, R, C, W, H, cells, at,
      // 上色：區塊 {r0,c0,r1,c1}（含頭不含尾）
      paint(r0, c0, r1, c1, flavor) {
        for (let r = r0; r < r1; r++) for (let c = c0; c < c1; c++) at(r, c).base.setAttribute('fill', FLAVOR[flavor].fill);
      },
      // 點一點數格子
      countMode(onCount) {
        let n = 0;
        cells.forEach(cl => {
          cl.g.classList.add('tappable');
          cl.g.addEventListener('click', () => {
            if (cl.counted || cl.gone) return;
            cl.counted = true; n++;
            cl.num.textContent = n;
            cl.g.classList.add('counted');
            if (onCount) onCount(n);
          });
        });
        return { reset() { n = 0; cells.forEach(cl => { cl.counted = false; cl.num.textContent = ''; cl.g.classList.remove('counted'); }); } };
      },
      // 移動某些格子（分開、搬家）
      shift(filter, dx, dy) {
        cells.forEach(cl => { if (filter(cl)) { cl.dx += dx; cl.dy += dy; cl.g.style.transform = `translate(${cl.dx}px, ${cl.dy}px)`; } });
      },
      // 在格子縫上切一刀：axis 'v' 切在第 at 欄前面，'h' 切在第 at 列前面
      split(axis, k, gap) {
        gap = gap == null ? Math.round(S * 0.35) : gap;
        if (axis === 'v') api.shift(cl => cl.c >= k, gap, 0);
        else api.shift(cl => cl.r >= k, 0, gap);
      },
      // 讓小孩點縫隙切：targets 只接受正確位置
      cutMode(axis, target, onOk, onWrong) {
        const lines = [];
        const n = axis === 'v' ? C : R;
        for (let k = 1; k < n; k++) {
          const g = svgEl('g', { class: 'cut-hit' }, over);
          let line, hit;
          if (axis === 'v') {
            const x = pad + k * S;
            hit = svgEl('rect', { x: x - S * 0.3, y: pad - 14, width: S * 0.6, height: R * S + 28, fill: 'transparent' }, g);
            line = svgEl('line', { x1: x, y1: pad - 12, x2: x, y2: pad + R * S + 12, class: 'cut-line' }, g);
          } else {
            const y = pad + k * S;
            hit = svgEl('rect', { x: pad - 14, y: y - S * 0.3, width: C * S + 28, height: S * 0.6, fill: 'transparent' }, g);
            line = svgEl('line', { x1: pad - 12, y1: y, x2: pad + C * S + 12, y2: y, class: 'cut-line' }, g);
          }
          g.addEventListener('click', () => {
            if (k === target) {
              lines.forEach(l => l.remove());
              api.split(axis, k);
              onOk && onOk();
            } else {
              line.classList.add('cut-wrong');
              setTimeout(() => line.classList.remove('cut-wrong'), 500);
              onWrong && onWrong(k);
            }
          });
          lines.push(g);
        }
      },
      // 被吃掉
      async eat(filter, who) {
        const list = cells.filter(cl => filter(cl) && !cl.gone);
        let critter = null;
        if (who && list.length) {
          critter = svgEl('text', { x: list[0].x + list[0].dx, y: list[0].y + list[0].dy + S * 0.75, 'font-size': S * 1.1, class: 'critter' }, over);
          critter.textContent = who;
        }
        for (const cl of list) {
          if (critter) { critter.setAttribute('x', cl.x + cl.dx - S * 0.1); critter.setAttribute('y', cl.y + cl.dy + S * 0.8); }
          await sleep(110);
          cl.gone = true;
          cl.g.classList.add('eaten');
        }
        await sleep(250);
        if (critter) critter.remove();
      },
      // 已被吃掉的格子顯示成虛線框
      ghost(filter) { cells.forEach(cl => { if (filter(cl)) { cl.gone = true; cl.g.classList.add('ghosted'); } }); },
      // 閃爍提示
      flash(filter) { cells.forEach(cl => { if (filter(cl)) { cl.g.classList.remove('flash'); void cl.g.getBBox(); cl.g.classList.add('flash'); } }); },
      // 在區塊中央寫字
      label(r0, c0, r1, c1, s, opts2) {
        const o = opts2 || {};
        const a = at(r0, c0);
        const x = pad + (c0 + c1) / 2 * S + a.dx, y = pad + (r0 + r1) / 2 * S + a.dy;
        const t = svgEl('text', { x, y, 'text-anchor': 'middle', 'dominant-baseline': 'middle', class: 'region-label', 'font-size': o.size || Math.max(13, S * 0.55) }, over);
        t.textContent = s;
        return t;
      },
      // 邊長尺規
      ruler(side, from, to, s, offset) {
        const off = offset || 0;
        const g = svgEl('g', { class: 'ruler' }, over);
        if (side === 'top') {
          const y = pad - 12, x1 = pad + from * S + off, x2 = pad + to * S + off;
          svgEl('line', { x1: x1 + 2, y1: y, x2: x2 - 2, y2: y }, g);
          svgEl('line', { x1: x1 + 2, y1: y - 5, x2: x1 + 2, y2: y + 5 }, g);
          svgEl('line', { x1: x2 - 2, y1: y - 5, x2: x2 - 2, y2: y + 5 }, g);
          const t = svgEl('text', { x: (x1 + x2) / 2, y: y - 9, 'text-anchor': 'middle' }, g); t.textContent = s;
        } else {
          const x = pad - 12, y1 = pad + from * S + off, y2 = pad + to * S + off;
          svgEl('line', { x1: x, y1: y1 + 2, x2: x, y2: y2 - 2 }, g);
          svgEl('line', { x1: x - 5, y1: y1 + 2, x2: x + 5, y2: y1 + 2 }, g);
          svgEl('line', { x1: x - 5, y1: y2 - 2, x2: x + 5, y2: y2 - 2 }, g);
          const t = svgEl('text', { x: x - 8, y: (y1 + y2) / 2, 'text-anchor': 'end', 'dominant-baseline': 'middle' }, g); t.textContent = s;
        }
        return g;
      },
      clearOver() { while (over.firstChild) over.removeChild(over.firstChild); }
    };
    return api;
  }

  /* =========================================================
     拼圖 Puzzle：把巧克力塊拖進框框
     pieces: [{w,h,flavor,label, sx,sy (起點格), tx,ty (目標格)}]，單位都是格
     ========================================================= */
  function Puzzle(host, opts, onDone) {
    const S = opts.cell || 34, cols = opts.cols, rows = opts.rows;
    const W = cols * S, H = rows * S;
    const wrap = h('<div class="choco-wrap"></div>');
    host.appendChild(wrap);
    const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, class: 'choco puzzle', role: 'img' }, wrap);
    const fr = opts.frame; // {x,y,w,h}
    svgEl('rect', { x: fr.x * S, y: fr.y * S, width: fr.w * S, height: fr.h * S, class: 'frame' }, svg);
    const ft = svgEl('text', { x: (fr.x + fr.w / 2) * S, y: (fr.y + fr.h / 2) * S, 'text-anchor': 'middle', 'dominant-baseline': 'middle', class: 'frame-text' }, svg);
    ft.textContent = '拼到這裡';
    let placed = 0;
    opts.pieces.forEach(p => {
      const g = svgEl('g', { class: 'piece' }, svg);
      for (let r = 0; r < p.h; r++) for (let c = 0; c < p.w; c++) {
        svgEl('rect', { x: c * S + 1.5, y: r * S + 1.5, width: S - 3, height: S - 3, rx: 5, fill: FLAVOR[p.flavor].fill, class: 'cell-body' }, g);
        svgEl('rect', { x: c * S + 4, y: r * S + 4, width: S - 8, height: (S - 8) * 0.28, rx: 3, class: 'cell-shine' }, g);
      }
      if (p.label) {
        const t = svgEl('text', { x: p.w * S / 2, y: p.h * S / 2, 'text-anchor': 'middle', 'dominant-baseline': 'middle', class: 'region-label', 'font-size': 15 }, g);
        t.textContent = p.label;
      }
      let x = p.sx * S, y = p.sy * S, drag = null;
      const place = () => g.setAttribute('transform', `translate(${x} ${y})`);
      place();
      const toLocal = e => {
        const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
        return pt.matrixTransform(svg.getScreenCTM().inverse());
      };
      g.addEventListener('pointerdown', e => {
        if (p.done) return;
        e.preventDefault();
        g.setPointerCapture(e.pointerId);
        const q = toLocal(e);
        drag = { ox: q.x - x, oy: q.y - y };
        svg.appendChild(g);
        g.classList.add('dragging');
      });
      g.addEventListener('pointermove', e => {
        if (!drag) return;
        const q = toLocal(e);
        x = q.x - drag.ox; y = q.y - drag.oy; place();
      });
      const end = () => {
        if (!drag) return;
        drag = null; g.classList.remove('dragging');
        // 找符合形狀的空位
        const slot = opts.pieces.find(o => !o.filled && o.w === p.w && o.h === p.h && Math.abs(x - o.tx * S) < S * 0.7 && Math.abs(y - o.ty * S) < S * 0.7);
        if (slot) {
          slot.filled = true; p.done = true;
          x = slot.tx * S; y = slot.ty * S; place();
          g.classList.add('placed');
          placed++;
          ft.textContent = '';
          if (placed === opts.pieces.length) onDone && onDone();
        }
      };
      g.addEventListener('pointerup', end);
      g.addEventListener('pointercancel', end);
    });
  }

  /* =========================================================
     關卡播放器
     stage: {id, title, badge, steps:[step]}
     step: {say, scene(host, api), ask, after}
       ask: {type:'num', fields:[{answer, pre, post, diag:[{v,msg}]}], hint}
            {type:'choice', options:[{t, ok, why}]}
            {type:'action', text}   // 由畫面呼叫 api.done()
            undefined                // 只要按「繼續」
     ========================================================= */
  function play(host, stage, onFinish) {
    host.innerHTML = '';
    const el = h(`<div class="player">
      <div class="player-top"><button class="btn back" type="button">← 回地圖</button>
        <div class="pbar"><div class="pfill"></div></div></div>
      <div class="player-title"></div>
      <div class="stage-body"></div></div>`);
    host.appendChild(el);
    el.querySelector('.player-title').innerHTML = `${stage.badge} ${stage.title}`;
    const body = el.querySelector('.stage-body');
    const pfill = el.querySelector('.pfill');
    let i = 0;
    el.querySelector('.back').addEventListener('click', () => onFinish(false));

    function showStep() {
      pfill.style.width = (i / stage.steps.length * 100) + '%';
      const step = stage.steps[i];
      body.innerHTML = '';
      const card = h(`<div class="step-card">
        <div class="say"><span class="cat" aria-hidden="true">🐱</span><div class="bubble"></div></div>
        <div class="scene"></div><div class="ask"></div><div class="fb"></div>
        <div class="row nav"><button class="btn primary next" type="button" disabled>繼續 →</button></div></div>`);
      body.appendChild(card);
      card.querySelector('.bubble').innerHTML = step.say;
      const scene = card.querySelector('.scene');
      const askEl = card.querySelector('.ask');
      const fb = card.querySelector('.fb');
      const next = card.querySelector('.next');
      let wrong = 0, finished = false;

      function say(html, cls) { fb.className = 'fb show ' + (cls || ''); fb.innerHTML = html; renderMath(fb); }
      function complete(firstTry) {
        if (finished) return;
        finished = true;
        if (step.ask && step.ask.type === 'action') {
          const tip = askEl.querySelector('.action-tip');
          if (tip) tip.remove();
          if (fb.classList.contains('hintc') || fb.classList.contains('badc')) fb.className = 'fb';
        }
        if (step.after) { const a = h(`<div class="after"></div>`); a.innerHTML = step.after; card.insertBefore(a, card.querySelector('.nav')); renderMath(a); }
        next.disabled = false;
        next.focus({ preventScroll: true });
        if (step.onDone) step.onDone(sceneApi);
      }
      const sceneApi = { done: () => complete(true), say, card };

      if (step.scene) step.scene(scene, sceneApi);
      if (!step.scene) scene.remove();

      const ask = step.ask;
      if (!ask) {
        next.disabled = false;
        finished = true;
        if (step.after) { const a = h(`<div class="after"></div>`); a.innerHTML = step.after; card.insertBefore(a, card.querySelector('.nav')); }
      } else if (ask.type === 'action') {
        askEl.innerHTML = `<div class="action-tip">👉 ${ask.text}</div>`;
      } else if (ask.type === 'choice') {
        if (ask.q) askEl.appendChild(h(`<div class="q">${ask.q}</div>`));
        const box = h('<div class="choices"></div>');
        askEl.appendChild(box);
        ask.options.forEach(o => {
          const b = h(`<button class="choice" type="button"></button>`);
          b.innerHTML = o.t;
          b.addEventListener('click', () => {
            if (finished) return;
            box.querySelectorAll('.choice').forEach(x => x.classList.remove('ng'));
            if (o.ok) { b.classList.add('ok'); say('✔ ' + (o.why || '答對了！'), 'good'); complete(wrong === 0); }
            else { b.classList.add('ng'); wrong++; say('再想想：' + (o.why || '不是這個喔。'), 'badc'); }
          });
          box.appendChild(b);
        });
      } else if (ask.type === 'num') {
        if (ask.q) askEl.appendChild(h(`<div class="q">${ask.q}</div>`));
        const line = h('<div class="q-fields"></div>');
        askEl.appendChild(line);
        const inputs = ask.fields.map(f => {
          if (f.nl) line.appendChild(h('<span class="nl"></span>'));
          if (f.pre) line.appendChild(h(`<span>${f.pre}</span>`));
          const inp = h(`<input autocomplete="off" inputmode="decimal" aria-label="答案">`);
          if (String(f.answer).length > 4) inp.classList.add('wide');
          inp.addEventListener('keydown', e => { if (e.key === 'Enter') check(); });
          line.appendChild(inp);
          if (SIGNED) {
            // 手機數字鍵盤常常沒有負號：旁邊放一顆「±」切換正負
            const pm = h('<button class="btn pm" type="button" aria-label="切換正負號">±</button>');
            pm.addEventListener('click', () => {
              if (inp.readOnly) return;
              const v = inp.value.trim();
              inp.value = /^[-−－]/.test(v) ? v.replace(/^[-−－]\s*/, '') : '-' + v;
              inp.focus();
            });
            line.appendChild(pm);
          }
          if (f.post) line.appendChild(h(`<span>${f.post}</span>`));
          return inp;
        });
        const row = h(`<div class="row"><button class="btn primary chk" type="button">對答案</button></div>`);
        askEl.appendChild(row);
        let hintBtn = null;
        function check() {
          if (finished) return;
          const vals = inputs.map(x => parse(x.value));
          if (vals.some(isNaN)) { say('先把每一格都填上數字喔！'); return; }
          let bad = null;
          // groups：可以互換順序的幾組欄位，例如 (x+3)(x+4) 和 (x+4)(x+3) 都對
          let order = ask.fields.map((f, k) => k);
          if (ask.groups) {
            const perms = a => a.length <= 1 ? [a] : a.flatMap((x, i) => perms(a.slice(0, i).concat(a.slice(i + 1))).map(r => [x].concat(r)));
            let best = -1;
            perms(ask.groups.map((g, i) => i)).forEach(pm => {
              const o = ask.fields.map((f, k) => k);
              pm.forEach((src, dst) => ask.groups[dst].forEach((k, j) => { o[k] = ask.groups[src][j]; }));
              const score = vals.filter((v, k) => eq(v, ask.fields[o[k]].answer)).length;
              if (score > best) { best = score; order = o; }
            });
          }
          vals.forEach((v, k) => {
            const f = ask.fields[order[k]];
            const ok = eq(v, f.answer);
            inputs[k].classList.toggle('ok', ok); inputs[k].classList.toggle('ng', !ok);
            if (ok && !ask.groups) inputs[k].readOnly = true;
            if (!ok && !bad) bad = { f, v };
          });
          if (!bad) { inputs.forEach(x => { x.readOnly = true; }); row.remove(); say('✔ 答對了！', 'good'); complete(wrong === 0); return; }
          wrong++;
          const d = (bad.f.diag || []).find(x => eq(x.v, bad.v));
          if (d) say('🔍 ' + d.msg, 'badc');
          else if (ask.hint && wrong >= 1) say('還差一點！💡 ' + ask.hint, 'badc');
          else say('還差一點，再試一次！', 'badc');
          if (wrong >= 3 && !hintBtn) {
            hintBtn = h('<button class="btn" type="button">告訴我答案</button>');
            hintBtn.addEventListener('click', () => {
              inputs.forEach((x, k) => { x.value = fmt(ask.fields[k].answer); x.classList.add('ok'); x.readOnly = true; });
              row.remove();
              say('答案填好了。看懂之後再繼續喔！', 'hintc');
              complete(false);
            });
            row.appendChild(hintBtn);
          }
        }
        row.querySelector('.chk').addEventListener('click', check);
      }
      renderMath(card);
      next.addEventListener('click', () => {
        i++;
        if (i < stage.steps.length) { showStep(); window.scrollTo({ top: host.offsetTop - 60, behavior: 'smooth' }); }
        else finishStage();
      });
    }

    function finishStage() {
      pfill.style.width = '100%';
      const done = Store.get('done.' + UNIT, {});
      done[stage.id] = 1;
      Store.set('done.' + UNIT, done);
      body.innerHTML = '';
      const card = h(`<div class="step-card win">
        <div class="win-badge">🎉</div>
        <h3>這一關完成了！</h3>
        <p>你學會了新的一招，回地圖看看下一關吧。</p>
        <div class="row" style="justify-content:center"><button class="btn primary" type="button">回地圖</button></div></div>`);
      body.appendChild(card);
      confetti();
      card.querySelector('button').addEventListener('click', () => onFinish(true));
    }
    showStep();
  }

  let UNIT = 'unit', SIGNED = false;

  /* ---------- 單元頁：關卡地圖 ---------- */
  function mount(unit, stages, opts) {
    const o = opts || {};
    UNIT = unit; SIGNED = !!o.signed;
    window.__STAGES = stages; // 供自動測試用
    function drawMap() {
      const map = document.getElementById('map');
      const done = Store.get('done.' + UNIT, {});
      map.innerHTML = '';
      stages.forEach(st => {
        const got = done[st.id];
        const card = h(`<button class="stage-card ${got != null ? 'cleared' : ''}" type="button">
          <span class="sc-badge">${st.badge}</span>
          <span class="sc-title">${st.title}</span>
          <span class="sc-sub">${got != null ? '已完成 ✔' : `${st.steps.length} 小步`}</span></button>`);
        card.addEventListener('click', () => start(st));
        map.appendChild(card);
      });
      const n = stages.filter(st => done[st.id] != null).length;
      document.getElementById('map-status').textContent = `已完成 ${n} / ${stages.length} 關`;
    }
    function start(st) {
      const mapSec = document.getElementById('map-sec');
      const playSec = document.getElementById('play');
      mapSec.hidden = true; playSec.hidden = false;
      play(playSec, st, () => {
        playSec.hidden = true; playSec.innerHTML = '';
        mapSec.hidden = false;
        drawMap();
        mapSec.scrollIntoView({ behavior: 'smooth' });
      });
      playSec.scrollIntoView({ behavior: 'smooth' });
    }
    drawMap();
    const pb = document.getElementById('print-btn');
    if (pb) pb.addEventListener('click', JH.printSheet);
  }

  window.Lesson = {
    setUnit(u) { UNIT = u; },
    setSigned(b) { SIGNED = !!b; },
    play, Choco, Puzzle, confetti, sleep, fmt, mount, FLAVOR,
    doneMap: () => Store.get('done.' + UNIT, {}),
    h
  };
})();
