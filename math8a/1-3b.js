/* ===== 數學 1-3b 多項式的除法 ===== */
(function () {
  'use strict';
  const U = Unit4, h = U.h, K = MK, Q = MK2, M = K.M, X2 = K.X2;
  const P = cs => M(Q.polyN(cs));

  // 長除法一步一步：每按一次「下一步」做一輪「除 → 乘 → 減 → 降」
  const PROBS = [
    { N: [1, 5, 6], D: [1, 2], t: '(x² + 5x + 6) ÷ (x + 2)' },
    { N: [1, 0, -7], D: [1, -2], t: '(x² − 7) ÷ (x − 2)' },
    { N: [2, -1, 3, -5], D: [1, -1], t: '(2x³ − x² + 3x − 5) ÷ (x − 1)' }
  ];
  function divSim(host, on) {
    host.appendChild(h('<p class="sim-h">長除法：每一輪「除 → 乘 → 減 → 降」</p>'));
    const ch = h('<div></div>'), box = h('<div></div>'), read = h('<div class="sim-read"></div>');
    const row = h('<div class="row"><button type="button" class="btn primary">下一步 ▶</button><button type="button" class="btn">重來</button></div>');
    let pi = 0, k = 0;
    const done = PROBS.map(() => false);
    function draw() {
      const pr = PROBS[pi];
      box.innerHTML = '';
      const R = Q.longDiv(box, pr.N, pr.D, k, { zero: true });
      const total = R.steps.length;
      if (k === 0) read.innerHTML = `題目：${M(Q.polyN(pr.N, 'x', true))} ÷ ${P(pr.D)}<br>按「下一步」開始。${pr.N.indexOf(0) > 0 ? '<br><span class="small">注意：缺的項先補 <b>0</b>，位置才會對齊。</span>' : ''}`;
      else {
        const st = R.steps[k - 1], deg = pr.N.length - pr.D.length - (k - 1);
        read.innerHTML = `第 ${k} 輪：<b>除</b> 第一項 ÷ ${M(Q.term(pr.D[0], pr.D.length - 1, true))} → 商寫 ${M(Q.term(st.c, deg, true, 'x', true))}；<b>乘</b> 回除式（黃底）；<b>減</b>；<b>降</b> 下一項。`;
        if (k === total) { read.innerHTML += `<br><b style="color:var(--good)">做完了！商式 ${P(R.Q)}，餘式 ${P(R.R)}</b>`; done[pi] = true; }
      }
      row.firstChild.disabled = k >= total;
    }
    U.chips(ch, '題目', PROBS.map((p, i) => ({ v: i, t: p.t })), 0, v => { pi = v; k = 0; draw(); on(); });
    row.firstChild.addEventListener('click', () => { k++; draw(); on(); });
    row.lastChild.addEventListener('click', () => { k = 0; draw(); on(); });
    host.append(ch, box, row, read); draw();
    return { get pi() { return pi; }, done: i => done[i] };
  }

  function guess(p, api) {
    U.guess(p, api, [
      { q: '17 ÷ 5 ＝ 3 餘 2。下列哪一個算式一定成立？', options: [{ t: '17 ＝ 5 × 3 ＋ 2', ok: true }, { t: '17 ＝ 5 × 2 ＋ 3' }, { t: '5 ＝ 17 × 3 ＋ 2' }],
        reveal: '<b>被除數 ＝ 除數 × 商 ＋ 餘數</b>。多項式除法也是這條，等一下拿來驗算。' },
      { pic: c => K.boxPic(c, 3, 2, 220), q: `面積 ${P([1, 5, 6])} 的長方形，寬是 x + 2，長是多少？`, options: [{ t: 'x + 3', ok: true }, { t: 'x + 4' }, { t: 'x + 6' }],
        reveal: '(x + 2)(x + 3) ＝ x² ＋ 5x ＋ 6，所以 (x² + 5x + 6) ÷ (x + 2) ＝ <b>x + 3</b>。不好猜的時候，就用<b>長除法</b>一步一步算。' }
    ]);
  }

  function play(p, api) {
    let S;
    const card = h('<div class="card"></div>'); p.appendChild(card);
    const tk = U.tasks(p, api, [
      { text: '第 1 題 (x² + 5x + 6) ÷ (x + 2)：一直按「下一步」做到完。', check: () => S.done(0),
        qs: () => [{ q: '第一輪：x² ÷ x 為什麼商寫 x？', options: [{ t: '因為 x × x ＝ x²', ok: true, why: '每一輪只看「第一項 ÷ 除式的第一項」。' }, { t: '因為 5x ÷ 5 ＝ x', why: '只看最前面那一項：x² ÷ x。' }] },
          { q: '答案：商式 x + 3、餘式 0。驗算：', options: [{ t: '(x + 2)(x + 3) ＋ 0 ＝ x² ＋ 5x ＋ 6 ✔', ok: true, why: '被除數 ＝ 除式 × 商式 ＋ 餘式。' }, { t: '(x + 3) ÷ (x + 2) ＝ 1', why: '驗算要用乘的。' }] }],
        found: '長除法每一輪：<b>除</b>（看第一項）→ <b>乘</b>（商 × 除式）→ <b>減</b> → <b>降</b>（搬下一項）。' },
      { text: '選第 2 題 (x² − 7) ÷ (x − 2)，做到完。', check: () => S.done(1),
        qs: () => [{ q: '被除數寫成 x² ＋ 0x − 7。為什麼要補 0x？', options: [{ t: '讓同次方的項上下對齊', ok: true, why: '不補的話，−7 會被對到 x 那一欄，算錯。' }, { t: '因為 0x 會改變答案', why: '0x 不改變值，只是佔位子。' }] },
          { num: true, signed: true, q: '商式是 x ＋ 2，餘式是多少？', pre: '餘式 ＝', answer: -3, hint: '看最後一列。', diag: [{ v: 3, msg: '−7 − (−4) ＝ −3。' }] }],
        found: '<b>缺項補 0</b>。餘式的次數一定<b>比除式小</b>（除式一次 → 餘式是常數）。' },
      { text: '選第 3 題（三次 ÷ 一次），做到完。', check: () => S.done(2),
        qs: () => [{ q: '三次式 ÷ 一次式，商式是幾次？', options: [{ t: '二次', ok: true, why: '3 − 1 ＝ 2：商是 2x² ＋ x ＋ 4。' }, { t: '三次', why: 'x³ ÷ x ＝ x²，次數相減。' }] },
          { num: true, signed: true, q: '餘式是多少？', pre: '餘式 ＝', answer: -1, why: '驗算：(x − 1)(2x² ＋ x ＋ 4) ＋ (−1) ＝ 2x³ − x² ＋ 3x − 5 ✔' }],
        found: '商式次數 ＝ 被除式次數 − 除式次數。做完一定用「除式 × 商式 ＋ 餘式」驗算。' }
    ]);
    S = divSim(card, () => tk.check());
    card.appendChild(tk.slot); p.insertBefore(p.querySelector('.u4-task'), card); tk.start();
  }

  function know(p, api) {
    p.appendChild(h('<p class="muted">把剛剛玩到的，收成 4 句話。</p>'));
    Q.longDiv(U.card(p, '① 長除法四動作', '<p><b>除</b>：第一項 ÷ 除式第一項<br><b>乘</b>：商 × 除式<br><b>減</b>：上下相減（注意變號）<br><b>降</b>：搬下一項，重複</p>'), [1, 5, 6], [1, 2], 2);
    Q.longDiv(U.card(p, '② 缺項補 0', `<p>${M(X2 + ' − 7')} 寫成 ${M(X2 + ' + 0x − 7')}，位置才會對齊。</p>`), [1, 0, -7], [1, -2], 2, { zero: true });
    K.table(U.card(p, '③ 驗算', '<p><b>被除式 ＝ 除式 × 商式 ＋ 餘式</b></p>'), ['被除式', '除式', '商式', '餘式'], [['x² + 5x + 6', 'x + 2', 'x + 3', '0'], ['x² − 7', 'x − 2', 'x + 2', '−3'], ['2x² − 3', 'x + 1', '2x − 2', '−1']], 400);
    K.table(U.card(p, '④ 餘式次數 ＜ 除式次數', '<p>除到「剩下的次數比除式小」就停。<br>例：(6x² + 4x) ÷ 2x²：商 3，<b>餘式 4x</b>（4x 是一次，比 2x² 小，不能再除）。</p>'), ['除式', '餘式可能是'], [['一次（x + 2）', '常數'], ['二次（2x²）', '一次或常數']], 300);
    const c = h('<div class="card"><h3>✏️ 檢查一下</h3></div>'); p.appendChild(c);
    U.numq(c, { q: '(x² + 3x − 1) ÷ (x + 1)，商式是 x ＋ 2，餘式是多少？', pre: '餘式 ＝', signed: true, answer: -3, hint: '用驗算：(x + 1)(x + 2) ＝ x² ＋ 3x ＋ 2，差多少到 x² ＋ 3x − 1？', diag: [{ v: 3, msg: '−1 − 2 ＝ −3。' }, { v: 1, msg: '用驗算公式再算一次。' }], why: '(x + 1)(x + 2) ＋ (−3) ＝ x² ＋ 3x − 1 ✔', onDone() { api.done(); } });
  }

  function exam(p, api) {
    U.exam(p, api, {
      intro: '這兩題是照會考題的樣子改寫的。答錯可以再選。',
      benchLabel: '想一步一步算？打開長除法模擬',
      bench: host => divSim(host, () => {}),
      qs: [
        { src: '改寫自 111 年會考第 2 題', q: `計算多項式 ${M('4' + X2 + ' + 6x')} 除以 ${M('2' + X2)} 後，得到的餘式為何？`, hint: '4x² ÷ 2x² ＝ 2，剩下的 6x 次數比 2x² 小。',
          options: [{ t: '2', why: '2 是商式。' }, { t: '3', why: '6x 不能再被 2x² 除。' }, { t: '6x', ok: true, why: '商 2，2 × 2x² ＝ 4x²，剩 6x（一次 ＜ 二次）。' }, { t: '3x', why: '餘式是剩下的 6x，不用再除。' }] },
        { src: '改寫自 115 年會考第 7 題', q: `計算多項式 ${M(X2 + ' + 2x + 5')} 除以 ${M('x + 1')} 後，所得商式與餘式兩者之和為何？`, hint: '商式 x ＋ 1，餘式 4。',
          options: [{ t: 'x + 5', ok: true, why: '(x + 1)(x + 1) ＋ 4 ＝ x² ＋ 2x ＋ 5，商 x ＋ 1、餘 4，和 x ＋ 5。' }, { t: 'x + 1', why: '這只是商式，還要加餘式 4。' }, { t: 'x + 3', why: '再驗算：(x + 1)² ＝ x² ＋ 2x ＋ 1，差 4。' }, { t: '2x + 5', why: '商式是 x ＋ 1。' }] }
      ]
    });
  }

  function real(p, api) {
    U.real(p, api, [
      { stars: 1, src: '109 年會考 第 7 題', q: `計算 ${M('2' + X2 + ' − 3')} 除以 ${M('x + 1')} 後，得商式和餘式分別為何？`,
        options: [{ t: '商式為 2，餘式為 −5', why: '2x² ÷ x ＝ 2x，商是一次。' }, { t: '商式為 2x − 5，餘式為 5', why: '缺 x 項要補 0x 再算。' }, { t: '商式為 2x + 2，餘式為 −1', why: '第二輪：0x − 2x ＝ −2x，商是 −2。' }, { t: '商式為 2x − 2，餘式為 −1', ok: true, why: '驗算：(x + 1)(2x − 2) − 1 ＝ 2x² − 2 − 1 ＝ 2x² − 3 ✔' }],
        explain: '<p>補 0x：2x² ＋ 0x − 3。<br>第一輪：2x² ÷ x ＝ 2x，2x(x + 1) ＝ 2x² ＋ 2x，相減得 −2x − 3。<br>第二輪：−2x ÷ x ＝ −2，−2(x + 1) ＝ −2x − 2，相減得 −1。<br>商式 2x − 2，餘式 −1。答案 (D)。</p>',
        steps: [
          { pic: false, q: '2x² − 3 少了哪一項？', options: [{ t: 'x 項，要補 0x', ok: true, why: '寫成 2x² ＋ 0x − 3。' }, { t: '沒有少', why: '中間的 x 項不見了。' }] },
          { pic: false, q: '第一輪：2x² ÷ x ＝ 2x，2x × (x + 1) ＝ 2x² ＋ 2x。相減後剩？', options: [{ t: '−2x − 3', ok: true, why: '0x − 2x ＝ −2x，再降 −3。' }, { t: '2x − 3', why: '0x − 2x ＝ −2x。' }] },
          { num: true, signed: true, pic: false, q: '第二輪：−2x ÷ x ＝ −2，−2(x + 1) ＝ −2x − 2。−3 − (−2) ＝ ？（餘式）', pre: '餘式 ＝', answer: -1 }
        ] },
      { stars: 2, src: '115 年會考 第 7 題', q: `計算多項式 ${M('4' + X2 + ' − 3x − 5')} 除以 ${M('x + 2')} 後，所得商式與餘式兩者之和為何？`,
        options: [{ t: '4x + 6', ok: true, why: '商 4x − 11、餘 17，相加 4x ＋ 6。' }, { t: '4x + 10', why: '再檢查第二輪：−11x ÷ x ＝ −11。' }, { t: '−7x − 5', why: '商式第一項是 4x² ÷ x ＝ 4x。' }, { t: '−11x − 1', why: '再做一次長除法。' }],
        explain: '<p>第一輪：4x² ÷ x ＝ 4x，4x(x + 2) ＝ 4x² ＋ 8x，相減 −11x − 5。<br>第二輪：−11x ÷ x ＝ −11，−11(x + 2) ＝ −11x − 22，相減 −5 ＋ 22 ＝ 17。<br>商式 4x − 11，餘式 17，和 ＝ 4x ＋ 6。答案 (A)。</p>',
        steps: [
          { q: '第一輪：4x² ÷ x ＝ 4x。4x × (x + 2) ＝ 4x² ＋ 8x。−3x − 8x ＝ ？', options: [{ t: '−11x', ok: true, why: '−3 − 8 ＝ −11。' }, { t: '5x', why: '是減 8x：−3x − 8x。' }] },
          { num: true, q: '第二輪：−11 × (x + 2) ＝ −11x − 22。−5 − (−22) ＝ ？（餘式）', pre: '餘式 ＝', answer: 17, diag: [{ v: -27, msg: '減一個負數 ＝ 加：−5 ＋ 22。' }] },
          { q: '商式 4x − 11 ＋ 餘式 17 ＝ ？', options: [{ t: '4x + 6', ok: true, why: '−11 ＋ 17 ＝ 6。' }, { t: '4x − 28', why: '−11 ＋ 17 ＝ 6。' }] }
        ] },
      { stars: 3, src: '104 年會考 第 6 題', q: `計算多項式 ${M('−2x(3x − 2)<sup>2</sup> + 3')} 除以 ${M('3x − 2')} 後，所得商式與餘式兩者之和為何？`,
        options: [{ t: '−2x + 3', why: '−2x(3x − 2)² 除以 (3x − 2) 還剩一個 (3x − 2)。' }, { t: `−6${X2} + 4x`, why: '這是商式，還要加餘式 3。' }, { t: `−6${X2} + 4x + 3`, ok: true, why: '商式 −2x(3x − 2) ＝ −6x² ＋ 4x，餘式 3。' }, { t: `−6${X2} − 4x + 3`, why: '−2x × (−2) ＝ ＋4x。' }],
        explain: '<p>聰明做法：用「被除式 ＝ 除式 × 商式 ＋ 餘式」的樣子去看：<br>−2x(3x − 2)² ＋ 3 ＝ (3x − 2) × [−2x(3x − 2)] ＋ 3。<br>3 是常數，次數比 3x − 2 小，所以它就是餘式。<br>商式 ＝ −2x(3x − 2) ＝ −6x² ＋ 4x，商式 ＋ 餘式 ＝ −6x² ＋ 4x ＋ 3。答案 (C)。<br>（也可以全部展開成 −18x³ ＋ 24x² − 8x ＋ 3 再做長除法，答案一樣。）</p>',
        steps: [
          { q: '(3x − 2)² ＝ (3x − 2) × (3x − 2)。−2x(3x − 2)² 除以 (3x − 2) 會剩下什麼？', options: [{ t: '−2x(3x − 2)', ok: true, why: '拿掉一個 (3x − 2)。' }, { t: '−2x', why: '平方有兩個 (3x − 2)，只拿掉一個。' }] },
          { q: '後面的 ＋3 呢？', options: [{ t: '它就是餘式（常數，次數比除式小）', ok: true, why: '被除式 ＝ (3x − 2) × 商 ＋ 3。' }, { t: '要再除以 3x − 2', why: '3 是常數，比一次式小，不能再除。' }] },
          { q: '商式 −2x(3x − 2) 展開是？', options: [{ t: `−6${X2} + 4x`, ok: true, why: '−2x × 3x ＝ −6x²，−2x × (−2) ＝ ＋4x。' }, { t: `−6${X2} − 4x`, why: '負 × 負 ＝ 正。' }] }
        ] }
    ]);
  }

  K.run('1-3b', ['先猜猜看：被除數 ＝ 除數 × 商 ＋ 餘數', '動手玩：長除法一步一步', '收成 4 句話', '會考題改寫版', '會考實戰：照原題做做看'], { guess, play, know, exam, real });
})();
