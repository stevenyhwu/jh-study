/* ===== 理化 4-5 色散與顏色 ===== */
(function () {
  'use strict';
  const U = Unit4, h = U.h;
  const ST = 'stroke="var(--stroke)" stroke-width="1.5"';
  const RAINBOW = ['#e53935', '#fb8c00', '#fdd835', '#43a047', '#1e88e5', '#3949ab', '#8e24aa'];
  const CN = ['紅', '橙', '黃', '綠', '藍', '靛', '紫'];
  const SET = { W: 'RGB', R: 'R', G: 'G', B: 'B', K: '' };
  const NAME = { W: '白', R: '紅', G: '綠', B: '藍', K: '黑' };
  const HEX = { RGB: '#ffffff', R: '#e53935', G: '#43a047', B: '#1e88e5', '': '#111111' };

  function prismSim(host, on) {
    host.appendChild(h('<p class="sim-h">一道光射進三稜鏡</p>'));
    const sv = U.svg(host, '0 0 360 180', '', '三稜鏡', 'sim');
    const read = h('<div class="sim-read"></div>');
    let L = 'W'; const seen = { W: 1 };
    function draw() {
      let s = `<polygon points="170,20 110,160 230,160" fill="var(--accent-soft)" ${ST}/><line x1="10" y1="110" x2="140" y2="90" stroke="${L === 'W' ? '#f5f5f5' : HEX.R}" stroke-width="6"/><line x1="10" y1="110" x2="140" y2="90" stroke="var(--stroke)" stroke-width="1" opacity=".4"/>`;
      if (L === 'W') RAINBOW.forEach((c, i) => { s += `<line x1="140" y1="90" x2="205" y2="${102 + i * 3}" stroke="${c}" stroke-width="3"/><line x1="205" y1="${102 + i * 3}" x2="350" y2="${100 + i * 12}" stroke="${c}" stroke-width="4"/><text x="352" y="${104 + i * 12}" class="t12b" text-anchor="end" dx="-2">${CN[i]}</text>`; });
      else s += `<line x1="140" y1="90" x2="205" y2="102" stroke="${HEX.R}" stroke-width="5"/><line x1="205" y1="102" x2="350" y2="110" stroke="${HEX.R}" stroke-width="5"/>`;
      sv.innerHTML = s;
      read.innerHTML = L === 'W' ? '白光被分成<b>紅、橙、黃、綠、藍、靛、紫</b>七種顏色：這叫<b>色散</b>。' : '紅光穿過三稜鏡，出來<b>還是紅光</b>，不會再分開。';
    }
    U.chips(host, '射進去的光', [{ v: 'W', t: '白光（陽光）' }, { v: 'R', t: '紅光' }], L, v => { L = v; seen[v] = 1; draw(); on(); });
    host.appendChild(read); draw();
    return { seen };
  }

  function colorSim(host, on) {
    host.appendChild(h('<p class="sim-h">在暗房裡，用不同顏色的燈照不同顏色的紙</p>'));
    const sv = U.svg(host, '0 0 360 170', '', '色光與色紙', 'sim');
    const read = h('<div class="sim-read"></div>');
    let L = 'W', P = 'R'; const seen = {};
    function draw() {
      const out = [...SET[P]].filter(c => SET[L].includes(c)).join(''), lc = HEX[SET[L]];
      sv.innerHTML = `<rect x="0" y="0" width="360" height="170" fill="#1a1a22" rx="8"/>
        <circle cx="50" cy="40" r="14" fill="${lc}" ${ST}/><polygon points="58,48 150,110 150,150" fill="${lc}" opacity=".25"/>
        <rect x="150" y="100" width="70" height="56" fill="${HEX[out]}" stroke="#666"/><text x="185" y="96" text-anchor="middle" class="t12b" style="fill:#ddd">${NAME[P]}紙</text>
        <text x="50" y="74" text-anchor="middle" class="t12b" style="fill:#ddd">${NAME[L]}光</text>
        <text x="300" y="120" font-size="28">👁</text><text x="300" y="150" text-anchor="middle" class="t12b" style="fill:#ddd">看起來：${NAME[Object.keys(SET).find(k => SET[k] === out)]}色</text>`;
      read.innerHTML = `${NAME[P]}紙只反射「${P === 'W' ? '所有色光' : P === 'K' ? '（什麼都不反射）' : NAME[P] + '光'}」，其他的都吸收。照進來的是${NAME[L]}光 → 看起來是<b>${NAME[Object.keys(SET).find(k => SET[k] === out)]}色</b>。`;
      seen[P + L] = 1;
    }
    U.chips(host, '燈光', ['W', 'R', 'G', 'B'].map(v => ({ v, t: NAME[v] + '光' })), L, v => { L = v; draw(); on(); });
    U.chips(host, '紙', ['W', 'R', 'G', 'B', 'K'].map(v => ({ v, t: NAME[v] + '紙' })), P, v => { P = v; draw(); on(); });
    host.appendChild(read); draw();
    return { seen };
  }

  function guess(p, api) {
    U.guess(p, api, [
      { q: '雨後的彩虹有七種顏色。這些顏色是從哪裡來的？',
        options: [{ t: '原本就藏在白色的陽光裡', ok: true }, { t: '雨滴本身是彩色的' }],
        reveal: '<b>原本就藏在陽光裡</b>。白光其實是很多顏色的光混在一起。' },
      { q: '在只有<b>綠色</b>燈光的房間裡，一顆紅蘋果看起來會是什麼顏色？',
        options: [{ t: '紅色' }, { t: '綠色' }, { t: '黑色', ok: true }],
        reveal: '<b>黑色</b>！是不是很意外？下一步自己照照看。' }
    ]);
  }

  function play(p, api) {
    let A, B;
    const P = U.panes(p, 2);
    const tk = U.tasks(p, api, [
      { text: '先看白光穿過三稜鏡，再換成<b>紅光</b>。', setup() { P.show(0); }, check: () => A.seen.R,
        qs: () => [{ q: '白光穿過三稜鏡變成七種顏色，代表什麼？', options: [{ t: '白光是很多種色光混合成的', ok: true, why: '每種色光折射的程度不同（紫光偏最多、紅光最少），所以被分開了。這叫<b>色散</b>，彩虹就是雨滴造成的色散。' }, { t: '三稜鏡把光染上顏色', why: '換成紅光試試：如果是三稜鏡染色，紅光出來應該也會變七彩。' }] },
          { q: '紅光穿過三稜鏡呢？', options: [{ t: '還是紅光，不會再分開', ok: true, why: '紅光是<b>單色光</b>，不能再分。' }, { t: '也分成七種顏色', why: '看圖：出來的只有紅色。' }] }] },
      { text: '換到暗房：<b>紅紙</b>先用白光照，再用<b>綠光</b>照。', setup() { P.show(1); }, check: () => B.seen.RW && B.seen.RG,
        qs: () => [{ q: '紅紙在綠光下看起來是什麼顏色？為什麼？', options: [{ t: '黑色，因為紅紙只反射紅光，綠光被吸收了', ok: true, why: '不透明物體的顏色＝<b>它反射的色光</b>。沒有光反射出來，看起來就是黑的。' }, { t: '綠色，因為照的是綠光', why: '紅紙會把綠光吸收掉，沒有反射出來。' }, { t: '紅色，紙的顏色不會變', why: '看圖：在綠光下紅紙變成什麼顏色？' }] }] },
      { text: '換成<b>白紙</b>，用紅、綠、藍光各照一次。', check: () => B.seen.WR && B.seen.WG && B.seen.WB,
        qs: () => [{ q: '白紙在不同顏色的燈下，看起來……', options: [{ t: '燈是什麼顏色就是什麼顏色', ok: true, why: '白色物體<b>反射所有色光</b>，所以照什麼光就是什麼顏色。黑色物體則<b>吸收所有色光</b>。' }, { t: '永遠是白色', why: '看圖：白紙在紅光下是什麼顏色？' }] }] }
    ]);
    A = prismSim(P.list[0], () => tk.check()); B = colorSim(P.list[1], () => tk.check());
    P.end(tk.slot); tk.start();
  }

  function know(p, api) {
    p.appendChild(h('<p class="muted">把剛剛玩到的，收成 4 句話。</p>'));
    prismSim(U.card(p, '① 色散：白光是很多色光混合的', '<p>白光穿過三稜鏡，分成<b>紅橙黃綠藍靛紫</b>。紫光偏折最多，紅光最少。<br>彩虹就是陽光在雨滴裡色散。</p>'), () => {});
    colorSim(U.card(p, '② 不透明物體的顏色＝它反射的色光', '<p>紅色物體只反射紅光，其他吸收。<br><b>白色</b>反射所有色光；<b>黑色</b>吸收所有色光（所以夏天穿黑衣服比較熱）。</p>'), () => {});
    U.card(p, '③ 透明物體的顏色＝能穿過它的色光', '<p>紅色玻璃紙只讓<b>紅光</b>穿過去。隔著紅色玻璃紙看白紙上的綠字，綠字會變<b>黑色</b>。</p>');
    U.svg(U.card(p, '④ 色光三原色：紅、綠、藍', '<p>紅、綠、藍三種色光可以混出各種顏色，三種加在一起是<b>白光</b>。手機、電視螢幕就是用這三色的小點組成。</p>'),
      '0 0 200 150', `<g style="mix-blend-mode:screen"><circle cx="75" cy="60" r="45" fill="#ff0000"/><circle cx="125" cy="60" r="45" fill="#00ff00"/><circle cx="100" cy="100" r="45" fill="#0000ff"/></g>`, '紅綠藍三色光重疊').style.cssText = 'max-width:200px;background:#000;border-radius:8px';
    const c = h('<div class="card"><h3>✏️ 檢查一下</h3></div>'); p.appendChild(c);
    U.choice(c, { q: '在紅光下，一張<b>藍紙</b>看起來是什麼顏色？', hint: '藍紙只反射什麼光？紅光照上去會怎樣？',
      options: [{ t: '黑色', ok: true, why: '藍紙只反射藍光，紅光被吸收，沒有光反射出來。' }, { t: '紫色', why: '色光照在紙上不是「混顏料」，要看紙反射什麼。' }, { t: '藍色', why: '燈光裡沒有藍光，藍紙反射不出藍色。' }], onDone() { api.done(); } });
  }

  function exam(p, api) {
    U.exam(p, api, {
      benchLabel: '想試試看？打開暗房實驗',
      bench: host => colorSim(host, () => {}),
      qs: [
        { src: '改寫自 110 年會考',
          q: '用白光照一張圖卡，圖卡<b>反射紅光、吸收其他色光</b>。如果改用<b>藍光</b>照，圖卡看起來是什麼顏色？',
          hint: '藍光照上去，圖卡會反射嗎？',
          options: [{ t: '紅色', why: '燈裡沒有紅光，圖卡反射不出紅色。' }, { t: '藍色', why: '圖卡會把藍光吸收掉。' }, { t: '紫色', why: '色光照紙不是混顏料。' }, { t: '黑色', ok: true, why: '圖卡只反射紅光，藍光全被吸收，沒有光進到眼睛。' }] },
        { src: '基本題',
          q: '隔著一張<b>紅色玻璃紙</b>，看白紙上用綠筆寫的字。字和白紙看起來各是什麼顏色？',
          hint: '紅色玻璃紙只讓紅光過。白紙反射的光裡有紅光嗎？綠字呢？',
          options: [{ t: '字是黑色，紙是紅色', ok: true, why: '白紙反射的光中，只有紅光能穿過玻璃紙 → 紅色；綠字只反射綠光，被玻璃紙擋住 → 黑色。' }, { t: '字是綠色，紙是紅色', why: '綠光穿不過紅色玻璃紙。' }, { t: '字是紅色，紙是白色', why: '透過紅色玻璃紙，只有紅光能進到眼睛。' }] },
        { src: '基本題',
          q: '彩虹是怎麼形成的？', hint: '和三稜鏡把白光分開是同一個道理。',
          options: [{ t: '陽光穿過雨滴時折射，不同色光偏折不同，被分開了', ok: true, why: '這就是色散。' }, { t: '雨滴本身有顏色', why: '雨滴是透明的。' }, { t: '天空的顏色反射到雲上', why: '彩虹是陽光被雨滴分開的顏色。' }] }
      ]
    });
  }

  U.run('4-5', ['先猜猜看：顏色從哪裡來？', '動手玩：三稜鏡與暗房', '收成 4 句話'], { guess, play, know, exam });
})();
