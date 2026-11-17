/* ===== 數學 3-1 提公因式 ===== */
(function () {
  'use strict';
  const U = Unit4, h = U.h, K = MK, M = K.M, X2 = K.X2;

  const PROBS = [
    { expr: '6x + 12', opts: [
      { t: '提 2', left: '2', tops: ['3x', '6'], cells: ['6x', '12'], res: '2(3x + 6)', note: '可以，但是括號裡的 3x 和 6 還有公因數 3，沒提乾淨。' },
      { t: '提 3', left: '3', tops: ['2x', '4'], cells: ['6x', '12'], res: '3(2x + 4)', note: '可以，但是括號裡的 2x 和 4 還有公因數 2，沒提乾淨。' },
      { t: '提 6', left: '6', tops: ['x', '2'], cells: ['6x', '12'], res: '6(x + 2)', best: true, note: '括號裡的 x 和 2 沒有公因數了，提乾淨了！' },
      { t: '提 x', bad: '12 裡面沒有 x，不是「每一項都有」，不能提。' }] },
    { expr: `${X2} + 3x`, opts: [
      { t: '提 3', bad: 'x² 裡面沒有 3，不能提。' },
      { t: '提 x', left: 'x', tops: ['x', '3'], cells: ['x²', '3x'], res: 'x(x + 3)', best: true, note: 'x² ＝ x × x，3x ＝ x × 3，每一項都有一個 x。' },
      { t: `提 ${X2}`, bad: '3x 裡面只有一個 x，提不出 x²。' }] },
    { expr: '3(x + 2) + x(x + 2)', opts: [
      { t: '提 3', bad: '第二項 x(x + 2) 裡面沒有 3。' },
      { t: '提 x', bad: '第一項 3(x + 2) 外面沒有 x。' },
      { t: '提 (x + 2)', left: '(x + 2)', tops: ['3', 'x'], cells: ['3(x + 2)', 'x(x + 2)'], res: '(x + 2)(3 + x)', best: true, note: '把 (x + 2) 整包當成一個東西，兩項都有它。' }] }
  ];

  function facSim(host, on) {
    host.appendChild(h('<p class="sim-h">每一項都有的東西，提到左邊當「寬」</p>'));
    const tgt = h('<div class="sim-note"></div>'), ch = h('<div></div>'), pic = h('<div></div>'), read = h('<div class="sim-read">選一個試試看。</div>');
    host.append(tgt, ch, pic, read);
    let tried = 0, best = false;
    return {
      set(i) {
        const P = PROBS[i]; tried = 0; best = false; pic.innerHTML = ''; ch.innerHTML = ''; read.innerHTML = '選一個試試看。';
        tgt.innerHTML = `🎯 ${M(P.expr)} 要提什麼出來？`;
        U.chips(ch, '', P.opts.map((o, k) => ({ v: k, t: o.t })), -1, k => {
          const o = P.opts[k]; tried++; pic.innerHTML = '';
          if (o.bad) read.innerHTML = `<span style="color:${K.NEG}">✘ ${o.bad}</span>`;
          else { K.rowPic(pic, o.left, o.tops, o.cells); if (o.best) best = true; read.innerHTML = `${M(P.expr)} ＝ <b>${M(o.res)}</b><br>${o.best ? '<b style="color:var(--good)">✔ </b>' : ''}${o.note}`; }
          on();
        });
      },
      get tried() { return tried; }, get best() { return best; }
    };
  }

  function guess(p, api) {
    U.guess(p, api, [
      { q: '6 × 7 ＋ 6 × 3，怎麼算最快？', options: [{ t: '6 × (7 ＋ 3) ＝ 6 × 10 ＝ 60', ok: true }, { t: '只能 42 ＋ 18 慢慢加' }],
        reveal: '兩項都有 <b>6</b>，把 6「提出來」：6 × 7 ＋ 6 × 3 ＝ 6 × (7 ＋ 3)。這就是<b>提公因式</b>。' },
      { pic: c => K.rowPic(c, '6', ['x', '2'], ['6x', '12']), q: `這個長方形的面積是 ${M('6x + 12')}，高是 6。那它的長是多少？`,
        options: [{ t: 'x + 2', ok: true }, { t: 'x + 12' }, { t: '6x + 2' }],
        reveal: `長是 <b>x + 2</b>：6x ÷ 6 ＝ x，12 ÷ 6 ＝ 2。所以 ${M('6x + 12 ＝ 6(x + 2)')}。` }
    ]);
  }

  function play(p, api) {
    let S;
    const card = h('<div class="card"></div>'); p.appendChild(card);
    const tk = U.tasks(p, api, [
      { text: `${M('6x + 12')}：把四個按鈕都按按看，找出<b>提得最乾淨</b>的。`, setup() { S.set(0); }, check: () => S.best && S.tried >= 3,
        qs: () => [{ q: '提 2、提 3、提 6 都可以，為什麼提 6 最好？',
          options: [{ t: '6 是 6 和 12 的最大公因數，括號裡不能再提了', ok: true, why: '因式分解要分到<b>不能再分</b>，所以數字要提<b>最大公因數</b>。' }, { t: '因為 6 最大，數字大就好', why: '提 12 更大，可是 6x 裡沒有 12。重點是「每一項都有」而且「最大」。' }] }],
        found: '數字提<b>最大公因數</b>；提完檢查括號裡還能不能再提。' },
      { text: `換成 ${M(X2 + ' + 3x')}：這次要提什麼？`, setup() { S.set(1); }, check: () => S.best,
        qs: () => [{ q: `${M('x(x + 3)')} 乘開檢查，會得到什麼？`, options: [{ t: `${X2} + 3x`, ok: true, why: '乘開跟原來一樣，就是分對了。' }, { t: `${X2} + 3`, why: 'x 要乘到括號裡的每一項：x × x 和 x × 3。' }] }],
        found: '字母也能提。每一項都有 x，就提 x（提<b>次方最低</b>的那個）。' },
      { text: `最後：${M('3(x + 2) + x(x + 2)')}，每一項都有的是什麼？`, setup() { S.set(2); }, check: () => S.best,
        qs: () => [{ q: `同樣的想法：${M('5(a − 1) − b(a − 1)')} ＝ ？`, options: [{ t: '(a − 1)(5 − b)', ok: true, why: '把 (a − 1) 整包提出來，剩下 5 和 −b。' }, { t: '(a − 1)(5 + b)', why: '第二項前面是減號，提出來後剩 −b。' }] }],
        found: '<b>整包括號</b>也可以當公因式提出來。' }
    ]);
    S = facSim(card, () => tk.check());
    card.appendChild(tk.slot); p.insertBefore(p.querySelector('.u4-task'), card); tk.start();
  }

  function know(p, api) {
    p.appendChild(h('<p class="muted">把剛剛玩到的，收成 4 句話。</p>'));
    K.rowPic(U.card(p, '① 提公因式＝分配律倒過來', `<p>${M('ax + ay ＝ a(x + y)')}</p><p>每一項都有 a，把 a 提到括號外面。面積一樣，只是寫成「高 × 長」。</p>`), 'a', ['x', 'y'], ['ax', 'ay']);
    K.rowPic(U.card(p, '② 要提就提最乾淨', `<p>數字提<b>最大公因數</b>，字母提<b>次方最低</b>的。</p><p>例：${M('6' + X2 + ' + 9x ＝ 3x(2x + 3)')}</p>`), '3x', ['2x', '3'], ['6x²', '9x']);
    K.rowPic(U.card(p, '③ 整包括號也能提', `<p>例：${M('3(x + 2) + x(x + 2) ＝ (x + 2)(3 + x)')}</p>`), '(x + 2)', ['3', 'x'], ['3(x + 2)', 'x(x + 2)']);
    K.table(U.card(p, '④ 差一個負號：先變號', `<p>${M('b − a ＝ −(a − b)')}，方向相反的括號先變號就一樣了。</p><p>例：${M('x(a − b) + y(b − a) ＝ x(a − b) − y(a − b) ＝ (a − b)(x − y)')}</p>`),
      ['相反的括號', '變號後'], [['b − a', '−(a − b)'], ['2 − x', '−(x − 2)'], ['1 − 2x', '−(2x − 1)']], 300);
    const c = h('<div class="card"><h3>✏️ 檢查一下</h3></div>'); p.appendChild(c);
    U.choice(c, { q: `${M('4' + X2 + ' − 8x')} 因式分解是哪一個？`, hint: '數字的最大公因數是 4，字母每一項都有 x。',
      options: [{ t: '4x(x − 2)', ok: true, why: '4x × x ＝ 4x²，4x × (−2) ＝ −8x ✔' }, { t: `4(${X2} − 2x)`, why: '括號裡每一項還有 x，沒提乾淨。' }, { t: 'x(4x − 8)', why: '括號裡的 4 和 8 還有公因數 4。' }], onDone() { api.done(); } });
  }

  function exam(p, api) {
    U.exam(p, api, {
      intro: '第 1 題是基本題，第 2 題是照會考題的樣子改寫的。答錯可以再選。',
      qs: [
        { src: '基本題', q: `下列何者是 ${M('6' + X2 + ' − 9x')} 的因式分解？`, hint: '6 和 9 的最大公因數是 3；每一項都有 x。',
          options: [{ t: `3(2${X2} − 3x)`, why: '括號裡還有 x 可以提。' }, { t: 'x(6x − 9)', why: '括號裡的 6 和 9 還有公因數 3。' }, { t: '3x(2x − 3)', ok: true, why: '3x × 2x ＝ 6x²，3x × (−3) ＝ −9x ✔' }, { t: '3x(2x − 9)', why: '3x × (−9) ＝ −27x，不是 −9x。' }] },
        { src: '改寫自 113 年會考第 10 題', q: `下列何者為多項式 ${M('x(x − 2) − 3(x − 2)<sup>2</sup>')} 的因式分解？`, hint: '兩項都有 (x − 2)。提出來以後，第二項還剩 −3(x − 2)。',
          options: [{ t: '(x − 2)(x − 3)', why: '第二項是 −3(x − 2)<sup>2</sup>，提走一個 (x − 2) 還剩 −3(x − 2)，不是 −3。' },
            { t: '(x − 2)(−2x + 6)', ok: true, why: '(x − 2)[x − 3(x − 2)] ＝ (x − 2)(x − 3x + 6) ＝ (x − 2)(−2x + 6)。' },
            { t: '(x − 2)(−2x − 6)', why: '−3 × (−2) ＝ ＋6，不是 −6。' },
            { t: '(x − 2)(4x − 6)', why: '括號裡是 x − 3x ＝ −2x，不是 x ＋ 3x。' }] }
      ]
    });
  }

  function real(p, api) {
    U.real(p, api, [
      { stars: 1, src: K.SIM,
        q: `多項式 ${M('3x(x − 4) + 2(x − 4)')} 可因式分解成 ${M('(x − 4)(ax + b)')}，其中 a、b 均為整數，求 a + b 之值為何？`,
        options: [{ t: '1', why: '括號裡是 3x ＋ 2，a ＝ 3、b ＝ 2，要相加。' }, { t: '5', ok: true, why: '(x − 4)(3x + 2)，a ＝ 3、b ＝ 2，a + b ＝ 5。' }, { t: '6', why: '6 是 3 × 2；題目問的是 a + b。' }, { t: '−1', why: '提出 (x − 4) 之後剩下的是 3x 和 ＋2。' }],
        explain: '<p>兩項都有 (x − 4)，提出來：3x(x − 4) + 2(x − 4) ＝ (x − 4)(3x + 2)。<br>a ＝ 3、b ＝ 2，a + b ＝ 5。答案 (B)。</p>',
        steps: [
          { q: '兩項 3x(x − 4) 和 2(x − 4) 都有的是什麼？', options: [{ t: '(x − 4)', ok: true, why: '整包括號當公因式。' }, { t: 'x', why: '第二項 2(x − 4) 外面沒有 x。' }] },
          { q: '提出 (x − 4) 以後，括號裡剩下什麼？', options: [{ t: '3x + 2', ok: true, why: '所以是 (x − 4)(3x + 2)。' }, { t: '3x − 2', why: '中間是加號。' }, { t: '5x', why: '3x 和 2 不是同類項，不能合併。' }] }
        ] },
      { stars: 2, src: '113 年會考 第 10 題',
        q: `下列何者為多項式 ${M('5x(5x − 2) − 4(5x − 2)<sup>2</sup>')} 的因式分解？`,
        options: [{ t: '(5x − 2)(25x − 8)', why: '括號裡是 5x − 4(5x − 2) ＝ 5x − 20x + 8，不是相加。' },
          { t: '(5x − 2)(5x − 4)', why: '第二項提走一個 (5x − 2) 以後，還剩 −4(5x − 2)，不是 −4。' },
          { t: '(5x − 2)(−15x + 8)', ok: true, why: '5x − 4(5x − 2) ＝ 5x − 20x + 8 ＝ −15x + 8。' },
          { t: '(5x − 2)(−20x + 4)', why: '括號裡的 5x 不見了：是 5x − 20x + 8。' }],
        explain: '<p>兩項都有 (5x − 2)，提出來：<br>(5x − 2)[5x − 4(5x − 2)] ＝ (5x − 2)(5x − 20x + 8) ＝ (5x − 2)(−15x + 8)。答案 (C)。<br>💡 平方的那一項提走一個，還剩一個，別忘了。</p>',
        steps: [
          { q: '兩項都有的公因式是什麼？', options: [{ t: '(5x − 2)', ok: true, why: '第二項的 (5x − 2)<sup>2</sup> 裡有兩個 (5x − 2)。' }, { t: '5x', why: '第二項 −4(5x − 2)<sup>2</sup> 外面沒有 5x。' }] },
          { q: `第二項 ${M('−4(5x − 2)<sup>2</sup>')} 提走一個 (5x − 2)，還剩什麼？`, options: [{ t: '−4(5x − 2)', ok: true, why: '平方是兩個相乘，提走一個還有一個。' }, { t: '−4', why: '平方有兩個 (5x − 2)，只提走一個。' }] },
          { q: `括號裡是 ${M('5x − 4(5x − 2)')}，化簡後是？`, options: [{ t: '−15x + 8', ok: true, why: '5x − 20x + 8 ＝ −15x + 8。' }, { t: '−15x − 8', why: '−4 × (−2) ＝ ＋8。' }, { t: '25x − 8', why: '是 5x 減 20x。' }] }
        ] },
      { stars: 3, src: K.SIM,
        q: `下列何者為多項式 ${M('(2x − 1)(x + 3) − (1 − 2x)(x − 5)')} 的因式分解？`,
        options: [{ t: '8(2x − 1)', why: '(1 − 2x) 和 (2x − 1) 差一個負號。變號後中間是「加」：(x + 3) + (x − 5)。' },
          { t: '2(2x − 1)(x − 1)', ok: true, why: '(2x − 1)[(x + 3) + (x − 5)] ＝ (2x − 1)(2x − 2) ＝ 2(2x − 1)(x − 1)。' },
          { t: '2(2x − 1)(x + 4)', why: '(x + 3) + (x − 5) ＝ 2x − 2，不是 2x + 8。' },
          { t: '(2x − 1)(x − 1)', why: '2x − 2 提出 2 以後，那個 2 要留在前面。' }],
        explain: '<p>1 − 2x ＝ −(2x − 1)，所以 −(1 − 2x)(x − 5) ＝ ＋(2x − 1)(x − 5)。<br>原式 ＝ (2x − 1)[(x + 3) + (x − 5)] ＝ (2x − 1)(2x − 2) ＝ 2(2x − 1)(x − 1)。答案 (B)。<br>💡 最後檢查括號裡還能不能再提：2x − 2 還能提 2。</p>',
        steps: [
          { q: '(1 − 2x) 跟 (2x − 1) 是什麼關係？', options: [{ t: '1 − 2x ＝ −(2x − 1)', ok: true, why: '差一個負號。所以「−(1 − 2x)」會變成「＋(2x − 1)」。' }, { t: '一樣', why: '代 x ＝ 1：1 − 2 ＝ −1，2 − 1 ＝ 1，差一個負號。' }] },
          { q: '變號後：(2x − 1)(x + 3) + (2x − 1)(x − 5)。提出 (2x − 1)，括號裡是？', options: [{ t: '(x + 3) + (x − 5) ＝ 2x − 2', ok: true, why: '所以是 (2x − 1)(2x − 2)。' }, { t: '(x + 3) − (x − 5) ＝ 8', why: '變號以後中間是加號。' }] },
          { q: '(2x − 1)(2x − 2) 分完了嗎？', options: [{ t: '還沒，2x − 2 可以再提 2', ok: true, why: '2x − 2 ＝ 2(x − 1)，答案是 2(2x − 1)(x − 1)。' }, { t: '分完了', why: '看 2x − 2：兩項都有 2。' }] }
        ] }
    ]);
  }

  K.run('3-1', ['先猜猜看：怎麼算最快？', '動手玩：提出來拼長方形', '收成 4 句話', '基本題與會考改寫題', '實戰：會考原題與模擬題'], { guess, play, know, exam, real });
})();
