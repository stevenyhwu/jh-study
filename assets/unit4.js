/* ===== 理化四步播放器：猜 → 玩 → 懂 → 考 ===== */
(function () {
  'use strict';

  const mem = {};
  const Store = {
    get(k, f) { try { const v = localStorage.getItem('jh.' + k); return v == null ? f : JSON.parse(v); } catch (e) { return k in mem ? mem[k] : f; } },
    set(k, v) { mem[k] = v; try { localStorage.setItem('jh.' + k, JSON.stringify(v)); } catch (e) { /* ignore */ } }
  };
  function h(html) { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; }

  /* cfg: { unit, home, steps: [{id, label, title, render(panel, api)}] } */
  function mount(host, cfg) {
    const key = 'sci.' + cfg.unit;
    let state = Store.get(key, {});
    host.innerHTML = '';
    const bar = h('<div class="u4-steps" role="tablist" aria-label="學習步驟"></div>');
    const panels = h('<div></div>');
    const foot = h('<div class="u4-foot"></div>');
    host.append(bar, panels, foot);
    let cur = 0;
    const rendered = [];
    const tabs = cfg.steps.map((s, i) => {
      const b = h(`<button type="button" class="u4-step" role="tab"><span class="n">${i + 1}</span><span class="l">${s.label}</span></button>`);
      b.addEventListener('click', () => show(i, true));
      bar.appendChild(b);
      const p = h('<section class="u4-panel" role="tabpanel" hidden></section>');
      panels.appendChild(p);
      return { b, p };
    });

    function paint() {
      tabs.forEach((t, i) => {
        const done = !!state[cfg.steps[i].id];
        t.b.classList.toggle('on', i === cur);
        t.b.classList.toggle('done', done);
        t.b.setAttribute('aria-selected', i === cur ? 'true' : 'false');
        t.b.querySelector('.n').textContent = done ? '✔' : i + 1;
      });
      foot.innerHTML = '';
      const all = cfg.steps.every(s => state[s.id]);
      if (cur < cfg.steps.length - 1) {
        const nx = cfg.steps[cur + 1];
        const b = h(`<button type="button" class="btn ${state[cfg.steps[cur].id] ? 'primary' : ''}">下一步：${nx.label} →</button>`);
        b.addEventListener('click', () => show(cur + 1, true));
        foot.appendChild(b);
      } else if (all) {
        foot.appendChild(h(`<div class="done-banner">🎉 這一節完成了！<a href="${cfg.home || 'index.html'}">回理化首頁</a></div>`));
      }
    }
    function api(i) {
      return {
        done() { state = Store.get(key, {}); state[cfg.steps[i].id] = 1; Store.set(key, state); paint(); },
        next() { if (i < cfg.steps.length - 1) show(i + 1, true); },
        isDone: () => !!state[cfg.steps[i].id]
      };
    }
    function show(i, scroll) {
      cur = i;
      tabs.forEach((t, j) => { t.p.hidden = j !== i; });
      if (!rendered[i]) {
        rendered[i] = true;
        const s = cfg.steps[i];
        tabs[i].p.appendChild(h(`<h2 class="u4-title">${s.title}</h2>`));
        s.render(tabs[i].p, api(i));
      }
      paint();
      if (scroll) host.scrollIntoView({ block: 'start' });
    }
    const first = cfg.steps.findIndex(s => !state[s.id]);
    show(first < 0 ? 0 : first, false);
  }

  /* 選擇題。o: {q, options:[{t, ok, why}], hint, graded(預設 true), onDone(opt)}
     graded=false：只是下注，不判對錯。答錯可以再選。 */
  function choice(host, o) {
    const box = h(`<div class="u4-q"><div class="q-prompt">${o.q}</div><div class="choices"></div><div class="feedback" aria-live="polite"></div></div>`);
    const list = box.querySelector('.choices'), fb = box.querySelector('.feedback');
    let locked = false;
    o.options.forEach(op => {
      const b = h(`<button type="button" class="choice">${op.t}</button>`);
      b.addEventListener('click', () => {
        if (locked) return;
        if (o.graded === false) {
          locked = true; b.classList.add('sel');
          if (o.onDone) o.onDone(op, fb);
          return;
        }
        if (op.ok) {
          locked = true; b.classList.add('ok');
          fb.className = 'feedback show good';
          fb.innerHTML = '<b>✔ 對了！</b> ' + (op.why || '');
          if (o.onDone) o.onDone(op, fb);
        } else {
          b.classList.add('ng'); b.disabled = true;
          fb.className = 'feedback show badf';
          fb.innerHTML = '<b>再想一下：</b>' + (op.why || '') + (o.hint ? `<div class="u4-hint">💡 ${o.hint}</div>` : '') + '<div class="small muted">可以再選一次。</div>';
        }
      });
      list.appendChild(b);
    });
    host.appendChild(box);
    return box;
  }

  /* 填數字題。o: {q, pre, post, answer, diag:[{v,msg}], hint, why, onDone} */
  function numq(host, o) {
    const box = h(`<div class="u4-q"><div class="q-prompt">${o.q}</div>
      <div class="q-fields"><span>${o.pre || ''}</span><input type="text" inputmode="decimal" autocomplete="off" aria-label="答案"><span>${o.post || ''}</span>
      <button type="button" class="btn primary">檢查</button></div><div class="feedback" aria-live="polite"></div></div>`);
    const inp = box.querySelector('input'), btn = box.querySelector('button'), fb = box.querySelector('.feedback');
    function check() {
      if (inp.readOnly) return;
      const v = Number(String(inp.value).trim().replace(/[．。]/g, '.'));
      if (String(inp.value).trim() === '' || isNaN(v)) { fb.className = 'feedback show'; fb.textContent = '先填一個數字。'; return; }
      const hit = o.range ? (v >= o.range[0] - 1e-9 && v <= o.range[1] + 1e-9) : Math.abs(v - o.answer) < 1e-6;
      if (hit) {
        inp.readOnly = true; btn.disabled = true; inp.classList.add('ok'); inp.classList.remove('ng');
        fb.className = 'feedback show good'; fb.innerHTML = '<b>✔ 對了！</b> ' + (o.why || '');
        if (o.onDone) o.onDone();
      } else {
        inp.classList.add('ng');
        const d = (o.diag || []).find(x => Math.abs(x.v - v) < 0.02);
        fb.className = 'feedback show badf';
        fb.innerHTML = '<b>再想一下：</b>' + (d ? d.msg : (o.hint || '')) + '<div class="small muted">改一改，再按檢查。</div>';
      }
    }
    btn.addEventListener('click', check);
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') check(); });
    host.appendChild(box);
    return box;
  }

  /* ---------- 小工具 ---------- */
  function svg(host, vb, inner, label, cls) {
    const s = h(`<svg class="${cls || 'u4-pic'}" viewBox="${vb}" role="img" aria-label="${label || ''}"></svg>`);
    s.innerHTML = inner || ''; host.appendChild(s); return s;
  }
  // 一排選項按鈕。opts: [{v, t}]；回傳 {set(v)}
  function chips(host, label, opts, cur, onPick) {
    const row = h(`<div class="chips">${label ? `<span class="chips-l">${label}</span>` : ''}</div>`);
    const bs = opts.map(o => {
      const b = h(`<button type="button" class="btn">${o.t}</button>`);
      b.addEventListener('click', () => { paint(o.v); onPick(o.v); });
      row.appendChild(b); return b;
    });
    function paint(v) { bs.forEach((b, i) => b.classList.toggle('on', opts[i].v === v)); }
    paint(cur); host.appendChild(row);
    return { set: paint, el: row };
  }
  // 拉桿。o: {min, max, step, value, fmt(v)}
  function slider(host, label, o, onInput) {
    const fmt = o.fmt || (v => v);
    const row = h(`<label class="u4-slider"><span>${label} <b></b></span><input type="range" min="${o.min}" max="${o.max}" step="${o.step || 1}" value="${o.value}"></label>`);
    const inp = row.querySelector('input'), out = row.querySelector('b');
    out.innerHTML = fmt(o.value);
    inp.addEventListener('input', () => { out.innerHTML = fmt(Number(inp.value)); onInput(Number(inp.value)); });
    host.appendChild(row);
    return { set(v) { inp.value = v; out.innerHTML = fmt(v); }, el: row };
  }

  /* ---------- 「玩」的多個模擬：一張卡裡放 n 個分頁，一次顯示一個 ---------- */
  function panes(p, n) {
    const card = h('<div class="card"></div>'); p.appendChild(card);
    const list = [];
    for (let i = 0; i < n; i++) { const d = h('<div></div>'); d.hidden = i > 0; card.appendChild(d); list.push(d); }
    return { list, show(i) { list.forEach((d, j) => { d.hidden = j !== i; }); }, end(slot) { card.appendChild(slot); } };
  }
  /* ---------- 一節的四步：fns = {guess, play, know, exam}，titles = [猜, 玩, 懂, 考] ---------- */
  function run(unit, titles, fns) {
    document.addEventListener('DOMContentLoaded', () => mount(document.getElementById('unit'), { unit: 'sci8a-' + unit, home: 'index.html', steps: [
      { id: 'guess', label: '猜', title: titles[0], render: fns.guess },
      { id: 'play', label: '玩', title: titles[1], render: fns.play },
      { id: 'know', label: '懂', title: titles[2], render: fns.know },
      { id: 'exam', label: '考', title: titles[3] || '會考真的這樣考', render: fns.exam }] }));
  }

  /* ---------- 動畫：每 40ms 呼叫 draw(秒)；畫面看不到時暫停 ---------- */
  function anim(sv, draw) {
    let t0 = performance.now();
    const id = setInterval(() => {
      if (!sv.isConnected) { clearInterval(id); return; }
      if (!sv.getClientRects().length) return;
      draw((performance.now() - t0) / 1000);
    }, 40);
    return { restart() { t0 = performance.now(); } };
  }

  /* ---------- 「猜」：qs = [{pic(host) → 物件, q, options:[{t, ok}], reveal, after(物件)}]，不算分 ---------- */
  function guess(p, api, qs) {
    p.appendChild(h('<p class="muted">先猜猜看，猜錯也沒關係，這一步不算分。</p>'));
    const cards = qs.map((q, i) => {
      const c = h(`<div class="card"${i ? ' hidden' : ''}></div>`); p.appendChild(c);
      const obj = q.pic ? q.pic(c) : null;
      choice(c, {
        graded: false, q: q.q, options: q.options,
        onDone(op, fb) {
          if (q.after) q.after(obj);
          fb.className = 'feedback show ' + (op.ok ? 'good' : '');
          fb.innerHTML = (op.ok ? '<b>猜對了！</b>' : '<b>答案是：</b>') + q.reveal;
          if (i < qs.length - 1) cards[i + 1].hidden = false; else api.done();
        }
      });
      return c;
    });
  }

  /* ---------- 「玩」的任務流程 ----------
     T: [{text, setup(), check() → 真值, qs(r) → [{q, options, hint, then} 或 {num:true, ...numq 參數}], found}]
     用法：const tk = tasks(p, api, T); …建好模擬並把 tk.slot 放到想要的位置…; tk.start(); 模擬有變化時呼叫 tk.check() */
  function tasks(p, api, T) {
    const task = h('<div class="card u4-task"></div>'); p.appendChild(task);
    const slot = h('<div class="u4-slot"></div>');
    let ti = 0, asked = false, started = false;
    function found(html) { slot.appendChild(h(`<div class="u4-found">🔎 <b>發現：</b>${html}</div>`)); }
    function show() {
      asked = false; slot.innerHTML = '';
      task.innerHTML = `<div class="u4-taskno">任務 ${ti + 1} / ${T.length}</div><div class="u4-tasktext">${T[ti].text}</div>`;
      if (T[ti].setup) T[ti].setup();
      check();
    }
    function check() {
      if (!started || asked || ti >= T.length) return;
      const r = T[ti].check();
      if (!r) return;
      asked = true;
      if (!T[ti].quiet) task.querySelector('.u4-tasktext').insertAdjacentHTML('beforeend', ' <b style="color:var(--good)">✔ 做到了</b>');
      ask(T[ti].qs ? T[ti].qs(r) : [], 0);
      if (!T[ti].quiet) slot.scrollIntoView({ block: 'end', behavior: 'smooth' });
    }
    function ask(qs, i) {
      if (i >= qs.length) { if (T[ti].found) found(T[ti].found); fin(); return; }
      const q = Object.assign({}, qs[i], { onDone() { if (qs[i].then) qs[i].then(); ask(qs, i + 1); } });
      (q.num ? numq : choice)(slot, q);
    }
    function fin() {
      const last = ti === T.length - 1;
      const b = h(`<div class="row"><button type="button" class="btn primary">${last ? '下一步：懂 →' : '下一個任務 →'}</button></div>`);
      if (last) { api.done(); b.firstChild.addEventListener('click', () => api.next()); }
      else b.firstChild.addEventListener('click', () => { ti++; show(); task.scrollIntoView({ block: 'start', behavior: 'smooth' }); });
      slot.appendChild(b);
    }
    return { slot, check, found, start() { started = true; show(); }, get index() { return ti; } };
  }

  /* ---------- 「懂」的一張卡：回傳放圖的位置 ---------- */
  function card(p, title, body) {
    const c = h(`<div class="card u4-know"><div><h3>${title}</h3>${body}</div><div class="pic"></div></div>`);
    p.appendChild(c); return c.querySelector('.pic');
  }

  /* ---------- 「考」：o = {intro, bench(host), benchLabel, qs:[{src, pic(host), q, hint, options}]} ---------- */
  function exam(p, api, o) {
    p.appendChild(h(`<p class="muted">${o.intro || '這幾題是從真正的會考題改寫的。答錯可以再選，不用怕。'}</p>`));
    if (o.bench) {
      const d = h(`<details class="card u4-open"><summary>🔬 ${o.benchLabel || '想試試看？打開實驗台'}</summary><div></div></details>`);
      p.appendChild(d);
      d.addEventListener('toggle', () => { if (d.open && !d.dataset.r) { d.dataset.r = 1; o.bench(d.lastElementChild); } });
    }
    let left = o.qs.length;
    o.qs.forEach((q, i) => {
      const c = h(`<div class="card"><h3>第 ${i + 1} 題 <span class="u4-src">（${q.src}）</span></h3></div>`);
      p.appendChild(c);
      if (q.pic) q.pic(c);
      choice(c, { q: q.q, hint: q.hint, options: q.options, onDone() { if (--left === 0) api.done(); } });
    });
  }

  /* ---------- 分類遊戲：一次一張卡，選它屬於哪一邊 ----------
     o = {bins:['A','B'], items:[{t, bin, why}], onDone} */
  function sort(host, o) {
    const box = h('<div class="u4-sort"><div class="u4-sortn"></div><div class="u4-sortcard"></div><div class="row u4-sortbins"></div><div class="feedback" aria-live="polite"></div></div>');
    const n = box.querySelector('.u4-sortn'), cardEl = box.querySelector('.u4-sortcard'), bins = box.querySelector('.u4-sortbins'), fb = box.querySelector('.feedback');
    let i = 0, lock = false;
    const bs = o.bins.map((t, k) => {
      const b = h(`<button type="button" class="btn">${t}</button>`);
      b.addEventListener('click', () => pick(k));
      bins.appendChild(b); return b;
    });
    function show() {
      lock = false; fb.className = 'feedback';
      bs.forEach(b => { b.disabled = false; });
      n.textContent = `第 ${i + 1} / ${o.items.length} 張`;
      cardEl.innerHTML = o.items[i].t;
    }
    function pick(k) {
      if (lock) return;
      const it = o.items[i];
      if (k === it.bin) {
        lock = true; bs.forEach(b => { b.disabled = true; });
        fb.className = 'feedback show good';
        fb.innerHTML = `<b>✔ ${o.bins[k]}。</b>${it.why || ''}`;
        const last = i === o.items.length - 1;
        const nx = h(`<div class="row"><button type="button" class="btn primary">${last ? '完成' : '下一張 →'}</button></div>`);
        nx.firstChild.addEventListener('click', () => {
          if (last) { cardEl.innerHTML = '全部分完了 👍'; n.textContent = ''; bins.hidden = true; fb.className = 'feedback'; if (o.onDone) o.onDone(); }
          else { i++; show(); }
        });
        fb.appendChild(nx);
      } else {
        fb.className = 'feedback show badf';
        fb.innerHTML = `<b>再想一下：</b>${it.hint || it.why || ''}`;
      }
    }
    show(); host.appendChild(box);
    return box;
  }

  window.Unit4 = { mount, choice, numq, Store, h, svg, chips, slider, anim, panes, run, guess, tasks, card, exam, sort };
})();
