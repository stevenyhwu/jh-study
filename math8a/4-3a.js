/* ===== 數學 4-3a 應用問題（數字、面積） ===== */
(function () {
  'use strict';
  const U = Unit4, h = U.h, K = MK, M = K.M, X2 = K.X2, ST = K.ST;

  /* 長 w、寬 hh 的長方形（單位格 u），標邊長文字 */
  function rectSvg(w, hh, lw, lh, inner, u) {
    u = u || 16;
    return { vb: `0 0 ${Math.max(w * u + 90, 200)} ${hh * u + 50}`, inner: `<rect x="50" y="26" width="${w * u}" height="${hh * u}" fill="#9fd3a8" fill-opacity=".6" ${ST}/>
      <text x="${50 + w * u / 2}" y="18" text-anchor="middle" class="t14b">${lw}</text><text x="44" y="${26 + hh * u / 2 + 5}" text-anchor="end" class="t14b">${lh}</text>
      <text x="${50 + w * u / 2}" y="${26 + hh * u / 2 + 5}" text-anchor="middle" class="t12b">${inner || ''}</text>` };
  }
  const rectPic = (host, a) => { const s = rectSvg.apply(null, a); const sv = U.svg(host, s.vb, s.inner, '長方形', 'u4-pic'); sv.style.maxWidth = '280px'; return sv; };

  /* 模擬：一個 x 決定長方形，讀面積。o = {title, min, max, w(x), hh(x), lw(x), lh(x), expr} */
  function areaSim(host, on, o) {
    host.appendChild(h(`<p class="sim-h">${o.title}</p>`));
    const pic = h('<div></div>'), read = h('<div class="sim-read"></div>');
    let x = o.start; const seen = {};
    function draw() {
      const w = o.w(x), hh = o.hh(x), A = w * hh; seen[x] = 1;
      pic.innerHTML = ''; const s = rectSvg(w, hh, o.lw(x), o.lh(x), '面積 ' + A, o.u); const sv = U.svg(pic, s.vb, s.inner, '長方形', 'sim'); sv.style.maxWidth = '300px';
      read.innerHTML = `x ＝ <b>${x}</b>　面積 ＝ ${o.expr(x)} ＝ <b>${A}</b>${A === o.target ? `　<b style="color:var(--good)">✔ 剛好 ${o.target}</b>` : ''}`;
    }
    host.appendChild(pic);
    U.slider(host, 'x', { min: o.min, max: o.max, step: 1, value: x }, v => { x = v; draw(); on(); });
    host.appendChild(read); draw();
    return { seen, get x() { return x; } };
  }

  /* 圖：照片加框 */
  function framePic(host) {
    const sv = U.svg(host, '0 0 260 190', `<rect x="40" y="20" width="180" height="150" fill="#f6c26b" fill-opacity=".55" ${ST}/>
      <rect x="64" y="44" width="132" height="102" fill="#9fd3a8" fill-opacity=".7" ${ST}/>
      <text x="130" y="92" text-anchor="middle" class="t14b">照片</text><text x="130" y="112" text-anchor="middle" class="t12">長 8、寬 6</text>
      <text x="52" y="99" text-anchor="middle" class="t12b">x</text><text x="208" y="99" text-anchor="middle" class="t12b">x</text><text x="130" y="37" text-anchor="middle" class="t12b">x</text><text x="130" y="163" text-anchor="middle" class="t12b">x</text>
      <text x="130" y="186" text-anchor="middle" class="t12">連框：長 8 + 2x、寬 6 + 2x</text>`, '照片四周加等寬的框');
    sv.style.maxWidth = '280px'; return sv;
  }
  /* 圖：直角三角形三邊 x、x+1、x+2 */
  function triPic(host) {
    const sv = U.svg(host, '0 0 240 150', `<polygon points="40,120 200,120 40,24" fill="#c9b8f0" fill-opacity=".55" ${ST}/>
      <rect x="40" y="108" width="12" height="12" fill="none" ${ST}/>
      <text x="120" y="140" text-anchor="middle" class="t14b">x + 1</text><text x="26" y="76" text-anchor="middle" class="t14b">x</text><text x="140" y="62" class="t14b">x + 2</text>`, '直角三角形，三邊是連續整數');
    sv.style.maxWidth = '260px'; return sv;
  }

  const GARDEN = { title: '花圃周長固定 20 公尺：長 x、寬 10 − x', start: 2, min: 1, max: 9, target: 24, w: x => x, hh: x => 10 - x, lw: x => `x ＝ ${x}`, lh: x => `${10 - x}`, expr: x => `${x} × ${10 - x}`, u: 14 };
  const GROW = { title: '正方形邊長 x，把其中一邊加長 2', start: 2, min: 1, max: 8, target: 35, w: x => x + 2, hh: x => x, lw: x => `x + 2 ＝ ${x + 2}`, lh: x => `${x}`, expr: x => `${x} × ${x + 2}`, u: 14 };

  function guess(p, api) {
    U.guess(p, api, [
      { q: '用 20 公尺的籬笆圍長方形花圃。不管怎麼圍，面積都一樣大嗎？', options: [{ t: '不一樣，要看長和寬', ok: true }, { t: '一樣，因為周長一樣' }],
        reveal: '<b>不一樣</b>。長 9 寬 1 → 面積 9；長 6 寬 4 → 面積 24。周長一樣，面積可以差很多。' },
      { q: '兩個<b>連續正整數</b>乘起來是 56，是哪兩個？', options: [{ t: '6 和 9' }, { t: '7 和 8', ok: true }, { t: '4 和 14' }],
        reveal: '<b>7 和 8</b>。數字小可以用猜的，但數字一大就猜不到了。今天學：<b>設 x → 列方程式 → 解 → 檢查</b>。' }
    ]);
  }

  function play(p, api) {
    let A, B;
    const P = U.panes(p, 2);
    const tk = U.tasks(p, api, [
      { text: '拉 x，找出讓花圃面積剛好是 <b>24</b> 的 x。（有兩個，都要找到）', setup() { P.show(0); }, check: () => A.seen[4] && A.seen[6] && (A.x === 4 || A.x === 6),
        qs: () => [{ q: '這題的方程式是哪一個？', options: [{ t: 'x(10 − x) ＝ 24', ok: true, why: '長 × 寬 ＝ 面積。乘開移項：x² − 10x + 24 ＝ 0 → (x − 4)(x − 6) ＝ 0。' }, { t: 'x + (10 − x) ＝ 24', why: '那是長加寬（周長的一半），題目要的是面積。' }] },
          { q: 'x ＝ 4 和 x ＝ 6，是兩個不同形狀的花圃嗎？', options: [{ t: '是同一個，只是長寬對調', ok: true, why: 'x ＝ 4 → 4 × 6；x ＝ 6 → 6 × 4。兩個解都合理。' }, { t: '是兩個不同的花圃', why: '看圖：4 × 6 和 6 × 4，只是轉了 90°。' }] }],
        found: '周長固定 20 → 長 ＋ 寬 ＝ 10 → 設長 x，<b>寬就是 10 − x</b>。' },
      { text: '換一題：正方形一邊加長 2 之後，面積是 <b>35</b>。找出 x。', setup() { P.show(1); }, check: () => B.x === 5,
        qs: () => [{ q: `方程式 ${M('x(x + 2) ＝ 35')} → ${M(X2 + ' + 2x − 35 ＝ 0')} → ${M('(x + 7)(x − 5) ＝ 0')}，解是 x ＝ 5 或 x ＝ −7。為什麼答案只有 5？`, options: [{ t: '邊長不能是負的，−7 不合', ok: true, why: '方程式解出來的數，要<b>回到題目檢查</b>合不合理。' }, { t: '−7 算錯了', why: '代回去：(−7)(−5) ＝ 35，方程式是成立的，只是不合題意。' }] }],
        found: '解出來<b>要檢查</b>：長度、人數、個數不能是負的。不合的要丟掉。' },
      { text: '不用模擬：兩個連續正整數的乘積是 56。', quiet: true, check: () => true,
        qs: () => [{ q: '設比較小的數是 x，方程式是？', options: [{ t: 'x(x + 1) ＝ 56', ok: true, why: '連續整數差 1，另一個是 x + 1。' }, { t: 'x + (x + 1) ＝ 56', why: '題目說「乘積」。' }, { t: 'x · 2x ＝ 56', why: '連續整數是差 1，不是 2 倍。' }] },
          { q: `${M(X2 + ' + x − 56 ＝ 0')} → ${M('(x + 8)(x − 7) ＝ 0')}。這兩個數是？`, options: [{ t: '7 和 8', ok: true, why: 'x ＝ 7（x ＝ −8 不是正整數，不合）。另一個是 8。' }, { t: '−8 和 −7', why: '題目說「正整數」。' }] }],
        found: '四步：<b>設 x → 列式 → 解 → 檢查</b>。' }
    ]);
    A = areaSim(P.list[0], () => tk.check(), GARDEN);
    B = areaSim(P.list[1], () => tk.check(), GROW);
    P.end(tk.slot); p.insertBefore(p.querySelector('.u4-task'), P.list[0].parentElement); tk.start();
  }

  function know(p, api) {
    p.appendChild(h('<p class="muted">把剛剛玩到的，收成 4 句話。</p>'));
    K.table(U.card(p, '① 應用題四步', '<p>每一題都照這個順序。</p>'), ['步驟', '做什麼'], [['設', '題目問什麼，就設它是 x'], ['列', '把題目的句子翻成等式'], ['解', '移項成 ＝ 0，因式分解（或公式解）'], ['檢查', '代回題目，丟掉不合理的解']], 360);
    rectPic(U.card(p, '② 面積題：先把長、寬用 x 寫出來', `<p>周長 20 → 長 ＋ 寬 ＝ 10 → 長 x、寬 10 − x。</p><p>面積 24：${M('x(10 − x) ＝ 24')}</p>`), [6, 4, 'x', '10 − x', '面積 24', 22]);
    K.table(U.card(p, '③ 常見的「設法」', '<p>看到這些關鍵字，就這樣設。</p>'), ['題目說', '設成'], [['兩個連續整數', 'x、x + 1'], ['兩個連續偶數（奇數）', 'x、x + 2'], ['長比寬多 3', '寬 x、長 x + 3'], ['兩數和是 10', 'x、10 − x']], 340);
    K.table(U.card(p, '④ 哪些解要丟掉', '<p>方程式成立，不代表合題意。</p>'), ['解出來', '為什麼不合'], [['邊長 ＝ −7', '長度不能是負的'], ['人數 ＝ 2.5', '人數要是整數'], ['寬比長還大', '跟題目的條件矛盾']], 340);
    const c = h('<div class="card"><h3>✏️ 檢查一下</h3></div>'); p.appendChild(c);
    rectPic(c, [8, 5, 'x + 3', 'x', '面積 40', 20]);
    U.choice(c, { q: '長方形的長比寬多 3 公分，面積是 40 平方公分。設寬是 x 公分，方程式是？',
      options: [{ t: 'x(x + 3) ＝ 40', ok: true, why: '寬 x、長 x + 3，長 × 寬 ＝ 面積。' }, { t: 'x + (x + 3) ＝ 40', why: '面積是相乘。' }, { t: '3x ＝ 40', why: '長是「比寬多 3」，不是 3 倍。' }], onDone() { api.done(); } });
  }

  function exam(p, api) {
    U.exam(p, api, {
      intro: '會考很少單獨考一元二次方程式的應用題，這兩題是基本題。答錯可以再選。',
      qs: [
        { src: '基本題', q: '兩個連續正整數的乘積是 72，求這兩個數的<b>和</b>。', hint: '設小的是 x：x(x + 1) ＝ 72 → x² + x − 72 ＝ 0。',
          options: [{ t: '16', why: '8 × 8 ＝ 64，而且要「連續」。' }, { t: '17', ok: true, why: '(x + 9)(x − 8) ＝ 0 → x ＝ 8。兩數是 8、9，和是 17。' }, { t: '18', why: '9 × 9 ＝ 81。' }, { t: '−17', why: '題目說正整數，−9、−8 不合。' }] },
        { src: '基本題', pic: c => rectPic(c, [8, 5, 'x + 3', 'x', '面積 40', 20]), q: '長方形的長比寬多 3 公分，面積是 40 平方公分。寬是多少公分？', hint: 'x(x + 3) ＝ 40 → x² + 3x − 40 ＝ 0 → (x + 8)(x − 5) ＝ 0。',
          options: [{ t: '4', why: '4 × 7 ＝ 28，不是 40。' }, { t: '5', ok: true, why: 'x ＝ 5（x ＝ −8 不合）。寬 5、長 8，5 × 8 ＝ 40 ✔' }, { t: '8', why: '8 是長；題目問寬。' }, { t: '−8', why: '長度不能是負的。' }] }
      ]
    });
  }

  function real(p, api) {
    U.real(p, api, [
      { stars: 1, src: K.SIM, q: '某<b>正數</b>的平方比它的 3 倍多 10，求此數。',
        options: [{ t: '2', why: '2² ＝ 4，3 × 2 ＋ 10 ＝ 16，不相等。' }, { t: '5', ok: true, why: '5² ＝ 25，3 × 5 ＋ 10 ＝ 25 ✔' }, { t: '10', why: '10² ＝ 100，3 × 10 ＋ 10 ＝ 40。' }, { t: '−2', why: '−2 代進去成立，但題目說「正數」。' }],
        explain: '<p>設此數為 x：x² ＝ 3x ＋ 10 → x² − 3x − 10 ＝ 0 → (x − 5)(x + 2) ＝ 0 → x ＝ 5 或 −2。<br>題目說正數，所以是 5。答案 (B)。</p>',
        steps: [
          { q: '「平方比它的 3 倍多 10」翻成等式是？', options: [{ t: `${X2} ＝ 3x + 10`, ok: true, why: '「A 比 B 多 10」就是 A ＝ B ＋ 10。' }, { t: `${X2} + 10 ＝ 3x`, why: '多 10 的是平方那一邊。' }] },
          { q: `移項：${M(X2 + ' − 3x − 10 ＝ 0')}。因式分解後的解是？`, options: [{ t: 'x ＝ 5 或 x ＝ −2', ok: true, why: '(x − 5)(x + 2) ＝ 0。題目要正數，所以取 5。' }, { t: 'x ＝ −5 或 x ＝ 2', why: '(x + 5)(x − 2) 的中間項是 ＋3x。' }] }
        ] },
      { stars: 2, src: K.SIM, pic: framePic, q: '一張長 8 公分、寬 6 公分的照片，四周加上寬度都是 x 公分的框。若連框的總面積為 80 平方公分，則 x 之值為何？',
        options: [{ t: '1', ok: true, why: '(8 + 2)(6 + 2) ＝ 10 × 8 ＝ 80 ✔' }, { t: '2', why: '如果只加一邊才是 8 + x。左右兩邊都有框：8 + 2x。' }, { t: '4', why: '(8 + 8)(6 + 8) ＝ 224，太大了。' }, { t: '8', why: 'x + 8 ＝ 0 的解是 −8，寬度不能是負的。' }],
        explain: '<p>左右各加 x、上下各加 x → 連框的長是 8 ＋ 2x、寬是 6 ＋ 2x。<br>(8 + 2x)(6 + 2x) ＝ 80 → 4x² + 28x + 48 ＝ 80 → 4x² + 28x − 32 ＝ 0 → x² + 7x − 8 ＝ 0<br>→ (x + 8)(x − 1) ＝ 0 → x ＝ 1（−8 不合）。答案 (A)。</p>',
        steps: [
          { q: '連框以後，整個長方形的<b>長</b>是多少？', options: [{ t: '8 + 2x', ok: true, why: '左邊、右邊各有一條寬 x 的框。寬同理是 6 ＋ 2x。' }, { t: '8 + x', why: '看圖：左右兩邊都有框。' }] },
          { q: `${M('(8 + 2x)(6 + 2x) ＝ 80')} 乘開、移項、同除以 4，會得到？`, options: [{ t: `${X2} + 7x − 8 ＝ 0`, ok: true, why: '4x² + 28x + 48 − 80 ＝ 0 → 4x² + 28x − 32 ＝ 0 → 除以 4。' }, { t: `${X2} + 7x + 12 ＝ 0`, why: '右邊的 80 要移過來：48 − 80 ＝ −32。' }] },
          { q: `${M('(x + 8)(x − 1) ＝ 0')}，框的寬度 x ＝ ？`, options: [{ t: '1', ok: true, why: 'x ＝ −8 不合（寬度不能是負的）。' }, { t: '8', why: 'x + 8 ＝ 0 → x ＝ −8，是負的，不合。' }] }
        ] },
      { stars: 3, src: K.SIM, pic: triPic, q: '一個直角三角形的三邊長是三個連續正整數，求此三角形的周長。',
        options: [{ t: '6', why: '1、2、3 圍不成三角形。' }, { t: '9', why: '2、3、4：4 ＋ 9 ≠ 16，不是直角三角形。' }, { t: '12', ok: true, why: '三邊 3、4、5：9 ＋ 16 ＝ 25 ✔，周長 12。' }, { t: '15', why: '4、5、6：16 ＋ 25 ≠ 36。' }],
        explain: '<p>設三邊為 x、x + 1、x + 2，最長的 x + 2 是斜邊。畢氏定理：<br>x² ＋ (x + 1)² ＝ (x + 2)² → 2x² + 2x + 1 ＝ x² + 4x + 4 → x² − 2x − 3 ＝ 0<br>→ (x − 3)(x + 1) ＝ 0 → x ＝ 3（−1 不合）。三邊 3、4、5，周長 12。答案 (C)。</p>',
        steps: [
          { q: '三邊 x、x + 1、x + 2，哪一個是斜邊？', options: [{ t: 'x + 2（最長的）', ok: true, why: '直角三角形斜邊最長。' }, { t: 'x', why: '斜邊是最長的那一邊。' }] },
          { q: '用畢氏定理列式：', options: [{ t: `${X2} + (x + 1)<sup>2</sup> ＝ (x + 2)<sup>2</sup>`, ok: true, why: '兩股平方和 ＝ 斜邊平方。整理後是 x² − 2x − 3 ＝ 0。' }, { t: 'x + (x + 1) ＝ x + 2', why: '畢氏定理是「平方」相加。' }] },
          { num: true, q: `${M(X2 + ' − 2x − 3 ＝ 0')} → ${M('(x − 3)(x + 1) ＝ 0')} → x ＝ 3。三邊是 3、4、5，周長 ＝ ？`, pre: '周長 ＝', answer: 12 }
        ] }
    ], '會考沒有單獨考這個小節的原題，這三題是照會考的出題方式寫的模擬題。由簡單排到難，卡住就按「🪜 拆解」。');
  }

  K.run('4-3a', ['先猜猜看', '動手玩：花圃與長方形', '收成 4 句話', '基本題', '實戰：會考題型模擬題'], { guess, play, know, exam, real });
})();
