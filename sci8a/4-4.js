/* ===== 理化 4-4 透鏡成像 ===== */
(function () {
  'use strict';
  const U = Unit4, h = U.h;
  const ST = 'stroke="var(--stroke)" stroke-width="1.5"';
  const F = 50, LX = 180, AY = 100, OH = 30;
  // 從 (x1,y1) 往 (x2,y2) 方向延長到 x = xe
  const ext = (x1, y1, x2, y2, xe) => [xe, y1 + (y2 - y1) * (xe - x1) / (x2 - x1)];
  const arrow = (x, top, col, dash) => `<line x1="${x}" y1="${AY}" x2="${x}" y2="${top}" stroke="${col}" stroke-width="4" ${dash ? 'stroke-dasharray="5 4"' : ''}/>
    <path d="M${x - 7} ${top + (top < AY ? 9 : -9)} L${x} ${top} L${x + 7} ${top + (top < AY ? 9 : -9)}" fill="none" stroke="${col}" stroke-width="4" ${dash ? 'stroke-dasharray="5 4"' : ''}/>`;

  function lensSim(host, on) {
    host.appendChild(h('<p class="sim-h">透鏡成像：移動左邊的蠟燭（箭頭），看像在哪裡</p>'));
    const sv = U.svg(host, '0 0 360 200', '', '透鏡成像', 'sim');
    const read = h('<div class="sim-read"></div>');
    let p = 150, kind = 'cx'; const seen = {};
    function draw() {
      const f = kind === 'cx' ? F : -F, ox = LX - p, oy = AY - OH;
      let s = `<line x1="0" y1="${AY}" x2="360" y2="${AY}" stroke="var(--muted)"/>`;
      s += kind === 'cx' ? `<path d="M${LX} 20 Q${LX + 16} ${AY} ${LX} 180 Q${LX - 16} ${AY} ${LX} 20Z" fill="var(--accent-soft)" ${ST}/>`
        : `<path d="M${LX - 10} 20 H${LX + 10} Q${LX + 2} ${AY} ${LX + 10} 180 H${LX - 10} Q${LX - 2} ${AY} ${LX - 10} 20Z" fill="var(--accent-soft)" ${ST}/>`;
      [[-2, '2F'], [-1, 'F'], [1, 'F'], [2, '2F']].forEach(([k, t]) => { s += `<circle cx="${LX + k * F}" cy="${AY}" r="3" fill="var(--stroke)"/><text x="${LX + k * F}" y="${AY + 16}" text-anchor="middle" class="t12">${t}</text>`; });
      s += arrow(ox, oy, 'var(--bad)');
      let desc, key;
      if (kind === 'cx' && p === F) {
        const [x1, y1] = ext(LX, oy, LX + F, AY, 360), [x2, y2] = ext(ox, oy, LX, AY, 360);
        s += `<line x1="${ox}" y1="${oy}" x2="${LX}" y2="${oy}" stroke="#f2a33a" stroke-width="2"/><line x1="${LX}" y1="${oy}" x2="${x1}" y2="${y1}" stroke="#f2a33a" stroke-width="2"/><line x1="${ox}" y1="${oy}" x2="${x2}" y2="${y2}" stroke="#f2a33a" stroke-width="2"/>`;
        desc = '蠟燭剛好在焦點上：光出去後<b>平行</b>，<b>不成像</b>。'; key = 'none';
      } else {
        const q = p * f / (p - f), m = -q / p, ix = LX + q, iy = AY - OH * m, real = q > 0;
        // 光線 1：平行主軸 → 透鏡 → 經過（或好像來自）焦點
        const [x1, y1] = ext(LX, oy, LX + f, AY, 360);
        const [x1b, y1b] = kind === 'cx' ? [x1, y1] : ext(LX + f, AY, LX, oy, 360);
        s += `<line x1="${ox}" y1="${oy}" x2="${LX}" y2="${oy}" stroke="#f2a33a" stroke-width="2"/><line x1="${LX}" y1="${oy}" x2="${x1b}" y2="${y1b}" stroke="#f2a33a" stroke-width="2"/>`;
        // 光線 2：經過透鏡中心直直走
        const [x2, y2] = ext(ox, oy, LX, AY, 360);
        s += `<line x1="${ox}" y1="${oy}" x2="${x2}" y2="${y2}" stroke="#f2a33a" stroke-width="2"/>`;
        if (!real) s += `<line x1="${LX}" y1="${oy}" x2="${ix}" y2="${iy}" stroke="#f2a33a" stroke-dasharray="4 4"/><line x1="${LX}" y1="${AY}" x2="${ix}" y2="${iy}" stroke="#f2a33a" stroke-dasharray="4 4"/>`;
        if (ix > 0 && ix < 360) s += arrow(ix, Math.max(8, Math.min(192, iy)), 'var(--accent)', !real);
        const size = Math.abs(m) > 1.01 ? '放大' : Math.abs(m) < 0.99 ? '縮小' : '一樣大';
        desc = `像：<b>${m < 0 ? '倒立' : '正立'}、${size}的${real ? '實像' : '虛像'}</b>` + (real ? '（可以用紙接到）' : '（紙接不到，要從透鏡看過去）');
        key = kind === 'cc' ? 'concave' : !real ? 'virtual' : size === '放大' ? 'big' : size === '縮小' ? 'small' : 'same';
      }
      seen[key] = 1;
      sv.innerHTML = s;
      read.innerHTML = `${kind === 'cx' ? '凸透鏡' : '凹透鏡'}　蠟燭離透鏡 ${p / F} 倍焦距　→　${desc}`;
    }
    U.chips(host, '透鏡', [{ v: 'cx', t: '凸透鏡（中間厚）' }, { v: 'cc', t: '凹透鏡（中間薄）' }], kind, v => { kind = v; draw(); on(); });
    U.slider(host, '蠟燭到透鏡的距離', { min: 25, max: 175, step: 25, value: p, fmt: v => `${v / F} 倍焦距` }, v => { p = v; draw(); on(); });
    host.appendChild(read); draw();
    return { seen };
  }

  function guess(p, api) {
    U.guess(p, api, [
      { q: '用放大鏡看字，字會放大。把放大鏡慢慢<b>拿遠</b>一點，字會……',
        options: [{ t: '一直越來越大' }, { t: '越來越大，然後變模糊、最後倒過來', ok: true }],
        reveal: '<b>最後會倒過來</b>！同一個透鏡，東西放的位置不同，像就完全不一樣。' },
      { q: '近視的人戴的眼鏡，鏡片是……',
        options: [{ t: '中間厚、邊緣薄（凸透鏡）' }, { t: '中間薄、邊緣厚（凹透鏡）', ok: true }],
        reveal: '<b>凹透鏡</b>。學完這一節你就知道為什麼。' }
    ]);
  }

  function play(p, api) {
    let A;
    const P = U.panes(p, 1);
    const tk = U.tasks(p, api, [
      { text: '凸透鏡：把蠟燭移到<b>很遠</b>（2 倍焦距以外）。', check: () => A.seen.small,
        qs: () => [{ q: '這時的像長怎樣？', options: [{ t: '倒立、縮小的實像', ok: true, why: '<b>相機</b>和<b>眼睛</b>就是這樣：把遠處的大東西，縮小倒立成像在底片或視網膜上。' }, { t: '正立、放大', why: '看藍色的像：是朝上還是朝下？' }] }] },
      { text: '把蠟燭移近到 <b>1～2 倍焦距之間</b>（例如 1.5 倍）。', check: () => A.seen.big,
        qs: () => [{ q: '像變成怎樣？', options: [{ t: '倒立、放大的實像', ok: true, why: '<b>投影機</b>就是這樣：把小小的圖片，放大投到很遠的布幕上（所以投影片要倒著放）。' }, { t: '倒立、縮小', why: '像比蠟燭高還是矮？' }] }] },
      { text: '把蠟燭移到<b>焦點以內</b>（0.5 倍），再換成<b>凹透鏡</b>看看。', check: () => A.seen.virtual && A.seen.concave,
        qs: () => [{ q: '凸透鏡、蠟燭在焦點以內時，像是……', options: [{ t: '正立、放大的虛像', ok: true, why: '這就是<b>放大鏡</b>：東西要放在焦點以內，從透鏡看過去才會放大。' }, { t: '倒立、放大的實像', why: '看藍色的虛線像：朝上還是朝下？' }] },
          { q: '凹透鏡不管蠟燭放哪裡，像都是……', options: [{ t: '正立、縮小的虛像', ok: true, why: '凹透鏡會讓光散開，永遠成正立、縮小的虛像。' }, { t: '倒立、放大的實像', why: '換成凹透鏡，把蠟燭移來移去看看。' }] }] }
    ]);
    A = lensSim(P.list[0], () => tk.check());
    P.end(tk.slot); tk.start();
  }

  function know(p, api) {
    p.appendChild(h('<p class="muted">把剛剛玩到的，收成 4 句話。</p>'));
    U.svg(U.card(p, '① 凸透鏡會聚光，凹透鏡讓光散開', '<p>平行光穿過<b>凸透鏡</b>（中間厚）會聚在<b>焦點</b>；穿過<b>凹透鏡</b>（中間薄）會散開。<br>反過來，從焦點發出的光，穿過凸透鏡會變成<b>平行光</b>（光路可逆）。</p>'),
      '0 0 320 110', `<path d="M90 10 Q104 55 90 100 Q76 55 90 10Z" fill="var(--accent-soft)" ${ST}/>` + [30, 55, 80].map(y => `<line x1="10" y1="${y}" x2="90" y2="${y}" stroke="var(--bad)" stroke-width="2"/><line x1="90" y1="${y}" x2="140" y2="${55 + (55 - y) * 0.0}" stroke="var(--bad)" stroke-width="2"/>`).join('') +
        `<path d="M222 10 H238 Q230 55 238 100 H222 Q230 55 222 10Z" fill="var(--accent-soft)" ${ST}/>` + [30, 55, 80].map(y => `<line x1="160" y1="${y}" x2="230" y2="${y}" stroke="var(--bad)" stroke-width="2"/><line x1="230" y1="${y}" x2="310" y2="${y + (y - 55) * 1.2}" stroke="var(--bad)" stroke-width="2"/>`).join(''), '凸透鏡聚光、凹透鏡散光');
    U.card(p, '② 凸透鏡的像，看物體放哪裡', `<table class="sim-table"><thead><tr><th>物體位置</th><th>像</th><th>用途</th></tr></thead><tbody>
      <tr><td>2 倍焦距以外</td><td>倒立、縮小、實像</td><td>相機、眼睛</td></tr><tr><td>剛好 2 倍焦距</td><td>倒立、等大、實像</td><td>影印機</td></tr>
      <tr><td>1～2 倍焦距</td><td>倒立、放大、實像</td><td>投影機</td></tr><tr><td>焦點以內</td><td>正立、放大、虛像</td><td>放大鏡</td></tr></tbody></table>`);
    U.card(p, '③ 凹透鏡：永遠是正立、縮小的虛像', '<p>不管物體放哪裡都一樣。門上的「貓眼」就是用凹透鏡，看得範圍廣。</p>');
    U.card(p, '④ 眼睛與眼鏡', '<p>眼睛的<b>水晶體</b>就是凸透鏡，在<b>視網膜</b>上成倒立縮小的實像（大腦會幫你轉正）。<br><b>近視</b>：水晶體太凸（焦距太短）或眼球太長，像落在視網膜前面 → 戴<b>凹透鏡</b>把光散開一點。<br><b>遠視、老花</b>：像落在後面 → 戴<b>凸透鏡</b>。</p>');
    const c = h('<div class="card"><h3>✏️ 檢查一下</h3></div>'); p.appendChild(c);
    U.choice(c, { q: '用放大鏡看螞蟻，螞蟻要放在哪裡才會看到正立放大的像？', hint: '看表格最後一列。',
      options: [{ t: '焦點以內', ok: true, why: '焦點以內才是正立、放大的虛像。' }, { t: '2 倍焦距以外', why: '那會是倒立、縮小的像。' }, { t: '剛好在焦點上', why: '在焦點上不成像。' }], onDone() { api.done(); } });
  }

  function exam(p, api) {
    U.exam(p, api, {
      benchLabel: '想試試看？打開透鏡成像',
      bench: host => lensSim(host, () => {}),
      qs: [
        { src: '改寫自 113 年會考',
          q: '一道和主軸<b>平行</b>的光，穿過凸透鏡以後會怎樣？', hint: '看知識卡 ① 的左圖。',
          options: [{ t: '經過另一邊的焦點', ok: true, why: '這是凸透鏡最重要的一條光線：平行主軸 → 折射後通過焦點。' }, { t: '直直穿過，不轉彎', why: '只有經過透鏡「中心」的光才直直走。' },
            { t: '向外散開，好像從焦點出發', why: '那是凹透鏡。' }, { t: '原路反射回來', why: '透鏡是讓光穿過去，不是反射。' }] },
        { src: '改寫自 109 年會考',
          q: '小華把蠟燭放在凸透鏡前 <b>3 倍焦距</b>的地方，移動另一邊的紙屏，紙上出現清楚的像。這個像是……',
          hint: '打開上面的透鏡模擬，把蠟燭拉到 3 倍焦距。',
          options: [{ t: '倒立、縮小的實像', ok: true, why: '2 倍焦距以外：倒立、縮小、實像（相機的情形）。' }, { t: '倒立、放大的實像', why: '要放在 1～2 倍焦距之間才會放大。' },
            { t: '正立、放大的虛像', why: '虛像用紙接不到，題目說紙上有像。' }, { t: '正立、縮小的虛像', why: '那是凹透鏡。' }] },
        { src: '基本題',
          q: '近視的人，遠處的東西成像在視網膜的<b>前面</b>，看不清楚。應該戴什麼眼鏡？',
          hint: '要讓光「晚一點」才聚起來，應該先把光散開還是聚起來？',
          options: [{ t: '凹透鏡', ok: true, why: '凹透鏡先把光散開一點，像就會往後移到視網膜上。' }, { t: '凸透鏡', why: '凸透鏡會讓光更早聚起來，像離視網膜更遠。' }, { t: '平面玻璃', why: '平面玻璃不會改變光的聚散。' }] }
      ]
    });
  }

  /* ---------------- 5 實戰 ---------------- */
  const bench = (inner, h0) => `<line x1="10" y1="${h0}" x2="350" y2="${h0}" stroke="var(--stroke)" stroke-width="3"/>${inner}`;
  const candle = (x, y) => `<rect x="${x - 4}" y="${y - 34}" width="8" height="34" fill="#f6e7c1" stroke="var(--stroke)"/><path d="M${x} ${y - 34} c-5 -7 -2 -12 0 -17 c3 5 5 10 0 17Z" fill="#f6a54b"/>`;
  function zonePic(c) {
    let s = bench('', 110);
    const L = 180, k = 3;   // 每 cm 3 px
    ['甲', '乙', '丙'].forEach((t, i) => { s += `<text x="${L - (25 - i * 10) * k}" y="130" text-anchor="middle" class="t14b">${t}</text>`; });
    ['丁', '戊', '己'].forEach((t, i) => { s += `<text x="${L + (5 + i * 10) * k}" y="130" text-anchor="middle" class="t14b">${t}</text>`; });
    for (let d = -30; d <= 30; d += 10) s += `<line x1="${L + d * k}" y1="112" x2="${L + d * k}" y2="120" stroke="var(--stroke)"/>`;
    s += `<text x="${L + 15}" y="146" class="t12">每格 10 cm</text>` + candle(L - 25 * k, 108) + `<rect x="${L - 3}" y="56" width="6" height="52" fill="var(--accent-soft)" stroke="var(--stroke)"/><rect x="${L + 25 * k - 2}" y="50" width="4" height="58" fill="var(--muted)"/>
      <text x="${L - 25 * k}" y="44" text-anchor="middle" class="t12b">蠟燭</text><text x="${L}" y="44" text-anchor="middle" class="t12b">凸透鏡</text><text x="${L + 25 * k}" y="44" text-anchor="middle" class="t12b">紙屏</text>`;
    U.svg(c, '0 30 360 120', s, '光具座：蠟燭在甲區、凸透鏡、紙屏，每區 10 cm').style.maxWidth = '400px';
  }
  function sixPic(c) {
    U.svg(c, '0 30 360 100', bench(candle(120, 108) + `<rect x="177" y="56" width="6" height="52" fill="var(--line)" stroke="var(--stroke)"/><text x="180" y="50" text-anchor="middle" class="t12b">透鏡？</text>
      <rect x="290" y="50" width="4" height="58" fill="var(--muted)"/><text x="292" y="44" text-anchor="middle" class="t12b">紙屏</text>
      <line x1="120" y1="118" x2="180" y2="118" stroke="var(--stroke)"/><text x="150" y="128" text-anchor="middle" class="t12b">6 cm</text>`, 110), '蠟燭在透鏡左側 6 cm').style.maxWidth = '400px';
  }
  // 113-36 的四張選項圖：P 在透鏡左邊 10 cm；kind 決定光出透鏡後怎麼走
  const ray = kind => {
    const Lx = 110, A = 45, P = 70, k = 4;
    let s = `<svg viewBox="0 0 220 96" width="210" height="92" style="display:block"><line x1="10" y1="${A}" x2="215" y2="${A}" stroke="currentColor" stroke-width=".8"/>
      <rect x="${Lx - 4}" y="12" width="8" height="66" fill="#bcc8d8" stroke="currentColor" stroke-width=".8"/><circle cx="${P}" cy="${A}" r="2.5" fill="currentColor"/><text x="${P - 4}" y="${A + 14}" font-size="10" fill="currentColor">P</text>`;
    [-22, 0, 22].forEach(dy => {
      s += `<line x1="${P}" y1="${A}" x2="${Lx}" y2="${A + dy}" stroke="#d64545" stroke-width="1.6"/>`;
      if (kind === 'B') s += `<line x1="${Lx}" y1="${A + dy}" x2="212" y2="${A + dy}" stroke="#d64545" stroke-width="1.6"/>`;
      if (kind === 'A') { const vx = Lx - 20 * k; s += `<line x1="${Lx}" y1="${A + dy}" x2="212" y2="${A + dy + dy * (212 - Lx) / (Lx - vx)}" stroke="#d64545" stroke-width="1.6"/><line x1="${vx}" y1="${A}" x2="${Lx}" y2="${A + dy}" stroke="#d64545" stroke-dasharray="2 2"/>`; }
      if (kind === 'C' || kind === 'D') { const fx = Lx + (kind === 'C' ? 20 : 10) * k, ex = 212; s += `<line x1="${Lx}" y1="${A + dy}" x2="${ex}" y2="${A + dy - dy * (ex - Lx) / (fx - Lx)}" stroke="#d64545" stroke-width="1.6"/>`; }
    });
    const bar = { A: [[30, 70, '10 cm'], [70, 110, '10 cm']], B: [[70, 110, '10 cm']], C: [[70, 110, '10 cm'], [110, 190, '20 cm']], D: [[70, 110, '10 cm'], [110, 150, '10 cm']] }[kind];
    bar.forEach(([a, b, t]) => { s += `<line x1="${a}" y1="88" x2="${b}" y2="88" stroke="currentColor"/><line x1="${a}" y1="84" x2="${a}" y2="92" stroke="currentColor"/><line x1="${b}" y1="84" x2="${b}" y2="92" stroke="currentColor"/><text x="${(a + b) / 2}" y="84" text-anchor="middle" font-size="9" fill="currentColor">${t}</text>`; });
    return s + '</svg>';
  };
  function myopiaPic(c) {
    const row = (y, items, label) => { let s = `<line x1="20" y1="${y}" x2="230" y2="${y}" stroke="var(--muted)" stroke-dasharray="3 3"/>` + candle(40, y + 14).replace(/y="(\d+)/, 'y="$1'); items.forEach(([x, t, k]) => { s += k === 'cx' ? `<ellipse cx="${x}" cy="${y}" rx="5" ry="20" fill="var(--accent-soft)" stroke="var(--stroke)"/>` : `<path d="M${x - 6} ${y - 20} H${x + 6} Q${x} ${y} ${x + 6} ${y + 20} H${x - 6} Q${x} ${y} ${x - 6} ${y - 20}Z" fill="var(--accent-soft)" stroke="var(--stroke)"/>`; s += `<text x="${x}" y="${y - 24}" text-anchor="middle" class="t12b">${t}</text>`; }); return s + `<rect x="210" y="${y - 22}" width="4" height="44" fill="var(--muted)"/><text x="240" y="${y + 4}" class="t12">${label}</text>`; };
    U.svg(c, '0 0 330 200', row(40, [[140, '甲', 'cx']], '步驟 1') + row(105, [[140, '乙', 'cc']], '步驟 2') + row(170, [[95, '丙', 'cc'], [140, '乙', 'cc']], '步驟 3'), '近視眼模擬實驗的三個步驟').style.maxWidth = '380px';
  }
  function real(p, api) {
    U.real(p, api, [
      { stars: 2, src: '107 年會考第 43 題', pic: zonePic,
        q: '小芸作凸透鏡成像觀察的實驗裝置如圖，凸透鏡的焦距為 10 cm。她將原本擺放在甲區的蠟燭，移至<b>丙區</b>的位置，若她想觀察移動位置後蠟燭所成的像，則以下列哪一個方式進行最可能達成目的？',
        options: [{ t: '將紙屏移動至丁區，找尋蠟燭所成的像', why: '丙區在焦點以內，成的是虛像，紙屏接不到。' }, { t: '將紙屏移動至己區，找尋蠟燭所成的像', why: '虛像用紙屏接不到，放哪裡都一樣。' },
          { t: '將紙屏移動至甲區或乙區，找尋蠟燭所成的像', why: '虛像雖然在蠟燭那一側，但它不是真的光聚成的，紙屏接不到。' }, { t: '移除紙屏，由丁區、戊區或己區以眼睛透過透鏡觀察蠟燭所成的像', ok: true, why: '焦點以內成正立放大的虛像，要從另一側透過透鏡看（就像用放大鏡）。' }],
        steps: [{ q: '丙區離透鏡 0～10 cm。焦距 10 cm，所以蠟燭在焦點的……', options: [{ t: '以內', ok: true, why: '比焦距還近。' }, { t: '以外', why: '0～10 cm 比 10 cm 近。' }] },
          { q: '凸透鏡，物體在焦點以內，會成什麼像？', options: [{ t: '正立、放大的虛像', ok: true, why: '就是放大鏡的情形。' }, { t: '倒立、放大的實像', why: '那是在 1～2 倍焦距之間。' }] },
          { q: '虛像能用紙屏接到嗎？', options: [{ t: '不能，要用眼睛從另一側透過透鏡看', ok: true, why: '虛像不是光真的聚在那裡。' }, { t: '能，只要找對位置', why: '虛像是眼睛「以為」光從那裡來，不是光真的聚在那裡。' }] }],
        explain: '<p>焦距 10 cm，丙區（0～10 cm）在<b>焦點以內</b> → 正立放大<b>虛像</b>，紙屏接不到，要移除紙屏，從透鏡另一側（丁、戊、己區）用眼睛看。</p>' },
      { stars: 2, src: '109 年會考第 42 題', pic: sixPic,
        q: '小華從凸透鏡與凹透鏡中任意選擇一個透鏡，利用選擇的透鏡進行透鏡成像實驗，將蠟燭放在距離透鏡左側 6 cm 處，如圖所示，他無論如何調整紙屏的位置，都無法清晰成像於紙屏上，改以眼睛由紙屏端經透鏡望向蠟燭，觀察到<b>正立縮小</b>的蠟燭像。若仍使用此透鏡，且將蠟燭移動至距離透鏡左側 13 cm 處，則此時所觀察到的蠟燭像其性質應屬於下列何者？',
        options: [{ t: '正立縮小的像', ok: true, why: '這是凹透鏡，不管蠟燭放哪裡，都是正立縮小的虛像。' }, { t: '正立放大的像', why: '凹透鏡不會成放大的像。' }, { t: '倒立縮小的像', why: '凹透鏡不會成倒立的實像。' }, { t: '倒立放大的像', why: '凹透鏡不會成倒立的實像。' }],
        steps: [{ q: '紙屏接不到、從透鏡看到「正立縮小」的像。小華選的是哪一種透鏡？', options: [{ t: '凹透鏡', ok: true, why: '凸透鏡的虛像是「放大」的；正立縮小的虛像只有凹透鏡會成。' }, { t: '凸透鏡', why: '凸透鏡成虛像時是正立「放大」，不是縮小。' }] },
          { q: '凹透鏡不管物體放在哪裡，成的像都是……', options: [{ t: '正立、縮小的虛像', ok: true, why: '對，和距離無關。' }, { t: '看距離而定', why: '凸透鏡才要看距離。' }] }],
        explain: '<p>由「正立縮小」判斷是<b>凹透鏡</b>。凹透鏡無論物距多少，都成<b>正立縮小虛像</b>，所以蠟燭移到 13 cm 還是正立縮小。</p>' },
      { stars: 3, src: '113 年會考第 36 題',
        q: '已知下列各選項的示意圖，表示由透鏡主軸上 P 點發射的光線，經過透鏡後的偏折情形，則哪一個選項中透鏡的焦距最可能為 10 cm？',
        options: [{ t: ray('A'), why: '光出去後好像從左邊 20 cm 的地方散出來，這個透鏡的焦距是 20 cm（P 在焦點以內）。' }, { t: ray('B'), ok: true, why: 'P 離透鏡 10 cm，光出去變成平行光 → P 就在焦點上，焦距 10 cm。' },
          { t: ray('C'), why: '光聚在右邊 20 cm，焦距比 10 cm 短。' }, { t: ray('D'), why: '光聚在右邊 10 cm，焦距更短（約 5 cm）。' }],
        steps: [{ q: '從凸透鏡的「焦點」發出的光，穿過透鏡後會怎樣？', options: [{ t: '變成平行光', ok: true, why: '平行光會聚到焦點；反過來，從焦點出發的光會變平行（光路可逆）。' }, { t: '聚到另一邊的焦點', why: '那是平行光射進來時的走法。' }, { t: '散開', why: '從焦點出發的光經凸透鏡會變平行。' }] },
          { q: '四張圖的 P 都離透鏡 10 cm。焦距 10 cm 時，P 剛好在焦點上，光出去應該……', options: [{ t: '平行', ok: true, why: '找光出透鏡後變平行的那一張。' }, { t: '聚在 10 cm 處', why: 'P 在焦點上時，出去的光是平行的。' }] }],
        explain: '<p>光路可逆：平行光 → 會聚到焦點；從<b>焦點發出</b>的光 → 經凸透鏡變<b>平行光</b>。(B) 的 P 在 10 cm，出去平行，所以焦距 10 cm。</p>' },
      { stars: 3, src: '105 年會考第 43 題', pic: myopiaPic,
        q: `智新設計實驗來模擬近視眼及其矯正後的情形，步驟如圖（此實驗設計有一個錯誤）：<br>
          步驟 1：模擬正常視力眼睛的成像情形：以凸透鏡甲表示水晶體，屏幕表示視網膜，調整適當位置使其在屏幕上成像清晰。<br>
          步驟 2：模擬近視眼的成像情形：在凸透鏡甲的位置改放凹透鏡乙，表示近視眼睛的水晶體，凹透鏡乙與凸透鏡甲的焦距相同，屏幕上成像模糊。<br>
          步驟 3：模擬矯正近視眼：挑選適當的凹透鏡丙，表示矯正用的近視眼鏡，放置在凹透鏡乙與蠟燭之間的固定位置，使其在屏幕上成像清晰。<br>關於修正此錯誤的方式，下列何者最適當？`,
        options: [{ t: '將實驗中的凹透鏡乙改為焦距較甲短的凸透鏡', ok: true, why: '近視眼的水晶體還是凸透鏡，只是太凸、焦距太短。' }, { t: '將實驗中的凹透鏡乙改為焦距較甲長的凸透鏡', why: '焦距較長，像會落在視網膜「後面」，那是遠視。' },
          { t: '將步驟 3 中的凹透鏡丙改為適當焦距的凸透鏡', why: '近視要用凹透鏡矯正，步驟 3 本身沒有錯。' }, { t: '將步驟 3 中的凹透鏡丙改放置在凹透鏡乙與屏幕之間', why: '眼鏡戴在眼睛前面，丙放在乙和蠟燭之間沒有錯。' }],
        steps: [{ q: '水晶體是哪一種透鏡？', options: [{ t: '凸透鏡', ok: true, why: '水晶體會把光聚在視網膜上，是凸透鏡。近視眼的水晶體也還是凸透鏡。' }, { t: '凹透鏡', why: '凹透鏡會讓光散開，沒辦法在視網膜上成像。' }] },
          { q: '近視眼是像落在視網膜的前面。所以近視眼的水晶體，焦距比正常的……', options: [{ t: '短（太凸，太早聚焦）', ok: true, why: '光太早聚起來，像落在視網膜前。' }, { t: '長', why: '焦距長會讓像落在視網膜後面，那是遠視。' }] },
          { q: '所以步驟 2 的錯誤在哪裡？', options: [{ t: '不該用凹透鏡乙，要用焦距比甲短的凸透鏡', ok: true, why: '這樣才是模擬近視的水晶體。' }, { t: '步驟 3 的眼鏡用錯了', why: '近視用凹透鏡矯正是對的。' }] }],
        explain: '<p>近視：水晶體（凸透鏡）<b>太凸、焦距太短</b>，像落在視網膜前。所以步驟 2 應該用<b>焦距較短的凸透鏡</b>模擬；矯正時在前面加凹透鏡，讓光先散開一點，像才會後移到視網膜上。</p>' }
    ]);
  }

  U.run('4-4', ['先猜猜看：放大鏡的祕密', '動手玩：移動蠟燭看像', '收成 4 句話'], { guess, play, know, exam, real });
})();
