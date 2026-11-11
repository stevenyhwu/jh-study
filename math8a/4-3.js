/* ===== 4-3 應用問題：可可貓的生意經（3 關） =====
   四步驟：設 x → 列式 → 解 → 檢查合不合理（邊長、人數不能是負的） */
(function () {
  'use strict';
  const R = String.raw;
  const { raw, areaBox, pythag, C } = Viz;
  const challenge = s => `<span class="chal">⭐ 挑戰題</span> ${s}`;
  const formula = (f, tip) => `<div class="formula">${f}</div>${tip ? `<div class="tip">${tip}</div>` : ''}`;
  const note = '<div class="muted small">（負的就按 ±；兩個解順序可以對調）</div>';
  const two = (q, a, b, hint) => ({ type: 'num', q: q + note, groups: [[0], [1]], fields: [{ pre: R`\(x=\)`, answer: a }, { pre: '　或　', answer: b }], hint });
  const keep = (q, okText, badText, why, badWhy) => ({ type: 'choice', q, options: [{ t: okText, ok: true, why }, { t: badText, why: badWhy }] });

  /* =========================================================
     第 1 關：解題四步驟（數字題）
     ========================================================= */
  const S1 = { id: 's1', badge: '📝', title: '第 1 關　解題四步驟', steps: [
    { say: '應用題不可怕！可可貓的<b>四步驟</b>：<br>① <b>設</b>：要找的數叫 x<br>② <b>列</b>：把題目翻譯成方程式<br>③ <b>解</b>：用 4-1、4-2 的方法<br>④ <b>驗</b>：答案合不合理？',
      ask: { type: 'choice', q: '哪一步最常被忘記？', options: [
        { t: '④ 檢查合不合理', ok: true, why: '對！一元二次方程式常常有兩個解，但不一定兩個都能用。' },
        { t: '① 設 x', why: '設 x 通常不會忘，最常忘的是最後檢查。' }] } },
    { say: R`「某個<b>正數</b>的平方，減掉它的 3 倍，等於 10。」<br>① 設這個數是 \(x\) ② 列式：\(x^2-3x=10\)`,
      ask: two(R`③ 解：\(x^2-3x-10=0\)，\((x-5)(x+2)=0\)`, 5, -2) },
    { say: '④ 驗：題目說是<b>正數</b>……',
      ask: keep('答案是？', '只有 5', '5 和 −2 都是', '−2 不是正數，要<b>不合</b>。檢查：25−15＝10 ✔', '題目說「正數」，−2 要捨去喔。') },
    { say: R`「兩個<b>連續正整數</b>相乘是 56。」設小的是 \(x\)，大的就是 \(x+1\)。`,
      ask: { type: 'num', q: R`\(x(x+1)=56\)，\(x^2+x-56=0\)，\((x+8)(x-7)=0\)。兩個數是？`, groups: [[0], [1]], fields: [{ answer: 7 }, { pre: '和', answer: 8 }], hint: 'x＝7 或 −8，正整數只能是 7，另一個是 8。' } },
    { say: challenge(R`「兩數和是 10，積是 21。」設一個數是 \(x\)，另一個就是 \(10-x\)。`),
      ask: { type: 'num', q: R`\(x(10-x)=21\)，兩個數是？`, groups: [[0], [1]], fields: [{ answer: 3 }, { pre: '和', answer: 7 }], hint: '整理成 x²−10x+21＝0，(x−3)(x−7)＝0' } }
  ] };

  /* =========================================================
     第 2 關：巧克力的形狀（圖形題）
     ========================================================= */
  const garden = (h) => raw(h, 360, 240, `<g transform="translate(18,12)"><rect x="25" y="20" width="280" height="168" rx="4" fill="#8cc084" stroke="#5b3a26" stroke-width="2"/><rect x="155" y="20" width="22" height="168" fill="#e9cfa6" stroke="#5b3a26" stroke-width="1.5"/><rect x="25" y="96" width="280" height="22" fill="#e9cfa6" stroke="#5b3a26" stroke-width="1.5"/><text x="165" y="14" text-anchor="middle" class="ruler-t">20 公尺</text><text x="16" y="104" text-anchor="end" class="ruler-t">12</text><text x="166" y="210" text-anchor="middle" class="ruler-t">小路寬 x</text></g>`);
  const garden2 = (h) => raw(h, 360, 240, `<g transform="translate(18,12)"><rect x="25" y="20" width="280" height="168" rx="4" fill="#e9cfa6" stroke="#5b3a26" stroke-width="2"/><rect x="25" y="20" width="258" height="146" fill="#8cc084" stroke="#5b3a26" stroke-width="1.5"/><text x="154" y="94" text-anchor="middle" class="region-label" font-size="16">(20−x)(12−x)＝180</text><text x="154" y="14" text-anchor="middle" class="ruler-t">20−x</text><text x="16" y="94" text-anchor="end" class="ruler-t">12−x</text><text x="294" y="94" class="ruler-t" style="font-size:12px">x</text></g>`);
  const S2 = { id: 's2', badge: '🟫', title: '第 2 關　巧克力的形狀', steps: [
    { say: '一片正方形巧克力，邊長<b>加長 2 公分</b>後，面積變成 49 平方公分。原來邊長多少？',
      scene: (h) => { areaBox(h, [{ t: 'x', w: 3 }, { t: '2', w: 1 }], [{ t: 'x', w: 3 }, { t: '2', w: 1 }], [[{ t: '原來', fill: C.choco }, { t: '', fill: C.orange }], [{ t: '', fill: C.orange }, { t: '', fill: C.matcha }]], { maxH: 170 }); },
      ask: two(R`\((x+2)^2=49\)，\(x+2=\pm7\)`, 5, -9) },
    { say: '邊長可以是 −9 嗎？',
      scene: (h) => { areaBox(h, [{ t: 'x', w: 3 }, { t: '2', w: 1 }], [{ t: 'x', w: 3 }, { t: '2', w: 1 }], [[{ t: '原來', fill: C.choco }, { t: '', fill: C.orange }], [{ t: '', fill: C.orange }, { t: '', fill: C.matcha }]], { maxH: 170 }); },
      ask: keep('原來的邊長是？', '5 公分', '5 或 −9 公分', '邊長不可能是負的，−9 不合。檢查：7²＝49 ✔', '長度不能是負數喔！') },
    { say: R`長方形巧克力<b>周長 20</b>、<b>面積 24</b>。長＋寬＝周長的一半＝10，設長是 \(x\)，寬就是 \(10-x\)。`,
      scene: (h) => { areaBox(h, [{ t: 'x', w: 4 }], [{ t: '10−x', w: 2.4 }], [[{ t: '面積 24', fill: C.choco }]], { maxH: 120 }); },
      ask: { type: 'num', q: R`\(x(10-x)=24\)，長和寬是？`, groups: [[0], [1]], fields: [{ pre: '長', answer: 6 }, { pre: '　寬', answer: 4 }], hint: 'x²−10x+24＝0，(x−4)(x−6)＝0' } },
    { say: '花園長 20 公尺、寬 12 公尺，中間開一條<b>十字小路</b>，路寬都是 x。剩下的草地面積是 180 平方公尺。',
      scene: garden,
      ask: { type: 'choice', q: '可可貓的妙招：把小路「推」到邊邊，草地會變成什麼？', options: [
        { t: R`一個長 \(20-x\)、寬 \(12-x\) 的長方形`, ok: true, why: '小路推到邊邊，草地的面積不變，而且拼成一整塊長方形，超好算！' },
        { t: '還是四塊分開的', why: '把小路推到最右邊和最下面，草地就合在一起了。' }] } },
    { say: '列式並解出來：',
      scene: garden2,
      ask: two(R`\((20-x)(12-x)=180\)，整理成 \(x^2-32x+60=0\)`, 2, 30, '(x−2)(x−30)＝0') },
    { say: '路寬可以是 30 公尺嗎？',
      scene: garden2,
      ask: keep('路寬是？', '2 公尺', '2 或 30 公尺', '花園寬才 12 公尺，路不可能寬 30 公尺，不合。', '花園只有 12 公尺寬，30 公尺的路放不下喔！') },
    { say: challenge('直角三角形巧克力，兩股差 2 公分，斜邊 10 公分。設短股 x。'),
      scene: (h) => { pythag(h, 8, 6, { squares: false, la: 'x＋2', lb: 'x', lc: '10' }); },
      ask: { type: 'num', q: R`畢氏定理：\(x^2+(x+2)^2=100\)，兩股是？`, groups: [[0], [1]], fields: [{ answer: 6 }, { pre: '和', answer: 8 }], hint: '2x²＋4x−96＝0 → x²＋2x−48＝0 → (x+8)(x−6)＝0' } }
  ] };

  /* =========================================================
     第 3 關：可可貓的生意經（生活題）
     ========================================================= */
  const S3 = { id: 's3', badge: '💰', title: '第 3 關　可可貓的生意經', steps: [
    { say: '巧克力禮盒一盒賣 <b>50 元</b>，每天賣 <b>40 盒</b>。<br>可可貓發現：每<b>漲 10 元</b>，就會<b>少賣 4 盒</b>。<br>如果漲了 x 次（每次 10 元）：',
      ask: { type: 'num', q: '售價和賣出盒數各是？', fields: [{ pre: '售價＝50＋', answer: 10, post: R`\(x\) 元` }, { pre: '　盒數＝40−', answer: 4, post: R`\(x\) 盒` }] } },
    { say: R`想要一天收入 2240 元：\((50+10x)(40-4x)=2240\)<br>整理後得到 \(x^2-5x+6=0\)。`,
      ask: two('解出漲價次數：', 2, 3, '(x−2)(x−3)＝0') },
    { say: '漲 2 次或 3 次都可以！',
      ask: { type: 'num', q: '對應的售價是？', groups: [[0], [1]], fields: [{ answer: 70, post: '元' }, { pre: '或', answer: 80, post: '元' }], hint: '50＋10×2；50＋10×3' },
      after: '兩個答案都合理，這次都要寫！（70 元賣 32 盒、80 元賣 28 盒，都是 2240 元 ✔）' },
    { say: '派對上每兩個人都要握一次手，一共握了 28 次。有幾個人？<br>每人要跟其他 \\(n-1\\) 人握手，但 A 握 B 和 B 握 A 是同一次，所以要除以 2。',
      ask: { type: 'num', q: R`\(\dfrac{n(n-1)}{2}=28\)，\(n=\)？`, fields: [{ answer: 8, post: '人', diag: [{ v: -7, msg: '人數不能是負的！' }] }], hint: 'n(n−1)＝56，(n−8)(n+7)＝0' } },
    { say: challenge('巧克力價格連續漲價兩次，每次漲的<b>百分率一樣</b>，從 100 元變成 121 元。設每次漲 r。'),
      ask: { type: 'num', q: R`\(100(1+r)^2=121\)，\((1+r)^2=1.21\)，每次漲幾 %？`, fields: [{ answer: 10, post: '%', diag: [{ v: 21, msg: '那是兩次加起來的效果，每一次只有 1.1 倍。' }] }], hint: '1＋r＝1.1（負的不合）' } },
    { say: challenge(R`從 80 公尺高的地方丟下一顆巧克力，落下的距離是 \(5t^2\) 公尺（\(t\) 是秒）。`),
      ask: { type: 'num', q: R`\(5t^2=80\)，幾秒落地？`, fields: [{ answer: 4, post: '秒', diag: [{ v: -4, msg: '時間不能是負的。' }] }] } }
  ] };

  /* =========================================================
     第 4 關：更多應用題（年齡、二位數、走道、看錯題）
     ========================================================= */
  const pool = (h) => raw(h, 330, 200, `<rect x="30" y="20" width="270" height="160" rx="4" fill="#e9cfa6" stroke="#5b3a26" stroke-width="2"/><rect x="60" y="50" width="210" height="100" fill="#9aa8f5" stroke="#5b3a26" stroke-width="1.5"/><text x="165" y="104" text-anchor="middle" class="region-label" font-size="16">游泳池 20×10</text><text x="44" y="104" class="ruler-t" style="font-size:13px">x</text><text x="160" y="40" class="ruler-t" style="font-size:13px">x</text><text x="165" y="196" text-anchor="middle" class="ruler-t">走道寬都是 x</text>`);
  const S4 = { id: 's4', badge: '🧩', title: '第 4 關　更多應用題', steps: [
    { say: '<b>年齡題</b>：小可今年 x 歲，3 年後的年齡，剛好是 3 年前年齡的平方。',
      ask: two(R`\(x+3=(x-3)^2\)，整理成 \(x^2-7x+6=0\)`, 6, 1, '(x−1)(x−6)＝0') },
    { say: '小可可能是 1 歲嗎？',
      ask: keep('小可今年幾歲？', '6 歲', '1 歲或 6 歲', '1 歲的話，3 年前是 −2 歲，不合理！檢查 6 歲：3 年後 9 歲，3 年前 3 歲，3²＝9 ✔', '3 年前是 −2 歲？不可能喔！') },
    { say: '<b>二位數題</b>：個位數字比十位數字大 3，而且<b>個位數字的平方</b>剛好等於這個二位數。<br>設十位是 x，個位就是 x＋3，這個數＝10x＋(x＋3)。',
      ask: { type: 'num', q: R`\((x+3)^2=11x+3\)，整理成 \(x^2-5x+6=0\)。這個二位數是？` + '<div class="muted small">（兩個答案，順序可對調）</div>', groups: [[0], [1]], fields: [{ answer: 25 }, { pre: '或', answer: 36 }], hint: 'x＝2 或 3 → 十位 2、個位 5；十位 3、個位 6' },
      after: '檢查：5²＝25 ✔、6²＝36 ✔，兩個都對！' },
    { say: '游泳池長 20、寬 10 公尺，四周有一圈等寬的走道，走道面積 64 平方公尺。',
      scene: pool,
      ask: { type: 'choice', q: '要怎麼列式？', options: [
        { t: R`\((20+2x)(10+2x)-20\times10=64\)`, ok: true, why: '外面大長方形減掉游泳池，就是走道。長、寬<b>兩邊</b>都有走道，所以加 2x。' },
        { t: R`\((20+x)(10+x)-200=64\)`, why: '左右兩邊都有走道，長度要加 2x 喔！' },
        { t: R`\((20-2x)(10-2x)=64\)`, why: '走道在游泳池<b>外面</b>，是加不是減。' }] } },
    { say: R`整理後 \(x^2+15x-16=0\)：`,
      scene: pool,
      ask: { type: 'num', q: '走道寬幾公尺？', fields: [{ answer: 1, post: '公尺', diag: [{ v: -16, msg: '寬度不能是負的，−16 不合！' }] }], hint: '(x+16)(x−1)＝0' } },
    { say: R`答案有根號時也要取捨：邊長 10 的正方形草地開一條十字路，路寬 x，剩下的草地 70 平方公尺。<br>\((10-x)^2=70\)，\(10-x=\pm\sqrt{70}\)，\(x=10\mp\sqrt{70}\)`,
      ask: { type: 'choice', q: R`路寬是？（\(\sqrt{70}\approx8.4\)）`, options: [
        { t: R`\(10-\sqrt{70}\)（約 1.6 公尺）`, ok: true, why: R`\(10+\sqrt{70}\approx18.4\)，比草地還寬，不合。` },
        { t: R`\(10+\sqrt{70}\)`, why: '約 18.4 公尺，比邊長 10 還大，路放不下！' }] } },
    { say: '<b>看錯題</b>：解 x²＋bx＋c＝0。小明看錯 b，解出 2 和 6；小華看錯 c，解出 −1 和 8。<br>小明的 c 是對的：(x−2)(x−6)＝x²−8x＋<b>12</b>；小華的 b 是對的：(x+1)(x−8)＝x²<b>−7x</b>−8。',
      ask: two('正確的方程式是 x²−7x＋12＝0，解是：', 3, 4, '(x−3)(x−4)＝0') },
    { say: challenge('班際籃球賽，每兩班都要比一場（單循環），一共比了 36 場。'),
      ask: { type: 'num', q: R`\(\dfrac{n(n-1)}{2}=36\)，有幾班？`, fields: [{ answer: 9, post: '班' }], hint: 'n(n−1)＝72＝9×8' } }
  ] };

  const STAGES = [S1, S2, S3, S4];
  document.addEventListener('DOMContentLoaded', () => Lesson.mount('math8a-4-3', STAGES, { signed: true }));
})();
