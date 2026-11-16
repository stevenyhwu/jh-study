/* ===== 理化 6-5 分子與化學式 ===== */
(function () {
  'use strict';
  const U = Unit4, h = U.h;
  const AT = { H: ['#f5f5f5', 9, '氫'], O: ['#e53935', 13, '氧'], C: ['#333', 13, '碳'], N: ['#1e88e5', 13, '氮'] };
  // 每個分子：[名稱, 化學式 HTML, [[原子, x, y], ...]]（座標以 0,0 為中心）
  const MOL = {
    H2O: ['水', 'H<sub>2</sub>O', [['O', 0, 0], ['H', -16, 13], ['H', 16, 13]]],
    H2O2: ['雙氧水（過氧化氫）', 'H<sub>2</sub>O<sub>2</sub>', [['O', -11, 0], ['O', 11, 0], ['H', -26, 12], ['H', 26, -12]]],
    O2: ['氧氣', 'O<sub>2</sub>', [['O', -11, 0], ['O', 11, 0]]],
    CO2: ['二氧化碳', 'CO<sub>2</sub>', [['O', -22, 0], ['C', 0, 0], ['O', 22, 0]]],
    CH4: ['甲烷（天然氣）', 'CH<sub>4</sub>', [['C', 0, 0], ['H', -15, -12], ['H', 15, -12], ['H', -15, 12], ['H', 15, 12]]],
    NH3: ['氨', 'NH<sub>3</sub>', [['N', 0, 0], ['H', -16, 10], ['H', 16, 10], ['H', 0, -18]]]
  };
  const ball = (atoms, cx, cy, k) => atoms.slice().sort((a, b) => AT[a[0]][1] - AT[b[0]][1]).reverse()
    .map(([e, x, y]) => `<circle cx="${cx + x * k}" cy="${cy + y * k}" r="${AT[e][1] * k}" fill="${AT[e][0]}" stroke="#555" stroke-width="1.2"/>`).join('');
  const count = atoms => { const c = {}; atoms.forEach(([e]) => { c[e] = (c[e] || 0) + 1; }); return c; };

  function molSim(host, on) {
    host.appendChild(h('<p class="sim-h">分子模型：選一種物質，看它的分子長怎樣</p>'));
    let k = 'H2O'; const seen = { H2O: 1 };
    U.chips(host, '物質', Object.keys(MOL).map(v => ({ v, t: MOL[v][0].split('（')[0] })), k, v => { k = v; seen[v] = 1; draw(); on(); });
    const sv = U.svg(host, '0 0 360 150', '', '分子模型', 'sim');
    const read = h('<div class="sim-read"></div>');
    host.appendChild(read);
    function draw() {
      const [nm, f, atoms] = MOL[k], c = count(atoms);
      let s = ball(atoms, 110, 75, 2);
      let lx = 240; Object.keys(c).forEach((e, i) => { s += `<circle cx="${lx}" cy="${40 + i * 30}" r="${AT[e][1] * 0.8}" fill="${AT[e][0]}" stroke="#555"/><text x="${lx + 18}" y="${45 + i * 30}" class="t14b">${AT[e][2]} × ${c[e]}</text>`; });
      sv.innerHTML = s;
      read.innerHTML = `<b>${nm}</b>　化學式：<b style="font-size:20px">${f}</b>　一個分子裡有 ${Object.keys(c).map(e => `${c[e]} 個 ${e}`).join('、')}，共 <b>${atoms.length}</b> 個原子`;
    }
    draw();
    return { seen };
  }

  function guess(p, api) {
    U.guess(p, api, [
      { q: '水是 H₂O，雙氧水是 H₂O₂。都是氫和氧組成的，它們是同一種東西嗎？',
        options: [{ t: '是，只是寫法不同' }, { t: '不是，性質完全不同', ok: true }],
        reveal: '<b>完全不同</b>：水可以喝，雙氧水是消毒用的，不能喝！只差一個氧原子。' },
      { q: '「2H」和「H₂」意思一樣嗎？',
        options: [{ t: '一樣' }, { t: '不一樣', ok: true }],
        reveal: '<b>不一樣</b>。數字寫在哪裡，意思差很多。學完這一節就知道了。' }
    ]);
  }

  function play(p, api) {
    let A;
    const P = U.panes(p, 1);
    const tk = U.tasks(p, api, [
      { text: '先看<b>水</b>，再看<b>雙氧水</b>。', check: () => A.seen.H2O2,
        qs: () => [{ q: '水和雙氧水都由氫和氧組成，為什麼是不同的物質？', options: [{ t: '原子的數目和排法不同，分子就不同', ok: true, why: '<b>分子</b>是保持物質性質的最小粒子。分子不同，物質就不同。' }, { t: '其實是同一種物質', why: '水能喝、雙氧水不能喝，性質不同就是不同物質。' }] }] },
      { text: '看<b>氧氣</b>和<b>甲烷</b>。', check: () => A.seen.O2 && A.seen.CH4,
        qs: () => [{ q: '氧氣分子（O₂）只有氧原子，甲烷分子（CH₄）有碳和氫。它們各是元素還是化合物？', options: [{ t: '氧氣是元素，甲烷是化合物', ok: true, why: '分子裡只有一種原子 → 元素；兩種以上 → 化合物。' }, { t: '兩個都是化合物', why: '氧氣分子裡只有一種原子。' }, { t: '氧氣是化合物，甲烷是元素', why: '反過來了。' }] }] },
      { text: '算算看：葡萄糖的化學式是 C₆H₁₂O₆。', quiet: true, check: () => true,
        qs: () => [{ num: true, q: '一個葡萄糖分子（C₆H₁₂O₆）總共有幾個原子？', post: '個', answer: 24, hint: '6 個 C ＋ 12 個 H ＋ 6 個 O。',
          diag: [{ v: 3, msg: '3 是原子的「種類」（C、H、O）。題目問的是原子總共幾「個」。' }, { v: 432, msg: '是相加：6＋12＋6。' }], why: '6＋12＋6＝24 個原子。' }] }
    ]);
    A = molSim(P.list[0], () => tk.check());
    P.end(tk.slot); tk.start();
  }

  function know(p, api) {
    p.appendChild(h('<p class="muted">把剛剛玩到的，收成 4 句話。</p>'));
    U.svg(U.card(p, '① 分子：保持物質性質的最小粒子', '<p>分子由原子結合而成。水分子再分下去，就變成氫原子和氧原子，不再有水的性質了。</p>'), '0 0 320 90',
      ball(MOL.H2O[2], 80, 45, 2) + '<text x="160" y="50" text-anchor="middle" class="t14b">→</text>' + ball([['O', 0, 0]], 230, 45, 2) + ball([['H', 0, 0]], 275, 30, 2) + ball([['H', 0, 0]], 275, 62, 2), '水分子拆成原子');
    U.card(p, '② 化學式：元素符號 ＋ 右下角的數字', '<p><b>H₂O</b>：一個分子有 2 個 H、1 個 O（1 不寫）。<br><b>CO₂</b>：1 個 C、2 個 O。</p>');
    U.card(p, '③ 前面的數字＝分子的個數', '<p><b>H₂</b>：1 個氫分子（裡面 2 個氫原子）。<br><b>2H</b>：2 個<b>分開的</b>氫原子。<br><b>3H₂O</b>：3 個水分子，共有 6 個 H、3 個 O。</p>');
    U.card(p, '④ 不是每種物質都由分子組成', '<p><b>金屬</b>（Fe、Cu）和<b>惰性氣體</b>（He、Ne）直接用元素符號當化學式。<br>食鹽（NaCl）是由鈉離子和氯離子組成，也不是分子。</p>');
    const c = h('<div class="card"><h3>✏️ 檢查一下</h3></div>'); p.appendChild(c);
    U.choice(c, { q: '「3O₂」代表什麼？', hint: '前面的數字是分子個數，右下角是一個分子裡的原子數。',
      options: [{ t: '3 個氧分子，共 6 個氧原子', ok: true, why: '3 × 2 ＝ 6。' }, { t: '3 個氧原子', why: '右下角的 2 表示每個分子有 2 個氧原子。' }, { t: '2 個氧分子，共 3 個氧原子', why: '前面的 3 是分子個數。' }], onDone() { api.done(); } });
  }

  function exam(p, api) {
    U.exam(p, api, {
      benchLabel: '想試試看？打開分子模型',
      bench: host => molSim(host, () => {}),
      qs: [
        { src: '改寫自 109 年會考',
          q: '樟腦丸的成分「萘」化學式是 C₁₀H₈。下列哪一種物質，所含的<b>原子種類</b>和萘完全相同？', hint: '萘只有哪幾種原子？',
          options: [{ t: 'C₆H₆（苯）', ok: true, why: '萘和苯都只有碳、氫兩種原子。' }, { t: 'CO₂', why: 'CO₂ 有碳和氧，沒有氫。' }, { t: 'CH₂Cl₂', why: '多了氯。' }, { t: 'C₂H₅OH', why: '多了氧。' }] },
        { src: '改寫自 111 年會考',
          q: '蘋果裡的蘋果酸，化學式是 C₄H₆O₅。一個蘋果酸分子有幾種原子、共幾個原子？', hint: '種類：數有幾種元素符號。個數：把右下角的數字加起來。',
          options: [{ t: '3 種，共 15 個', ok: true, why: 'C、H、O 三種；4＋6＋5＝15 個。' }, { t: '3 種，共 3 個', why: '每種原子不只一個，要看右下角的數字。' },
            { t: '15 種，共 15 個', why: '只有 C、H、O 三種元素。' }, { t: '4 種，共 15 個', why: '數數元素符號：C、H、O。' }] },
        { src: '改寫自 108 年會考',
          q: '防蚊液的成分「敵避」化學式是 C₁₂H₁₇NO，熔點 −45 °C、沸點 290 °C。在室溫（25 °C）下，敵避是……', hint: '25 °C 在熔點和沸點之間嗎？由幾種元素組成？',
          options: [{ t: '液態的化合物', ok: true, why: '25 °C 介於 −45 和 290 之間 → 液態；由 C、H、N、O 四種元素組成 → 化合物。' }, { t: '固態的化合物', why: '25 °C 比熔點 −45 °C 高，已經熔化了。' },
            { t: '液態的元素', why: '有四種元素，是化合物。' }, { t: '氣態的化合物', why: '25 °C 比沸點 290 °C 低很多。' }] }
      ]
    });
  }

  U.run('6-5', ['先猜猜看：只差一個原子', '動手玩：分子模型', '收成 4 句話'], { guess, play, know, exam });
})();
