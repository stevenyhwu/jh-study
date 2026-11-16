/* ===== 理化 1-2 長度、質量、時間與體積的測量 ===== */
(function () {
  'use strict';
  const U = Unit4, h = U.h;
  const ST = 'stroke="var(--stroke)" stroke-width="1.5"';

  /* ---------- 尺：上面是整把尺，下面是放大鏡 ---------- */
  function ruler(L) {
    const x = cm => 20 + cm * 40, a = Math.floor(L);
    let s = `<rect x="20" y="16" width="${L * 40 - 10}" height="14" rx="4" fill="#f6c453" ${ST}/><path d="M${x(L) - 10} 16 l10 7 l-10 7Z" fill="#5b3a26"/>
      <rect x="14" y="34" width="332" height="30" fill="var(--card)" ${ST}/>`;
    for (let mm = 0; mm <= 80; mm++) {
      const X = 20 + mm * 4, big = mm % 10 === 0;
      s += `<line x1="${X}" y1="34" x2="${X}" y2="${big ? 48 : mm % 5 === 0 ? 44 : 40}" stroke="var(--stroke)" stroke-width="${big ? 1.2 : .7}"/>`;
      if (big) s += `<text x="${X}" y="60" text-anchor="middle" class="t12">${mm / 10}</text>`;
    }
    s += `<text x="350" y="60" text-anchor="end" class="t12 mut">cm</text>
      <rect x="${x(a) - 2}" y="12" width="44" height="54" rx="6" fill="none" stroke="var(--accent)" stroke-width="2" stroke-dasharray="4 3"/>
      <text x="180" y="88" text-anchor="middle" class="t12b" style="fill:var(--accent)">🔍 把藍框放大來看</text>`;
    // 放大：a ~ a+1 cm，每 mm 30px
    const zx = cm => 30 + (cm - a) * 300;
    s += `<rect x="14" y="96" width="332" height="100" rx="8" fill="var(--bg)" stroke="var(--accent)" stroke-width="2"/>
      <rect x="14" y="106" width="${zx(L) - 32}" height="26" fill="#f6c453"/><path d="M${zx(L) - 18} 106 l18 13 l-18 13Z" fill="#5b3a26"/>
      <line x1="${zx(L)}" y1="119" x2="${zx(L)}" y2="150" stroke="var(--bad)" stroke-width="1.5" stroke-dasharray="4 3"/>`;
    for (let i = 0; i <= 10; i++) {
      const X = 30 + i * 30, big = i % 10 === 0;
      s += `<line x1="${X}" y1="150" x2="${X}" y2="${big ? 172 : i === 5 ? 168 : 163}" stroke="var(--stroke)" stroke-width="${big ? 1.6 : 1}"/>
        <text x="${X}" y="188" text-anchor="middle" class="${big ? 't12b' : 't12 mut'}">${big ? a + i / 10 : (a + i / 10).toFixed(1)}</text>`;
    }
    return s;
  }
  function rulerSvg(host, L) { return U.svg(host, '0 0 360 200', ruler(L), '一把尺和一枝鉛筆', 'sim'); }

  /* ---------- 上皿天平 ---------- */
  const OBJ = 68, WS = [50, 20, 20, 10, 5, 2, 1];
  function balanceSim(host, onChange) {
    host.appendChild(h('<p class="sim-h">上皿天平：左盤放物體，右盤放砝碼</p>'));
    const sv = U.svg(host, '0 0 360 190', '', '上皿天平', 'sim');
    const on = WS.map(() => false);
    const row = h('<div class="chips"><span class="chips-l">砝碼（點一下放上去／拿下來）</span></div>');
    WS.forEach((w, i) => {
      const b = h(`<button type="button" class="btn">${w} g</button>`);
      b.addEventListener('click', () => { on[i] = !on[i]; b.classList.toggle('on', on[i]); draw(); onChange(); });
      row.appendChild(b);
    });
    const read = h('<div class="sim-read"></div>');
    const sum = () => WS.reduce((t, w, i) => t + (on[i] ? w : 0), 0);
    function draw() {
      const R = sum(), d = Math.max(-1, Math.min(1, (R - OBJ) / 12)), ang = d * 9 * Math.PI / 180;
      const px = 180, py = 62, len = 110;
      const lx = px - len * Math.cos(ang), ly = py - len * Math.sin(ang), rx = px + len * Math.cos(ang), ry = py + len * Math.sin(ang);
      let s = `<path d="M${px - 14} 170 L${px} ${py} L${px + 14} 170Z" fill="var(--line)" ${ST}/><rect x="110" y="170" width="140" height="10" rx="3" fill="var(--line)" ${ST}/>
        <line x1="${lx}" y1="${ly}" x2="${rx}" y2="${ry}" stroke="var(--stroke)" stroke-width="5" stroke-linecap="round"/>
        <line x1="${px}" y1="${py}" x2="${px - 60 * Math.sin(ang)}" y2="${py + 60 * Math.cos(ang)}" stroke="var(--bad)" stroke-width="2"/>
        <line x1="${px}" y1="116" x2="${px}" y2="128" stroke="var(--stroke)" stroke-width="1.5"/>`;
      const pan = (x, y, inner) => `<line x1="${x}" y1="${y}" x2="${x}" y2="${y + 20}" stroke="var(--stroke)" stroke-width="2"/><rect x="${x - 46}" y="${y + 20}" width="92" height="6" rx="3" fill="var(--card)" ${ST}/>${inner(x, y + 20)}`;
      s += pan(lx, ly, (x, y) => `<rect x="${x - 20}" y="${y - 34}" width="40" height="34" rx="5" fill="#b9a7e8" ${ST}/><text x="${x}" y="${y - 12}" text-anchor="middle" class="t14b">?</text>`);
      s += pan(rx, ry, (x, y) => {
        const ws = WS.filter((w, i) => on[i]); let t = '', cx = x - ws.length * 6.5 + 6.5;
        ws.forEach(w => { const hh = 10 + Math.sqrt(w) * 3; t += `<rect x="${cx - 6}" y="${y - hh}" width="12" height="${hh}" rx="2" fill="#c9a063" ${ST}/>`; cx += 13; });
        return t;
      });
      sv.innerHTML = s;
      read.innerHTML = `右盤砝碼合計：<b>${R} g</b>　` + (R === OBJ ? '<b style="color:var(--good)">⚖ 平衡了！指針在正中央</b>' : R < OBJ ? '左邊（物體）比較重 → 砝碼不夠' : '右邊（砝碼）比較重 → 砝碼太多');
    }
    host.append(row, read); draw();
    return { ok: () => sum() === OBJ };
  }

  /* ---------- 單擺 ---------- */
  function pendulumSim(host, onChange) {
    host.appendChild(h('<p class="sim-h">單擺：改一改，看來回擺 10 次要幾秒</p>'));
    const sv = U.svg(host, '0 0 360 230', '', '單擺', 'sim');
    let L = 25, m = 50, A = 5; const trials = [];
    const t10 = () => Math.round(20 * Math.sqrt(L / 100) * 10) / 10;
    U.chips(host, '擺長', [25, 50, 100, 200].map(v => ({ v, t: v + ' cm' })), L, v => { L = v; });
    U.chips(host, '擺錘質量', [50, 100, 200].map(v => ({ v, t: v + ' g' })), m, v => { m = v; });
    U.chips(host, '擺角', [{ v: 5, t: '小（5°）' }, { v: 10, t: '大一點（10°）' }], A, v => { A = v; });
    const row = h('<div class="row"><button type="button" class="btn primary">⏱ 計時：來回 10 次</button></div>');
    const tb = h('<div></div>');
    row.firstChild.addEventListener('click', () => {
      if (!trials.some(t => t.L === L && t.m === m && t.A === A)) trials.push({ L, m, A, t: t10() });
      tb.innerHTML = '<table class="sim-table"><thead><tr><th>擺長</th><th>質量</th><th>擺角</th><th>來回 10 次</th></tr></thead><tbody>' +
        trials.map(t => `<tr><td>${t.L} cm</td><td>${t.m} g</td><td>${t.A}°</td><td><b>${t.t.toFixed(1)} 秒</b></td></tr>`).join('') + '</tbody></table>';
      onChange();
    });
    host.append(row, tb);
    const t0 = performance.now();
    (function tick(now) {
      if (!sv.isConnected) return;
      if (sv.getClientRects().length) {
        const T = 2 * Math.sqrt(L / 100), th = (A * 2.4) * Math.PI / 180 * Math.cos(2 * Math.PI * (now - t0) / 1000 / T);
        const len = 30 + L * 0.85, bx = 180 + len * Math.sin(th), by = 14 + len * Math.cos(th), r = 6 + Math.sqrt(m) * 0.6;
        sv.innerHTML = `<rect x="120" y="6" width="120" height="8" rx="3" fill="var(--line)" ${ST}/>
          <line x1="180" y1="14" x2="180" y2="${14 + len}" stroke="var(--muted)" stroke-dasharray="3 4"/>
          <line x1="180" y1="14" x2="${bx}" y2="${by}" stroke="var(--stroke)" stroke-width="1.5"/>
          <circle cx="${bx}" cy="${by}" r="${r}" fill="#7a8699" ${ST}/>`;
      }
      requestAnimationFrame(tick);
    })(t0);
    const kinds = k => new Set(trials.map(t => t[k])).size;
    return { ok: () => kinds('L') >= 2 && kinds('m') >= 2 && kinds('A') >= 2 };
  }

  /* 小量筒（考題、懂 用）：x 位置、水面 mL、裡面的東西 */
  function miniCyl(x, level, label, balls) {
    const Yv = ml => 130 - ml;   // 1px / mL，底在 y=130
    let s = `<rect x="${x}" y="${Yv(level)}" width="44" height="${level}" fill="var(--water)"/>${balls || ''}
      <path d="M${x} 20 V130 H${x + 44} V20" fill="none" ${ST}/><line x1="${x}" y1="${Yv(level)}" x2="${x + 44}" y2="${Yv(level)}" stroke="var(--water-line)" stroke-width="2"/>
      <text x="${x + 50}" y="${Yv(level) + 4}" class="t12b">${level}</text><text x="${x + 22}" y="148" text-anchor="middle" class="t12">${label}</text>`;
    return s;
  }
  const ball = (cx, cy, r, c) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${c}" ${ST}/>`;

  /* ---------------- 猜 ---------------- */
  function guess(p, api) {
    U.guess(p, api, [
      { pic: c => rulerSvg(c, 5.65),
        q: '這枝鉛筆有多長？哪一個答案最好？',
        options: [{ t: '大約 6 cm' }, { t: '5.6 cm' }, { t: '5.65 cm 左右', ok: true }],
        reveal: '<b>5.65 cm 左右</b>。筆尖超過 5.6、又還沒到 5.7，科學家會再「估」一位，寫成 5.65。' },
      { pic: c => U.svg(c, '0 0 320 150', `<rect x="100" y="6" width="120" height="8" rx="3" fill="var(--line)" ${ST}/>
          <line x1="160" y1="14" x2="110" y2="110" stroke="var(--stroke)" stroke-width="1.5"/><circle cx="110" cy="110" r="9" fill="#7a8699" ${ST}/><text x="92" y="138" text-anchor="middle" class="t12b">輕的球</text>
          <line x1="160" y1="14" x2="210" y2="110" stroke="var(--stroke)" stroke-width="1.5"/><circle cx="210" cy="110" r="16" fill="#7a8699" ${ST}/><text x="228" y="142" text-anchor="middle" class="t12b">重的球</text>`, '一樣長的線，掛輕的球和重的球'),
        q: '線一樣長，一個掛輕的球、一個掛重的球，輕輕拉開再放手。誰來回擺一次比較<b>快</b>？',
        options: [{ t: '重的球比較快' }, { t: '輕的球比較快' }, { t: '一樣快', ok: true }],
        reveal: '<b>一樣快！</b>很多人都猜錯。那到底是什麼決定擺得快或慢？下一步自己試。' }
    ]);
  }

  /* ---------------- 玩 ---------------- */
  function play(p, api) {
    let B, C;
    const tk = U.tasks(p, api, [
      { text: '用尺量鉛筆。先看上面的整把尺，再看下面的放大圖。', quiet: true,
        setup() { a.hidden = false; b.hidden = c.hidden = true; },
        check: () => true,
        qs: () => [{ num: true, q: '鉛筆的長度是多少？（看放大圖：筆尖在哪兩格之間？再估一位）', post: 'cm', range: [3.44, 3.49], answer: 3.47,
            hint: '筆尖超過 3.4、還沒到 3.5。那大概是 3.4 幾？',
            diag: [{ v: 3.4, msg: '3.4 只讀到最小的格子。筆尖還超出一點，請<b>再估一位</b>，例如 3.4□。' }, { v: 3.5, msg: '筆尖還沒到 3.5 喔。是 3.4 多一點，請再估一位，例如 3.4□。' }],
            why: '寫 3.46、3.47、3.48 都算對，因為最後一位是「估」的。' },
          { q: '3.47 cm 裡面，哪一個數字是<b>估計</b>出來的？',
            options: [{ t: '最後面的 7', ok: true, why: '3.4 是尺上真的看得到的（準確值），7 是用眼睛估的（估計值）。' }, { t: '中間的 4', why: '3.4 那一格在尺上有刻度，是確定的。' }, { t: '最前面的 3', why: '3 公分是確定的。' }] }] },
      { text: '用天平秤出紫色方塊的質量：點砝碼放到右盤，直到<b>平衡</b>。',
        setup() { b.hidden = false; a.hidden = c.hidden = true; },
        check: () => B.ok(),
        qs: () => [{ q: '平衡時右盤是 50＋10＋5＋2＋1。紫色方塊的質量是多少？',
            options: [{ t: '68 g', ok: true, why: '平衡時，左盤物體的質量＝右盤砝碼的總和。' }, { t: '50 g', why: '要把右盤<b>全部</b>的砝碼加起來。' }, { t: '5 個', why: '我們要的是質量（幾公克），不是砝碼有幾個。' }] },
          { q: '真的在實驗室時，砝碼要怎麼拿？',
            options: [{ t: '用砝碼夾（鑷子）夾', ok: true, why: '手上有汗和油，會讓砝碼生鏽、質量改變，以後就秤不準了。' }, { t: '直接用手拿比較快', why: '手汗會讓砝碼生鏽變重。' }] }] },
      { text: '單擺：<b>擺長、質量、擺角</b>三樣，每一樣至少換一次，每次都按「⏱ 計時」。',
        setup() { c.hidden = false; a.hidden = b.hidden = true; },
        check: () => C.ok(),
        qs: () => [{ q: '看你的紀錄表。哪一樣改了以後，來回 10 次的時間<b>真的變了</b>？', hint: '比較表格裡只有一樣不同的兩列。',
            options: [{ t: '擺長', ok: true, why: '線越長，擺得越慢。質量和擺角（小角度時）都不影響。這叫做<b>擺的等時性</b>。' }, { t: '擺錘質量', why: '找兩列擺長一樣、質量不同的，時間有變嗎？' }, { t: '擺角', why: '找兩列擺長一樣、擺角不同的，時間有變嗎？' }] }] }
    ]);
    const card = h('<div class="card"></div>'); p.appendChild(card);
    const a = h('<div></div>'), b = h('<div hidden></div>'), c = h('<div hidden></div>');
    card.append(a, b, c, tk.slot);
    rulerSvg(a, 3.47);
    B = balanceSim(b, () => tk.check());
    C = pendulumSim(c, () => tk.check());
    tk.start();
  }

  /* ---------------- 懂 ---------------- */
  function know(p, api) {
    p.appendChild(h('<p class="muted">把剛剛玩到的，收成 4 句話。</p>'));
    rulerSvg(U.card(p, '① 測量＝數字＋單位，而且要多估一位',
      '<p>先讀到<b>最小的格子</b>（準確值），再用眼睛<b>估一位</b>（估計值）。</p><p>例：5.6 是準確值，最後的 5 是估計值 → 5.65 cm。<br>只寫「5.65」沒有單位，等於沒量。</p>'), 5.65);
    U.svg(U.card(p, '② 天平：先歸零，左物右碼，用砝碼夾',
      '<p>秤之前先<b>歸零</b>（指針在正中央）。<br>物體放<b>左</b>盤，砝碼放<b>右</b>盤，從<b>大</b>的砝碼開始試。<br>砝碼用<b>砝碼夾</b>拿。平衡時：物體質量＝砝碼總和。</p>'),
      '0 0 320 120', `<path d="M150 104 L160 30 L170 104Z" fill="var(--line)" ${ST}/><line x1="60" y1="30" x2="260" y2="30" stroke="var(--stroke)" stroke-width="4"/>
        <rect x="30" y="54" width="60" height="5" fill="var(--card)" ${ST}/><line x1="60" y1="30" x2="60" y2="54" stroke="var(--stroke)"/><rect x="46" y="30" width="28" height="24" rx="4" fill="#b9a7e8" ${ST}/>
        <rect x="230" y="54" width="60" height="5" fill="var(--card)" ${ST}/><line x1="260" y1="30" x2="260" y2="54" stroke="var(--stroke)"/><rect x="246" y="34" width="10" height="20" fill="#c9a063" ${ST}/><rect x="260" y="40" width="10" height="14" fill="#c9a063" ${ST}/>
        <text x="60" y="78" text-anchor="middle" class="t12b">物體（左）</text><text x="260" y="78" text-anchor="middle" class="t12b">砝碼（右）</text>`, '平衡的天平');
    U.svg(U.card(p, '③ 單擺擺得快或慢，只看擺長',
      '<p>線越<b>長</b>，來回一次的時間越<b>久</b>。<br>換重一點的球、拉開大一點（小角度內），時間都<b>不變</b>。</p><p class="small muted">所以以前的人用單擺來做時鐘。擺長變成 4 倍，時間才會變 2 倍。</p>'),
      '0 0 320 150', `<rect x="40" y="6" width="240" height="8" rx="3" fill="var(--line)" ${ST}/>
        <line x1="100" y1="14" x2="86" y2="60" stroke="var(--stroke)"/><circle cx="86" cy="60" r="9" fill="#7a8699" ${ST}/><text x="92" y="88" text-anchor="middle" class="t12b">25 cm：1 秒</text>
        <line x1="220" y1="14" x2="196" y2="118" stroke="var(--stroke)"/><circle cx="196" cy="118" r="9" fill="#7a8699" ${ST}/><text x="230" y="144" text-anchor="middle" class="t12b">100 cm：2 秒</text>`, '短的擺和長的擺');
    U.svg(U.card(p, '④ 體積：算得出來就算，算不出來就排水',
      '<p>方方正正的 → 長×寬×高。<br>形狀不規則的 → 放進量筒，<b>水面上升多少，體積就是多少</b>（排水法）。1 mL＝1 cm³。</p><p class="small muted">每次量都會有一點點誤差，多量幾次取平均會更準。</p>'),
      '0 0 320 156', miniCyl(60, 50, '放進去以前') + miniCyl(190, 62, '放進去以後', ball(212, 118, 11, '#a9a397')), '排水法');
    const c = h('<div class="card"><h3>✏️ 算一題看看</h3></div>'); p.appendChild(c);
    U.svg(c, '0 0 320 156', miniCyl(60, 50, '放進去以前') + miniCyl(190, 62, '放進去以後', ball(212, 118, 11, '#a9a397')), '水面從 50 升到 62');
    U.numq(c, { q: '量筒原本的水面在 <b>50 mL</b>，放進一顆小石頭後變成 <b>62 mL</b>。石頭的體積是多少？', post: 'cm³', answer: 12,
      hint: '水面上升了多少？', diag: [{ v: 62, msg: '62 是「水＋石頭」。要扣掉原本的水 50。' }, { v: 112, msg: '不是相加，是看水面<b>上升</b>了多少：62－50。' }],
      why: '62－50＝12 mL，也就是 12 cm³。', onDone() { api.done(); } });
  }

  /* ---------------- 考 ---------------- */
  function exam(p, api) {
    U.exam(p, api, {
      benchLabel: '想試試看？打開單擺實驗（第 3 題用得到）',
      bench: host => pendulumSim(host, () => {}),
      qs: [
        { src: '改寫自 110 年會考',
          q: '下列哪一項使用上皿天平的<b>做法和原因</b>都正確？',
          hint: '想想剛剛天平任務最後的問題。',
          options: [
            { t: '用手拿砝碼，因為這樣比較快', why: '手上的汗和油會讓砝碼生鏽。' },
            { t: '用砝碼夾拿砝碼，避免手汗讓砝碼生鏽、質量改變', ok: true, why: '砝碼的質量一變，以後秤出來的結果就都不準了。' },
            { t: '不用先歸零，因為放上物體後指針自己會動', why: '一開始如果不是平衡的，秤出來一定有誤差，所以要先歸零。' },
            { t: '物體和砝碼放在同一個盤子上，比較好比較', why: '天平是「兩邊」比輕重，要一邊放物體、一邊放砝碼。' }] },
        { src: '改寫自 108 年會考',
          pic: c => U.svg(c, '0 0 340 160', miniCyl(20, 50, '① 只有水') +
            miniCyl(130, 85, '② 兩顆都沉入', ball(152, 100, 12, '#f3a3a3') + ball(152, 121, 8, '#7a8699') + '<line x1="152" y1="112" x2="152" y2="113" stroke="var(--stroke)"/>') +
            miniCyl(240, 60, '③ 只有金屬球', ball(262, 121, 8, '#7a8699')), '三個量筒：50、85、60'),
          q: '小玉想量一顆<b>會浮起來的塑膠球</b>（紅色）的體積。她用細繩把塑膠球和一顆金屬球綁在一起，讓兩顆都沉下去（圖②），再單獨放金屬球（圖③）。塑膠球的體積是多少？',
          hint: '圖②是「水＋塑膠球＋金屬球」，圖③是「水＋金屬球」。兩個差在哪？',
          options: [
            { t: '25 cm³（85－60）', ok: true, why: '②和③只差一顆塑膠球，所以相減就是塑膠球的體積。' },
            { t: '35 cm³（85－50）', why: '85－50 是「塑膠球＋金屬球」兩顆合起來的體積。' },
            { t: '10 cm³（60－50）', why: '60－50 是金屬球的體積。' },
            { t: '85 cm³', why: '85 是水和兩顆球全部加起來的讀數。' }] },
        { src: '挑戰題・改寫自 107 年會考',
          pic: c => c.appendChild(h(`<table class="sim-table" style="max-width:360px"><thead><tr><th>組別</th><th>擺長</th><th>擺錘質量</th><th>來回 10 次</th></tr></thead>
            <tbody><tr><td>甲</td><td>25.0 cm</td><td>50 g</td><td>10.0 秒</td></tr><tr><td>乙</td><td>25.0 cm</td><td>100 g</td><td>10.0 秒</td></tr><tr><td>丙</td><td>🐛 被蟲蛀掉</td><td>50 g</td><td>20.0 秒</td></tr></tbody></table>`)),
          q: '小花找到一張舊的單擺實驗紀錄，有一格被蟲蛀掉了。丙組的擺長最可能是多少？',
          hint: '打開上面的單擺實驗，每種擺長都按一次計時，看哪一個是 20.0 秒。',
          options: [
            { t: '25.0 cm', why: '25 cm 的是 10.0 秒（看甲、乙）。' },
            { t: '50.0 cm', why: '擺長變 2 倍，時間不會剛好變 2 倍。用實驗台試試 50 cm。' },
            { t: '100.0 cm', ok: true, why: '擺長要變成 <b>4 倍</b>，時間才會變 2 倍。25 cm 的 4 倍是 100 cm。' },
            { t: '200.0 cm', why: '用實驗台試試 200 cm，會超過 20 秒。' }] }
      ]
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    U.mount(document.getElementById('unit'), { unit: 'sci8a-1-2', home: 'index.html', steps: [
      { id: 'guess', label: '猜', title: '先猜猜看：量得準嗎？', render: guess },
      { id: 'play', label: '玩', title: '動手玩：尺、天平、單擺', render: play },
      { id: 'know', label: '懂', title: '收成 4 句話', render: know },
      { id: 'exam', label: '考', title: '會考真的這樣考', render: exam }
    ] });
  });
})();
