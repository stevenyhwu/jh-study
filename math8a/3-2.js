/* ===== 3-2 利用乘法公式作因式分解：拼回正方形（3 關） =====
   1-1 的公式倒過來：草莓＋兩塊橘子＋抹茶 → 拼回正方形；挖一角的 → 拼成長方形 */
(function () {
  'use strict';
  const R = String.raw;
  const { areaBox, raw, C } = Viz;
  const challenge = s => `<span class="chal">⭐ 挑戰題</span> ${s}`;
  const formula = (f, tip) => `<div class="formula">${f}</div>${tip ? `<div class="tip">${tip}</div>` : ''}`;
  const note = '<div class="muted small">（負的就按 ± 變成負數）</div>';
  const cell = (t, fill, dash) => ({ t, fill, dash });
  // (ax+b)² 的兩格
  const sq = (q, a, b, hint, diag) => ({ type: 'num', q: q + note, fields: [{ pre: '(', answer: a, post: R`\(x\) ＋`, diag: diag && diag[0] }, { answer: b, post: ')²', diag: diag && diag[1] }], hint });
  // (ax+b)(ax−b)：兩組可互換
  const ds = (q, a, b, c, d, hint) => ({ type: 'num', q: q + note, groups: [[0, 1], [2, 3]],
    fields: [{ pre: '(', answer: a, post: R`\(x\) ＋` }, { answer: b, post: ')' }, { nl: true, pre: '(', answer: c, post: R`\(x\) ＋` }, { answer: d, post: ')' }], hint });
  // 正方形切四塊（a 段、b 段）
  const sq4 = (h, la, lb, t) => areaBox(h, [{ t: la, w: 3 }, { t: lb, w: 1.5 }], [{ t: la, w: 3 }, { t: lb, w: 1.5 }],
    [[cell(t[0], C.berry), cell(t[1], C.orange)], [cell(t[2], C.orange), cell(t[3], C.matcha)]], { maxH: 200 });
  // 挖一角拼長方形
  function hole(h, a, b) {
    raw(h, 330, 190, `<rect x="14" y="40" width="110" height="70" rx="6" fill="#f28fad" stroke="#5b3a26" stroke-width="2"/><rect x="14" y="110" width="70" height="40" rx="6" fill="#f6a54b" stroke="#5b3a26" stroke-width="2"/><rect x="84" y="110" width="40" height="40" rx="6" fill="#e9cfa6" fill-opacity=".3" stroke="#5b3a26" stroke-width="2" stroke-dasharray="5 4"/><text x="69" y="28" text-anchor="middle" class="ruler-t">${a}</text><text x="104" y="130" text-anchor="middle" class="ruler-t" style="font-size:12px">挖${b}²</text><text x="152" y="95" font-size="28" text-anchor="middle">➜</text><rect x="180" y="40" width="110" height="70" rx="6" fill="#f28fad" stroke="#5b3a26" stroke-width="2"/><rect x="290" y="40" width="40" height="70" rx="6" fill="#f6a54b" stroke="#5b3a26" stroke-width="2"/><text x="255" y="28" text-anchor="middle" class="ruler-t">${a}＋${b}</text><text x="255" y="130" text-anchor="middle" class="ruler-t">寬 ${a}－${b}</text>`);
  }

  /* =========================================================
     第 1 關：拼回正方形（完全平方式）
     ========================================================= */
  const S1 = { id: 's1', badge: '🧩', title: '第 1 關　拼回正方形', steps: [
    { say: R`還記得 1-1 的拼圖偵探嗎？<b>草莓＋兩塊橘子＋抹茶</b>，可以拼回一個正方形！<br>\(x^2+6x+9\)：1 個大方盒、6 根長條、9 顆小顆。`,
      scene: (h) => { Viz.polyTiles(h, { x2: 1, x: 6, c: 9 }, { labels: it => ({ x2: 'x²', x: '6x', '1': '9' }[it.k]) }); },
      ask: { type: 'choice', q: '要拼成正方形，6 根長條怎麼分？', options: [
        { t: '分成兩邊，各 3 根（兩塊橘子）', ok: true, why: R`9 顆小顆剛好排成 3×3 的抹茶，兩邊各放 3 根長條。` },
        { t: '全部放在同一邊', why: '那樣拼不成正方形喔，正方形兩邊要一樣長。' },
        { t: '分成 2 根和 4 根', why: '兩塊橘子要一樣大，才拼得成正方形。' }] } },
    { say: '拼好了！',
      scene: (h) => { sq4(h, 'x', '3', ['x²', '3x', '3x', '9']); },
      ask: sq(R`\(x^2+6x+9=\)`, 1, 3, '邊長是 x＋3。') ,
      after: formula(R`\(a^2+2ab+b^2=(a+b)^2\)`, '偵探三步驟：① 頭尾是誰的平方？② 中間是 2×頭×尾 嗎？③ 拼成 (頭＋尾)²') },
    { say: R`用偵探三步驟：\(x^2+10x+25\)<br>① 頭 \(x^2\)→\(x\)，尾 \(25\)→\(5\) ② \(2\times x\times5=10x\) ✔`,
      scene: (h) => { sq4(h, 'x', '5', ['x²', '5x', '5x', '25']); },
      ask: sq('③ 拼起來：', 1, 5) },
    { say: R`中間是<b>減號</b>，就是被小狗咬過的：\(x^2-8x+16\)`,
      scene: (h) => { sq4(h, 'x', '−4', ['x²', '−4x', '−4x', '16']); },
      ask: sq(R`\(x^2-8x+16=\)`, 1, -4, '2×x×4＝8x，中間是減號 → (x−4)²', [[], [{ v: 4, msg: '中間是 −8x，所以是 (x − 4)²，按 ± 變成 −4。' }]]) },
    { say: R`頭不是 \(x^2\) 的：\(4x^2+12x+9\)<br>\(4x^2=(2x)^2\)，\(9=3^2\)，\(2\times2x\times3=12x\) ✔`,
      scene: (h) => { sq4(h, '2x', '3', ['4x²', '6x', '6x', '9']); },
      ask: sq(R`\(4x^2+12x+9=\)`, 2, 3, '頭是 2x、尾是 3。', [[{ v: 4, msg: '4x² 是 (2x)²，頭是 2x。' }]]) },
    { say: R`⚠️ 小心假的！\(x^2+6x+4\)：頭 \(x\)、尾 \(2\)……`,
      ask: { type: 'choice', q: '它是 (x＋2)² 嗎？', options: [
        { t: R`不是！\(2\times x\times2=4x\)，但中間是 \(6x\)`, ok: true, why: R`\((x+2)^2=x^2+4x+4\)。中間對不上，就<b>不是</b>完全平方式。一定要檢查第 ② 步！` },
        { t: '是', why: R`乘開檢查：\((x+2)^2=x^2+4x+4\)，中間是 4x，不是 6x。` }] } },
    { say: challenge(R`把 \((x+1)\) 當成一個禮盒 🎁：\((x+1)^2+6(x+1)+9=\)🎁\(^2+6\)🎁\(+9\)`),
      ask: { type: 'num', q: R`＝(🎁＋3)²＝\((x+\;\square\;)^2\)`, fields: [{ pre: R`\((x+\)`, answer: 4, post: ')²', diag: [{ v: 3, msg: '🎁 是 x＋1，所以 🎁＋3＝x＋1＋3。' }] }] } },
    { say: challenge('兩個字母也一樣：'),
      ask: { type: 'choice', q: R`\(9x^2-12xy+4y^2=\)？`, options: [
        { t: R`\((3x-2y)^2\)`, ok: true, why: R`頭 \(3x\)、尾 \(2y\)，\(2\times3x\times2y=12xy\)，中間是減 ✔` },
        { t: R`\((3x+2y)^2\)`, why: '中間是減號喔。' },
        { t: R`\((9x-4y)^2\)`, why: R`\(9x^2\) 是 \((3x)^2\)，頭是 3x。` }] } }
  ] };

  /* =========================================================
     第 2 關：挖一角拼長方形（平方差）
     ========================================================= */
  const S2 = { id: 's2', badge: '🐭', title: '第 2 關　挖一角拼長方形', steps: [
    { say: R`1-1 的老鼠挖洞：大正方形 \(x^2\) 挖掉一個 \(3\times3\)，剩下的可以拼成長方形！`,
      scene: (h) => { hole(h, 'x', '3'); },
      ask: ds(R`\(x^2-9=\)`, 1, 3, 1, -3, '長 x＋3、寬 x−3。') ,
      after: formula(R`\(a^2-b^2=(a+b)(a-b)\)`, '平方 − 平方 → (相加)(相減)') },
    { say: R`\(4x^2-25\)：\(4x^2=(2x)^2\)，\(25=5^2\)。`,
      scene: (h) => { hole(h, '2x', '5'); },
      ask: ds(R`\(4x^2-25=\)`, 2, 5, 2, -5) },
    { say: R`先看有沒有<b>公因式</b>可以提！\(3x^2-12\)：3 和 12 都是 3 的倍數。`,
      ask: { type: 'num', q: R`\(3x^2-12=3(x^2-4)=3(x+\square)(x-\square)\)`, fields: [{ answer: 2 }], hint: '4＝2²。' },
      after: '👉 <b>因式分解第一步：先提公因式！</b>提完再看能不能用公式。' },
    { say: R`⚠️ \(x^2+9\) 可以分解嗎？`,
      ask: { type: 'choice', q: '想想看：', options: [
        { t: R`不行！平方「加」平方不能用平方差`, ok: true, why: R`平方差公式要「減」號。\((x+3)(x-3)=x^2-9\)，不是 \(+9\)。` },
        { t: R`可以，\((x+3)(x-3)\)`, why: R`乘開是 \(x^2-9\) 喔！` },
        { t: R`可以，\((x+3)^2\)`, why: R`\((x+3)^2=x^2+6x+9\)，多了 6x。` }] } },
    { say: R`把 \((x+1)\) 當成 🎁：\((x+1)^2-4=\)🎁\(^2-2^2\)＝(🎁＋2)(🎁－2)`,
      ask: ds('＝？', 1, 3, 1, -1, '🎁＋2＝x+1+2；🎁−2＝x+1−2。') },
    { say: '心算魔術：',
      ask: { type: 'num', q: R`\(101^2-99^2=(101+99)(101-99)=\)？`, fields: [{ answer: 400 }] } },
    { say: challenge('要分解到<b>不能再分</b>為止：'),
      ask: { type: 'choice', q: R`\(x^4-16=(x^2+4)(x^2-4)=\)？`, options: [
        { t: R`\((x^2+4)(x+2)(x-2)\)`, ok: true, why: R`\(x^2-4\) 還能再用平方差！\(x^2+4\) 是平方和，不能再分。` },
        { t: R`\((x^2+4)(x^2-4)\)`, why: R`\(x^2-4\) 還可以再分解喔。` },
        { t: R`\((x+2)^2(x-2)^2\)`, why: R`\(x^2+4\) 不是 \((x+2)^2\)。` }] } },
    { say: challenge(R`\(9x^2-y^2-2y-1\)：後面三項 \(-(y^2+2y+1)=-(y+1)^2\)！`),
      ask: { type: 'choice', q: R`\(9x^2-(y+1)^2=\)？`, options: [
        { t: R`\((3x+y+1)(3x-y-1)\)`, ok: true, why: R`平方差：\((3x+(y+1))(3x-(y+1))\)，第二個括號要記得整包變號。` },
        { t: R`\((3x+y+1)(3x-y+1)\)`, why: R`\(3x-(y+1)=3x-y-1\)，1 也要變號。` },
        { t: R`\((3x-y-1)^2\)`, why: '這是平方「差」，要變成相加×相減。' }] } }
  ] };

  /* =========================================================
     第 3 關：先看用哪一招
     ========================================================= */
  const pick = (expr, ans, why) => ({ say: `看到 ${expr}，先用哪一招？`, ask: { type: 'choice', options: [
    { t: '🎯 提公因式', ok: ans === 0, why: why[0] }, { t: '🧩 完全平方 (a±b)²', ok: ans === 1, why: why[1] },
    { t: '🐭 平方差 (a+b)(a−b)', ok: ans === 2, why: why[2] }, { t: '🚫 不能分解', ok: ans === 3, why: why[3] }] } });
  const S3 = { id: 's3', badge: '🕵️', title: '第 3 關　用哪一招？', steps: [
    { say: R`因式分解的<b>順序</b>：<br>① 有沒有公因式？有就先提<br>② 兩項、中間是減 → 平方差<br>③ 三項、頭尾是平方 → 檢查是不是完全平方`,
      ask: { type: 'choice', q: '第一步永遠先看什麼？', options: [{ t: '有沒有公因式', ok: true, why: '對！先提公因式，剩下的才會變簡單。' }, { t: '有沒有平方', why: '先看公因式喔，提完再看平方。' }] } },
    pick(R`\(x^2-49\)`, 2, ['兩項沒有共同的因式喔。', '只有兩項，不是三項。', R`\(x^2-7^2=(x+7)(x-7)\)`, '平方「減」平方可以分解！']),
    pick(R`\(5x^2+10x\)`, 0, [R`\(5x(x+2)\)`, '沒有常數項，不是完全平方。', '中間不是減號，10x 也不是平方。', '有共同的 5x 喔！']),
    pick(R`\(x^2-14x+49\)`, 1, ['三項沒有共同的因式。', R`頭 x、尾 7，\(2\times x\times7=14x\)：\((x-7)^2\)`, '它有三項喔。', '試試偵探三步驟！']),
    pick(R`\(x^2+16\)`, 3, ['沒有公因式。', '只有兩項。', '平方「加」平方不能用平方差。', '對！平方和不能分解。']),
    { say: '組合技：先提，再用公式！',
      ask: { type: 'num', q: R`\(2x^3-8x=2x(x^2-4)=2x(x+\square)(x-\square)\)`, fields: [{ answer: 2 }] } },
    { say: challenge('組合技：'),
      ask: { type: 'choice', q: R`\(x^3+4x^2+4x=\)？`, options: [
        { t: R`\(x(x+2)^2\)`, ok: true, why: R`先提 \(x\)：\(x(x^2+4x+4)\)，括號裡是完全平方 \((x+2)^2\)。` },
        { t: R`\(x(x^2+4x+4)\)`, why: '括號裡還能再分解喔！' },
        { t: R`\((x+2)^3\)`, why: R`\((x+2)^3\) 乘開會有常數 8，題目沒有常數項。` }] } },
    { say: challenge('組合技：'),
      ask: { type: 'choice', q: R`\(8x^2-18y^2=\)？`, options: [
        { t: R`\(2(2x+3y)(2x-3y)\)`, ok: true, why: R`先提 2：\(2(4x^2-9y^2)\)，再用平方差。` },
        { t: R`\((8x+18y)(x-y)\)`, why: '乘開檢查看看，對不上喔。先提公因式 2。' },
        { t: R`\(2(4x^2-9y^2)\)`, why: '括號裡還可以用平方差！' }] } }
  ] };

  const STAGES = [S1, S2, S3];
  document.addEventListener('DOMContentLoaded', () => Lesson.mount('math8a-3-2', STAGES, { signed: true }));
})();
