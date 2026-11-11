/* ===== 2-2 根式的運算：可可貓的根號盒子（5 關） =====
   根號像一個盒子：一對一樣的數才能搬出去一個；√3 就像 1-2 的 x，同類才能合併 */
(function () {
  'use strict';
  const R = String.raw;
  const { Choco } = Lesson;
  const challenge = s => `<span class="chal">⭐ 挑戰題</span> ${s}`;
  const formula = (f, tip) => `<div class="formula">${f}</div>${tip ? `<div class="tip">${tip}</div>` : ''}`;
  const chips = (h, list) => { h.appendChild(Lesson.h(`<div class="chips">${list.map(s => typeof s === 'string' ? `<span>${s}</span>` : `<span class="hi">${s[0]}</span>`).join('')}</div>`)); JH.renderMath(h); };
  // 「a√b」的兩格
  const rad = (q, k, r, hint, diag) => ({ type: 'num', q, fields: [{ answer: k, diag: diag && diag[0] }, { pre: '√', answer: r, diag: diag && diag[1] }], hint });
  // 「(a√b)/c」的三格
  const radF = (q, k, r, d, hint) => ({ type: 'num', q: q + '<div class="muted small">（填成「□√□ ÷ □」）</div>', fields: [{ answer: k }, { pre: '√', answer: r }, { pre: '　÷', answer: d }], hint });

  /* =========================================================
     第 1 關：根號相乘
     ========================================================= */
  const S1 = { id: 's1', badge: '✖️', title: '第 1 關　根號相乘', steps: [
    { say: '先做個小實驗！兩種算法，答案會一樣嗎？',
      ask: { type: 'num', fields: [{ pre: R`\(\sqrt4\times\sqrt9=2\times3=\)`, answer: 6 }, { pre: R`　\(\sqrt{4\times9}=\sqrt{36}=\)`, answer: 6 }] },
      after: '一樣耶！再試一組：' },
    { say: '再實驗一次：',
      ask: { type: 'num', fields: [{ pre: R`\(\sqrt{16}\times\sqrt{25}=\)`, answer: 20 }, { pre: R`　\(\sqrt{16\times25}=\sqrt{400}=\)`, answer: 20 }] },
      after: '又一樣！' + formula(R`\(\sqrt a\times\sqrt b=\sqrt{a\times b}\)`, '根號相乘：裡面的數乘在一起，放進同一個根號') },
    { say: R`這招超好用！\(\sqrt2\) 和 \(\sqrt8\) 都開不完，可是乘起來……`,
      ask: { type: 'num', q: R`\(\sqrt2\times\sqrt8=\sqrt{16}=\)？`, fields: [{ answer: 4 }] } },
    { say: '再試兩題：',
      ask: { type: 'num', fields: [{ pre: R`\(\sqrt3\times\sqrt{12}=\)`, answer: 6 }, { pre: R`　\(\sqrt{27}\times\sqrt3=\)`, answer: 9 }], hint: '3×12＝36；27×3＝81。' } },
    { say: R`根號外面有數字的話：<b>外面乘外面、裡面乘裡面</b>。`,
      ask: rad(R`\(2\sqrt3\times4\sqrt5=\)？`, 8, 15, '外面 2×4；裡面 3×5。', [[{ v: 6, msg: '外面是 2×4，要相乘喔。' }], [{ v: 8, msg: '根號裡面是 3×5，相乘不是相加。' }]]) },
    { say: R`根號自己乘自己呢？`,
      scene: (h) => { Viz.raw(h, 300, 170, `<rect x="90" y="30" width="120" height="120" rx="6" fill="#f28fad" stroke="#5b3a26" stroke-width="2"/><text x="150" y="90" text-anchor="middle" dominant-baseline="middle" class="region-label" font-size="18">面積 5 格</text><text x="150" y="20" text-anchor="middle" class="ruler-t">邊長 √5</text><text x="80" y="92" text-anchor="end" class="ruler-t">√5</text>`); },
      ask: { type: 'choice', q: R`\((\sqrt5)^2=\sqrt5\times\sqrt5=\)？`, options: [
        { t: '5', ok: true, why: R`\(\sqrt5\times\sqrt5=\sqrt{25}=5\)。邊長平方就是面積，回到原來的格數！` },
        { t: '25', why: R`\(\sqrt5\times\sqrt5=\sqrt{25}\)，還要開根號喔。` },
        { t: R`\(2\sqrt5\)`, why: '那是 √5＋√5（加法）。這裡是相乘。' }] },
      after: R`👉 \((\sqrt a)^2=a\)：<b>平方和根號互相抵消</b>。` }
  ] };

  /* =========================================================
     第 2 關：把正方形搬出根號（最簡根式）
     ========================================================= */
  const S2 = { id: 's2', badge: '📦', title: '第 2 關　搬出根號盒子', steps: [
    { say: R`\(\sqrt{12}\) 能變簡單嗎？把 12 拆開：\(12=2\times2\times3\)。<br>根號是一個盒子，<b>一對一樣的數，可以搬出去一個</b>；落單的留在裡面。`,
      scene: (h) => { chips(h, ['√(', ['2'], ['2'], '3', ')', '→', '2√3']); },
      ask: rad(R`\(\sqrt{12}=\)？`, 2, 3, '一對 2 搬出去變成 2，落單的 3 留在根號裡。') ,
      after: R`其實就是 \(\sqrt{12}=\sqrt4\times\sqrt3=2\sqrt3\)，把裡面的<b>完全平方數</b>搬出來。` },
    { say: R`\(18=3\times3\times2\)：`,
      scene: (h) => { chips(h, ['√(', ['3'], ['3'], '2', ')']); },
      ask: rad(R`\(\sqrt{18}=\)？`, 3, 2) },
    { say: R`\(50=5\times5\times2\)：`,
      scene: (h) => { chips(h, ['√(', ['5'], ['5'], '2', ')']); },
      ask: rad(R`\(\sqrt{50}=\)？`, 5, 2) },
    { say: R`\(72=2\times2\times2\times3\times3\)，有兩對！每一對都搬出去。`,
      scene: (h) => { chips(h, ['√(', ['2'], ['2'], '2', ['3'], ['3'], ')']); },
      ask: rad(R`\(\sqrt{72}=\)？`, 6, 2, '搬出 2 和 3，外面是 2×3＝6；落單的 2 留下。', [[{ v: 2, msg: '一對 3 也要搬出去喔：外面是 2×3。' }, { v: 3, msg: '一對 2 也要搬出去喔：外面是 2×3。' }], [{ v: 18, msg: '根號裡的 18 還有一對 3 可以搬！' }, { v: 8, msg: '根號裡的 8 還有一對 2 可以搬！' }]]) },
    { say: R`搬到不能再搬，叫做<b>最簡根式</b>：<br>① 根號裡沒有「一對一樣的」（沒有完全平方因數）<br>② 根號裡沒有分數`,
      ask: { type: 'choice', q: '下面哪一個已經是最簡根式？', options: [
        { t: R`\(\sqrt{15}\)`, ok: true, why: '15＝3×5，沒有一對一樣的，不能再搬。' },
        { t: R`\(\sqrt8\)`, why: R`8＝2×2×2，有一對 2 可以搬出來：\(2\sqrt2\)。` },
        { t: R`\(3\sqrt{18}\)`, why: R`18 裡面有一對 3：\(3\sqrt{18}=3\times3\sqrt2=9\sqrt2\)。` },
        { t: R`\(\sqrt{\frac12}\)`, why: '根號裡有分數，還不是最簡。（第 3 關會教怎麼處理）' }] } },
    { say: R`乘完記得化簡：\(\sqrt6\times\sqrt{15}=\sqrt{90}\)，而 \(90=3\times3\times10\)。`,
      ask: rad(R`\(\sqrt{90}=\)？`, 3, 10) },
    { say: challenge(R`反過來，把外面的數<b>搬進去</b>：要變成一對（平方）才能進去！<br>\(3\sqrt2=\sqrt{3\times3\times2}\)`),
      ask: { type: 'num', q: R`\(3\sqrt2=\sqrt{\;?\;}\)`, fields: [{ pre: '√', answer: 18, diag: [{ v: 6, msg: '搬進去要變成一對：3×3×2＝18。' }] }] } },
    { say: challenge('用「搬進去」比大小：'),
      ask: { type: 'choice', q: R`\(3\sqrt2\) 和 \(2\sqrt3\) 誰比較大？`, options: [
        { t: R`\(3\sqrt2\) 比較大`, ok: true, why: R`\(3\sqrt2=\sqrt{18}\)，\(2\sqrt3=\sqrt{12}\)，18 格的正方形比 12 格大。` },
        { t: R`\(2\sqrt3\) 比較大`, why: R`都搬進去：\(3\sqrt2=\sqrt{18}\)、\(2\sqrt3=\sqrt{12}\)，再比。` },
        { t: '一樣大', why: '都搬進根號裡比比看：√18 和 √12。' }] } }
  ] };

  /* =========================================================
     第 3 關：根號相除、分母有理化
     ========================================================= */
  const S3 = { id: 's3', badge: '➗', title: '第 3 關　分母不要有根號', steps: [
    { say: R`除法也一樣，可以放進同一個根號：`,
      ask: { type: 'num', q: R`\(\sqrt{18}\div\sqrt2=\sqrt{18\div2}=\)？`, fields: [{ answer: 3 }] },
      after: formula(R`\(\sqrt a\div\sqrt b=\sqrt{\frac ab}\)`) },
    { say: R`分數的根號：\(\sqrt{\frac19}=\frac13\)、\(\sqrt{\frac1{25}}=\frac15\)。`,
      ask: { type: 'num', q: R`\(\sqrt{\frac19}\div\sqrt{\frac1{25}}=\frac13\div\frac15=\)？（寫成分數）`, fields: [{ pre: '分子', answer: 5 }, { pre: '　分母', answer: 3 }], hint: '除以一個分數＝乘上它的倒數：1/3 × 5。' } },
    { say: R`\(\frac{1}{\sqrt2}\) 長得很討厭：分母 \(\sqrt2=1.41421\ldots\) 開不完，很難算。<br>可可貓的魔法：分子分母<b>同時乘上 \(\sqrt2\)</b>（等於乘 1，值不變）！`,
      ask: { type: 'choice', q: R`\(\frac{1}{\sqrt2}=\frac{1\times\sqrt2}{\sqrt2\times\sqrt2}=\)？`, options: [
        { t: R`\(\frac{\sqrt2}{2}\)`, ok: true, why: R`分母 \(\sqrt2\times\sqrt2=2\)，根號不見了！` },
        { t: R`\(\frac{\sqrt2}{\sqrt2}\)`, why: R`\(\sqrt2\times\sqrt2=2\)，分母要乘開喔。` },
        { t: R`\(\frac{1}{2}\)`, why: R`分子也要乘 \(\sqrt2\)，才會等於原來的值。` }] },
      after: '👉 這叫做<b>分母有理化</b>：讓分母變成沒有根號的數。' },
    { say: '換你：',
      ask: rad(R`\(\frac{6}{\sqrt3}=\frac{6\sqrt3}{3}=\)？`, 2, 3, '分子分母同乘 √3，分母變 3，再約分 6÷3。') },
    { say: R`根號裡有分數，也要有理化：\(\sqrt{\frac23}=\frac{\sqrt2}{\sqrt3}\)`,
      ask: radF(R`\(\frac{\sqrt2}{\sqrt3}=\frac{\sqrt2\times\sqrt3}{\sqrt3\times\sqrt3}=\)？`, 1, 6, 3, '分子 √2×√3＝√6；分母 √3×√3＝3。') },
    { say: challenge(R`分母是 \(\sqrt5+1\) 怎麼辦？用 1-1 的<b>平方差公式</b>：\((a+b)(a-b)=a^2-b^2\)！<br>分子分母同乘 \(\sqrt5-1\)：`),
      ask: { type: 'num', q: R`分母 \((\sqrt5+1)(\sqrt5-1)=(\sqrt5)^2-1^2=\)？`, fields: [{ answer: 4, diag: [{ v: 24, msg: '(√5)² 是 5，不是 25：5−1。' }, { v: 6, msg: '平方差是「減」：5−1。' }] }] },
      after: '根號消失了！' },
    { say: challenge('所以：'),
      ask: { type: 'choice', q: R`\(\frac{2}{\sqrt5+1}=\frac{2(\sqrt5-1)}{4}=\)？`, options: [
        { t: R`\(\frac{\sqrt5-1}{2}\)`, ok: true, why: '分子分母同除以 2。' },
        { t: R`\(\frac{\sqrt5+1}{2}\)`, why: R`分子乘的是 \(\sqrt5-1\) 喔。` },
        { t: R`\(2\sqrt5-2\)`, why: '別忘了分母還有 4。' }] } }
  ] };

  /* =========================================================
     第 4 關：同類根式才能合併
     ========================================================= */
  const S4 = { id: 's4', badge: '➕', title: '第 4 關　同一種才能合併', steps: [
    { say: R`還記得 1-2 的合併同類項嗎？\(2x+5x=7x\)，長條加長條還是長條。<br>\(\sqrt3\) 就像長條 \(x\)：`,
      ask: rad(R`\(2\sqrt3+5\sqrt3=\)？`, 7, 3, '2 根「√3」加 5 根「√3」。', [[], [{ v: 6, msg: '√3 就像 x，加完還是 √3，裡面不會變。' }]]) },
    { say: R`小明說：「\(\sqrt9+\sqrt{16}=\sqrt{25}\)」，對嗎？`,
      ask: { type: 'choice', q: '算算看就知道：', options: [
        { t: R`不對！\(\sqrt9+\sqrt{16}=3+4=7\)，但 \(\sqrt{25}=5\)`, ok: true, why: R`所以<b>根號裡面不能直接相加</b>！\(\sqrt2+\sqrt3\ne\sqrt5\)。` },
        { t: '對', why: '算算看：√9＝3、√16＝4，3＋4＝？而 √25＝？' }] },
      after: R`👉 \(\sqrt2+\sqrt3\) 就像 \(x+y\)，不同種，<b>不能合併</b>，就這樣寫。` },
    { say: '減法也一樣：',
      ask: rad(R`\(7\sqrt5-3\sqrt5=\)？`, 4, 5) },
    { say: R`看起來不同種？<b>先化簡</b>，可能就變同一種了！<br>\(\sqrt{12}+\sqrt{27}\)`,
      ask: { type: 'num', fields: [{ pre: R`\(\sqrt{12}=\)`, answer: 2 }, { pre: '√', answer: 3 }, { pre: R`　\(\sqrt{27}=\)`, answer: 3 }, { pre: '√', answer: 3 }], hint: '12＝2×2×3；27＝3×3×3。' } },
    { say: '都變成 √3 了！合併：',
      ask: rad(R`\(2\sqrt3+3\sqrt3=\)？`, 5, 3) },
    { say: '三個一起：',
      ask: rad(R`\(\sqrt8+\sqrt{18}-\sqrt2=\)？`, 4, 2, '√8＝2√2、√18＝3√2，再 2＋3−1。') },
    { say: challenge('先化簡、有理化，再合併：'),
      ask: radF(R`\(\sqrt{50}-\sqrt{\frac12}=5\sqrt2-\frac{\sqrt2}{2}=\)？`, 9, 2, 2, R`\(5\sqrt2=\frac{10\sqrt2}{2}\)，所以 \(\frac{10\sqrt2-\sqrt2}{2}\)。`) }
  ] };

  /* =========================================================
     第 5 關：根式大挑戰（混合運算、乘法公式、應用）
     ========================================================= */
  const S5 = { id: 's5', badge: '🧩', title: '第 5 關　根式大挑戰', steps: [
    { say: R`分配律也能用：\(\sqrt2(\sqrt8+3)=\sqrt2\times\sqrt8+\sqrt2\times3\)`,
      ask: { type: 'num', q: '＝？', fields: [{ answer: 4 }, { pre: '＋', answer: 3 }, { pre: '√', answer: 2 }], hint: '√2×√8＝√16＝4；√2×3＝3√2。' } },
    { say: R`1-1 的平方差公式：\((\sqrt3+1)(\sqrt3-1)=(\sqrt3)^2-1^2\)`,
      ask: { type: 'num', q: '＝？', fields: [{ answer: 2 }] },
      after: '根號乘完不見了！平方差公式是消滅根號的好幫手。' },
    { say: R`和的平方：\((\sqrt5+2)^2=(\sqrt5)^2+2\times\sqrt5\times2+2^2\)<br>（別忘了兩塊橘子 🍊🍊！）`,
      ask: { type: 'num', q: '＝？', fields: [{ answer: 9 }, { pre: '＋', answer: 4 }, { pre: '√', answer: 5 }], hint: '5＋4√5＋4' },
      after: R`常見錯誤：寫成 \(5+4=9\)，漏掉中間的 \(4\sqrt5\)！` },
    { say: R`計算機：按 \(8\) 再按 \(\sqrt{\;}\)，顯示 2.82842。<br>因為 \(\sqrt8=2\sqrt2\)……`,
      ask: { type: 'num', q: R`按 \(2\) 再按 \(\sqrt{\;}\)，會顯示多少？`, fields: [{ answer: 1.41421, diag: [{ v: 5.65684, msg: '√8＝2√2，所以 √2 是 √8 的「一半」：2.82842÷2。' }] }], hint: '2√2＝2.82842，所以 √2＝2.82842÷2。' } },
    { say: '解方程式：',
      ask: { type: 'choice', q: R`\(\sqrt3\,x=\sqrt6\)，\(x=\)？`, options: [
        { t: R`\(\sqrt2\)`, ok: true, why: R`\(x=\sqrt6\div\sqrt3=\sqrt{6\div3}=\sqrt2\)。` },
        { t: R`\(\sqrt3\)`, why: R`\(\sqrt3\times\sqrt3=3\)，不是 \(\sqrt6\) 喔。` },
        { t: '2', why: R`\(\sqrt3\times2=2\sqrt3=\sqrt{12}\)，不是 \(\sqrt6\)。` }] } },
    { say: challenge(R`已知 \(x=3\sqrt2-1\)，求 \(x^2+2x+1\)。<br>提示：\(x^2+2x+1=(x+1)^2\)（1-1 拼圖偵探！）`),
      ask: { type: 'num', fields: [{ pre: R`\(x+1=\)`, answer: 3 }, { pre: '√', answer: 2 }, { pre: R`　\((x+1)^2=\)`, answer: 18 }], hint: R`\((3\sqrt2)^2=9\times2\)` },
      after: '不用把 x 硬代進去，先用公式整理，簡單多了！' },
    { say: challenge(R`\(x=\frac{1}{\sqrt2+1}\)，\(y=\frac{1}{\sqrt2-1}\)。`),
      ask: { type: 'num', q: R`\(xy=\frac{1}{(\sqrt2+1)(\sqrt2-1)}=\)？`, fields: [{ answer: 1 }], hint: '分母用平方差：2−1＝1。' } }
  ] };

  const STAGES = [S1, S2, S3, S4, S5];
  document.addEventListener('DOMContentLoaded', () => Lesson.mount('math8a-2-2', STAGES, { signed: true }));
})();
