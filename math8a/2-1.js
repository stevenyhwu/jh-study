/* ===== 2-1 平方根與近似值：可可貓的正方形訂單（4 關） =====
   核心想法：知道正方形巧克力有幾格（面積）→ 找邊長，就是開根號 */
(function () {
  'use strict';
  const R = String.raw;
  const { Choco } = Lesson;
  const { numLine, raw } = Viz;
  const challenge = s => `<span class="chal">⭐ 挑戰題</span> ${s}`;
  const formula = (f, tip) => `<div class="formula">${f}</div>${tip ? `<div class="tip">${tip}</div>` : ''}`;
  const chips = (h, list) => { h.appendChild(Lesson.h(`<div class="chips">${list.map(s => typeof s === 'string' ? `<span>${s}</span>` : `<span class="hi">${s[0]}</span>`).join('')}</div>`)); JH.renderMath(h); };
  // 兩片正方形並排（夾擠用）
  function twoSquares(h, a, b, mid) {
    const box = Lesson.h('<div style="display:flex;gap:6px;align-items:flex-end;justify-content:center"></div>');
    h.appendChild(box);
    const s1 = Lesson.h('<div style="flex:1;max-width:46%"></div>'), s2 = Lesson.h('<div style="flex:1;max-width:54%"></div>');
    box.appendChild(s1); box.appendChild(s2);
    const c1 = Choco(s1, { rows: a, cols: a, cell: 26, pad: 22 }); c1.label(0, 0, a, a, `${a * a} 格`);
    const c2 = Choco(s2, { rows: b, cols: b, cell: 26, pad: 22 }); c2.label(0, 0, b, b, `${b * b} 格`);
    if (mid) h.appendChild(Lesson.h(`<p class="muted small" style="text-align:center;margin:4px 0 0">${mid}</p>`));
  }

  /* =========================================================
     第 1 關：知道格數，找邊長（平方根的意思）
     ========================================================= */
  const S1 = { id: 's1', badge: '🟫', title: '第 1 關　知道格數找邊長', steps: [
    { say: '客人打電話來：「我要一片<b>正方形</b>的巧克力，剛好 <b>25 格</b>！」<br>可可貓要先知道邊長，才能切。',
      scene: (h) => { Choco(h, { rows: 5, cols: 5 }).countMode(); },
      ask: { type: 'num', q: '25 格的正方形，邊長是幾格？', fields: [{ answer: 5, diag: [{ v: 12.5, msg: '25÷2 不對喔！正方形是「邊長 × 邊長」，什麼數自己乘自己是 25？' }] }] },
      after: '因為 5×5＝25。<br>👉 <b>找邊長，就是找「哪個數自己乘自己會等於格數」</b>。' },
    { say: '可可貓把常用的正方形背起來了，你也試試：',
      ask: { type: 'num', fields: [{ pre: R`\(6^2=\)`, answer: 36 }, { pre: R`\(7^2=\)`, answer: 49 }, { pre: R`\(8^2=\)`, answer: 64 }, { pre: R`\(9^2=\)`, answer: 81 }] },
      after: R`還有 \(11^2=121\)、\(12^2=144\)、\(13^2=169\)、\(14^2=196\)、\(15^2=225\)……背起來很好用！` },
    { say: '反過來，知道格數找邊長：',
      scene: (h) => { Choco(h, { rows: 8, cols: 8, cell: 30 }).label(0, 0, 8, 8, '64 格'); },
      ask: { type: 'num', fields: [{ pre: '64 格的正方形，邊長＝', answer: 8 }, { pre: '　144 格的，邊長＝', answer: 12 }] } },
    { say: R`數學家用一個符號表示「邊長」：<b>根號</b> \(\sqrt{\;\;}\)。<br>\(\sqrt{25}\) 念作「根號 25」，意思是「<b>哪個正數自己乘自己是 25</b>」。`,
      scene: (h) => { Choco(h, { rows: 5, cols: 5, pad: 40 }).ruler('top', 0, 5, '√25 = 5'); },
      ask: { type: 'num', fields: [{ pre: R`\(\sqrt{49}=\)`, answer: 7 }, { pre: R`　\(\sqrt{81}=\)`, answer: 9 }, { pre: R`　\(\sqrt{1}=\)`, answer: 1 }] } },
    { say: '可是……除了 5，還有沒有別的數，自己乘自己也是 25？',
      ask: { type: 'choice', q: '哪些數的平方是 25？', options: [
        { t: R`\(5\) 和 \(-5\)`, ok: true, why: R`對！\((-5)\times(-5)=25\)，負負得正。` },
        { t: R`只有 \(5\)`, why: R`試試 \((-5)\times(-5)\)：負負得正，也是 25！` },
        { t: R`\(5\) 和 \(\frac{25}{2}\)`, why: '25/2 自己乘自己會比 25 大很多喔。' }] },
      after: R`所以 <b>25 的平方根有兩個</b>：\(5\) 和 \(-5\)，寫成 \(\pm5\)。<br>但是 \(\sqrt{25}\) <b>只代表正的那個</b>（就像邊長不會是負的），負的那個寫成 \(-\sqrt{25}\)。` +
        formula(R`25 的平方根 \(=\pm\sqrt{25}=\pm5\)`, '「平方根」有正有負；「根號」只代表正的') },
    { say: '分清楚了嗎？',
      ask: { type: 'choice', q: R`\(\sqrt{36}=\)？`, options: [
        { t: '6', ok: true, why: '根號只代表正的那個。' },
        { t: R`\(\pm6\)`, why: R`「36 的平方根」才是 \(\pm6\)；\(\sqrt{36}\) 只代表正的 6。` },
        { t: '18', why: '36÷2＝18 不對喔，要找自己乘自己是 36 的數。' }] } },
    { say: '那負數呢？',
      ask: { type: 'choice', q: R`\(-9\) 的平方根是多少？`, options: [
        { t: '沒有！任何數自己乘自己都不會是負的', ok: true, why: R`對！正×正＝正，負×負＝正，\(0\times0=0\)，所以<b>負數沒有平方根</b>。` },
        { t: R`\(\pm3\)`, why: R`\(3\times3=9\)、\((-3)\times(-3)=9\)，都是正的 9，不是 −9。` },
        { t: R`\(-3\)`, why: R`\((-3)\times(-3)=+9\)，負負得正喔。` }] },
      after: '（0 的平方根只有一個，就是 0。）' },
    { say: challenge(R`\(-3\) 是某數的一個平方根。`),
      ask: { type: 'num', fields: [{ pre: '某數＝', answer: 9, diag: [{ v: -9, msg: '(−3)×(−3)＝+9，負負得正。' }] }, { pre: '　它的另一個平方根＝', answer: 3 }] } },
    { say: challenge(R`若 \(a+2\) 的平方根是 \(\pm4\)。`),
      ask: { type: 'num', fields: [{ pre: R`\(a+2=\)`, answer: 16 }, { pre: R`　\(a=\)`, answer: 14 }], hint: '平方根是 ±4，代表那個數是 4×4＝16。' } }
  ] };

  /* =========================================================
     第 2 關：根號裡的大數字（完全平方數、分數、小數）
     ========================================================= */
  const S2 = { id: 's2', badge: '🔍', title: '第 2 關　根號裡的大數字', steps: [
    { say: '大訂單來了！整十的數很好算：',
      ask: { type: 'num', fields: [{ pre: R`\(\sqrt{400}=\)`, answer: 20, diag: [{ v: 200, msg: '200×200＝40000，太大了！20×20 才是 400。' }] }, { pre: R`　\(\sqrt{900}=\)`, answer: 30 }] } },
    { say: R`分數也可以：\(\left(\frac{5}{2}\right)^2=\frac{5\times5}{2\times2}=\frac{25}{4}\)。<br>所以 \(\sqrt{\frac{25}{4}}=\)？`,
      ask: { type: 'num', q: '分子、分母各自開根號：', fields: [{ pre: '分子', answer: 5 }, { pre: '　分母', answer: 2 }] },
      after: R`\(\sqrt{\frac{25}{4}}=\frac{\sqrt{25}}{\sqrt4}=\frac52\)` },
    { say: R`小數要小心！\(0.3\times0.3=0.09\)。`,
      ask: { type: 'num', q: R`所以 \(\sqrt{0.09}=\)？`, fields: [{ answer: 0.3, diag: [{ v: 0.03, msg: '0.03×0.03＝0.0009，不是 0.09 喔！小數位數是「一半」：0.09 有 2 位 → 答案 1 位。' }] }] },
      after: '👉 <b>根號裡的小數位數，答案只有一半</b>：0.09（2 位）→ 0.3（1 位）。' },
    { say: '用這個規則：',
      ask: { type: 'num', q: R`\(\sqrt{0.0081}=\)？（0.0081 有 4 位小數）`, fields: [{ answer: 0.09, diag: [{ v: 0.9, msg: '0.9×0.9＝0.81，不是 0.0081。4 位小數 → 答案 2 位：0.09。' }, { v: 0.009, msg: '4 位小數 → 答案 2 位：0.09。' }] }] } },
    { say: R`看不出來的大數字，用<b>質因數分解</b>！<br>\(441=3\times3\times7\times7\)<br>根號像一個盒子，<b>兩個一樣的配成一對，才能搬出去一個</b>。`,
      scene: (h) => { chips(h, [['3'], ['3'], '　', ['7'], ['7']]); },
      ask: { type: 'num', q: R`每一對搬出一個：\(\sqrt{441}=3\times7=\)？`, fields: [{ answer: 21 }] },
      after: R`驗算：\(21\times21=441\) ✔` },
    { say: '換你分解：576＝2×2×2×2×2×2×3×3',
      scene: (h) => { chips(h, [['2'], ['2'], '　', ['2'], ['2'], '　', ['2'], ['2'], '　', ['3'], ['3']]); },
      ask: { type: 'num', q: R`\(\sqrt{576}=\)？`, fields: [{ answer: 24 }], hint: '三對 2、一對 3：搬出 2×2×2×3。' } },
    { say: challenge(R`\(12.25=\frac{1225}{100}\)，而 \(1225=35\times35\)。`),
      ask: { type: 'num', q: R`\(\sqrt{576}+\sqrt{12.25}=\)？`, fields: [{ answer: 27.5 }], hint: '√576＝24；√12.25＝35/10＝3.5。' } },
    { say: challenge('先算根號，再找平方根：'),
      ask: { type: 'choice', q: R`\(\sqrt{0.0016}\) 的平方根是？`, options: [
        { t: R`\(\pm0.2\)`, ok: true, why: R`\(\sqrt{0.0016}=0.04\)，而 0.04 的平方根是 \(\pm0.2\)。` },
        { t: R`\(\pm0.04\)`, why: R`0.04 是 \(\sqrt{0.0016}\) 本身。題目要的是「0.04 的平方根」。` },
        { t: R`\(0.2\)`, why: '「平方根」有正有負兩個喔！' }] } }
  ] };

  /* =========================================================
     第 3 關：夾在中間（估計、比大小、有理數與無理數）
     ========================================================= */
  const S3 = { id: 's3', badge: '📏', title: '第 3 關　夾在中間', steps: [
    { say: '客人要一片 <b>20 格</b>的正方形！<br>可是 4×4＝16 太少，5×5＝25 太多……😵',
      scene: (h) => { twoSquares(h, 4, 5, '20 格在 16 格和 25 格之間'); },
      ask: { type: 'choice', q: R`\(\sqrt{20}\) 在哪兩個整數之間？`, options: [
        { t: '4 和 5 之間', ok: true, why: R`\(16<20<25\)，所以 \(\sqrt{16}<\sqrt{20}<\sqrt{25}\)，也就是 \(4<\sqrt{20}<5\)。` },
        { t: '10 和 11 之間', why: '20÷2＝10 不對喔，要看哪兩個正方形夾住 20 格。' },
        { t: '剛好是 4.5', why: '4.5×4.5＝20.25，比 20 多一點點喔。' }] },
      after: '👉 <b>夾擠法</b>：找兩個夾住它的完全平方數。' },
    { say: '在數線上看：',
      scene: (h) => { numLine(h, { from: 0, to: 6, ticks: [0, 1, 2, 3, 4, 5, 6], band: [4, 5], points: [{ v: Math.sqrt(20), t: '√20' }] }); },
      ask: { type: 'choice', q: R`\(\sqrt{20}\) 比較靠近 4 還是 5？`, options: [
        { t: '比較靠近 4', ok: true, why: '20 離 16 差 4，離 25 差 5，所以靠近 4 一點（大約 4.47）。' },
        { t: '比較靠近 5', why: '20 離 16 差 4，離 25 差 5，哪個比較近？' }] } },
    { say: '換你夾夾看：',
      scene: (h) => { twoSquares(h, 7, 8, '50 格在哪兩個正方形之間？'); },
      ask: { type: 'num', q: R`\(\sqrt{50}\) 在哪兩個連續整數之間？`, fields: [{ answer: 7, post: R`\(<\sqrt{50}<\)` }, { answer: 8 }], hint: '7×7＝49，8×8＝64。' } },
    { say: R`<b>比大小</b>：\(\sqrt{26}\) 和 5，誰大？<br>把 5 也變成根號：\(5=\sqrt{25}\)。`,
      scene: (h) => { numLine(h, { from: 4, to: 6, ticks: [4, 4.5, 5, 5.5, 6], points: [{ v: 5, t: '5＝√25', color: '#2f6db5' }, { v: Math.sqrt(26), t: '√26', up: 18 }] }); },
      ask: { type: 'choice', q: R`\(\sqrt{26}\) 和 \(5\) 誰比較大？`, options: [
        { t: R`\(\sqrt{26}\) 比較大`, ok: true, why: R`\(\sqrt{26}>\sqrt{25}=5\)。格數多，邊長就長。` },
        { t: R`\(5\) 比較大`, why: R`5 就是 \(\sqrt{25}\)，26 格比 25 格多喔。` }] },
      after: '👉 <b>比大小：都變成根號（或都平方）再比</b>。' },
    { say: R`負的要反過來！\(-\sqrt{50}\) 和 \(-7\) 誰大？<br>提示：\(7=\sqrt{49}\)。`,
      scene: (h) => { numLine(h, { from: -8, to: -6, ticks: [-8, -7.5, -7, -6.5, -6], points: [{ v: -7, t: '−7', color: '#2f6db5' }, { v: -Math.sqrt(50), t: '−√50', up: 18 }] }); },
      ask: { type: 'choice', q: R`\(-\sqrt{50}\) 和 \(-7\) 誰比較大？`, options: [
        { t: R`\(-7\) 比較大`, ok: true, why: R`\(\sqrt{50}>7\)，加上負號就反過來：\(-\sqrt{50}<-7\)。在數線上 −7 比較右邊。` },
        { t: R`\(-\sqrt{50}\) 比較大`, why: '負數是「越大越小」：欠 7.07 元比欠 7 元還慘。看數線，誰在右邊？' }] } },
    { say: R`有的根號開得完（像 \(\sqrt{16}=4\)），有的開不完（像 \(\sqrt{20}=4.4721\ldots\)，小數一直下去、不會循環）。<br>開得完、能寫成分數的叫<b>有理數</b>；開不完的叫<b>無理數</b>。`,
      ask: { type: 'num', q: R`\(\sqrt{9}\)、\(\sqrt{10}\)、\(\sqrt{36}\)、\(\sqrt{40}\)、\(\sqrt{49}\) 中，有幾個是有理數？`, fields: [{ answer: 3, post: '個', diag: [{ v: 2, msg: '√9＝3、√36＝6、√49＝7，三個都開得完喔！' }] }], hint: '看根號裡是不是完全平方數（1、4、9、16、25、36、49…）。' } },
    { say: challenge(R`\(a=\sqrt{30}\)，\(b=5.5\)，\(c=\sqrt{31}\)。提示：\(5.5^2=30.25\)。`),
      ask: { type: 'choice', q: '由小到大排列是？', options: [
        { t: R`\(a<b<c\)`, ok: true, why: R`\(b=5.5=\sqrt{30.25}\)，而 \(30<30.25<31\)。` },
        { t: R`\(b<a<c\)`, why: R`5.5 平方是 30.25，比 30 大，所以 \(b>a\)。` },
        { t: R`\(a<c<b\)`, why: R`\(5.5=\sqrt{30.25}\)，比 \(\sqrt{31}\) 小。` }] } },
    { say: challenge(R`正整數 \(n\) 使 \(\sqrt n\) 在 6 和 7 之間。`),
      ask: { type: 'num', q: R`這樣的 \(n\) 有幾個？`, fields: [{ answer: 12, post: '個', diag: [{ v: 13, msg: '36 和 49 不算（√36＝6、√49＝7 剛好是整數）：37～48。' }, { v: 14, msg: '36 和 49 不算：只有 37～48。' }] }], hint: '36 < n < 49，所以 n＝37, 38, …, 48。' } }
  ] };

  /* =========================================================
     第 4 關：越逼越近（十分逼近法、近似值）
     ========================================================= */
  const S4 = { id: 's4', badge: '🎯', title: '第 4 關　越逼越近', steps: [
    { say: R`\(\sqrt2\) 在 1 和 2 之間。想知道更準？把 1～2 切成 10 小段，一段一段試平方！`,
      scene: (h) => { numLine(h, { from: 1, to: 2, ticks: [1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2], labels: { 1.1: '', 1.2: '', 1.3: '', 1.6: '', 1.7: '', 1.8: '', 1.9: '' }, band: [1.4, 1.5] }); },
      ask: { type: 'num', fields: [{ pre: R`\(1.4^2=\)`, answer: 1.96 }, { pre: R`　\(1.5^2=\)`, answer: 2.25 }], hint: '14×14＝196、15×15＝225，再放小數點（2 位）。' } },
    { say: '1.96 比 2 小一點，2.25 比 2 大。',
      scene: (h) => { numLine(h, { from: 1, to: 2, ticks: [1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2], labels: { 1.1: '', 1.2: '', 1.3: '', 1.6: '', 1.7: '', 1.8: '', 1.9: '' }, band: [1.4, 1.5], points: [{ v: Math.SQRT2, t: '√2' }] }); },
      ask: { type: 'choice', q: R`所以 \(\sqrt2\) 在哪裡？`, options: [
        { t: '1.4 和 1.5 之間', ok: true, why: R`\(1.4^2<2<1.5^2\)。` },
        { t: '1.5 和 1.6 之間', why: '1.5² 已經是 2.25，超過 2 了。' }] } },
    { say: R`再切 10 小段：\(1.41^2=1.9881\)，\(1.42^2=2.0164\)。`,
      ask: { type: 'choice', q: R`\(\sqrt2\) 在哪兩個數之間？`, options: [
        { t: '1.41 和 1.42 之間', ok: true, why: '1.9881 < 2 < 2.0164。這樣一直切下去，就會越來越準！這叫做<b>十分逼近法</b>。' },
        { t: '1.42 和 1.43 之間', why: '1.42² 已經比 2 大了。' }] },
      after: R`用計算機按 \(\sqrt2\)，會得到 1.41421356……永遠算不完（它是無理數）。` },
    { say: R`<b>近似值</b>：開不完的數，取到某一位就好。<br>\(\sqrt2=1.414\ldots\)，四捨五入到小數第一位：`,
      ask: { type: 'num', fields: [{ pre: R`\(\sqrt2\approx\)`, answer: 1.4 }] } },
    { say: R`換 \(\sqrt{10}\)：\(3.1^2=9.61\)，\(3.2^2=10.24\)，所以 \(3.1<\sqrt{10}<3.2\)。<br>四捨五入到小數第一位，是 3.1 還是 3.2？要看<b>正中間 3.15</b>！`,
      scene: (h) => { numLine(h, { from: 3.1, to: 3.2, ticks: [3.1, 3.15, 3.2], points: [{ v: Math.sqrt(10), t: '√10' }] }); },
      ask: { type: 'choice', q: R`\(3.15^2=9.9225\)，比 10 小。所以 \(\sqrt{10}\approx\)？`, options: [
        { t: '3.2', ok: true, why: R`\(3.15^2<10\)，代表 \(\sqrt{10}>3.15\)，比正中間大 → 進位成 3.2。` },
        { t: '3.1', why: R`\(3.15^2=9.9225<10\)，所以 \(\sqrt{10}\) 比 3.15 還大，要進位。` }] },
      after: '👉 四捨五入看不出來時，<b>把正中間那個數平方</b>來比。' },
    { say: R`已知 \(\sqrt3\approx1.732\)。<br>\(300=3\times100\)，而 \(\sqrt{100}=10\)……`,
      ask: { type: 'num', q: R`\(\sqrt{300}\approx\)？`, fields: [{ answer: 17.32, diag: [{ v: 173.2, msg: '√100 是 10，不是 100 喔：1.732×10。' }] }], hint: R`\(\sqrt{300}=\sqrt3\times\sqrt{100}=1.732\times10\)` } },
    { say: challenge(R`已知 \(\sqrt3\approx1.732\)，而 \(0.03=\frac{3}{100}\)。`),
      ask: { type: 'num', q: R`\(\sqrt{0.03}\approx\)？`, fields: [{ answer: 0.1732, diag: [{ v: 0.01732, msg: '√(3/100)＝√3 ÷ 10，只除以 10 喔。' }] }], hint: R`\(\sqrt{\frac{3}{100}}=\frac{\sqrt3}{10}\)` } },
    { say: challenge('一塊正方形菜園面積 50 平方公尺。'),
      scene: (h) => { raw(h, 300, 160, `<rect x="90" y="20" width="120" height="120" rx="6" fill="#8cc084" stroke="#5b3a26" stroke-width="2"/><text x="150" y="80" text-anchor="middle" dominant-baseline="middle" class="region-label" font-size="18">50 平方公尺</text><text x="150" y="155" text-anchor="middle" class="ruler-t">邊長＝？</text>`); },
      ask: { type: 'num', q: '邊長大約幾公尺？（四捨五入到整數）', fields: [{ answer: 7, post: '公尺', diag: [{ v: 25, msg: '50÷2 不對喔！要找自己乘自己接近 50 的數。' }, { v: 8, msg: '7²＝49 已經很接近 50，7.5²＝56.25 超過 50，所以四捨五入是 7。' }] }], hint: '7²＝49、8²＝64，50 很靠近 49。' } }
  ] };

  const STAGES = [S1, S2, S3, S4];
  document.addEventListener('DOMContentLoaded', () => Lesson.mount('math8a-2-1', STAGES, { signed: true }));
})();
