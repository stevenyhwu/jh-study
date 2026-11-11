/* ===== 4-2 配方法與公式解：補一角湊成正方形（3 關） =====
   x²+6x 拆成兩塊橘子 3x，缺右下角 3×3 → 補上就是 (x+3)²；公式解＝一次配好的萬用鑰匙 */
(function () {
  'use strict';
  const R = String.raw;
  const { areaBox, raw, C } = Viz;
  const challenge = s => `<span class="chal">⭐ 挑戰題</span> ${s}`;
  const formula = (f, tip) => `<div class="formula">${f}</div>${tip ? `<div class="tip">${tip}</div>` : ''}`;
  const note = '<div class="muted small">（負的就按 ± 變成負數；兩個解的順序可以對調）</div>';
  const two = (q, a, b, hint, diag) => ({ type: 'num', q: q + note, groups: [[0], [1]],
    fields: [{ pre: R`\(x=\)`, answer: a, diag }, { pre: '　或　', answer: b, diag }], hint });
  // x = a ± √b
  const pmr = (q, a, b, hint) => ({ type: 'num', q: q + '<div class="muted small">（填成 □ ± √□）</div>', fields: [{ pre: R`\(x=\)`, answer: a }, { pre: '± √', answer: b }], hint });
  // 補一角的圖：half = x 係數的一半（字串），corner 文字
  const fill = (h, half, corner, dash) => areaBox(h, [{ t: 'x', w: 3 }, { t: half, w: 1.5 }], [{ t: 'x', w: 3 }, { t: half, w: 1.5 }],
    [[{ t: 'x²', fill: C.choco }, { t: `${half}x`, fill: C.orange }], [{ t: `${half}x`, fill: C.orange }, { t: corner, fill: dash ? '#fff' : C.matcha, dash }]], { maxH: 200 });
  // 天平
  const scale = (h, left, right) => raw(h, 330, 120, `<polygon points="165,96 150,116 180,116" fill="#8a5a3c"/><line x1="165" y1="30" x2="165" y2="96" stroke="#8a5a3c" stroke-width="4"/><line x1="40" y1="30" x2="290" y2="30" stroke="#8a5a3c" stroke-width="4"/><line x1="70" y1="30" x2="70" y2="52" stroke="#8a5a3c" stroke-width="2"/><line x1="260" y1="30" x2="260" y2="52" stroke="#8a5a3c" stroke-width="2"/><rect x="10" y="52" width="120" height="34" rx="8" fill="#fff7e8" stroke="#e0a95a" stroke-width="2"/><rect x="200" y="52" width="120" height="34" rx="8" fill="#fff7e8" stroke="#e0a95a" stroke-width="2"/><text x="70" y="70" text-anchor="middle" dominant-baseline="middle" class="ruler-t" style="font-style:normal">${left}</text><text x="260" y="70" text-anchor="middle" dominant-baseline="middle" class="ruler-t" style="font-style:normal">${right}</text>`);

  /* =========================================================
     第 1 關：補一角湊成正方形
     ========================================================= */
  const S1 = { id: 's1', badge: '🧩', title: '第 1 關　補一角', steps: [
    { say: R`可可貓有 1 個大方盒 \(x^2\) 和 6 根長條 \(6x\)，想拼成<b>正方形</b>。<br>把 6 根長條分兩邊，各 3 根：`,
      scene: (h) => { fill(h, '3', '?', true); },
      ask: { type: 'num', q: '右下角缺了一塊，要補幾顆小顆？', fields: [{ answer: 9, diag: [{ v: 6, msg: '缺的是 3×3 的正方形喔。' }, { v: 3, msg: '缺的是 3×3 的正方形，不是 3 顆。' }] }] },
      after: R`補上 9 顆，就變成邊長 \(x+3\) 的正方形：\(x^2+6x+9=(x+3)^2\)。這個動作叫做<b>配方</b>。` },
    { say: R`規律：長條分兩半，缺角就是「<b>一半的平方</b>」。<br>\(x^2+10x\)：一半是 5……`,
      scene: (h) => { fill(h, '5', '?', true); },
      ask: { type: 'num', q: R`\(x^2+10x+\square=(x+\square)^2\)`, fields: [{ pre: '補', answer: 25 }, { pre: '　邊長 x＋', answer: 5 }] },
      after: formula(R`\(x^2+bx+\left(\frac b2\right)^2=\left(x+\frac b2\right)^2\)`, '加上「x 係數一半的平方」') },
    { say: R`減號也一樣：\(x^2-8x\)，一半是 −4。`,
      scene: (h) => { fill(h, '−4', '?', true); },
      ask: { type: 'num', q: R`\(x^2-8x+\square=(x+\square)^2\)` + '<div class="muted small">（負的就按 ±）</div>', fields: [{ pre: '補', answer: 16, diag: [{ v: -16, msg: '(−4)²＝+16，平方一定是正的。' }] }, { pre: '　(x＋', answer: -4, post: ')²' }] } },
    { say: R`奇數也可以，用小數或分數：\(x^2+3x\)，一半是 1.5。`,
      scene: (h) => { fill(h, '1.5', '?', true); },
      ask: { type: 'num', q: R`\(x^2+3x+\square=(x+1.5)^2\)`, fields: [{ pre: '補', answer: 2.25 }], hint: '1.5×1.5＝2.25（也就是 9/4）' } }
  ] };

  /* =========================================================
     第 2 關：用配方解方程式
     ========================================================= */
  const S2 = { id: 's2', badge: '⚖️', title: '第 2 關　配方來解題', steps: [
    { say: R`解 \(x^2+6x=7\)。方程式像<b>天平</b>：左邊補 9，右邊也要補 9，才會平衡！`,
      scene: (h) => { scale(h, 'x²＋6x＋9', '7＋9'); },
      ask: { type: 'num', q: R`\((x+3)^2=\)？`, fields: [{ answer: 16, diag: [{ v: 7, msg: '左邊加了 9，右邊也要加 9：7＋9。' }] }] } },
    { say: R`\((x+3)^2=16\)，整包開根號：\(x+3=\pm4\)。`,
      scene: (h) => { fill(h, '3', '9', false); },
      ask: two('所以', 1, -7, 'x＋3＝4 → x＝1；x＋3＝−4 → x＝−7') ,
      after: '👉 <b>配方法步驟：① 常數移到右邊 ② 兩邊都加「一半的平方」③ 開根號 ④ 解出 x</b>' },
    { say: R`開不完的：\(x^2-4x-1=0\)<br>① 移項 \(x^2-4x=1\) ② 兩邊加 \(4\)：\((x-2)^2=5\)`,
      ask: pmr(R`③ \(x-2=\pm\sqrt5\)，所以`, 2, 5) },
    { say: R`\(x^2\) 前面有數字，<b>先除掉</b>：\(2x^2+8x-10=0\)，兩邊除以 2：\(x^2+4x-5=0\)`,
      ask: two(R`配方：\((x+2)^2=9\)，所以`, 1, -5, 'x²＋4x＝5，兩邊加 4：(x+2)²＝9') },
    { say: challenge(R`\(x^2-8x+10=0\) 配方成 \((x-p)^2=q\) 的樣子。`),
      ask: { type: 'num', fields: [{ pre: R`\(p=\)`, answer: 4 }, { pre: R`　\(q=\)`, answer: 6 }], hint: 'x²−8x＝−10，兩邊加 16：(x−4)²＝6' } },
    { say: R`⚠️ 配方完得到 \((x+1)^2=-4\)，怎麼辦？`,
      ask: { type: 'choice', options: [
        { t: '無解！平方不可能是負的', ok: true, why: '2-1 學過：任何數自己乘自己都 ≥ 0，所以沒有數字能讓它成立。' },
        { t: R`\(x+1=\pm2\)`, why: R`\(2^2=4\)，不是 −4 喔。` },
        { t: R`\(x=-1\pm4\)`, why: '平方不會是負數，這題其實沒有解。' }] } }
  ] };

  /* =========================================================
     第 3 關：萬用鑰匙（公式解、判別式）
     ========================================================= */
  const S3 = { id: 's3', badge: '🔑', title: '第 3 關　萬用鑰匙', steps: [
    { say: R`每次都配方好累！數學家把 \(ax^2+bx+c=0\) 一次配好，得到一把<b>萬用鑰匙</b>：` + formula(R`\(x=\dfrac{-b\pm\sqrt{b^2-4ac}}{2a}\)`, '公式解：只要找出 a、b、c 代進去'),
      ask: { type: 'num', q: R`\(2x^2+5x-3=0\) 的 a、b、c 是？` + '<div class="muted small">（負的按 ±）</div>', fields: [{ pre: R`\(a=\)`, answer: 2 }, { pre: R`\(b=\)`, answer: 5 }, { pre: R`\(c=\)`, answer: -3, diag: [{ v: 3, msg: 'c 要連負號：−3。' }] }] } },
    { say: R`先算根號裡面的 \(b^2-4ac\)：`,
      ask: { type: 'num', q: R`\(5^2-4\times2\times(-3)=\)？`, fields: [{ answer: 49, diag: [{ v: 1, msg: '−4×2×(−3)＝+24，負負得正：25＋24。' }] }] } },
    { say: R`\(\sqrt{49}=7\)，所以 \(x=\dfrac{-5\pm7}{4}\)。`,
      ask: two('算出兩個解（小數）：', 0.5, -3, '(−5＋7)÷4＝0.5；(−5−7)÷4＝−3') },
    { say: R`用公式解第 2 關那題 \(x^2-4x-1=0\)：\(a=1,b=-4,c=-1\)<br>\(b^2-4ac=16+4=20\)，\(x=\dfrac{4\pm\sqrt{20}}{2}=\dfrac{4\pm2\sqrt5}{2}\)`,
      ask: pmr('約分：', 2, 5),
      after: '跟配方法的答案一樣 ✔ 公式解其實就是「幫你配好方」。' },
    { say: R`\(b^2-4ac\) 叫做<b>判別式</b>，它會告訴你有沒有解：<br>・大於 0 → 兩個解　・等於 0 → 重根　・小於 0 → 無解（根號裡是負的）`,
      ask: { type: 'choice', q: R`\(x^2+2x+5=0\) 有幾個解？`, options: [
        { t: '無解', ok: true, why: R`\(b^2-4ac=4-20=-16<0\)，根號裡是負的。` },
        { t: '兩個解', why: '算算 b²−4ac＝4−20，是正的還是負的？' },
        { t: '重根', why: 'b²−4ac 是 −16，不是 0。' }] } },
    { say: challenge(R`\(x^2+4x+k=0\) 有<b>重根</b>。`),
      ask: { type: 'num', q: R`判別式 \(16-4k=0\)，\(k=\)？`, fields: [{ answer: 4 }] },
      after: R`這時 \(x^2+4x+4=(x+2)^2\)，重根是 \(-2\)。` },
    { say: challenge(R`有小數的：\(0.3x^2-0.5x-0.2=0\)，先全部乘 10：\(3x^2-5x-2=0\)。`),
      ask: { type: 'choice', q: '解是？', options: [
        { t: R`\(x=2\) 或 \(-\frac13\)`, ok: true, why: R`十字交乘 \((3x+1)(x-2)=0\)。` },
        { t: R`\(x=-2\) 或 \(\frac13\)`, why: '代 x＝−2 檢查：12＋10−2≠0。' },
        { t: R`\(x=2\) 或 \(\frac13\)`, why: '3x＋1＝0 → x＝−1/3，是負的。' }] } },
    { say: '最後，怎麼選方法？',
      ask: { type: 'choice', q: '解一元二次方程式，最好的順序是？', options: [
        { t: '先試因式分解，分不出來再用公式解', ok: true, why: '因式分解最快；公式解是萬用的，但計算比較多。' },
        { t: '每題都用配方法', why: '配方法可以，但通常比較慢。' },
        { t: '用猜的', why: '猜的會漏掉解，也不能猜到 2±√5 這種答案。' }] } }
  ] };

  /* =========================================================
     第 4 關：配方與判別式的變化題
     ========================================================= */
  const S4 = { id: 's4', badge: '🎛️', title: '第 4 關　變化題', steps: [
    { say: R`括號裡有係數：\((2x-1)^2=5\)。<br>① 開根號：\(2x-1=\pm\sqrt5\) ② 移項：\(2x=1\pm\sqrt5\) ③ 再除以 2`,
      ask: { type: 'num', q: R`\(x=\)` + '<div class="muted small">（填成「(□ ± √□) ÷ □」）</div>', fields: [{ pre: '(', answer: 1 }, { pre: '± √', answer: 5, post: ')' }, { pre: '÷', answer: 2 }] },
      after: R`\(x=\dfrac{1\pm\sqrt5}{2}\)。<b>開完根號別忘了還要移項、除係數！</b>` },
    { say: '更簡單的：',
      ask: { type: 'choice', q: R`\(4x^2=7\)，\(x=\)？`, options: [
        { t: R`\(\pm\dfrac{\sqrt7}{2}\)`, ok: true, why: R`\(x^2=\frac74\)，\(x=\pm\sqrt{\frac74}=\pm\frac{\sqrt7}{2}\)。` },
        { t: R`\(\pm\dfrac74\)`, why: R`那是 \(x^2\)，還要開根號喔。` },
        { t: R`\(\dfrac{\sqrt7}{2}\)`, why: '別忘了負的那一個！' }] } },
    { say: R`數字很大也不怕，用配方：\(x^2-2x-224=0\) → \(x^2-2x+1=225\) → \((x-1)^2=225\)`,
      ask: two(R`\(x-1=\pm15\)，所以`, 16, -14) },
    { say: R`<b>判別式求範圍</b>：\(x^2+4x+k=0\) 有<b>兩個不同的解</b>。<br>判別式 \(b^2-4ac=16-4k\) 要<b>大於 0</b>。`,
      ask: { type: 'choice', q: 'k 的範圍是？', options: [
        { t: R`\(k<4\)`, ok: true, why: R`\(16-4k>0\) → \(16>4k\) → \(k<4\)。` },
        { t: R`\(k>4\)`, why: 'k 越大，16−4k 越小，會變成負的。代 k＝5：16−20＜0，沒有解。' },
        { t: R`\(k=4\)`, why: 'k＝4 時判別式＝0，是重根（只有一個解）。' }] } },
    { say: R`\(x^2-6x+k=0\) <b>有解</b>（判別式 ≥ 0），\(k\) 最大的整數是？`,
      ask: { type: 'num', fields: [{ pre: R`\(k=\)`, answer: 9, diag: [{ v: 8, msg: 'k＝9 時判別式＝0（重根），也算有解喔！' }] }], hint: '36−4k≥0 → k≤9' } },
    { say: R`\(x^2+kx+16\) 是完全平方式，\(k\) 是多少？`,
      ask: { type: 'choice', options: [
        { t: R`\(8\) 或 \(-8\)`, ok: true, why: R`\((x+4)^2=x^2+8x+16\)，\((x-4)^2=x^2-8x+16\)，兩個都可以！` },
        { t: '只有 8', why: R`\((x-4)^2\) 也是完全平方，中間是 −8x。` },
        { t: '16', why: '中間是 2×x×4＝8x。' }] } },
    { say: challenge(R`\(x^2-2x+(m-1)=0\) 有重根。`),
      ask: { type: 'num', q: R`判別式 \(4-4(m-1)=0\)，\(m=\)？`, fields: [{ answer: 2 }] } }
  ] };

  const STAGES = [S1, S2, S3, S4];
  document.addEventListener('DOMContentLoaded', () => Lesson.mount('math8a-4-2', STAGES, { signed: true }));
})();
