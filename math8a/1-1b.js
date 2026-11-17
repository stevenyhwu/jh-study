/* ===== 數學 1-1b 平方差公式 ===== */
(function () {
  'use strict';
  const U = Unit4, h = U.h, K = MK, M = K.M, X2 = K.X2, ST = K.ST;
  const sq = s => `${s}<sup>2</sup>`;

  function diffSvg(a, b) {
    const u = Math.min(13, 120 / a), x0 = 40, y0 = 22, d = a - b, y1 = y0 + a * u + 46;
    const c1 = '#f6c26b', c2 = '#9fd3a8';
    return { vb: `0 0 300 ${y1 + d * u + 26}`, inner: `
      <rect x="${x0}" y="${y0}" width="${d * u}" height="${a * u}" fill="${c1}" fill-opacity=".65" ${ST}/>
      <rect x="${x0 + d * u}" y="${y0 + b * u}" width="${b * u}" height="${d * u}" fill="${c2}" fill-opacity=".65" ${ST}/>
      <rect x="${x0 + d * u}" y="${y0}" width="${b * u}" height="${b * u}" fill="none" stroke="${K.NEG}" stroke-width="1.5" stroke-dasharray="5 3"/>
      <text x="${x0 + d * u + b * u / 2}" y="${y0 + b * u / 2 + 4}" text-anchor="middle" class="t12" style="fill:${K.NEG}">剪掉</text>
      <text x="${x0 + a * u / 2}" y="14" text-anchor="middle" class="t12b">${a}</text><text x="${x0 - 10}" y="${y0 + a * u / 2 + 4}" text-anchor="middle" class="t12b">${a}</text>
      <text x="${x0 + a * u + 10}" y="${y0 + a * u / 2}" class="t12">${a}² − ${b}²</text>
      <text x="${x0}" y="${y1 - 22}" class="t12b">↓ 綠色那塊轉過來接在旁邊</text>
      <rect x="${x0}" y="${y1}" width="${a * u}" height="${d * u}" fill="${c1}" fill-opacity=".65" ${ST}/>
      <rect x="${x0 + a * u}" y="${y1}" width="${b * u}" height="${d * u}" fill="${c2}" fill-opacity=".65" ${ST}/>
      <text x="${x0 + (a + b) * u / 2}" y="${y1 - 5}" text-anchor="middle" class="t12b">${a} + ${b}</text>
      <text x="${x0 - 6}" y="${y1 + d * u / 2 + 4}" text-anchor="end" class="t12b">${a}−${b}</text>
      <text x="${x0}" y="${y1 + d * u + 18}" class="t12">長方形：(${a} + ${b}) × (${a} − ${b})</text>` };
  }
  function diffPic(host, a, b, cls) { const s = diffSvg(a, b); const sv = U.svg(host, s.vb, s.inner, '平方差', cls || 'u4-pic'); sv.style.maxWidth = '300px'; return sv; }
  function diffSim(host, on) {
    host.appendChild(h('<p class="sim-h">大正方形剪掉一個小正方形，剩下的拼成長方形</p>'));
    const pic = h('<div></div>'), read = h('<div class="sim-read"></div>');
    let a = 6, b = 2, sb;
    function draw() {
      pic.innerHTML = ''; diffPic(pic, a, b, 'sim');
      read.innerHTML = `${a}² − ${b}² ＝ ${a * a} − ${b * b} ＝ <b>${a * a - b * b}</b><br>(${a} + ${b}) × (${a} − ${b}) ＝ ${a + b} × ${a - b} ＝ <b>${(a + b) * (a - b)}</b>　✔ 一樣大`;
    }
    host.appendChild(pic);
    U.slider(host, '大正方形邊長 a', { min: 3, max: 9, step: 1, value: a }, v => { a = v; if (b >= a) { b = a - 1; sb.set(b); } draw(); on(); });
    sb = U.slider(host, '剪掉的小正方形邊長 b', { min: 1, max: 8, step: 1, value: b }, v => { b = Math.min(v, a - 1); if (b !== v) sb.set(b); draw(); on(); });
    host.appendChild(read); draw();
    return { get a() { return a; }, get b() { return b; } };
  }

  function guess(p, api) {
    U.guess(p, api, [
      { q: '21 × 19，猜猜看最接近哪一個？', options: [{ t: '399', ok: true }, { t: '400' }, { t: '401' }],
        reveal: '21 × 19 ＝ (20 + 1)(20 − 1) ＝ 400 − 1 ＝ <b>399</b>。比 20² 少一點點。' },
      { q: '那 22 × 18 呢？', options: [{ t: '400' }, { t: '396', ok: true }, { t: '398' }],
        reveal: '22 × 18 ＝ (20 + 2)(20 − 2) ＝ 400 − 4 ＝ <b>396</b>。少的剛好是 2²。下一步用圖看為什麼。' }
    ]);
  }

  function play(p, api) {
    let S;
    const card = h('<div class="card"></div>'); p.appendChild(card);
    const tk = U.tasks(p, api, [
      { text: '把 a 調成 <b>7</b>、b 調成 <b>3</b>。', check: () => S.a === 7 && S.b === 3,
        qs: () => [{ q: '下面拼好的長方形，長和寬是多少？', options: [{ t: '長 7 + 3 ＝ 10，寬 7 − 3 ＝ 4', ok: true, why: '綠色那塊接過去，長度多了 b；寬是剪剩的 a − b。' }, { t: '長 7，寬 3', why: '看下面的長方形：上面標 7 + 3。' }] }],
        found: `<b>平方差</b>：${M(sq('a') + ' − ' + sq('b') + ' ＝ (a + b)(a − b)')}` },
      { text: '調成 a ＝ <b>9</b>、b ＝ <b>1</b>。', check: () => S.a === 9 && S.b === 1,
        qs: () => [{ num: true, q: '(9 + 1)(9 − 1) ＝ 10 × 8 ＝ ？ 跟 9² − 1² 一樣嗎？', pre: '＝', answer: 80, why: '81 − 1 ＝ 80 ✔' }],
        found: '反過來看：<b>(和) × (差) ＝ 平方 − 平方</b>。兩個數「一大一小、離中間一樣遠」就能用。' },
      { text: '用平方差心算（不用模擬了）。', quiet: true, check: () => true,
        qs: () => [
          { num: true, q: '52 × 48 ＝ (50 + 2)(50 − 2) ＝ ？', pre: '＝', answer: 2496, diag: [{ v: 2504, msg: '是 50² − 2²，減的。' }, { v: 2500, msg: '還要減 2² ＝ 4。' }] },
          { num: true, q: '65² − 35² ＝ (65 + 35)(65 − 35) ＝ ？', pre: '＝', answer: 3000, hint: '100 × 30。' },
          { q: `換成字母：${M('(x + 5)(x − 5)')} ＝ ？`, options: [{ t: `${X2} − 25`, ok: true, why: 'a ＝ x、b ＝ 5：x² − 5²。' }, { t: `${X2} − 10x − 25`, why: '中間的 +5x 和 −5x 抵消了。' }, { t: `${X2} + 25`, why: '是平方「差」：減。' }] }],
        found: '平方差兩個方向都好用：<b>乘法變減法</b>（52 × 48），<b>減法變乘法</b>（65² − 35²）。' }
    ]);
    S = diffSim(card, () => tk.check());
    card.appendChild(tk.slot); p.insertBefore(p.querySelector('.u4-task'), card); tk.start();
  }

  function know(p, api) {
    p.appendChild(h('<p class="muted">把剛剛玩到的，收成 4 句話。</p>'));
    diffPic(U.card(p, '① 平方差公式', `<p>${M(sq('a') + ' − ' + sq('b') + ' ＝ (a + b)(a − b)')}</p><p>剪掉一角，拼成長 a + b、寬 a − b 的長方形。</p>`), 6, 2);
    K.table(U.card(p, '② 乘法 → 減法', '<p>找兩數的「中間數」。</p>'), ['算式', '中間數', '結果'], [['103 × 97', '100', '10000 − 9 ＝ 9991'], ['49 × 51', '50', '2500 − 1 ＝ 2499'], ['7.5 × 8.5', '8', '64 − 0.25 ＝ 63.75']], 400);
    K.table(U.card(p, '③ 減法 → 乘法', '<p>兩個平方相減，直接變成 (和)(差)。</p>'), ['算式', '(和) × (差)', '結果'], [['65² − 15²', '80 × 50', '4000'], ['101² − 99²', '200 × 2', '400'], ['4 × 31² − 12²', '(62)² − 12² ＝ 74 × 50', '3700']], 400);
    diffPic(U.card(p, '④ 字母也一樣', `<p>${M('(x + 3)(x − 3) ＝ ' + X2 + ' − 9')}</p><p>${M('(2x + 5)(2x − 5) ＝ 4' + X2 + ' − 25')}</p><p>中間項抵消了，只剩「平方 − 平方」。</p>`), 5, 3);
    const c = h('<div class="card"><h3>✏️ 檢查一下</h3></div>'); p.appendChild(c);
    U.numq(c, { q: '101 × 99 ＝ ？', pre: '＝', answer: 9999, hint: '(100 + 1)(100 − 1) ＝ 100² − 1²。', diag: [{ v: 10001, msg: '是減 1²。' }], why: '10000 − 1 ＝ 9999', onDone() { api.done(); } });
  }

  function exam(p, api) {
    U.exam(p, api, {
      intro: '這兩題是照會考題的樣子改寫的，數字比較好算。答錯可以再選。',
      benchLabel: '想驗算？打開剪一角模擬',
      bench: host => diffSim(host, () => {}),
      qs: [
        { src: '改寫自 104 年會考第 16 題', q: '判斷下列各式的值，何者最大？', hint: '每一個都是平方差：先變成 (和) × (差)。',
          options: [{ t: '9 × 5² − 5²', why: '＝ 15² − 5² ＝ 20 × 10 ＝ 200。' }, { t: '4 × 9² − 8²', ok: true, why: '＝ 18² − 8² ＝ 26 × 10 ＝ 260，最大。' }, { t: '16 × 4² − 6²', why: '＝ 16² − 6² ＝ 22 × 10 ＝ 220。' }, { t: '25 × 2² − 4²', why: '＝ 10² − 4² ＝ 14 × 6 ＝ 84。' }] },
        { src: '改寫自 114 年會考第 10 題', q: '下列哪一個算式的值和 (7² − 1²) 不一樣？', hint: '7² − 1² ＝ 8 × 6 ＝ 48。',
          options: [{ t: '8 × 6', why: '就是 (7 + 1)(7 − 1)。' }, { t: '(5 + 1)(5 + 3)', why: '6 × 8 ＝ 48，一樣。' }, { t: '6² − 2²', ok: true, why: '6² − 2² ＝ 8 × 4 ＝ 32，不一樣 ✔' }, { t: '4 × 12', why: '48，一樣。' }] }
      ]
    });
  }

  function real(p, api) {
    U.real(p, api, [
      { stars: 1, src: K.SIM, q: '利用乘法公式計算 98 × 102 之值為何？',
        options: [{ t: '9996', ok: true, why: '100² − 2² ＝ 10000 − 4。' }, { t: '10004', why: '平方差是減：100² − 2²。' }, { t: '9604', why: '這是 98²。' }, { t: '10000', why: '還要減 2²。' }],
        explain: '<p>98 × 102 ＝ (100 − 2)(100 + 2) ＝ 100² − 2² ＝ 10000 − 4 ＝ 9996。答案 (A)。</p>',
        steps: [
          { num: true, q: '98 和 102 的中間數是？', pre: '', answer: 100 },
          { num: true, q: '它們都離 100 多遠？', pre: '', answer: 2 },
          { num: true, q: '98 × 102 ＝ 100² − 2² ＝ ？', pre: '＝', answer: 9996, diag: [{ v: 10004, msg: '是減。' }] }
        ] },
      { stars: 2, src: '104 年會考 第 16 題', q: '判斷下列各式的值，何者最大？',
        options: [{ t: '25 × 13² − 15²', why: '＝ 65² − 15² ＝ 80 × 50 ＝ 4000。' }, { t: '16 × 17² − 18²', ok: true, why: '＝ 68² − 18² ＝ 86 × 50 ＝ 4300，最大。' }, { t: '9 × 21² − 13²', why: '＝ 63² − 13² ＝ 76 × 50 ＝ 3800。' }, { t: '4 × 31² − 12²', why: '＝ 62² − 12² ＝ 74 × 50 ＝ 3700。' }],
        explain: '<p>25 × 13² ＝ 5² × 13² ＝ 65²，所以每一個都是平方差：<br>(A) 65² − 15² ＝ 80 × 50 ＝ 4000　(B) 68² − 18² ＝ 86 × 50 ＝ 4300<br>(C) 63² − 13² ＝ 76 × 50 ＝ 3800　(D) 62² − 12² ＝ 74 × 50 ＝ 3700<br>最大是 (B)。</p>',
        steps: [
          { q: '25 × 13² 可以寫成誰的平方？', options: [{ t: '65²', ok: true, why: '25 ＝ 5²，5² × 13² ＝ (5 × 13)²。' }, { t: '325²', why: '25 要先開根號變 5，再乘 13。' }] },
          { num: true, q: '(A) 65² − 15² ＝ (65 + 15)(65 − 15) ＝ ？', pre: '＝', answer: 4000 },
          { num: true, q: '(B) 16 × 17² − 18² ＝ 68² − 18² ＝ ？', pre: '＝', answer: 4300 },
          { q: '(C) 3800、(D) 3700。哪一個最大？', options: [{ t: '(B) 4300', ok: true, why: '注意每一個的「差」都是 50，只要比「和」：86 最大。' }, { t: '(A) 4000', why: '4300 比 4000 大。' }] }
        ] },
      { stars: 3, src: '114 年會考 第 10 題', q: '利用乘法公式判斷，下列算式之值，何者與其他不相同？',
        options: [{ t: '(106² − 4²) × (108² − 2²)', ok: true, why: '＝ 110 × 102 × 110 × 106，有 102，其他三個都是 104 × 106 × 108 × 110。' }, { t: '(107² − 3²) × (107² − 1²)', why: '＝ 110 × 104 × 108 × 106。' }, { t: '(108² − 2²) × (106² − 2²)', why: '＝ 110 × 106 × 108 × 104。' }, { t: '(109² − 1²) × (105² − 1²)', why: '＝ 110 × 108 × 106 × 104。' }],
        explain: '<p>每個括號都用平方差拆成兩個數相乘：<br>(A) 110 × 102 × 110 × 106<br>(B) 110 × 104 × 108 × 106<br>(C) 110 × 106 × 108 × 104<br>(D) 110 × 108 × 106 × 104<br>(B)(C)(D) 都是 104 × 106 × 108 × 110，只有 (A) 不同。答案 (A)。</p>',
        steps: [
          { q: '106² − 4² ＝ ？', options: [{ t: '110 × 102', ok: true, why: '(106 + 4)(106 − 4)。' }, { t: '102²', why: '平方差變成 (和)(差)，不是 (差)²。' }] },
          { q: '108² − 2² ＝ ？', options: [{ t: '110 × 106', ok: true, why: '(108 + 2)(108 − 2)。' }, { t: '110 × 104', why: '108 − 2 ＝ 106。' }] },
          { q: '(B)(C)(D) 拆開後都是 104、106、108、110 四個數相乘。(A) 呢？', options: [{ t: '110、102、110、106，不一樣', ok: true, why: '所以選 (A)。' }, { t: '也一樣', why: '(A) 有兩個 110，還有 102。' }] }
        ] }
    ]);
  }

  K.run('1-1b', ['先猜猜看：21 × 19', '動手玩：剪一角拼長方形', '收成 4 句話', '會考題改寫版', '會考實戰：照原題做做看'], { guess, play, know, exam, real });
})();
