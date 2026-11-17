/* ===== 數學 1-3a 多項式的乘法 ===== */
(function () {
  'use strict';
  const U = Unit4, h = U.h, K = MK, Q = MK2, M = K.M, X2 = K.X2, num = K.num;
  const P = cs => M(Q.polyN(cs));

  function boxSim(host, on) {
    host.appendChild(h('<p class="sim-h">長方形的長是 (x + m)、寬是 (x + n)，面積是多少？</p>'));
    const pic = h('<div></div>'), read = h('<div class="sim-read"></div>');
    let m = 3, n = 2;
    function draw() {
      pic.innerHTML = ''; const sv = U.svg(pic, K.boxSvg(m, n).vb, K.boxSvg(m, n).inner, '面積盒', 'sim'); sv.style.maxWidth = '300px';
      read.innerHTML = `${M(K.par(m) + K.par(n))}<br>＝ x² ＋ ${K.pn(m)}x ＋ ${K.pn(n)}x ＋ ${K.pn(m)}×${K.pn(n)}<br>＝ <b>${M(K.poly(m + n, m * n))}</b>${m < 0 || n < 0 ? `<br><span class="small" style="color:${K.NEG}">紅色虛線的格子是「負的面積」，要減掉。</span>` : ''}`;
    }
    host.appendChild(pic);
    U.slider(host, 'm', { min: -5, max: 6, step: 1, value: m, fmt: num }, v => { m = v; draw(); on(); });
    U.slider(host, 'n', { min: -5, max: 6, step: 1, value: n, fmt: num }, v => { n = v; draw(); on(); });
    host.appendChild(read); draw();
    return { get m() { return m; }, get n() { return n; } };
  }

  function guess(p, api) {
    U.guess(p, api, [
      { pic: c => K.boxPic(c, 3, 2, 240), q: '長 x + 3、寬 x + 2 的長方形，面積是多少？', options: [{ t: `${X2} + 5x + 6`, ok: true }, { t: `${X2} + 6` }, { t: '2x + 5' }],
        reveal: `切成四塊：x²、3x、2x、6，加起來 <b>${P([1, 5, 6])}</b>。只算 x² ＋ 6 會漏掉中間兩塊。` },
      { q: `${M('3(x + 4)')} ＝ ？`, options: [{ t: '3x + 4' }, { t: '3x + 12', ok: true }, { t: '3x + 7' }],
        reveal: '<b>分配律</b>：3 要乘到括號裡的<b>每一項</b>：3x ＋ 12。多項式乘法就是一直用分配律。' }
    ]);
  }

  function play(p, api) {
    let S;
    const card = h('<div class="card"></div>'); p.appendChild(card);
    const tk = U.tasks(p, api, [
      { text: '調成 (x + 4)(x + 3)。', check: () => S.m === 4 && S.n === 3,
        qs: () => [{ q: '四塊面積各是什麼？', options: [{ t: 'x²、4x、3x、12', ok: true, why: '每一邊的每一段都互相乘一次：2 × 2 ＝ 4 塊。' }, { t: 'x²、7x、12', why: '4x 和 3x 是兩塊，合起來才是 7x。' }] },
          { num: true, q: '(x + 4)(x + 3) ＝ x² ＋ □x ＋ 12，□ ＝ ？', pre: '□ ＝', answer: 7 }],
        found: '<b>每一項乘每一項</b>：(a + b)(c + d) ＝ ac ＋ ad ＋ bc ＋ bd，再合併同類項。' },
      { text: '把 n 拉成負的：調成 (x + 4)(x − 1)。', check: () => S.m === 4 && S.n === -1,
        qs: () => [{ q: '右下角那塊 4 × (−1) 是多少？', options: [{ t: '−4', ok: true, why: '正 × 負 ＝ 負。' }, { t: '4', why: '有一個是負的，乘起來是負的。' }] },
          { num: true, signed: true, q: 'x 項：4x ＋ (−x) ＝ □x', pre: '□ ＝', answer: 3 }],
        found: '有負號時一樣每項乘每項，<b>先把正負號定好</b>再合併。' },
      { text: '不用模擬了，算算看。', quiet: true, check: () => true,
        qs: () => [
          { q: `${M('6x(3 − 2x)')} ＝ ？`, options: [{ t: `18x − 12${X2}`, ok: true, why: '6x × 3 ＝ 18x；6x × (−2x) ＝ −12x²。' }, { t: `18x − 2x`, why: '6x 要乘到 −2x：−12x²。' }, { t: '16x', why: '不能把括號裡先合併：3 和 −2x 不是同類項。' }] },
          { q: `${M('(2x + 1)(x − 3)')} ＝ ？`, options: [{ t: `2${X2} − 5x − 3`, ok: true, why: '2x² − 6x ＋ x − 3。' }, { t: `2${X2} − 3`, why: '漏了中間兩項 −6x ＋ x。' }, { t: `2${X2} + 7x − 3`, why: '2x × (−3) ＝ −6x。' }] }],
        found: 'x 前面有係數也一樣：<b>係數乘係數，x 的次方相加</b>（2x × x ＝ 2x²）。' }
    ]);
    S = boxSim(card, () => tk.check());
    card.appendChild(tk.slot); p.insertBefore(p.querySelector('.u4-task'), card); tk.start();
  }

  function know(p, api) {
    p.appendChild(h('<p class="muted">把剛剛玩到的，收成 4 句話。</p>'));
    K.rowPic(U.card(p, '① 單項式 × 多項式：分配律', `<p>${M('3x(2x − 5) ＝ 6' + X2 + ' − 15x')}</p><p>左邊的 3x 乘到每一格。</p>`), '3x', ['2x', '−5'], ['6x²', '−15x']);
    K.boxPic(U.card(p, '② 多項式 × 多項式：每項乘每項', `<p>${M('(x + 4)(x − 2) ＝ ' + X2 + ' − 2x + 4x − 8 ＝ ' + X2 + ' + 2x − 8')}</p>`), 4, -2);
    K.table(U.card(p, '③ 直式乘法（像整數乘法）', `<p>${M('(2x + 3)(x − 4)')}</p>`), ['', 'x²', 'x', '常數'], [['2x + 3 乘 −4', '', '−8', '−12'], ['2x + 3 乘 x', '2', '3', ''], ['加起來', '2', '−5', '−12']], 340);
    K.table(U.card(p, '④ 檢查小技巧：代 x ＝ 1', '<p>(2x + 3)(x − 4) 代 x ＝ 1：5 × (−3) ＝ −15<br>2x² − 5x − 12 代 x ＝ 1：2 − 5 − 12 ＝ −15 ✔</p>'), ['', '左邊', '右邊'], [['x ＝ 1', '−15', '−15'], ['x ＝ 2', '7 × (−2) ＝ −14', '8 − 10 − 12 ＝ −14']], 340);
    const c = h('<div class="card"><h3>✏️ 檢查一下</h3></div>'); p.appendChild(c);
    U.numq(c, { q: `${M('(x + 5)(x − 2)')} 展開後，x 項的係數是多少？`, pre: '', signed: true, answer: 3, hint: '5x ＋ (−2x)。', diag: [{ v: -10, msg: '−10 是常數項。' }, { v: 7, msg: '−2x 是負的：5 − 2。' }], why: 'x² ＋ 3x − 10', onDone() { api.done(); } });
  }

  function exam(p, api) {
    U.exam(p, api, {
      intro: '這兩題是照會考題的樣子改寫的。答錯可以再選。',
      benchLabel: '想畫畫看？打開面積盒模擬',
      bench: host => boxSim(host, () => {}),
      qs: [
        { src: '改寫自 106 年會考第 3 題', q: `計算 ${M('4x(2 − 3x)')} 的結果，與下列哪一個式子相同？`, hint: '4x 乘 2，再乘 −3x。',
          options: [{ t: `−12${X2} + 8x`, ok: true, why: '4x × 2 ＝ 8x；4x × (−3x) ＝ −12x²。' }, { t: `−12${X2} + 2`, why: '4x 也要乘 2。' }, { t: '−4x', why: '括號裡 2 和 −3x 不能先合併。' }, { t: `12${X2} + 8x`, why: '正 × 負 ＝ 負。' }] },
        { src: '改寫自 105 年會考第 3 題', q: `計算 ${M('(x + 2)(x − 1) − (' + X2 + ' + 3)')} 的結果為何？`, hint: '先展開 (x + 2)(x − 1)，再減整個括號。',
          options: [{ t: 'x − 5', ok: true, why: 'x² ＋ x − 2 − x² − 3 ＝ x − 5。' }, { t: 'x + 1', why: '−(x² + 3) 的 3 也要變號：−3。' }, { t: `2${X2} + x + 1`, why: '是減 x²，x² 會抵消。' }, { t: '3x − 5', why: '(x + 2)(x − 1) 的 x 項是 −x ＋ 2x ＝ x。' }] }
      ]
    });
  }

  function real(p, api) {
    U.real(p, api, [
      { stars: 1, src: '106 年會考 第 3 題', q: `計算 ${M('6x·(3 − 2x)')} 的結果，與下列哪一個式子相同？`,
        options: [{ t: `−12${X2} + 18x`, ok: true, why: '6x × 3 ＝ 18x，6x × (−2x) ＝ −12x²。' }, { t: `−12${X2} + 3`, why: '6x 也要乘到 3。' }, { t: '16x', why: '3 和 −2x 不是同類項，不能先合併。' }, { t: '6x', why: '要用分配律乘開。' }],
        explain: '<p>分配律：6x × 3 ＋ 6x × (−2x) ＝ 18x − 12x²，排成降冪 −12x² ＋ 18x。答案 (A)。</p>',
        steps: [
          { q: '6x × 3 ＝ ？', options: [{ t: '18x', ok: true, why: '係數相乘，x 照抄。' }, { t: '18', why: 'x 要留著。' }] },
          { q: '6x × (−2x) ＝ ？', options: [{ t: `−12${X2}`, ok: true, why: '6 × (−2) ＝ −12，x × x ＝ x²。' }, { t: '−12x', why: 'x × x ＝ x²。' }] }
        ] },
      { stars: 2, src: '105 年會考 第 3 題', q: `計算 ${M('(2x + 1)(x − 1) − (' + X2 + ' + x − 2)')} 的結果，與下列哪一個式子相同？`,
        options: [{ t: `${X2} − 2x + 1`, ok: true, why: '2x² − x − 1 − x² − x ＋ 2 ＝ x² − 2x ＋ 1。' }, { t: `${X2} − 2x − 3`, why: '−(−2) ＝ ＋2，−1 ＋ 2 ＝ 1。' }, { t: `${X2} + x − 3`, why: '−(x) ＝ −x，−x − x ＝ −2x。' }, { t: `${X2} − 3`, why: 'x 項沒有抵消：−x − x ＝ −2x。' }],
        explain: '<p>(2x + 1)(x − 1) ＝ 2x² − 2x ＋ x − 1 ＝ 2x² − x − 1。<br>再減 (x² + x − 2)：2x² − x − 1 − x² − x ＋ 2 ＝ x² − 2x ＋ 1。答案 (A)。</p>',
        steps: [
          { q: '(2x + 1)(x − 1) ＝ ？', options: [{ t: `2${X2} − x − 1`, ok: true, why: '2x² − 2x ＋ x − 1。' }, { t: `2${X2} − 1`, why: '中間 −2x ＋ x ＝ −x 不是 0。' }] },
          { q: '−(x² + x − 2) ＝ ？', options: [{ t: `−${X2} − x + 2`, ok: true, why: '每一項都變號。' }, { t: `−${X2} + x − 2`, why: '每一項都要變號。' }] },
          { q: '合起來：(2x² − x − 1) ＋ (−x² − x ＋ 2) ＝ ？', options: [{ t: `${X2} − 2x + 1`, ok: true, why: '同類項合併。' }, { t: `${X2} − 2x − 3`, why: '−1 ＋ 2 ＝ 1。' }] }
        ] },
      { stars: 3, src: K.SIM, q: `展開 ${M('(2x − 1)(' + X2 + ' + 3x − 2)')} 後，x 項的係數為何？`,
        options: [{ t: '−7', ok: true, why: '2x × (−2) ＝ −4x，(−1) × 3x ＝ −3x，合起來 −7x。' }, { t: '−4', why: '還有 (−1) × 3x ＝ −3x。' }, { t: '−1', why: '−4x ＋ (−3x) ＝ −7x。' }, { t: '5', why: '5 是 x² 的係數：6x² − x²。' }],
        explain: '<p>只要找「乘起來是 x 一次」的組合：2x × (−2) ＝ −4x，(−1) × 3x ＝ −3x，合計 −7x。<br>（完整展開：2x³ ＋ 5x² − 7x ＋ 2。）答案 (A)。</p>',
        steps: [
          { q: '2x 要乘第二個括號的哪一項，才會得到 x 的一次？', options: [{ t: '−2（常數）', ok: true, why: '2x × (−2) ＝ −4x。' }, { t: '3x', why: '2x × 3x ＝ 6x²，是二次。' }] },
          { q: '−1 要乘哪一項才會得到 x 的一次？', options: [{ t: '3x', ok: true, why: '(−1) × 3x ＝ −3x。' }, { t: 'x²', why: '(−1) × x² ＝ −x²，是二次。' }] },
          { num: true, signed: true, q: '−4x ＋ (−3x) ＝ □x', pre: '□ ＝', answer: -7 }
        ] }
    ]);
  }

  K.run('1-3a', ['先猜猜看：長方形面積', '動手玩：面積盒', '收成 4 句話', '會考題改寫版', '會考實戰：照原題做做看'], { guess, play, know, exam, real });
})();
