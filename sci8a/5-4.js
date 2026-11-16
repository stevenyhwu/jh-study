/* ===== 理化 5-4 熱的傳播方式 ===== */
(function () {
  'use strict';
  const U = Unit4, h = U.h;
  const ST = 'stroke="var(--stroke)" stroke-width="1.5"';
  const FLAME = (x, y) => `<path d="M${x} ${y} c-9 -12 -3 -20 0 -28 c4 8 10 16 0 28Z" fill="#f6a54b" stroke="#d64545" stroke-width="1.2"/>`;

  /* 傳導：金屬棒和木棒，棒上用蠟黏著小珠子 */
  function condSim(host, on) {
    host.appendChild(h('<p class="sim-h">傳導：金屬棒和木棒的左端加熱，棒上用蠟黏著小珠子</p>'));
    const sv = U.svg(host, '0 0 360 170', '', '熱的傳導', 'sim');
    let start = 0; const seen = {};
    const row = h('<div class="row"><button type="button" class="btn primary">🔥 開始加熱</button></div>');
    row.firstChild.addEventListener('click', () => { start = performance.now(); });
    host.appendChild(row);
    U.anim(sv, () => {
      const t = start ? (performance.now() - start) / 1000 : 0;
      let s = '';
      [['金屬棒', '#9aa5b8', 60, 70], ['木棒', '#c9a063', 120, 8]].forEach(([n, c, y, v]) => {
        const front = 30 + t * v;
        s += `<rect x="30" y="${y - 7}" width="300" height="14" rx="4" fill="${c}" ${ST}/><text x="336" y="${y + 5}" class="t12b">${n}</text>` + FLAME(30, y + 36);
        if (start) s += `<rect x="30" y="${y - 7}" width="${Math.min(300, front - 30)}" height="14" rx="4" fill="#e53935" opacity=".35"/>`;
        for (let i = 1; i <= 6; i++) { const x = 30 + i * 45, fell = start && front > x; s += `<circle cx="${x}" cy="${fell ? y + 40 : y + 12}" r="5" fill="#fff" ${ST}/>`; }
      });
      if (start && t > 4.5 && !seen.run) { seen.run = 1; on(); }
      sv.innerHTML = s + (start ? '' : '<text x="180" y="160" text-anchor="middle" class="t12 mut">按「開始加熱」</text>');
    });
    return { seen };
  }

  /* 對流：鍋子裡的水 */
  function convSim(host, on) {
    host.appendChild(h('<p class="sim-h">對流：一鍋水裡加了一點木屑，看水怎麼流</p>'));
    const sv = U.svg(host, '0 0 360 190', '', '熱的對流', 'sim');
    let pos = 'bottom'; const seen = {};
    const ps = Array.from({ length: 22 }, (_, i) => ({ a: i / 22 * Math.PI * 2, r: 0.4 + (i % 4) * 0.15 }));
    U.chips(host, '加熱的位置', [{ v: 'bottom', t: '從鍋底加熱' }, { v: 'top', t: '從水面上方加熱' }], pos, v => { pos = v; seen[v] = 1; on(); });
    seen.bottom = 1;
    U.anim(sv, t => {
      let s = `<rect x="80" y="40" width="200" height="130" fill="var(--water)"/><path d="M80 30 V170 H280 V30" fill="none" stroke="var(--stroke)" stroke-width="3"/>`;
      if (pos === 'bottom') {
        s += FLAME(150, 200) + FLAME(210, 200);
        ps.forEach((p, i) => {
          const a = p.a + t * 1.2 * (i % 2 ? 1 : -1), cx = i % 2 ? 230 : 130;
          s += `<circle cx="${cx + 40 * p.r * Math.cos(a)}" cy="${105 + 55 * p.r * Math.sin(a)}" r="3.5" fill="#a8743a"/>`;
        });
        s += `<text x="180" y="24" text-anchor="middle" class="t12b">熱水往上、冷水往下，整鍋轉起來</text>`;
      } else {
        s += `<rect x="110" y="6" width="140" height="10" rx="4" fill="#e53935" opacity=".8"/>`;
        ps.forEach((p, i) => { s += `<circle cx="${95 + (i * 37) % 170}" cy="${140 + (i * 13) % 26 + Math.sin(t + i) * 1.5}" r="3.5" fill="#a8743a"/>`; });
        s += `<rect x="80" y="40" width="200" height="22" fill="#e53935" opacity=".25"/><text x="180" y="186" text-anchor="middle" class="t12b">上面熱了，下面還是冷的；水幾乎不流動</text>`;
      }
      sv.innerHTML = s;
    });
    return { seen };
  }

  /* 輻射：燈照兩個罐子 */
  function radSim(host, on) {
    host.appendChild(h('<p class="sim-h">輻射：用燈照一個黑罐子和一個白罐子（裡面都是 25 °C 的水）</p>'));
    const sv = U.svg(host, '0 0 360 170', '', '熱的輻射', 'sim');
    let start = 0; const seen = {};
    const row = h('<div class="row"><button type="button" class="btn primary">💡 打開燈 10 分鐘</button></div>');
    row.firstChild.addEventListener('click', () => { start = performance.now(); });
    host.appendChild(row);
    U.anim(sv, () => {
      const m = start ? Math.min(10, (performance.now() - start) / 400) : 0;
      const tb = (25 + m * 1.6).toFixed(1), tw = (25 + m * 0.5).toFixed(1);
      sv.innerHTML = `<circle cx="180" cy="26" r="16" fill="#f2c230" ${ST}/>${start ? '<path d="M165 40 L110 90 M195 40 L250 90" stroke="#f2c230" stroke-width="3" stroke-dasharray="6 5"/>' : ''}
        <rect x="80" y="90" width="60" height="70" rx="6" fill="#222" ${ST}/><rect x="220" y="90" width="60" height="70" rx="6" fill="#fafafa" ${ST}/>
        <text x="110" y="84" text-anchor="middle" class="t14b">${tb} °C</text><text x="250" y="84" text-anchor="middle" class="t14b">${tw} °C</text>
        <text x="40" y="130" text-anchor="middle" class="t12b">黑罐</text><text x="320" y="130" text-anchor="middle" class="t12b">白罐</text><text x="180" y="166" text-anchor="middle" class="t12 mut">已照 ${m.toFixed(0)} 分鐘</text>`;
      if (m >= 10 && !seen.run) { seen.run = 1; on(); }
    });
    return { seen };
  }

  function guess(p, api) {
    U.guess(p, api, [
      { q: '炒菜鍋的鍋身是鐵做的，為什麼<b>把手</b>常用木頭或塑膠？',
        options: [{ t: '比較便宜' }, { t: '木頭、塑膠不容易傳熱，不會燙手', ok: true }],
        reveal: '<b>不容易傳熱</b>。不同的東西傳熱的快慢差很多。' },
      { q: '冷氣機通常裝在牆壁的<b>高處</b>，為什麼？',
        options: [{ t: '比較不會被撞到' }, { t: '冷空氣會往下沉，整個房間都會涼', ok: true }],
        reveal: '<b>冷空氣往下沉</b>。熱空氣往上、冷空氣往下，這叫對流。' }
    ]);
  }

  function play(p, api) {
    let A, B, C;
    const P = U.panes(p, 3);
    const tk = U.tasks(p, api, [
      { text: '傳導：按「開始加熱」，看哪一根棒子上的珠子先掉。', setup() { P.show(0); }, check: () => A.seen.run,
        qs: () => [{ q: '哪一根傳熱比較快？', options: [{ t: '金屬棒', ok: true, why: '熱從高溫的地方一點一點傳到旁邊，叫<b>傳導</b>，固體主要靠傳導。金屬是熱的<b>良導體</b>，木頭、塑膠、空氣是<b>不良導體</b>。' }, { t: '木棒', why: '看珠子：哪一根的掉得比較快？' }] }] },
      { text: '對流：看<b>從鍋底加熱</b>，再換成<b>從上方加熱</b>。', setup() { P.show(1); }, check: () => B.seen.top,
        qs: () => [{ q: '從鍋底加熱，水為什麼會轉起來？', options: [{ t: '底下的水受熱變輕往上升，上面的冷水往下沉', ok: true, why: '這叫<b>對流</b>，液體和氣體主要靠對流傳熱。所以燒水要從底下加熱。' }, { t: '火焰把水推上去', why: '是水受熱後密度變小、浮上去。' }] }] },
      { text: '輻射：打開燈照 10 分鐘，比較兩個罐子。', setup() { P.show(2); }, check: () => C.seen.run,
        qs: () => [{ q: '哪一個罐子升溫比較快？', options: [{ t: '黑罐子', ok: true, why: '黑色<b>吸收</b>輻射熱的能力強，白色、亮面會反射。所以夏天穿淺色衣服比較涼。' }, { t: '白罐子', why: '看兩邊的溫度。' }] },
          { q: '太陽的熱，穿過真空的太空到達地球，是靠哪一種方式？', options: [{ t: '輻射', ok: true, why: '輻射<b>不需要介質</b>，真空也能傳。傳導和對流都需要物質。' }, { t: '傳導', why: '太空是真空，沒有物質可以一個傳一個。' }, { t: '對流', why: '對流需要液體或氣體流動，太空是真空。' }] }] }
    ]);
    A = condSim(P.list[0], () => tk.check()); B = convSim(P.list[1], () => tk.check()); C = radSim(P.list[2], () => tk.check());
    P.end(tk.slot); tk.start();
  }

  function know(p, api) {
    p.appendChild(h('<p class="muted">把剛剛玩到的，收成 4 句話。</p>'));
    U.card(p, '① 傳導：一個傳一個，固體為主', '<p>金屬傳得快（良導體）；木頭、塑膠、空氣、羽毛傳得慢（不良導體）。<br>羽絨衣保暖，是因為裡面有很多不流動的空氣。</p>');
    U.card(p, '② 對流：熱的上升、冷的下降，液體和氣體', '<p>冷氣裝高處、暖爐放低處；燒水從底部加熱；海風、陸風也是對流。</p>');
    U.card(p, '③ 輻射：不需要介質，真空也能傳', '<p>太陽、火爐、燈泡的熱都會輻射出來。<br>黑色、粗糙的表面<b>吸收</b>得多；白色、光亮的表面<b>反射</b>得多。</p>');
    U.svg(U.card(p, '④ 保溫瓶：三種都擋住', '<p><b>真空層</b>：擋住傳導和對流。<br><b>鍍銀的瓶壁</b>：把輻射反射回去。<br><b>瓶蓋</b>：擋住對流和蒸發。</p>'),
      '0 0 200 170', `<rect x="50" y="20" width="100" height="140" rx="20" fill="#d8dde6" ${ST}/><rect x="64" y="34" width="72" height="116" rx="14" fill="var(--card)" stroke="#9aa5b8" stroke-width="4"/>
        <rect x="70" y="40" width="60" height="104" rx="10" fill="#f3a3a3"/><rect x="70" y="8" width="60" height="18" rx="5" fill="#7a8699" ${ST}/>
        <text x="100" y="96" text-anchor="middle" class="t12b">熱水</text><text x="160" y="60" class="t12">真空</text>`, '保溫瓶的構造').style.maxWidth = '200px';
    const c = h('<div class="card"><h3>✏️ 檢查一下</h3></div>'); p.appendChild(c);
    U.choice(c, { q: '冬天開暖爐，暖爐應該放在房間的哪裡，整個房間最快變暖？', hint: '熱空氣會往上還是往下？',
      options: [{ t: '地上（低處）', ok: true, why: '暖空氣往上升，冷空氣往下補，整個房間對流起來。' }, { t: '天花板（高處）', why: '熱空氣會停在上面，底下還是冷的。' }], onDone() { api.done(); } });
  }

  function exam(p, api) {
    U.exam(p, api, {
      intro: '下面是這一節常見的基本題。答錯可以再選。',
      benchLabel: '想試試看？打開對流實驗',
      bench: host => convSim(host, () => {}),
      qs: [
        { src: '基本題', q: '保溫瓶的瓶壁之間抽成<b>真空</b>，主要是為了阻擋哪些熱的傳播方式？', hint: '哪兩種方式需要物質才能傳？',
          options: [{ t: '傳導和對流', ok: true, why: '沒有物質，就不能傳導、也不能對流。輻射要靠鍍銀的瓶壁反射。' }, { t: '只有輻射', why: '輻射在真空中也能傳，擋不住。' }, { t: '傳導和輻射', why: '真空擋不住輻射。' }, { t: '三種都擋住', why: '真空擋不住輻射。' }] },
        { src: '基本題', q: '夏天在大太陽下，穿哪一種顏色的衣服比較涼？', hint: '想想黑罐子和白罐子。',
          options: [{ t: '白色、淺色', ok: true, why: '淺色會反射比較多的輻射熱。' }, { t: '黑色', why: '黑色吸收輻射熱最多。' }, { t: '都一樣', why: '黑罐子升溫比白罐子快很多。' }] },
        { src: '基本題', q: '用鍋子燒開水，鍋子是金屬做的。熱從火傳到鍋子裡的水、再讓整鍋水變熱，依序主要是哪兩種方式？', hint: '先經過固體的鍋底，再在液體裡傳開。',
          options: [{ t: '先傳導，再對流', ok: true, why: '火的熱經由鍋底（固體）傳導給水，水再靠對流把整鍋變熱。' }, { t: '先對流，再傳導', why: '順序反了。' }, { t: '都是輻射', why: '鍋子貼著火、水在流動，主要是傳導和對流。' }] }
      ]
    });
  }

  U.run('5-4', ['先猜猜看：熱怎麼跑？', '動手玩：傳導、對流、輻射', '收成 4 句話', '常見題型'], { guess, play, know, exam });
})();
