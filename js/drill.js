/* "Which service?" speed drill. */
(function () {
  const $ = s => document.querySelector(s), esc = HUB.esc, KEY = 'svc-drill-v1', SECS = 15, ROUNDS = 20;
  const CATS = { all: 'All', compute: 'Compute', storage: 'Storage', database: 'Database', network: 'Networking', security: 'Security', mgmt: 'Management', integration: 'Integration', analytics: 'Analytics', ml: 'AI / ML', migration: 'Migration', enduser: 'End user & IoT', billing: 'Billing & pricing' };
  const db = () => { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { return {}; } };
  const save = d => { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {} };
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const cat = s => SVC[s][0];
  const app = $('#app'); let G = null, timerId = null;

  function home() {
    clearInterval(timerId); G = null; const d = db();
    app.innerHTML = `<p class="kicker">INSTANT RECALL TRAINING</p><h1>"Which service?" Drill</h1>
      <p class="mute">${DRILL.length} real-world scenarios, ${Object.keys(SVC).length} AWS services. Each round shows a use case: pick the right service before the ${SECS}-second bar runs out. Faster answers score more. Wrong options come from the same category, just like the exam's distractors.</p>
      <div class="card" style="margin-top:14px"><h3>Category</h3><div class="seg" id="catSeg">${Object.entries(CATS).map(([k, v], i) => `<button data-c="${k}" class="${i ? '' : 'on'}">${v}</button>`).join('')}</div>
        <div class="btnrow"><button class="btn" id="goBtn">START ${ROUNDS} ROUNDS</button></div>
        <p class="mute" style="font-size:11.5px;margin:10px 0 0">Keys: 1–4 or A–D to answer · Enter = next. ${d.best ? `Your best: <b>${d.best}</b> pts · ${d.games} game(s).` : ''}</p></div>
      <h2>SERVICE CHEAT SHEET</h2><div class="card"><input id="flt" placeholder="Filter services…" style="width:100%;border:1.5px solid var(--line);border-radius:6px;padding:8px 10px;background:var(--panel);font:inherit;color:inherit;margin-bottom:8px">
        <table class="hist" id="gl">${Object.entries(SVC).map(([s, [c, d]]) => `<tr data-k="${esc((s + ' ' + d + ' ' + c).toLowerCase())}"><td><b>${esc(s)}</b></td><td class="mute">${esc(CATS[c] || c)}</td><td>${esc(d)}</td></tr>`).join('')}</table></div>`;
    let c = 'all'; app.querySelectorAll('[data-c]').forEach(b => b.onclick = () => { c = b.dataset.c; app.querySelectorAll('[data-c]').forEach(x => x.classList.toggle('on', x === b)); });
    $('#goBtn').onclick = () => start(c);
    $('#flt').oninput = e => { const v = e.target.value.toLowerCase(); app.querySelectorAll('#gl tr').forEach(r => r.hidden = !r.dataset.k.includes(v)); };
  }
  function start(c) {
    let pool = DRILL.filter(d => c === 'all' || cat(d[1]) === c); if (pool.length < 4) pool = DRILL;
    const rounds = shuffle(pool).slice(0, Math.min(ROUNDS, pool.length)).map(([s, a]) => {
      const same = shuffle(Object.keys(SVC).filter(x => x !== a && cat(x) === cat(a))), other = shuffle(Object.keys(SVC).filter(x => x !== a && cat(x) !== cat(a)));
      const opts = shuffle([a].concat(same.slice(0, 2), other.slice(0, 3 - Math.min(2, same.length)))).slice(0, 4);
      if (!opts.includes(a)) opts[0] = a; return { s, a, opts: shuffle(opts), pick: null, ms: 0 };
    });
    G = { c, rounds, cur: 0, score: 0, streak: 0, best: 0 }; ask();
  }
  function ask() {
    const r = G.rounds[G.cur]; const t0 = Date.now();
    app.innerHTML = `<div class="ex-top"><span class="tag">ROUND ${G.cur + 1} / ${G.rounds.length}</span><span class="pill">${esc(CATS[G.c])}</span><span class="pill">🔥 streak ${G.streak}</span><b style="margin-left:auto;font-size:18px;color:var(--blue)">${G.score} pts</b></div>
      <div class="tbar"><i id="tb" style="width:100%"></i></div>
      <div class="card"><div class="mute" style="font-size:11px;letter-spacing:.12em">WHICH AWS SERVICE?</div><div class="dr-scn">${esc(r.s)}</div>
        <div class="dr-ops">${r.opts.map((o, j) => `<button class="opt" data-o="${j}"><span class="lt">${j + 1}</span><span>${esc(o)}</span></button>`).join('')}</div><div id="dfb"></div></div>`;
    app.querySelectorAll('.opt').forEach(b => b.onclick = () => answer(+b.dataset.o, t0));
    clearInterval(timerId); timerId = setInterval(() => { const left = Math.max(0, SECS * 1000 - (Date.now() - t0)); const tb = $('#tb'); if (tb) { tb.style.width = left / (SECS * 10) + '%'; tb.style.background = left < 5000 ? 'var(--red)' : left < 9000 ? 'var(--amber)' : 'var(--green)'; } if (!left) answer(-1, t0); }, 100);
  }
  function answer(j, t0) {
    const r = G.rounds[G.cur]; if (r.pick !== null) return; clearInterval(timerId);
    r.pick = j; r.ms = Date.now() - t0; const ok = j >= 0 && r.opts[j] === r.a;
    if (ok) { G.streak++; G.best = Math.max(G.best, G.streak); G.score += 100 + Math.round(Math.max(0, SECS * 1000 - r.ms) / (SECS * 10)) + (G.streak >= 3 ? 25 : 0); } else G.streak = 0;
    app.querySelectorAll('.opt').forEach((b, k) => { b.disabled = true; if (r.opts[k] === r.a) b.classList.add('r'); else if (k === j) b.classList.add('w'); });
    const chosen = j >= 0 ? r.opts[j] : null;
    $('#dfb').innerHTML = `<div class="fb ${ok ? 'ok' : 'bad'}"><b>${ok ? `✓ CORRECT · ${(r.ms / 1000).toFixed(1)} s${G.streak >= 3 ? ' · STREAK BONUS +25' : ''}` : j < 0 ? '⏱ TIME’S UP' : '✕ NOT QUITE'}</b><b style="color:var(--ink);letter-spacing:0;font-size:12.5px">${esc(r.a)}</b>${esc(SVC[r.a][1])}${!ok && chosen ? `<div style="margin-top:6px"><b style="color:var(--red);font-size:10px">YOU PICKED ${esc(chosen.toUpperCase())}</b>${esc(SVC[chosen][1])}</div>` : ''}</div>
      <div class="btnrow"><button class="btn" id="nxBtn">${G.cur < G.rounds.length - 1 ? 'NEXT →' : 'SEE RESULTS'}</button></div>`;
    const nx = $('#nxBtn'); nx.focus(); nx.onclick = next;
    if (!ok && window.STUDY) { const d = STUDY.load(); const id = 'Service Drill|' + r.s; d[id] = { id, course: 'Service Drill', url: location.origin + location.pathname, lesson: CATS[cat(r.a)], q: 'Which service? ' + r.s, a: r.opts, c: r.opts.indexOf(r.a), why: esc(r.a + ': ' + SVC[r.a][1]), w: r.opts.map(o => o === r.a ? null : esc(SVC[o][1])), streak: 0, due: Date.now(), added: Date.now(), miss: ((d[id] || {}).miss || 0) + 1 }; STUDY.store(d); }
  }
  function next() { if (G.cur < G.rounds.length - 1) { G.cur++; ask(); } else results(); }
  function results() {
    const right = G.rounds.filter(r => r.pick >= 0 && r.opts[r.pick] === r.a).length, avg = G.rounds.reduce((s, r) => s + r.ms, 0) / G.rounds.length / 1000;
    const d = db(); const isBest = G.score > (d.best || 0); d.best = Math.max(d.best || 0, G.score); d.games = (d.games || 0) + 1; save(d);
    const miss = G.rounds.filter(r => !(r.pick >= 0 && r.opts[r.pick] === r.a));
    app.innerHTML = `<p class="kicker">DRILL COMPLETE</p><div class="grid g2"><div class="card"><div class="big-score">${G.score}<span class="mute" style="font-size:18px"> pts</span></div>
      <h3 style="margin-top:6px">${isBest ? '🏆 New personal best!' : `Best: ${d.best} pts`}</h3><p class="mute">${right}/${G.rounds.length} correct · avg ${avg.toFixed(1)} s · best streak ${G.best}</p>
      <div class="btnrow"><button class="btn" id="agBtn">PLAY AGAIN</button><button class="btn gh" id="hmBtn">CHANGE CATEGORY</button><button class="btn gh" id="rvBtn">REVIEW MISSES</button></div></div>
      <div class="card"><h3>Missed (${miss.length})</h3>${miss.length ? miss.map(r => `<div class="rv"><div class="q">${esc(r.s)}</div><div><b class="pass">${esc(r.a)}</b>: ${esc(SVC[r.a][1])}</div>${r.pick >= 0 ? `<div class="mute" style="font-size:12px">You: ${esc(r.opts[r.pick])}, ${esc(SVC[r.opts[r.pick]][1])}</div>` : '<div class="mute" style="font-size:12px">Ran out of time</div>'}</div>`).join('') : '<p class="mute">Perfect round! 🎉</p>'}</div></div>`;
    $('#agBtn').onclick = () => start(G.c); $('#hmBtn').onclick = home; $('#rvBtn').onclick = () => STUDY.review(false);
  }
  document.addEventListener('keydown', e => {
    if (!G || document.querySelector('.stdy')) return; const r = G.rounds[G.cur]; if (!r) return;
    const i = '1234'.indexOf(e.key) >= 0 ? '1234'.indexOf(e.key) : 'ABCD'.indexOf(e.key.toUpperCase());
    if (r.pick === null && i >= 0 && $('.dr-scn')) { const b = app.querySelector(`.opt[data-o="${i}"]`); if (b) { b.click(); e.preventDefault(); } }
    else if (r.pick !== null && e.key === 'Enter') { const n = $('#nxBtn'); if (n) { e.preventDefault(); n.click(); } }
  });
  home();
})();
