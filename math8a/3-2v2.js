/* ===== 數學 3-2 利用乘法公式分解 ===== */
(function () {
  'use strict';
  const U = Unit4, h = U.h, K = MK, M = K.M, X2 = K.X2, ST = K.ST;
  const sq = s => `${s}<sup>2</sup>`;

  /* 大正方形剪掉小正方形 → 拼成長方形 */
  function diffSvg(a, b) {
    const u = 13, x0 = 30, y0 = 22, d = a - b, y1 = y0 + a * u + 46;
    const c1 = '#f6c26b', c2 = '#9fd3a8';
    return { vb: `0 0 290 ${y1 + d * u + 26}`, inner: `
      <rect x="${x0}" y="${y0}" width="${d * u}" height="${a * u}" fill="${c1}" fill-opacity=".65" ${ST}/>
      <rect x="${x0 + d * u}" y="${y0 + b * u}" width="${b * u}" height="${d * u}" fill="${c2}" fill-opacity=".65" ${ST}/>
      <rect x="${x0 + d * u}" y="${y0}" width="${b * u}" height="${b * u}" fill="none" stroke="${K.NEG}" stroke-width="1.5" stroke-dasharray="5 3"/>
      <text x="${x0 + d * u + b * u / 2}" y="${y0 + b * u / 2 + 4}" text-anchor="middle" class="t12" style="fill:${K.NEG}">剪掉 ${b}×${b}</text>
      <text x="${x0 + a * u / 2}" y="14" text-anchor="middle" class="t12b">${a}</text><text x="${x0 - 10}" y="${y0 + a * u / 2 + 4}" text-anchor="middle" class="t12b">${a}</text>
      <text x="${x0 + a * u + 12}" y="${y0 + a * u / 2}" class="t12">面積 ${a}² − ${b}²</text>
      <text x="${x0}" y="${y1 - 22}" class="t12b">↓ 把綠色那塊轉過來接在旁邊</text>
      <rect x="${x0}" y="${y1}" width="${a * u}" height="${d * u}" fill="${c1}" fill-opacity=".65" ${ST}/>
      <rect x="${x0 + a * u}" y="${y1}" width="${b * u}" height="${d * u}" fill="${c2}" fill-opacity=".65" ${ST}/>
      <text x="${x0 + (a + b) * u / 2}" y="${y1 - 5}" text-anchor="middle" class="t12b">${a} + ${b}</text>
      <text x="${x0 - 6}" y="${y1 + d * u / 2 + 4}" text-anchor="end" class="t12b">${a}−${b}</text>
      <text x="${x0}" y="${y1 + d * u + 18}" class="t12">長方形：(${a} + ${b}) × (${a} − ${b})</text>` };
  }
  function diffPic(host, a, b, cls) { const s = diffSvg(a, b); const sv = U.svg(host, s.vb, s.inner, '平方差：剪一角拼長方形', cls || 'u4-pic'); sv.style.maxWidth = '300px'; return sv; }
  function diffSim(host, on) {
    host.appendChild(h('<p class="sim-h">大正方形剪掉一個小正方形，剩下的可以拼成長方形嗎？</p>'));
    const pic = h('<div></div>'), read = h('<div class="sim-read"></div>');
    let a = 5, b = 2, sb;
    function draw() {
      pic.innerHTML = ''; diffPic(pic, a, b, 'sim');
      read.innerHTML = `${a}² − ${b}² ＝ ${a * a} − ${b * b} ＝ <b>${a * a - b * b}</b><br>(${a} + ${b}) × (${a} − ${b}) ＝ ${a + b} × ${a - b} ＝ <b>${(a + b) * (a - b)}</b>　✔ 一樣大`;
    }
    host.appendChild(pic);
    U.slider(host, '大正方形邊長 a', { min: 4, max: 9, step: 1, value: a }, v => { a = v; if (b >= a) { b = a - 1; sb.set(b); } draw(); on(); });
    sb = U.slider(host, '小正方形邊長 b', { min: 1, max: 8, step: 1, value: b }, v => { b = Math.min(v, a - 1); if (b !== v) sb.set(b); draw(); on(); });
    host.appendChild(read); draw();
    return { get a() { return a; }, get b() { return b; } };
  }

  function guess(p, api) {
    U.guess(p, api, [
      { q: '51 × 49，不用直式，猜猜是多少？', options: [{ t: '2499', ok: true }, { t: '2501' }, { t: '2599' }],
        reveal: '51 × 49 ＝ (50 + 1)(50 − 1) ＝ 50² − 1² ＝ 2500 − 1 ＝ <b>2499</b>。今天要把這個公式<b>倒過來</b>用。' },
      { pic: c => K.boxPic(c, 3, 3), q: `這個大正方形的面積是 ${M(X2 + ' + 6x + 9')}。它的邊長是多少？`, options: [{ t: 'x + 3', ok: true }, { t: 'x + 9' }, { t: 'x + 6' }],
        reveal: `邊長是 <b>x + 3</b>，所以 ${M(X2 + ' + 6x + 9 ＝ ' + sq('(x + 3)'))}。` }
    ]);
  }

  function play(p, api) {
    let A, B;
    const P = U.panes(p, 2);
    const tk = U.tasks(p, api, [
      { text: '把大正方形調成 <b>7</b>、小正方形調成 <b>3</b>。', setup() { P.show(0); }, check: () => A.a === 7 && A.b === 3,
        qs: () => [{ q: '7² − 3² 可以怎麼算比較快？', options: [{ t: '(7 + 3) × (7 − 3) ＝ 10 × 4 ＝ 40', ok: true, why: '剪掉一角的正方形，剛好拼成「長 a + b、寬 a − b」的長方形。' }, { t: '(7 − 3)² ＝ 16', why: '看讀數：7² − 3² ＝ 49 − 9 ＝ 40，不是 16。' }] }],
        found: `<b>平方差</b>：${M(sq('a') + ' − ' + sq('b') + ' ＝ (a + b)(a − b)')}` },
      { text: `換一個：拉「補上的數」，把 ${M(X2 + ' + 6x + ?')} 補成一個大正方形。`, setup() { P.show(1); }, check: () => B.full(6),
        qs: () => [{ q: `補 9 剛好。同樣的道理，${M(X2 + ' + 10x + 25')} ＝ ？`, options: [{ t: sq('(x + 5)'), ok: true, why: '25 ＝ 5²，10x ＝ 2 × x × 5，剛好是完全平方。' }, { t: sq('(x + 25)'), why: '括號裡是「開根號」的數：25 ＝ 5²。' }, { t: sq('(x + 10)'), why: '10 是中間項的係數，它是 5 的 2 倍。' }] }],
        found: `<b>完全平方</b>：頭尾是平方、中間是「2 × 頭 × 尾」，就是 ${M(sq('a') + ' + 2ab + ' + sq('b') + ' ＝ ' + sq('(a + b)'))}` },
      { text: '不用模擬了，直接認公式。', quiet: true, check: () => true,
        qs: () => [{ q: `${M(X2 + ' − 8x + 16')} ＝ ？`, hint: '16 ＝ 4²，8x ＝ 2 × x × 4，中間是減。', options: [{ t: sq('(x − 4)'), ok: true, why: '中間是減號，就是差的平方。' }, { t: sq('(x + 4)'), why: '乘開中間會是 ＋8x。' }, { t: '(x + 4)(x − 4)', why: '那是 x² − 16，只有兩項。' }] },
          { q: `${M('4' + X2 + ' − 9')} ＝ ？`, hint: '4x² ＝ (2x)²，9 ＝ 3²。', options: [{ t: '(2x + 3)(2x − 3)', ok: true, why: '(2x)² − 3² ＝ (2x + 3)(2x − 3)。' }, { t: '(4x + 3)(4x − 3)', why: '4x² 是 (2x)²，不是 (4x)²。' }, { t: sq('(2x − 3)'), why: '完全平方有三項；這裡只有兩項相減。' }] }],
        found: '<b>兩項相減</b>、都是平方 → 平方差。<b>三項</b>、頭尾是平方 → 檢查中間是不是 2 × 頭 × 尾。' }
    ]);
    A = diffSim(P.list[0], () => tk.check());
    B = K.sqSim(P.list[1], () => tk.check(), { bs: [6] });
    P.end(tk.slot); p.insertBefore(p.querySelector('.u4-task'), P.list[0].parentElement); tk.start();
  }

  function know(p, api) {
    p.appendChild(h('<p class="muted">把剛剛玩到的，收成 4 句話。</p>'));
    diffPic(U.card(p, '① 平方差', `<p>${M(sq('a') + ' − ' + sq('b') + ' ＝ (a + b)(a − b)')}</p><p>例：${M(X2 + ' − 36 ＝ (x + 6)(x − 6)')}</p>`), 5, 2);
    K.boxPic(U.card(p, '② 完全平方', `<p>${M(sq('a') + ' + 2ab + ' + sq('b') + ' ＝ ' + sq('(a + b)'))}<br>${M(sq('a') + ' − 2ab + ' + sq('b') + ' ＝ ' + sq('(a − b)'))}</p><p>例：${M(X2 + ' + 6x + 9 ＝ ' + sq('(x + 3)'))}</p>`), 3, 3);
    K.table(U.card(p, '③ 怎麼認是哪一個公式', '<p>先數有幾項，再看頭尾是不是平方。</p>'),
      ['長相', '用哪個'], [['兩項相減，都是平方', '平方差'], ['三項，頭尾是平方，中間＝2×頭×尾', '完全平方'], ['都不是', '十字交乘（3-3）']], 360);
    K.table(U.card(p, '④ 先提公因式，再套公式', `<p>有公因式要<b>先提</b>，括號裡才看得出公式。</p><p>例：${M('2' + X2 + ' − 18 ＝ 2(' + X2 + ' − 9) ＝ 2(x + 3)(x − 3)')}</p>`),
      ['式子', '先提', '再套公式'], [['2x² − 18', '2(x² − 9)', '2(x + 3)(x − 3)'], ['3x² + 12x + 12', '3(x² + 4x + 4)', '3(x + 2)²']], 380);
    const c = h('<div class="card"><h3>✏️ 檢查一下</h3></div>'); p.appendChild(c);
    U.choice(c, { q: `${M('9' + X2 + ' − 25')} 因式分解是哪一個？`, hint: '9x² ＝ (3x)²，25 ＝ 5²。',
      options: [{ t: '(3x + 5)(3x − 5)', ok: true, why: '(3x)² − 5² ＝ (3x + 5)(3x − 5)。' }, { t: '(9x + 5)(9x − 5)', why: '9x² 是 (3x)²。' }, { t: sq('(3x − 5)'), why: '(3x − 5)² 乘開有三項，中間是 −30x。' }], onDone() { api.done(); } });
  }

  function exam(p, api) {
    U.exam(p, api, {
      intro: '這兩題是照會考題的樣子改寫的，數字比較好算。答錯可以再選。',
      qs: [
        { src: '改寫自 112 年會考第 2 題', q: `下列何者為多項式 ${M(X2 + ' − 49')} 的因式？`, hint: '49 ＝ 7²，兩項相減 → 平方差。',
          options: [{ t: 'x − 49', why: '括號裡是開根號後的數。' }, { t: 'x − 9', why: '49 ＝ 7 × 7。' }, { t: 'x − 7', ok: true, why: 'x² − 49 ＝ (x + 7)(x − 7)。' }, { t: 'x − 14', why: '14 是 7 的 2 倍，不是開根號。' }] },
        { src: '改寫自 110 年會考第 8 題', q: '利用乘法公式判斷，下列等式何者成立？', hint: '98 ＋ 2 ＝ 100。(a + b)² ＝ a² ＋ 2ab ＋ b²。',
          options: [{ t: `${sq('98')} + 98 × 2 + ${sq('2')} ＝ ${sq('100')}`, why: '中間少了 2 倍。' },
            { t: `${sq('98')} + 2 × 98 × 2 + ${sq('2')} ＝ ${sq('100')}`, ok: true, why: '(98 + 2)² ＝ 98² ＋ 2 × 98 × 2 ＋ 2²。' },
            { t: `${sq('98')} − 2 × 98 × 2 + ${sq('2')} ＝ ${sq('100')}`, why: '中間是減的話，是 (98 − 2)² ＝ 96²。' },
            { t: `${sq('98')} + 2 × 98 × 2 − ${sq('2')} ＝ ${sq('100')}`, why: '最後一項一定是「加」b²。' }] }
      ]
    });
  }

  function real(p, api) {
    U.real(p, api, [
      { stars: 1, src: '112 年會考 第 2 題', q: `下列何者為多項式 ${M(X2 + ' − 36')} 的因式？`,
        options: [{ t: 'x − 3', why: '36 不是 3²。' }, { t: 'x − 4', why: '36 不是 4²。' }, { t: 'x − 6', ok: true, why: 'x² − 36 ＝ x² − 6² ＝ (x + 6)(x − 6)。' }, { t: 'x − 9', why: '36 不是 9²。' }],
        explain: '<p>兩項相減、都是平方 → 平方差：x² − 36 ＝ x² − 6² ＝ (x + 6)(x − 6)。<br>因式有 x + 6 和 x − 6，答案 (C)。</p>',
        steps: [
          { q: '36 是誰的平方？', options: [{ t: '6', ok: true, why: '6² ＝ 36。' }, { t: '9', why: '9² ＝ 81。' }, { t: '18', why: '18 是 36 的一半，不是開根號。' }] },
          { q: `所以 ${M(X2 + ' − ' + sq('6'))} ＝ ？`, options: [{ t: '(x + 6)(x − 6)', ok: true, why: '平方差公式。裡面的 x − 6 就是選項 (C)。' }, { t: sq('(x − 6)'), why: '(x − 6)² 乘開是 x² − 12x + 36，有三項。' }] }
        ] },
      { stars: 2, src: '110 年會考 第 8 題', q: '利用乘法公式判斷，下列等式何者成立？',
        options: [{ t: `${sq('248')} + 248 × 52 + ${sq('52')} ＝ ${sq('300')}`, why: '中間少了 2 倍。' },
          { t: `${sq('248')} − 248 × 48 − ${sq('48')} ＝ ${sq('200')}`, why: '(248 − 48)² ＝ 248² − 2 × 248 × 48 ＋ 48²：中間要 2 倍，最後是加。' },
          { t: `${sq('248')} + 2 × 248 × 52 + ${sq('52')} ＝ ${sq('300')}`, ok: true, why: '(248 + 52)² ＝ 248² ＋ 2 × 248 × 52 ＋ 52²。' },
          { t: `${sq('248')} − 2 × 248 × 48 − ${sq('48')} ＝ ${sq('200')}`, why: '最後一項要「加」48²。' }],
        explain: '<p>300 ＝ 248 ＋ 52，200 ＝ 248 − 48。<br>(a + b)² ＝ a² ＋ 2ab ＋ b²；(a − b)² ＝ a² − 2ab ＋ b²。<br>檢查兩件事：中間有沒有 <b>2 倍</b>、最後是不是<b>加</b> b²。只有 (C) 都對。</p>',
        steps: [
          { num: true, q: '248 ＋ 52 ＝ ？', answer: 300, why: '所以 300² ＝ (248 + 52)²。' },
          { q: `${M(sq('(a + b)'))} 乘開是？`, options: [{ t: `${sq('a')} + 2ab + ${sq('b')}`, ok: true, why: '中間是 2 倍。' }, { t: `${sq('a')} + ab + ${sq('b')}`, why: '中間有兩塊 ab。' }, { t: `${sq('a')} + ${sq('b')}`, why: '少了中間項。' }] },
          { q: '(B)、(D) 的 200 ＝ 248 − 48。(a − b)² 的最後一項是？', options: [{ t: `加 ${sq('b')}`, ok: true, why: '(a − b)² ＝ a² − 2ab ＋ b²。(B)、(D) 最後都是「減」，所以不成立。' }, { t: `減 ${sq('b')}`, why: '負 × 負 ＝ 正，最後一項是加。' }] }
        ] },
      { stars: 3, src: '114 年會考 第 10 題', q: '利用乘法公式判斷，下列算式之值，何者與其他不相同？',
        options: [{ t: `(${sq('106')} − ${sq('4')}) × (${sq('108')} − ${sq('2')})`, ok: true, why: '＝ 110 × 102 × 110 × 106，跟其他三個不一樣。' },
          { t: `(${sq('107')} − ${sq('3')}) × (${sq('107')} − ${sq('1')})`, why: '＝ 110 × 104 × 108 × 106。' },
          { t: `(${sq('108')} − ${sq('2')}) × (${sq('106')} − ${sq('2')})`, why: '＝ 110 × 106 × 108 × 104。' },
          { t: `(${sq('109')} − ${sq('1')}) × (${sq('105')} − ${sq('1')})`, why: '＝ 110 × 108 × 106 × 104。' }],
        explain: '<p>每個括號都用平方差拆開：<br>(A) (110 × 102) × (110 × 106)<br>(B) (110 × 104) × (108 × 106)<br>(C) (110 × 106) × (108 × 104)<br>(D) (110 × 108) × (106 × 104)<br>(B)(C)(D) 都是 104 × 106 × 108 × 110，只有 (A) 不同。<br>💡 不用真的乘出來，比較「是哪幾個數相乘」就好。</p>',
        steps: [
          { q: `${M(sq('106') + ' − ' + sq('4'))} ＝ ？`, options: [{ t: '110 × 102', ok: true, why: '(106 + 4)(106 − 4)。' }, { t: '102 × 102', why: '那是 (106 − 4)²。' }] },
          { q: `(A) 的另一個括號 ${M(sq('108') + ' − ' + sq('2'))} ＝ 110 × 106。所以 (A) ＝ 110 × 102 × 110 × 106。<br>(B)：${M(sq('107') + ' − ' + sq('3'))} ＝ 110 × 104，${M(sq('107') + ' − ' + sq('1'))} ＝ ？`, options: [{ t: '108 × 106', ok: true, why: '所以 (B) ＝ 110 × 104 × 108 × 106。' }, { t: '107 × 106', why: '(107 + 1)(107 − 1)。' }] },
          { q: '(C) ＝ 110 × 106 × 108 × 104，(D) ＝ 110 × 108 × 106 × 104。哪一個跟別人不同？', options: [{ t: '(A)，它有兩個 110 和一個 102', ok: true, why: '其他三個都是 104 × 106 × 108 × 110。' }, { t: '(B)', why: '(B)(C)(D) 的四個數一樣，只是順序不同。' }] }
        ] }
    ]);
  }

  K.run('3-2', ['先猜猜看：公式倒過來用', '動手玩：剪一角、補一角', '收成 4 句話', '會考題改寫版', '會考實戰：照原題做做看'], { guess, play, know, exam, real });
})();
