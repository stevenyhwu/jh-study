/* ===== 3-1 提公因式作因式分解：可可貓的打包術（3 關） =====
   因式分解＝乘法倒過來：知道禮盒的面積（多項式），找出長和寬（因式） */
(function () {
  'use strict';
  const R = String.raw;
  const { areaBox, C } = Viz;
  const challenge = s => `<span class="chal">⭐ 挑戰題</span> ${s}`;
  const formula = (f, tip) => `<div class="formula">${f}</div>${tip ? `<div class="tip">${tip}</div>` : ''}`;
  const note = '<div class="muted small">（負的就按 ± 變成負數）</div>';
  const F = { 2: C.choco, 1: C.orange, 0: C.matcha, 3: C.berry };
  const cell = (t, deg, neg) => ({ t, fill: neg ? '#fff' : F[deg], dash: !!neg });
  // k(ax+b) 的三格
  const kab = (q, k, a, b, hint, diag) => ({ type: 'num', q: q + note,
    fields: [{ answer: k, post: '（', diag: diag && diag[0] }, { answer: a, post: R`\(x\) ＋`, diag: diag && diag[1] }, { answer: b, post: '）', diag: diag && diag[2] }], hint });
  // (x+a)(x+b)，順序可互換
  const xx = (q, a, b, hint) => ({ type: 'num', q: q + note, groups: [[0], [1]],
    fields: [{ pre: R`\((x+\)`, answer: a, post: '）' }, { pre: R`\((x+\)`, answer: b, post: '）' }], hint });

  /* =========================================================
     第 1 關：乘法倒過來
     ========================================================= */
  const S1 = { id: 's1', badge: '🔁', title: '第 1 關　乘法倒過來', steps: [
    { say: '可可貓收到 12 顆巧克力，要裝成<b>長方形</b>的一盒。',
      scene: (h) => { Lesson.Choco(h, { rows: 3, cols: 4 }); },
      ask: { type: 'num', q: '這盒排成幾排、每排幾顆？', groups: [[0], [1]], fields: [{ answer: 3, post: '排' }, { pre: '每排', answer: 4, post: '顆' }] },
      after: R`\(3\times4=12\) 是<b>乘法</b>（把東西合起來）。<br>反過來 \(12=3\times4\)，把一個數拆成相乘，叫做<b>分解</b>。3 和 4 都是 12 的<b>因數</b>。` },
    { say: R`多項式也一樣！1-3 學過：禮盒寬 3、長 \(x+2\)，面積 \(3(x+2)=3x+6\)。<br>現在<b>倒過來</b>：只知道面積是 \(3x+6\)……`,
      scene: (h) => { areaBox(h, [{ t: '?', w: 3 }, { t: '?', w: 1.4 }], [{ t: '?', w: 2 }], [[cell('3x', 1), cell('6', 0)]], { maxH: 120 }); },
      ask: { type: 'choice', q: R`\(3x+6\) 可以寫成什麼相乘？`, options: [
        { t: R`\(3(x+2)\)`, ok: true, why: R`乘回去：\(3\times x+3\times2=3x+6\) ✔` },
        { t: R`\(3(x+6)\)`, why: R`乘回去是 \(3x+18\)，不對喔。6 也要分給 3：6÷3＝2。` },
        { t: R`\(x(3+6)\)`, why: '6 裡面沒有 x，不能把 x 提出來。' }] },
      after: R`把多項式寫成幾個多項式<b>相乘</b>，叫做<b>因式分解</b>。` + formula(R`\(3(x+2)\;\xrightarrow{\text{乘開}}\;3x+6\;\xrightarrow{\text{因式分解}}\;3(x+2)\)`, '因式分解就是乘法倒過來') },
    { say: R`\(3x+6=3(x+2)\)，所以 \(3\) 和 \(x+2\) 都是 \(3x+6\) 的<b>因式</b>；反過來，\(3x+6\) 是 \(x+2\) 的<b>倍式</b>。`,
      scene: (h) => { areaBox(h, [{ t: 'x', w: 3 }, { t: '3', w: 1.6 }], [{ t: 'x', w: 3 }, { t: '2', w: 1.2 }], [[cell('x²', 2), cell('3x', 1)], [cell('2x', 1), cell('6', 0)]], { maxH: 180 }); },
      ask: { type: 'choice', q: R`1-3 算過 \((x+2)(x+3)=x^2+5x+6\)。那 \(x+2\) 是 \(x^2+5x+6\) 的因式嗎？`, options: [
        { t: '是！它是禮盒的一邊', ok: true, why: R`\(x^2+5x+6=(x+2)(x+3)\)，所以 \(x+2\) 和 \(x+3\) 都是它的因式。` },
        { t: '不是', why: '看看圖：x+2 就是禮盒的寬喔！' }] },
      after: '👉 用除法檢查也可以：<b>能整除（餘式是 0）</b>，就是因式。' }
  ] };

  /* =========================================================
     第 2 關：找公因式
     ========================================================= */
  const S2 = { id: 's2', badge: '🎯', title: '第 2 關　找共同的', steps: [
    { say: R`\(6x+9\)：兩項都是 <b>3 的倍數</b>，3 是它們共同的因數，叫做<b>公因式</b>。把它提到外面：`,
      scene: (h) => { areaBox(h, [{ t: '?', w: 3 }, { t: '?', w: 2 }], [{ t: '3', w: 1.6 }], [[cell('6x', 1), cell('9', 0)]], { maxH: 110 }); },
      ask: kab(R`\(6x+9=\)`, 3, 2, 3, '6x÷3＝2x；9÷3＝3。') },
    { say: R`字母也可以提：\(x^2+5x\)，兩項都有 \(x\)。`,
      scene: (h) => { areaBox(h, [{ t: '?', w: 3 }, { t: '?', w: 2 }], [{ t: 'x', w: 2 }], [[cell('x²', 2), cell('5x', 1)]], { maxH: 110 }); },
      ask: { type: 'num', q: R`\(x^2+5x=x(\;\square\;)\)`, fields: [{ pre: R`\(x(x+\)`, answer: 5, post: '）' }], hint: 'x²÷x＝x；5x÷x＝5。' } },
    { say: R`\(4x^2-6x\)：小明提了 2，寫成 \(2(2x^2-3x)\)。`,
      ask: { type: 'choice', q: '小明提得夠乾淨嗎？', options: [
        { t: R`不夠！括號裡還有共同的 \(x\)，應該提 \(2x\)`, ok: true, why: R`\(4x^2-6x=2x(2x-3)\)。<b>數字和字母都要提，提到最大</b>。` },
        { t: '夠了', why: R`看看括號裡 \(2x^2-3x\)，兩項是不是都還有 x？` }] },
      after: '👉 公因式要找<b>最大的</b>：數字找最大公因數，字母找共同的、次方最小的。' },
    { say: '換你提：',
      ask: { type: 'num', q: R`\(4x^2-6x=2x(\;\square\;)\)` + note, fields: [{ pre: R`\(2x(\)`, answer: 2, post: R`\(x\) ＋` }, { answer: -3, post: '）', diag: [{ v: 3, msg: '−6x÷2x＝−3，負號要帶著。' }] }], hint: '4x²÷2x＝2x；−6x÷2x＝−3。' } },
    { say: R`三項也一樣：\(3x^3+6x^2-9x\)，公因式是 \(3x\)。`,
      ask: { type: 'num', q: R`\(3x^3+6x^2-9x=3x(\;\square\;)\)` + note, fields: [{ pre: R`\(3x(\)`, answer: 1, post: R`\(x^2\) ＋` }, { answer: 2, post: R`\(x\) ＋` }, { answer: -3, post: '）' }], hint: '每一項都除以 3x：x²、2x、−3。' } },
    { say: R`⚠️ 陷阱：\(x^2+x=x(\;?\;)\)`,
      ask: { type: 'choice', q: '括號裡是什麼？', options: [
        { t: R`\(x+1\)`, ok: true, why: R`\(x\div x=1\)，<b>提光了要留下 1</b>，不是 0！乘回去 \(x(x+1)=x^2+x\) ✔` },
        { t: R`\(x\)`, why: R`\(x\cdot x=x^2\)，少了後面的 \(+x\)。` },
        { t: R`\(x+0\)`, why: R`\(x\div x=1\)，不是 0 喔。乘回去檢查：\(x(x+0)=x^2\)，少了 x。` }] },
      after: '👉 <b>提完一定要乘回去檢查！</b>' },
    { say: challenge('第一項是負的，習慣把負號一起提出來：'),
      ask: { type: 'choice', q: R`\(-2x^2+4x=\)？`, options: [
        { t: R`\(-2x(x-2)\)`, ok: true, why: R`乘回去：\(-2x\cdot x=-2x^2\)，\(-2x\cdot(-2)=+4x\) ✔` },
        { t: R`\(-2x(x+2)\)`, why: R`乘回去是 \(-2x^2-4x\)，符號錯了。提出負號，括號裡要變號。` },
        { t: R`\(2x(x-2)\)`, why: R`乘回去是 \(2x^2-4x\)，兩項都相反了。` }] } }
  ] };

  /* =========================================================
     第 3 關：括號也能提、分組提
     ========================================================= */
  const S3 = { id: 's3', badge: '📦', title: '第 3 關　整包一起提', steps: [
    { say: R`\(3(x+1)+x(x+1)\)：把 \((x+1)\) 想成一個禮盒 🎁。<br>\(3\)🎁 ＋ \(x\)🎁 ＝ \((3+x)\)🎁`,
      scene: (h) => { areaBox(h, [{ t: '3', w: 1.6 }, { t: 'x', w: 3 }], [{ t: 'x+1', w: 2 }], [[cell('3(x+1)', 0), cell('x(x+1)', 2)]], { maxH: 110 }); },
      ask: xx(R`\(3(x+1)+x(x+1)=\)`, 1, 3, '提出 (x+1)，剩下 3＋x。') },
    { say: R`長方形面積是 \(2(x+1)(x+5)-(x+1)(x-3)\)，一邊是 \(x+1\)，另一邊是？<br>兩項都有 🎁＝\((x+1)\)，先提出來：`,
      ask: { type: 'num', q: R`\((x+1)[\,2(x+5)-(x-3)\,]\)，中括號裡化簡＝` + note, fields: [{ answer: 1, post: R`\(x\) ＋` }, { answer: 13 }], hint: '2x+10−x+3', },
      after: R`另一邊是 \(x+13\)，所以面積＝\((x+1)(x+13)\)。` },
    { say: R`長得「差一點點」的：\(3(x-2)+x(2-x)\)。<br>\(2-x\) 和 \(x-2\) 剛好<b>相反</b>！`,
      ask: { type: 'choice', q: R`\(2-x=\)？`, options: [
        { t: R`\(-(x-2)\)`, ok: true, why: R`\(-(x-2)=-x+2=2-x\) ✔` },
        { t: R`\(x-2\)`, why: R`代 \(x=5\) 試試：\(2-5=-3\)，\(5-2=3\)，不一樣！` }] } },
    { say: R`所以 \(3(x-2)+x(2-x)=3(x-2)-x(x-2)\)，提出 \((x-2)\)：`,
      ask: { type: 'choice', q: '＝？', options: [
        { t: R`\((x-2)(3-x)\)`, ok: true, why: '提出 (x−2)，剩下 3 − x。' },
        { t: R`\((x-2)(3+x)\)`, why: R`中間已經變成 \(-x(x-2)\)，剩下的是 \(3-x\)。` },
        { t: R`\((x-2)^2\cdot3\)`, why: '提公因式之後，是把「剩下的」加減起來喔。' }] } },
    { say: R`沒有共同的？試試<b>兩個兩個分組</b>：\(x^2+3x+2x+6\)<br>\(=(x^2+3x)+(2x+6)=x(x+3)+2(x+3)\)`,
      scene: (h) => { areaBox(h, [{ t: 'x', w: 3 }, { t: '3', w: 1.6 }], [{ t: 'x', w: 3 }, { t: '2', w: 1.2 }], [[cell('x²', 2), cell('3x', 1)], [cell('2x', 1), cell('6', 0)]], { maxH: 180 }); },
      ask: xx('再提出 (x+3)：', 3, 2) },
    { say: challenge(R`分組：\(ab+2a+3b+6=a(b+2)+3(b+2)\)`),
      ask: { type: 'choice', q: '＝？', options: [
        { t: R`\((a+3)(b+2)\)`, ok: true, why: '提出 (b+2)，剩下 a＋3。乘回去檢查：ab+2a+3b+6 ✔' },
        { t: R`\((a+2)(b+3)\)`, why: '乘回去是 ab+3a+2b+6，不一樣喔。' },
        { t: R`\(ab(2+3+6)\)`, why: '2、3b、6 裡面沒有 ab。' }] } },
    { say: challenge('心算也能用！37 是共同的：'),
      ask: { type: 'num', q: R`\(37\times58+37\times42=37\times(58+42)=\)？`, fields: [{ answer: 3700 }] },
      after: '這就是 1-1 第 1 關的「切開分開算」倒過來用！' }
  ] };

  const STAGES = [S1, S2, S3];
  document.addEventListener('DOMContentLoaded', () => Lesson.mount('math8a-3-1', STAGES, { signed: true }));
})();
