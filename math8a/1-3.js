/* ===== 1-3 多項式的乘除：可可貓的禮盒工廠（6 關） =====
   乘法 = 長方形禮盒的面積（每一段 × 每一段）；除法 = 知道面積和一邊，找另一邊 */
(function () {
  'use strict';
  const R = String.raw;
  const { areaBox, longDiv, C } = Viz;
  const challenge = s => `<span class="chal">⭐ 挑戰題</span> ${s}`;
  const formula = (f, tip) => `<div class="formula">${f}</div>${tip ? `<div class="tip">${tip}</div>` : ''}`;
  const note = '<div class="muted small">（負的就按 ± 變成負數；沒有就填 0）</div>';
  const poly3 = (q, a, b, c, hint, diag) => ({ type: 'num', q: q + note,
    fields: [{ answer: a, post: R`\(x^2\)`, diag: diag && diag[0] }, { pre: '＋', answer: b, post: R`\(x\)`, diag: diag && diag[1] }, { pre: '＋', answer: c, diag: diag && diag[2] }], hint });
  const poly2 = (q, b, c, hint, diag) => ({ type: 'num', q: q + note,
    fields: [{ answer: b, post: R`\(x\)`, diag: diag && diag[0] }, { pre: '＋', answer: c, diag: diag && diag[1] }], hint });
  const mono = (q, k, e, hint, diag) => ({ type: 'num', q: q + '<div class="muted small">（係數和次方都要填）</div>',
    fields: [{ answer: k, diag }, { pre: R`\(x^{\square}\)　□＝`, answer: e }], hint });
  const chips = (h, list) => { h.appendChild(Lesson.h(`<div class="chips">${list.map(s => typeof s === 'string' ? `<span>${s}</span>` : `<span class="hi">${s[0]}</span>`).join('')}</div>`)); JH.renderMath(h); };
  // 面積格子：顏色依次數
  const F = { 2: C.choco, 1: C.orange, 0: C.matcha, 3: C.berry, 4: C.berry };
  const cell = (t, deg, neg) => ({ t, fill: neg ? '#fff' : F[deg], dash: !!neg });

  /* =========================================================
     第 1 關：字母相乘（單項式 × 單項式、指數律）
     ========================================================= */
  const S1 = { id: 's1', badge: '✖️', title: '第 1 關　字母相乘', steps: [
    { say: R`還記得嗎？長條 \(x\) 乘長條 \(x\)，就拼成大方盒 \(x^2\)。<br>小小的 2 代表「<b>有 2 個 x 乘在一起</b>」。`,
      scene: (h) => { areaBox(h, [{ t: 'x', w: 1 }], [{ t: 'x', w: 1 }], [[cell('x²', 2)]], { maxH: 120 }); },
      ask: { type: 'choice', q: R`那 \(x^3\) 是什麼意思？`, options: [
        { t: R`\(x\times x\times x\)，3 個 x 乘在一起`, ok: true, why: '對！就像一個長、寬、高都是 x 的立方體禮盒。' },
        { t: R`\(x\times3\)`, why: R`那是 \(3x\)。小小的 3 是「乘幾次」，不是乘 3。` },
        { t: R`\(x+x+x\)`, why: R`那也是 \(3x\)。\(x^3\) 是 3 個 x <b>相乘</b>。` }] } },
    { say: R`\(x^2\times x^3\)：把每個 x 排出來數一數！`,
      scene: (h) => { chips(h, [['x'], ['x'], '×', ['x'], ['x'], ['x']]); },
      ask: { type: 'num', q: R`一共有幾個 x 乘在一起？\(x^2\times x^3=x^{?}\)`, fields: [{ pre: R`\(x^{\square}\)　□＝`, answer: 5, diag: [{ v: 6, msg: '數數看：左邊 2 個、右邊 3 個，一共 2＋3 個。不是 2×3 喔！' }] }] },
      after: R`👉 <b>同底數相乘，次方相加</b>：\(x^2\times x^3=x^{2+3}=x^5\)。` },
    { say: '再試一題：',
      scene: (h) => { chips(h, [['x'], ['x'], ['x'], '×', ['x'], ['x'], ['x'], ['x']]); },
      ask: { type: 'num', q: R`\(x^3\times x^4=x^{?}\)`, fields: [{ pre: R`\(x^{\square}\)　□＝`, answer: 7, diag: [{ v: 12, msg: '次方是「相加」：3＋4。' }] }] } },
    { say: R`有數字的呢？禮盒長 \(3x\)、寬 \(2x\)，裡面可以排幾個大方盒？`,
      scene: (h) => { const c = [cell('x²', 2), cell('x²', 2), cell('x²', 2)]; areaBox(h, [{ t: 'x', w: 1 }, { t: 'x', w: 1 }, { t: 'x', w: 1 }], [{ t: 'x', w: 1 }, { t: 'x', w: 1 }], [c, c], { maxH: 160 }); },
      ask: mono(R`\((3x)\times(2x)=\)？`, 6, 2, '數字乘數字：3×2；字母乘字母：x×x。', [{ v: 5, msg: '3 和 2 是相乘喔：3×2＝6。數數看有幾個大方盒。' }]),
      after: '👉 <b>數字和數字乘、字母和字母乘</b>，分開算再放一起。' },
    { say: R`有負號的話，先決定正負，再算數字：`,
      ask: mono(R`\((-2x^2)\times(3x)=\)？`, -6, 3, '負×正＝負；2×3＝6；x²×x＝x³。', [{ v: 6, msg: '負×正＝<b>負</b>，記得按 ± 變成 −6。' }]) },
    { say: R`小心這個陷阱：\((3x)^2\)`,
      scene: (h) => { const c = [cell('x²', 2), cell('x²', 2), cell('x²', 2)]; areaBox(h, [{ t: 'x', w: 1 }, { t: 'x', w: 1 }, { t: 'x', w: 1 }], [{ t: 'x', w: 1 }, { t: 'x', w: 1 }, { t: 'x', w: 1 }], [c, c, c], { maxH: 180 }); },
      ask: { type: 'choice', q: R`\((3x)^2=\)？（數數圖裡的大方盒）`, options: [
        { t: R`\(9x^2\)`, ok: true, why: R`\((3x)^2=3x\times3x=9x^2\)，有 9 個大方盒。` },
        { t: R`\(3x^2\)`, why: '括號裡的 3 也要平方！數數看，是 3 個還是 9 個大方盒？' },
        { t: R`\(6x^2\)`, why: '平方是自己乘自己：3×3，不是 3×2。' }] } },
    { say: challenge('三個一樣的相乘：'),
      ask: mono(R`\((-2x)^3=\)？`, -8, 3, '(−2x)(−2x)(−2x)：負負得正、再乘一個負 → 負；2×2×2＝8。', [{ v: 8, msg: '三個負的相乘是<b>負</b>的。' }, { v: -6, msg: '2³ 是 2×2×2＝8，不是 2×3。' }]) },
    { say: challenge('綜合一下：'),
      ask: mono(R`\((4x^2)\times(-5x^3)=\)？`, -20, 5, '4×(−5)＝−20；x²×x³＝x⁵。', [{ v: 20, msg: '正×負＝負。' }]) }
  ] };

  /* =========================================================
     第 2 關：切開分開算（單項式 × 多項式）
     ========================================================= */
  const S2 = { id: 's2', badge: '🔪', title: '第 2 關　切開分開算', steps: [
    { say: R`還記得可可貓的祕訣嗎？\(6\times13=6\times10+6\times3\)，<b>切開分開算</b>！<br>這個禮盒寬 3，長 \(x+2\)：`,
      scene: (h) => { areaBox(h, [{ t: 'x', w: 3 }, { t: '2', w: 1.4 }], [{ t: '3', w: 2 }], [[cell('?', 1), cell('?', 0)]], { maxH: 120 }); },
      ask: { type: 'num', q: '左邊一塊、右邊一塊：', fields: [{ pre: '左 3×x＝', answer: 3, post: R`\(x\)` }, { pre: '　右 3×2＝', answer: 6 }] },
      after: R`\(3(x+2)=3x+6\)<br>👉 <b>外面的數，要分給括號裡的每一項</b>（分配律）。` },
    { say: R`禮盒寬 \(2x\)，長 \(x+3\)：`,
      scene: (h) => { areaBox(h, [{ t: 'x', w: 3 }, { t: '3', w: 1.6 }], [{ t: '2x', w: 2.4 }], [[cell('2x·x', 2), cell('2x·3', 1)]], { maxH: 130 }); },
      ask: poly3(R`\(2x(x+3)=\)？`, 2, 6, 0, '左邊 2x·x＝2x²；右邊 2x·3＝6x。') },
    { say: R`有負號要特別小心！<br>\(-2x(3x-1)\)：\(-2x\) 要分給 \(3x\)，<b>也要</b>分給 \(-1\)。`,
      ask: { type: 'choice', q: R`\(-2x(3x-1)=\)？`, options: [
        { t: R`\(-6x^2+2x\)`, ok: true, why: R`\(-2x\times3x=-6x^2\)；\(-2x\times(-1)=+2x\)，負負得正！` },
        { t: R`\(-6x^2-2x\)`, why: R`\(-2x\times(-1)\) 是負負得正，應該是 \(+2x\)。` },
        { t: R`\(-6x^2-1\)`, why: R`\(-1\) 也要乘 \(-2x\) 喔，每一項都要分到。` }] } },
    { say: R`括號裡有三項，就切成三塊：\(3x(2x^2-x+4)\)`,
      scene: (h) => { areaBox(h, [{ t: '2x²', w: 3 }, { t: '−x', w: 1.5 }, { t: '4', w: 1.5 }], [{ t: '3x', w: 2 }], [[cell('?', 3), cell('?', 2, true), cell('?', 1)]], { maxH: 110 }); },
      ask: { type: 'num', q: '每一塊是多少？' + note, fields: [{ answer: 6, post: R`\(x^3\)` }, { pre: '＋', answer: -3, post: R`\(x^2\)`, diag: [{ v: 3, msg: '3x×(−x)：正×負＝負。' }] }, { pre: '＋', answer: 12, post: R`\(x\)` }], hint: '3x·2x²＝6x³；3x·(−x)＝−3x²；3x·4＝12x' } },
    { say: challenge('先各自展開，再合併同類項：'),
      ask: poly3(R`\(2x(x+1)-x(x-3)=\)？`, 1, 5, 0, '2x²+2x，再減掉 (x²−3x)：2x²+2x−x²+3x', [[], [{ v: -1, msg: '−x(x−3)＝−x²＋3x，−3x 會變成 +3x。' }]]) }
  ] };

  /* =========================================================
     第 3 關：長方形禮盒（多項式 × 多項式）
     ========================================================= */
  const box23 = (h, labels) => areaBox(h, [{ t: 'x', w: 3 }, { t: '3', w: 1.6 }], [{ t: 'x', w: 3 }, { t: '2', w: 1.2 }],
    [[cell(labels[0], 2), cell(labels[1], 1)], [cell(labels[2], 1), cell(labels[3], 0)]], { maxH: 200 });
  const S3 = { id: 's3', badge: '🎁', title: '第 3 關　長方形禮盒', steps: [
    { say: R`這個禮盒長 \(x+3\)、寬 \(x+2\)。長切兩段、寬切兩段，變成 <b>4 塊</b>：`,
      scene: (h) => { box23(h, ['x²', '?', '?', '?']); },
      ask: { type: 'num', fields: [{ pre: '右上 x×3＝', answer: 3, post: R`\(x\)` }, { pre: '　左下 2×x＝', answer: 2, post: R`\(x\)` }, { pre: '　右下 2×3＝', answer: 6 }] } },
    { say: '4 塊全部加起來：',
      scene: (h) => { box23(h, ['x²', '3x', '2x', '6']); },
      ask: poly3(R`\((x+3)(x+2)=\)？`, 1, 5, 6, '兩塊橘子 3x＋2x 可以合併。') ,
      after: R`\((x+3)(x+2)=x^2+5x+6\)<br>👉 <b>前面每一項 × 後面每一項</b>，像握手一樣，每一對都要握到！` + formula(R`\((a+b)(c+d)=ac+ad+bc+bd\)`) },
    { say: R`有負號的禮盒：\((2x+1)(x-3)\)。虛線那塊是「欠的」。`,
      scene: (h) => { areaBox(h, [{ t: 'x', w: 3 }, { t: '−3', w: 1.6 }], [{ t: '2x', w: 3 }, { t: '1', w: 1 }],
        [[cell('?', 2), cell('?', 1, true)], [cell('?', 1), cell('?', 0, true)]], { maxH: 200 }); },
      ask: { type: 'num', q: '四塊分別是：' + note, fields: [{ pre: '2x·x＝', answer: 2, post: R`\(x^2\)` }, { pre: '　2x·(−3)＝', answer: -6, post: R`\(x\)` }, { pre: '　1·x＝', answer: 1, post: R`\(x\)` }, { pre: '　1·(−3)＝', answer: -3 }] } },
    { say: '合併起來：',
      scene: (h) => { areaBox(h, [{ t: 'x', w: 3 }, { t: '−3', w: 1.6 }], [{ t: '2x', w: 3 }, { t: '1', w: 1 }],
        [[cell('2x²', 2), cell('−6x', 1, true)], [cell('x', 1), cell('−3', 0, true)]], { maxH: 200 }); },
      ask: poly3(R`\((2x+1)(x-3)=\)？`, 2, -5, -3, '−6x＋x＝−5x', [[], [{ v: -7, msg: '−6x 和 +x：−6＋1＝−5。' }, { v: 5, msg: '−6＋1＝−5，是負的。' }]]) },
    { say: R`展開以後是<b>幾次</b>？不用全部算！只要看「最大 × 最大」：<br>\((x^2-x-4)(2x^2-x+2)\)`,
      ask: { type: 'choice', q: '展開後是 x 的幾次多項式？', options: [
        { t: '四次', ok: true, why: R`最大的是 \(x^2\times2x^2=2x^4\)，所以是四次。` },
        { t: '二次', why: R`\(x^2\times x^2\) 是 \(x^{2+2}=x^4\) 喔。` },
        { t: '三次', why: '兩個 x² 相乘，次方相加 2＋2。' }] } },
    { say: R`題目只問<b>某一項</b>的係數，就只找會變成那一項的格子！<br>\((x^2+2x+3)(x-4)\) 的 \(x\) 項係數：`,
      scene: (h) => { areaBox(h, [{ t: 'x²', w: 2.4 }, { t: '2x', w: 2 }, { t: '3', w: 1.4 }], [{ t: 'x', w: 2.2 }, { t: '−4', w: 1.4 }],
        [[cell('x³', 3), cell('2x²', 2), cell('3x ★', 1)], [cell('−4x²', 2, true), cell('−8x ★', 1, true), cell('−12', 0, true)]], { maxH: 170 }); },
      ask: { type: 'num', q: '有 ★ 的兩格加起來，x 項的係數＝？', fields: [{ answer: -5, diag: [{ v: -8, msg: '還有一格 3·x＝3x 也是 x 項喔！' }, { v: 5, msg: '3＋(−8)＝−5。' }] }] },
      after: '👉 <b>只問一項，就只算那幾格</b>，又快又不容易錯。' },
    { say: challenge('自己畫格子想想看：'),
      ask: poly3(R`\((3x-2)(2x+5)=\)？`, 6, 11, -10, '6x²＋15x−4x−10') },
    { say: challenge(R`三項 × 兩項，會有 3×2＝6 塊：`),
      ask: { type: 'num', q: R`\((x+1)(x^2-x+1)=\)？` + note, fields: [{ answer: 1, post: R`\(x^3\)` }, { pre: '＋', answer: 0, post: R`\(x^2\)` }, { pre: '＋', answer: 0, post: R`\(x\)` }, { pre: '＋', answer: 1 }], hint: 'x³−x²+x ＋ x²−x+1，中間全部抵消！' },
      after: R`\((x+1)(x^2-x+1)=x^3+1\)，中間的項全部抵消了，很神奇吧！` }
  ] };

  /* =========================================================
     第 4 關：平分巧克力（多項式 ÷ 單項式）
     ========================================================= */
  const S4 = { id: 's4', badge: '🍰', title: '第 4 關　平分巧克力', steps: [
    { say: R`除法就是乘法倒過來想：<br>禮盒面積是 \(6x^2\)，寬是 \(2x\)，那長是多少？`,
      scene: (h) => { areaBox(h, [{ t: '?', w: 3 }], [{ t: '2x', w: 2 }], [[cell('6x²', 2)]], { maxH: 110 }); },
      ask: mono(R`\(2x\times\;?=6x^2\)，所以 \(6x^2\div2x=\)？`, 3, 1, '6÷2＝3；x²÷x＝x。', [{ v: 4, msg: '是除法喔：6÷2＝3。' }]),
      after: R`👉 <b>係數相除、次方相減</b>：\(6x^2\div2x=3x^{2-1}=3x\)。` },
    { say: R`\(x^5\div x^2\)：分子分母一樣的 x 可以<b>約掉</b>！`,
      scene: (h) => { chips(h, ['<s>x</s>', '<s>x</s>', ['x'], ['x'], ['x'], '÷', '<s>x</s>', '<s>x</s>']); },
      ask: { type: 'num', q: R`\(x^5\div x^2=x^{?}\)`, fields: [{ pre: R`\(x^{\square}\)　□＝`, answer: 3, diag: [{ v: 7, msg: '除法是次方「相減」：5−2。' }, { v: 2.5, msg: '次方是相減，不是相除：5−2。' }] }] } },
    { say: '有負號：',
      ask: mono(R`\((-12x^3)\div(4x)=\)？`, -3, 2, '−12÷4＝−3；x³÷x＝x²。') },
    { say: R`面積是 \(6x^2+4x\)，寬 \(2x\)。兩塊都要除！`,
      scene: (h) => { areaBox(h, [{ t: '?', w: 3 }, { t: '?', w: 2 }], [{ t: '2x', w: 2 }], [[cell('6x²', 2), cell('4x', 1)]], { maxH: 110 }); },
      ask: { type: 'choice', q: R`\((6x^2+4x)\div2x=\)？`, options: [
        { t: R`\(3x+2\)`, ok: true, why: R`\(6x^2\div2x=3x\)，\(4x\div2x=2\)，每一塊都分到。` },
        { t: R`\(3x+4x\)`, why: R`後面的 \(4x\) 也要除以 \(2x\) 喔！` },
        { t: R`\(3x^2+2x\)`, why: '次方要相減：x²÷x＝x。' }] },
      after: '👉 <b>每一項都要除</b>，跟分配律一樣，不能漏！' },
    { say: '除以負的，每一項都會變號：',
      ask: poly3(R`\((9x^3-6x^2+3x)\div(-3x)=\)？`, -3, 2, -1, '9x³÷(−3x)＝−3x²；−6x²÷(−3x)＝2x；3x÷(−3x)＝−1', [[], [], [{ v: 0, msg: '3x÷(−3x)＝−1，不是 0 喔！一樣的東西相除是 1。' }, { v: 1, msg: '正÷負＝負，是 −1。' }]]) },
    { say: challenge(R`長方形面積 \(8x^2+12x\)，寬 \(4x\)。`),
      scene: (h) => { areaBox(h, [{ t: '?', w: 3 }, { t: '?', w: 2 }], [{ t: '4x', w: 2 }], [[cell('8x²', 2), cell('12x', 1)]], { maxH: 110 }); },
      ask: poly2('長＝？', 2, 3, '8x²÷4x＝2x；12x÷4x＝3') },
    { say: challenge(R`長 \(2x+3\)、寬 \(4x\) 的長方形：`),
      scene: (h) => { areaBox(h, [{ t: '2x+3', w: 5 }], [{ t: '4x', w: 2 }], [[cell('', 2)]], { maxH: 110 }); },
      ask: poly2('周長＝？', 12, 6, '周長＝2×(長＋寬)＝2×(2x+3+4x)') }
  ] };

  /* =========================================================
     第 5 關：長除法（多項式 ÷ 多項式）
     ========================================================= */
  // (x²+5x+6)÷(x+2) 一步一步
  const D1 = [['x^2', '+5x', '+6'], ['x^2', '+2x', ''], { line: true, cells: ['', '3x', '+6'] }, ['', '3x', '+6'], { line: true, cells: ['', '', '0'] }];
  const div1 = (h, k, q, hl) => longDiv(h, { div: 'x+2', cols: 3, q, rows: D1.slice(0, k), hl });
  const D2 = [['2x^2', '+3x', '-4'], ['2x^2', '+4x', ''], { line: true, cells: ['', '-x', '-4'] }, ['', '-x', '-2'], { line: true, cells: ['', '', '-2'] }];
  const S5 = { id: 's5', badge: '🧮', title: '第 5 關　長除法', steps: [
    { say: '先用數字暖身：47 顆巧克力，每盒裝 5 顆。',
      ask: { type: 'num', fields: [{ pre: '可以裝', answer: 9, post: '盒' }, { pre: '　剩下', answer: 2, post: '顆' }] },
      after: R`驗算：\(5\times9+2=47\)。<br>👉 <b>被除數 ＝ 除數 × 商 ＋ 餘數</b>，多項式也一樣！` },
    { say: R`禮盒面積 \(x^2+5x+6\)，一邊是 \(x+2\)，另一邊是？<br>（第 3 關算過：\((x+3)(x+2)=x^2+5x+6\)）`,
      scene: (h) => { box23(h, ['x²', '3x', '2x', '6']); },
      ask: { type: 'choice', q: R`\((x^2+5x+6)\div(x+2)=\)？`, options: [
        { t: R`\(x+3\)`, ok: true, why: R`因為 \((x+2)(x+3)=x^2+5x+6\)。` },
        { t: R`\(x+5\)`, why: R`\((x+2)(x+5)\) 展開不是 \(x^2+5x+6\) 喔。` },
        { t: R`\(x+4\)`, why: '看看圖，長是 x 加多少？' }] },
      after: '可是如果事先不知道答案呢？就用<b>直式除法</b>，一步一步找！' },
    { say: R`<b>步驟 ①</b> 只看<b>第一項</b>：\(x^2\div x=\)？<br>寫在商的位置（x 那一欄的上面）。`,
      scene: (h) => { div1(h, 1, [], [[0, 0]]); },
      ask: { type: 'choice', q: R`\(x^2\div x=\)？`, options: [
        { t: R`\(x\)`, ok: true, why: R`對！商的第一項是 \(x\)。` },
        { t: R`\(x^2\)`, why: '次方相減：2−1＝1。' },
        { t: '1', why: R`\(x^2\) 有 2 個 x，約掉 1 個，還剩 1 個 x。` }] } },
    { say: R`<b>步驟 ②</b> 用商的 \(x\) 乘回除式：\(x\times(x+2)\)，寫在下面。`,
      scene: (h) => { div1(h, 1, ['', 'x', '']); },
      ask: { type: 'num', q: R`\(x(x+2)=\)？`, fields: [{ answer: 1, post: R`\(x^2\)` }, { pre: '＋', answer: 2, post: R`\(x\)` }] } },
    { say: R`<b>步驟 ③</b> 上下<b>相減</b>（記得退貨章，每一項都變號），再把 \(+6\) 抄下來：`,
      scene: (h) => { div1(h, 2, ['', 'x', ''], [[1, 0], [1, 1]]); },
      ask: { type: 'num', q: R`\((x^2+5x)-(x^2+2x)=\)？`, fields: [{ answer: 3, post: R`\(x\)`, diag: [{ v: 7, msg: '是相減喔：5x−2x。' }] }] } },
    { say: R`<b>步驟 ④</b> 重複一次！\(3x\div x=3\)，商再寫 \(+3\)；\(3\times(x+2)=3x+6\)；相減：`,
      scene: (h) => { div1(h, 4, ['', 'x', '+3'], [[3, 1], [3, 2]]); },
      ask: { type: 'num', q: R`\((3x+6)-(3x+6)=\)？（這就是餘式）`, fields: [{ pre: '餘式＝', answer: 0 }] },
      after: R`除完了！商是 \(x+3\)，餘式是 0。` + formula(R`\(x^2+5x+6=(x+2)(x+3)+0\)`, '餘式是 0，代表剛好除盡，就像禮盒剛好排滿。') },
    { say: R`換你：\((2x^2+3x-4)\div(x+2)\)。照著四個步驟做：<br>① \(2x^2\div x=2x\) ② \(2x(x+2)=2x^2+4x\) ③ 相減得 \(-x-4\) ④ 再除一次……`,
      scene: (h) => { longDiv(h, { div: 'x+2', cols: 3, q: ['', '2x', '?'], rows: D2.slice(0, 3) }); },
      ask: { type: 'num', q: '商和餘式是？' + note, fields: [{ pre: '商＝', answer: 2, post: R`\(x\)` }, { pre: '＋', answer: -1 }, { pre: '　餘式＝', answer: -2 }], hint: R`\(-x\div x=-1\)；\(-1\times(x+2)=-x-2\)；\((-x-4)-(-x-2)=-2\)` },
      after: '完整的直式：<div class="ld-after"></div>', onDone: (api) => { const t = api.card.querySelector('.ld-after'); if (t) longDiv(t, { div: 'x+2', cols: 3, q: ['', '2x', '-1'], rows: D2 }); } },
    { say: R`<b>缺項</b>要補 0！\((x^2-9)\div(x-3)\)，被除式沒有 \(x\) 項。`,
      ask: { type: 'choice', q: '被除式要怎麼寫？', options: [
        { t: R`\(x^2+0x-9\)`, ok: true, why: R`補上 \(0x\)，位置才會對齊！跟加減法的缺項一樣。` },
        { t: R`\(x^2-9\)，直接靠右`, why: '這樣 −9 會跑到 x 那一欄，對錯位置了。' }] } },
    { say: '算算看：',
      scene: (h) => { longDiv(h, { div: 'x-3', cols: 3, q: ['', 'x', '?'], rows: [['x^2', '+0x', '-9'], ['x^2', '-3x', ''], { line: true, cells: ['', '3x', '-9'] }] }); },
      ask: { type: 'num', q: '商＝？餘式＝？', fields: [{ pre: '商 ', answer: 1, post: R`\(x\)` }, { pre: '＋', answer: 3 }, { pre: '　餘式＝', answer: 0 }], hint: '3x÷x＝3；3(x−3)＝3x−9；相減＝0' },
      after: R`\(x^2-9=(x-3)(x+3)\)，就是 1-1 的平方差公式！` },
    { say: challenge(R`某多項式除以 \(x-1\)，商是 \(x+4\)，餘式是 3。`),
      ask: poly3('原來的多項式＝？', 1, 3, -1, '被除式＝除式×商＋餘式＝(x−1)(x+4)＋3＝x²+3x−4＋3') },
    { say: challenge(R`\((x^3+4x^2-2x+3)\div(x+1)\)，商是 \(ax^2+bx+c\)，餘式是 \(d\)。`),
      ask: { type: 'num', fields: [{ pre: R`\(a=\)`, answer: 1 }, { pre: R`\(b=\)`, answer: 3 }, { pre: R`\(c=\)`, answer: -5 }, { pre: R`\(d=\)`, answer: 8 }], hint: R`① \(x^3\div x=x^2\)，減掉 \(x^3+x^2\) 剩 \(3x^2-2x\)；② \(3x\)，減掉 \(3x^2+3x\) 剩 \(-5x+3\)；③ \(-5\)，減掉 \(-5x-5\) 剩 8。` } }
  ] };

  /* =========================================================
     第 6 關：禮盒偵探（應用與看錯題）
     ========================================================= */
  const S6 = { id: 's6', badge: '🕵️', title: '第 6 關　禮盒偵探', steps: [
    { say: R`長方形禮盒面積 \(6x^2+7x-3\)，一邊長 \(2x+3\)。`,
      scene: (h) => { areaBox(h, [{ t: '?', w: 4 }], [{ t: '2x+3', w: 2.2 }], [[cell('6x²+7x−3', 2)]], { maxH: 120 }); },
      ask: poly2('另一邊＝(6x²+7x−3)÷(2x+3)＝？', 3, -1, R`\(6x^2\div2x=3x\)；\(3x(2x+3)=6x^2+9x\)；相減剩 \(-2x-3\)；\(-2x\div2x=-1\)。`) },
    { say: R`另一邊是 \(3x-1\)。`,
      scene: (h) => { areaBox(h, [{ t: '3x−1', w: 4 }], [{ t: '2x+3', w: 2.2 }], [[cell('', 2)]], { maxH: 120 }); },
      ask: poly2('禮盒的周長＝？', 10, 4, '2×(2x+3＋3x−1)') },
    { say: R`😵 <b>看錯題</b>：小凱要算 A ÷ B，卻看成 A ＋ B，得到 \(2x^2+2x-4\)。已知 A＝\(2x^2+x-6\)。`,
      ask: poly2('① 先找回 B＝(2x²+2x−4)−(2x²+x−6)＝？', 1, 2, '大方盒抵消；x 項 2−1；常數 −4−(−6)') },
    { say: R`② 照正確的算：A ÷ B＝\((2x^2+x-6)\div(x+2)\)`,
      scene: (h) => { longDiv(h, { div: 'x+2', cols: 3, q: ['', '2x', '?'], rows: [['2x^2', '+x', '-6'], ['2x^2', '+4x', ''], { line: true, cells: ['', '-3x', '-6'] }] }); },
      ask: poly2('A ÷ B＝？', 2, -3, '−3x÷x＝−3；−3(x+2)＝−3x−6，剛好除盡。') },
    { say: '次數有規律嗎？',
      ask: { type: 'choice', q: '一個三次多項式除以一次多項式，商是幾次？', options: [
        { t: '二次', ok: true, why: R`次方相減：3−1＝2。像 \(x^3\div x=x^2\)。` },
        { t: '三次', why: '除法會讓次方相減喔。' },
        { t: '四次', why: '那是乘法（相加）才會變大。' }] },
      after: '👉 乘法：次數相加；除法：次數相減。餘式的次數一定比除式小。' }
  ] };

  /* =========================================================
     第 7 關：整除快速檢查（代一個數就知道能不能整除）
     ========================================================= */
  const S7 = { id: 's7', badge: '⚡', title: '第 7 關　整除快速檢查', steps: [
    { say: R`用長除法算 \((x^2+x-6)\div(x-2)\)：`,
      scene: (h) => { longDiv(h, { div: 'x-2', cols: 3, q: ['', 'x', '+3'], rows: [['x^2', '+x', '-6'], ['x^2', '-2x', ''], { line: true, cells: ['', '3x', '-6'] }, ['', '3x', '-6'], { line: true, cells: ['', '', '0'] }] }); },
      ask: { type: 'num', q: '餘式是多少？', fields: [{ answer: 0 }] },
      after: R`餘式是 0，能整除！所以 \(x^2+x-6=(x-2)(x+3)\)，\(x-2\) 是它的因式。` },
    { say: R`神奇的事：把 \(x=2\) 代進 \(x^2+x-6\) 看看！`,
      ask: { type: 'num', q: R`\(2^2+2-6=\)？`, fields: [{ answer: 0 }] },
      after: '也是 0！' },
    { say: R`為什麼？因為 \(x^2+x-6=(x-2)(x+3)\)，代 \(x=2\) 時……`,
      ask: { type: 'choice', options: [
        { t: R`\((x-2)\) 變成 0，乘起來整個就是 0`, ok: true, why: '0 乘任何數都是 0！' },
        { t: '剛好巧合', why: R`不是巧合喔：\((2-2)\times(2+3)=0\times5=0\)。` }] },
      after: formula(R`\(x-a\) 是因式 ⇔ 代 \(x=a\) 進去會等於 0`, '代一個數就能檢查，不用做長除法！') },
    { say: '要代哪個數？讓除式<b>等於 0</b> 的那個數：',
      ask: { type: 'num', q: R`檢查 \(x+3\) 是不是因式，要代 \(x=\)？` + note, fields: [{ answer: -3, diag: [{ v: 3, msg: 'x＋3＝0 → x＝−3。按 ± 變負數。' }] }], hint: '讓 x＋3＝0' } },
    { say: R`\(2x^2-5x+3\) 有沒有因式 \(x-1\)？代 \(x=1\)：`,
      ask: { type: 'num', q: R`\(2-5+3=\)？`, fields: [{ answer: 0 }] },
      after: R`是 0，所以 \(x-1\) 是因式 ✔（\(2x^2-5x+3=(x-1)(2x-3)\)）` },
    { say: R`<b>整除求 k</b>：\(x-2\) 能整除 \(x^2+kx-10\)。代 \(x=2\) 要等於 0：`,
      ask: { type: 'num', q: R`\(4+2k-10=0\)，\(k=\)？`, fields: [{ answer: 3 }] } },
    { say: '再一題：',
      ask: { type: 'num', q: R`\(x+1\) 能整除 \(x^3+2x^2+kx-4\)，\(k=\)？` + note, fields: [{ answer: -3, diag: [{ v: 3, msg: '代 x＝−1：(−1)³＝−1，(−1)²＝1，所以 −1＋2−k−4＝0。' }] }], hint: '代 x＝−1：−1＋2−k−4＝0' } },
    { say: R`<b>係數總和</b>也能用代入：展開以後每一項的係數加起來，就是代 \(x=1\)！<br>\((2x-1)^3\) 展開後的係數總和：`,
      ask: { type: 'num', q: R`代 \(x=1\)：\((2-1)^3=\)？`, fields: [{ answer: 1 }] },
      after: '不用展開就知道答案，超快！' },
    { say: challenge(R`\(x^3-6x^2+11x-6\)：先代 \(x=1\)：\(1-6+11-6=0\)，所以 \(x-1\) 是因式。<br>長除法得到商 \(x^2-5x+6\)。`),
      ask: { type: 'choice', q: '完全分解是？', options: [
        { t: R`\((x-1)(x-2)(x-3)\)`, ok: true, why: R`\(x^2-5x+6=(x-2)(x-3)\)，再乘上 \(x-1\)。` },
        { t: R`\((x-1)(x^2-5x+6)\)`, why: '後面的二次式還可以十字交乘喔！' },
        { t: R`\((x+1)(x+2)(x+3)\)`, why: '代 x＝−1 試試：−1−6−11−6≠0，所以 x＋1 不是因式。' }] } }
  ] };

  const STAGES = [S1, S2, S3, S4, S5, S6, S7];
  document.addEventListener('DOMContentLoaded', () => Lesson.mount('math8a-1-3', STAGES, { signed: true }));
})();
