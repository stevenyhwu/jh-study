/* ===== 1-1 乘法公式：可可貓的巧克力店（6 關） =====
   原則：先數小巧克力 → 找規律 → 最後才用字母 → 魔術時間（大數字）→ 挑戰題（考卷題型） */
(function () {
  'use strict';
  const R = String.raw;
  const { Choco, Puzzle, sleep } = Lesson;
  const NS = 'http://www.w3.org/2000/svg';

  /* ---------- 常用畫面 ---------- */
  // n×n 巧克力，在第 k 格切兩刀並上色：左上草莓、右下抹茶、另外兩塊橘子
  function cutGrid(host, n, k, opts) {
    const c = Choco(host, Object.assign({ rows: n, cols: n }, opts || {}));
    c.paint(0, 0, k, k, 'berry');
    c.paint(k, k, n, n, 'matcha');
    c.paint(0, k, k, n, 'orange');
    c.paint(k, 0, n, k, 'orange');
    c.split('v', k); c.split('h', k);
    return c;
  }
  // 大數字用的示意圖（不畫格子）：mode 'plus' 切四塊、'minus' 咬兩排
  function schem(host, a, b, mode) {
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 300 300');
    svg.setAttribute('class', 'choco');
    host.appendChild(Lesson.h('<div class="choco-wrap"></div>')).appendChild(svg);
    const A = 200, B = 60, x = 18, y = 30;
    const r = (X, Y, w, hh, fill, t, dash) => {
      svg.insertAdjacentHTML('beforeend', `<rect x="${X}" y="${Y}" width="${w}" height="${hh}" rx="8" fill="${fill}" stroke="#5b3a26" stroke-width="2" ${dash ? 'stroke-dasharray="6 5" fill-opacity=".25"' : ''}/>`);
      if (t) svg.insertAdjacentHTML('beforeend', `<text x="${X + w / 2}" y="${Y + hh / 2}" text-anchor="middle" dominant-baseline="middle" class="region-label" font-size="${w < 80 || hh < 80 ? 13 : 18}">${t}</text>`);
    };
    if (mode === 'plus') {
      r(x, y, A, A, '#f28fad', `${a}×${a}`);
      r(x + A + 4, y, B, A, '#f6a54b', `${a}×${b}`);
      r(x, y + A + 4, A, B, '#f6a54b', `${a}×${b}`);
      r(x + A + 4, y + A + 4, B, B, '#8cc084', `${b}×${b}`);
      svg.insertAdjacentHTML('beforeend', `<text x="${x + A / 2}" y="${y - 10}" text-anchor="middle" class="ruler-t">${a}</text><text x="${x + A + 4 + B / 2}" y="${y - 10}" text-anchor="middle" class="ruler-t">${b}</text>`);
    } else {
      const T = A + B + 4;
      r(x, y, T, T, '#f28fad', '');
      r(x, y, T, B, '#e9cfa6', `咬掉 ${a}×${b}`, true);
      r(x + T - B, y, B, T, '#e9cfa6', '', true);
      r(x + T - B, y, B, B, '#8cc084', `+${b}×${b}`);
      svg.insertAdjacentHTML('beforeend', `<text x="${x + (T - B) / 2}" y="${y + B + (T - B) / 2}" text-anchor="middle" dominant-baseline="middle" class="region-label" font-size="18">剩下的</text><text x="${x + T / 2}" y="${y - 10}" text-anchor="middle" class="ruler-t">${a}</text>`);
    }
    return svg;
  }
  const challenge = s => `<span class="chal">⭐ 挑戰題</span> ${s}`;
  const formula = (f, tip) => `<div class="formula">${f}</div>${tip ? `<div class="tip">${tip}</div>` : ''}`;

  /* =========================================================
     第 1 關：切巧克力（乘法、平方、分配律）
     ========================================================= */
  const S1 = { id: 's1', badge: '🔪', title: '第 1 關　切巧克力', steps: [
    { say: '嗨！我是<b>可可貓</b>，我開了一家巧克力店 🍫<br>今天要請你當小幫手，幫我算巧克力。先看看這片：',
      scene: (h) => { Choco(h, { rows: 3, cols: 4 }).countMode(); },
      ask: { type: 'num', q: '這片巧克力一共有幾格？（可以點格子，一格一格數）', fields: [{ answer: 12, diag: [{ v: 7, msg: '3＋4＝7 是把邊加起來。我們要數的是<b>全部的格子</b>，點點看！' }] }] },
      after: '沒錯！除了一格一格數，還可以這樣算：<b>3 排</b>，每排 <b>4 格</b>，3×4＝12。<br>👉 <b>乘法就是「有幾排 × 每排幾格」</b>。' },
    { say: '這片比較大：每排 5 格，有 5 排。',
      scene: (h) => { Choco(h, { rows: 5, cols: 5 }).countMode(); },
      ask: { type: 'num', q: '一共幾格？', fields: [{ answer: 25, diag: [{ v: 10, msg: '5＋5＝10 是加法喔。要算 5 排、每排 5 格：5×5。' }] }] },
      after: R`這片巧克力長和寬一樣，是<b>正方形</b>。<br>正方形的格數＝5×5，數學上寫成 \(5^2\)，念作「5 的平方」。<br>👉 <b>平方就是「自己乘自己」</b>，剛好就是正方形巧克力的格數。` },
    { say: '考考你！這是一片 4×4 的正方形巧克力。',
      scene: (h) => { Choco(h, { rows: 4, cols: 4 }); },
      ask: { type: 'choice', q: R`\(4^2\) 是什麼意思？`, options: [
        { t: '4×4，也就是 16', ok: true, why: R`對！\(4^2\) 就是邊長 4 格的正方形巧克力，有 16 格。` },
        { t: '4×2，也就是 8', why: '平方不是乘 2！是<b>自己乘自己</b>：4×4。' },
        { t: '4＋4，也就是 8', why: '平方是乘法，不是加法喔。' }] } },
    { say: '哇，這片好大！每排 13 格，有 6 排。<br>一格一格數，會數到眼睛花……😵',
      scene: (h, api) => {
        const c = Choco(h, { rows: 6, cols: 13 });
        c.cutMode('v', 10, () => { c.paint(0, 10, 6, 13, 'orange'); api.done(); },
          k => api.say(`你切在第 ${k} 格後面了。要切在<b>第 10 格</b>後面喔，從左邊數 10 格。`, 'badc'));
      },
      ask: { type: 'action', text: '可可貓的祕訣是「切開」！請點<b>第 10 格和第 11 格中間的縫</b>，切一刀。' },
      after: '喀！切成兩塊了。左邊每排 <b>10</b> 格，右邊每排 <b>3</b> 格。' },
    { say: '現在兩塊分開算：',
      scene: (h) => { const c = Choco(h, { rows: 6, cols: 13 }); c.paint(0, 10, 6, 13, 'orange'); c.split('v', 10); c.label(0, 0, 6, 10, '6×10'); c.label(0, 10, 6, 13, '6×3', { size: 13 }); },
      ask: { type: 'num', fields: [{ pre: '左邊 6×10＝', answer: 60 }, { pre: '　右邊 6×3＝', answer: 18 }], hint: '6 排，每排 10 格；6 排，每排 3 格。' } },
    { say: '兩塊加起來，就是整片巧克力！',
      ask: { type: 'num', q: '60＋18＝？', fields: [{ answer: 78 }] },
      after: R`所以 \(6\times13=6\times10+6\times3=78\)。<br>👉 <b>切開來分開算，再加起來，答案一樣。</b>這招叫做「分配律」。<br>為什麼要切在 10？因為<b>乘 10 最好算</b>！` },
    { say: '再教你一招更厲害的！這片每排 9 格，有 4 排。<br>可可貓想：9 很接近 10……那就<b>先假裝每排有 10 格</b>！（虛線那排是假裝的）',
      scene: (h) => { const c = Choco(h, { rows: 4, cols: 10 }); c.paint(0, 9, 4, 10, 'milk'); c.ghost(cl => cl.c === 9); },
      ask: { type: 'num', q: '先假裝每排 10 格：4×10＝？', fields: [{ answer: 40 }] },
      after: '可是最右邊那排是假裝的，要把它拿掉。' },
    { say: '老鼠 🐭 幫忙把假裝的那一排搬走：',
      scene: (h) => { const c = Choco(h, { rows: 4, cols: 10 }); c.paint(0, 9, 4, 10, 'milk'); setTimeout(() => c.eat(cl => cl.c === 9, '🐭'), 500); },
      ask: { type: 'num', q: '假裝的那一排有幾格？4×1＝', fields: [{ answer: 4 }] } },
    { say: '所以真正的巧克力是：',
      ask: { type: 'num', q: '40－4＝？', fields: [{ answer: 36, diag: [{ v: 44, msg: '假裝的那排是<b>多出來</b>的，要「減掉」。' }] }] },
      after: R`\(4\times9=4\times10-4\times1=36\)。<br>👉 <b>先算好算的，再把多的拿掉</b>，這樣也可以！` },
    { say: '🎩 <b>魔術時間！</b><br>現在你可以表演心算了。朋友說「99×7」，你馬上說出答案！<br>99 想成「100 少 1」：',
      ask: { type: 'num', fields: [{ pre: '100×7＝', answer: 700 }, { pre: '　多算的 1×7＝', answer: 7 }, { pre: '　答案＝', answer: 693, diag: [{ v: 707, msg: '99 比 100 少，多算的要「減掉」：700－7。' }] }] },
      after: '99×7＝693！朋友一定會嚇一跳 😎' },
    { say: challenge('用同一招算算看：'),
      ask: { type: 'num', q: R`\(198\times35=\)？`, fields: [{ answer: 6930, diag: [{ v: 7070, msg: '198 比 200 少 2，要減掉 2×35。' }] }], hint: '198＝200－2，所以先算 200×35＝7000，再減掉 2×35＝70。' } }
  ] };

  /* =========================================================
     第 2 關：正方形巧克力切四塊（和的平方）
     ========================================================= */
  const S2 = { id: 's2', badge: '🍓', title: '第 2 關　正方形切四塊', steps: [
    { say: '還記得這片 5×5 的正方形巧克力嗎？它有 25 格。<br>客人想要<b>好幾種口味</b>，我們來切它！',
      scene: (h, api) => {
        const c = Choco(h, { rows: 5, cols: 5 });
        c.cutMode('v', 3, () => {
          api.say('切得好！再點<b>第 3 排和第 4 排中間的橫縫</b>。', 'hintc');
          c.cutMode('h', 3, () => {
            c.paint(0, 0, 3, 3, 'berry'); c.paint(3, 3, 5, 5, 'matcha'); c.paint(0, 3, 3, 5, 'orange'); c.paint(3, 0, 5, 3, 'orange');
            api.done();
          }, () => api.say('要切在<b>第 3 排</b>下面喔。', 'badc'));
        }, () => api.say('要切在<b>第 3 格</b>右邊喔，從左邊數 3 格。', 'badc'));
      },
      ask: { type: 'action', text: '請點<b>第 3 格和第 4 格中間的直縫</b>，切一刀。' },
      after: '切成 4 塊了！有 <b>草莓</b>🍓、<b>抹茶</b>🍵，還有兩塊 <b>橘子</b>🍊。' },
    { say: '來數數每一塊！（可以點格子數）',
      scene: (h) => { cutGrid(h, 5, 3).countMode(); },
      ask: { type: 'num', fields: [{ pre: '🍓 草莓（左上）', answer: 9 }, { pre: '　🍵 抹茶（右下）', answer: 4 }], hint: '草莓是 3 排、每排 3 格。' },
      after: R`草莓是 3×3＝\(3^2\)，抹茶是 2×2＝\(2^2\)，兩塊都是<b>正方形</b>！` },
    { say: '那兩塊橘子呢？',
      scene: (h) => { cutGrid(h, 5, 3).countMode(); },
      ask: { type: 'num', fields: [{ pre: '🍊 上面那塊', answer: 6 }, { pre: '　🍊 左下那塊', answer: 6 }], hint: '上面那塊是 3 排、每排 2 格。' },
      after: '兩塊橘子<b>一樣大</b>，都是 3×2＝6。' },
    { say: '全部加起來：',
      scene: (h) => { cutGrid(h, 5, 3); },
      ask: { type: 'num', q: '9＋6＋6＋4＝？', fields: [{ answer: 25 }] },
      after: '跟整片一樣，是 25！巧克力切開，不會變多也不會變少。' },
    { say: R`隔壁的小明說：<br>「\((3+2)^2\) 就是 \(3^2+2^2=9+4=13\) 啦！」`,
      scene: (h, api) => { api.c = cutGrid(h, 5, 3); },
      ask: { type: 'choice', q: '小明說得對嗎？', options: [
        { t: '對，就是 13', why: '可是我們剛剛一格一格數，明明是 25 啊！' },
        { t: '不對！他忘了兩塊橘子（6＋6＝12）', ok: true, why: '沒錯！小明只算了草莓和抹茶兩個正方形，<b>漏掉兩塊橘子</b>。這是最多人會犯的錯！' },
        { t: '不對，應該是 10', why: R`\((3+2)^2=5^2=5\times5\)，不是 5×2 喔。` }] },
      onDone: (api) => { api.c.flash(cl => (cl.r < 3) !== (cl.c < 3)); } },
    { say: '換一片 6×6 的巧克力，把 6 切成 <b>4 和 2</b>，看看是不是也這樣。',
      scene: (h) => { cutGrid(h, 6, 4).countMode(); },
      ask: { type: 'num', fields: [{ pre: '🍓 草莓', answer: 16 }, { pre: '　🍵 抹茶', answer: 4 }, { pre: '　🍊 每塊橘子', answer: 8 }], hint: '草莓是 4×4；橘子是 4 排、每排 2 格。' } },
    { say: '加起來看看：',
      ask: { type: 'num', q: '16＋8＋8＋4＝？', fields: [{ answer: 36 }] },
      after: '6×6＝36，又一樣！' },
    { say: '你發現規律了嗎？',
      scene: (h) => { cutGrid(h, 6, 4); },
      ask: { type: 'choice', q: '正方形巧克力這樣切開，每次都會有……', options: [
        { t: '1 塊大正方形 ＋ 1 塊小正方形 ＋ 2 塊一樣的長方形', ok: true, why: '對！就是 🍓＋🍊🍊＋🍵。' },
        { t: '4 塊一樣大的', why: '看看草莓和抹茶，大小不一樣喔。' },
        { t: '只有 2 塊', why: '切兩刀會變成 4 塊。' }] } },
    { say: R`這個規律，換成什麼數字都對！<br>數學家很懶，不想每次都寫數字，就用<b>字母</b>代替：<br>・<b>a</b>＝第一段（像剛剛的 4）<br>・<b>b</b>＝第二段（像剛剛的 2）<br>字母只是「某個數字」的代號，就像座號代表你一樣。`,
      scene: (h) => {
        const c = cutGrid(h, 6, 4, { pad: 40 });
        c.ruler('top', 0, 4, 'a'); c.ruler('top', 4, 6, 'b', c.S * 0.35);
        c.label(0, 0, 4, 4, 'a²'); c.label(4, 4, 6, 6, 'b²'); c.label(0, 4, 4, 6, 'ab'); c.label(4, 0, 6, 4, 'ab');
      },
      ask: { type: 'choice', q: R`那 \((a+b)^2\) 切開後是？`, options: [
        { t: R`\(a^2+b^2\)`, why: '又忘了橘子了！🍊🍊' },
        { t: R`\(a^2+ab+ab+b^2\)，也就是 \(a^2+2ab+b^2\)`, ok: true, why: R`完全正確！<b>\(2ab\) 就是那兩塊橘子</b>。` },
        { t: R`\(2a+2b\)`, why: '我們算的是格子數，要用乘法喔。' }] },
      after: '這就是<b>和的平方公式</b>：' + formula(R`\((a+b)^2=a^2+2ab+b^2\)`, '記法：🍓 草莓 ＋ 🍊🍊 兩塊橘子 ＋ 🍵 抹茶') },
    { say: '🎩 <b>魔術時間！</b><br>朋友問：「103 的平方是多少？」<br>想像一片超大的正方形巧克力，邊長 100＋3：',
      scene: (h) => { schem(h, 100, 3, 'plus'); },
      ask: { type: 'num', fields: [{ pre: '🍓 100×100＝', answer: 10000 }, { pre: '　🍊 100×3＝', answer: 300 }, { pre: '　🍵 3×3＝', answer: 9 }] } },
    { say: '全部加起來，別忘了橘子有<b>兩塊</b>！',
      ask: { type: 'num', q: '10000＋300＋300＋9＝？', fields: [{ answer: 10609, diag: [{ v: 10309, msg: '橘子有<b>兩塊</b>喔！' }, { v: 10009, msg: '漏掉橘子了！🍊🍊' }] }] },
      after: R`\(103^2=10609\)。大數字也能心算！` },
    { say: challenge('想成 20＋1：'),
      ask: { type: 'num', q: R`\(21^2=\)？`, fields: [{ answer: 441, diag: [{ v: 401, msg: '漏掉兩塊橘子 20×1 了！' }] }], hint: '400＋20＋20＋1' } },
    { say: challenge('想成 400＋2：'),
      ask: { type: 'num', q: R`\(402^2=\)？`, fields: [{ answer: 161604, diag: [{ v: 160004, msg: '漏掉兩塊橘子 400×2 了！' }, { v: 160804, msg: '橘子有兩塊：800＋800。' }] }], hint: '160000＋800＋800＋4' } }
  ] };

  /* =========================================================
     第 3 關：被小狗咬掉的巧克力（差的平方）
     ========================================================= */
  const S3 = { id: 's3', badge: '🐶', title: '第 3 關　小狗偷吃巧克力', steps: [
    { say: '糟糕！店裡的小狗 🐶 偷吃巧克力！<br>這片是 5×5，本來有 25 格。',
      scene: (h) => { const c = Choco(h, { rows: 5, cols: 5 }); setTimeout(() => c.eat(cl => cl.r === 0, '🐶'), 500); },
      ask: { type: 'num', q: '小狗咬掉了<b>上面一排</b>，被咬掉幾格？', fields: [{ answer: 5 }] } },
    { say: '小狗又咬掉了<b>右邊一排</b>！看仔細喔……',
      scene: (h, api) => { const c = Choco(h, { rows: 5, cols: 5 }); c.ghost(cl => cl.r === 0); setTimeout(async () => { await c.eat(cl => cl.c === 4, '🐶'); c.flash(cl => cl.r === 0 && cl.c === 4); }, 500); },
      ask: { type: 'choice', q: '右邊這一排，小狗<b>新咬掉</b>的有幾格？', options: [
        { t: '5 格', why: '仔細看<b>右上角</b>那格（會閃的那格），第一次就已經被咬掉了！' },
        { t: '4 格', ok: true, why: '對！右上角那格早就被咬過了，所以只咬到 4 格新的。' }] } },
    { say: '問題來了！如果有人這樣算剩下的：<br>「25 － 5 － 5」',
      scene: (h) => { const c = Choco(h, { rows: 5, cols: 5 }); c.ghost(cl => cl.r === 0 || cl.c === 4); setTimeout(() => c.flash(cl => cl.r === 0 && cl.c === 4), 300); },
      ask: { type: 'choice', q: '這樣算對嗎？', options: [
        { t: '對', why: '右上角那格算了兩次喔！上面那排算一次，右邊那排又算一次。' },
        { t: '不對！右上角那格被扣了<b>兩次</b>，要加回來 1 格', ok: true, why: '太厲害了！所以是 25－5－5＋1。' }] } },
    { say: '數數看，剩下幾格？',
      scene: (h) => { const c = Choco(h, { rows: 5, cols: 5 }); c.ghost(cl => cl.r === 0 || cl.c === 4); c.countMode(); },
      ask: { type: 'num', fields: [{ answer: 16 }] },
      after: R`剩下 16 格，剛好是 4×4 的正方形！<br>25－5－5＋1＝16，也就是 \((5-1)^2=16\)。` },
    { say: '換大一點：7×7 的巧克力，小狗咬掉<b>上面 2 排</b>和<b>右邊 2 排</b>。',
      scene: (h) => { const c = Choco(h, { rows: 7, cols: 7 }); setTimeout(async () => { await c.eat(cl => cl.r < 2, '🐶'); await c.eat(cl => cl.c >= 5, '🐶'); c.flash(cl => cl.r < 2 && cl.c >= 5); }, 400); },
      ask: { type: 'num', fields: [{ pre: '整片原本＝', answer: 49 }, { pre: '　上面 2 排＝', answer: 14 }, { pre: '　右邊 2 排（本來）＝', answer: 14 }], hint: '整片 7×7；上面 2 排是 2×7；右邊 2 排也是 7×2。' } },
    { say: '右上角那塊被咬了兩次（會閃的那塊）。',
      scene: (h) => { const c = Choco(h, { rows: 7, cols: 7 }); c.ghost(cl => cl.r < 2 || cl.c >= 5); setTimeout(() => c.flash(cl => cl.r < 2 && cl.c >= 5), 300); },
      ask: { type: 'num', q: '被咬兩次的角落有幾格？', fields: [{ answer: 4 }] },
      after: '是 2×2 的小正方形。' },
    { say: '所以剩下的是：',
      ask: { type: 'num', q: '49－14－14＋4＝？', fields: [{ answer: 25, diag: [{ v: 17, msg: '被扣兩次的角落要「<b>加回來</b>」喔。' }] }] },
      after: R`剩下 5×5＝25，也就是 \((7-2)^2\)。` },
    { say: '用字母來寫：大正方形邊長 <b>a</b>，小狗咬掉的寬度 <b>b</b>。',
      scene: (h) => { schem(h, 'a', 'b', 'minus'); },
      ask: { type: 'choice', q: R`\((a-b)^2\) 等於？`, options: [
        { t: R`\(a^2-b^2\)`, why: '這樣只扣掉一個小正方形，可是小狗咬掉的是兩排喔。' },
        { t: R`\(a^2-2ab+b^2\)`, ok: true, why: R`扣掉兩排（\(2ab\)），再把多扣的角落加回來（\(b^2\)）。` },
        { t: R`\(a^2-2ab-b^2\)`, why: '角落是被扣了兩次，要<b>加回來</b>，不是再扣一次。' }] },
      after: '這就是<b>差的平方公式</b>：' + formula(R`\((a-b)^2=a^2-2ab+b^2\)`, '記法：🐶 扣兩排，角落加回來') },
    { say: '🎩 <b>魔術時間！</b>\(99^2\) 怎麼心算？<br>想成 100×100 的巧克力，小狗咬掉 1 排和 1 排：',
      scene: (h) => { schem(h, 100, 1, 'minus'); },
      ask: { type: 'num', fields: [{ pre: '整片 100×100＝', answer: 10000 }, { pre: '　一排 100×1＝', answer: 100 }, { pre: '　角落 1×1＝', answer: 1 }] } },
    { say: '扣兩排，角落加回來：',
      ask: { type: 'num', q: '10000－100－100＋1＝？', fields: [{ answer: 9801, diag: [{ v: 9799, msg: '角落要「加回來」，是＋1。' }, { v: 9900, msg: '要扣<b>兩</b>排喔！' }] }] },
      after: R`\(99^2=9801\)！` },
    { say: challenge('小數也可以！想成 10 − 0.1：'),
      ask: { type: 'num', q: R`\(9.9^2=\)？`, fields: [{ answer: 98.01, diag: [{ v: 97.99, msg: '角落 0.1×0.1＝0.01 要「加回來」。' }] }], hint: '整片 100，一排 10×0.1＝1，兩排共 2；角落 0.1×0.1＝0.01。100－2＋0.01' } },
    { say: challenge('剛剛算出 9.9²＝98.01。'),
      ask: { type: 'num', q: R`最接近 \(9.9^2\) 的整數是多少？`, fields: [{ answer: 98 }] } }
  ] };

  /* =========================================================
     第 4 關：老鼠挖洞，拼成長方形（平方差）
     ========================================================= */
  const S4 = { id: 's4', badge: '🐭', title: '第 4 關　老鼠挖洞', steps: [
    { say: '這次換老鼠 🐭！牠在 5×5 巧克力的<b>右下角</b>挖走了一塊 2×2。',
      scene: (h) => { const c = Choco(h, { rows: 5, cols: 5 }); setTimeout(() => c.eat(cl => cl.r >= 3 && cl.c >= 3, '🐭'), 500); },
      ask: { type: 'num', q: '剩下幾格？', fields: [{ answer: 21 }], hint: '原本 25 格，被挖走 2×2＝4 格。' } },
    { say: '可可貓不想浪費，想把剩下的巧克力<b>重新拼成一個長方形</b>，比較好賣。',
      scene: (h, api) => {
        const c = Choco(h, { rows: 5, cols: 5, extraW: 2 * 40, cell: 40 });
        c.ghost(cl => cl.r >= 3 && cl.c >= 3);
        c.paint(3, 0, 5, 3, 'orange');
        const moving = c.cells.filter(cl => cl.r >= 3 && cl.c < 3);
        let moved = false;
        moving.forEach(cl => {
          cl.g.classList.add('tappable');
          cl.g.addEventListener('click', () => {
            if (moved) return;
            moved = true;
            moving.forEach((m, i) => setTimeout(() => {
              const nr = m.c, nc = 5 + (m.r - 3);
              c.shift(x => x === m, (nc - m.c) * c.S, (nr - m.r) * c.S);
            }, i * 120));
            setTimeout(() => { c.ghost(x => x.r >= 3 && x.c >= 3); api.done(); }, moving.length * 120 + 500);
          });
        });
      },
      ask: { type: 'action', text: '點一下<b>橘色那塊</b>，看它跑去哪裡！' },
      after: '變成一個長方形了！✨' },
    { say: '量量看這個新的長方形：',
      scene: (h) => {
        const c = Choco(h, { rows: 5, cols: 5, extraW: 2 * 40, cell: 40 });
        c.paint(3, 0, 5, 3, 'orange');
        c.cells.forEach(m => { if (m.r >= 3 && m.c < 3) c.shift(x => x === m, (5 + m.r - 3 - m.c) * c.S, (m.c - m.r) * c.S); });
        c.ghost(x => x.r >= 3 && x.c >= 3);
        c.ruler('top', 0, 7, '長'); c.ruler('left', 0, 3, '寬');
      },
      ask: { type: 'num', fields: [{ pre: '長幾格？', answer: 7 }, { pre: '　寬幾格？', answer: 3 }] },
      after: '7×3＝21，跟剛剛一樣！' },
    { say: '仔細看這些數字：原本的正方形是 <b>5</b>，挖掉的是 <b>2</b>；新的長方形是 <b>7</b> 和 <b>3</b>。',
      ask: { type: 'choice', q: '7 和 3，跟 5 和 2 有什麼關係？', options: [
        { t: '7＝5＋2，3＝5－2', ok: true, why: '發現了！長是「加」，寬是「減」。' },
        { t: '7＝5×2－3', why: '想簡單一點：試試 5 和 2 相加、相減。' },
        { t: '沒有關係', why: '看看 5＋2＝？5－2＝？' }] },
      after: R`所以 \((5+2)\times(5-2)=5^2-2^2\)，也就是 7×3＝25－4＝21。` },
    { say: '用字母寫：大正方形邊長 <b>a</b>，挖掉的小正方形邊長 <b>b</b>。',
      ask: { type: 'choice', q: R`\((a+b)(a-b)=\)？`, options: [
        { t: R`\(a^2-b^2\)`, ok: true, why: R`大正方形 \(a^2\) 挖掉小正方形 \(b^2\)，剛好拼成長 \(a+b\)、寬 \(a-b\) 的長方形！` },
        { t: R`\(a^2+b^2\)`, why: '小正方形是被挖掉的，要減。' },
        { t: R`\(a^2-2ab+b^2\)`, why: R`那是小狗咬兩排的 \((a-b)^2\)，不一樣喔。` }] },
      after: '這就是<b>平方差公式</b>：' + formula(R`\((a+b)(a-b)=a^2-b^2\)`, '記法：🐭 挖一角，拼成長方形') },
    { say: '🎩 <b>魔術時間！</b>朋友說「51×49」，怎麼秒算？<br>51 和 49 的<b>正中間</b>是誰？一個多一點、一個少一點。',
      ask: { type: 'num', fields: [{ pre: '正中間＝', answer: 50 }, { pre: '　各差＝', answer: 1 }], hint: '50 在 49 和 51 的正中間。' } },
    { say: '所以 51×49＝(50＋1)(50－1)：',
      ask: { type: 'num', q: R`\(50^2-1^2=2500-1=\)？`, fields: [{ answer: 2499, diag: [{ v: 2501, msg: '平方差是「減」喔。' }] }] },
      after: '51×49＝2499，只比 2500 少 1！' },
    { say: challenge('找正中間：'),
      ask: { type: 'num', q: R`\(102\times98=\)？`, fields: [{ answer: 9996, diag: [{ v: 10004, msg: '平方差是「減」：10000－4。' }] }], hint: '正中間是 100，各差 2：100²－2²＝10000－4。' } },
    { say: challenge('倒過來用：看到「平方 − 平方」，就變成「相加 × 相減」。'),
      ask: { type: 'num', q: R`\(6^2-4^2=(6+4)\times(6-4)=\)？`, fields: [{ answer: 20 }] },
      after: '驗算：36－16＝20 ✔' },
    { say: challenge('大數字也一樣：'),
      ask: { type: 'num', q: R`\(56^2-44^2=\)？`, fields: [{ answer: 1200 }], hint: '(56＋44)×(56－44)＝100×12' } }
  ] };

  /* =========================================================
     第 5 關：拼圖偵探（反過來認公式）
     ========================================================= */
  const S5 = { id: 's5', badge: '🧩', title: '第 5 關　拼圖偵探', steps: [
    { say: '可可貓把一片正方形巧克力摔碎了！😱<br>地上有：1 塊草莓、2 塊橘子、1 塊抹茶。',
      scene: (h, api) => {
        Puzzle(h, { cols: 6, rows: 10, cell: 40, frame: { x: 1, y: 0.6, w: 4, h: 4 }, pieces: [
          { w: 3, h: 3, flavor: 'berry', label: '3×3', sx: 0.3, sy: 5.5, tx: 1, ty: 0.6 },
          { w: 1, h: 3, flavor: 'orange', sx: 3.8, sy: 5.5, tx: 4, ty: 0.6 },
          { w: 3, h: 1, flavor: 'orange', sx: 1.5, sy: 8.8, tx: 1, ty: 3.6 },
          { w: 1, h: 1, flavor: 'matcha', sx: 5, sy: 5.5, tx: 4, ty: 3.6 }
        ] }, () => api.done());
      },
      ask: { type: 'action', text: '用手指把碎片<b>拖</b>進框框，拼回正方形！' },
      after: '拼好了！🎉' },
    { say: '拼好的巧克力是正方形。',
      ask: { type: 'num', q: '它的邊長是幾格？', fields: [{ answer: 4 }] },
      after: R`9＋3＋3＋1＝16＝\(4^2\)＝\((3+1)^2\)。<br>👉 <b>草莓＋兩塊橘子＋抹茶，可以拼回一個正方形！</b>` },
    { say: R`所以看到這種算式：\(3^2+2\times3\times1+1^2\)<br>就知道它是「🍓 草莓＋🍊🍊 兩塊橘子＋🍵 抹茶」！`,
      ask: { type: 'choice', q: '它可以拼成哪個正方形？', options: [
        { t: R`\((3+1)^2\)`, ok: true, why: '邊長 3＋1＝4，答案 16。' },
        { t: R`\((3+2)^2\)`, why: R`抹茶是 \(1^2\)，所以第二段是 1 喔。` },
        { t: R`\(3^2+1^2\)`, why: '這樣只算了草莓和抹茶，沒有拼起來。' }] } },
    { say: R`🕵️ <b>偵探三步驟</b><br>① 找<b>草莓</b>和<b>抹茶</b>：最前面和最後面是誰的平方？<br>② 檢查<b>橘子</b>：中間是不是「2×草莓邊×抹茶邊」？<br>③ <b>拼起來</b>：(草莓邊＋抹茶邊)²`,
      ask: { type: 'num', q: R`偵查這題：\(97^2+2\times97\times3+3^2\)`, fields: [{ pre: '🍓 草莓邊＝', answer: 97 }, { pre: '　🍵 抹茶邊＝', answer: 3 }] },
      after: R`中間是 \(2\times97\times3\)，剛好是「2×草莓邊×抹茶邊」✔` },
    { say: '拼起來！',
      ask: { type: 'num', q: R`\((97+3)^2=\)`, fields: [{ pre: '邊長', answer: 100, post: '²' }, { pre: '　＝', answer: 10000 }] },
      after: '看起來超難的題目，答案是 10000！<br>👉 <b>答案很整齊，通常就代表你用對公式了。</b>' },
    { say: '如果中間是<b>減號</b>呢？那就是被小狗咬過的巧克力：(草莓邊 － 抹茶邊)²。',
      ask: { type: 'num', q: R`\(52^2-2\times52\times2+2^2=(52-2)^2=\)？`, fields: [{ answer: 2500 }] } },
    { say: R`有時候題目會<b>偽裝</b>！🥸<br>\(48^2+48\times4+4\)<br>・最後的 4，其實是 \(2^2\)<br>・中間的 48×4，其實是 2×48×2`,
      ask: { type: 'num', q: R`所以它＝\((48+2)^2=\)？`, fields: [{ answer: 2500 }] } },
    { say: challenge('用偵探三步驟：'),
      ask: { type: 'num', q: R`\(63^2+2\times63\times37+37^2=\)？`, fields: [{ answer: 10000 }], hint: '草莓邊 63、抹茶邊 37，(63＋37)²' } },
    { say: challenge('偽裝題：16＝4²，196×8＝2×196×4'),
      ask: { type: 'num', q: R`\(196^2+196\times8+16=\)？`, fields: [{ answer: 40000 }], hint: '(196＋4)²＝200²' } },
    { say: challenge('小數偽裝題：9＝3²，6×3.01＝2×3×3.01，中間是減號'),
      ask: { type: 'num', q: R`\(3.01^2-6\times3.01+9=\)？`, fields: [{ answer: 0.0001, diag: [{ v: 0.001, msg: '0.01×0.01：1×1＝1，小數點後面要有 2＋2＝4 位 → 0.0001。' }] }], hint: '(3.01－3)²＝0.01²' } }
  ] };

  /* =========================================================
     第 6 關：可可貓的魔術秀（代數變形、圖形應用、估算）
     ========================================================= */
  const S6 = { id: 's6', badge: '🎩', title: '第 6 關　可可貓的魔術秀', steps: [
    { say: '可可貓想了兩個<b>祕密數字</b>，只給你兩個線索：<br>・兩個數<b>加起來是 5</b><br>・兩個數<b>乘起來是 6</b>',
      ask: { type: 'choice', q: '你猜是哪兩個數？', options: [
        { t: '1 和 4', why: '1×4＝4，不是 6。' },
        { t: '2 和 3', ok: true, why: '2＋3＝5，2×3＝6！' },
        { t: '5 和 1', why: '5＋1＝6，不是 5。' }] } },
    { say: '那它們的平方加起來是多少？',
      ask: { type: 'num', q: R`\(2^2+3^2=\)？`, fields: [{ answer: 13 }] } },
    { say: '可是如果數字很難猜呢？可可貓用巧克力變魔術！🎩<br>拿一片 (2＋3)×(2＋3)，也就是 5×5 的巧克力，切成 4 塊：',
      scene: (h) => { cutGrid(h, 5, 2); },
      ask: { type: 'num', q: '兩塊橘子，每塊是 2×3＝？', fields: [{ answer: 6 }] } },
    { say: '把兩塊橘子吃掉！😋',
      scene: (h) => { const c = cutGrid(h, 5, 2); setTimeout(() => c.eat(cl => (cl.r < 2) !== (cl.c < 2), '🐱'), 600); },
      ask: { type: 'num', q: '剩下的草莓＋抹茶＝25－6－6＝？', fields: [{ answer: 13 }] },
      after: R`跟剛剛 \(2^2+3^2=13\) 一樣！<br>👉 不用知道是哪兩個數：<b>整片 \((a+b)^2\) 減掉兩塊橘子 \(2ab\)</b>，就剩下 \(a^2+b^2\)。` + formula(R`\(a^2+b^2=(a+b)^2-2ab\)`) },
    { say: '換你變魔術：兩個數<b>加起來是 7</b>，<b>乘起來是 10</b>。',
      ask: { type: 'num', q: R`\(a^2+b^2=7^2-2\times10=\)？`, fields: [{ answer: 29, diag: [{ v: 69, msg: '兩塊橘子是被吃掉的，要「減」。' }, { v: 39, msg: '橘子有<b>兩塊</b>：2×10＝20。' }] }] },
      after: '（偷偷告訴你，是 2 和 5：4＋25＝29 ✔）' },
    { say: '🖼️ <b>巧克力相框</b><br>可可貓用一片 7×7 的巧克力，把中間 5×5 挖掉，放進一張照片。',
      scene: (h) => { const c = Choco(h, { rows: 7, cols: 7 }); c.ghost(cl => cl.r >= 1 && cl.r <= 5 && cl.c >= 1 && cl.c <= 5); c.label(1, 1, 6, 6, '🖼️', { size: 40 }); },
      ask: { type: 'num', q: '相框用了幾格巧克力？', fields: [{ answer: 24 }], hint: R`大正方形減小正方形：49－25。也可以用老鼠的招：(7＋5)×(7－5)。` },
      after: R`\(7^2-5^2=(7+5)(7-5)=12\times2=24\)。<br>👉 遇到奇怪形狀，先想「<b>大的減小的</b>」！` },
    { say: '🔍 <b>差一點點</b><br>4.9 只比 5 少一點點。',
      scene: (h) => { schem(h, 5, 0.1, 'minus'); },
      ask: { type: 'choice', q: R`\(4.9^2\) 比 25 大還是小？`, options: [
        { t: '比 25 小一點', ok: true, why: '邊長短了一點點，正方形當然小一點。' },
        { t: '比 25 大', why: '邊長變短，面積會變小喔。' },
        { t: '剛好 25', why: '差一點點也是差！' }] } },
    { say: '算出準確的答案：',
      ask: { type: 'num', q: R`\(4.9^2=(5-0.1)^2=25-1+0.01=\)？`, fields: [{ answer: 24.01, diag: [{ v: 23.99, msg: '角落 0.01 要「加回來」。' }] }], hint: '兩排各 5×0.1＝0.5，共 1；角落 0.1×0.1＝0.01。' },
      after: '最接近的整數是 24。這就是「估算」題的祕訣。' },
    { say: challenge('祕密數字魔術：'),
      ask: { type: 'num', q: R`已知 \(a+b=9\)，\(ab=14\)，求 \(a^2+b^2\)。`, fields: [{ answer: 53, diag: [{ v: 109, msg: '兩塊橘子要減掉。' }, { v: 67, msg: '橘子有兩塊：2×14＝28。' }] }], hint: '81－28' } },
    { say: challenge('一塊邊長 10 公尺的正方形土地，沿著上面和右邊開一條 1 公尺寬的 L 型道路（就像小狗咬掉上面一排、右邊一排）。'),
      ask: { type: 'num', q: '剩下的土地有幾平方公尺？', fields: [{ answer: 81, diag: [{ v: 80, msg: '轉角那 1×1 被扣了兩次，要加回來！' }] }], hint: '剩下的是邊長 10－1＝9 的正方形。' } }
  ] };

  /* ---------- 補圖：每一步只要問題跟圖有關，就一定看得到圖 ---------- */
  function svgBox(h, w, hh) {
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', `0 0 ${w} ${hh}`);
    svg.setAttribute('class', 'choco');
    h.appendChild(Lesson.h('<div class="choco-wrap"></div>')).appendChild(svg);
    return svg;
  }
  const rr = (X, Y, w, hh, fill, t, extra) => `<rect x="${X}" y="${Y}" width="${w}" height="${hh}" rx="8" fill="${fill}" stroke="#5b3a26" stroke-width="2" ${extra || ''}/>` +
    (t ? `<text x="${X + w / 2}" y="${Y + hh / 2}" text-anchor="middle" dominant-baseline="middle" class="region-label" font-size="${Math.min(18, Math.max(12, Math.min(w, hh) / 3))}">${t}</text>` : '');
  const tt = (x, y, s, anchor) => `<text x="${x}" y="${y}" text-anchor="${anchor || 'middle'}" dominant-baseline="middle" class="ruler-t">${s}</text>`;
  // 「假裝多一排再拿掉」：rows 排、每排 cols，最後 extra 排是假裝的
  function schemRows(h, cols, rows, extra) {
    const svg = svgBox(h, 320, 150);
    svg.innerHTML = rr(30, 30, 230, 80, '#8a5a3c', `${rows}×${cols - extra}`) + rr(262, 30, 30, 80, '#e9cfa6', '', 'stroke-dasharray="6 5" fill-opacity=".5"') +
      tt(277, 70, '假裝', 'middle') + tt(30 + 115, 18, `每排 ${cols - extra}`) + tt(277, 18, `+${extra}`) + tt(18, 70, rows, 'middle') + tt(160, 132, `先算 ${rows}×${cols}，再拿掉假裝的 ${rows}×${extra}`);
  }
  // 挖一角 → 拼成長方形
  function schemHole(h, a, b) {
    const svg = svgBox(h, 330, 190);
    const A = 110, B = 40, x = 14, y = 40;
    svg.innerHTML = rr(x, y, A, A - B, '#f28fad', '') + rr(x, y + A - B, A - B, B, '#f6a54b', '') +
      rr(x + A - B, y + A - B, B, B, '#e9cfa6', '', 'stroke-dasharray="5 4" fill-opacity=".3"') +
      tt(x + A / 2, y - 12, a) + tt(x + A - B / 2, y + A - B / 2, `挖${b}`) +
      `<text x="${x + A + 30}" y="${y + A / 2}" font-size="28" text-anchor="middle" dominant-baseline="middle">➜</text>` +
      rr(170, y, A, A - B, '#f28fad', '') + rr(170 + A, y, B, A - B, '#f6a54b', '') +
      tt(170 + (A + B) / 2, y - 12, `${a}＋${b}`) + tt(170 + (A + B) / 2, y + A - B + 18, `寬 ${a}－${b}`);
  }

  const P = (st, i, scene) => { st.steps[i].scene = scene; };
  // 第 1 關
  P(S1, 5, h => { const c = Choco(h, { rows: 6, cols: 13 }); c.paint(0, 10, 6, 13, 'orange'); c.split('v', 10); c.label(0, 0, 6, 10, '60'); c.label(0, 10, 6, 13, '18', { size: 13 }); });
  P(S1, 8, h => { const c = Choco(h, { rows: 4, cols: 10 }); c.paint(0, 9, 4, 10, 'milk'); c.ghost(cl => cl.c === 9); c.label(0, 0, 4, 9, '40－4'); });
  P(S1, 9, h => schemRows(h, 100, 7, 1));
  P(S1, 10, h => schemRows(h, 200, 35, 2));
  // 第 2 關
  P(S2, 6, h => { const c = cutGrid(h, 6, 4); c.label(0, 0, 4, 4, '16'); c.label(4, 4, 6, 6, '4'); c.label(0, 4, 4, 6, '8'); c.label(4, 0, 6, 4, '8'); });
  P(S2, 10, h => schem(h, 100, 3, 'plus'));
  P(S2, 11, h => schem(h, 20, 1, 'plus'));
  P(S2, 12, h => schem(h, 400, 2, 'plus'));
  // 第 3 關
  P(S3, 6, h => { const c = Choco(h, { rows: 7, cols: 7 }); c.ghost(cl => cl.r < 2 || cl.c >= 5); c.paint(0, 5, 2, 7, 'matcha'); c.label(2, 0, 7, 5, '剩下？'); });
  P(S3, 9, h => schem(h, 100, 1, 'minus'));
  P(S3, 10, h => schem(h, 10, 0.1, 'minus'));
  P(S3, 11, h => schem(h, 10, 0.1, 'minus'));
  // 第 4 關
  const rect73 = h => {
    const c = Choco(h, { rows: 5, cols: 5, extraW: 2 * 40, cell: 40 });
    c.paint(3, 0, 5, 3, 'orange');
    c.cells.forEach(m => { if (m.r >= 3 && m.c < 3) c.shift(x => x === m, (5 + m.r - 3 - m.c) * c.S, (m.c - m.r) * c.S); });
    c.ghost(x => x.r >= 3 && x.c >= 3);
    c.ruler('top', 0, 7, '7'); c.ruler('left', 0, 3, '3');
  };
  P(S4, 3, rect73);
  P(S4, 4, h => schemHole(h, 'a', 'b'));
  P(S4, 5, h => schemHole(h, 50, 1));
  P(S4, 6, h => schemHole(h, 50, 1));
  P(S4, 7, h => schemHole(h, 100, 2));
  P(S4, 8, h => schemHole(h, 5, 1));
  P(S4, 9, h => schemHole(h, 50, 6));
  // 第 5 關
  const done44 = h => { const c = cutGrid(h, 4, 3, { cell: 50 }); c.label(0, 0, 3, 3, '3×3'); c.ruler('top', 0, 3, '3'); c.ruler('top', 3, 4, '1', c.S * 0.35); };
  P(S5, 1, done44);
  P(S5, 2, h => { const c = cutGrid(h, 4, 3, { cell: 50 }); c.label(0, 0, 3, 3, '3²'); c.label(3, 3, 4, 4, '1²', { size: 14 }); c.label(0, 3, 3, 4, '3×1', { size: 12 }); c.label(3, 0, 4, 3, '3×1', { size: 12 }); });
  P(S5, 3, h => schem(h, 97, 3, 'plus'));
  P(S5, 4, h => schem(h, 97, 3, 'plus'));
  P(S5, 5, h => schem(h, 52, 2, 'minus'));
  P(S5, 6, h => schem(h, 48, 2, 'plus'));
  P(S5, 7, h => schem(h, 63, 37, 'plus'));
  P(S5, 8, h => schem(h, 196, 4, 'plus'));
  // 第 6 關
  P(S6, 4, h => { const c = cutGrid(h, 7, 2); c.label(0, 0, 2, 2, 'a²', { size: 13 }); c.label(2, 2, 7, 7, 'b²'); c.label(0, 2, 2, 7, '吃掉', { size: 13 }); c.label(2, 0, 7, 2, '吃掉', { size: 12 }); c.ghost(cl => (cl.r < 2) !== (cl.c < 2)); });
  P(S6, 1, h => { const svg = svgBox(h, 300, 150); svg.innerHTML = rr(40, 50, 60, 60, '#f28fad', '2×2') + `<text x="135" y="80" font-size="30" text-anchor="middle" dominant-baseline="middle" class="ruler-t">＋</text>` + rr(170, 20, 90, 90, '#8cc084', '3×3') + tt(150, 135, '兩塊正方形巧克力加起來'); });
  P(S6, 7, h => schem(h, 5, 0.1, 'minus'));
  P(S6, 8, h => { const c = cutGrid(h, 9, 2); c.ghost(cl => (cl.r < 2) !== (cl.c < 2)); c.label(2, 2, 9, 9, 'b²'); c.label(0, 2, 2, 9, '吃掉 ab', { size: 12 }); });
  P(S6, 9, h => { const c = Choco(h, { rows: 10, cols: 10 }); c.ghost(cl => cl.r === 0 || cl.c === 9); c.label(1, 0, 10, 9, '剩下的土地'); c.ruler('top', 0, 10, '10 公尺'); });

  const STAGES = [S1, S2, S3, S4, S5, S6];

  /* ---------- 地圖 ---------- */
  function drawMap() {
    const map = document.getElementById('map');
    const done = Lesson.doneMap();
    map.innerHTML = '';
    STAGES.forEach((st, i) => {
      const got = done[st.id];
      const card = Lesson.h(`<button class="stage-card ${got != null ? 'cleared' : ''}" type="button">
        <span class="sc-badge">${st.badge}</span>
        <span class="sc-title">${st.title}</span>
        <span class="sc-sub">${got != null ? '已完成 ✔' : `${st.steps.length} 小步`}</span></button>`);
      card.addEventListener('click', () => start(st));
      map.appendChild(card);
    });
    const n = Object.keys(done).length;
    document.getElementById('map-status').textContent = `已完成 ${n} / ${STAGES.length} 關`;
  }
  function start(st) {
    const mapSec = document.getElementById('map-sec');
    const playSec = document.getElementById('play');
    mapSec.hidden = true;
    playSec.hidden = false;
    Lesson.play(playSec, st, () => {
      playSec.hidden = true; playSec.innerHTML = '';
      mapSec.hidden = false;
      drawMap();
      mapSec.scrollIntoView({ behavior: 'smooth' });
    });
    playSec.scrollIntoView({ behavior: 'smooth' });
  }

  document.addEventListener('DOMContentLoaded', () => {
    Lesson.setUnit('math8a-1-1');
    window.__STAGES = STAGES; // 供自動測試用
    drawMap();
    document.getElementById('print-btn').addEventListener('click', JH.printSheet);
  });
})();
