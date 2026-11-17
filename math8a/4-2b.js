/* ===== 數學 4-2b 公式解與判別式 ===== */
(function () {
  'use strict';
  const U = Unit4, h = U.h, K = MK, M = K.M, X2 = K.X2, R = K.sqrt, F = K.frac, num = K.num;
  const sq = s => `${s}<sup>2</sup>`;
  const FORMULA = `x ＝ ${F('−b ± ' + R('b<sup>2</sup> − 4ac'), '2a')}`;
  const linePic = (host, pts) => { const l = K.lineSvg(8, pts); const sv = U.svg(host, l.vb, l.inner, '數線上的根', 'u4-pic'); return sv; };

  /* x² + bx + c = 0：拉 b、c 看判別式和根 */
  function discSim(host, on) {
    host.appendChild(h('<p class="sim-h">拉 b 和 c，看根號裡的數（判別式）怎麼決定有幾個解</p>'));
    const pic = h('<div></div>'), read = h('<div class="sim-read"></div>');
    let b = -4, c = 0; const seen = {};
    function draw() {
      const D = b * b - 4 * c, pts = [];
      let txt;
      if (D > 0) { const r = Math.sqrt(D); pts.push((-b + r) / 2, (-b - r) / 2); txt = `<b style="color:var(--good)">D ＞ 0：兩個不同的解</b>　x ＝ ${Number.isInteger(r) ? `${num((-b + r) / 2)} 或 ${num((-b - r) / 2)}` : F(`${num(-b)} ± ${R(D)}`, 2)}`; }
      else if (D === 0) { pts.push(-b / 2); txt = `<b style="color:var(--accent)">D ＝ 0：兩個解一樣（重根）</b>　x ＝ ${num(-b / 2)}`; }
      else txt = `<b style="color:${K.NEG}">D ＜ 0：沒有解</b>（根號裡不能是負的）`;
      if (b === -4) seen[D > 0 ? 'pos' : D === 0 ? 'zero' : 'neg'] = 1;
      pic.innerHTML = ''; const l = K.lineSvg(8, pts); U.svg(pic, l.vb, l.inner, '數線', 'sim');
      read.innerHTML = `方程式：${M(K.poly(1, b, c) + ' ＝ 0')}　（a ＝ 1，b ＝ ${num(b)}，c ＝ ${num(c)}）<br>判別式 D ＝ ${M('b<sup>2</sup> − 4ac')} ＝ ${b * b} − ${K.pn(4 * c)} ＝ <b>${num(D)}</b><br>${txt}`;
    }
    host.appendChild(pic);
    U.slider(host, 'b', { min: -8, max: 8, step: 1, value: b, fmt: num }, v => { b = v; draw(); on(); });
    U.slider(host, 'c', { min: -8, max: 8, step: 1, value: c, fmt: num }, v => { c = v; draw(); on(); });
    host.appendChild(read); draw();
    return { get b() { return b; }, get c() { return c; }, seen };
  }

  function guess(p, api) {
    U.guess(p, api, [
      { q: `用配方法解 ${M(X2 + ' + 2x + 5 ＝ 0')}，會得到 ${M(sq('(x + 1)') + ' ＝ −4')}。這個方程式有解嗎？`, options: [{ t: '沒有，平方不可能是負的', ok: true }, { t: '有，x + 1 ＝ ±2' }],
        reveal: '<b>沒有解</b>。任何數平方都不會是負的。所以一元二次方程式不一定有解，今天要學怎麼<b>先判斷</b>。' },
      { q: `${M(X2 + ' − 4x + 4 ＝ 0')} 有幾個<b>不同</b>的解？`, options: [{ t: '2 個' }, { t: '1 個', ok: true }, { t: '0 個' }],
        reveal: `<b>1 個</b>：${M(sq('(x − 2)') + ' ＝ 0')}，只有 x ＝ 2。兩個解剛好一樣，叫做<b>重根</b>。` }
    ]);
  }

  function play(p, api) {
    let S;
    const card = h('<div class="card"></div>'); p.appendChild(card);
    const tk = U.tasks(p, api, [
      { text: `把 b 調成 <b>−4</b>、c 調成 <b>3</b>，得到 ${M(X2 + ' − 4x + 3 ＝ 0')}。`, check: () => S.b === -4 && S.c === 3,
        qs: () => [{ q: '判別式 D ＝ 4，是正的。數線上有幾個綠點（解）？', options: [{ t: '2 個：1 和 3', ok: true, why: '√4 ＝ 2，公式裡「±」會算出兩個不同的數。' }, { t: '1 個', why: '看數線：綠點有幾個？' }] }],
        found: 'D ＞ 0 → ± 根號算出<b>兩個不同的解</b>。' },
      { text: 'b 不要動，把 c 慢慢往右拉到 <b>4</b>，再拉到 <b>5</b>。看綠點怎麼變。', check: () => S.seen.zero && S.seen.neg && S.b === -4 && S.c >= 5,
        qs: () => [{ q: 'c ＝ 4 時兩個綠點合成一個，c ＝ 5 時綠點消失。為什麼 D ＜ 0 就沒有解？', options: [{ t: '公式裡要算 √D，負數不能開根號', ok: true, why: '沒有任何數的平方是負的。' }, { t: '因為 c 太大了', why: '關鍵不是 c 大小，是 b² − 4ac 的正負。試試 b ＝ −8、c ＝ 5。' }] }],
        found: '<b>D ＞ 0</b> 兩個不同的解；<b>D ＝ 0</b> 重根（一個）；<b>D ＜ 0</b> 沒有解。' },
      { text: `實際代一次公式：${M(X2 + ' − 5x + 3 ＝ 0')}。`, quiet: true, check: () => true,
        qs: () => [
          { q: 'a、b、c 分別是多少？（要連符號一起看）', options: [{ t: 'a ＝ 1，b ＝ −5，c ＝ 3', ok: true, why: 'x² 的係數 1、x 的係數 −5、常數 3。' }, { t: 'a ＝ 1，b ＝ 5，c ＝ 3', why: '中間是「− 5x」，b 要帶負號。' }] },
          { num: true, q: `D ＝ ${M('b<sup>2</sup> − 4ac')} ＝ (−5)² − 4 × 1 × 3 ＝ ？`, pre: 'D ＝', answer: 13, diag: [{ v: -37, msg: '(−5)² 是正的 25。' }, { v: 37, msg: '是 25 減 12。' }] },
          { q: '代公式，x ＝ ？', options: [{ t: F('5 ± ' + R(13), 2), ok: true, why: '−b ＝ −(−5) ＝ 5，分母 2a ＝ 2。' }, { t: F('−5 ± ' + R(13), 2), why: 'b 是 −5，所以 −b 是 ＋5。' }, { t: `5 ± ${F(R(13), 2)}`, why: '分母 2a 要除「整個」分子，5 也要除以 2。' }] }],
        found: `公式解：${M(FORMULA)}。先寫 a、b、c → 算 D → 代進去。` }
    ]);
    S = discSim(card, () => tk.check());
    card.appendChild(tk.slot); p.insertBefore(p.querySelector('.u4-task'), card); tk.start();
  }

  function know(p, api) {
    p.appendChild(h('<p class="muted">把剛剛玩到的，收成 4 句話。</p>'));
    K.table(U.card(p, '① 公式解', `<p>${M('a' + X2 + ' + bx + c ＝ 0')} 的解：</p><div class="mk-big">${FORMULA}</div><p>它就是把配方法做一次、整理好的結果。會考試題本最後一頁有印。</p>`), ['代號', '是什麼'], [['a', 'x² 的係數'], ['b', 'x 的係數（連符號）'], ['c', '常數項（連符號）']], 280);
    const t2 = U.card(p, '② 判別式 D ＝ b² − 4ac 決定有幾個解', '<p>D 就是根號裡的數。</p>');
    K.table(t2, ['D', '解', '例子'], [['＞ 0', '兩個不同的解', 'x² − 4x + 3 ＝ 0'], ['＝ 0', '重根（一個）', 'x² − 4x + 4 ＝ 0'], ['＜ 0', '沒有解', 'x² − 4x + 5 ＝ 0']], 380);
    linePic(t2, [1, 3]);
    K.table(U.card(p, '③ 代公式三步', `<p>例：${M('2' + X2 + ' − 3x − 1 ＝ 0')}</p>`), ['步驟', '例子'], [['寫出 a、b、c', 'a ＝ 2，b ＝ −3，c ＝ −1'], ['算 D ＝ b² − 4ac', '9 − 4 × 2 × (−1) ＝ 9 ＋ 8 ＝ 17'], ['代公式', `x ＝ ${F('3 ± ' + R(17), 4)}`]], 400);
    K.table(U.card(p, '④ 三個最常錯的地方', '<p>都是符號和分母。</p>'), ['哪裡', '提醒'], [['−b', 'b 是負的時候，−b 變正的'], ['−4ac', 'c 是負的時候，「減負」變「加」'], ['分母 2a', '要除整個分子，不是只除根號']], 380);
    const c = h('<div class="card"><h3>✏️ 檢查一下</h3></div>'); p.appendChild(c);
    U.numq(c, { q: `${M(X2 + ' + 3x − 1 ＝ 0')} 的判別式 D ＝ ？`, pre: 'D ＝', answer: 13, signed: true, hint: 'a ＝ 1、b ＝ 3、c ＝ −1。9 − 4 × 1 × (−1)。', diag: [{ v: 5, msg: 'c 是 −1，「− 4 × 1 × (−1)」是 ＋4。' }],
      why: '9 ＋ 4 ＝ 13 ＞ 0，有兩個不同的解。', onDone() { api.done(); } });
  }

  function exam(p, api) {
    U.exam(p, api, {
      intro: '這兩題是照會考題的樣子改寫的。答錯可以再選。',
      qs: [
        { src: '改寫自 112 年會考第 10 題', q: `利用公式解可得一元二次方程式 ${M('2' + X2 + ' − 5x − 1 ＝ 0')} 的兩解為 a、b，且 a ＞ b，求 a 值為何？`, hint: 'a ＝ 2、b ＝ −5、c ＝ −1。先算 D ＝ 25 − 4 × 2 × (−1)。',
          options: [{ t: F('−5 + ' + R(17), 4), why: '−b 是 ＋5；而且 D ＝ 25 ＋ 8。' }, { t: F('−5 + ' + R(33), 4), why: 'b ＝ −5，所以 −b ＝ ＋5。' }, { t: F('5 + ' + R(17), 4), why: 'c 是 −1：25 − 4 × 2 × (−1) ＝ 25 ＋ 8 ＝ 33。' }, { t: F('5 + ' + R(33), 4), ok: true, why: '−b ＝ 5，D ＝ 33，分母 2a ＝ 4。比較大的解取「＋」。' }] },
        { src: '改寫自 114 年會考第 13 題', q: `已知甲方程式為 ${M(sq('(x − 3)') + ' ＝ 0')}，乙方程式為 ${M(sq('(x + 1)') + ' ＝ 5')}。關於甲、乙兩方程式的解的情形，下列敘述何者正確？`, hint: '平方 ＝ 0 → 一個；平方 ＝ 正數 → 兩個；平方 ＝ 負數 → 沒有。',
          options: [{ t: '甲有兩個相異的解，乙無解', why: '甲：平方 ＝ 0，只有 x ＝ 3。乙：5 是正的，有解。' }, { t: '甲有兩個相異的解，乙有兩個相異的解', why: '甲：平方 ＝ 0，只有 x ＝ 3。' }, { t: '甲有兩個相同的解，乙無解', why: '乙：平方 ＝ 5 是正的，x + 1 ＝ ±√5。' }, { t: '甲有兩個相同的解，乙有兩個相異的解', ok: true, why: '甲：x ＝ 3（重根）。乙：x ＝ −1 ± √5，兩個不同。' }] }
      ]
    });
  }

  function real(p, api) {
    U.real(p, api, [
      { stars: 1, src: K.SIM, q: '下列哪一個一元二次方程式<b>沒有解</b>？',
        options: [{ t: `${X2} − 4 ＝ 0`, why: 'x² ＝ 4，x ＝ ±2。' }, { t: `${X2} + 4 ＝ 0`, ok: true, why: 'x² ＝ −4，平方不可能是負的。' }, { t: `${X2} − 4x ＝ 0`, why: 'x(x − 4) ＝ 0，x ＝ 0 或 4。' }, { t: `${X2} − 4x + 4 ＝ 0`, why: '(x − 2)² ＝ 0，x ＝ 2（重根），有解。' }],
        explain: '<p>(A) x ＝ ±2；(C) x ＝ 0 或 4；(D) x ＝ 2（重根）。<br>(B) x² ＝ −4，平方不會是負的 → 無解。用判別式：D ＝ 0 − 4 × 1 × 4 ＝ −16 ＜ 0。答案 (B)。</p>',
        steps: [
          { q: `${M(X2 + ' + 4 ＝ 0')} 移項後是 ${M(X2 + ' ＝ −4')}。有沒有數的平方是負的？`, options: [{ t: '沒有', ok: true, why: '所以這個方程式無解。' }, { t: '有，−2', why: '(−2)² ＝ ＋4。' }] }
        ] },
      { stars: 2, src: '114 年會考 第 13 題', q: `已知甲方程式為 ${M(sq('(x − 4)') + ' ＝ 9')}，乙方程式為 ${M(sq('(x + 9)') + ' ＝ −4')}。關於甲、乙兩方程式的解的情形，下列敘述何者正確？`,
        options: [{ t: '甲有兩個相異的解，乙無解', ok: true, why: '甲：x − 4 ＝ ±3 → x ＝ 7 或 1。乙：平方不可能是 −4。' }, { t: '甲有兩個相異的解，乙有兩個相異的解', why: '乙的右邊是 −4，平方不會是負的。' }, { t: '甲有兩個相同的解，乙無解', why: '甲：x − 4 ＝ 3 或 −3，兩個解不一樣。' }, { t: '甲有兩個相同的解，乙有兩個相異的解', why: '甲有兩個不同的解；乙無解。' }],
        explain: '<p>甲：(x − 4)² ＝ 9 → x − 4 ＝ ±3 → x ＝ 7 或 x ＝ 1，兩個相異的解。<br>乙：(x + 9)² ＝ −4，平方不可能是負數 → 無解。答案 (A)。<br>💡 題目故意把 4、9 兩個數字對調來混淆，只要看<b>等號右邊的正負</b>。</p>',
        steps: [
          { q: `甲：${M(sq('(x − 4)') + ' ＝ 9')}。x − 4 ＝ ？`, options: [{ t: '3 或 −3', ok: true, why: '所以 x ＝ 7 或 x ＝ 1，兩個不同的解。' }, { t: '只有 3', why: '(−3)² 也是 9。' }] },
          { q: `乙：${M(sq('(x + 9)') + ' ＝ −4')}。等號右邊是負的，代表？`, options: [{ t: '無解：平方不可能是負的', ok: true, why: '不管 x 是多少，(x + 9)² 都 ≥ 0。' }, { t: 'x + 9 ＝ ±2', why: '(±2)² ＝ ＋4，不是 −4。' }] }
        ] },
      { stars: 3, src: '112 年會考 第 10 題', q: `利用公式解可得一元二次方程式 ${M('3' + X2 + ' − 11x − 1 ＝ 0')} 的兩解為 a、b，且 a ＞ b，求 a 值為何？`,
        options: [{ t: F('−11 + ' + R(109), 6), why: '−b 是 ＋11；D 也不對。' }, { t: F('−11 + ' + R(133), 6), why: 'b ＝ −11，所以 −b ＝ ＋11。' }, { t: F('11 + ' + R(109), 6), why: 'c 是 −1：121 − 4 × 3 × (−1) ＝ 121 ＋ 12。' }, { t: F('11 + ' + R(133), 6), ok: true, why: '−b ＝ 11，D ＝ 133，2a ＝ 6，較大的解取「＋」。' }],
        explain: `<p>a ＝ 3、b ＝ −11、c ＝ −1。<br>D ＝ (−11)² − 4 × 3 × (−1) ＝ 121 ＋ 12 ＝ 133。<br>x ＝ ${F('11 ± ' + R(133), 6)}，比較大的取「＋」。答案 (D)。<br>💡 四個選項只差在「±11」和「109 / 133」：就是考 −b 和 −4ac 的符號。</p>`,
        steps: [
          { q: '這題的 a、b、c 是？（注意題目的 a、b 是「兩個解」，跟公式的 a、b 不同）', options: [{ t: '3、−11、−1', ok: true, why: '連符號一起看。' }, { t: '3、11、1', why: '中間是 −11x，最後是 −1。' }] },
          { num: true, q: 'D ＝ (−11)² − 4 × 3 × (−1) ＝ ？', pre: 'D ＝', answer: 133, diag: [{ v: 109, msg: '「− 4 × 3 × (−1)」是 ＋12，不是 −12。' }] },
          { q: '−b ＝ ？', options: [{ t: '11', ok: true, why: '−(−11) ＝ 11。所以較大的解是 (11 ＋ √133) / 6。' }, { t: '−11', why: 'b 本身是 −11，前面再加一個負號。' }] }
        ] }
    ]);
  }

  K.run('4-2b', ['先猜猜看：一定有解嗎？', '動手玩：判別式', '收成 4 句話', '會考題改寫版', '實戰：會考原題與模擬題'], { guess, play, know, exam, real });
})();
