/* ===== 3-3 利用十字交乘法作因式分解：找兩個數（4 關） =====
   從 1-3 的長方形禮盒倒過來想：x²+bx+c 的右下角是兩數相乘、兩塊橘子是兩數相加 */
(function () {
  'use strict';
  const R = String.raw;
  const { areaBox, cross, raw, C } = Viz;
  const challenge = s => `<span class="chal">⭐ 挑戰題</span> ${s}`;
  const formula = (f, tip) => `<div class="formula">${f}</div>${tip ? `<div class="tip">${tip}</div>` : ''}`;
  const note = '<div class="muted small">（負的就按 ± 變成負數；兩個括號順序可以對調）</div>';
  const cell = (t, deg, neg) => ({ t, fill: neg ? '#fff' : [C.matcha, C.orange, C.choco][deg], dash: !!neg });
  const sgn = n => (n < 0 ? '−' + -n : String(n));
  // x²+bx+c 的禮盒：(x+m)(x+n)
  const boxMN = (h, m, n, show) => areaBox(h, [{ t: 'x', w: 3 }, { t: show ? sgn(m) : '?', w: 1.5 }], [{ t: 'x', w: 3 }, { t: show ? sgn(n) : '?', w: 1.3 }],
    [[cell('x²', 2), cell(show ? `${sgn(m)}x` : '?x', 1, show && m < 0)], [cell(show ? `${sgn(n)}x` : '?x', 1, show && n < 0), cell(show ? sgn(m * n) : '?', 0, show && m * n < 0)]], { maxH: 190 });
  // (x+a)(x+b)
  const xx = (q, a, b, hint, diag) => ({ type: 'num', q: q + note, groups: [[0], [1]],
    fields: [{ pre: R`\((x+\)`, answer: a, post: '）', diag }, { pre: R`\((x+\)`, answer: b, post: '）', diag }], hint });
  // (ax+b)(cx+d)
  const ab = (q, a, b, c, d, hint) => ({ type: 'num', q: q + note, groups: [[0, 1], [2, 3]],
    fields: [{ pre: '(', answer: a, post: R`\(x\) ＋` }, { answer: b, post: ')' }, { nl: true, pre: '(', answer: c, post: R`\(x\) ＋` }, { answer: d, post: ')' }], hint });
  // 列出因數配對表
  const pairs = (h, c, rows, hi) => { h.appendChild(Lesson.h(`<div class="chips">${rows.map((r, i) => `<span class="${i === hi ? 'hi' : ''}">${sgn(r[0])} × ${sgn(r[1])}　→ 加起來 ${sgn(r[0] + r[1])}</span>`).join('')}</div>`)); };

  /* =========================================================
     第 1 關：找兩個數（x²+bx+c，都是正的）
     ========================================================= */
  const S1 = { id: 's1', badge: '🔎', title: '第 1 關　找兩個數', steps: [
    { say: R`回到 1-3 的禮盒：\((x+2)(x+3)=x^2+5x+6\)。<br>仔細看 <b>5</b> 和 <b>6</b> 是怎麼來的？`,
      scene: (h) => { boxMN(h, 2, 3, true); },
      ask: { type: 'choice', q: '2 和 3 跟 5、6 有什麼關係？', options: [
        { t: '2＋3＝5（兩塊橘子），2×3＝6（右下角抹茶）', ok: true, why: '發現了！中間的數是<b>兩數相加</b>，最後的數是<b>兩數相乘</b>。' },
        { t: '2×3＝5', why: '2×3 是 6 喔。看看圖上的右下角。' },
        { t: '沒有關係', why: '看看兩塊橘子：2x 和 3x，加起來是？' }] } },
    { say: R`再確認一次：\((x+1)(x+4)\)`,
      scene: (h) => { boxMN(h, 1, 4, true); },
      ask: { type: 'num', q: R`\((x+1)(x+4)=x^2+\square x+\square\)`, fields: [{ pre: '中間（相加）', answer: 5 }, { pre: '　最後（相乘）', answer: 4 }] },
      after: formula(R`\((x+m)(x+n)=x^2+(m+n)x+mn\)`, '中間 ＝ 兩數相加；最後 ＝ 兩數相乘') },
    { say: R`<b>倒過來</b>就是因式分解！\(x^2+7x+12\)：<br>要找兩個數，<b>乘起來 12、加起來 7</b>。先列出乘起來是 12 的：`,
      scene: (h) => { pairs(h, 12, [[1, 12], [2, 6], [3, 4]], -1); boxMN(h, 3, 4, false); },
      ask: { type: 'choice', q: '哪一組加起來是 7？', options: [
        { t: '1 和 12', why: '1＋12＝13，不是 7。' },
        { t: '2 和 6', why: '2＋6＝8，不是 7。' },
        { t: '3 和 4', ok: true, why: '3×4＝12，3＋4＝7 ✔' }] } },
    { say: '找到了！填進禮盒的兩邊：',
      scene: (h) => { pairs(h, 12, [[1, 12], [2, 6], [3, 4]], 2); boxMN(h, 3, 4, true); },
      ask: xx(R`\(x^2+7x+12=\)`, 3, 4) ,
      after: '👉 <b>乘開檢查</b>：(x+3)(x+4)＝x²+4x+3x+12＝x²+7x+12 ✔' },
    { say: R`換你：\(x^2+8x+15\)，乘起來 15、加起來 8。`,
      scene: (h) => { pairs(h, 15, [[1, 15], [3, 5]], -1); boxMN(h, 3, 5, false); },
      ask: xx(R`\(x^2+8x+15=\)`, 3, 5, '1×15 加起來 16；3×5 加起來 8。') },
    { say: R`\(x^2+9x+18\)：`,
      scene: (h) => { pairs(h, 18, [[1, 18], [2, 9], [3, 6]], -1); boxMN(h, 3, 6, false); },
      ask: xx(R`\(x^2+9x+18=\)`, 3, 6) },
    { say: challenge('自己列表：'),
      ask: xx(R`\(x^2+13x+36=\)`, 4, 9, '36＝1×36、2×18、3×12、4×9、6×6，哪一組加起來 13？') }
  ] };

  /* =========================================================
     第 2 關：正負號
     ========================================================= */
  const S2 = { id: 's2', badge: '➕', title: '第 2 關　正負號的祕密', steps: [
    { say: R`\(x^2-7x+12\)：乘起來 <b>＋12</b>、加起來 <b>－7</b>。<br>乘起來是正的 → 兩個數<b>同號</b>（都正或都負）。加起來是負的 → 那就<b>都是負的</b>！`,
      scene: (h) => { pairs(h, 12, [[-1, -12], [-2, -6], [-3, -4]], -1); },
      ask: { type: 'choice', q: '哪兩個數？', options: [
        { t: '−3 和 −4', ok: true, why: '(−3)×(−4)＝12，(−3)＋(−4)＝−7 ✔' },
        { t: '3 和 4', why: '3＋4＝7，可是我們要 −7。' },
        { t: '−3 和 4', why: '(−3)×4＝−12，乘起來要 +12 喔。' }] } },
    { say: '寫成禮盒：',
      scene: (h) => { boxMN(h, -3, -4, true); },
      ask: xx(R`\(x^2-7x+12=\)`, -3, -4, '(x−3)(x−4)', [{ v: 3, msg: '兩個數都是負的，按 ± 變成 −3、−4。' }, { v: 4, msg: '兩個數都是負的，按 ± 變成 −3、−4。' }]) },
    { say: R`\(x^2+x-12\)：乘起來 <b>－12</b> → 兩個數<b>一正一負</b>；加起來 <b>＋1</b> → 正的那個比較大。`,
      scene: (h) => { pairs(h, -12, [[12, -1], [6, -2], [4, -3]], -1); },
      ask: { type: 'choice', q: '哪兩個數？', options: [
        { t: '4 和 −3', ok: true, why: '4×(−3)＝−12，4＋(−3)＝1 ✔' },
        { t: '−4 和 3', why: '(−4)＋3＝−1，我們要 +1。' },
        { t: '6 和 −2', why: '6＋(−2)＝4，不是 1。' }] } },
    { say: '寫出來：',
      scene: (h) => { boxMN(h, 4, -3, true); },
      ask: xx(R`\(x^2+x-12=\)`, 4, -3) },
    { say: R`中間變成 \(-x\) 呢？\(x^2-x-12\)：加起來 −1 → <b>負的那個比較大</b>。`,
      scene: (h) => { boxMN(h, -4, 3, false); },
      ask: xx(R`\(x^2-x-12=\)`, -4, 3, '−4×3＝−12，−4＋3＝−1。') ,
      after: '<div class="tip"><b>正負號口訣</b><br>最後是 ＋ → 同號，跟中間的符號一樣<br>最後是 － → 一正一負，大的那個跟中間的符號一樣</div>' },
    { say: '用口訣：',
      ask: xx(R`\(x^2-5x-6=\)`, -6, 1, '最後是 − → 一正一負；中間是 − → 大的是負的：−6 和 1。') },
    { say: '再一題：',
      ask: xx(R`\(x^2-2x-15=\)`, -5, 3, '15＝1×15、3×5；差 2 的是 3 和 5，大的是負的。') },
    { say: challenge(R`\(x^2+kx+18\) 用十字交乘可以分解，而且 \(k<0\)。`),
      ask: { type: 'choice', q: '下面哪一個<b>可能</b>是它的因式？', options: [
        { t: R`\(x-9\)`, ok: true, why: R`最後 +18 → 同號；\(k<0\) → 都是負的。\((x-9)(x-2)=x^2-11x+18\) ✔` },
        { t: R`\(x+3\)`, why: 'k 是負的，所以兩個數都要是負的。' },
        { t: R`\(x+2\)`, why: '同號又加起來是負的 → 兩個都負。' },
        { t: R`\(x+6\)`, why: '兩個數都要是負的喔。' }] } },
    { say: challenge(R`\(x^2-5x+6=(x+a)(x+b)\)，而且 \(a<b\)。`),
      ask: { type: 'num', fields: [{ pre: R`\(a=\)`, answer: -3 }, { pre: R`　\(b=\)`, answer: -2 }], hint: '乘起來 6、加起來 −5：−2 和 −3。哪個比較小？' } }
  ] };

  /* =========================================================
     第 3 關：十字交乘圖（ax²+bx+c）
     ========================================================= */
  const S3 = { id: 's3', badge: '✖️', title: '第 3 關　畫十字', steps: [
    { say: R`把剛剛的方法畫成一個<b>十字</b>：<br>左邊放「乘起來是 \(x^2\)」的，右邊放「乘起來是常數」的，再<b>斜斜交叉相乘</b>。<br>\(x^2+5x+6\)：`,
      scene: (h) => { cross(h, { l: ['x', 'x'], r: ['2', '3'], p: ['3x', '2x'], sum: '?', target: '5x' }); },
      ask: { type: 'num', q: '交叉相乘加起來：3x＋2x＝？', fields: [{ answer: 5, post: R`\(x\)` }] },
      after: R`和中間項 \(5x\) 一樣 ✔ 所以<b>橫著讀</b>：\((x+2)(x+3)\)。` },
    { say: '為什麼斜著乘？看禮盒就懂了：交叉相乘的兩個，就是那<b>兩塊橘子</b>！',
      scene: (h) => { boxMN(h, 3, 2, true); cross(h, { l: ['x', 'x'], r: ['2', '3'], p: ['3x', '2x'], sum: '5x', ok: true }); },
      ask: { type: 'choice', q: '交叉相乘的 3x 和 2x，在禮盒的哪裡？', options: [
        { t: '兩塊橘子（中間項的兩部分）', ok: true, why: '對！十字交乘就是在「湊兩塊橘子」，讓它們加起來等於中間項。' },
        { t: '右下角', why: '右下角是常數 6。3x 和 2x 是兩塊橘色的。' }] } },
    { say: R`十字交乘最厲害的地方：\(x^2\) 前面有數字也能用！<br>\(2x^2+7x+3\)：左邊 \(2x\) 和 \(x\)，右邊 \(1\) 和 \(3\)。先試這樣擺：`,
      scene: (h) => { cross(h, { l: ['2x', 'x'], r: ['3', '1'], p: ['2x', '3x'], sum: '5x', ok: false, target: '7x' }); },
      ask: { type: 'choice', q: '交叉相乘：2x×1＋x×3＝5x，對嗎？', options: [
        { t: '不對，要 7x，把右邊的 1 和 3 換位置試試', ok: true, why: '對！湊不出來就<b>換位置</b>再試。' },
        { t: '對', why: '中間項是 7x，5x 不一樣喔。' }] } },
    { say: '把右邊換位置：',
      scene: (h) => { cross(h, { l: ['2x', 'x'], r: ['1', '3'], p: ['6x', 'x'], sum: '?', target: '7x' }); },
      ask: { type: 'num', q: '2x×3＋x×1＝？', fields: [{ answer: 7, post: R`\(x\)` }] },
      after: R`湊到了！橫著讀：上面一列 \((2x+1)\)，下面一列 \((x+3)\)。<br>\(2x^2+7x+3=(2x+1)(x+3)\)` },
    { say: '寫出答案（橫著讀每一列）：',
      scene: (h) => { cross(h, { l: ['2x', 'x'], r: ['1', '3'], p: ['6x', 'x'], sum: '7x', ok: true }); },
      ask: ab(R`\(2x^2+7x+3=\)`, 2, 1, 1, 3) },
    { say: R`有負號的：\(3x^2-5x-2\)。左邊 \(3x\)、\(x\)；右邊試 \(1\) 和 \(-2\)：`,
      scene: (h) => { cross(h, { l: ['3x', 'x'], r: ['1', '−2'], p: ['−6x', 'x'], sum: '?', target: '−5x' }); },
      ask: { type: 'num', q: '3x×(−2)＋x×1＝？', fields: [{ answer: -5, post: R`\(x\)` }] } },
    { say: '湊到 −5x 了！橫著讀：',
      scene: (h) => { cross(h, { l: ['3x', 'x'], r: ['1', '−2'], p: ['−6x', 'x'], sum: '−5x', ok: true }); },
      ask: ab(R`\(3x^2-5x-2=\)`, 3, 1, 1, -2) },
    { say: R`\(6x^2+x-2\)：\(6x^2\) 可以拆成 \(6x\cdot x\) 或 \(2x\cdot3x\)，要多試幾次。<br>試 \(2x\)、\(3x\) 和 \(-1\)、\(2\)：`,
      scene: (h) => { cross(h, { l: ['2x', '3x'], r: ['−1', '2'], p: ['4x', '−3x'], sum: '?', target: 'x' }); },
      ask: { type: 'num', q: '4x＋(−3x)＝？', fields: [{ answer: 1, post: R`\(x\)` }] },
      after: R`✔ 所以 \(6x^2+x-2=(2x-1)(3x+2)\)。<br>👉 <b>多試幾次很正常！</b>湊不到就換拆法或換位置。` },
    { say: challenge('自己畫十字：'),
      ask: ab(R`\(2x^2-7x+6=\)`, 2, -3, 1, -2, '左邊 2x、x；右邊要兩個負數乘起來 6：試 −3 和 −2。2x×(−2)＋x×(−3)＝−7x') }
  ] };

  /* =========================================================
     第 4 關：十字交乘大挑戰
     ========================================================= */
  const S4 = { id: 's4', badge: '🏆', title: '第 4 關　十字交乘大挑戰', steps: [
    { say: R`記得第一步：<b>先提公因式</b>！\(2x^2-10x+12=2(x^2-5x+6)\)`,
      ask: xx(R`\(2(x^2-5x+6)=2\,\cdot\)`, -2, -3, '乘起來 6、加起來 −5。') },
    { say: R`有兩個字母：\(x^2+5xy+6y^2\)，就把 \(y\) 跟著數字走：`,
      scene: (h) => { cross(h, { l: ['x', 'x'], r: ['2y', '3y'], p: ['3xy', '2xy'], sum: '5xy', ok: true }); },
      ask: { type: 'choice', q: '＝？', options: [
        { t: R`\((x+2y)(x+3y)\)`, ok: true, why: '跟 x²+5x+6 一樣，只是數字後面帶著 y。' },
        { t: R`\((x+2)(x+3y)\)`, why: '兩個都要帶 y，乘起來才會是 6y²。' },
        { t: R`\((xy+2)(xy+3)\)`, why: '乘開第一項會是 x²y²，不對。' }] } },
    { say: R`長 \(2x+5\)、寬 \(2x+3\) 的長方形巧克力，右下角切掉一塊 \(4\times2\) 的。`,
      scene: (h) => { raw(h, 320, 210, `<rect x="60" y="30" width="200" height="150" rx="6" fill="#f28fad" stroke="#5b3a26" stroke-width="2"/><rect x="216" y="158" width="44" height="22" fill="#e9cfa6" fill-opacity=".4" stroke="#5b3a26" stroke-width="2" stroke-dasharray="5 4"/><text x="160" y="20" text-anchor="middle" class="ruler-t">2x＋5</text><text x="50" y="108" text-anchor="end" class="ruler-t">2x＋3</text><text x="238" y="200" text-anchor="middle" class="ruler-t" style="font-size:13px">4</text><text x="270" y="172" class="ruler-t" style="font-size:13px">2</text>`); },
      ask: { type: 'num', q: R`剩下的面積 \((2x+5)(2x+3)-8\) 乘開＝` + '<div class="muted small">（先乘開再減 8）</div>', fields: [{ answer: 4, post: R`\(x^2\) ＋` }, { answer: 16, post: R`\(x\) ＋` }, { answer: 7 }], hint: '4x²+6x+10x+15−8' } },
    { say: R`再把 \(4x^2+16x+7\) 用十字交乘分解回去：左邊試 \(2x\)、\(2x\)；右邊 \(7\)、\(1\)。`,
      scene: (h) => { cross(h, { l: ['2x', '2x'], r: ['7', '1'], p: ['2x', '14x'], sum: '16x', ok: true }); },
      ask: ab(R`\(4x^2+16x+7=\)`, 2, 7, 2, 1) },
    { say: challenge(R`下列哪一個是 \(3x^2-10x+8\) 的因式？`),
      ask: { type: 'choice', options: [
        { t: R`\(x-2\)`, ok: true, why: R`\(3x^2-10x+8=(3x-4)(x-2)\)：交叉 \(3x\cdot(-2)+x\cdot(-4)=-10x\) ✔` },
        { t: R`\(x-1\)`, why: R`代 \(x=1\)：\(3-10+8=1\ne0\)，不是因式。` },
        { t: R`\(x+2\)`, why: '最後是 +8、中間是 − → 兩個都負，不會有 +2。' },
        { t: R`\(x-3\)`, why: R`代 \(x=3\)：\(27-30+8=5\ne0\)。` }] },
      after: R`👉 小技巧：\(x-2\) 是因式，代 \(x=2\) 進去會等於 0：\(12-20+8=0\) ✔` },
    { say: challenge('數字大一點也不怕：'),
      ask: ab(R`\(12x^2+23x+10=\)`, 3, 2, 4, 5, '左邊試 3x、4x；右邊試 2、5：3x×5＋4x×2＝23x') },
    { say: challenge(R`把 \((x+1)\) 當成 🎁：\((x+1)^2+3(x+1)+2=\)🎁\(^2+3\)🎁\(+2\)`),
      ask: xx('＝(🎁＋1)(🎁＋2)＝', 2, 3, '🎁 是 x＋1：x＋1＋1、x＋1＋2。') }
  ] };

  /* =========================================================
     第 5 關：十字交乘變化題（先乘開、整包、變號、x² 當一包、大係數）
     ========================================================= */
  const S5 = { id: 's5', badge: '🔄', title: '第 5 關　變化題', steps: [
    { say: R`考卷常常這樣出：\((x+2)(x+5)-18\)。<br>後面黏了一個 \(-18\)，整個<b>不是相乘</b>的樣子，所以要<b>先乘開</b>！`,
      ask: { type: 'num', q: R`① 乘開整理：\((x+2)(x+5)-18=\)` + note, fields: [{ answer: 1, post: R`\(x^2\) ＋` }, { answer: 7, post: R`\(x\) ＋` }, { answer: -8, diag: [{ v: 10, msg: '2×5＝10，還要再減 18：10−18＝−8。' }] }], hint: 'x²+5x+2x+10−18' } },
    { say: R`② 再十字交乘：\(x^2+7x-8\)，乘起來 −8、加起來 7。`,
      ask: xx('＝', 8, -1, '8×(−1)＝−8，8＋(−1)＝7') ,
      after: '👉 <b>看到「相乘 ± 一個數」，先乘開，再分解。</b>' },
    { say: R`把 \((x-y)\) 當成一個禮盒 🎁：<br>\((x-y)^2-(x-y)-6=\)🎁\(^2-\)🎁\(-6\)`,
      ask: { type: 'choice', q: '🎁²−🎁−6＝(🎁−3)(🎁＋2)，換回來是？', options: [
        { t: R`\((x-y-3)(x-y+2)\)`, ok: true, why: '🎁 換回 x−y 就好，括號可以拿掉。' },
        { t: R`\((x-3)(y+2)\)`, why: '🎁 是一整包 x−y，不能拆開分給 x 和 y。' },
        { t: R`\((x+y-3)(x+y+2)\)`, why: '🎁 是 x−y，不是 x+y。' }] } },
    { say: R`⚠️ 有陷阱：\((a-b)^2+5(b-a)+6\)。<br>\(b-a\) 和 \(a-b\) 長得不一樣！`,
      ask: { type: 'choice', q: R`\(b-a=\)？`, options: [
        { t: R`\(-(a-b)\)`, ok: true, why: '代數字試：a＝5、b＝2 → b−a＝−3，a−b＝3，剛好相反。' },
        { t: R`\(a-b\)`, why: '代數字試：a＝5、b＝2 → b−a＝−3，a−b＝3，不一樣喔！' }] } },
    { say: R`所以 \((a-b)^2+5(b-a)+6=\)🎁\(^2-5\)🎁\(+6\)（🎁＝a−b）`,
      ask: { type: 'choice', q: '＝？', options: [
        { t: R`\((a-b-2)(a-b-3)\)`, ok: true, why: '🎁²−5🎁+6＝(🎁−2)(🎁−3)。' },
        { t: R`\((a-b+2)(a-b+3)\)`, why: '變號之後中間是 −5🎁，兩個數都是負的。' },
        { t: R`\((b-a-2)(b-a-3)\)`, why: '我們把 b−a 換成 −(a−b) 了，禮盒是 a−b。' }] },
      after: '👉 <b>兩包長得「相反」，先用 −(…) 變成一樣，再當一包。</b>' },
    { say: R`把 \(x^2\) 當一包：\(x^4-5x^2+4=\)🎁\(^2-5\)🎁\(+4\)（🎁＝\(x^2\)）`,
      ask: { type: 'choice', q: R`先分解成 \((x^2-1)(x^2-4)\)，還能再分嗎？`, options: [
        { t: R`可以！兩個都是平方差：\((x+1)(x-1)(x+2)(x-2)\)`, ok: true, why: '要分解到不能再分為止。' },
        { t: R`不行，\((x^2-1)(x^2-4)\) 就是答案`, why: R`\(x^2-1\) 和 \(x^2-4\) 都還能用平方差再分喔！` }] } },
    { say: R`數字大的：\(x^2-2x-195\)，乘起來 −195、加起來 −2。<br>先分解 \(195=3\times5\times13\)，找兩個<b>很接近</b>的數（因為只差 2）。`,
      scene: (h) => { pairs(h, -195, [[13, -15], [15, -13], [5, -39], [3, -65]], -1); },
      ask: xx(R`\(x^2-2x-195=\)`, -15, 13, '13 和 15 只差 2；加起來要 −2，所以大的 15 是負的。') },
    { say: R`係數大的十字：\(21x^2+29x-10\)。左邊試 \(3x\)、\(7x\)；右邊試 \(5\)、\(-2\)：`,
      scene: (h) => { cross(h, { l: ['3x', '7x'], r: ['5', '−2'], p: ['−6x', '35x'], sum: '?', target: '29x' }); },
      ask: { type: 'num', q: '−6x＋35x＝？', fields: [{ answer: 29, post: R`\(x\)` }] },
      after: R`湊到了！橫著讀：\(21x^2+29x-10=(3x+5)(7x-2)\)。` },
    { say: R`第一項是負的：\(-2x^2+5x+3\)。先把負號提出來！`,
      ask: { type: 'choice', q: R`\(-2x^2+5x+3=-(2x^2-5x-3)=\)？`, options: [
        { t: R`\(-(2x+1)(x-3)\)`, ok: true, why: R`\(2x^2-5x-3=(2x+1)(x-3)\)，前面再放負號。` },
        { t: R`\((2x+1)(x-3)\)`, why: '別忘了前面提出來的負號！乘開檢查看看。' },
        { t: R`\(-(2x-1)(x+3)\)`, why: R`乘開 \((2x-1)(x+3)=2x^2+5x-3\)，中間符號不對。` }] } },
    { say: challenge(R`\((x^2+3x)^2-2(x^2+3x)-8\)，把 \(x^2+3x\) 當一包。`),
      ask: { type: 'choice', q: '分解到不能再分：', options: [
        { t: R`\((x+4)(x-1)(x+1)(x+2)\)`, ok: true, why: R`先變 \((x^2+3x-4)(x^2+3x+2)\)，兩個還能再十字交乘。` },
        { t: R`\((x^2+3x-4)(x^2+3x+2)\)`, why: '兩個括號都還能再十字交乘喔！' },
        { t: R`\((x^2+3x-2)(x^2+3x+4)\)`, why: '−4×2＝−8、−4＋2＝−2 才對。' }] } },
    { say: challenge(R`已知 \(m>0\)、\(n<0\)、而且 \(|m|<|n|\)。\(x^2+ax+b=(x+m)(x+n)\)。`),
      ask: { type: 'choice', q: R`點 \((a,\,b)\) 在第幾象限？`, options: [
        { t: '第三象限', ok: true, why: R`\(a=m+n\)：負的比較大 → \(a<0\)；\(b=mn\)：一正一負 → \(b<0\)。(負, 負) 在第三象限。` },
        { t: '第二象限', why: R`b＝mn 是正×負＝負，所以 b<0。` },
        { t: '第四象限', why: R`a＝m+n，n 的絕對值比較大，所以 a 是負的。` }] } }
  ] };

  const STAGES = [S1, S2, S3, S4, S5];
  document.addEventListener('DOMContentLoaded', () => Lesson.mount('math8a-3-3', STAGES, { signed: true }));
})();
