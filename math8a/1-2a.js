/* ===== 數學 1-2a 認識多項式 ===== */
(function () {
  'use strict';
  const U = Unit4, h = U.h, K = MK, Q = MK2, M = K.M, X2 = K.X2, num = K.num;
  const P = cs => M(Q.polyN(cs));
  const deg = cs => { const i = cs.findIndex(c => c !== 0); return i < 0 ? '—' : cs.length - 1 - i; };

  function polySim(host, on) {
    host.appendChild(h('<p class="sim-h">拉三個拉桿，用代數磚拼出一個多項式</p>'));
    const pic = h('<div></div>'), read = h('<div class="sim-read"></div>');
    let cs = [1, 2, -3], x = 2;
    const sls = [];
    function draw() {
      pic.innerHTML = ''; Q.tilesPic(pic, cs, 420, 'sim');
      const v = cs[0] * x * x + cs[1] * x + cs[2];
      const terms = cs.filter(c => c).length;
      read.innerHTML = `多項式：${P(cs)}<br>項數 <b>${terms}</b>　次數 <b>${deg(cs)}</b>　常數項 <b>${num(cs[2])}</b><br>當 x ＝ ${x}：${cs[0]}×${x}² ＋ (${cs[1]})×${x} ＋ (${cs[2]}) ＝ <b>${v}</b>`;
    }
    host.appendChild(pic);
    host.appendChild(h(`<div>${Q.tileLegend}</div>`));
    ['x² 的係數', 'x 的係數', '常數項'].forEach((lab, i) => {
      sls.push(U.slider(host, lab, { min: -4, max: 4, step: 1, value: cs[i], fmt: num }, v => { cs[i] = v; draw(); on(); }));
    });
    U.slider(host, '代入 x ＝', { min: -3, max: 3, step: 1, value: x, fmt: num }, v => { x = v; draw(); on(); });
    host.appendChild(read); draw();
    return { get cs() { return cs.slice(); }, get x() { return x; }, is: (a, b, c) => cs[0] === a && cs[1] === b && cs[2] === c };
  }

  function guess(p, api) {
    U.guess(p, api, [
      { pic: c => Q.tilesPic(c, [2, 3, 1]), q: '黃色大方塊代表 x²、綠長條代表 x、紫小方塊代表 1。這堆磚是多少？', options: [{ t: `2${X2} + 3x + 1`, ok: true }, { t: '6' }, { t: `6${X2}` }],
        reveal: `2 個 x²、3 個 x、1 個 1：<b>${P([2, 3, 1])}</b>。不同形狀的磚不能加在一起，所以要分開寫。這就是<b>多項式</b>。` },
      { q: `${P([3, 2, -5])} 一共有幾「項」？`, options: [{ t: '2 項' }, { t: '3 項', ok: true }, { t: '5 項' }],
        reveal: '用 ＋、− 隔開的每一段叫一<b>項</b>：3x²、2x、−5，共 3 項。注意 −5 的負號跟著它走。' }
    ]);
  }

  function play(p, api) {
    let S;
    const card = h('<div class="card"></div>'); p.appendChild(card);
    const tk = U.tasks(p, api, [
      { text: `拼出 ${P([2, -3, 1])}。`, check: () => S.is(2, -3, 1),
        qs: () => [{ num: true, signed: true, q: 'x 項的<b>係數</b>（x 前面的數，連正負號）是多少？', pre: '', answer: -3, diag: [{ v: 3, msg: '負號要跟著：是 −3。' }], why: '係數 ＝ 字母前面的數，包含正負號。' },
          { q: '這個多項式最高是 x²，它是幾次多項式？', options: [{ t: '二次', ok: true, why: '次數看最高次的那一項。' }, { t: '三次', why: '項數是 3，但次數看 x 的最高次方：2。' }] }],
        found: '<b>項</b>：用 ＋、− 隔開的每一段。<b>係數</b>：字母前面的數（含正負）。<b>次數</b>：最高次的那一項的次方。' },
      { text: '把 <b>x² 的係數</b>拉到 0，看看會怎樣。', check: () => S.cs[0] === 0 && (S.cs[1] !== 0),
        qs: () => [{ q: '黃色磚不見了。現在它是幾次多項式？', options: [{ t: '一次', ok: true, why: '最高只剩 x（一次）。' }, { t: '還是二次', why: 'x² 的係數是 0，等於沒有這一項。' }] },
          { q: '如果三個都拉到 0，只剩下「0」，它叫什麼？', options: [{ t: '零多項式（不談次數）', ok: true, why: '0 沒有最高次項，所以不說次數。' }, { t: '零次多項式', why: '零次多項式是「不是 0 的常數」，例如 5。' }] }],
        found: '次數是「係數不是 0 的最高次」。常數（像 5）是<b>零次</b>；0 叫<b>零多項式</b>，不談次數。' },
      { text: '代數字：把 x² 係數 1、x 係數 2、常數 −3，x 拉到 <b>−2</b>。', check: () => S.is(1, 2, -3) && S.x === -2,
        qs: () => [{ num: true, signed: true, q: `x ＝ −2 時，${P([1, 2, -3])} 的值是？`, pre: '＝', answer: -3, hint: '(−2)² ＝ 4，2 × (−2) ＝ −4。', diag: [{ v: -11, msg: '(−2)² 是 ＋4。' }, { v: 5, msg: '2x ＝ 2 × (−2) ＝ −4。' }], why: '4 − 4 − 3 ＝ −3' }],
        found: '代入 x 的值，就能算出多項式的<b>值</b>。負數記得加括號再平方。' }
    ]);
    S = polySim(card, () => tk.check());
    card.appendChild(tk.slot); p.insertBefore(p.querySelector('.u4-task'), card); tk.start();
  }

  function know(p, api) {
    p.appendChild(h('<p class="muted">把剛剛玩到的，收成 4 句話。</p>'));
    K.table(U.card(p, '① 項、係數、常數項', `<p>例：${P([3, -2, 5])}</p>`), ['項', '3x²', '−2x', '5'], [['係數', '3', '−2', '（常數項）5'], ['次方', '2', '1', '0']], 360);
    Q.tilesPic(U.card(p, '② 次數：看最高次', `<p>${P([3, -2, 5])} → <b>二次</b>多項式</p><p>${P([0, 4, -1])} → 一次；7 → 零次；0 → 零多項式</p>`), [3, -2, 5]);
    K.table(U.card(p, '③ 降冪、升冪排列', '<p>把項照次方排好，比較不會漏。</p>'), ['', '寫法'], [['原本', '5 − 2x + 3x²'], ['降冪（大 → 小）', '3x² − 2x + 5'], ['升冪（小 → 大）', '5 − 2x + 3x²']], 340);
    Q.tilesPic(U.card(p, '④ 同類項：形狀一樣的磚', '<p>3x 和 −5x 是同類項（都是長條），可以合併成 −2x。</p><p>3x 和 3x² 不是同類項（形狀不一樣），不能合併。</p>'), [1, 3, 0]);
    const c = h('<div class="card"><h3>✏️ 檢查一下</h3></div>'); p.appendChild(c);
    U.numq(c, { q: `${M('6 − x + 4' + X2)} 排成降冪後，x 項的係數是多少？`, pre: '', signed: true, answer: -1, hint: '−x 就是 −1 × x。', diag: [{ v: 1, msg: '前面有負號。' }, { v: 0, msg: '−x 的係數是 −1，不是沒有。' }], why: '降冪：4x² − x + 6，x 項係數 −1。', onDone() { api.done(); } });
  }

  function exam(p, api) {
    U.exam(p, api, {
      intro: '會考很少單獨考這一節，但後面每一題都會用到這些名詞。先練熟。',
      benchLabel: '想拼拼看？打開代數磚模擬',
      bench: host => polySim(host, () => {}),
      qs: [
        { src: '基本題', q: `關於多項式 ${M('7 − 3' + X2 + ' + x')}，下列敘述何者正確？`, hint: '先排成降冪：−3x² + x + 7。',
          options: [{ t: '二次項係數是 3', why: '是 −3，負號要帶著。' }, { t: '一次項係數是 1', ok: true, why: 'x ＝ 1 × x。' }, { t: '常數項是 −7', why: '7 前面沒有負號。' }, { t: '它是三次多項式', why: '最高次是 x²：二次。' }] },
        { src: '基本題', q: '下列哪一組是同類項？', hint: '字母和次方都要一樣。',
          options: [{ t: `2x 和 2${X2}`, why: '次方不一樣。' }, { t: `−5${X2} 和 ${X2}`, ok: true, why: '都是 x²，係數不同沒關係。' }, { t: '3x 和 3', why: '一個有 x、一個沒有。' }, { t: 'x 和 y', why: '字母不一樣。' }] }
      ]
    });
  }

  function real(p, api) {
    U.real(p, api, [
      { stars: 1, src: K.SIM, q: `多項式 ${M('4x − 9 + 2' + X2)} 依降冪排列後，下列何者正確？`,
        options: [{ t: `2${X2} + 4x − 9`, ok: true, why: '次方由大到小：x²、x、常數。' }, { t: `−9 + 4x + 2${X2}`, why: '這是升冪。' }, { t: `4x + 2${X2} − 9`, why: 'x² 要放第一個。' }, { t: `2${X2} − 4x + 9`, why: '每一項的正負號不能改。' }],
        explain: '<p>降冪＝次方由高到低：2x²（二次）、4x（一次）、−9（常數）。答案 (A)。</p>',
        steps: [
          { q: '次方最高的是哪一項？', options: [{ t: `2${X2}`, ok: true, why: '二次。' }, { t: '4x', why: '4x 是一次。' }] },
          { q: '−9 搬到最後面，正負號要變嗎？', options: [{ t: '不用，項帶著自己的符號移動', ok: true, why: '−9 還是 −9。' }, { t: '要變成 ＋9', why: '只是換位置，不是移項。' }] }
        ] },
      { stars: 2, src: K.SIM, q: `若多項式 ${M('(a − 2)' + X2 + ' + 5x − 1')} 是一次多項式，則 a 之值為何？`,
        options: [{ t: '0', why: 'a ＝ 0 時 x² 的係數是 −2，還是二次。' }, { t: '2', ok: true, why: 'a − 2 ＝ 0，x² 那一項消失，剩 5x − 1 是一次。' }, { t: '−2', why: 'a − 2 ＝ −4，不是 0。' }, { t: '5', why: '5 是 x 的係數。' }],
        explain: '<p>要變一次多項式，x² 的係數必須是 0：a − 2 ＝ 0 → a ＝ 2。此時多項式為 5x − 1（x 的係數 5 不是 0，所以真的是一次）。答案 (B)。</p>',
        steps: [
          { q: '「一次多項式」代表最高次是？', options: [{ t: 'x 的一次方', ok: true, why: '所以不能有 x² 項。' }, { t: 'x²', why: '那是二次。' }] },
          { num: true, q: 'x² 的係數 a − 2 要等於 0，a ＝ ？', pre: 'a ＝', answer: 2 }
        ] },
      { stars: 3, src: K.SIM, q: `已知 x ＝ −1 時，多項式 ${M('3' + X2 + ' + kx − 2')} 的值為 6，求 k 之值為何？`,
        options: [{ t: '5', why: '代進去：3 − k − 2 ＝ 6 → k ＝ −5。' }, { t: '−5', ok: true, why: '3(−1)² ＋ k(−1) − 2 ＝ 1 − k ＝ 6 → k ＝ −5。' }, { t: '1', why: '(−1)² ＝ 1，3 × 1 ＝ 3。' }, { t: '−11', why: '再檢查：3 − 2 ＝ 1，1 − k ＝ 6。' }],
        explain: '<p>代 x ＝ −1：3 × (−1)² ＋ k × (−1) − 2 ＝ 3 − k − 2 ＝ 1 − k。<br>1 − k ＝ 6 → k ＝ −5。答案 (B)。</p>',
        steps: [
          { num: true, q: '3 × (−1)² ＝ ？', pre: '＝', answer: 3, diag: [{ v: -3, msg: '(−1)² ＝ ＋1。' }] },
          { q: 'k × (−1) ＝ ？', options: [{ t: '−k', ok: true, why: '乘 −1 就是變號。' }, { t: 'k', why: '乘上 −1 要變號。' }] },
          { num: true, signed: true, q: '3 − k − 2 ＝ 6，也就是 1 − k ＝ 6。k ＝ ？', pre: 'k ＝', answer: -5, diag: [{ v: 5, msg: '1 − k ＝ 6 → −k ＝ 5 → k ＝ −5。' }] }
        ] }
    ]);
  }

  K.run('1-2a', ['先猜猜看：一堆代數磚', '動手玩：拼出多項式', '收成 4 句話', '會考會用到的名詞', '會考題型實戰'], { guess, play, know, exam, real });
})();
