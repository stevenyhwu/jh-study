/* ===== 理化 4-2 光的反射與面鏡成像 ===== */
(function () {
  'use strict';
  const U = Unit4, h = U.h;
  const ST = 'stroke="var(--stroke)" stroke-width="1.5"';
  const RAD = Math.PI / 180;
  const MIRROR_V = x => `<line x1="${x}" y1="14" x2="${x}" y2="186" stroke="#5aa0d8" stroke-width="5"/>` +
    Array.from({ length: 12 }, (_, i) => `<line x1="${x + 3}" y1="${20 + i * 14}" x2="${x + 11}" y2="${12 + i * 14}" stroke="var(--muted)"/>`).join('');

  function reflectSim(host, on) {
    host.appendChild(h('<p class="sim-h">雷射光打在平面鏡上</p>'));
    const sv = U.svg(host, '0 0 360 180', '', '反射定律', 'sim');
    const read = h('<div class="sim-read"></div>');
    let a = 40; const seen = {};
    function draw() {
      const sx = 180 - 140 * Math.sin(a * RAD), sy = 150 - 140 * Math.cos(a * RAD), ex = 180 + 140 * Math.sin(a * RAD);
      sv.innerHTML = `<line x1="40" y1="150" x2="320" y2="150" stroke="#5aa0d8" stroke-width="5"/><rect x="40" y="153" width="280" height="8" fill="var(--line)"/>
        <line x1="180" y1="10" x2="180" y2="150" stroke="var(--muted)" stroke-dasharray="5 4"/><text x="184" y="20" class="t12 mut">法線</text>
        <line x1="${sx}" y1="${sy}" x2="180" y2="150" stroke="var(--bad)" stroke-width="3"/><line x1="180" y1="150" x2="${ex}" y2="${sy}" stroke="var(--bad)" stroke-width="3" stroke-dasharray="1 0"/>
        <rect x="${sx - 14}" y="${sy - 8}" width="22" height="14" rx="3" fill="#333" transform="rotate(${90 - a} ${sx} ${sy})"/>
        <text x="${180 - 40 * Math.sin(a / 2 * RAD)}" y="${150 - 50 * Math.cos(a / 2 * RAD)}" text-anchor="middle" class="t12b">${a}°</text>
        <text x="${180 + 40 * Math.sin(a / 2 * RAD)}" y="${150 - 50 * Math.cos(a / 2 * RAD)}" text-anchor="middle" class="t12b">${a}°</text>`;
      read.innerHTML = `入射角 <b>${a}°</b>　反射角 <b>${a}°</b>（都是和<b>法線</b>的夾角）`;
    }
    U.slider(host, '雷射的角度', { min: 10, max: 80, step: 10, value: a, fmt: v => v + '°' }, v => { a = v; seen[v] = 1; draw(); on(); });
    host.appendChild(read); draw();
    return { n: () => Object.keys(seen).length };
  }

  function planeSim(host, on) {
    host.appendChild(h('<p class="sim-h">站在平面鏡前面，鏡子裡的你在哪裡？</p>'));
    const sv = U.svg(host, '0 0 360 200', '', '平面鏡成像', 'sim');
    const read = h('<div class="sim-read"></div>');
    let d = 90; const seen = {};
    function draw() {
      const ox = 180 - d, ix = 180 + d;
      sv.innerHTML = MIRROR_V(180) + `<text x="${ox}" y="120" text-anchor="middle" font-size="64" font-weight="700" fill="var(--accent)">F</text>
        <text x="${ix}" y="120" text-anchor="middle" font-size="64" font-weight="700" fill="var(--accent)" opacity=".4" transform="translate(${2 * ix} 0) scale(-1 1)">F</text>
        <line x1="${ox}" y1="160" x2="180" y2="160" stroke="var(--stroke)"/><line x1="180" y1="160" x2="${ix}" y2="160" stroke="var(--stroke)" stroke-dasharray="4 3"/>
        <text x="${(ox + 180) / 2}" y="178" text-anchor="middle" class="t12b">${d / 3} cm</text><text x="${(ix + 180) / 2}" y="178" text-anchor="middle" class="t12b">${d / 3} cm</text>
        <text x="${ox}" y="196" text-anchor="middle" class="t12">物體</text><text x="${ix}" y="196" text-anchor="middle" class="t12">鏡中的像（虛像）</text>`;
      read.innerHTML = `物體到鏡子 <b>${d / 3} cm</b>　像到鏡子 <b>${d / 3} cm</b>　像：正立、一樣大、<b>左右相反</b>`;
    }
    U.slider(host, '物體到鏡子的距離', { min: 30, max: 150, step: 30, value: d, fmt: v => v / 3 + ' cm' }, v => { d = v; seen.moved = 1; draw(); on(); });
    host.appendChild(read); draw();
    return { seen };
  }

  function curveSim(host, on) {
    host.appendChild(h('<p class="sim-h">平行的光打在三種鏡子上</p>'));
    const sv = U.svg(host, '0 0 360 180', '', '凹面鏡與凸面鏡', 'sim');
    const read = h('<div class="sim-read"></div>');
    let k = 'concave'; const seen = { concave: 1 };
    function draw() {
      let s = '';
      const ys = [-50, -25, 0, 25, 50];
      if (k === 'flat') s += '<line x1="260" y1="20" x2="260" y2="160" stroke="#5aa0d8" stroke-width="5"/>';
      if (k === 'concave') s += '<path d="M250 20 Q290 90 250 160" fill="none" stroke="#5aa0d8" stroke-width="5"/>';
      if (k === 'convex') s += '<path d="M270 20 Q230 90 270 160" fill="none" stroke="#5aa0d8" stroke-width="5"/>';
      ys.forEach(dy => {
        const y = 90 + dy, hx = k === 'flat' ? 260 : k === 'concave' ? 250 + 40 * (1 - (dy / 70) ** 2) * 0.5 + 0 : 270 - 20 * (1 - (dy / 70) ** 2);
        s += `<line x1="20" y1="${y}" x2="${hx}" y2="${y}" stroke="var(--bad)" stroke-width="2"/>`;
        if (k === 'flat') s += `<line x1="${hx}" y1="${y}" x2="120" y2="${y}" stroke="#f2a33a" stroke-width="2" stroke-dasharray="6 3"/>`;
        if (k === 'concave') { const fx = 190, ex = 70, ey = 90 + (90 - y) * (fx - ex) / (hx - fx) ; s += `<line x1="${hx}" y1="${y}" x2="${ex}" y2="${ey}" stroke="#f2a33a" stroke-width="2"/>`; }
        if (k === 'convex') { const fx = 330, ex = 90, ey = y + (y - 90) * (hx - ex) / (fx - hx); s += `<line x1="${hx}" y1="${y}" x2="${ex}" y2="${ey}" stroke="#f2a33a" stroke-width="2"/><line x1="${hx}" y1="${y}" x2="${fx}" y2="90" stroke="#f2a33a" stroke-dasharray="3 4"/>`; }
      });
      if (k === 'concave') s += '<circle cx="190" cy="90" r="4" fill="var(--stroke)"/><text x="190" y="80" text-anchor="middle" class="t12b">焦點</text>';
      sv.innerHTML = s;
      read.innerHTML = { flat: '平面鏡：平行的光反射後<b>還是平行</b>。', concave: '凹面鏡：光反射後<b>聚在一點</b>（焦點）→ 會<b>聚光</b>。', convex: '凸面鏡：光反射後<b>散開</b> → 照得到、看得到的範圍<b>很廣</b>。' }[k];
    }
    U.chips(host, '鏡子', [{ v: 'flat', t: '平面鏡' }, { v: 'concave', t: '凹面鏡' }, { v: 'convex', t: '凸面鏡' }], k, v => { k = v; seen[v] = 1; draw(); on(); });
    host.appendChild(read); draw();
    return { seen };
  }

  function guess(p, api) {
    U.guess(p, api, [
      { q: '照鏡子時舉起<b>右手</b>，鏡子裡的人看起來舉的是……',
        options: [{ t: '他的右手' }, { t: '他的左手', ok: true }],
        reveal: '<b>他的左手</b>。平面鏡的像會左右相反。' },
      { q: '山路轉彎的地方立的那面「圓圓凸凸」的鏡子，為什麼要做成凸的？',
        options: [{ t: '看到的範圍比較大', ok: true }, { t: '看到的東西比較大' }, { t: '比較便宜' }],
        reveal: '<b>看到的範圍比較大</b>。下一步看看光打在不同鏡子上會怎麼走。' }
    ]);
  }

  function play(p, api) {
    let A, B, C;
    const P = U.panes(p, 3);
    const tk = U.tasks(p, api, [
      { text: '拉「雷射的角度」，試 <b>3 種</b>不同的角度。', setup() { P.show(0); }, check: () => A.n() >= 3,
        qs: () => [{ q: '入射角和反射角有什麼關係？', options: [{ t: '永遠一樣大', ok: true, why: '這就是<b>反射定律</b>：入射角＝反射角，兩個角都是和<b>法線</b>（垂直鏡面的線）的夾角。' }, { t: '反射角比較大', why: '看兩個角的度數。' }, { t: '沒有關係', why: '每換一個角度，看看兩邊的數字。' }] }] },
      { text: '換到平面鏡：拉「物體到鏡子的距離」，看鏡中的像。', setup() { P.show(1); }, check: () => B.seen.moved,
        qs: () => [{ q: '物體離鏡子 20 cm，像在哪裡？', options: [{ t: '鏡子後面 20 cm', ok: true, why: '<b>物距＝像距</b>。像其實不在那裡（光沒有真的跑到鏡子後面），所以叫<b>虛像</b>。' }, { t: '鏡子後面 10 cm', why: '看兩邊的距離數字。' }, { t: '就在鏡面上', why: '看像在哪裡：鏡子後面還有一段距離。' }] },
          { q: '鏡中的「F」和原本的有什麼不一樣？', options: [{ t: '左右相反', ok: true, why: '平面鏡成像：正立、等大、<b>左右相反</b>。救護車車頭的字故意反著寫，從前車的後照鏡看就變正的。' }, { t: '上下顛倒', why: 'F 的橫線還是在上面喔。' }, { t: '變小了', why: '平面鏡的像和物體一樣大。' }] }] },
      { text: '換到曲面鏡：比較<b>凹面鏡</b>和<b>凸面鏡</b>。', setup() { P.show(2); }, check: () => C.seen.concave && C.seen.convex,
        qs: () => [{ q: '手電筒、車燈裡面那個亮亮的碗，是哪一種鏡子？', options: [{ t: '凹面鏡', ok: true, why: '凹面鏡會聚光。燈泡放在焦點，反射出去就是一道平行的強光。' }, { t: '凸面鏡', why: '凸面鏡會把光散開。' }] },
          { q: '路口反光鏡、汽車後照鏡是哪一種？', options: [{ t: '凸面鏡', ok: true, why: '凸面鏡讓光散開，<b>看得到的範圍廣</b>，但像比較小。' }, { t: '凹面鏡', why: '凹面鏡是聚光用的。' }] }] }
    ]);
    A = reflectSim(P.list[0], () => tk.check()); B = planeSim(P.list[1], () => tk.check()); C = curveSim(P.list[2], () => tk.check());
    P.end(tk.slot); tk.start();
  }

  function know(p, api) {
    p.appendChild(h('<p class="muted">把剛剛玩到的，收成 4 句話。</p>'));
    reflectSim(U.card(p, '① 反射定律：入射角 ＝ 反射角', '<p>兩個角都從<b>法線</b>（垂直鏡面的虛線）量起。<br>粗糙的表面會把光往四面八方反射（漫反射），所以從哪個角度都看得到。</p>'), () => {});
    planeSim(U.card(p, '② 平面鏡：正立、等大、左右相反的虛像', '<p>像到鏡子的距離 ＝ 物體到鏡子的距離。<br>站在鏡前 1 m，你和你的像相距 2 m。</p>'), () => {});
    U.card(p, '③ 凹面鏡會聚光', '<p>平行光打到凹面鏡，會聚在<b>焦點</b>。<br>用途：手電筒、車燈、太陽能灶、化妝鏡（靠近時看到放大的臉）。</p>');
    U.card(p, '④ 凸面鏡讓光散開，看得廣', '<p>像是正立、<b>縮小</b>的，但看得到的範圍大。<br>用途：路口反光鏡、汽車側後照鏡、商店防盜鏡。</p>');
    const c = h('<div class="card"><h3>✏️ 算一題看看</h3></div>'); p.appendChild(c);
    U.numq(c, { q: '小明站在平面鏡前 <b>1.5 m</b>。他和鏡中的像相距多遠？', post: 'm', answer: 3,
      hint: '像在鏡子後面多遠？再加上小明到鏡子的距離。', diag: [{ v: 1.5, msg: '1.5 m 是像到「鏡子」的距離。要算小明到「像」：1.5＋1.5。' }], why: '1.5 ＋ 1.5 ＝ 3 m。', onDone() { api.done(); } });
  }

  function exam(p, api) {
    U.exam(p, api, {
      benchLabel: '想試試看？打開平面鏡',
      bench: host => planeSim(host, () => {}),
      qs: [
        { src: '改寫自 103 年會考',
          pic: c => { let s = MIRROR_V(200); for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) s += `<rect x="${80 + j * 40}" y="${40 + i * 40}" width="40" height="40" fill="${(i + j) % 2 ? 'var(--card)' : 'var(--bg)'}" ${ST}/>`;
            U.svg(c, '0 0 320 200', s + '<text x="140" y="108" text-anchor="middle" font-size="24">★</text><text x="140" y="190" text-anchor="middle" class="t12">棋盤（鏡子左邊）</text>', '鏡子左邊的棋盤，星星在中間格'); },
          q: '一面平面鏡直立在棋盤右邊，★ 在棋盤正中間那一格，離鏡子 <b>2 格</b>（中心算）。從鏡子裡看，★ 的像在哪裡？',
          hint: '平面鏡：像到鏡子的距離＝物體到鏡子的距離。',
          options: [{ t: '鏡子後面 1 格', why: '像到鏡子的距離要和 ★ 一樣，是 2 格。' }, { t: '鏡子後面 2 格，和 ★ 一樣高', ok: true, why: '像和物體對稱：距離一樣、高度一樣。' },
            { t: '鏡子後面 4 格', why: '4 格是 ★ 到「像」的距離，不是像到鏡子。' }, { t: '就在鏡面上', why: '像在鏡子後面，不在鏡面上。' }] },
        { src: '改寫自 104 年會考',
          q: '你面對鏡子，<b>左手</b>拿紅牌、<b>右手</b>拿綠牌。鏡中的人看起來是用哪一隻手拿紅牌？',
          hint: '鏡中人和你面對面。紅牌在你這邊的左側，鏡中人的那一側是他的哪一隻手？',
          options: [{ t: '他的左手', why: '鏡中人面對你，他的左手在你的右邊。' }, { t: '他的右手', ok: true, why: '紅牌在鏡中還是在你的左側，但鏡中人面對你，那一側是<b>他的右手</b>。這就是左右相反。' }] },
        { src: '基本題',
          q: '彎曲的山路轉角，常立一面鏡子讓駕駛看到對向來車。這面鏡子應該用哪一種？',
          hint: '要看到「範圍廣」。',
          options: [{ t: '平面鏡', why: '平面鏡看到的範圍比較小。' }, { t: '凹面鏡', why: '凹面鏡會聚光，看到的範圍小，遠處的像還會倒過來。' }, { t: '凸面鏡', ok: true, why: '凸面鏡看得到的範圍最廣。' }] }
      ]
    });
  }

  /* ---------------- 5 實戰 ---------------- */
  function boardPic(c) {
    let s = MIRROR_V(200);
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
      s += `<rect x="${110 + j * 30}" y="${30 + i * 30}" width="30" height="30" fill="var(--bg)" stroke="var(--stroke)"/>`;
      s += `<rect x="${206 + j * 30}" y="${30 + i * 30}" width="30" height="30" fill="var(--bg)" stroke="var(--muted)" stroke-dasharray="3 3"/>`;
    }
    s += `<circle cx="110" cy="90" r="11" fill="var(--card)" stroke="var(--stroke)"/><text x="110" y="95" text-anchor="middle" class="t12b">馬</text><text x="96" y="114" class="t12b">甲</text>
      <circle cx="170" cy="60" r="11" fill="var(--card)" stroke="var(--stroke)"/><text x="170" y="65" text-anchor="middle" class="t12b">馬</text><text x="164" y="84" class="t12b">乙</text>
      <path d="M120 85 L160 66" stroke="var(--bad)" stroke-width="2" marker-end="url(#m42)"/><defs><marker id="m42" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8Z" fill="var(--bad)"/></marker></defs>`;
    [['P', 236, 60], ['Q', 296, 60], ['R', 236, 90], ['S', 296, 90]].forEach(([t, x, y]) => { s += `<circle cx="${x}" cy="${y}" r="3.5" fill="var(--stroke)"/><text x="${x + 6}" y="${y - 5}" class="t12b">${t}</text>`; });
    s += '<text x="155" y="140" text-anchor="middle" class="t12">棋盤</text><text x="251" y="140" text-anchor="middle" class="t12">鏡中的像</text>';
    U.svg(c, '60 10 280 140', s, '平面鏡與九格棋盤').style.maxWidth = '380px';
  }
  function reflPic(c) {
    const H = [160, 150], n = [0.264, -0.964], t = [0.964, 0.264];
    const P = (k, v) => [H[0] + k * v[0], H[1] + k * v[1]];
    const E1 = [H[0] - 90 * t[0] + 25 * n[0], H[1] - 90 * t[1] + 25 * n[1]], E2 = [H[0] + 90 * t[0] + 25 * n[0], H[1] + 90 * t[1] + 25 * n[1]], C = P(-25, n);
    const line = (ang, lab) => { const v = [Math.sin(ang * Math.PI / 180), -Math.cos(ang * Math.PI / 180)], e = P(120, v); return `<line x1="${H[0]}" y1="${H[1]}" x2="${e[0]}" y2="${e[1]}" stroke="var(--muted)" stroke-dasharray="5 4"/><text x="${e[0] + 4}" y="${e[1]}" class="t12b">${lab}</text>`; };
    U.svg(c, '0 0 320 190', `<path d="M${E1} Q${C} ${E2}" fill="none" stroke="#5aa0d8" stroke-width="5"/>
      ${line(15.3, 'L₁')}${line(0, 'L₂')}${line(42, 'L₃')}${line(-22, 'L₄')}
      <line x1="60" y1="20" x2="${H[0]}" y2="${H[1]}" stroke="var(--bad)" stroke-width="2.5"/><line x1="${H[0]}" y1="${H[1]}" x2="262" y2="109" stroke="var(--bad)" stroke-width="2.5"/>
      <rect x="262" y="96" width="40" height="26" rx="4" fill="var(--card)" stroke="var(--stroke)"/><text x="282" y="140" text-anchor="middle" class="t12b">接收器</text>
      <text x="44" y="16" class="t12b">☀ 入射光</text><text x="${H[0] - 4}" y="${H[1] + 22}" class="t12b">O</text><text x="70" y="182" class="t12">反射器</text>`, '反射器、入射光與四條虛線').style.maxWidth = '360px';
  }
  function cardPic(c) {
    const x = d => 40 + 120 * Math.tan(d * Math.PI / 180);
    U.svg(c, '0 0 340 180', `<line x1="40" y1="10" x2="40" y2="152" stroke="#5aa0d8" stroke-width="5"/><line x1="40" y1="152" x2="330" y2="152" stroke="var(--stroke)" stroke-width="2"/>
      <rect x="40" y="146" width="${x(30) - 40}" height="6" fill="#e53935"/><rect x="${x(30)}" y="146" width="${x(45) - x(30)}" height="6" fill="#fff" stroke="var(--stroke)" stroke-width=".8"/><rect x="${x(45)}" y="146" width="${x(60) - x(45)}" height="6" fill="#43a047"/>
      ${[30, 45, 60].map(d => `<line x1="40" y1="32" x2="${x(d)}" y2="152" stroke="var(--stroke)"/>`).join('')}
      <text x="44" y="28" class="t14b">P</text><text x="48" y="60" class="t12">30°</text><text x="54" y="78" class="t12">45°</text><text x="60" y="96" class="t12">60°</text>
      <text x="${(40 + x(30)) / 2}" y="170" text-anchor="middle" class="t12b">紅</text><text x="${(x(30) + x(45)) / 2}" y="170" text-anchor="middle" class="t12b">白</text><text x="${(x(45) + x(60)) / 2}" y="170" text-anchor="middle" class="t12b">綠</text>
      <text x="300" y="170" class="t12">桌面</text><text x="14" y="90" class="t12" writing-mode="tb">平面鏡</text>`, '平面鏡上的 P 點與桌上的三張圖卡').style.maxWidth = '380px';
  }
  function real(p, api) {
    U.real(p, api, [
      { stars: 1, src: '銜接題',
        q: '小美站在平面鏡前 2 m 處，接著往鏡子走近 0.5 m。這時小美和她鏡中的像相距多少公尺？',
        options: [{ t: '1.5 m', why: '1.5 m 是小美到「鏡子」的距離。' }, { t: '3 m', ok: true, why: '小美離鏡子 1.5 m，像也在鏡後 1.5 m，相距 3 m。' }, { t: '3.5 m', why: '要先算走近後的距離：2－0.5＝1.5。' }, { t: '4 m', why: '4 m 是還沒走近時的距離。' }],
        steps: [{ q: '走近以後，小美離鏡子多遠？', options: [{ t: '1.5 m', ok: true, why: '2－0.5＝1.5。' }, { t: '2.5 m', why: '是「走近」，要減。' }] },
          { q: '像離鏡子多遠？', options: [{ t: '也是 1.5 m', ok: true, why: '物距＝像距。' }, { t: '3 m', why: '像到鏡子的距離和小美到鏡子一樣。' }] }],
        explain: '<p>平面鏡：<b>物距＝像距</b>。人和像的距離＝物距×2＝1.5×2＝3 m。</p>' },
      { stars: 2, src: '103 年會考第 3 題', pic: boardPic,
        q: '如圖所示，在一面鉛直立著的平面鏡左方水平放置一個九格的棋盤，平面鏡右方表示鏡中所成的像。將一顆棋子「馬」由圖中甲處移至乙處，則平面鏡中所顯示的棋子「馬」，其移動的路徑為下列何者？',
        options: [{ t: 'P → S', why: '起點和終點反了。' }, { t: 'Q → R', why: '甲在棋盤最外側、下面那條線上，它的像也要在最外側、同一條線上。' }, { t: 'S → P', ok: true, why: '甲的像是 S，乙的像是 P。' }, { t: 'R → Q', why: '像和物體要和鏡子距離一樣、高度一樣。' }],
        steps: [{ q: '甲離鏡子 3 格，在下面那條橫線上。甲在鏡中的像是哪一點？', options: ['P', 'Q', 'R', 'S'].map(t => ({ t, ok: t === 'S', why: t === 'S' ? '鏡後 3 格、同一條橫線。' : '像要和甲一樣離鏡子 3 格、在同一條橫線上。' })) },
          { q: '乙離鏡子 1 格，在上面那條橫線上。乙在鏡中的像是哪一點？', options: ['P', 'Q', 'R', 'S'].map(t => ({ t, ok: t === 'P', why: t === 'P' ? '鏡後 1 格、同一條橫線。' : '像要和乙一樣離鏡子 1 格、在同一條橫線上。' })) }],
        explain: '<p>平面鏡成像：像和物體對稱於鏡面，<b>距離鏡子一樣遠、高度一樣</b>。甲 → S，乙 → P，所以路徑是 S → P。</p>' },
      { stars: 2, src: '改寫自 108 年會考第 47 題', pic: reflPic,
        q: '太陽能發電廠用反射器把太陽光反射到接收器上，如圖。圖中的入射光線經反射器上的 O 點反射後，照射在接收器上，則此時 O 點的法線應為圖中的哪一條虛線？',
        options: [{ t: 'L₁', ok: true, why: 'L₁ 剛好在入射光和反射光正中間（入射角＝反射角），而且垂直反射面。' }, { t: 'L₂', why: 'L₂ 是鉛直線，但法線要垂直「反射面」，不一定是鉛直的。' }, { t: 'L₃', why: 'L₃ 離反射光比較近，兩邊的角不相等。' }, { t: 'L₄', why: 'L₄ 在入射光外面，入射光和反射光必須在法線兩側。' }],
        steps: [{ q: '法線和反射面是什麼關係？', options: [{ t: '垂直', ok: true, why: '法線就是垂直反射面的那條線。' }, { t: '平行', why: '法線是「垂直」鏡面的線。' }] },
          { q: '依反射定律，入射角＝反射角。所以法線一定在入射光和反射光的……', options: [{ t: '正中間', ok: true, why: '兩邊的角一樣大，法線就在正中間。' }, { t: '外面', why: '入射光和反射光要分別在法線的兩側。' }] }],
        explain: '<p>反射定律：入射角＝反射角，入射光和反射光在<b>法線兩側</b>。所以法線是入射光和反射光夾角的<b>平分線</b>，而且垂直反射面 → L₁。</p>' },
      { stars: 3, src: '104 年會考第 39 題', pic: cardPic,
        q: '桌面上由左至右擺放著紅色、白色、綠色三張相鄰的圖卡，左端放置一平面鏡與桌面垂直，圖卡間相鄰位置與平面鏡上 P 點的角度關係，如圖所示。今將<b>藍色光線</b>以入射角 X 度入射在平面鏡 P 點，看見光線反射後落在圖卡上形成<b>藍色光點</b>，依上述條件推論，下列何者最可能為 X 的數值？',
        options: [{ t: '35', why: '反射角 35° 時，反射光和鏡面夾 55°，會落在綠卡上，綠卡會吸收藍光。' }, { t: '40', why: '反射光和鏡面夾 50°，還是落在綠卡上。' }, { t: '50', ok: true, why: '反射光和鏡面夾 40°，落在白卡上，白卡反射藍光 → 藍色光點。' }, { t: '75', why: '反射光和鏡面夾 15°，落在紅卡上，紅卡吸收藍光 → 黑點。' }],
        steps: [{ q: '藍光落在哪一張圖卡上，才會看到「藍色光點」？', options: [{ t: '白色圖卡', ok: true, why: '白色反射所有色光，藍光照上去就是藍色。（紅卡、綠卡會吸收藍光，看起來是黑點）' }, { t: '紅色圖卡', why: '紅卡只反射紅光，藍光會被吸收。' }, { t: '綠色圖卡', why: '綠卡只反射綠光，藍光會被吸收。' }] },
          { q: '落在白卡上，反射光和「鏡面」的夾角在幾度之間？', options: [{ t: '30°～45°', ok: true, why: '看圖：白卡在 30° 線和 45° 線之間。' }, { t: '45°～60°', why: '那是綠卡的範圍。' }, { t: '0°～30°', why: '那是紅卡的範圍。' }] },
          { q: '法線和鏡面垂直（90°）。反射角是和「法線」的夾角，所以反射角在幾度之間？', options: [{ t: '45°～60°', ok: true, why: '90－45＝45，90－30＝60。' }, { t: '30°～45°', why: '這是和鏡面的夾角，要用 90° 去減。' }] }],
        explain: '<p>① 藍光只有落在<b>白卡</b>才會呈藍色。② 白卡對應反射光和鏡面夾 30°～45°。③ 反射角＝90°－(30°～45°)＝45°～60°。④ 入射角＝反射角，所以 45° ＜ X ＜ 60°，選 <b>50</b>。</p>' }
    ]);
  }

  U.run('4-2', ['先猜猜看：鏡子裡的世界', '動手玩：反射與面鏡', '收成 4 句話'], { guess, play, know, exam, real });
})();
