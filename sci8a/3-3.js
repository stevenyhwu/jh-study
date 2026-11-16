/* ===== 理化 3-3 多變的聲音、聲波的反射與應用 ===== */
(function () {
  'use strict';
  const U = Unit4, h = U.h;
  const ST = 'stroke="var(--stroke)" stroke-width="1.5"';
  const TAU = Math.PI * 2;
  const SHAPE = {
    sine: ph => Math.sin(TAU * ph),
    triangle: ph => 2 / Math.PI * Math.asin(Math.sin(TAU * ph)),
    sawtooth: ph => 2 * (ph - Math.floor(ph + 0.5))
  };
  const INS = { sine: '音叉', triangle: '笛子', sawtooth: '小提琴' };
  // 示波器波形：0～10 ms 畫在 x0～x0+w
  function scope(x0, y, w, A, f, type) {
    let d = '';
    for (let i = 0; i <= 300; i++) { const t = i / 300 * 0.01; d += (d ? 'L' : 'M') + (x0 + i / 300 * w).toFixed(1) + ' ' + (y - A * SHAPE[type](f * t)).toFixed(1); }
    return d;
  }
  function beep(f, amp, type) {
    try {
      const C = window.__ac || (window.__ac = new (window.AudioContext || window.webkitAudioContext)());
      const o = C.createOscillator(), g = C.createGain(), t = C.currentTime;
      o.type = type; o.frequency.value = f;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.03 * amp * (type === 'sawtooth' ? 0.5 : 1), t + 0.03);
      g.gain.linearRampToValueAtTime(0, t + 0.95);
      o.connect(g); g.connect(C.destination); o.start(t); o.stop(t + 1);
    } catch (e) { /* 沒有聲音也沒關係 */ }
  }

  /* ---------- 聲音產生器 ---------- */
  function toneSim(host, onChange) {
    host.appendChild(h('<p class="sim-h">聲音產生器：上面是聲波的樣子（0.01 秒內）</p>'));
    const sv = U.svg(host, '0 0 360 170', '', '聲波波形', 'sim');
    const read = h('<div class="sim-read"></div>');
    let amp = 3, f = 400, ins = 'sine'; const seen = { a3: 1, f400: 1, isine: 1 };
    function draw() {
      let g = `<rect x="20" y="10" width="320" height="140" rx="8" fill="#16241b"/>`;
      for (let i = 1; i < 8; i++) g += `<line x1="${20 + i * 40}" y1="10" x2="${20 + i * 40}" y2="150" stroke="#2b4a35" stroke-width="1"/>`;
      g += `<line x1="20" y1="80" x2="340" y2="80" stroke="#2b4a35" stroke-width="1.5"/>
        <path d="${scope(20, 80, 320, amp * 12, f, ins)}" fill="none" stroke="#7dffa0" stroke-width="2.5"/>
        <text x="340" y="166" text-anchor="end" class="t12 mut">時間 →（共 0.01 秒）</text>`;
      sv.innerHTML = g;
      read.innerHTML = `響度：約 <b>${40 + amp * 10} 分貝</b>（振幅 ${amp}）　音調：<b>${f} Hz</b>（每秒振動 ${f} 次）　音色：<b>${INS[ins]}</b>`;
    }
    U.slider(host, '響度（大聲／小聲）', { min: 1, max: 5, step: 1, value: amp, fmt: v => ['', '很小聲', '小聲', '中等', '大聲', '很大聲'][v] }, v => { amp = v; seen['a' + v] = 1; draw(); onChange(); });
    U.chips(host, '音調', [{ v: 200, t: '低（200 Hz）' }, { v: 400, t: '中（400 Hz）' }, { v: 800, t: '高（800 Hz）' }], f, v => { f = v; seen['f' + v] = 1; draw(); onChange(); });
    U.chips(host, '樂器', Object.keys(INS).map(v => ({ v, t: INS[v] })), ins, v => { ins = v; seen['i' + v] = 1; draw(); onChange(); });
    const row = h('<div class="row"><button type="button" class="btn">▶ 聽聽看（1 秒）</button></div>');
    row.firstChild.addEventListener('click', () => beep(f, amp, ins));
    host.append(row, read); draw();
    return { seen };
  }

  /* ---------- 聲納 ---------- */
  function sonarSim(host, onChange, o) {
    o = o || {};
    let D = o.depth || 1500, start = 0, got = false; const seen = {};
    host.appendChild(h(`<p class="sim-h">船上的聲納往海底發出聲波（海水中聲速 1500 m/s）</p>`));
    const sv = U.svg(host, '0 0 360 220', '', '聲納', 'sim');
    const read = h('<div class="sim-read"></div>');
    const total = () => 2 * D / 1500;
    function upd() {
      read.innerHTML = (got ? `從發出到收到回聲：<b>${total()} 秒</b>` : '按「📡 發出聲波」') + (o.hidden ? '　海深：<b>？</b>' : `　海深：<b>${D} m</b>`);
    }
    if (!o.hidden) U.slider(host, '海深', { min: 750, max: 3000, step: 750, value: D, fmt: v => v + ' m' }, v => { D = v; start = 0; got = false; upd(); });
    const row = h('<div class="row"><button type="button" class="btn primary">📡 發出聲波</button></div>');
    row.firstChild.addEventListener('click', () => { start = performance.now(); got = false; upd(); });
    host.append(row, read); upd();
    U.anim(sv, () => {
      const bed = 50 + D / 3000 * 150;
      let s = `<rect x="0" y="50" width="360" height="170" fill="var(--water)"/><path d="M0 ${bed} Q90 ${bed - 8} 180 ${bed} T360 ${bed} V220 H0Z" fill="#c9a063" ${ST}/>
        <path d="M140 38 H220 L208 52 H152 Z" fill="var(--card)" ${ST}/><rect x="172" y="24" width="18" height="14" fill="var(--card)" ${ST}/>`;
      if (start) {
        const el = (performance.now() - start) / 1000, half = total() / 2;
        if (el < total()) {
          const down = el < half, frac = down ? el / half : 1 - (el - half) / half, y = 52 + (bed - 52) * frac;
          s += `<path d="M150 ${y} Q180 ${y + (down ? 12 : -12)} 210 ${y}" fill="none" stroke="var(--bad)" stroke-width="3"/>
            <text x="230" y="${y + 4}" class="t12b" style="fill:var(--bad)">${down ? '往下 ↓' : '回聲 ↑'}</text>`;
        } else if (!got) { got = true; seen.sent = 1; upd(); onChange(); }
        if (got) s += `<text x="180" y="18" text-anchor="middle" class="t12b" style="fill:var(--good)">收到回聲！</text>`;
      }
      if (!o.hidden) s += `<line x1="320" y1="52" x2="320" y2="${bed}" stroke="var(--stroke)" stroke-dasharray="4 3"/><text x="326" y="${(52 + bed) / 2}" class="t12b">${D} m</text>`;
      sv.innerHTML = s;
    });
    return { seen };
  }

  function guess(p, api) {
    U.guess(p, api, [
      { q: '鋼琴和小提琴都彈同一個「Do」，一樣大聲。閉上眼睛，聽得出哪個是鋼琴嗎？',
        options: [{ t: '聽得出來', ok: true }, { t: '聽不出來，都是 Do' }],
        reveal: '<b>聽得出來</b>。一樣的音高、一樣大聲，聲波卻有一個地方不一樣。下一步看看是哪裡。' },
      { pic: c => U.svg(c, '0 0 320 70', '<text x="40" y="48" font-size="34">🦇</text><rect x="260" y="6" width="20" height="60" fill="var(--line)" stroke="var(--stroke)"/><path d="M90 36 q10 -10 0 -20 M110 40 q14 -14 0 -28" fill="none" stroke="var(--accent)" stroke-width="2"/>', '蝙蝠和牆'),
        q: '蝙蝠在全黑的山洞裡飛，為什麼不會撞到牆？',
        options: [{ t: '牠的眼睛在黑暗中看得很清楚' }, { t: '牠發出聲音，聽回聲知道牆在哪裡', ok: true }],
        reveal: '<b>聽回聲</b>。聲音碰到牆會反彈回來，這叫<b>回聲</b>。船的聲納也是這樣找海底的。' }
    ]);
  }

  function play(p, api) {
    let A, B;
    const tk = U.tasks(p, api, [
      { text: '拉「響度」，從<b>很小聲</b>拉到<b>很大聲</b>，看波形怎麼變。（可以按 ▶ 聽聽看）',
        setup() { a.hidden = false; b.hidden = true; },
        check: () => A.seen.a1 && A.seen.a5,
        qs: () => [{ q: '越大聲，波形有什麼變化？',
          options: [{ t: '上下變得更高（振幅變大）', ok: true, why: '<b>響度由振幅決定</b>。振幅越大越大聲，單位用<b>分貝（dB）</b>。' }, { t: '變得更密', why: '拉響度時，波的疏密有變嗎？' }, { t: '形狀變了', why: '形狀沒變，只是變高變矮。' }] }] },
      { text: '音調換成「<b>低</b>」和「<b>高</b>」各一次。',
        check: () => A.seen.f200 && A.seen.f800,
        qs: () => [{ q: '音調越高，波形有什麼變化？',
          options: [{ t: '波變得更密（頻率變大）', ok: true, why: '<b>音調由頻率決定</b>。頻率越高，聲音越尖、越高。' }, { t: '上下變得更高', why: '那是響度。換音調時，波的高度有變嗎？' }, { t: '沒有變化', why: '低和高各看一次，數數看有幾個波。' }] }] },
      { text: '樂器換成「<b>笛子</b>」和「<b>小提琴</b>」，比比看波形。',
        check: () => A.seen.itriangle && A.seen.isawtooth,
        qs: () => [{ q: '一樣的音調、一樣的響度，為什麼聽得出是笛子還是小提琴？',
          options: [{ t: '波的形狀不同（音色不同）', ok: true, why: '<b>音色由波形決定</b>。每種樂器、每個人的聲音波形都不一樣，所以聽得出是誰。' }, { t: '頻率不同', why: '三種樂器都是同一個頻率，數數看波的個數一樣嗎？' }, { t: '振幅不同', why: '響度沒有變，波的高度差不多。' }] }] },
      { text: '換到聲納：按「📡 發出聲波」，看回聲幾秒回來。',
        setup() { b.hidden = false; a.hidden = true; },
        check: () => B.seen.sent,
        qs: () => [{ num: true, q: '回聲花了 3 秒才回來。海水中聲速 1500 m/s，海有多深？', post: 'm', answer: 2250,
          hint: '聲波一去一回共走了 1500 × 3 ＝ 4500 m。海深只算單程。',
          diag: [{ v: 4500, msg: '4500 m 是「去＋回」的總距離。海深只算一趟，要<b>除以 2</b>。' }, { v: 500, msg: '是速度×時間，不是相除。' }],
          why: '1500 × 3 ÷ 2 ＝ 2250 m。<b>距離＝聲速×時間÷2</b>（因為一去一回）。' }] }
    ]);
    const card = h('<div class="card"></div>'); p.appendChild(card);
    const a = h('<div></div>'), b = h('<div hidden></div>');
    card.append(a, b, tk.slot);
    A = toneSim(a, () => tk.check());
    B = sonarSim(b, () => tk.check(), { hidden: true, depth: 2250 });
    tk.start();
  }

  function know(p, api) {
    p.appendChild(h('<p class="muted">把剛剛玩到的，收成 4 句話。</p>'));
    const pair = (pa, pb, la, lb) => `<rect x="10" y="6" width="145" height="80" rx="6" fill="#16241b"/><rect x="165" y="6" width="145" height="80" rx="6" fill="#16241b"/>
      <path d="${pa}" fill="none" stroke="#7dffa0" stroke-width="2"/><path d="${pb}" fill="none" stroke="#7dffa0" stroke-width="2"/>
      <text x="82" y="104" text-anchor="middle" class="t12b">${la}</text><text x="237" y="104" text-anchor="middle" class="t12b">${lb}</text>`;
    U.svg(U.card(p, '① 響度（大小聲）↔ 振幅',
      '<p>振幅越大，聲音越<b>大聲</b>。單位是<b>分貝（dB）</b>。<br>樂譜上的 f（強）、p（弱）就是在說響度。</p>'),
      '0 0 320 110', pair(scope(10, 46, 145, 10, 400, 'sine'), scope(165, 46, 145, 32, 400, 'sine'), '小聲：振幅小', '大聲：振幅大'), '小聲和大聲的波形');
    U.svg(U.card(p, '② 音調（高低）↔ 頻率',
      '<p>頻率越大，聲音越<b>高、越尖</b>。<br>人耳大約聽得到 <b>20～20000 Hz</b>。<br>高於 20000 Hz 的叫<b>超聲波</b>（超音波），人聽不到；狗、蝙蝠、海豚聽得到。</p>'),
      '0 0 320 110', pair(scope(10, 46, 145, 24, 200, 'sine'), scope(165, 46, 145, 24, 800, 'sine'), '低音：頻率小', '高音：頻率大'), '低音和高音的波形');
    U.svg(U.card(p, '③ 音色（誰的聲音）↔ 波形',
      '<p>同樣的音調和響度，波的<b>形狀</b>不同，聽起來就不一樣。所以聽得出是鋼琴、小提琴，還是媽媽在叫你。</p>'),
      '0 0 320 110', pair(scope(10, 46, 145, 24, 300, 'triangle'), scope(165, 46, 145, 24, 300, 'sawtooth'), '笛子', '小提琴'), '笛子和小提琴的波形');
    U.svg(U.card(p, '④ 回聲：距離 ＝ 聲速 × 時間 ÷ 2',
      '<p>聲波碰到障礙物會<b>反射</b>回來，就是回聲。<br>因為一去一回，算距離要<b>除以 2</b>。</p><p>應用：<b>聲納</b>測海深、找魚群；<b>超音波</b>檢查胎兒；蝙蝠找路。</p>'),
      '0 0 320 100', `<text x="20" y="50" font-size="28">🗣️</text><rect x="280" y="10" width="20" height="80" fill="var(--line)" ${ST}/>
        <path d="M60 36 H270" stroke="var(--accent)" stroke-width="2" marker-end="url(#a33)"/><path d="M270 60 H60" stroke="var(--bad)" stroke-width="2" marker-end="url(#b33)"/>
        <defs><marker id="a33" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8Z" fill="var(--accent)"/></marker><marker id="b33" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8Z" fill="var(--bad)"/></marker></defs>
        <text x="165" y="30" text-anchor="middle" class="t12b">去</text><text x="165" y="78" text-anchor="middle" class="t12b">回聲</text>`, '聲音去了又回來');
    const c = h('<div class="card"><h3>✏️ 檢查一下</h3></div>'); p.appendChild(c);
    U.choice(c, { q: '一般來說，女生說話的聲音比男生「尖」。這是因為女生聲音的什麼比較大？',
      hint: '尖、高，說的是音調。音調由什麼決定？',
      options: [{ t: '頻率', ok: true, why: '音調高＝頻率大。' }, { t: '振幅', why: '振幅決定大不大聲，不是尖不尖。' }, { t: '波速', why: '在同樣的空氣裡，男生女生的聲音波速一樣。' }],
      onDone() { api.done(); } });
  }

  function exam(p, api) {
    const mini = pts => `<svg viewBox="0 0 120 54" width="120" height="54" style="vertical-align:middle;display:block"><line x1="12" y1="4" x2="12" y2="44" stroke="currentColor"/><line x1="12" y1="44" x2="116" y2="44" stroke="currentColor"/>
      <polyline points="${pts}" fill="none" stroke="#d64545" stroke-width="2.5"/><text x="116" y="53" text-anchor="end" font-size="9" fill="currentColor">頻率</text><text x="14" y="10" font-size="9" fill="currentColor">響度</text></svg>`;
    U.exam(p, api, {
      benchLabel: '想試試看？打開聲音產生器',
      bench: host => toneSim(host, () => {}),
      qs: [
        { src: '改寫自 109 年會考',
          pic: c => U.svg(c, '0 0 320 60', '<text x="40" y="40" font-size="24" font-style="italic" font-weight="700">p</text><text x="66" y="40" class="t12">弱（小聲）</text><text x="180" y="40" font-size="24" font-style="italic" font-weight="700">f</text><text x="200" y="40" class="t12">強（大聲）</text>', '樂譜上的力度記號 p 與 f'),
          q: '樂譜上用 <i>p</i>（弱）、<i>f</i>（強）這些記號，告訴演奏的人要多大聲。這些記號和聲波的哪一個特性最有關？',
          hint: '大聲小聲＝響度。響度由什麼決定？打開上面的產生器拉拉看。',
          options: [{ t: '波長', why: '波長和頻率有關，改變的是音調。' }, { t: '波速', why: '在同樣的空氣裡，大聲小聲的波速都一樣。' }, { t: '頻率', why: '頻率決定音調（高低），不是大小聲。' }, { t: '振幅', ok: true, why: '大聲＝振幅大，小聲＝振幅小。' }] },
        { src: '改寫自 114 年會考',
          q: '孕婦產檢時，醫生用<b>超聲波</b>（超音波）照胎兒。孕婦對超聲波會有什麼感覺？',
          hint: '超聲波「超」過了什麼？人耳聽得到 20～20000 Hz。',
          options: [{ t: '會聽到低沉的轟隆聲', why: '超聲波的頻率非常高，不是低沉的聲音。' }, { t: '會聽到尖銳刺耳的聲音', why: '頻率高到超過人耳的範圍，所以根本聽不到。' },
            { t: '因為頻率太高，所以聽不到', ok: true, why: '超聲波的頻率高於 20000 Hz，超過人耳能聽的範圍。' }, { t: '因為波速太快，所以聽不到', why: '超聲波在空氣中的波速和一般聲音一樣，聽不到是因為頻率。' }] },
        { src: '挑戰題・改寫自 112 年會考',
          q: '「白噪音」是一種人聽得到的聲音，特色是<b>各種頻率的響度都差不多</b>，像雨聲、電風扇聲。哪一張「響度—頻率」圖最適合表示白噪音？',
          hint: '橫軸是頻率，縱軸是響度。「每個頻率的響度都差不多」，線應該長什麼樣子？',
          options: [
            { t: mini('16,22 112,22'), ok: true, why: '一條水平線：不管哪個頻率，響度都一樣高。' },
            { t: mini('16,40 112,8'), why: '這張是頻率越高越大聲，不是「差不多」。' },
            { t: mini('16,8 112,40'), why: '這張是頻率越高越小聲。' },
            { t: mini('16,40 64,8 112,40'), why: '這張只有中間的頻率特別大聲。' }] }
      ]
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    U.mount(document.getElementById('unit'), { unit: 'sci8a-3-3', home: 'index.html', steps: [
      { id: 'guess', label: '猜', title: '先猜猜看：聽得出是誰嗎？', render: guess },
      { id: 'play', label: '玩', title: '動手玩：聲音產生器與聲納', render: play },
      { id: 'know', label: '懂', title: '收成 4 句話', render: know },
      { id: 'exam', label: '考', title: '會考真的這樣考', render: exam }
    ] });
  });
})();
