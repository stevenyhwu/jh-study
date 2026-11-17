/* ===== 數學 2-3b 畢氏定理的逆定理與方格距離 ===== */
(function () {
  'use strict';
  const U = Unit4, h = U.h, K = MK, Q = MK2, R = K.sqrt;

  function gridSim(host, on) {
    host.appendChild(h('<p class="sim-h">A 固定在左下角，移動 B，量 AB 的長度</p>'));
    const pic = h('<div></div>'), read = h('<div class="sim-read"></div>');
    let dx = 2, dy = 1;
    function draw() {
      pic.innerHTML = '';
      Q.gridPic(pic, { w: 6, hh: 6, pts: { A: [0, 0], B: [dx, dy], _C: [dx, 0] }, segs: [['A', '_C', 'leg'], ['_C', 'B', 'leg'], ['A', 'B', 'hyp']], max: 300 }, 'sim');
      const d2 = dx * dx + dy * dy;
      read.innerHTML = `橫走 <b>${dx}</b> 格、直走 <b>${dy}</b> 格<br>AB ＝ ${R(dx + '² ＋ ' + dy + '²')} ＝ ${R(d2)} ＝ <b>${Q.rootOf(d2)}</b>`;
    }
    host.appendChild(pic);
    U.slider(host, 'B 往右', { min: 0, max: 6, step: 1, value: dx }, v => { dx = v; draw(); on(); });
    U.slider(host, 'B 往上', { min: 0, max: 6, step: 1, value: dy }, v => { dy = v; draw(); on(); });
    host.appendChild(read); draw();
    return { get d2() { return dx * dx + dy * dy; } };
  }

  const P107 = { A: [0, 0], B: [5, 5], C: [1, 3], D: [2, 4], E: [1, 1], F: [3, 4], G: [4, 2] };
  const pic107 = host => Q.gridPic(host, { w: 5, hh: 5, u: 44, max: 280, pts: P107, segs: [['A', 'C'], ['C', 'D'], ['D', 'B'], ['A', 'E', 'dot'], ['E', 'D', 'dot'], ['D', 'F', 'dot'], ['F', 'B', 'dot'], ['A', 'G', 'bold'], ['G', 'B', 'bold']] });

  function guess(p, api) {
    U.guess(p, api, [
      { pic: c => Q.gridPic(c, { w: 4, hh: 4, pts: { A: [0, 0], B: [3, 4], _C: [3, 0] }, segs: [['A', '_C', 'leg'], ['_C', 'B', 'leg'], ['A', 'B', 'hyp']], max: 220 }), q: '每格邊長 1。A 到 B 的直線距離是多少？', options: [{ t: '7' }, { t: '5', ok: true }, { t: '4' }],
        reveal: '橫 3、直 4，剛好圍成直角三角形，斜邊 √(9 ＋ 16) ＝ <b>5</b>。方格紙上的斜線，都可以這樣量。' },
      { q: '三邊 5、12、13 的三角形，是直角三角形嗎？', options: [{ t: '是', ok: true }, { t: '不是' }, { t: '不知道' }],
        reveal: '5² ＋ 12² ＝ 25 ＋ 144 ＝ 169 ＝ 13²。<b>兩邊平方和等於第三邊平方</b>，就一定是直角三角形（逆定理）。' }
    ]);
  }

  function play(p, api) {
    let S;
    const card = h('<div class="card"></div>'); p.appendChild(card);
    const tk = U.tasks(p, api, [
      { text: '移動 B，讓 AB 剛好 <b>5</b>。', check: () => S.d2 === 25,
        qs: () => [{ q: '有哪些走法可以得到 5？', options: [{ t: '橫 3 直 4、橫 4 直 3（還有橫 5 直 0）', ok: true, why: '3² ＋ 4² ＝ 25。' }, { t: '只有橫 5', why: '試試 3 和 4。' }] }],
        found: '方格距離：<b>先數橫、直各幾格，再用畢氏定理</b>。' },
      { text: '移動 B，讓 AB ＝ <b>√10</b>。', check: () => S.d2 === 10,
        qs: () => [{ q: '√10 是怎麼走的？', options: [{ t: '橫 1 直 3（或橫 3 直 1）', ok: true, why: '1 ＋ 9 ＝ 10。' }, { t: '橫 5 直 5', why: '25 ＋ 25 ＝ 50。' }] }],
        found: '要比兩條斜線長短，<b>比平方就好</b>：√10 和 √13 比 10 和 13。' },
      { text: '坐標距離與逆定理（不用模擬了）。', quiet: true, check: () => true,
        qs: () => [
          { num: true, q: 'A(1, 2)、B(4, 6)，AB ＝ √(3² ＋ 4²) ＝ ？', pre: '', answer: 5 },
          { q: '下列哪一組三邊可以圍成直角三角形？', options: [{ t: '8、15、17', ok: true, why: '64 ＋ 225 ＝ 289 ＝ 17²。' }, { t: '4、5、6', why: '16 ＋ 25 ＝ 41 ≠ 36。' }, { t: '2、3、4', why: '4 ＋ 9 ＝ 13 ≠ 16。' }] }],
        found: '坐標距離 ＝ √((x 差)² ＋ (y 差)²)。<b>逆定理</b>：最長邊² ＝ 另兩邊平方和 → 直角三角形。' }
    ]);
    S = gridSim(card, () => tk.check());
    card.appendChild(tk.slot); p.insertBefore(p.querySelector('.u4-task'), card); tk.start();
  }

  function know(p, api) {
    p.appendChild(h('<p class="muted">把剛剛玩到的，收成 4 句話。</p>'));
    Q.gridPic(U.card(p, '① 方格紙上的斜線', '<p>橫 1、直 3 → √(1 ＋ 9) ＝ √10</p>'), { w: 3, hh: 3, pts: { A: [0, 0], B: [1, 3], _C: [1, 0] }, segs: [['A', '_C', 'leg'], ['_C', 'B', 'leg'], ['A', 'B', 'hyp']], max: 180 });
    K.table(U.card(p, '② 坐標兩點距離', '<p>AB ＝ √((x₁ − x₂)² ＋ (y₁ − y₂)²)</p>'), ['兩點', '差', '距離'], [['(1,2)、(4,6)', '3、4', '5'], ['(−1,2)、(2,6)', '3、4', '5'], ['(0,0)、(2,2)', '2、2', '2√2']], 340);
    K.table(U.card(p, '③ 逆定理：判斷直角', '<p>最長邊 c，若 a² ＋ b² ＝ c²，就是直角三角形（c 對面是直角）。</p>'), ['三邊', 'a² ＋ b²', 'c²', '直角？'], [['6、8、10', '100', '100', '是'], ['4、5、6', '41', '36', '不是'], ['√3、√5、√8', '8', '8', '是']], 380);
    pic107(U.card(p, '④ 比長短：比平方', '<p>不用算小數：√a ＜ √b ⇔ a ＜ b。<br>兩段相加時，可以把兩邊<b>都平方</b>再比。</p>'));
    const c = h('<div class="card"><h3>✏️ 檢查一下</h3></div>'); p.appendChild(c);
    U.numq(c, { q: 'A(−2, 1)、B(4, 9)，AB 長多少？', pre: '', answer: 10, hint: 'x 差 6、y 差 8。', diag: [{ v: 14, msg: '不是相加，用畢氏定理。' }], why: '√(36 ＋ 64) ＝ 10', onDone() { api.done(); } });
  }

  function exam(p, api) {
    U.exam(p, api, {
      intro: '這兩題是照會考題的樣子改寫的。答錯可以再選。',
      benchLabel: '想量量看？打開方格模擬',
      bench: host => gridSim(host, () => {}),
      qs: [
        { src: '改寫自 107 年會考非選第 2 題', q: '方格紙上（每格邊長 1），路徑甲：橫 3 直 1 的斜線；路徑乙：橫 2 直 2 的斜線。哪一條比較長？', hint: '比平方：9 ＋ 1 和 4 ＋ 4。',
          options: [{ t: '甲比較長', ok: true, why: '甲 √10、乙 √8，10 ＞ 8。' }, { t: '乙比較長', why: '乙 ＝ √8 ＜ √10。' }, { t: '一樣長', why: '都走 4 格，但斜線長度不同。' }] },
        { src: K.SIM, q: '下列哪一組三邊可以圍成直角三角形？', hint: '最長邊平方 ＝ 另兩邊平方和。',
          options: [{ t: '5、6、7', why: '25 ＋ 36 ＝ 61 ≠ 49。' }, { t: '7、24、25', ok: true, why: '49 ＋ 576 ＝ 625 ＝ 25²。' }, { t: '8、9、10', why: '64 ＋ 81 ≠ 100。' }, { t: '3、3、3', why: '正三角形沒有直角。' }] }
      ]
    });
  }

  function real(p, api) {
    U.real(p, api, [
      { stars: 1, src: K.SIM, q: '坐標平面上 A(−2, 1)、B(4, 9)，則 AB 的長度為何？',
        options: [{ t: '10', ok: true, why: '√(6² ＋ 8²) ＝ 10。' }, { t: '14', why: '不是 6 ＋ 8。' }, { t: R(52), why: 'x 差是 4 − (−2) ＝ 6。' }, { t: '2√5', why: '再算一次差：6 和 8。' }],
        explain: '<p>x 差 4 − (−2) ＝ 6，y 差 9 − 1 ＝ 8。AB ＝ √(36 ＋ 64) ＝ 10。答案 (A)。</p>',
        steps: [{ num: true, q: 'x 差 ＝ 4 − (−2) ＝ ？', pre: '', answer: 6 }, { num: true, q: 'y 差 ＝ 9 − 1 ＝ ？', pre: '', answer: 8 }, { num: true, q: '√(6² ＋ 8²) ＝ ？', pre: '', answer: 10 }] },
      { stars: 2, src: K.SIM, q: `三角形三邊長為 ${R(3)}、${R(5)}、${R(8)}，關於此三角形的敘述何者正確？`,
        options: [{ t: `是直角三角形，${R(8)} 那邊的對角是直角`, ok: true, why: '3 ＋ 5 ＝ 8。' }, { t: `是直角三角形，${R(3)} 那邊的對角是直角`, why: '直角對的是最長邊。' }, { t: '不是直角三角形', why: '(√3)² ＋ (√5)² ＝ 8 ＝ (√8)²。' }, { t: '不能圍成三角形', why: '√3 ＋ √5 ≈ 3.97 ＞ √8 ≈ 2.83，可以。' }],
        explain: '<p>平方：3、5、8。3 ＋ 5 ＝ 8，所以是直角三角形，直角在最長邊 √8 的對面。答案 (A)。</p>',
        steps: [{ q: '三邊平方是？', options: [{ t: '3、5、8', ok: true, why: '(√a)² ＝ a。' }, { t: '9、25、64', why: '(√3)² ＝ 3。' }] }, { q: '3 ＋ 5 ＝ 8，所以？', options: [{ t: '直角三角形，直角對最長邊', ok: true, why: '逆定理。' }, { t: '不是直角', why: '平方和相等就是直角。' }] }] },
      { stars: 3, src: '107 年會考 非選擇題第 2 題（改成選擇）', pic: pic107, q: '5 × 5 方格棋盤（每格是正方形），機器人從 A 走到 B，有三條路徑：R₁：A→C→D→B（細線）；R₂：A→E→D→F→B（虛線）；R₃：A→G→B（粗線）。兩點之間都走直線。三條路徑中最長與最短分別為何？',
        options: [{ t: '最長 R₁，最短 R₃', why: '比 R₁ 和 R₂：√10 和 1 ＋ √5 誰大？' }, { t: '最長 R₂，最短 R₃', ok: true, why: 'R₂ ＞ R₁ ＞ R₃。' }, { t: '最長 R₂，最短 R₁', why: '比 R₁ 和 R₃：√10 ＋ √2 和 2√5 誰大？' }, { t: '三條一樣長', why: '用畢氏定理算每一段。' }],
        explain: '<p>每格邊長 1，各段長：<br>R₁ ＝ AC ＋ CD ＋ DB ＝ √10 ＋ √2 ＋ √10<br>R₂ ＝ AE ＋ ED ＋ DF ＋ FB ＝ √2 ＋ √10 ＋ 1 ＋ √5<br>R₃ ＝ AG ＋ GB ＝ √20 ＋ √10 ＝ 2√5 ＋ √10<br>R₁、R₂ 都有 √2 ＋ √10，比剩下的 √10 和 1 ＋ √5：(1 ＋ √5)² ＝ 6 ＋ 2√5 ≈ 10.5 ＞ 10，所以 R₂ ＞ R₁。<br>R₁、R₃ 都有 √10，比 √10 ＋ √2 和 2√5：(√10 ＋ √2)² ＝ 12 ＋ 2√20 ≈ 20.9 ＞ 20，所以 R₁ ＞ R₃。<br>最長 R₂、最短 R₃。答案 (B)。</p>',
        steps: [
          { q: 'AC：橫 1、直 3，長度是？', options: [{ t: R(10), ok: true, why: '1 ＋ 9。' }, { t: '4', why: '斜線用畢氏定理。' }] },
          { q: 'R₁ ＝ √10 ＋ √2 ＋ √10；R₂ ＝ √2 ＋ √10 ＋ 1 ＋ √5。兩條都有 √2 ＋ √10，剩下要比？', options: [{ t: '√10 和 1 ＋ √5', ok: true, why: '相同的部分先消掉。' }, { t: '√2 和 √5', why: '先消掉兩邊都有的 √2 ＋ √10。' }] },
          { q: '平方比：10 和 (1 ＋ √5)² ＝ 6 ＋ 2√5 ≈ 10.47。哪條比較長？', options: [{ t: 'R₂', ok: true, why: '10.47 ＞ 10。' }, { t: 'R₁', why: '6 ＋ 2√5 ＞ 10。' }] },
          { q: 'R₃ ＝ 2√5 ＋ √10。和 R₁ 比，消掉 √10 後比 2√5 和 √10 ＋ √2，平方是 20 和 12 ＋ 4√5 ≈ 20.9。所以？', options: [{ t: 'R₃ 最短', ok: true, why: 'R₂ ＞ R₁ ＞ R₃。' }, { t: 'R₁ 最短', why: '20.9 ＞ 20，R₁ 比 R₃ 長。' }] }
        ] }
    ]);
  }

  K.run('2-3b', ['先猜猜看：方格上的斜線', '動手玩：方格量距離', '收成 4 句話', '會考題改寫版', '會考實戰：照原題做做看'], { guess, play, know, exam, real });
})();
