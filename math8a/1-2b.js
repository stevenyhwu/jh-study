/* ===== 數學 1-2b 多項式的加減 ===== */
(function () {
  'use strict';
  const U = Unit4, h = U.h, K = MK, Q = MK2, M = K.M, X2 = K.X2, num = K.num;
  const P = cs => M(Q.polyN(cs));

  /* A ± B：上面兩排磚，下面自己拉出答案 */
  function addSim(host, on) {
    host.appendChild(h('<p class="sim-h">把兩堆磚合起來：形狀一樣的才能放一起</p>'));
    const top = h('<div></div>'), res = h('<div></div>'), read = h('<div class="sim-read"></div>');
    let A = [1, 2, 1], B = [2, -1, 3], op = 1, R = [0, 0, 0];
    const sls = [];
    function target() { return Q.addP(A, B, op); }
    function draw() {
      top.innerHTML = '';
      top.appendChild(h(`<div class="small"><b>A</b> ＝ ${P(A)}</div>`)); Q.tilesPic(top, A, 420, 'sim');
      top.appendChild(h(`<div class="small"><b>B</b> ＝ ${P(B)}${op < 0 ? `　→　減 B ＝ 加上 <b>${P(B.map(c => -c))}</b>（每個都變號）` : ''}</div>`)); Q.tilesPic(top, op < 0 ? B.map(c => -c) : B, 420, 'sim');
      res.innerHTML = '<div class="small"><b>你的答案</b></div>'; Q.tilesPic(res, R, 420, 'sim');
      const t = target(), ok = t.every((c, i) => c === R[i]);
      const wrong = ['x²', 'x', '常數'].filter((_, i) => t[i] !== R[i]);
      read.innerHTML = `A ${op > 0 ? '＋' : '−'} B ＝ ？　你拼的是 ${P(R)}<br>${ok ? '<b style="color:var(--good)">✔ 對了！</b>' : `<span class="muted">還不對的：${wrong.join('、')}</span>`}`;
    }
    host.append(top, h(`<div>${Q.tileLegend}</div>`));
    const ch = U.chips(host, '算', [{ v: 1, t: 'A ＋ B' }, { v: -1, t: 'A − B' }], op, v => { op = v; draw(); on(); });
    host.appendChild(res);
    ['答案的 x² 係數', '答案的 x 係數', '答案的常數項'].forEach((lab, i) => {
      sls.push(U.slider(host, lab, { min: -6, max: 6, step: 1, value: 0, fmt: num }, v => { R[i] = v; draw(); on(); }));
    });
    host.appendChild(read); draw();
    return {
      set(a, b, o) { A = a; B = b; op = o; ch.set(o); R = [0, 0, 0]; sls.forEach(s => s.set(0)); draw(); },
      get ok() { const t = target(); return t.every((c, i) => c === R[i]); }, get op() { return op; }
    };
  }

  function guess(p, api) {
    U.guess(p, api, [
      { pic: c => { Q.tilesPic(c, [0, 3, 2]); Q.tilesPic(c, [0, 2, 4]); }, q: '上面一堆 3x + 2，下面一堆 2x + 4。合起來是？', options: [{ t: '5x + 6', ok: true }, { t: '11x' }, { t: '5x + 2' }],
        reveal: '長條和長條放一起（3x + 2x ＝ 5x），小方塊和小方塊放一起（2 ＋ 4 ＝ 6）：<b>5x + 6</b>。長條和小方塊不能合併。' },
      { q: `${M('(2x + 3) − (x − 1)')} ＝ ？`, options: [{ t: 'x + 2' }, { t: 'x + 4', ok: true }, { t: '3x + 2' }],
        reveal: '減去 (x − 1)，等於減 x、<b>加</b> 1：2x + 3 − x + 1 ＝ <b>x + 4</b>。括號前是減號，裡面<b>每一項都要變號</b>。' }
    ]);
  }

  function play(p, api) {
    let S;
    const card = h('<div class="card"></div>'); p.appendChild(card);
    const tk = U.tasks(p, api, [
      { text: `算 A ＋ B：用下面三個拉桿拼出答案。`, setup() { S.set([1, 2, 1], [2, -1, 3], 1); }, check: () => S.ok,
        qs: () => [{ q: 'x 項：2x ＋ (−x) 為什麼變成 x？', options: [{ t: '2 條綠的、1 條紅虛線（負的）抵消一條，剩 1 條', ok: true, why: '一正一負抵消成 0，叫「零對」。' }, { t: '2 ＋ 1 ＝ 3，應該是 3x', why: 'B 的 x 項是 −x，是負的。' }] }],
        found: '<b>加法</b>：同類項（形狀一樣的磚）係數相加。正的和負的會互相抵消。' },
      { text: `換成 <b>A − B</b>，再拼一次答案。`, setup() { S.set([1, 2, 1], [2, -1, 3], -1); }, check: () => S.ok && S.op < 0,
        qs: () => [{ q: '減 B 的時候，B 的每一項怎麼了？', options: [{ t: '全部變號：2x² → −2x²、−x → ＋x、3 → −3', ok: true, why: '減掉一個多項式 ＝ 加上它的相反。' }, { t: '只有第一項變號', why: '最常見的錯！括號裡<b>每一項</b>都要變號。' }] }],
        found: '<b>減法</b>：A − B ＝ A ＋ (−B)。括號前是減號，去括號時<b>每一項都變號</b>。' },
      { text: '不用模擬了，練去括號。', quiet: true, check: () => true,
        qs: () => [
          { q: `${M('(3' + X2 + ' − 2x + 5) − (' + X2 + ' − 4x − 1)')} ＝ ？`, options: [{ t: `2${X2} + 2x + 6`, ok: true, why: '3x² − x² ＝ 2x²；−2x ＋ 4x ＝ 2x；5 ＋ 1 ＝ 6。' }, { t: `2${X2} − 6x + 4`, why: '後面括號的 −4x、−1 要變號成 ＋4x、＋1。' }, { t: `2${X2} + 2x + 4`, why: '−(−1) ＝ ＋1，5 ＋ 1 ＝ 6。' }] },
          { q: `某多項式加上 ${M('2x − 3')} 得 ${M('5x + 1')}，某多項式是？`, options: [{ t: '3x + 4', ok: true, why: '某式 ＝ (5x + 1) − (2x − 3) ＝ 3x ＋ 4。' }, { t: '7x − 2', why: '是「減回去」：(5x + 1) − (2x − 3)。' }, { t: '3x − 2', why: '−(−3) ＝ ＋3，1 ＋ 3 ＝ 4。' }] }],
        found: '已知「某式 ＋ B ＝ C」，就用 <b>某式 ＝ C − B</b> 求回來。' }
    ]);
    S = addSim(card, () => tk.check());
    card.appendChild(tk.slot); p.insertBefore(p.querySelector('.u4-task'), card); tk.start();
  }

  function know(p, api) {
    p.appendChild(h('<p class="muted">把剛剛玩到的，收成 4 句話。</p>'));
    Q.tilesPic(U.card(p, '① 只有同類項能合併', `<p>${M('3x + 2x ＝ 5x')}　${M('4' + X2 + ' − ' + X2 + ' ＝ 3' + X2)}</p><p>${M('3x + 2')} 不能再合併（形狀不同）。</p>`), [0, 5, 0]);
    Q.tilesPic(U.card(p, '② 減法：每一項都變號', `<p>${M('−(2' + X2 + ' − x + 3) ＝ −2' + X2 + ' + x − 3')}</p><p>正的變負、負的變正（紅虛線 ↔ 實心）。</p>`), [-2, 1, -3]);
    K.table(U.card(p, '③ 直式：對齊同類項，缺項補 0', `<p>${M('(4' + X2 + ' − 3) + (2' + X2 + ' + 5x + 1)')}</p>`), ['', 'x²', 'x', '常數'], [['A', '4', '0', '−3'], ['B', '2', '5', '1'], ['A + B', '6', '5', '−2']], 320);
    K.table(U.card(p, '④ 求「某多項式」', '<p>做錯題型：某式 ＋ B ＝ C → 某式 ＝ C − B。</p>'), ['已知', '某式 ＝'], [['某式 ＋ B ＝ C', 'C − B'], ['某式 − B ＝ C', 'C ＋ B'], ['A − 某式 ＝ C', 'A − C']], 320);
    const c = h('<div class="card"><h3>✏️ 檢查一下</h3></div>'); p.appendChild(c);
    U.numq(c, { q: `${M('(5x − 2) − (3x − 7)')} ＝ 2x ＋ □，□ ＝ ？`, pre: '□ ＝', signed: true, answer: 5, hint: '−2 − (−7) ＝ −2 ＋ 7。', diag: [{ v: -9, msg: '−(−7) ＝ ＋7。' }, { v: -5, msg: '−2 ＋ 7 ＝ 5。' }], why: '5x − 2 − 3x ＋ 7 ＝ 2x ＋ 5', onDone() { api.done(); } });
  }

  function exam(p, api) {
    U.exam(p, api, {
      intro: '這兩題是照會考題的樣子改寫的。答錯可以再選。',
      benchLabel: '想拼拼看？打開代數磚模擬',
      bench: host => { const s = addSim(host, () => {}); s.set([0, 4, -1], [1, -2, 3], -1); },
      qs: [
        { src: '改寫自 114 年會考第 2 題', q: `計算 ${M('(3' + X2 + ' + 4x) − (2 − x)')} 的結果，與下列何者相同？`, hint: '−(2 − x) ＝ −2 ＋ x。',
          options: [{ t: `3${X2} + 3x − 2`, why: '−(−x) ＝ ＋x，4x ＋ x ＝ 5x。' }, { t: `3${X2} + 5x − 2`, ok: true, why: '3x² ＋ 4x − 2 ＋ x ＝ 3x² ＋ 5x − 2。' }, { t: `3${X2} + 5x + 2`, why: '−(2) ＝ −2。' }, { t: `3${X2} + 3x + 2`, why: '兩項都要變號：−2、＋x。' }] },
        { src: K.SIM, q: `小明把「某多項式減去 ${M('x − 4')}」算成了「加上 ${M('x − 4')}」，得到 ${M('3x + 1')}。正確答案應該是？`, hint: '先求某多項式：(3x + 1) − (x − 4)。',
          options: [{ t: '2x + 5', why: '這是某多項式本身，還要再減 (x − 4)。' }, { t: 'x + 9', ok: true, why: '某式 ＝ 2x ＋ 5；正確：(2x + 5) − (x − 4) ＝ x ＋ 9。' }, { t: '4x − 3', why: '這是把 (x − 4) 又加了一次。' }, { t: 'x + 1', why: '−(−4) ＝ ＋4，5 ＋ 4 ＝ 9。' }] }
      ]
    });
  }

  function real(p, api) {
    U.real(p, api, [
      { stars: 1, src: '114 年會考 第 2 題', q: `計算 ${M('(5' + X2 + ' − 2x) − (4 − 3x)')} 的結果，與下列何者相同？`,
        options: [{ t: `5${X2} − 3x`, why: '常數 −4 不見了。' }, { t: `5${X2} + x − 4`, ok: true, why: '−2x ＋ 3x ＝ x，再 −4。' }, { t: `5${X2} − 5x + 4`, why: '−(4 − 3x) ＝ −4 ＋ 3x，兩項都變號。' }, { t: `5${X2} − 5x − 4`, why: '−(−3x) ＝ ＋3x。' }],
        explain: '<p>去括號：5x² − 2x − 4 ＋ 3x ＝ 5x² ＋ x − 4。答案 (B)。</p>',
        steps: [
          { q: '−(4 − 3x) 去括號後是？', options: [{ t: '−4 ＋ 3x', ok: true, why: '每一項都變號。' }, { t: '−4 − 3x', why: '−3x 也要變號成 ＋3x。' }] },
          { q: 'x 項合併：−2x ＋ 3x ＝ ？', options: [{ t: 'x', ok: true, why: '−2 ＋ 3 ＝ 1。' }, { t: '−5x', why: '是 ＋3x。' }] }
        ] },
      { stars: 2, src: K.SIM, q: `已知 A ＝ ${M('2' + X2 + ' − 3x + 1')}、B ＝ ${M(X2 + ' + x − 4')}，求 A − B 的結果為何？`,
        options: [{ t: `${X2} − 2x − 3`, why: '−(x) ＝ −x，−3x − x ＝ −4x。' }, { t: `${X2} − 4x + 5`, ok: true, why: '2x² − x² ＝ x²；−3x − x ＝ −4x；1 − (−4) ＝ 5。' }, { t: `${X2} − 4x − 3`, why: '1 − (−4) ＝ ＋5。' }, { t: `3${X2} − 2x − 3`, why: '這是 A ＋ B。' }],
        explain: '<p>A − B ＝ (2x² − 3x + 1) − (x² + x − 4) ＝ 2x² − 3x ＋ 1 − x² − x ＋ 4 ＝ x² − 4x ＋ 5。答案 (B)。</p>',
        steps: [
          { q: '−(x² + x − 4) ＝ ？', options: [{ t: `−${X2} − x + 4`, ok: true, why: '三項全部變號。' }, { t: `−${X2} + x − 4`, why: '每一項都要變號。' }] },
          { num: true, signed: true, q: 'x 項：−3x − x ＝ □x', pre: '□ ＝', answer: -4 },
          { num: true, q: '常數：1 ＋ 4 ＝ ？', pre: '', answer: 5 }
        ] },
      { stars: 3, src: K.SIM, q: `已知 A ＝ ${M('3x − 2')}、B ＝ ${M(X2 + ' − x')}，求 2A − 3B 的結果為何？`,
        options: [{ t: `−3${X2} + 9x − 4`, ok: true, why: '2A ＝ 6x − 4，3B ＝ 3x² − 3x，相減 −3x² ＋ 9x − 4。' }, { t: `−3${X2} + 3x − 4`, why: '−3B 裡的 −(−3x) ＝ ＋3x，6x ＋ 3x ＝ 9x。' }, { t: `3${X2} + 3x − 4`, why: '這是 2A ＋ 3B，題目是減。' }, { t: `−3${X2} + 9x − 2`, why: '2A 的常數是 2 × (−2) ＝ −4。' }],
        explain: '<p>2A ＝ 6x − 4；3B ＝ 3x² − 3x。<br>2A − 3B ＝ 6x − 4 − 3x² ＋ 3x ＝ −3x² ＋ 9x − 4。答案 (A)。</p>',
        steps: [
          { q: '2A ＝ 2(3x − 2) ＝ ？', options: [{ t: '6x − 4', ok: true, why: '每一項都乘 2。' }, { t: '6x − 2', why: '−2 也要乘 2。' }] },
          { q: '3B ＝ 3(x² − x) ＝ ？', options: [{ t: `3${X2} − 3x`, ok: true, why: '每一項都乘 3。' }, { t: `3${X2} − x`, why: '−x 也要乘 3。' }] },
          { q: '(6x − 4) − (3x² − 3x) ＝ ？', options: [{ t: `−3${X2} + 9x − 4`, ok: true, why: '去括號變號，再合併。' }, { t: `−3${X2} + 3x − 4`, why: '−(−3x) ＝ ＋3x，6x ＋ 3x ＝ 9x。' }] }
        ] }
    ]);
  }

  K.run('1-2b', ['先猜猜看：兩堆磚合起來', '動手玩：代數磚加減', '收成 4 句話', '會考題改寫版', '會考實戰：照原題做做看'], { guess, play, know, exam, real });
})();
