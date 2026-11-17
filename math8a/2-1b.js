/* ===== 數學 2-1b 近似值與估算 ===== */
(function () {
  'use strict';
  const U = Unit4, h = U.h, K = MK, M = K.M, R = K.sqrt;
  const fx = (v, d) => Number(v.toFixed(d));

  /* 十分逼近：先找整數，再找到小數第一位、第二位 */
  function zoomSim(host, on) {
    host.appendChild(h('<p class="sim-h">拉拉看：哪個數的平方最接近目標，又不超過？</p>'));
    const ch = h('<div></div>'), ch2 = h('<div></div>'), pic = h('<div></div>'), read = h('<div class="sim-read"></div>');
    let T = 20, step = 1, i = 4, sl;
    const dig = () => (step === 1 ? 0 : step === 0.1 ? 1 : 2);
    const base = () => (step === 1 ? 0 : step === 0.1 ? Math.floor(Math.sqrt(T)) : Math.floor(Math.sqrt(T) * 10) / 10);
    const g = () => fx(base() + i * step, dig());
    function draw() {
      const b = base(), W = 340, x = k => 20 + k * (W - 40) / 10, v = g(), v2 = fx(v * v, 4), n2 = fx((v + step) * (v + step), 4);
      let s = `<line x1="14" y1="40" x2="${W - 14}" y2="40" stroke="var(--stroke)" stroke-width="1.5"/>`;
      for (let k = 0; k <= 10; k++) {
        const t = fx(b + k * step, dig()), sq2 = fx(t * t, 4), under = sq2 <= T;
        s += `<line x1="${x(k)}" y1="34" x2="${x(k)}" y2="46" stroke="var(--stroke)"/><text x="${x(k)}" y="62" text-anchor="middle" class="t12" style="font-size:${step === 0.01 ? 10 : 12}px">${t}</text>`;
        s += `<rect x="${x(k) - 4}" y="${under ? 26 : 26}" width="8" height="8" rx="2" fill="${under ? 'var(--good)' : '#d9534f'}" opacity=".55"/>`;
      }
      s += `<path d="M${x(i)} 22 l-7 -12 h14 z" fill="var(--accent)"/>`;
      s += `<text x="20" y="80" class="t12">${step === 1 ? '整數' : step === 0.1 ? `${b} 到 ${fx(b + 1, 1)}，每格 0.1` : `${b} 到 ${fx(b + 0.1, 2)}，每格 0.01`}　（綠：平方 ≤ ${T}；紅：平方 ＞ ${T}）</text>`;
      pic.innerHTML = ''; U.svg(pic, `0 0 ${W} 88`, s, '數線', 'sim');
      const ok = v2 <= T && n2 > T;
      read.innerHTML = `目標：${R(T)}　你選的數 <b>${v}</b><br>${v}² ＝ <b>${v2}</b> ${v2 > T ? `<span style="color:#d9534f">＞ ${T}，太大</span>` : `≤ ${T}`}；下一格 ${fx(v + step, dig())}² ＝ ${n2} ${n2 > T ? `＞ ${T}` : `≤ ${T}，還可以再大`}${ok ? `<br><b style="color:var(--good)">✔ 夾到了：${v} ＜ ${R(T)} ＜ ${fx(v + step, dig())}</b>` : ''}`;
    }
    U.chips(ch, '目標', [2, 20, 50, 90].map(v => ({ v, t: '√' + v })), T, v => { T = v; i = 0; sl.set(0); draw(); on(); });
    const cs = U.chips(ch2, '每一格', [{ v: 1, t: '1（整數）' }, { v: 0.1, t: '0.1' }, { v: 0.01, t: '0.01' }], step, v => { step = v; i = 0; sl.set(0); draw(); on(); });
    host.append(ch, ch2, pic);
    sl = U.slider(host, '往右移幾格', { min: 0, max: 10, step: 1, value: i }, v => { i = v; draw(); on(); });
    host.appendChild(read); draw();
    return { get T() { return T; }, get step() { return step; }, get g() { return g(); }, setStep(v) { step = v; cs.set(v); i = 0; sl.set(0); draw(); } };
  }

  function guess(p, api) {
    U.guess(p, api, [
      { q: `${R(50)} 大約是多少？`, options: [{ t: '25' }, { t: '7 多一點', ok: true }, { t: '8 多一點' }],
        reveal: '7² ＝ 49、8² ＝ 64，50 很靠近 49，所以 √50 是 <b>7 多一點</b>（約 7.07）。找「夾住它的兩個平方數」就能估。' },
      { q: '一個正方形面積 30 平方公分，邊長大約幾公分？', options: [{ t: '5 和 6 之間', ok: true }, { t: '15' }, { t: '6 和 7 之間' }],
        reveal: '25 ＜ 30 ＜ 36，所以 5 ＜ √30 ＜ 6。' }
    ]);
  }

  function play(p, api) {
    let S;
    const card = h('<div class="card"></div>'); p.appendChild(card);
    const tk = U.tasks(p, api, [
      { text: `目標 ${R(20)}，每一格 1：找到「平方不超過 20 的最大整數」。`, setup() { S.setStep(1); }, check: () => S.T === 20 && S.step === 1 && S.g === 4,
        qs: () => [{ q: `所以 ${R(20)} 在哪兩個整數之間？`, options: [{ t: '4 和 5', ok: true, why: '16 ＜ 20 ＜ 25。' }, { t: '10 和 11', why: '不是除以 2：4² ＝ 16、5² ＝ 25。' }] }],
        found: '先用<b>完全平方數</b>把它夾住：16 ＜ 20 ＜ 25 → 4 ＜ √20 ＜ 5。' },
      { text: '改成每一格 <b>0.1</b>，在 4 和 5 之間再夾一次。', setup() { S.setStep(0.1); }, check: () => S.T === 20 && S.step === 0.1 && S.g === 4.4,
        qs: () => [{ q: `4.4² ＝ 19.36、4.5² ＝ 20.25。${R(20)} 比較接近哪一個？`, options: [{ t: '4.5', ok: true, why: '20 − 19.36 ＝ 0.64，20.25 − 20 ＝ 0.25，離 4.5² 比較近。（√20 ≈ 4.472）' }, { t: '4.4', why: '比一比差多少：20.25 離 20 只差 0.25。' }] }],
        found: '<b>十分逼近法</b>：一格一格縮小範圍，想要多準就做幾次。' },
      { text: '不用模擬了，估估看。', quiet: true, check: () => true,
        qs: () => [
          { q: `${R(90)} 在哪兩個整數之間？`, options: [{ t: '9 和 10', ok: true, why: '81 ＜ 90 ＜ 100。' }, { t: '45 和 46', why: '開根號不是除以 2。' }, { t: '8 和 9', why: '9² ＝ 81 ＜ 90。' }] },
          { q: `3${R(5)} 在哪兩個整數之間？（提示：3√5 ＝ √(9 × 5)）`, options: [{ t: '6 和 7', ok: true, why: '3√5 ＝ √45，36 ＜ 45 ＜ 49。' }, { t: '2 和 3', why: '那是 √5，還要乘 3。' }, { t: '15 和 16', why: '3√5 ＝ √45，不是 15。' }] }],
        found: '前面有係數時，<b>把係數平方搬進根號</b>：a√b ＝ √(a²b)，再夾。' }
    ]);
    S = zoomSim(card, () => tk.check());
    card.appendChild(tk.slot); p.insertBefore(p.querySelector('.u4-task'), card); tk.start();
  }

  const lineP = (host, lo, hi, v, lab) => {
    const W = 320, x = t => 30 + (t - lo) * (W - 60) / (hi - lo);
    let s = `<line x1="20" y1="30" x2="${W - 20}" y2="30" stroke="var(--stroke)" stroke-width="1.5"/>`;
    for (let t = lo; t <= hi; t++) s += `<line x1="${x(t)}" y1="24" x2="${x(t)}" y2="36" stroke="var(--stroke)"/><text x="${x(t)}" y="52" text-anchor="middle" class="t12b">${t}</text>`;
    s += `<circle cx="${x(v)}" cy="30" r="5" fill="var(--accent)"/><text x="${x(v)}" y="16" text-anchor="middle" class="t12b" style="fill:var(--accent)">${lab}</text>`;
    const sv = U.svg(host, `0 0 ${W} 60`, s, '數線', 'u4-pic'); sv.style.maxWidth = '340px'; return sv;
  };

  function know(p, api) {
    p.appendChild(h('<p class="muted">把剛剛玩到的，收成 4 句話。</p>'));
    lineP(U.card(p, '① 用平方數夾住', `<p>16 ＜ 20 ＜ 25 → <b>4 ＜ ${R(20)} ＜ 5</b></p>`), 3, 6, Math.sqrt(20), '√20');
    K.table(U.card(p, '② 十分逼近法', `<p>${R(2)}：一位一位找</p>`), ['範圍', '平方', '結論'], [['1 ～ 2', '1、4', '1 ＜ √2 ＜ 2'], ['1.4 ～ 1.5', '1.96、2.25', '1.4 ＜ √2 ＜ 1.5'], ['1.41 ～ 1.42', '1.9881、2.0164', '1.41 ＜ √2 ＜ 1.42']], 380);
    lineP(U.card(p, '③ 有係數：搬進根號', `<p>4${R(20)} ＝ ${R('16 × 20')} ＝ ${R(320)}<br>17² ＝ 289 ＜ 320 ＜ 324 ＝ 18² → <b>17 ＜ 4√20 ＜ 18</b></p>`), 16, 19, Math.sqrt(320), '4√20');
    K.table(U.card(p, '④ 常用近似值', '<p>四捨五入到小數第三位。</p>'), ['√2', '√3', '√5', '√6', '√7'], [['1.414', '1.732', '2.236', '2.449', '2.646']], 340);
    const c = h('<div class="card"><h3>✏️ 檢查一下</h3></div>'); p.appendChild(c);
    U.numq(c, { q: `${R(70)} 介於哪兩個連續整數之間？填比較小的那個。`, pre: '', answer: 8, hint: '8² ＝ 64、9² ＝ 81。', diag: [{ v: 35, msg: '開根號不是除以 2。' }, { v: 9, msg: '9² ＝ 81 ＞ 70，所以是 8 和 9，小的是 8。' }], why: '64 ＜ 70 ＜ 81 → 8 ＜ √70 ＜ 9', onDone() { api.done(); } });
  }

  function exam(p, api) {
    U.exam(p, api, {
      intro: '這兩題是照會考題的樣子改寫的。答錯可以再選。',
      benchLabel: '想逼近看看？打開十分逼近模擬',
      bench: host => zoomSim(host, () => {}),
      qs: [
        { src: '改寫自 111 年會考第 6 題', q: `${R(1000)} 的值介於下列哪兩個數之間？`, hint: '30² ＝ 900、32² ＝ 1024。',
          options: [{ t: '20，25', why: '25² ＝ 625，太小。' }, { t: '25，30', why: '30² ＝ 900 ＜ 1000。' }, { t: '30，35', ok: true, why: '900 ＜ 1000 ＜ 1225。（√1000 ≈ 31.6）' }, { t: '35，40', why: '35² ＝ 1225 ＞ 1000。' }] },
        { src: '改寫自 105 年會考第 13 題', q: '若一正方形的面積為 10 平方公分，周長為 x 公分，則 x 介於下列哪兩個整數之間？', hint: '邊長 √10，周長 4√10 ＝ √160。',
          options: [{ t: '3，4', why: '這是邊長 √10 的範圍，題目問周長。' }, { t: '12，13', ok: true, why: '4√10 ＝ √160，144 ＜ 160 ＜ 169。' }, { t: '13，14', why: '13² ＝ 169 ＞ 160。' }, { t: '40，41', why: '周長是 4 × √10，不是 4 × 10。' }] }
      ]
    });
  }

  function real(p, api) {
    U.real(p, api, [
      { stars: 1, src: '111 年會考 第 6 題', q: `${R(2022)} 的值介於下列哪兩個數之間？`,
        options: [{ t: '25，30', why: '30² ＝ 900，太小。' }, { t: '30，35', why: '35² ＝ 1225，還是小於 2022。' }, { t: '35，40', why: '40² ＝ 1600 ＜ 2022。' }, { t: '40，45', ok: true, why: '1600 ＜ 2022 ＜ 2025 ＝ 45²。' }],
        explain: '<p>40² ＝ 1600，45² ＝ 2025。1600 ＜ 2022 ＜ 2025，所以 40 ＜ √2022 ＜ 45。答案 (D)。</p>',
        steps: [
          { num: true, q: '40² ＝ ？', pre: '', answer: 1600 },
          { num: true, q: '45² ＝ ？（提示：45² ＝ (40 + 5)²）', pre: '', answer: 2025 },
          { q: '2022 夾在哪裡？', options: [{ t: '1600 和 2025 之間', ok: true, why: '所以選 40、45。' }, { t: '比 2025 大', why: '2022 ＜ 2025。' }] }
        ] },
      { stars: 2, src: K.SIM, q: `若 n 為正整數，且 6 ＜ ${R('n')} ＜ 7，則 n 共有幾個？`,
        options: [{ t: '1 個', why: '不是只有一個，n 可以是好幾個整數。' }, { t: '11 個', why: '37 到 48 一共幾個？48 − 37 ＋ 1。' }, { t: '12 個', ok: true, why: '36 ＜ n ＜ 49，n ＝ 37、38、…、48，共 12 個。' }, { t: '13 個', why: 'n 不能是 36 或 49（題目是「＜」）。' }],
        explain: '<p>6 ＜ √n ＜ 7 → 兩邊平方：36 ＜ n ＜ 49。n ＝ 37、38、…、48，共 48 − 37 ＋ 1 ＝ 12 個。答案 (C)。</p>',
        steps: [
          { q: '6 ＜ √n ＜ 7，三邊都平方得到？', options: [{ t: '36 ＜ n ＜ 49', ok: true, why: '正數平方，大小順序不變。' }, { t: '12 ＜ n ＜ 14', why: '平方不是乘 2。' }] },
          { num: true, q: 'n 可以是 37、38、…、48，一共幾個？', pre: '', answer: 12, diag: [{ v: 11, msg: '頭尾都要算：48 − 37 ＋ 1。' }, { v: 13, msg: '36 和 49 不行（是小於，不是小於等於）。' }] }
        ] },
      { stars: 3, src: '105 年會考 第 13 題', q: '若一正方形的面積為 20 平方公分，周長為 x 公分，則 x 的值介於下列哪兩個整數之間？',
        options: [{ t: '16，17', why: '16² ＝ 256 ＜ 320，再往上。' }, { t: '17，18', ok: true, why: 'x ＝ 4√20 ＝ √320，289 ＜ 320 ＜ 324。' }, { t: '18，19', why: '18² ＝ 324 ＞ 320。' }, { t: '19，20', why: '19² ＝ 361，太大。' }],
        explain: '<p>邊長 √20，周長 x ＝ 4√20 ＝ √(16 × 20) ＝ √320。<br>17² ＝ 289，18² ＝ 324，289 ＜ 320 ＜ 324，所以 17 ＜ x ＜ 18。答案 (B)。</p>',
        steps: [
          { q: '面積 20 的正方形，邊長是？', options: [{ t: R(20), ok: true, why: '邊長 × 邊長 ＝ 20。' }, { t: '5', why: '5² ＝ 25 不是 20。' }] },
          { q: `周長 ＝ 4 × ${R(20)}。把 4 搬進根號：4√20 ＝ ？`, options: [{ t: R(320), ok: true, why: '4 ＝ √16，√16 × √20 ＝ √320。' }, { t: R(80), why: '4 要先平方成 16 再搬進去。' }] },
          { q: '17² ＝ 289，18² ＝ 324。√320 在哪？', options: [{ t: '17 和 18 之間', ok: true, why: '289 ＜ 320 ＜ 324。' }, { t: '18 和 19 之間', why: '320 ＜ 324 ＝ 18²。' }] }
        ] }
    ]);
  }

  K.run('2-1b', ['先猜猜看：√50 大約多少？', '動手玩：十分逼近', '收成 4 句話', '會考題改寫版', '會考實戰：照原題做做看'], { guess, play, know, exam, real });
})();
