/* ===== 數學 2-1a 平方根 ===== */
(function () {
  'use strict';
  const U = Unit4, h = U.h, K = MK, Q = MK2, M = K.M, R = K.sqrt;

  function sqSim(host, on) {
    host.appendChild(h('<p class="sim-h">拉面積，看正方形的邊長是多少</p>'));
    const pic = h('<div></div>'), read = h('<div class="sim-read"></div>');
    let A = 9;
    function draw() {
      pic.innerHTML = ''; Q.areaSq(pic, A, { cls: 'sim', max: 280 });
      const s = Math.sqrt(A), ok = Number.isInteger(s);
      read.innerHTML = `面積 <b>${A}</b> → 邊長 ${ok ? `<b>${s}</b>（${s} × ${s} ＝ ${A}）` : `<b>${R(A)}</b> ≈ ${s.toFixed(3)}（不是整數，在 ${Math.floor(s)} 和 ${Math.floor(s) + 1} 之間）`}<br>${A} 的平方根：<b>±${ok ? s : R(A)}</b>　${ok ? `（${s}² ＝ ${A}，(−${s})² 也 ＝ ${A}）` : ''}`;
    }
    host.appendChild(pic);
    U.slider(host, '面積', { min: 1, max: 100, step: 1, value: A }, v => { A = v; draw(); on(); });
    host.appendChild(read); draw();
    return { get A() { return A; } };
  }

  function guess(p, api) {
    U.guess(p, api, [
      { pic: c => Q.areaSq(c, 49, { label: '?' }), q: '面積 49 的正方形，邊長是多少？', options: [{ t: '7', ok: true }, { t: '24.5' }, { t: '49' }],
        reveal: '7 × 7 ＝ 49，邊長 <b>7</b>。「誰的平方是 49？」這個問題的答案叫做 49 的<b>平方根</b>。' },
      { pic: c => Q.areaSq(c, 2, { label: '?' }), q: '面積 2 的正方形，邊長是整數嗎？', options: [{ t: '是，1' }, { t: '不是，在 1 和 2 之間', ok: true }, { t: '是，2' }],
        reveal: '1² ＝ 1 太小、2² ＝ 4 太大，邊長在 1 和 2 之間。這個數寫成 <b>√2</b>（讀「根號 2」），大約 1.414。' }
    ]);
  }

  function play(p, api) {
    let S;
    const card = h('<div class="card"></div>'); p.appendChild(card);
    const tk = U.tasks(p, api, [
      { text: '把面積拉到 <b>36</b>。', check: () => S.A === 36,
        qs: () => [{ q: '哪些數的平方是 36？', options: [{ t: '6 和 −6', ok: true, why: '(−6) × (−6) 也是 36。' }, { t: '只有 6', why: '負負得正：(−6)² ＝ 36。' }, { t: '18', why: '18² ＝ 324。平方是「自己乘自己」，不是乘 2。' }] }],
        found: 'a 的<b>平方根</b>：平方之後等於 a 的數。正數有<b>兩個</b>平方根，一正一負：36 的平方根是 ±6。' },
      { text: '把面積拉到 <b>2</b>，再拉到 <b>3</b>。', check: () => S.A === 3,
        qs: () => [{ q: '√3 大約是多少？（看讀數）', options: [{ t: '1.732', ok: true, why: '1.732² ≈ 3。' }, { t: '1.5', why: '1.5² ＝ 2.25，太小。' }, { t: '3', why: '3² ＝ 9。' }] }],
        found: '平方根不是整數時，用<b>根號</b>表示：正的寫 √3，負的寫 −√3。' },
      { text: '想一想（不用模擬了）。', quiet: true, check: () => true,
        qs: () => [
          { q: `${M(R('(−5)<sup>2</sup>'))} ＝ ？`, options: [{ t: '5', ok: true, why: '先算裡面：(−5)² ＝ 25，√25 ＝ 5。√ 一定是正的（或 0）。' }, { t: '−5', why: '√ 代表「正的」平方根。' }, { t: '±5', why: '√25 只取正的；±√25 才是兩個。' }] },
          { q: '−9 有平方根嗎？', options: [{ t: '沒有', ok: true, why: '任何數的平方都 ≥ 0，不會等於 −9。' }, { t: '有，±3', why: '3² 和 (−3)² 都是 ＋9。' }] }],
        found: '√a 只代表<b>正的</b>那個（√25 ＝ 5）。<b>0 的平方根是 0</b>；<b>負數沒有平方根</b>。' }
    ]);
    S = sqSim(card, () => tk.check());
    card.appendChild(tk.slot); p.insertBefore(p.querySelector('.u4-task'), card); tk.start();
  }

  function know(p, api) {
    p.appendChild(h('<p class="muted">把剛剛玩到的，收成 4 句話。</p>'));
    Q.areaSq(U.card(p, '① 平方根', `<p>x² ＝ a，x 就是 a 的平方根：<b>x ＝ ±${R('a')}</b></p><p>例：25 的平方根是 ±5。</p>`), 25);
    K.table(U.card(p, '② 要背的完全平方數', '<p>看到這些數，馬上知道平方根。</p>'), ['n', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'], [['n²', '121', '144', '169', '196', '225', '256', '289', '324', '361', '400']], 460);
    K.table(U.card(p, `③ ${R('a<sup>2</sup>')} 永遠是正的`, '<p>先平方再開根號，負號就不見了。</p>'), ['算式', '值'], [[`${R('3<sup>2</sup>')}`, '3'], [`${R('(−3)<sup>2</sup>')}`, '3'], [`(${R('3')})<sup>2</sup>`, '3'], [`−${R('9')}`, '−3']], 300);
    Q.areaSq(U.card(p, '④ 0 和負數', '<p>0 的平方根只有 0。<br>負數<b>沒有</b>平方根（平方不會是負的）。</p><p>√2 ≈ 1.414，√3 ≈ 1.732，√5 ≈ 2.236</p>'), 2);
    const c = h('<div class="card"><h3>✏️ 檢查一下</h3></div>'); p.appendChild(c);
    U.choice(c, { q: '81 的平方根是？', options: [{ t: '9', why: '81 有兩個平方根。' }, { t: '±9', ok: true, why: '9² ＝ (−9)² ＝ 81。' }, { t: '40.5', why: '平方根不是除以 2。' }, { t: '±3', why: '±3 是 9 的平方根。' }], onDone() { api.done(); } });
  }

  function exam(p, api) {
    U.exam(p, api, {
      intro: '這兩題是照會考題的樣子改寫的。答錯可以再選。',
      benchLabel: '想看邊長？打開正方形模擬',
      bench: host => sqSim(host, () => {}),
      qs: [
        { src: '改寫自 106 年會考第 2 題', q: '下列哪一個等式成立？', hint: '先算根號裡面。',
          options: [{ t: `${R('3<sup>2</sup>')} ＝ 3`, ok: true, why: '√9 ＝ 3 ✔' }, { t: `${R('2<sup>4</sup>')} ＝ 2`, why: '√16 ＝ 4。' }, { t: `${R('4<sup>2</sup>')} ＝ 16`, why: '√16 ＝ 4。' }, { t: `${R('(−5)<sup>2</sup>')} ＝ −5`, why: '√25 ＝ 5，根號一定是正的。' }] },
        { src: '改寫自 106 年會考第 25 題', q: '計算機上螢幕顯示 16。小華先按「√」，再按「x²」，再按「√」，再按「x²」……一直輪流按。按了第 7 下後，螢幕顯示多少？', hint: '16 → 4 → 16 → 4 …，兩下一循環。',
          options: [{ t: '16', why: '單數下是剛按完 √。' }, { t: '4', ok: true, why: '第 1、3、5、7 下按 √，都變成 4。' }, { t: '2', why: '√ 和 x² 會互相抵消，不會一直變小。' }, { t: '256', why: '第 7 下是按 √。' }] }
      ]
    });
  }

  const calc = host => U.svg(host, '0 0 300 70', `<rect x="4" y="6" width="292" height="58" rx="10" fill="none" stroke="var(--stroke)" stroke-width="1.5"/>
    ${['√', '1/x', 'x²'].map((t, i) => `<rect x="${20 + i * 90}" y="18" width="70" height="34" rx="6" fill="#e9eef5" stroke="var(--stroke)"/><text x="${55 + i * 90}" y="41" text-anchor="middle" class="t14b" style="fill:#333">${t}</text>`).join('')}`, '計算機按鍵', 'u4-pic');
  function real(p, api) {
    U.real(p, api, [
      { stars: 1, src: '106 年會考 第 2 題', q: '下列哪一個選項中的等式成立？',
        options: [{ t: `${R('2<sup>2</sup>')} ＝ 2`, ok: true, why: '√4 ＝ 2 ✔' }, { t: `${R('3<sup>3</sup>')} ＝ 3`, why: '√27 不是 3（√9 才是）。' }, { t: `${R('4<sup>4</sup>')} ＝ 4`, why: '√256 ＝ 16。' }, { t: `${R('5<sup>5</sup>')} ＝ 5`, why: '√3125 不是 5。' }],
        explain: '<p>√(a²) ＝ a（a ≥ 0）。只有 (A) 根號裡是「平方」：√(2²) ＝ √4 ＝ 2。答案 (A)。</p>',
        steps: [
          { num: true, q: '2² ＝ ？', pre: '', answer: 4 },
          { num: true, q: '√4 ＝ ？', pre: '', answer: 2 },
          { q: '(B) √(3³) ＝ √27。27 是完全平方數嗎？', options: [{ t: '不是（5² ＝ 25、6² ＝ 36）', ok: true, why: '所以 √27 不是整數，更不是 3。' }, { t: '是，√27 ＝ 3', why: '3² ＝ 9，不是 27。' }] }
        ] },
      { stars: 2, src: '106 年會考 第 25 題', pic: calc, q: '某計算機中有 √、1/x、x² 三個按鍵：√ 把螢幕的數變成它的正平方根；1/x 變成它的倒數；x² 變成它的平方。若螢幕顯示的數為 100 時，小劉第一下按 √，第二下按 1/x，第三下按 x²，之後以 √、1/x、x² 的順序輪流按，則當他按了第 100 下後螢幕顯示的數是多少？',
        options: [{ t: '0.01', why: '0.01 是第 3、9、15…下。' }, { t: '0.1', ok: true, why: '6 下一循環，100 ＝ 6 × 16 ＋ 4，跟第 4 下一樣：0.1。' }, { t: '10', why: '10 是第 1、5 下。' }, { t: '100', why: '100 是第 6、12…下。' }],
        explain: '<p>100 → √ → 10 → 1/x → 0.1 → x² → 0.01 → √ → 0.1 → 1/x → 10 → x² → 100。<br>按 6 下回到 100，6 下一循環。100 ÷ 6 ＝ 16 餘 4，所以跟第 4 下一樣：0.1。答案 (B)。</p>',
        steps: [
          { q: '第 1 下 √100 ＝ 10；第 2 下 1/10 ＝ 0.1；第 3 下 0.1² ＝ ？', options: [{ t: '0.01', ok: true, why: '0.1 × 0.1。' }, { t: '0.2', why: '平方是自己乘自己。' }] },
          { q: '第 4 下 √0.01 ＝ 0.1；第 5 下 1/0.1 ＝ 10；第 6 下 10² ＝ 100。發現什麼？', options: [{ t: '6 下回到 100，一直循環', ok: true, why: '所以看 100 除以 6 的餘數。' }, { t: '越來越小', why: '第 6 下又回到 100 了。' }] },
          { num: true, q: '100 ÷ 6 的餘數是？', pre: '餘', answer: 4, why: '所以跟第 4 下一樣：0.1。' }
        ] },
      { stars: 3, src: K.SIM, q: '已知某正數的兩個平方根分別是 2m − 3 和 m ＋ 6，則這個正數是多少？',
        options: [{ t: '9', why: '先求 m：兩個平方根相加 ＝ 0。' }, { t: '25', ok: true, why: '(2m − 3) ＋ (m + 6) ＝ 0 → m ＝ −1，兩根 −5、5，正數 25。' }, { t: '81', why: '再檢查 m：3m ＋ 3 ＝ 0。' }, { t: '−1', why: '−1 是 m，題目問的是那個正數。' }],
        explain: '<p>正數的兩個平方根互為相反數，相加 ＝ 0：(2m − 3) ＋ (m ＋ 6) ＝ 3m ＋ 3 ＝ 0 → m ＝ −1。<br>兩個平方根是 −5 和 5，所以這個正數是 25。答案 (B)。</p>',
        steps: [
          { q: '一個正數的兩個平方根，有什麼關係？', options: [{ t: '一正一負、加起來是 0', ok: true, why: '例如 ±5。' }, { t: '一樣大', why: '例如 25 的平方根是 5 和 −5，不一樣。' }] },
          { num: true, signed: true, q: '(2m − 3) ＋ (m ＋ 6) ＝ 0，m ＝ ？', pre: 'm ＝', answer: -1, diag: [{ v: 1, msg: '3m ＋ 3 ＝ 0 → m ＝ −1。' }] },
          { num: true, q: 'm ＝ −1，m ＋ 6 ＝ 5。這個正數 ＝ 5² ＝ ？', pre: '', answer: 25 }
        ] }
    ]);
  }

  K.run('2-1a', ['先猜猜看：正方形的邊長', '動手玩：面積 ↔ 邊長', '收成 4 句話', '會考題改寫版', '會考實戰：照原題做做看'], { guess, play, know, exam, real });
})();
