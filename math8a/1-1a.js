/* ===== 數學 1-1a 和的平方、差的平方 ===== */
(function () {
  'use strict';
  const U = Unit4, h = U.h, K = MK, M = K.M, X2 = K.X2, ST = K.ST;
  const sq = s => `${s}<sup>2</sup>`;

  /* 邊長 a + b 的大正方形切成四塊；差的模式：a × a 的正方形扣掉兩條 b 寬的長條 */
  function sqSvg(a, b, mode) {
    const u = Math.min(22, 230 / (mode === 'sum' ? a + b : a)), x0 = 34, y0 = 26, A = a * u, B = b * u;
    const c = ['#f6c26b', '#9fd3a8', '#c9b8f0'];
    if (mode === 'sum') {
      return { vb: `0 0 ${x0 + A + B + 20} ${y0 + A + B + 14}`, inner: `
        <text x="${x0 + A / 2}" y="16" text-anchor="middle" class="t14b">${a}</text><text x="${x0 + A + B / 2}" y="16" text-anchor="middle" class="t14b">${b}</text>
        <text x="${x0 - 12}" y="${y0 + A / 2 + 5}" text-anchor="middle" class="t14b">${a}</text><text x="${x0 - 12}" y="${y0 + A + B / 2 + 5}" text-anchor="middle" class="t14b">${b}</text>
        <rect x="${x0}" y="${y0}" width="${A}" height="${A}" fill="${c[0]}" fill-opacity=".6" ${ST}/><text x="${x0 + A / 2}" y="${y0 + A / 2 + 5}" text-anchor="middle" class="t14b">${a}²＝${a * a}</text>
        <rect x="${x0 + A}" y="${y0}" width="${B}" height="${A}" fill="${c[1]}" fill-opacity=".6" ${ST}/><text x="${x0 + A + B / 2}" y="${y0 + A / 2 + 5}" text-anchor="middle" class="t12b">${a * b}</text>
        <rect x="${x0}" y="${y0 + A}" width="${A}" height="${B}" fill="${c[1]}" fill-opacity=".6" ${ST}/><text x="${x0 + A / 2}" y="${y0 + A + B / 2 + 5}" text-anchor="middle" class="t12b">${a}×${b}＝${a * b}</text>
        <rect x="${x0 + A}" y="${y0 + A}" width="${B}" height="${B}" fill="${c[2]}" fill-opacity=".6" ${ST}/><text x="${x0 + A + B / 2}" y="${y0 + A + B / 2 + 5}" text-anchor="middle" class="t12b">${b * b}</text>` };
    }
    const d = A - B;
    return { vb: `0 0 ${x0 + A + 20} ${y0 + A + 14}`, inner: `
      <text x="${x0 + d / 2}" y="16" text-anchor="middle" class="t14b">${a}−${b}</text><text x="${x0 + d + B / 2}" y="16" text-anchor="middle" class="t14b" style="fill:${K.NEG}">${b}</text>
      <text x="${x0 - 14}" y="${y0 + d / 2 + 5}" text-anchor="middle" class="t12b">${a}−${b}</text><text x="${x0 - 12}" y="${y0 + d + B / 2 + 5}" text-anchor="middle" class="t14b" style="fill:${K.NEG}">${b}</text>
      <rect x="${x0}" y="${y0}" width="${d}" height="${d}" fill="${c[0]}" fill-opacity=".7" ${ST}/><text x="${x0 + d / 2}" y="${y0 + d / 2 + 5}" text-anchor="middle" class="t14b">(${a}−${b})²</text>
      <rect x="${x0 + d}" y="${y0}" width="${B}" height="${A}" fill="none" stroke="${K.NEG}" stroke-width="1.5" stroke-dasharray="5 3"/>
      <rect x="${x0}" y="${y0 + d}" width="${A}" height="${B}" fill="none" stroke="${K.NEG}" stroke-width="1.5" stroke-dasharray="5 3"/>
      <rect x="${x0 + d}" y="${y0 + d}" width="${B}" height="${B}" fill="${c[2]}" fill-opacity=".7" ${ST}/><text x="${x0 + d + B / 2}" y="${y0 + d + B / 2 + 5}" text-anchor="middle" class="t12b">${b * b}</text>
      <rect x="${x0}" y="${y0}" width="${A}" height="${A}" fill="none" stroke="var(--ink)" stroke-width="2"/>` };
  }
  function sqPic(host, a, b, mode, cls) { const s = sqSvg(a, b, mode); const sv = U.svg(host, s.vb, s.inner, mode === 'sum' ? '和的平方' : '差的平方', cls || 'u4-pic'); sv.style.maxWidth = '290px'; return sv; }

  function sqSim(host, on) {
    host.appendChild(h('<p class="sim-h">大正方形切成四塊，面積怎麼算？</p>'));
    const pic = h('<div></div>'), read = h('<div class="sim-read"></div>');
    let a = 5, b = 2, mode = 'sum', sb;
    function draw() {
      pic.innerHTML = ''; sqPic(pic, a, b, mode, 'sim');
      if (mode === 'sum') read.innerHTML = `(${a} + ${b})² ＝ ${a + b}² ＝ <b>${(a + b) * (a + b)}</b><br>四塊加起來：${a * a} ＋ ${a * b} ＋ ${a * b} ＋ ${b * b} ＝ <b>${a * a + 2 * a * b + b * b}</b>　✔ 一樣`;
      else read.innerHTML = `(${a} − ${b})² ＝ ${a - b}² ＝ <b>${(a - b) * (a - b)}</b><br>大正方形 ${a * a}，扣掉兩條長條各 ${a * b}，右下角 ${b * b} 被扣了<b>兩次</b>要補回：<br>${a * a} − ${a * b} − ${a * b} ＋ ${b * b} ＝ <b>${a * a - 2 * a * b + b * b}</b>　✔ 一樣`;
    }
    const ch = U.chips(host, '模式', [{ v: 'sum', t: '和的平方 (a + b)²' }, { v: 'diff', t: '差的平方 (a − b)²' }], mode, v => { mode = v; fix(); draw(); on(); });
    host.appendChild(pic);
    function fix() { if (mode === 'diff' && b >= a) { b = a - 1; sb.set(b); } }
    U.slider(host, 'a', { min: 2, max: 9, step: 1, value: a }, v => { a = v; fix(); draw(); on(); });
    sb = U.slider(host, 'b', { min: 1, max: 6, step: 1, value: b }, v => { b = v; fix(); if (b !== v) sb.set(b); draw(); on(); });
    host.appendChild(read); draw();
    return { get a() { return a; }, get b() { return b; }, get mode() { return mode; }, setMode(m) { mode = m; ch.set(m); fix(); draw(); } };
  }

  function guess(p, api) {
    U.guess(p, api, [
      { q: '(2 + 3)² 和 2² + 3² 一樣大嗎？', options: [{ t: '一樣大' }, { t: '(2 + 3)² 比較大', ok: true }, { t: '2² + 3² 比較大' }],
        reveal: '(2 + 3)² ＝ 25，2² + 3² ＝ 13。差了 12，這 12 跑去哪裡了？下一步用圖找出來。' },
      { q: '21²，不用直式，猜猜是多少？', options: [{ t: '401' }, { t: '441', ok: true }, { t: '421' }],
        reveal: '21² ＝ (20 + 1)² ＝ 400 ＋ 40 ＋ 1 ＝ <b>441</b>。中間那個 40 就是剛剛「不見的部分」。' }
    ]);
  }

  function play(p, api) {
    let S;
    const card = h('<div class="card"></div>'); p.appendChild(card);
    const tk = U.tasks(p, api, [
      { text: '在「和的平方」模式，把 a 調成 <b>7</b>、b 調成 <b>3</b>。', setup() { S.setMode('sum'); }, check: () => S.mode === 'sum' && S.a === 7 && S.b === 3,
        qs: () => [{ q: '四塊裡，哪兩塊一模一樣？', options: [{ t: '兩個綠色長方形，都是 7 × 3 ＝ 21', ok: true, why: '一條在右邊、一條在下面，所以中間要算<b>兩次</b> ab。' }, { t: '黃色和紫色', why: '黃色是 7 × 7，紫色是 3 × 3，不一樣大。' }] },
          { num: true, q: '(7 + 3)² ＝ 49 ＋ 21 ＋ 21 ＋ 9 ＝ ？', pre: '＝', answer: 100, why: '10² ＝ 100 ✔' }],
        found: `<b>和的平方</b>：${M(sq('(a + b)') + ' ＝ ' + sq('a') + ' + 2ab + ' + sq('b'))}。只算 a² + b² 會漏掉兩個綠色長方形。` },
      { text: '換成「差的平方」模式，a 調成 <b>8</b>、b 調成 <b>3</b>。', check: () => S.mode === 'diff' && S.a === 8 && S.b === 3,
        qs: () => [{ q: '大正方形扣掉兩條長條時，右下角那塊紫色怎麼了？', options: [{ t: '被扣了兩次，要加回來一次', ok: true, why: '右邊長條和下面長條都包含它。' }, { t: '沒有被扣到', why: '紅色虛線框的兩條都蓋住了右下角。' }] },
          { num: true, q: '(8 − 3)² ＝ 64 − 24 − 24 ＋ 9 ＝ ？', pre: '＝', answer: 25, diag: [{ v: 7, msg: '最後是 ＋9，不是 −9。' }], why: '5² ＝ 25 ✔' }],
        found: `<b>差的平方</b>：${M(sq('(a − b)') + ' ＝ ' + sq('a') + ' − 2ab + ' + sq('b'))}。最後一項 b² 是<b>加</b>的。` },
      { text: '用公式心算（不用模擬了）。', quiet: true, check: () => true,
        qs: () => [
          { num: true, q: '51² ＝ (50 + 1)² ＝ 2500 ＋ 2 × 50 × 1 ＋ 1 ＝ ？', pre: '＝', answer: 2601, diag: [{ v: 2501, msg: '漏掉中間的 2 × 50 × 1 ＝ 100。' }, { v: 2551, msg: '中間是 2 × 50 × 1 ＝ 100，不是 50。' }] },
          { num: true, q: '99² ＝ (100 − 1)² ＝ 10000 − 200 ＋ 1 ＝ ？', pre: '＝', answer: 9801, diag: [{ v: 9799, msg: '最後是 ＋1。' }, { v: 9999, msg: '漏掉中間的 −2 × 100 × 1。' }] },
          { q: `換成字母：${M(sq('(x + 4)'))} ＝ ？`, options: [{ t: `${X2} + 8x + 16`, ok: true, why: 'a ＝ x、b ＝ 4：x² ＋ 2·x·4 ＋ 4²。' }, { t: `${X2} + 16`, why: '少了中間的 2 × x × 4 ＝ 8x。' }, { t: `${X2} + 4x + 16`, why: '中間是 2 × x × 4，要乘 2。' }] }],
        found: '湊成「整十、整百」再用公式，心算超快；字母也一樣用。' }
    ]);
    S = sqSim(card, () => tk.check());
    card.appendChild(tk.slot); p.insertBefore(p.querySelector('.u4-task'), card); tk.start();
  }

  function know(p, api) {
    p.appendChild(h('<p class="muted">把剛剛玩到的，收成 4 句話。</p>'));
    sqPic(U.card(p, '① 和的平方', `<p>${M(sq('(a + b)') + ' ＝ ' + sq('a') + ' + 2ab + ' + sq('b'))}</p><p>大正方形 ＝ 黃 ＋ 兩塊綠 ＋ 紫。</p>`), 5, 2, 'sum');
    sqPic(U.card(p, '② 差的平方', `<p>${M(sq('(a − b)') + ' ＝ ' + sq('a') + ' − 2ab + ' + sq('b'))}</p><p>扣兩條長條，右下角扣了兩次，加回來一次。</p>`), 6, 2, 'diff');
    K.table(U.card(p, '③ 心算：湊整數', '<p>把數字拆成「整十整百 ± 一點點」。</p>'), ['算式', '拆成', '結果'], [['102²', '(100 + 2)²', '10000 + 400 + 4 ＝ 10404'], ['98²', '(100 − 2)²', '10000 − 400 + 4 ＝ 9604'], ['(2x + 3)²', 'a ＝ 2x、b ＝ 3', '4x² + 12x + 9']], 420);
    sqPic(U.card(p, '④ 最常見的錯', `<p>${M(sq('(a + b)'))} <b>不等於</b> ${M(sq('a') + ' + ' + sq('b'))}</p><p>例：(5 + 2)² ＝ 49，5² + 2² ＝ 29，差的 20 就是兩塊綠色 2 × 5 × 2。</p>`), 5, 2, 'sum');
    const c = h('<div class="card"><h3>✏️ 檢查一下</h3></div>'); p.appendChild(c);
    U.numq(c, { q: '49² ＝ (50 − 1)² ＝ ？', pre: '＝', answer: 2401, hint: '2500 − 2 × 50 × 1 ＋ 1。', diag: [{ v: 2499, msg: '最後一項 1² 是加的。' }, { v: 2501, msg: '中間要減 2 × 50 × 1 ＝ 100。' }], why: '2500 − 100 ＋ 1 ＝ 2401', onDone() { api.done(); } });
  }

  function exam(p, api) {
    U.exam(p, api, {
      intro: '這兩題是照會考題的樣子改寫的，數字比較好算。答錯可以再選。',
      benchLabel: '想驗算？打開正方形模擬',
      bench: host => sqSim(host, () => {}),
      qs: [
        { src: '改寫自 110 年會考第 8 題', q: '利用乘法公式判斷，下列哪一個等式成立？', hint: '和的平方：中間要「2 ×」。',
          options: [{ t: '38² + 38 × 2 + 2² ＝ 40²', why: '中間少了 2 倍：應該是 2 × 38 × 2。' }, { t: '38² + 2 × 38 × 2 + 2² ＝ 40²', ok: true, why: '(38 + 2)² ＝ 38² ＋ 2 × 38 × 2 ＋ 2² ＝ 40² ✔' }, { t: '38² + 2² ＝ 40²', why: '(a + b)² 不等於 a² + b²。' }, { t: '38² − 2 × 38 × 2 + 2² ＝ 40²', why: '這是 (38 − 2)² ＝ 36²。' }] },
        { src: '改寫自 106 年會考第 17 題', q: '3 × 5 ＋ 1 ＝ 16 ＝ 4²；5 × 7 ＋ 1 ＝ 36 ＝ 6²。若 a、b 兩數相差 2，那麼 ab ＋ 1 一定是什麼？', hint: '設 a ＝ n − 1、b ＝ n ＋ 1 試試看。',
          options: [{ t: '兩數中間那個數的平方', ok: true, why: '(n − 1)(n + 1) ＋ 1 ＝ n² − 1 ＋ 1 ＝ n²。3、5 中間是 4，5、7 中間是 6。' }, { t: '比較大的數的平方', why: '5 × 7 ＋ 1 ＝ 36 ＝ 6²，不是 7²。' }, { t: '一定是奇數', why: '36 是偶數。' }, { t: '(a + b) 的平方', why: '3 ＋ 5 ＝ 8，8² ＝ 64，不是 16。' }] }
      ]
    });
  }

  function real(p, api) {
    U.real(p, api, [
      { stars: 1, src: K.SIM, q: `計算 ${M(sq('(2x − 3)'))} 的結果，與下列哪一個式子相同？`,
        options: [{ t: `4${X2} − 9`, why: '少了中間的 −2 × 2x × 3。' }, { t: `4${X2} − 6x + 9`, why: '中間是 2 × 2x × 3 ＝ 12x。' }, { t: `4${X2} − 12x + 9`, ok: true, why: 'a ＝ 2x、b ＝ 3：4x² − 12x ＋ 9。' }, { t: `4${X2} − 12x − 9`, why: '最後一項 b² ＝ 9 是加的。' }],
        explain: '<p>差的平方 (a − b)² ＝ a² − 2ab ＋ b²，a ＝ 2x、b ＝ 3：<br>(2x)² − 2 × 2x × 3 ＋ 3² ＝ 4x² − 12x ＋ 9。答案 (C)。</p>',
        steps: [
          { q: '(2x − 3)²，a 和 b 各是什麼？', options: [{ t: 'a ＝ 2x、b ＝ 3', ok: true, why: '套 (a − b)²。' }, { t: 'a ＝ 2、b ＝ 3', why: 'a 要把 x 一起帶著：2x。' }] },
          { q: 'a² ＝ (2x)² ＝ ？', options: [{ t: `4${X2}`, ok: true, why: '2² ＝ 4，x² 照抄。' }, { t: `2${X2}`, why: '係數 2 也要平方。' }] },
          { num: true, q: '中間項 −2ab ＝ −2 × 2x × 3 ＝ □x', pre: '□ ＝', answer: -12, signed: true, diag: [{ v: 12, msg: '差的平方中間是減。' }, { v: -6, msg: '要乘 2：2 × 2 × 3。' }] }
        ] },
      { stars: 2, src: '110 年會考 第 8 題', q: '利用乘法公式判斷，下列等式何者成立？',
        options: [{ t: '248² + 248 × 52 + 52² ＝ 300²', why: '中間少了「2 ×」。' }, { t: '248² − 248 × 48 − 48² ＝ 200²', why: '差的平方是 a² − 2ab ＋ b²，最後是加。' }, { t: '248² + 2 × 248 × 52 + 52² ＝ 300²', ok: true, why: '(248 + 52)² ＝ 300² ✔' }, { t: '248² − 2 × 248 × 48 − 48² ＝ 200²', why: '最後一項應該是 ＋48²。' }],
        explain: '<p>和的平方：(a + b)² ＝ a² ＋ 2ab ＋ b²。a ＝ 248、b ＝ 52，a ＋ b ＝ 300，所以 248² ＋ 2 × 248 × 52 ＋ 52² ＝ 300²。答案 (C)。</p>',
        steps: [
          { q: '248 ＋ 52 ＝ 300。(248 + 52)² 展開，中間那一項是？', options: [{ t: '2 × 248 × 52', ok: true, why: '中間是 2ab。' }, { t: '248 × 52', why: '要乘 2：兩塊綠色長方形。' }] },
          { q: '差的平方 (248 − 48)² 展開，最後一項是？', options: [{ t: '＋48²', ok: true, why: '(a − b)² ＝ a² − 2ab ＋ b²，b² 永遠是加。' }, { t: '−48²', why: '右下角被扣兩次，要加回來，所以是 ＋。' }] }
        ] },
      { stars: 3, src: '106 年會考 第 17 題', q: '若 a、b 為兩質數且相差 2，則 ab ＋ 1 之值可能為下列何者？',
        options: [{ t: '39²', why: '39² ＝ (38)(40) ＋ 1，但 38、40 不是質數。' }, { t: '40²', why: '40² ＝ 39 × 41 ＋ 1，39 ＝ 3 × 13 不是質數。' }, { t: '41²', why: '41² ＝ 40 × 42 ＋ 1，40、42 都不是質數。' }, { t: '42²', ok: true, why: '42² ＝ 41 × 43 ＋ 1，41、43 都是質數 ✔' }],
        explain: '<p>設兩數為 n − 1、n ＋ 1，則 ab ＋ 1 ＝ (n − 1)(n + 1) ＋ 1 ＝ n² − 1 ＋ 1 ＝ n²。<br>所以只要找「n − 1 和 n ＋ 1 都是質數」的 n：39 → 38、40 ✘；40 → 39、41 ✘（39 ＝ 3 × 13）；41 → 40、42 ✘；42 → 41、43 ✔。答案 (D)。</p>',
        steps: [
          { q: '先試小的：3 和 5 是相差 2 的質數，3 × 5 ＋ 1 ＝ ？', options: [{ t: '16 ＝ 4²', ok: true, why: '4 就是 3 和 5 中間那個數。' }, { t: '15', why: '還要 ＋1。' }] },
          { q: '如果 ab ＋ 1 ＝ 42²，a、b 是哪兩個數？', options: [{ t: '41 和 43', ok: true, why: '42 的前後各一個。' }, { t: '40 和 44', why: '相差 2，是 42 − 1 和 42 ＋ 1。' }] },
          { q: '41、43 都是質數嗎？', options: [{ t: '都是', ok: true, why: '都只有 1 和自己兩個因數。所以選 42²。' }, { t: '43 不是', why: '43 不能被 2、3、5 整除（7² ＝ 49 > 43），是質數。' }] }
        ] }
    ]);
  }

  K.run('1-1a', ['先猜猜看：(a + b)² 是 a² + b² 嗎？', '動手玩：大正方形切四塊', '收成 4 句話', '會考題改寫版', '會考實戰：照原題做做看'], { guess, play, know, exam, real });
})();
