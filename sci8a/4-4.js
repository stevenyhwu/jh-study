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
    U.svg(U.card(p, '① 凸透鏡會聚光，凹透鏡讓光散開', '<p>平行光穿過<b>凸透鏡</b>（中間厚）會聚在<b>焦點</b>；穿過<b>凹透鏡</b>（中間薄）會散開。</p>'),
      '0 0 320 110', `<path d="M90 10 Q104 55 90 100 Q76 55 90 10Z" fill="var(--accent-soft)" ${ST}/>` + [30, 55, 80].map(y => `<line x1="10" y1="${y}" x2="90" y2="${y}" stroke="var(--bad)" stroke-width="2"/><line x1="90" y1="${y}" x2="140" y2="${55 + (55 - y) * 0.0}" stroke="var(--bad)" stroke-width="2"/>`).join('') +
        `<path d="M222 10 H238 Q230 55 238 100 H222 Q230 55 222 10Z" fill="var(--accent-soft)" ${ST}/>` + [30, 55, 80].map(y => `<line x1="160" y1="${y}" x2="230" y2="${y}" stroke="var(--bad)" stroke-width="2"/><line x1="230" y1="${y}" x2="310" y2="${y + (y - 55) * 1.2}" stroke="var(--bad)" stroke-width="2"/>`).join(''), '凸透鏡聚光、凹透鏡散光');
    U.card(p, '② 凸透鏡的像，看物體放哪裡', `<table class="sim-table"><thead><tr><th>物體位置</th><th>像</th><th>用途</th></tr></thead><tbody>
      <tr><td>2 倍焦距以外</td><td>倒立、縮小、實像</td><td>相機、眼睛</td></tr><tr><td>剛好 2 倍焦距</td><td>倒立、等大、實像</td><td>影印機</td></tr>
      <tr><td>1～2 倍焦距</td><td>倒立、放大、實像</td><td>投影機</td></tr><tr><td>焦點以內</td><td>正立、放大、虛像</td><td>放大鏡</td></tr></tbody></table>`);
    U.card(p, '③ 凹透鏡：永遠是正立、縮小的虛像', '<p>不管物體放哪裡都一樣。門上的「貓眼」就是用凹透鏡，看得範圍廣。</p>');
    U.card(p, '④ 眼睛與眼鏡', '<p>眼睛的<b>水晶體</b>就是凸透鏡，在<b>視網膜</b>上成倒立縮小的實像（大腦會幫你轉正）。<br><b>近視</b>：像落在視網膜前面 → 戴<b>凹透鏡</b>把光散開一點。<br><b>遠視、老花</b>：像落在後面 → 戴<b>凸透鏡</b>。</p>');
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

  U.run('4-4', ['先猜猜看：放大鏡的祕密', '動手玩：移動蠟燭看像', '收成 4 句話'], { guess, play, know, exam });
})();
