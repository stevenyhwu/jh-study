/* ===== 數學 2-2b 根式的四則運算 ===== */
(function () {
  'use strict';
  const U = Unit4, h = U.h, K = MK, Q = MK2, R = K.sqrt;

  function rulerSim(host, on) {
    host.appendChild(h('<p class="sim-h">兩段長度接起來，總長是多少？能不能合併？</p>'));
    const pic = h('<div></div>'), read = h('<div class="sim-read"></div>');
    let a = 2, m = 3, b = 3, n = 3;
    function draw() {
      const L1 = a * Math.sqrt(m), L2 = b * Math.sqrt(n), W = 340, u = (W - 40) / 22, x = v => 20 + v * u;
      let s = `<line x1="20" y1="60" x2="${W - 20}" y2="60" stroke="var(--stroke)"/>`;
      for (let t = 0; t <= 22; t += 2) s += `<line x1="${x(t)}" y1="55" x2="${x(t)}" y2="65" stroke="var(--stroke)"/><text x="${x(t)}" y="80" text-anchor="middle" class="t12">${t}</text>`;
      s += `<rect x="${x(0)}" y="22" width="${L1 * u}" height="22" fill="#f6c26b" fill-opacity=".7" stroke="var(--stroke)"/><text x="${x(L1 / 2)}" y="38" text-anchor="middle" class="t12b">${a === 1 ? '' : a}√${m}</text>`;
      s += `<rect x="${x(L1)}" y="22" width="${L2 * u}" height="22" fill="#9fd3a8" fill-opacity=".7" stroke="var(--stroke)"/><text x="${x(L1 + L2 / 2)}" y="38" text-anchor="middle" class="t12b">${b === 1 ? '' : b}√${n}</text>`;
      pic.innerHTML = ''; U.svg(pic, `0 0 ${W} 88`, s, '根式尺', 'sim');
      const s1 = Q.simp(m), s2 = Q.simp(n), like = s1.m === s2.m;
      read.innerHTML = `${a === 1 ? '' : a}${R(m)} ＋ ${b === 1 ? '' : b}${R(n)} ≈ ${L1.toFixed(3)} ＋ ${L2.toFixed(3)} ＝ <b>${(L1 + L2).toFixed(3)}</b><br>先化簡：${Q.rootTxt(a * s1.s, s1.m)} ＋ ${Q.rootTxt(b * s2.s, s2.m)}　→　${like ? `<b style="color:var(--good)">同類根式，可以合併 ＝ ${Q.rootTxt(a * s1.s + b * s2.s, s1.m)}</b>` : `<span style="color:${K.NEG}">根號裡不一樣，不能合併</span>`}`;
    }
    host.appendChild(pic);
    const ms = [2, 3, 5, 8, 12, 18].map(v => ({ v, t: '√' + v }));
    U.slider(host, '第一段係數 a', { min: 1, max: 4, step: 1, value: a }, v => { a = v; draw(); on(); });
    U.chips(host, '第一段根號', ms, m, v => { m = v; draw(); on(); });
    U.slider(host, '第二段係數 b', { min: 1, max: 4, step: 1, value: b }, v => { b = v; draw(); on(); });
    U.chips(host, '第二段根號', ms, n, v => { n = v; draw(); on(); });
    host.appendChild(read); draw();
    return { is: (A, Mm, B, N) => a === A && m === Mm && b === B && n === N };
  }

  function guess(p, api) {
    U.guess(p, api, [
      { q: `${R(2)} ＋ ${R(3)} ＝ ${R(5)} 嗎？`, options: [{ t: '對' }, { t: '不對', ok: true }],
        reveal: '√2 ＋ √3 ≈ 1.414 ＋ 1.732 ＝ 3.146，√5 ≈ 2.236。<b>不一樣！</b>根號不能直接加在一起。' },
      { q: `2${R(3)} ＋ 5${R(3)} ＝ ？`, options: [{ t: `7${R(3)}`, ok: true }, { t: `7${R(6)}` }, { t: `10${R(3)}` }],
        reveal: '像 2 顆蘋果 ＋ 5 顆蘋果 ＝ 7 顆蘋果：<b>7√3</b>。根號裡一樣的才能合併。' }
    ]);
  }

  function play(p, api) {
    let S;
    const card = h('<div class="card"></div>'); p.appendChild(card);
    const tk = U.tasks(p, api, [
      { text: `接成 2${R(3)} ＋ 3${R(3)}（a ＝ 2、√3；b ＝ 3、√3）。`, check: () => S.is(2, 3, 3, 3),
        qs: () => [{ q: '總長是幾個 √3？', options: [{ t: `5${R(3)}`, ok: true, why: '2 段 ＋ 3 段一樣的 √3。' }, { t: `5${R(6)}`, why: '根號裡不相加：還是 √3。' }] }],
        found: '<b>同類根式</b>（根號裡一樣）才能合併：係數相加，根號照抄。' },
      { text: `接成 ${R(2)} ＋ ${R(8)}（a ＝ 1、√2；b ＝ 1、√8）。`, check: () => S.is(1, 2, 1, 8),
        qs: () => [{ q: '√8 化簡是 2√2，所以 √2 ＋ √8 ＝ ？', options: [{ t: `3${R(2)}`, ok: true, why: '√2 ＋ 2√2 ＝ 3√2。' }, { t: R(10), why: '√10 ≈ 3.16，3√2 ≈ 4.24，不一樣。' }] }],
        found: '看起來不同類，<b>先化簡</b>再看能不能合併。' },
      { text: '乘、除和有理化（不用模擬了）。', quiet: true, check: () => true,
        qs: () => [
          { q: `4${R(3)} × 2${R(3)} ＝ ？`, options: [{ t: '24', ok: true, why: '4 × 2 ＝ 8，√3 × √3 ＝ 3，8 × 3 ＝ 24。' }, { t: `8${R(3)}`, why: '√3 × √3 ＝ 3。' }, { t: `8${R(9)}`, why: '√9 ＝ 3，要算完：24。' }] },
          { q: `${R(12)} ÷ ${R(3)} ＝ ？`, options: [{ t: '2', ok: true, why: '√(12 ÷ 3) ＝ √4 ＝ 2。' }, { t: '4', why: '√4 ＝ 2。' }, { t: R(9), why: '是除，不是減。' }] },
          { q: `2 / (3 − ${R(7)})，分子分母同乘 (3 ＋ √7)，分母變成？`, options: [{ t: '9 − 7 ＝ 2', ok: true, why: '平方差：(3 − √7)(3 ＋ √7) ＝ 3² − (√7)²。結果 ＝ 3 ＋ √7。' }, { t: '9 ＋ 7 ＝ 16', why: '(a − b)(a + b) ＝ a² − b²，是減。' }] }],
        found: '乘除：<b>係數對係數、根號對根號</b>。分母是 a − √b 時，同乘 a ＋ √b，用<b>平方差</b>消掉根號。' }
    ]);
    S = rulerSim(card, () => tk.check());
    card.appendChild(tk.slot); p.insertBefore(p.querySelector('.u4-task'), card); tk.start();
  }

  function know(p, api) {
    p.appendChild(h('<p class="muted">把剛剛玩到的，收成 4 句話。</p>'));
    K.table(U.card(p, '① 加減：同類根式才合併', '<p>先化簡，再合併。</p>'), ['算式', '結果'], [['2√3 ＋ 5√3', '7√3'], ['√2 ＋ √8', '√2 ＋ 2√2 ＝ 3√2'], ['√48 − √12', '4√3 − 2√3 ＝ 2√3'], ['√2 ＋ √3', '不能合併']], 340);
    K.table(U.card(p, '② 乘法', '<p>√a × √b ＝ √(ab)；係數乘係數。</p>'), ['算式', '結果'], [['√2 × √6', '√12 ＝ 2√3'], ['4√3 × 2√3', '8 × 3 ＝ 24'], ['√2(√8 ＋ 1)', '4 ＋ √2']], 340);
    K.table(U.card(p, '③ 除法', '<p>√a ÷ √b ＝ √(a ÷ b)；分母有根號要有理化。</p>'), ['算式', '結果'], [['√12 ÷ √3', '2'], ['4√3 ÷ 2√3', '2'], ['6 ÷ √3', '6√3/3 ＝ 2√3']], 340);
    K.table(U.card(p, '④ 分母是 a − √b：乘 a ＋ √b', '<p>平方差：(a − √b)(a ＋ √b) ＝ a² − b</p>'), ['原式', '同乘', '結果'], [['2/(3 − √7)', '3 ＋ √7', '3 ＋ √7'], ['1/(√2 ＋ 1)', '√2 − 1', '√2 − 1']], 380);
    const c = h('<div class="card"><h3>✏️ 檢查一下</h3></div>'); p.appendChild(c);
    U.numq(c, { q: `${R(2)} × ${R(8)} ＝ ？`, pre: '＝', answer: 4, hint: '√16。', diag: [{ v: 16, msg: '√16 ＝ 4。' }], why: '√(2 × 8) ＝ √16 ＝ 4', onDone() { api.done(); } });
  }

  function exam(p, api) {
    U.exam(p, api, {
      intro: '這兩題是照會考題的樣子改寫的。答錯可以再選。',
      benchLabel: '想量量看？打開根式尺模擬',
      bench: host => rulerSim(host, () => {}),
      qs: [
        { src: '改寫自 110 年會考第 6 題', q: '下列等式何者<b>不成立</b>？', hint: '√2 × √2 ＝ 2。',
          options: [{ t: `3${R(2)} ＋ ${R(2)} ＝ 4${R(2)}`, why: '成立。' }, { t: `3${R(2)} − ${R(2)} ＝ 2${R(2)}`, why: '成立。' }, { t: `3${R(2)} × ${R(2)} ＝ 3${R(2)}`, ok: true, why: '3√2 × √2 ＝ 3 × 2 ＝ 6。' }, { t: `3${R(2)} ÷ ${R(2)} ＝ 3`, why: '成立。' }] },
        { src: '改寫自 113 年會考第 11 題', q: `將 2 / (3 − ${R(7)}) 化簡為 a ＋ b${R(7)}，其中 a、b 為整數，求 a ＋ b 之值為何？`, hint: '上下同乘 3 ＋ √7。',
          options: [{ t: '4', ok: true, why: '分母 9 − 7 ＝ 2，結果 3 ＋ √7，a ＋ b ＝ 4。' }, { t: '2', why: 'a ＝ 3、b ＝ 1。' }, { t: '−4', why: '結果是 3 ＋ √7。' }, { t: '10', why: '分母是 9 − 7 ＝ 2。' }] }
      ]
    });
  }

  function real(p, api) {
    U.real(p, api, [
      { stars: 1, src: '110 年會考 第 6 題', q: '下列等式何者不成立？',
        options: [{ t: `4${R(3)} ＋ 2${R(3)} ＝ 6${R(3)}`, why: '成立。' }, { t: `4${R(3)} − 2${R(3)} ＝ 2${R(3)}`, why: '成立。' }, { t: `4${R(3)} × 2${R(3)} ＝ 8${R(3)}`, ok: true, why: '4√3 × 2√3 ＝ 8 × 3 ＝ 24。' }, { t: `4${R(3)} ÷ 2${R(3)} ＝ 2`, why: '成立。' }],
        explain: '<p>(C) 4√3 × 2√3 ＝ (4 × 2)(√3 × √3) ＝ 8 × 3 ＝ 24 ≠ 8√3。答案 (C)。</p>',
        steps: [{ num: true, q: '√3 × √3 ＝ ？', pre: '', answer: 3 }, { num: true, q: '4√3 × 2√3 ＝ 8 × 3 ＝ ？', pre: '', answer: 24 }] },
      { stars: 2, src: '109 年會考 第 4 題', q: `算式 ${R(2)} × (${R(48)} − ${R(12)}) 之值為何？`,
        options: [{ t: `6${R(2)}`, why: '括號：4√3 − 2√3 ＝ 2√3。' }, { t: `2${R(6)}`, ok: true, why: '√2 × 2√3 ＝ 2√6。' }, { t: `2${R(21)}`, why: '√48 − √12 不等於 √36。' }, { t: `4${R(6)} − 2${R(3)}`, why: '√2 要乘到兩項。' }],
        explain: '<p>√48 ＝ 4√3，√12 ＝ 2√3，括號 ＝ 2√3。√2 × 2√3 ＝ 2√6。答案 (B)。</p>',
        steps: [
          { q: '√48 ＝ ？', options: [{ t: `4${R(3)}`, ok: true, why: '48 ＝ 16 × 3。' }, { t: `3${R(4)}`, why: '開出來的是 √16 ＝ 4。' }] },
          { q: '4√3 − 2√3 ＝ ？', options: [{ t: `2${R(3)}`, ok: true, why: '同類根式相減。' }, { t: '2', why: '√3 要留著。' }] },
          { q: '√2 × 2√3 ＝ ？', options: [{ t: `2${R(6)}`, ok: true, why: '√2 × √3 ＝ √6。' }, { t: `2${R(5)}`, why: '根號裡是相乘。' }] }
        ] },
      { stars: 2, src: '107 年會考 第 7 題', q: `算式 ${R(6)} × (1/${R(3)} − 1) 之值為何？`,
        options: [{ t: `${R(2)} − ${R(6)}`, ok: true, why: '√6 × 1/√3 ＝ √2，√6 × 1 ＝ √6。' }, { t: `${R(2)} − 1`, why: '√6 也要乘到 −1。' }, { t: `2 − ${R(6)}`, why: '√6 ÷ √3 ＝ √2。' }, { t: '1', why: '用分配律乘開。' }],
        explain: '<p>√6 × 1/√3 − √6 × 1 ＝ √2 − √6。答案 (A)。</p>',
        steps: [
          { q: '√6 × 1/√3 ＝ √6 ÷ √3 ＝ ？', options: [{ t: R(2), ok: true, why: '√(6 ÷ 3)。' }, { t: '2', why: '√(6 ÷ 3) ＝ √2。' }] },
          { q: '√6 × (−1) ＝ ？', options: [{ t: `−${R(6)}`, ok: true, why: '所以答案 √2 − √6。' }, { t: '−1', why: '√6 要乘進去。' }] }
        ] },
      { stars: 3, src: '113 年會考 第 11 題', q: `將 9 / (4 − ${R(7)}) 化簡為 a ＋ b${R(7)}，其中 a、b 為整數，求 a ＋ b 之值為何？`,
        options: [{ t: '5', ok: true, why: '分母 16 − 7 ＝ 9，結果 4 ＋ √7。' }, { t: '3', why: 'b ＝ ＋1。' }, { t: '−9', why: '分母 9 正好約掉。' }, { t: '−15', why: '(4 − √7)(4 ＋ √7) ＝ 9。' }],
        explain: '<p>上下同乘 4 ＋ √7：分母 16 − 7 ＝ 9。9(4 ＋ √7)/9 ＝ 4 ＋ √7，a ＋ b ＝ 5。答案 (A)。</p>',
        steps: [
          { q: '分母 4 − √7，上下要同乘什麼？', options: [{ t: `4 ＋ ${R(7)}`, ok: true, why: '湊成平方差。' }, { t: R(7), why: '分母還會有根號。' }] },
          { num: true, q: '(4 − √7)(4 ＋ √7) ＝ 16 − 7 ＝ ？', pre: '', answer: 9 },
          { num: true, q: '結果 4 ＋ √7，a ＋ b ＝ ？', pre: '', answer: 5 }
        ] }
    ]);
  }

  K.run('2-2b', ['先猜猜看：√2 ＋ √3 ＝ √5？', '動手玩：根式尺', '收成 4 句話', '會考題改寫版', '會考實戰：照原題做做看'], { guess, play, know, exam, real });
})();
