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

  U.run('4-2', ['先猜猜看：鏡子裡的世界', '動手玩：反射與面鏡', '收成 4 句話'], { guess, play, know, exam });
})();
