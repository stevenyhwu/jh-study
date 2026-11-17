/* ===== 數學 3-3a 十字交乘（x² 係數是 1） ===== */
(function () {
  'use strict';
  const U = Unit4, h = U.h;
  const ST = 'stroke="var(--stroke)" stroke-width="1.5"';
  const NEG = '#d9534f';

  /* ---------- 寫式子 ---------- */
  const X2 = 'x<sup>2</sup>';
  const abs = Math.abs;
  const num = n => (n < 0 ? '−' + -n : String(n));
  const sgnTerm = (k, v) => (k === 0 ? '' : (k > 0 ? ' + ' : ' − ') + (abs(k) === 1 && v ? '' : abs(k)) + (v || ''));
  const poly = (b, c) => X2 + sgnTerm(b, 'x') + sgnTerm(c, '');           // x² + bx + c
  const par = m => (m === 0 ? 'x' : `(x ${m > 0 ? '+' : '−'} ${abs(m)})`); // (x + m)
  const M = s => `<span class="mth">${s}</span>`;

  /* ---------- 圖：長方形面積盒 (x+m)(x+n) ---------- */
  function boxSvg(m, n, show) {
    const X = 110, u = 13, W = k => Math.max(abs(k) * u, 16);
    const wm = W(m), wn = W(n), x0 = 40, y0 = 28;
    const lab = (k) => (show === false ? '?' : num(k));
    const cell = (x, y, w, hh, txt, kind, neg) => {
      const fill = neg ? 'none' : ['#f6c26b', '#9fd3a8', '#c9b8f0'][kind];
      return `<rect x="${x}" y="${y}" width="${w}" height="${hh}" fill="${fill}" fill-opacity=".6" ${ST}${neg ? ' stroke-dasharray="5 3"' : ''}/>
        <text x="${x + w / 2}" y="${y + hh / 2 + 5}" text-anchor="middle" class="t14b"${neg ? ` style="fill:${NEG}"` : ''}>${txt}</text>`;
    };
    const mx = show === false ? '?x' : (m === 1 ? '' : m === -1 ? '−' : num(m)) + 'x';
    const nx = show === false ? '?x' : (n === 1 ? '' : n === -1 ? '−' : num(n)) + 'x';
    const mn = show === false ? '?' : num(m * n);
    const w = x0 + X + wm + 10, hh = y0 + X + wn + 10;
    return { vb: `0 0 ${Math.max(w, 200)} ${hh}`, inner: `
      <text x="${x0 + X / 2}" y="18" text-anchor="middle" class="t14b">x</text>
      <text x="${x0 + X + wm / 2}" y="18" text-anchor="middle" class="t14b"${m < 0 && show !== false ? ` style="fill:${NEG}"` : ''}>${lab(m)}</text>
      <text x="${x0 - 12}" y="${y0 + X / 2 + 5}" text-anchor="middle" class="t14b">x</text>
      <text x="${x0 - 12}" y="${y0 + X + wn / 2 + 5}" text-anchor="middle" class="t14b"${n < 0 && show !== false ? ` style="fill:${NEG}"` : ''}>${lab(n)}</text>
      ${cell(x0, y0, X, X, 'x²', 0)}
      ${cell(x0 + X, y0, wm, X, mx, 1, show !== false && m < 0)}
      ${cell(x0, y0 + X, X, wn, nx, 1, show !== false && n < 0)}
      ${cell(x0 + X, y0 + X, wm, wn, mn, 2, show !== false && m * n < 0)}` };
  }
  function boxPic(host, m, n, show) { const b = boxSvg(m, n, show); const sv = U.svg(host, b.vb, b.inner, `(x${num(m)})(x${num(n)}) 的面積盒`, 'u4-pic'); sv.style.maxWidth = '260px'; return sv; }

  /* ---------- 圖：十字交乘圖 ---------- */
  function crossPic(host, m, n) {
    const t = k => (k === 1 ? '' : k === -1 ? '−' : num(k));
    const pn = k => (k < 0 ? `(${num(k)})` : num(k));
    const sv = U.svg(host, '0 0 305 132', `
      <text x="40" y="34" text-anchor="middle" class="t14b">x</text><text x="140" y="34" text-anchor="middle" class="t14b">${num(m)}</text>
      <text x="40" y="104" text-anchor="middle" class="t14b">x</text><text x="140" y="104" text-anchor="middle" class="t14b">${num(n)}</text>
      <line x1="55" y1="40" x2="125" y2="90" stroke="var(--accent)" stroke-width="2"/><line x1="55" y1="90" x2="125" y2="40" stroke="var(--accent)" stroke-width="2"/>
      <text x="170" y="34" class="t14b" style="font-weight:400">x × ${pn(n)} ＝ ${t(n)}x</text>
      <text x="170" y="60" class="t14b" style="font-weight:400">x × ${pn(m)} ＝ ${t(m)}x</text>
      <line x1="170" y1="70" x2="300" y2="70" stroke="var(--stroke)"/>
      <text x="170" y="92" class="t14b">加起來 ${t(m + n)}x</text>
      <text x="90" y="126" text-anchor="middle" class="t14b" style="font-weight:400">橫著讀：${par(m).replace(/<[^>]+>/g, '')}${par(n).replace(/<[^>]+>/g, '')}</text>`, '十字交乘圖');
    sv.style.maxWidth = '340px';
    return sv;
  }

  /* ---------- 圖：因數配對表 ---------- */
  function pairsOf(c) {
    const out = [];
    for (let a = 1; a * a <= abs(c); a++) if (abs(c) % a === 0) {
      const b = abs(c) / a;
      if (c > 0) { out.push([a, b]); out.push([-a, -b]); } else { out.push([a, -b]); if (a !== b) out.push([-a, b]); }
    }
    return out;
  }
  function pairsPic(host, c, b, reveal, onlyPos) {
    let rows = pairsOf(c);
    if (onlyPos) rows = rows.filter(r => r[0] > 0 && r[1] > 0);
    const t = h(`<table class="sim-table"><tr><th>乘起來是 ${num(c)} 的兩個數</th><th>加起來</th></tr>${rows.map(([p, q]) => {
      const hit = reveal && p + q === b;
      return `<tr${hit ? ' style="background:var(--good-soft);font-weight:700"' : ''}><td>${num(p)} 和 ${num(q)}</td><td>${num(p + q)}${hit ? ' ✔' : ''}</td></tr>`;
    }).join('')}</table>`);
    t.style.maxWidth = '360px';
    host.appendChild(t);
    return t;
  }

  /* ---------- 模擬：拉兩個數，拼長方形 ---------- */
  function boxSim(host, on, opt) {
    opt = opt || {};
    host.appendChild(h(`<p class="sim-h">${opt.title || '拉兩個數 m、n，拼出長方形 (x + m)(x + n)'}</p>`));
    const tgt = h('<div class="sim-note"></div>');
    host.appendChild(tgt);
    const pic = h('<div></div>'); host.appendChild(pic);
    const read = h('<div class="sim-read"></div>');
    let m = 1, n = 1, target = null;
    const st = { get m() { return m; }, get n() { return n; }, setTarget(b, c) { target = b == null ? null : [b, c]; draw(); } };
    function draw() {
      pic.innerHTML = '';
      const b = boxSvg(m, n);
      U.svg(pic, b.vb, b.inner, '面積盒', 'sim').style.maxWidth = '280px';
      const hit = target && m + n === target[0] && m * n === target[1];
      tgt.innerHTML = target ? `🎯 目標：拼出 ${M(poly(target[0], target[1]))}` : '';
      read.innerHTML = `${M(par(m) + par(n))} ＝ ${M(poly(m + n, m * n))}<br><span class="small muted">中間：${num(m)} ＋ ${num(n)} ＝ <b>${num(m + n)}</b>　最後：${num(m)} × ${num(n)} ＝ <b>${num(m * n)}</b></span>${hit ? '<br><b style="color:var(--good)">✔ 跟目標一樣！</b>' : ''}`;
    }
    const fmt = v => num(v);
    U.slider(host, 'm', { min: -6, max: 6, step: 1, value: m, fmt }, v => { m = v; draw(); on(); });
    U.slider(host, 'n', { min: -6, max: 6, step: 1, value: n, fmt }, v => { n = v; draw(); on(); });
    host.appendChild(read);
    host.appendChild(h('<p class="small muted">虛線格子是負的：「長」是負數，那一塊面積就要扣掉。</p>'));
    draw();
    st.hit = () => target && m + n === target[0] && m * n === target[1];
    return st;
  }

  /* ========== 1 猜 ========== */
  function guess(p, api) {
    U.guess(p, api, [
      { pic: c => boxPic(c, 2, 3), q: `這個長方形的長是 ${M('(x + 3)')}、寬是 ${M('(x + 2)')}。四塊加起來是 ${M(X2 + ' + 5x + 6')}。<br>中間的 <b>5</b> 是怎麼來的？`,
        options: [{ t: '2 ＋ 3', ok: true }, { t: '2 × 3' }, { t: '2 × 3 − 1' }],
        reveal: '<b>2 ＋ 3 ＝ 5</b>：兩塊綠色長條是 2x 和 3x，合起來 5x。那最後的 6 呢？是 <b>2 × 3</b>（右下角那一小塊）。' },
      { q: `倒過來想：${M(X2 + ' + 7x + 12')} 要拼成長方形，要找哪兩個數？`,
        options: [{ t: '2 和 6' }, { t: '3 和 4', ok: true }, { t: '1 和 12' }],
        reveal: '<b>3 和 4</b>：乘起來 12、加起來 7。所以 x² + 7x + 12 ＝ (x + 3)(x + 4)。這就是今天要學的：<b>找兩個數</b>。' }
    ]);
  }

  /* ========== 2 玩 ========== */
  function play(p, api) {
    let S;
    const card = h('<div class="card"></div>'); p.appendChild(card);
    const tk = U.tasks(p, api, [
      { text: `拉 m 和 n，拼出 ${M(X2 + ' + 5x + 6')}。`, setup() { S.setTarget(5, 6); }, check: () => S.hit(),
        qs: () => [{ q: `你找到的兩個數，跟 5、6 有什麼關係？`,
          options: [{ t: '加起來是 5，乘起來是 6', ok: true, why: '中間的數 ＝ 兩數<b>相加</b>；最後的數 ＝ 兩數<b>相乘</b>。' },
            { t: '乘起來是 5，加起來是 6', why: '看下面的讀數：中間那個是相加還是相乘？' }] }],
        found: `${M('(x + m)(x + n) ＝ ' + X2 + ' + (m + n)x + mn')}　中間是<b>相加</b>，最後是<b>相乘</b>。` },
      { text: `換一題：拼出 ${M(X2 + ' − 5x + 6')}。（中間變負的了）`, setup() { S.setTarget(-5, 6); }, check: () => S.hit(),
        qs: () => [{ q: '最後是 ＋6、中間是 −5，兩個數是什麼符號？',
          options: [{ t: '兩個都是負的', ok: true, why: '負 × 負 ＝ 正（得到 ＋6），負 ＋ 負 還是負（得到 −5）。' },
            { t: '一正一負', why: '一正一負乘起來會是負的，可是最後是 ＋6。' },
            { t: '兩個都是正的', why: '兩個正數加起來不會是 −5。' }] }],
        found: '最後是 <b>＋</b> → 兩個數<b>同號</b>，而且跟中間的數同號。' },
      { text: `最後一題：拼出 ${M(X2 + ' + x − 12')}。`, setup() { S.setTarget(1, -12); }, check: () => S.hit(),
        qs: () => [{ q: '最後是 −12，兩個數是什麼符號？哪一個比較大？',
          options: [{ t: '一正一負，正的那個比較大（4 和 −3）', ok: true, why: '一正一負乘起來才是負的；加起來是 ＋1，所以正的那個要「贏」，大 1。' },
            { t: '兩個都是負的', why: '負 × 負 是正的，可是最後是 −12。' },
            { t: '一正一負，負的那個比較大', why: '那加起來會是負的，可是中間是 ＋x（＋1）。' }] }],
        found: '最後是 <b>−</b> → 兩個數<b>一正一負</b>，絕對值大的那個跟中間的數同號。' }
    ]);
    S = boxSim(card, () => tk.check());
    card.appendChild(tk.slot); p.insertBefore(p.querySelector('.u4-task'), card);
    tk.start();
  }

  /* ========== 3 懂 ========== */
  function know(p, api) {
    p.appendChild(h('<p class="muted">把剛剛玩到的，收成 4 句話。</p>'));
    boxPic(U.card(p, '① 乘開：中間＝相加，最後＝相乘', `<p>${M('(x + m)(x + n) ＝ ' + X2 + ' + (m + n)x + mn')}</p><p>例：(x + 2)(x + 3) ＝ x² + <b>5</b>x + <b>6</b>，5 ＝ 2 ＋ 3，6 ＝ 2 × 3。</p>`), 2, 3);
    pairsPic(U.card(p, '② 倒過來＝因式分解：找兩個數', `<p>${M(X2 + ' + bx + c')}：找兩個數，<b>乘起來是 c、加起來是 b</b>。</p><p>先把「乘起來是 c」的列出來，再看哪一組加起來是 b。<br>例：x² + 7x + 12 → 3 和 4 → <b>(x + 3)(x + 4)</b></p>`), 12, 7, true, true);
    const t = U.card(p, '③ 正負號：先看最後的數', `<p>最後是 <b>＋</b>：兩個數<b>同號</b>，跟中間的數同號。<br>最後是 <b>−</b>：<b>一正一負</b>，絕對值大的跟中間的數同號。</p>`);
    t.appendChild(h(`<table class="sim-table" style="max-width:360px"><tr><th>式子</th><th>兩個數</th></tr>
      <tr><td>${poly(5, 6)}</td><td>2 和 3</td></tr><tr><td>${poly(-5, 6)}</td><td>−2 和 −3</td></tr>
      <tr><td>${poly(1, -12)}</td><td>4 和 −3</td></tr><tr><td>${poly(-1, -12)}</td><td>−4 和 3</td></tr></table>`));
    crossPic(U.card(p, '④ 十字交乘圖：寫下來不會亂', `<p>左邊寫 x、x，右邊寫找到的兩個數。<b>交叉</b>乘起來加一加要等於中間項，<b>橫著讀</b>就是答案。</p><p>例：x² + x − 12 ＝ (x + 4)(x − 3)</p>`), 4, -3);
    const c = h('<div class="card"><h3>✏️ 檢查一下</h3></div>'); p.appendChild(c);
    U.numq(c, { q: `${M(X2 + ' + 9x + 20 ＝ (x + 4)(x + □)')}，□ 是多少？`, pre: '□ ＝', answer: 5, signed: true,
      hint: '4 × □ ＝ 20，4 ＋ □ ＝ 9。', why: '4 × 5 ＝ 20、4 ＋ 5 ＝ 9 ✔',
      onDone() {
        U.choice(c, { q: `${M(X2 + ' − 2x − 15')} 因式分解是哪一個？`, hint: '最後是 −15 → 一正一負；中間是 −2 → 負的那個比較大。',
          options: [{ t: '(x − 5)(x + 3)', ok: true, why: '−5 × 3 ＝ −15，−5 ＋ 3 ＝ −2 ✔' },
            { t: '(x + 5)(x − 3)', why: '5 ＋ (−3) ＝ ＋2，中間會變成 ＋2x。符號反了。' },
            { t: '(x − 5)(x − 3)', why: '(−5) × (−3) ＝ ＋15，最後會是 ＋15。' }], onDone() { api.done(); } });
      } });
  }

  /* ========== 4 考（改寫的會考題） ========== */
  function exam(p, api) {
    U.exam(p, api, {
      intro: '這兩題是照會考題的樣子改寫的，數字比較好算。答錯可以再選。',
      benchLabel: '想驗算？打開長方形模擬',
      bench: host => boxSim(host, () => {}, { title: '拉 m、n 驗算看看' }),
      qs: [
        { src: '改寫自 112 年會考第 2 題', q: `下列何者為多項式 ${M(X2 + ' + x − 12')} 的因式？`,
          hint: '先把它因式分解：乘起來 −12、加起來 ＋1 的兩個數是？',
          options: [{ t: 'x − 4', why: '如果有 (x − 4)，另一個要是 (x + 3)，乘開中間是 −x，不是 ＋x。' },
            { t: 'x + 3', why: '如果有 (x + 3)，另一個要是 (x − 4)，中間是 −x。' },
            { t: 'x − 3', ok: true, why: 'x² + x − 12 ＝ (x + 4)(x − 3)，所以 x − 3 是因式。' },
            { t: 'x + 12', why: '(x + 12)(x − 1) ＝ x² + 11x − 12，中間不對。' }] },
        { src: '改寫自 108 年會考第 8 題', q: `若多項式 ${M(X2 + ' + 2x − 15')} 可因式分解成 ${M('(x + a)(x + b)')}，其中 a、b 均為整數，且 a ＞ b，則 a − b 之值為何？`,
          hint: '先找 a、b：乘起來 −15、加起來 ＋2。',
          options: [{ t: '2', why: '2 是 a ＋ b，題目問的是 a − b。' },
            { t: '8', ok: true, why: 'x² + 2x − 15 ＝ (x + 5)(x − 3)，a ＝ 5、b ＝ −3，a − b ＝ 5 − (−3) ＝ 8。' },
            { t: '−8', why: 'a 是比較大的那個（5），a − b ＝ 5 − (−3)。' },
            { t: '15', why: '−15 是 a × b，題目問的是 a − b。' }] }
      ]
    });
  }

  /* ========== 5 實戰（會考原題） ========== */
  function real(p, api) {
    U.real(p, api, [
      { stars: 1, src: '112 年會考 第 2 題',
        q: `下列何者為多項式 ${M(X2 + ' − 36')} 的因式？`,
        options: [{ t: 'x − 3', why: '(x − 3) 要配 (x + 12) 才會得到 −36，可是 (x − 3)(x + 12) ＝ x² + 9x − 36，多了 9x。' },
          { t: 'x − 4', why: '(x − 4)(x + 9) ＝ x² + 5x − 36，多了 5x。' },
          { t: 'x − 6', ok: true, why: 'x² − 36 ＝ (x + 6)(x − 6)。' },
          { t: 'x − 9', why: '(x − 9)(x + 4) ＝ x² − 5x − 36，多了 −5x。' }],
        explain: '<p>x² − 36 沒有 x 項，可以看成 x² ＋ <b>0</b>x − 36：找兩個數乘起來 −36、加起來 0 → <b>6 和 −6</b>。<br>所以 x² − 36 ＝ (x + 6)(x − 6)，答案 (C)。<br>（之後 3-2 會學到更快的方法：平方差公式 a² − b² ＝ (a + b)(a − b)。）</p>',
        steps: [
          { q: `${M(X2 + ' − 36')} 沒有 x 項，可以看成 ${M(X2 + ' + 0x − 36')}。要找的兩個數……`,
            options: [{ t: '乘起來 −36、加起來 0', ok: true, why: '中間是 0x，所以加起來是 0。' }, { t: '乘起來 36、加起來 0', why: '最後是 −36，有負號。' }, { t: '乘起來 −36、加起來 1', why: '沒有 x 項，代表中間是 0x。' }] },
          { q: '哪兩個數乘起來 −36、加起來 0？',
            options: [{ t: '4 和 −9', why: '4 ＋ (−9) ＝ −5。' }, { t: '6 和 −6', ok: true, why: '6 × (−6) ＝ −36，6 ＋ (−6) ＝ 0 ✔' }, { t: '3 和 −12', why: '3 ＋ (−12) ＝ −9。' }] },
          { q: `所以 ${M(X2 + ' − 36')} ＝ ？`,
            options: [{ t: '(x + 6)(x − 6)', ok: true, why: '裡面的 x − 6 就是選項 (C)。' }, { t: '(x − 6)(x − 6)', why: '(−6) × (−6) ＝ ＋36。' }] }
        ] },
      { stars: 2, src: '104 年會考 第 14 題',
        q: `判斷一元二次方程式 ${M(X2 + ' − 8x − a ＝ 0')} 中的 a 為下列哪一個數時，可使得此方程式的兩根均為整數？<div class="small muted" style="margin-top:6px">（還沒學方程式也沒關係：「兩根都是整數」的意思就是 x² − 8x − a 可以用十字交乘拆成 (x + m)(x + n)，m、n 是整數。）</div>`,
        options: [{ t: '12', why: '乘起來 −12、加起來 −8 的整數找不到：−12 和 1 加起來 −11，−6 和 2 是 −4，−4 和 3 是 −1。' },
          { t: '16', why: '乘起來 −16：−16 和 1（−15）、−8 和 2（−6）、−4 和 4（0），沒有 −8。' },
          { t: '20', ok: true, why: '−10 和 2：乘起來 −20、加起來 −8 ✔' },
          { t: '24', why: '乘起來 −24：−24 和 1、−12 和 2、−8 和 3、−6 和 4，加起來都不是 −8。' }],
        explain: '<p>要拆成 (x + m)(x + n)：<b>m ＋ n ＝ −8</b>，<b>m × n ＝ −a</b>。<br>一個一個試選項：只有 a ＝ 20 時找得到 −10 和 2。<br>x² − 8x − 20 ＝ (x − 10)(x + 2)，兩根是 10 和 −2，都是整數。答案 (C)。</p>',
        steps: [
          { q: '把 x² − 8x − a 拆成 (x + m)(x + n)。m 和 n 加起來要是多少？',
            options: [{ t: '−8', ok: true, why: '中間項是 −8x，加起來就是 −8。' }, { t: '8', why: '中間是 <b>−</b>8x，有負號。' }, { t: '−a', why: '−a 是最後那一項，那是相乘。' }] },
          { q: 'a 是正的，所以 m × n ＝ −a 是負的。m 和 n 是……',
            options: [{ t: '一正一負', ok: true, why: '乘起來是負的，一定一正一負。' }, { t: '兩個都是負的', why: '負 × 負 是正的。' }] },
          { q: '一正一負、加起來 −8：試試 −10 和 2。它們乘起來是多少？',
            options: [{ t: '−20', ok: true, why: '所以 −a ＝ −20，a ＝ 20。' }, { t: '−8', why: '−8 是加起來；乘起來是 −10 × 2。' }, { t: '20', why: '一正一負乘起來是負的。' }] }
        ] },
      { stars: 3, src: '107 年會考 第 8 題',
        q: `若一元二次方程式 ${M(X2 + ' − 8x − 3×11 ＝ 0')} 的兩根為 a、b，且 a ＞ b，則 a − 2b 之值為何？`,
        options: [{ t: '−25', why: '這是把 a、b 弄反了：−3 − 2 × 11 ＝ −25。a 是比較大的那個。' },
          { t: '−19', why: '再檢查一下 a、b 是哪兩個數。' },
          { t: '5', why: '11 − 2 × 3 ＝ 5？b 是 −3，−2 × (−3) ＝ ＋6。' },
          { t: '17', ok: true, why: 'a ＝ 11、b ＝ −3，11 − 2 × (−3) ＝ 11 ＋ 6 ＝ 17。' }],
        explain: '<p>3 × 11 ＝ 33。x² − 8x − 33：找兩個數乘起來 −33、加起來 −8 → <b>−11 和 3</b>。<br>x² − 8x − 33 ＝ (x − 11)(x + 3) ＝ 0，兩個括號乘起來是 0，至少一個是 0：x ＝ 11 或 x ＝ −3。<br>a ＞ b，所以 a ＝ 11、b ＝ −3，a − 2b ＝ 11 ＋ 6 ＝ 17。答案 (D)。<br>💡 題目故意寫 3 × 11 不寫 33，是在提示你 33 ＝ 3 × 11。</p>',
        steps: [
          { q: '3 × 11 ＝ 33。x² − 8x − 33：哪兩個數乘起來 −33、加起來 −8？',
            options: [{ t: '−11 和 3', ok: true, why: '−11 × 3 ＝ −33，−11 ＋ 3 ＝ −8 ✔' }, { t: '11 和 −3', why: '11 ＋ (−3) ＝ ＋8，符號反了。' }, { t: '−33 和 1', why: '−33 ＋ 1 ＝ −32。' }] },
          { q: '所以方程式變成 (x − 11)(x + 3) ＝ 0。兩個數乘起來是 0，代表……',
            options: [{ t: '至少有一個括號是 0：x ＝ 11 或 x ＝ −3', ok: true, why: '代進去檢查：x ＝ 11 → 0 × 14 ＝ 0 ✔；x ＝ −3 → (−14) × 0 ＝ 0 ✔。這兩個就是「兩根」。' },
              { t: 'x ＝ −11 或 x ＝ 3', why: 'x − 11 ＝ 0 時，x 是 ＋11。代進去試試。' }] },
          { num: true, signed: true, q: '兩根是 11 和 −3，a 是比較大的、b 是比較小的。a − 2b ＝ ？', pre: 'a − 2b ＝', answer: 17,
            diag: [{ v: 5, msg: 'b 是 −3，所以 −2b ＝ −2 × (−3) ＝ ＋6。' }, { v: -25, msg: 'a 是比較大的那個，也就是 11。' }],
            hint: '11 − 2 × (−3)，負負得正。' }
        ] }
    ], '這些是真正的會考題，題目照原題。由簡單排到難，卡住就按「🪜 拆解」。後面兩題是第 4 章「方程式」的樣子，但關鍵其實只有十字交乘。');
  }

  U.run('3-3a', ['先猜猜看：中間的數從哪裡來？', '動手玩：拼長方形', '收成 4 句話', '會考題改寫版', '會考實戰：照原題做做看'],
    { guess, play, know, exam, real }, { course: 'math8a', ns: 'math', homeLabel: '回數學首頁' });
})();
