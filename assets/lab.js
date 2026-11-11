/* ===== 🔬 實驗室：學完關卡後，自己拉拉看、驗證規律 =====
   頁面放 <div id="lab-host" data-labs="sq,diff"></div>，這支程式會自動掛上對應的實驗室。
   每個實驗室：拉桿／拖曳 → 圖即時變 → 即時讀數 → 幾個「實驗任務」小題。 */
(function () {
  'use strict';
  const R = String.raw;
  const h = s => Lesson.h(s);
  const C = Viz.C;
  const sgn = n => (n < 0 ? '−' + -n : String(n));
  const r2 = n => String(Math.round(n * 100) / 100);
  // 多項式顯示：x² + bx + c
  function poly(a, b, c, v) {
    v = v || 'x';
    const t = [];
    const term = (k, s, first) => {
      if (k === 0) return;
      const abs = Math.abs(k), coef = (abs === 1 && s) ? '' : abs;
      t.push((k < 0 ? '-' : (t.length ? '+' : '')) + coef + s);
    };
    term(a, v + '^2'); term(b, v); term(c, '');
    return t.length ? t.join('') : '0';
  }
  // 根號化簡：n → [外, 內]
  function simp(n) {
    let out = 1, inn = 1, m = n;
    for (let p = 2; p * p <= m; p++) { let e = 0; while (m % p === 0) { m /= p; e++; } out *= Math.pow(p, Math.floor(e / 2)); if (e % 2) inn *= p; }
    inn *= m;
    return [out, inn];
  }
  const radTex = n => { const [o, i] = simp(n); return i === 1 ? String(o) : (o === 1 ? R`\sqrt{${i}}` : R`${o}\sqrt{${i}}`); };
  function factors(n) { const f = []; let m = n; for (let p = 2; p * p <= m; p++) while (m % p === 0) { f.push(p); m /= p; } if (m > 1) f.push(m); return f; }

  /* ---------- 實驗室外殼 ---------- */
  function mount(host, def) {
    const card = h(`<div class="card lab"><h3>${def.icon} ${def.title}</h3><p class="lab-intro"></p>
      <div class="lab-ctrl"></div><div class="lab-fig"></div><div class="lab-read"></div>
      <div class="lab-tasks"><div class="lab-tt">🧪 實驗任務</div></div></div>`);
    host.appendChild(card);
    card.querySelector('.lab-intro').innerHTML = def.intro;
    const s = {};
    const ctrl = card.querySelector('.lab-ctrl'), fig = card.querySelector('.lab-fig'), read = card.querySelector('.lab-read');
    const vals = {};
    (def.controls || []).forEach(c => {
      s[c.k] = c.v;
      if (c.type === 'seg') {
        const row = h(`<div class="lab-row"><span class="lab-lab">${c.label}</span><span class="lab-seg"></span></div>`);
        const seg = row.querySelector('.lab-seg');
        c.options.forEach(([v, t]) => {
          const b = h(`<button type="button" class="btn small-btn">${t}</button>`);
          if (v === c.v) b.classList.add('on');
          b.addEventListener('click', () => { s[c.k] = v; seg.querySelectorAll('button').forEach(x => x.classList.remove('on')); b.classList.add('on'); update(); });
          seg.appendChild(b);
        });
        ctrl.appendChild(row);
      } else {
        const row = h(`<label class="lab-row"><span class="lab-lab">${c.label}</span><input type="range" min="${c.min}" max="${c.max}" step="${c.step || 1}" value="${c.v}"><b class="lab-val"></b></label>`);
        const inp = row.querySelector('input'), out = row.querySelector('.lab-val');
        vals[c.k] = out;
        inp.addEventListener('input', () => { s[c.k] = Number(inp.value); update(); });
        c._inp = inp;
        ctrl.appendChild(row);
      }
    });
    const api = {
      set(k, v) { s[k] = v; const c = (def.controls || []).find(x => x.k === k); if (c && c._inp) c._inp.value = v; update(true); },
      s
    };
    function update(fromDrag) {
      (def.controls || []).forEach(c => { if (vals[c.k]) vals[c.k].textContent = c.fmt ? c.fmt(s[c.k], s) : sgn(s[c.k]); });
      if (def.persist) def.draw(fig, s, api); else { fig.innerHTML = ''; def.draw(fig, s, api); }
      read.innerHTML = def.read(s);
      JH.renderMath(read);
    }
    update();
    // 任務
    const tasks = card.querySelector('.lab-tasks');
    def.tasks.forEach((t, i) => {
      const box = h(`<div class="lab-task"><div class="lab-q"><b>${i + 1}.</b> ${t.q}</div><div class="choices"></div><div class="fb"></div></div>`);
      tasks.appendChild(box);
      const ch = box.querySelector('.choices'), fb = box.querySelector('.fb');
      t.options.forEach(o => {
        const b = h(`<button class="choice" type="button"></button>`);
        b.innerHTML = o.t;
        b.addEventListener('click', () => {
          ch.querySelectorAll('.choice').forEach(x => x.classList.remove('ng'));
          b.classList.add(o.ok ? 'ok' : 'ng');
          fb.className = 'fb show ' + (o.ok ? 'good' : 'badc');
          fb.innerHTML = (o.ok ? '✔ ' : '再拉拉看：') + (o.why || '');
          JH.renderMath(fb);
          if (o.ok) box.classList.add('done');
        });
        ch.appendChild(b);
      });
    });
    JH.renderMath(card);
  }

  /* =========================================================
     各實驗室
     ========================================================= */
  const DEFS = {};

  // ---------- 正方形切四塊 (a+b)² ----------
  DEFS.sq = {
    icon: '🍓', title: '正方形切四塊實驗室',
    intro: R`拉動 \(a\)、\(b\)，看正方形巧克力的四塊怎麼變。草莓 \(a^2\)、兩塊橘子 \(ab\)、抹茶 \(b^2\)。`,
    controls: [{ k: 'a', label: 'a', min: 1, max: 7, v: 4 }, { k: 'b', label: 'b', min: 0, max: 5, v: 2 }],
    draw(fig, s) {
      const n = s.a + s.b;
      const c = Lesson.Choco(fig, { rows: n, cols: n, cell: Math.min(40, Math.floor(280 / n)) });
      c.paint(0, 0, s.a, s.a, 'berry');
      if (s.b) { c.paint(s.a, s.a, n, n, 'matcha'); c.paint(0, s.a, s.a, n, 'orange'); c.paint(s.a, 0, n, s.a, 'orange'); c.split('v', s.a); c.split('h', s.a); }
      c.label(0, 0, s.a, s.a, String(s.a * s.a));
      if (s.b) { c.label(s.a, s.a, n, n, String(s.b * s.b), { size: 14 }); c.label(0, s.a, s.a, n, String(s.a * s.b), { size: 14 }); c.label(s.a, 0, n, s.a, String(s.a * s.b), { size: 14 }); }
    },
    read(s) {
      const a = s.a, b = s.b;
      return R`\((${a}+${b})^2=${(a + b) ** 2}\)　　\(${a * a}+${a * b}+${a * b}+${b * b}=${(a + b) ** 2}\) ✔<br><span class="muted">只算 \(a^2+b^2=${a * a + b * b}\)，少了兩塊橘子 \(2ab=${2 * a * b}\)</span>`;
    },
    tasks: [
      { q: R`把 \(b\) 拉到 0，會發生什麼事？`, options: [
        { t: '橘子和抹茶都不見了，只剩草莓', ok: true, why: R`\((a+0)^2=a^2\)，沒有切開。` },
        { t: '橘子還在', why: '把 b 拉到 0 看看，橘子的寬度是 b 喔。' }] },
      { q: R`讓 \(a=b\)（例如都是 3），四塊有什麼特別？`, options: [
        { t: '四塊一樣大', ok: true, why: R`\(a^2=ab=b^2\)，大正方形被切成四個一樣的小正方形。` },
        { t: '草莓比較大', why: '拉成 a＝b 再看一次。' }] },
      { q: R`不管怎麼拉，\((a+b)^2\) 都比 \(a^2+b^2\) 多了什麼？`, options: [
        { t: R`兩塊橘子 \(2ab\)`, ok: true, why: '這就是最常見的錯誤：忘了兩塊橘子！' },
        { t: '一塊抹茶', why: '看讀數最下面那一行。' }] }
    ]
  };

  // ---------- 挖一角拼長方形 a²−b² ----------
  DEFS.diff = {
    icon: '🐭', title: '挖一角拼長方形實驗室',
    intro: R`大正方形 \(a\times a\) 挖掉一角 \(b\times b\)，剩下的拼成長 \(a+b\)、寬 \(a-b\) 的長方形。拉拉看，兩邊格數是不是永遠一樣？`,
    controls: [{ k: 'a', label: 'a', min: 2, max: 8, v: 5 }, { k: 'b', label: 'b', min: 0, max: 7, v: 2 }],
    draw(fig, s) {
      const a = s.a, b = Math.min(s.b, a - 1);
      const row = h('<div style="display:flex;gap:6px;align-items:flex-end;justify-content:center;flex-wrap:wrap"></div>');
      fig.appendChild(row);
      const L = h('<div style="flex:1;min-width:140px;max-width:48%"></div>'), Rr = h('<div style="flex:1.4;min-width:160px"></div>');
      row.appendChild(L); row.appendChild(Rr);
      const c1 = Lesson.Choco(L, { rows: a, cols: a, cell: 24, pad: 20 });
      c1.paint(0, 0, a, a, 'berry');
      if (b) c1.ghost(cl => cl.r >= a - b && cl.c >= a - b);
      c1.label(0, 0, a, a, `${a * a - b * b}`, { size: 16 });
      const c2 = Lesson.Choco(Rr, { rows: a - b, cols: a + b, cell: 24, pad: 20 });
      c2.paint(0, 0, a - b, a + b, 'berry');
      if (b) c2.paint(0, a, a - b, a + b, 'orange');
      c2.label(0, 0, a - b, a + b, `${(a + b)}×${a - b}`, { size: 16 });
      if (s.b >= a) fig.appendChild(h('<p class="muted small" style="text-align:center">b 要比 a 小喔（已自動當成 a−1）</p>'));
    },
    read(s) {
      const a = s.a, b = Math.min(s.b, a - 1);
      return R`\(${a}^2-${b}^2=${a * a}-${b * b}=${a * a - b * b}\)　　\((${a}+${b})(${a}-${b})=${a + b}\times${a - b}=${(a + b) * (a - b)}\) ✔`;
    },
    tasks: [
      { q: R`把 \(b\) 越拉越大，長方形會怎樣？`, options: [
        { t: '越來越長、越來越扁', ok: true, why: R`長是 \(a+b\) 變大，寬是 \(a-b\) 變小。` },
        { t: '越來越大', why: '挖掉的越多，剩下的越少，看看格數。' }] },
      { q: R`\(b=0\) 時呢？`, options: [
        { t: '沒有挖，長方形就是原來的正方形', ok: true, why: R`\((a+0)(a-0)=a^2\)。` },
        { t: '長方形不見了', why: '把 b 拉到 0 看看。' }] }
    ]
  };

  // ---------- 禮盒 (x+m)(x+n) ----------
  DEFS.box = {
    icon: '🎁', title: '禮盒實驗室',
    intro: R`禮盒長 \(x+m\)、寬 \(x+n\)。拉動 \(m\)、\(n\)（可以是負的！虛線是「欠的」），看展開式怎麼變。`,
    controls: [{ k: 'm', label: 'm', min: -6, max: 6, v: 3 }, { k: 'n', label: 'n', min: -6, max: 6, v: 2 }],
    draw(fig, s) {
      const cols = [{ t: 'x', w: 3 }], rows = [{ t: 'x', w: 3 }];
      if (s.m) cols.push({ t: sgn(s.m), w: Math.abs(s.m) * 0.45 + 0.4 });
      if (s.n) rows.push({ t: sgn(s.n), w: Math.abs(s.n) * 0.45 + 0.4 });
      const cell = (t, deg, neg) => ({ t, fill: neg ? '#fff' : [C.matcha, C.orange, C.choco][deg], dash: !!neg });
      const r1 = [cell('x²', 2)], r2c = [];
      if (s.m) r1.push(cell(`${sgn(s.m)}x`, 1, s.m < 0));
      if (s.n) { r2c.push(cell(`${sgn(s.n)}x`, 1, s.n < 0)); if (s.m) r2c.push(cell(sgn(s.m * s.n), 0, s.m * s.n < 0)); }
      Viz.areaBox(fig, cols, rows, s.n ? [r1, r2c] : [r1], { maxH: 210 });
    },
    read(s) {
      const m = s.m, n = s.n;
      return R`\((x${m < 0 ? '' : '+'}${m})(x${n < 0 ? '' : '+'}${n})=${poly(1, m + n, m * n)}\)<br><span class="muted">中間：\(${sgn(m)}+(${sgn(n)})=${m + n}\)　最後：\(${sgn(m)}\times(${sgn(n)})=${m * n}\)</span>`;
    },
    tasks: [
      { q: '要讓展開式<b>沒有 x 項</b>（中間是 0），m 和 n 要怎麼拉？', options: [
        { t: R`\(m\) 和 \(n\) 互為相反數（例如 3 和 −3）`, ok: true, why: R`兩塊長條一正一負抵消，變成 \(x^2-9\)：這就是平方差！` },
        { t: '兩個都拉到 0', why: '這樣也沒有 x 項，但常數也沒了。試試 3 和 −3！' }] },
      { q: 'm、n 一正一負時，最後的常數是？', options: [
        { t: '負的', ok: true, why: '正×負＝負，右下角那塊一定是虛線（欠的）。' },
        { t: '正的', why: '拉成 m＝3、n＝−2 看看右下角。' }] },
      { q: R`\(x^2+5x+6\) 是哪兩個數拉出來的？`, options: [
        { t: '2 和 3', ok: true, why: '2＋3＝5、2×3＝6，十字交乘就是在找這兩個數！' },
        { t: '1 和 6', why: '拉成 1 和 6 看看，中間會是 7x。' }] }
    ]
  };

  // ---------- 補一角（配方） ----------
  DEFS.csq = {
    icon: '🧩', title: '補一角實驗室',
    intro: R`\(x^2+bx\)：把 \(b\) 根長條分兩半放兩邊，右下角永遠缺一塊 \(\left(\frac b2\right)^2\)。再拉 \(c\) 看方程式 \(x^2+bx+c=0\) 有幾個解。`,
    controls: [{ k: 'b', label: 'b', min: -10, max: 10, v: 6 }, { k: 'c', label: 'c', min: -10, max: 10, v: 5 }],
    draw(fig, s) {
      const half = s.b / 2;
      if (!s.b) { Viz.areaBox(fig, [{ t: 'x', w: 3 }], [{ t: 'x', w: 3 }], [[{ t: 'x²', fill: C.choco }]], { maxH: 150 }); return; }
      const w = Math.abs(half) * 0.4 + 0.4, neg = half < 0, ht = r2(half);
      Viz.areaBox(fig, [{ t: 'x', w: 3 }, { t: ht, w }], [{ t: 'x', w: 3 }, { t: ht, w }],
        [[{ t: 'x²', fill: C.choco }, { t: `${ht}x`, fill: neg ? '#fff' : C.orange, dash: neg }], [{ t: `${ht}x`, fill: neg ? '#fff' : C.orange, dash: neg }, { t: `補${r2(half * half)}`, fill: '#fff', dash: true }]], { maxH: 210 });
    },
    read(s) {
      const b = s.b, c = s.c, q = b * b / 4, rhs = q - c, D = b * b - 4 * c;
      let sol;
      if (D > 0) { const r = Math.sqrt(rhs); sol = R`兩個解：\(x\approx${r2(-b / 2 + r)}\) 或 \(${r2(-b / 2 - r)}\)`; }
      else if (D === 0) sol = R`重根：\(x=${r2(-b / 2)}\)`;
      else sol = '<b>無解</b>（平方不可能是負的）';
      return R`\(${poly(1, b, c)}=0\)　→　\(\left(x${b / 2 < 0 ? '' : '+'}${r2(b / 2)}\right)^2=${r2(q)}-(${sgn(c)})=${r2(rhs)}\)<br>判別式 \(b^2-4c=${D}\)：${sol}`;
    },
    tasks: [
      { q: '缺角的大小跟 b 有什麼關係？', options: [
        { t: R`永遠是 \(\left(\frac b2\right)^2\)`, ok: true, why: 'b＝6 缺 9、b＝10 缺 25、b＝−4 缺 4。' },
        { t: '就是 b', why: '拉 b＝6 看看，缺角是 9 不是 6。' }] },
      { q: '保持 b＝6，c 要拉到多少，方程式剛好只有一個解（重根）？', options: [
        { t: '9', ok: true, why: R`\(x^2+6x+9=(x+3)^2\)，剛好補滿缺角，判別式＝0。` },
        { t: '6', why: '拉到 c＝6 看讀數，判別式不是 0。' }] },
      { q: 'c 拉得比缺角還大（例如 b＝6、c＝10），會怎樣？', options: [
        { t: '無解', ok: true, why: R`\((x+3)^2=9-10=-1\)，平方不可能是負的。` },
        { t: '有兩個解', why: '拉成 c＝10 看看判別式。' }] }
    ]
  };

  // ---------- 三個正方形（畢氏定理） ----------
  DEFS.tri = {
    icon: '📐', title: '三個正方形實驗室',
    intro: '拉動兩邊的長度和<b>夾角</b>，看三片正方形巧克力的面積。是不是只有<b>直角</b>的時候，兩片小的才會剛好等於大的？',
    controls: [{ k: 'a', label: '底 a', min: 2, max: 6, v: 3 }, { k: 'b', label: '邊 b', min: 2, max: 6, v: 4 }, { k: 't', label: '夾角', min: 50, max: 130, step: 5, v: 90, fmt: v => v + '°' }],
    draw(fig, s) {
      const th = s.t * Math.PI / 180;
      const P = { C: [0, 0], A: [s.a, 0], B: [s.b * Math.cos(th), s.b * Math.sin(th)] };
      const sq = (p, q, r) => {
        const dx = q[0] - p[0], dy = q[1] - p[1];
        let n = [-dy, dx];
        if (n[0] * (r[0] - p[0]) + n[1] * (r[1] - p[1]) > 0) n = [dy, -dx];
        return [p, q, [q[0] + n[0], q[1] + n[1]], [p[0] + n[0], p[1] + n[1]]];
      };
      const S1 = sq(P.C, P.A, P.B), S2 = sq(P.C, P.B, P.A), S3 = sq(P.A, P.B, P.C);
      const all = S1.concat(S2, S3);
      const xs = all.map(p => p[0]), ys = all.map(p => p[1]);
      const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
      const W = 340, H = 300, pad = 14, k = Math.min((W - 2 * pad) / (maxX - minX), (H - 2 * pad) / (maxY - minY));
      const T = p => [pad + (p[0] - minX) * k + ((W - 2 * pad) - (maxX - minX) * k) / 2, H - pad - (p[1] - minY) * k];
      const pts = arr => arr.map(p => T(p).join(',')).join(' ');
      const cen = arr => T([arr.reduce((a, p) => a + p[0], 0) / 4, arr.reduce((a, p) => a + p[1], 0) / 4]);
      const c2 = s.a * s.a + s.b * s.b - 2 * s.a * s.b * Math.cos(th);
      const [c1x, c1y] = cen(S1), [c2x, c2y] = cen(S2), [c3x, c3y] = cen(S3);
      let inner = `<polygon points="${pts(S1)}" fill="${C.orange}" stroke="${C.edge}" stroke-width="2"/><polygon points="${pts(S2)}" fill="${C.matcha}" stroke="${C.edge}" stroke-width="2"/><polygon points="${pts(S3)}" fill="${C.berry}" stroke="${C.edge}" stroke-width="2"/><polygon points="${pts([P.C, P.A, P.B])}" fill="#fff7e8" stroke="${C.edge}" stroke-width="2.5"/>`;
      inner += `<text x="${c1x}" y="${c1y}" text-anchor="middle" dominant-baseline="middle" class="region-label" font-size="18">${s.a * s.a}</text><text x="${c2x}" y="${c2y}" text-anchor="middle" dominant-baseline="middle" class="region-label" font-size="18">${s.b * s.b}</text><text x="${c3x}" y="${c3y}" text-anchor="middle" dominant-baseline="middle" class="region-label" font-size="18">${r2(c2)}</text>`;
      if (s.t === 90) { const r = 0.35, q = [P.C, [r, 0], [r, r], [0, r]]; inner += `<polygon points="${pts(q)}" fill="none" stroke="${C.edge}" stroke-width="1.5"/>`; }
      Viz.raw(fig, W, H, inner);
    },
    read(s) {
      const th = s.t * Math.PI / 180, c2 = s.a * s.a + s.b * s.b - 2 * s.a * s.b * Math.cos(th), sum = s.a * s.a + s.b * s.b;
      const cmp = Math.abs(c2 - sum) < 0.01 ? '<b style="color:var(--good)">＝ 剛好相等！</b>' : c2 > sum ? '大片比較大' : '大片比較小';
      return R`🟧 ${s.a * s.a} ＋ 🟩 ${s.b * s.b} ＝ <b>${sum}</b>　　🟥 大片 ≈ <b>${r2(c2)}</b>　→　${cmp}`;
    },
    tasks: [
      { q: '夾角拉到幾度時，兩片小的加起來剛好等於大的？', options: [
        { t: '90°（直角）', ok: true, why: '只有直角三角形才有畢氏定理！' },
        { t: '任何角度都可以', why: '把夾角拉到 120° 看看讀數。' }] },
      { q: '夾角<b>大於</b> 90°（張得更開）時，大片會？', options: [
        { t: '比兩片小的加起來還大', ok: true, why: '角張開，對面的邊變長，大正方形也變大。' },
        { t: '比較小', why: '拉到 120° 看看。' }] },
      { q: '保持 90°，把 a、b 拉成 3 和 4、再試 6 和 6，等式還成立嗎？', options: [
        { t: '都成立，只要是直角就成立', ok: true, why: R`6 和 6：36＋36＝72，大片是 72（邊長 \(\sqrt{72}=6\sqrt2\)）。` },
        { t: '只有 3、4、5 才成立', why: '拉成 6 和 6 看讀數，大片剛好是 72。' }] }
    ]
  };

  // ---------- 坐標兩點距離 ----------
  DEFS.dist = {
    icon: '📍', title: '坐標距離實驗室',
    intro: '拉動 A、B 兩點的坐標，看橫差、直差和距離。距離永遠是直角三角形的斜邊！',
    controls: [{ k: 'x1', label: 'A 的 x', min: -5, max: 5, v: -2 }, { k: 'y1', label: 'A 的 y', min: -5, max: 5, v: -1 }, { k: 'x2', label: 'B 的 x', min: -5, max: 5, v: 2 }, { k: 'y2', label: 'B 的 y', min: -5, max: 5, v: 2 }],
    draw(fig, s) {
      const segs = (s.x1 === s.x2 && s.y1 === s.y2) ? [] : [{ a: [s.x1, s.y1], b: [s.x2, s.y2], legs: s.x1 !== s.x2 && s.y1 !== s.y2 }];
      Viz.coord(fig, { xr: [-6, 6], yr: [-6, 6], pts: [{ p: [s.x1, s.y1], t: 'A' }, { p: [s.x2, s.y2], t: 'B' }], segs });
    },
    read(s) {
      const dx = Math.abs(s.x1 - s.x2), dy = Math.abs(s.y1 - s.y2), d2 = dx * dx + dy * dy;
      return R`橫差 \(=${dx}\)，直差 \(=${dy}\)<br>\(\overline{AB}=\sqrt{${dx}^2+${dy}^2}=\sqrt{${d2}}${d2 && simp(d2)[1] !== d2 ? '=' + radTex(d2) : ''}\)`;
    },
    tasks: [
      { q: '把 A、B 拉到<b>同一條橫線</b>上（y 一樣），距離是？', options: [
        { t: '就是橫差', ok: true, why: '直差是 0，沒有三角形了，距離就是兩點之間的格數。' },
        { t: '0', why: '拉成 A(−2, 1)、B(3, 1) 看看。' }] },
      { q: '找一組讓距離剛好是 5 的 A、B，下面哪一組可以？', options: [
        { t: '橫差 3、直差 4', ok: true, why: '3、4、5 畢氏三兄弟！例如 A(0,0)、B(3,4)。' },
        { t: '橫差 2、直差 3', why: R`\(\sqrt{4+9}=\sqrt{13}\)，不是 5。` }] }
    ]
  };

  // ---------- 拖拉直方圖 → 累積圖 ----------
  DEFS.histo = {
    icon: '📊', title: '拖拉直方圖實驗室',
    intro: '<b>用手指上下拖每一條長條</b>（改變那一組的人數），下面的<b>累積相對次數折線圖</b>會跟著變。',
    persist: true,
    controls: [],
    draw(fig, s, api) {
      if (!s.v) s.v = [3, 6, 9, 5, 2];
      const E = [0, 20, 40, 60, 80, 100];
      const W = 340, x0 = 42, x1 = 326, top0 = 16, bot0 = 150, top1 = 196, bot1 = 330, max = 12;
      const X = v => x0 + v / 100 * (x1 - x0);
      let svg = fig._svg;
      if (!svg) {
        fig.innerHTML = '';
        svg = Viz.box(fig, W, 360);
        fig._svg = svg;
        svg.style.touchAction = 'none';
        let drag = -1;
        const toY = e => { const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY; return pt.matrixTransform(svg.getScreenCTM().inverse()); };
        svg.addEventListener('pointerdown', e => {
          const p = toY(e);
          if (p.y > bot0 + 10) return;
          const i = Math.floor((p.x - x0) / ((x1 - x0) / 5));
          if (i < 0 || i > 4) return;
          drag = i; svg.setPointerCapture(e.pointerId); move(e);
        });
        const move = e => { if (drag < 0) return; const p = toY(e); const v = Math.max(0, Math.min(max, Math.round((bot0 - p.y) / ((bot0 - top0) / max)))); if (v !== s.v[drag]) { s.v[drag] = v; api.set('_', Math.random()); } };
        svg.addEventListener('pointermove', move);
        const end = () => { drag = -1; };
        svg.addEventListener('pointerup', end); svg.addEventListener('pointercancel', end);
      }
      const v = s.v, N = v.reduce((a, b) => a + b, 0) || 1;
      const Yh = n => bot0 - n / max * (bot0 - top0);
      const Yc = p => bot1 - p / 100 * (bot1 - top1);
      let g = '';
      for (let n = 0; n <= max; n += 3) g += `<line x1="${x0}" y1="${Yh(n)}" x2="${x1}" y2="${Yh(n)}" stroke="var(--line)"/><text x="${x0 - 6}" y="${Yh(n)}" text-anchor="end" dominant-baseline="middle" class="ruler-t" style="font-size:11px;font-style:normal">${n}</text>`;
      v.forEach((n, i) => {
        g += `<rect x="${X(E[i]) + 2}" y="${Yh(n)}" width="${X(E[i + 1]) - X(E[i]) - 4}" height="${bot0 - Yh(n)}" rx="3" fill="${C.choco}" stroke="${C.edge}"/>`;
        g += `<rect x="${X(E[i]) + 2}" y="${top0}" width="${X(E[i + 1]) - X(E[i]) - 4}" height="${bot0 - top0}" fill="transparent" style="cursor:ns-resize"/>`;
        g += `<text x="${(X(E[i]) + X(E[i + 1])) / 2}" y="${Yh(n) - 8}" text-anchor="middle" class="ruler-t" style="font-size:13px;font-style:normal">${n} 人</text>`;
      });
      g += `<line x1="${x0}" y1="${bot0}" x2="${x1}" y2="${bot0}" stroke="var(--ink)" stroke-width="2" style="stroke:var(--ink)"/>`;
      E.forEach(e => { g += `<text x="${X(e)}" y="${bot0 + 13}" text-anchor="middle" class="ruler-t" style="font-size:11px;font-style:normal">${e}</text>`; });
      g += `<text x="${x0}" y="${top0 - 4}" class="ruler-t" style="font-size:11px;font-style:normal">人數（拖我！）</text>`;
      // 累積圖
      for (let p = 0; p <= 100; p += 25) g += `<line x1="${x0}" y1="${Yc(p)}" x2="${x1}" y2="${Yc(p)}" stroke="var(--line)"/><text x="${x0 - 6}" y="${Yc(p)}" text-anchor="end" dominant-baseline="middle" class="ruler-t" style="font-size:11px;font-style:normal">${p}%</text>`;
      let cum = 0; const pts = [[X(0), Yc(0)]];
      v.forEach((n, i) => { cum += n; pts.push([X(E[i + 1]), Yc(cum / N * 100)]); });
      g += `<polyline points="${pts.map(p => p.join(',')).join(' ')}" fill="none" stroke="${C.red}" stroke-width="2.5"/>`;
      cum = 0;
      pts.forEach((p, i) => { if (i) cum += v[i - 1]; g += `<circle cx="${p[0]}" cy="${p[1]}" r="4" fill="${C.red}"/>`; if (i) g += `<text x="${p[0]}" y="${p[1] - 9}" text-anchor="middle" class="ruler-t" style="font-size:11px;font-style:normal">${Math.round(cum / N * 100)}%</text>`; });
      g += `<line x1="${x0}" y1="${bot1}" x2="${x1}" y2="${bot1}" stroke="var(--ink)" stroke-width="2" style="stroke:var(--ink)"/>`;
      E.forEach(e => { g += `<text x="${X(e)}" y="${bot1 + 13}" text-anchor="middle" class="ruler-t" style="font-size:11px;font-style:normal">${e}</text>`; });
      g += `<text x="${x0}" y="${top1 - 6}" class="ruler-t" style="font-size:11px;font-style:normal">累積相對次數</text>`;
      svg.innerHTML = g;
    },
    read(s) {
      const v = s.v || [3, 6, 9, 5, 2], N = v.reduce((a, b) => a + b, 0) || 1;
      return `總共 <b>${N}</b> 人；各組相對次數：` + v.map(n => Math.round(n / N * 100) + '%').join('、');
    },
    tasks: [
      { q: '把某一組拉得很高，累積圖會怎樣？', options: [
        { t: '那一組對應的那一段變得很陡', ok: true, why: '那一組人多，累積 % 一下子爬很多。<b>最陡的一段＝人最多的一組</b>。' },
        { t: '整條線都變高', why: '拉拉看，只有那一段變陡，前面的點反而變低。' }] },
      { q: '把五組拉成一樣高，累積圖變成？', options: [
        { t: '一條直直的斜線', ok: true, why: '每一組都爬 20%，每段一樣陡。' },
        { t: '一條水平線', why: '拉成一樣高試試看。' }] },
      { q: '不管怎麼拉，累積圖最後一個點都是？', options: [
        { t: '100%', ok: true, why: '最後一定把全部的人都算進去了。' },
        { t: '跟最後一組的人數有關', why: '把最後一組拉到 0 看看，最後一點還是 100%。' }] },
      { q: '把某一組拉到 0 人，累積圖那一段會？', options: [
        { t: '變成水平的（沒有爬）', ok: true, why: '那一組沒有人，累積 % 不會增加。' },
        { t: '往下掉', why: '累積只會加，不會減。拉到 0 看看。' }] }
    ]
  };

  // ---------- 放大鏡逼近 √n ----------
  DEFS.zoom = {
    icon: '🔍', title: '放大鏡實驗室',
    intro: R`選一個數 \(n\)，用放大鏡一層一層看 \(\sqrt n\) 躲在數線的哪裡（十分逼近法）。`,
    controls: [{ k: 'n', label: 'n', min: 2, max: 99, v: 2, fmt: v => v }, { k: 'z', label: '放大', type: 'seg', v: 0, options: [[0, '整數'], [1, '小數第一位'], [2, '小數第二位']] }],
    draw(fig, s) {
      const r = Math.sqrt(s.n), step = Math.pow(10, -s.z);
      const lo = Math.floor(r / step + 1e-9) * step, hi = lo + step, sub = step / 10;
      const ticks = [], labels = {};
      for (let i = 0; i <= 10; i++) { const t = +(lo + i * sub).toFixed(s.z + 1); ticks.push(t); labels[t] = (i === 0 || i === 10 || i === 5) ? String(t) : ''; }
      const slo = Math.floor(r / sub + 1e-9) * sub;
      Viz.numLine(fig, { from: lo, to: hi, ticks, labels, band: [slo, slo + sub], points: [{ v: r, t: '√' + s.n }] });
    },
    read(s) {
      const r = Math.sqrt(s.n);
      if (Number.isInteger(r)) return R`\(\sqrt{${s.n}}=${r}\)，剛好是整數（${s.n} 是完全平方數）！`;
      const step = Math.pow(10, -s.z), lo = +(Math.floor(r / step) * step).toFixed(s.z), hi = +(lo + step).toFixed(s.z);
      const sq = v => +(v * v).toFixed(2 * s.z);
      return R`\(${lo}^2=${sq(lo)}<${s.n}<${sq(hi)}=${hi}^2\)，所以 \(${lo}<\sqrt{${s.n}}<${hi}\)<br><span class="muted">計算機：\(\sqrt{${s.n}}=${r.toFixed(5)}\ldots\)</span>`;
    },
    tasks: [
      { q: '每按一次「放大」，範圍變成原來的？', options: [
        { t: '十分之一', ok: true, why: '整數 → 小數第一位 → 小數第二位，每次切成 10 段。' },
        { t: '一半', why: '數數看，每次被切成幾段？' }] },
      { q: R`把 \(n\) 拉到 49、64 這種數，會怎樣？`, options: [
        { t: '根號剛好是整數，不用逼近', ok: true, why: '完全平方數開得完。' },
        { t: '一樣要逼近', why: '拉到 49 看看讀數。' }] },
      { q: R`\(\sqrt{50}\) 大約是多少？（拉 n＝50 放大看看）`, options: [
        { t: '7.07', ok: true, why: R`\(7.07^2\approx49.98\)，非常接近 50。` },
        { t: '7.5', why: R`\(7.5^2=56.25\)，太大了。` }] }
    ]
  };

  // ---------- 根號化簡機 ----------
  DEFS.simp = {
    icon: '📦', title: '根號化簡機',
    intro: R`拉動 \(n\)，機器會把 \(n\) 拆成質數。<b>一對一樣的</b>搬出根號（變成一個），落單的留在裡面。`,
    controls: [{ k: 'n', label: 'n', min: 2, max: 200, v: 72, fmt: v => v }],
    draw(fig, s) {
      const f = factors(s.n), used = {}, out = [];
      const chips = [];
      for (let i = 0; i < f.length; i++) {
        if (i + 1 < f.length && f[i] === f[i + 1]) { chips.push(`<span class="hi">${f[i]}</span><span class="hi">${f[i]}</span>`); out.push(f[i]); i++; }
        else chips.push(`<span>${f[i]}</span>`);
      }
      fig.appendChild(h(`<div class="chips">√( ${chips.join(' ')} )</div>`));
    },
    read(s) {
      const [o, i] = simp(s.n);
      const msg = i === 1 ? '開得完，是整數！' : o === 1 ? '沒有一對一樣的，已經是最簡根式。' : `搬出 ${o}，留下 ${i}。`;
      return R`\(\sqrt{${s.n}}=${radTex(s.n)}\)　<span class="muted">${msg}</span>`;
    },
    tasks: [
      { q: '拉到哪一種 n，答案會沒有根號？', options: [
        { t: '每個質數都剛好成對（像 36、100、144）', ok: true, why: '全部都搬得出去，就是完全平方數。' },
        { t: '偶數', why: R`拉到 8 看看：\(\sqrt8=2\sqrt2\)，還有根號。` }] },
      { q: R`\(\sqrt{12}\)、\(\sqrt{27}\)、\(\sqrt{75}\) 化簡後，有什麼共同點？`, options: [
        { t: R`根號裡都剩 3，是同類根式，可以合併`, ok: true, why: R`\(2\sqrt3\)、\(3\sqrt3\)、\(5\sqrt3\)，就像長條 x 一樣可以相加。` },
        { t: '沒有共同點', why: '一個一個拉出來看看根號裡剩什麼。' }] }
    ]
  };

  // ---------- 欠條抵消 A ± B ----------
  DEFS.tiles = {
    icon: '📦', title: '巧克力倉庫實驗室',
    intro: '設定 A、B 兩箱巧克力，選「＋」或「−」。減法時 B 的<b>每一樣都反過來</b>（有的變欠的、欠的變有的），再和 A 抵消。',
    controls: [
      { k: 'a2', label: 'A 的 x²', min: -3, max: 3, v: 2 }, { k: 'a1', label: 'A 的 x', min: -3, max: 3, v: 1 }, { k: 'a0', label: 'A 的 1', min: -3, max: 3, v: -2 },
      { k: 'b2', label: 'B 的 x²', min: -3, max: 3, v: 1 }, { k: 'b1', label: 'B 的 x', min: -3, max: 3, v: -2 }, { k: 'b0', label: 'B 的 1', min: -3, max: 3, v: 1 },
      { k: 'op', label: '運算', type: 'seg', v: -1, options: [[1, 'A＋B'], [-1, 'A−B']] }],
    draw(fig, s) {
      const lab = pre => it => pre + ({ x2: 'x²', x: 'x', '1': '1' }[it.k]) + (it.neg ? '欠' : '');
      fig.appendChild(h('<div class="muted small">A：</div>'));
      Viz.polyTiles(fig, { x2: s.a2, x: s.a1, c: s.a0 }, { labels: lab('') });
      fig.appendChild(h(`<div class="muted small">${s.op > 0 ? 'B：' : '−B（每一樣都反過來）：'}</div>`));
      Viz.polyTiles(fig, { x2: s.op * s.b2, x: s.op * s.b1, c: s.op * s.b0 }, { labels: lab('') });
      fig.appendChild(h('<div class="muted small">抵消後的結果：</div>'));
      const r = { x2: s.a2 + s.op * s.b2, x: s.a1 + s.op * s.b1, c: s.a0 + s.op * s.b0 };
      if (r.x2 || r.x || r.c) Viz.polyTiles(fig, r, { labels: lab('') }); else fig.appendChild(h('<p style="text-align:center">全部抵消光了：0</p>'));
    },
    read(s) {
      const A = poly(s.a2, s.a1, s.a0), B = poly(s.b2, s.b1, s.b0), Rr = poly(s.a2 + s.op * s.b2, s.a1 + s.op * s.b1, s.a0 + s.op * s.b0);
      return R`\((${A})${s.op > 0 ? '+' : '-'}(${B})=${Rr}\)`;
    },
    tasks: [
      { q: '選「A−B」時，B 裡面「欠的」長條會變成？', options: [
        { t: '有的長條', ok: true, why: R`退貨章：\(-(-2x)=+2x\)。` },
        { t: '還是欠的', why: '把 B 的 x 拉成 −2，選 A−B，看第二排。' }] },
      { q: '怎樣設定，A−B 的結果會是 0？', options: [
        { t: 'A 和 B 設成一模一樣', ok: true, why: '自己減自己，每一樣都剛好抵消。' },
        { t: 'B 全部設成 0', why: '那樣結果是 A，不是 0。' }] }
    ]
  };

  // ---------- 解 → 方程式製造機 ----------
  DEFS.roots = {
    icon: '🎩', title: '方程式製造機',
    intro: R`先決定兩個解 \(p\)、\(q\)，機器就做出方程式 \((x-p)(x-q)=0\)，展開給你看。`,
    controls: [{ k: 'p', label: '解 p', min: -6, max: 6, v: 3 }, { k: 'q', label: '解 q', min: -6, max: 6, v: -2 }],
    draw(fig, s) {
      const ticks = []; for (let i = -7; i <= 7; i++) ticks.push(i);
      const labels = {}; ticks.forEach(t => { labels[t] = t % 2 ? '' : String(t); });
      const pts = s.p === s.q ? [{ v: s.p, t: '重根 ' + s.p }] : [{ v: s.p, t: 'p＝' + s.p }, { v: s.q, t: 'q＝' + s.q, up: 18 }];
      Viz.numLine(fig, { from: -7, to: 7, ticks, labels, points: pts });
    },
    read(s) {
      const p = s.p, q = s.q, f = v => (v < 0 ? '+' + -v : v === 0 ? '' : '-' + v);
      return R`\((x${f(p)})(x${f(q)})=0\)　→　\(${poly(1, -(p + q), p * q)}=0\)<br><span class="muted">x 項係數 \(=-(p+q)=${-(p + q)}\)，常數 \(=pq=${p * q}\)</span>`;
    },
    tasks: [
      { q: 'p 和 q 拉成一樣時，方程式有什麼特別？', options: [
        { t: R`變成完全平方 \((x-p)^2=0\)，是重根`, ok: true, why: R`例如 p＝q＝3：\(x^2-6x+9=(x-3)^2\)。` },
        { t: '沒有解', why: '拉成一樣看看數線上的點。' }] },
      { q: '要讓方程式<b>沒有 x 項</b>，p、q 要怎麼拉？', options: [
        { t: '互為相反數（例如 3 和 −3）', ok: true, why: R`\((x-3)(x+3)=x^2-9\)，平方差！` },
        { t: '一個拉到 0', why: '拉成 p＝0 看看，x 項還在。' }] },
      { q: '其中一個解是 0 時，方程式少了什麼？', options: [
        { t: '常數項（最後的數）', ok: true, why: R`\(x(x-q)=x^2-qx\)，可以提公因式 x，這時千萬別把 x 約掉！` },
        { t: 'x² 項', why: '拉 p＝0 看看。' }] }
    ]
  };

  /* ---------- 自動掛載 ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    const host = document.getElementById('lab-host');
    if (!host) return;
    (host.dataset.labs || '').split(',').map(x => x.trim()).filter(Boolean).forEach(k => { if (DEFS[k]) mount(host, DEFS[k]); });
  });
  window.Labs = { DEFS, mount };
})();
