/* ===== 國中學習網 共用程式：儲存、數學式、練習題引擎 ===== */
(function () {
  'use strict';

  /* ---------- 本機儲存（失敗時退回記憶體） ---------- */
  const mem = {};
  const Store = {
    get(key, fallback) {
      try {
        const v = localStorage.getItem('jh.' + key);
        return v == null ? fallback : JSON.parse(v);
      } catch (e) { return key in mem ? mem[key] : fallback; }
    },
    set(key, val) {
      mem[key] = val;
      try { localStorage.setItem('jh.' + key, JSON.stringify(val)); } catch (e) { /* ignore */ }
    }
  };

  /* ---------- 數學式 ---------- */
  function renderMath(el) {
    if (!el) return;
    if (window.renderMathInElement) {
      window.renderMathInElement(el, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '\\(', right: '\\)', display: false }
        ],
        throwOnError: false
      });
    } else {
      // KaTeX 還沒載完，稍後再試
      setTimeout(() => renderMath(el), 120);
    }
  }

  /* ---------- 小工具 ---------- */
  const rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];
  // 係數排版：coef(3,'x') → "3x"；coef(-1,'x') → "-x"；開頭不加 +
  function term(c, v, first) {
    if (c === 0) return '';
    const sign = c < 0 ? '-' : (first ? '' : '+');
    const abs = Math.abs(c);
    const num = (abs === 1 && v) ? '' : String(abs);
    return sign + num + (v || '');
  }
  function poly(terms) { // terms: [[coef, var], ...]
    let out = '', first = true;
    for (const [c, v] of terms) {
      if (c === 0) continue;
      out += term(c, v, first);
      first = false;
    }
    return out || '0';
  }
  function parseNum(s) {
    if (s == null) return NaN;
    s = String(s).trim().replace(/[−–－]/g, '-').replace(/＋/g, '+').replace(/\s+/g, '');
    if (s === '' ) return NaN;
    if (s === '+' ) return 1;
    if (s === '-') return -1;
    if (!/^[+-]?\d+(\.\d+)?$/.test(s)) return NaN;
    return Number(s);
  }
  function esc(s) { return String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])); }

  /* ---------- 練習題引擎 ---------- */
  const gens = {};
  function register(id, def) { gens[id] = def; }

  function progressKey(unit) { return 'progress.' + unit; }
  function getProgress(unit) { return Store.get(progressKey(unit), { tried: 0, correct: 0, read: {} }); }
  function saveProgress(unit, p) { Store.set(progressKey(unit), p); }

  function getWrong(unit) { return Store.get('wrong.' + unit, []); }
  function setWrong(unit, list) { Store.set('wrong.' + unit, list); }
  function sameQ(a, b) { return a.gen === b.gen && JSON.stringify(a.params) === JSON.stringify(b.params); }

  // 畫出一題，回傳控制器
  function renderQuestion(host, q, onDone) {
    host.innerHTML = '';
    const box = document.createElement('div');
    box.innerHTML = `<div class="q-prompt">${q.prompt}</div>`;
    const answerArea = document.createElement('div');
    box.appendChild(answerArea);
    let inputs = [];
    let chosen = null;

    if (q.type === 'choice') {
      answerArea.className = 'choices';
      q.choices.forEach((c, i) => {
        const b = document.createElement('button');
        b.className = 'choice';
        b.type = 'button';
        b.innerHTML = `<b>${'ABCD'[i]}.</b> ${c}`;
        b.addEventListener('click', () => {
          if (box.dataset.done) return;
          answerArea.querySelectorAll('.choice').forEach(x => x.style.outline = '');
          b.style.outline = '3px solid var(--accent)';
          chosen = i;
        });
        answerArea.appendChild(b);
      });
    } else {
      answerArea.className = 'q-fields';
      q.fields.forEach(f => {
        if (f.pre) { const s = document.createElement('span'); s.innerHTML = f.pre; answerArea.appendChild(s); }
        const inp = document.createElement('input');
        inp.type = 'text';
        inp.autocomplete = 'off';
        inp.setAttribute('aria-label', '答案');
        if (f.wide) inp.classList.add('wide');
        inp.addEventListener('keydown', e => { if (e.key === 'Enter') check(); });
        answerArea.appendChild(inp);
        inputs.push(inp);
        if (f.post) { const s = document.createElement('span'); s.innerHTML = f.post; answerArea.appendChild(s); }
      });
    }

    const row = document.createElement('div');
    row.className = 'row';
    const checkBtn = document.createElement('button');
    checkBtn.className = 'btn primary'; checkBtn.type = 'button'; checkBtn.textContent = '檢查答案';
    const showBtn = document.createElement('button');
    showBtn.className = 'btn'; showBtn.type = 'button'; showBtn.textContent = '看詳解';
    row.append(checkBtn, showBtn);
    box.appendChild(row);

    const fb = document.createElement('div');
    fb.className = 'feedback';
    box.appendChild(fb);
    host.appendChild(box);
    renderMath(box);
    if (inputs[0] && window.matchMedia('(pointer:fine)').matches) inputs[0].focus();

    function finish(ok, gaveUp) {
      box.dataset.done = '1';
      fb.className = 'feedback show ' + (ok ? 'good' : 'badf');
      fb.innerHTML = (ok ? '<b>✔ 答對了！</b>' : (gaveUp ? '<b>先看詳解，等等再挑戰一次。</b>' : '<b>✘ 還差一點，看看哪裡不一樣：</b>')) +
        `<div class="solution">${q.solution}</div>`;
      renderMath(fb);
      checkBtn.disabled = true; showBtn.disabled = true;
      onDone(ok);
    }
    function check() {
      if (box.dataset.done) return;
      if (q.type === 'choice') {
        if (chosen == null) { fb.className = 'feedback show'; fb.textContent = '先選一個答案喔。'; return; }
        answerArea.children[q.correct].classList.add('ok');
        if (chosen !== q.correct) answerArea.children[chosen].classList.add('ng');
        finish(chosen === q.correct);
      } else {
        const vals = inputs.map(i => parseNum(i.value));
        if (vals.some(v => isNaN(v))) {
          fb.className = 'feedback show';
          fb.innerHTML = q.emptyHint || '每一格都要填數字（可以是負數或小數，例如 <b>-6</b>、<b>0.25</b>）。';
          return;
        }
        let all = true;
        const marks = q.check ? q.check(vals) : null;   // 自訂批改（例如帶分數）
        vals.forEach((v, i) => {
          const ok = marks ? marks[i] : Math.abs(v - q.fields[i].answer) < 1e-9;
          inputs[i].classList.add(ok ? 'ok' : 'ng');
          inputs[i].readOnly = true;
          if (!ok) all = false;
        });
        finish(all);
      }
    }
    checkBtn.addEventListener('click', check);
    showBtn.addEventListener('click', () => {
      if (q.type === 'choice') answerArea.children[q.correct].classList.add('ok');
      else inputs.forEach((inp, i) => { if (!inp.value) inp.placeholder = String(q.fields[i].answer); inp.readOnly = true; });
      finish(false, true);
    });
  }

  // 掛載一個練習區：sets = [{label, gens:[id...]}]
  function mount(host, opts) {
    const unit = opts.unit;
    let setIdx = 0, sessionTried = 0, sessionCorrect = 0, lastGen = null;
    host.innerHTML = `
      <div class="quiz-tabs"></div>
      <div class="card"><div class="q-host"></div>
        <div class="row" style="justify-content:space-between">
          <span class="score"></span>
          <button class="btn next" type="button">下一題 →</button>
        </div>
      </div>`;
    const tabs = host.querySelector('.quiz-tabs');
    const qHost = host.querySelector('.q-host');
    const scoreEl = host.querySelector('.score');
    const nextBtn = host.querySelector('.next');

    opts.sets.forEach((s, i) => {
      const b = document.createElement('button');
      b.className = 'btn' + (i === 0 ? ' on' : '');
      b.type = 'button';
      b.textContent = s.label;
      b.addEventListener('click', () => {
        setIdx = i;
        tabs.querySelectorAll('.btn').forEach((x, j) => x.classList.toggle('on', j === i));
        next();
      });
      tabs.appendChild(b);
    });

    function updateScore() {
      const p = getProgress(unit);
      scoreEl.textContent = `這次：${sessionCorrect} / ${sessionTried}　累計答對：${p.correct} 題`;
    }
    function next() {
      const set = opts.sets[setIdx];
      let pool = set.gens;
      if (pool.length > 1) pool = pool.filter(g => g !== lastGen);
      const gid = pick(pool);
      lastGen = gid;
      const g = gens[gid];
      const q = g.make(set.params ? set.params(gid) : undefined);
      q.gen = gid;
      renderQuestion(qHost, q, ok => {
        sessionTried++; if (ok) sessionCorrect++;
        const p = getProgress(unit);
        p.tried++; if (ok) p.correct++;
        saveProgress(unit, p);
        if (!ok) {
          const list = getWrong(unit);
          const item = { gen: gid, params: q.params, t: Date.now() };
          if (!list.some(x => sameQ(x, item))) { list.unshift(item); setWrong(unit, list.slice(0, 50)); }
          if (opts.onWrongChange) opts.onWrongChange();
        }
        updateScore();
      });
    }
    nextBtn.addEventListener('click', next);
    updateScore();
    next();
  }

  // 錯題本：重做，答對就移除
  function mountWrongBook(host, unit) {
    function draw() {
      const list = getWrong(unit);
      if (!list.length) {
        host.innerHTML = '<p class="muted">目前沒有錯題 🎉　練習時答錯的題目會自動收進來，答對就會移除。</p>';
        return;
      }
      host.innerHTML = `<p class="muted small">共 ${list.length} 題。點「重做」再挑戰一次，答對就會從錯題本移除。</p>`;
      list.forEach((item, idx) => {
        const g = gens[item.gen];
        if (!g) return;
        const q = g.make(item.params);
        const div = document.createElement('div');
        div.className = 'wrong-item';
        div.innerHTML = `<div class="q-prompt" style="font-size:17px;margin:0">${q.prompt}</div>
          <div class="row"><button class="btn redo" type="button">重做</button>
          <button class="btn del" type="button">移除</button></div><div class="redo-host"></div>`;
        div.querySelector('.redo').addEventListener('click', () => {
          div.querySelector('.row').remove();
          div.querySelector('.q-prompt').remove();
          q.gen = item.gen;
          renderQuestion(div.querySelector('.redo-host'), q, ok => {
            if (ok) {
              setWrong(unit, getWrong(unit).filter(x => !sameQ(x, item)));
              const p = getProgress(unit); p.tried++; p.correct++; saveProgress(unit, p);
              setTimeout(draw, 1800);
            }
          });
        });
        div.querySelector('.del').addEventListener('click', () => {
          setWrong(unit, getWrong(unit).filter(x => !sameQ(x, item)));
          draw();
        });
        host.appendChild(div);
      });
      renderMath(host);
    }
    draw();
    return draw;
  }

  /* ---------- 導覽列：標出目前所在段落 ---------- */
  function setupNav() {
    const links = [...document.querySelectorAll('.topbar nav a[href^="#"]')];
    if (!links.length || !('IntersectionObserver' in window)) return;
    const map = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          links.forEach(a => a.classList.remove('on'));
          const a = map.get(e.target.id);
          if (a) { a.classList.add('on'); a.scrollIntoView({ block: 'nearest', inline: 'center' }); }
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    map.forEach((a, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
  }

  function printSheet() {
    document.body.classList.add('print-sheet');
    const done = () => { document.body.classList.remove('print-sheet'); window.removeEventListener('afterprint', done); };
    window.addEventListener('afterprint', done);
    window.print();
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderMath(document.body);
    setupNav();
  });

  window.JH = { gens, Store, renderMath, rand, pick, term, poly, parseNum, esc, register, mount, mountWrongBook, getProgress, saveProgress, getWrong, printSheet };
})();
