/* CCP (CLF-C02) exam simulator. */
(function () {
  const $ = s => document.querySelector(s), esc = HUB.esc, L = i => String.fromCharCode(65 + i);
  const KEY = 'ccp-sim-v1';
  const DOM = { concepts: ['Cloud Concepts', .24], security: ['Security & Compliance', .30], tech: ['Cloud Technology & Services', .34], billing: ['Billing, Pricing & Support', .12] };
  const MODES = {
    full: { name: 'Full practice exam', n: 65, min: 90, fb: false, desc: '65 questions · 90 minutes · weighted like CLF-C02 · results at the end' },
    half: { name: 'Half exam', n: 30, min: 42, fb: false, desc: '30 questions · 42 minutes · same weighting · results at the end' },
    quick: { name: 'Quick 10', n: 10, min: 0, fb: true, desc: '10 questions · untimed · instant feedback after each answer' },
    domain: { name: 'Domain practice', n: 20, min: 0, fb: true, desc: '20 questions from one domain · untimed · instant feedback' }
  };
  const db = () => { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { return {}; } };
  const save = d => { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {} };
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const app = $('#app'); let S = null, tick = null;

  /* ---------- pick questions (least-seen first, domain-weighted) ---------- */
  function pick(mode, dom) {
    const seen = db().seen || {}; const by = {};
    EXAM.forEach((q, i) => (by[q[0]] = by[q[0]] || []).push(i));
    const take = (d, n) => shuffle(by[d]).sort((a, b) => (seen[a] || 0) - (seen[b] || 0)).slice(0, n);
    let ids;
    if (mode === 'domain') ids = take(dom, MODES.domain.n);
    else { const n = MODES[mode].n; const counts = {}; let tot = 0; Object.entries(DOM).forEach(([d, [, w]]) => { counts[d] = Math.round(n * w); tot += counts[d]; }); counts.tech += n - tot; ids = Object.keys(counts).flatMap(d => take(d, counts[d])); }
    return shuffle(ids).map(i => { const q = EXAM[i]; const order = shuffle(q[2].map((_, j) => j)); const multi = Array.isArray(q[3]);
      return { i, d: q[0], q: q[1], a: order.map(j => q[2][j]), w: order.map(j => q[5][j]), c: multi ? q[3].map(k => order.indexOf(k)).sort() : order.indexOf(q[3]), multi, need: multi ? q[3].length : 1, why: q[4], ans: null, flag: false }; });
  }

  /* ---------- start screen ---------- */
  function home() {
    clearInterval(tick); S = null; const d = db(); const h = (d.history || []).slice(-8).reverse();
    app.innerHTML = `<p class="kicker">AWS CERTIFIED CLOUD PRACTITIONER · CLF-C02</p><h1>CCP Exam Simulator</h1>
      <p class="mute">${EXAM.length} original practice questions across the four exam domains, each with an explanation for the right answer and for every wrong one. Options are shuffled every time, and questions you've seen least come first. Missed questions go to your <b>My Mistakes</b> deck.</p>
      <div class="grid g2" style="margin-top:16px">${Object.entries(MODES).map(([k, m]) => `<div class="card"><h3>${m.name}</h3><p class="mute" style="margin:4px 0 10px;font-size:12px">${m.desc}</p>
        ${k === 'domain' ? `<div class="seg" id="domSeg">${Object.entries(DOM).map(([dk, [dn]], i) => `<button data-d="${dk}" class="${i ? '' : 'on'}">${dn}</button>`).join('')}</div>` : ''}
        <div class="btnrow"><button class="btn" data-m="${k}">START</button></div></div>`).join('')}</div>
      <h2>EXAM FACTS</h2><div class="grid g4">
        <div class="card"><b>65 questions</b><div class="mute" style="font-size:12px">50 scored + 15 unscored; you can't tell which</div></div>
        <div class="card"><b>90 minutes</b><div class="mute" style="font-size:12px">~83 seconds per question</div></div>
        <div class="card"><b>700 / 1000 to pass</b><div class="mute" style="font-size:12px">Scaled score; no penalty for guessing, so never leave blanks</div></div>
        <div class="card"><b>Weighting</b><div class="mute" style="font-size:12px">Concepts 24% · Security 30% · Technology 34% · Billing 12%</div></div></div>
      ${h.length ? `<h2>YOUR LAST ATTEMPTS</h2><div class="card"><table class="hist"><tr><th>DATE</th><th>MODE</th><th>SCORE</th><th>CORRECT</th><th>TIME</th><th>RESULT</th></tr>${h.map(x => `<tr><td>${new Date(x.at).toLocaleString()}</td><td>${esc(x.label)}</td><td><b>${x.score}</b></td><td>${x.right}/${x.n}</td><td>${Math.round(x.secs / 60)} min</td><td class="${x.score >= 700 ? 'pass' : 'fail'}">${x.score >= 700 ? 'PASS' : 'NOT YET'}</td></tr>`).join('')}</table></div>` : ''}`;
    let dom = 'concepts'; const seg = $('#domSeg'); seg.querySelectorAll('button').forEach(b => b.onclick = () => { dom = b.dataset.d; seg.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b)); });
    app.querySelectorAll('[data-m]').forEach(b => b.onclick = () => start(b.dataset.m, dom));
  }

  /* ---------- run ---------- */
  function start(mode, dom) {
    const m = MODES[mode]; S = { mode, dom, label: mode === 'domain' ? `Domain: ${DOM[dom][0]}` : m.name, fb: m.fb, qs: pick(mode, dom), cur: 0, t0: Date.now(), end: m.min ? Date.now() + m.min * 60000 : 0, done: false };
    clearInterval(tick); if (S.end) tick = setInterval(timer, 500); render(); window.scrollTo(0, 0);
  }
  function timer() { if (!S || S.done) return; const left = Math.max(0, S.end - Date.now()); const el = $('#tm'); if (el) { const mm = Math.floor(left / 60000), ss = Math.floor(left / 1000) % 60; el.textContent = `${mm}:${String(ss).padStart(2, '0')}`; el.classList.toggle('low', left < 300000); } if (!left) { HUB.toast('Time is up! Submitting.'); finish(); } }
  function answered(q) { return q.ans != null && (!q.multi || q.ans.length === q.need); }
  function correct(q) { return q.multi ? (q.ans || []).slice().sort().join() === q.c.join() : q.ans === q.c; }
  function render() {
    const q = S.qs[S.cur], n = S.qs.length, reveal = S.fb && q.locked;
    app.innerHTML = `<div class="ex-top"><span class="tag">${esc(S.label.toUpperCase())}</span><span class="pill">${DOM[q.d][0]}</span><b>Question ${S.cur + 1} of ${n}</b>
        <button class="tbtn flag ${q.flag ? 'on' : ''}" id="flagBtn">⚑ ${q.flag ? 'FLAGGED' : 'FLAG FOR REVIEW'}</button>${S.end ? `<span class="timer" id="tm"></span>` : ''}</div>
      <div class="bar" style="margin-bottom:14px"><i style="width:${S.qs.filter(answered).length / n * 100}%"></i></div>
      <div class="card"><div class="ex-q">${esc(q.q)}</div>${q.multi ? `<div class="mute" style="font-size:11.5px;margin:-8px 0 6px">Select ${q.need}.</div>` : ''}
        ${q.a.map((a, j) => { const sel = q.multi ? (q.ans || []).includes(j) : q.ans === j; const isC = q.multi ? q.c.includes(j) : q.c === j;
          return `<button class="opt ${reveal ? (isC ? 'r' : sel ? 'w' : '') : sel ? 'sel' : ''}" data-o="${j}" ${reveal ? 'disabled' : ''}><span class="lt">${L(j)}</span><span>${esc(a)}${reveal && q.w[j] && (sel || !isC) ? `<span class="ex">${esc(q.w[j])}</span>` : ''}</span></button>`; }).join('')}
        ${reveal ? `<div class="fb ${correct(q) ? 'ok' : 'bad'}"><b>${correct(q) ? '✓ CORRECT' : '✕ NOT QUITE · CORRECT: ' + (q.multi ? q.c.map(L).join(' + ') : L(q.c))}</b>${esc(q.why)}</div>` : ''}
        ${S.fb && q.multi && !q.locked ? `<div class="btnrow"><button class="btn" id="chkBtn" ${answered(q) ? '' : 'disabled'}>CHECK ANSWER</button></div>` : ''}
      </div>
      <div class="btnrow"><button class="btn gh" id="prevBtn" ${S.cur ? '' : 'disabled'}>← PREV</button>${S.cur < n - 1 ? `<button class="btn" id="nextBtn">NEXT →</button>` : ''}<button class="btn ${S.cur === n - 1 ? '' : 'gh'}" id="subBtn" style="margin-left:auto">${S.fb ? 'FINISH' : 'REVIEW & SUBMIT'}</button></div>
      <div class="navg">${S.qs.map((x, i) => `<button data-g="${i}" class="${S.fb && x.locked ? (correct(x) ? 'ok' : 'no') : answered(x) ? 'a' : ''} ${x.flag ? 'f' : ''} ${i === S.cur ? 'c' : ''}" title="Question ${i + 1}">${i + 1}</button>`).join('')}</div>
      <p class="mute" style="font-size:11px;margin-top:10px">Keys: A–E select · ← → move · F flag${S.fb ? ' · Enter check/next' : ''}</p>`;
    if (S.end) timer();
    app.querySelectorAll('.opt').forEach(b => b.onclick = () => choose(+b.dataset.o));
    $('#flagBtn').onclick = () => { q.flag = !q.flag; render(); };
    $('#prevBtn').onclick = () => go(S.cur - 1); const nb = $('#nextBtn'); if (nb) nb.onclick = () => go(S.cur + 1);
    $('#subBtn').onclick = () => S.fb ? finish() : review();
    const cb = $('#chkBtn'); if (cb) cb.onclick = () => { q.locked = true; log(q); render(); };
    app.querySelectorAll('[data-g]').forEach(b => b.onclick = () => go(+b.dataset.g));
  }
  function choose(j) {
    const q = S.qs[S.cur]; if (S.fb && q.locked) return;
    if (q.multi) { const a = q.ans || []; q.ans = a.includes(j) ? a.filter(x => x !== j) : a.length < q.need ? a.concat(j) : a.slice(1).concat(j); }
    else q.ans = j;
    if (S.fb && !q.multi) { q.locked = true; log(q); }
    render();
  }
  function log(q) { if (!correct(q) && !q.multi && window.STUDY) addMistake(q); }
  function go(i) { if (i < 0 || i >= S.qs.length) return; S.cur = i; render(); }
  function review() {
    const un = S.qs.map((q, i) => answered(q) ? null : i + 1).filter(Boolean), fl = S.qs.map((q, i) => q.flag ? i + 1 : null).filter(Boolean);
    app.innerHTML = `<p class="kicker">REVIEW BEFORE SUBMITTING</p><h1>Ready to submit?</h1><div class="grid g2">
      <div class="card"><h3>Unanswered: ${un.length}</h3><p class="mute">${un.length ? 'Questions ' + un.join(', ') + '. There’s no penalty for guessing, so answer everything.' : 'All questions answered. 👍'}</p></div>
      <div class="card"><h3>Flagged: ${fl.length}</h3><p class="mute">${fl.length ? 'Questions ' + fl.join(', ') : 'None flagged.'}</p></div></div>
      <div class="navg">${S.qs.map((x, i) => `<button data-g="${i}" class="${answered(x) ? 'a' : ''} ${x.flag ? 'f' : ''}">${i + 1}</button>`).join('')}</div>
      <div class="btnrow"><button class="btn gh" id="backBtn">← BACK TO QUESTIONS</button><button class="btn" id="goBtn">SUBMIT EXAM</button></div>`;
    $('#backBtn').onclick = () => render(); $('#goBtn').onclick = finish;
    app.querySelectorAll('[data-g]').forEach(b => b.onclick = () => go(+b.dataset.g));
  }
  function addMistake(q) {
    const d = STUDY.load(); const id = 'CCP Exam Simulator|' + q.i;
    const orig = EXAM[q.i]; d[id] = { id, course: 'CCP Exam Simulator', url: location.origin + location.pathname, lesson: DOM[q.d][0], q: orig[1], a: orig[2], c: orig[3], why: esc(orig[4]), w: orig[5].map(x => x && esc(x)), streak: 0, due: Date.now(), added: Date.now(), miss: ((d[id] || {}).miss || 0) + 1 };
    STUDY.store(d);
  }
  function finish() {
    if (S.done) return; S.done = true; clearInterval(tick);
    const n = S.qs.length, right = S.qs.filter(correct).length, secs = Math.round((Date.now() - S.t0) / 1000);
    const score = Math.max(100, Math.round(right / n * 1000)); const per = {};
    S.qs.forEach(q => { per[q.d] = per[q.d] || [0, 0]; per[q.d][1]++; if (correct(q)) per[q.d][0]++; });
    if (!S.fb) S.qs.forEach(q => { if (!correct(q) && !q.multi) addMistake(q); });
    const d = db(); d.seen = d.seen || {}; S.qs.forEach(q => d.seen[q.i] = (d.seen[q.i] || 0) + 1);
    d.history = (d.history || []).concat({ at: Date.now(), mode: S.mode, label: S.label, n, right, score, secs }).slice(-50); save(d);
    S.qs.forEach(q => q.locked = true);
    const weak = Object.entries(per).sort((a, b) => a[1][0] / a[1][1] - b[1][0] / b[1][1])[0];
    let filter = 'wrong';
    const draw = () => {
      app.innerHTML = `<p class="kicker">RESULTS · ${esc(S.label.toUpperCase())}</p>
        <div class="grid g2"><div class="card"><div class="big-score ${score >= 700 ? 'pass' : 'fail'}">${score}<span style="font-size:18px" class="mute"> / 1000</span></div>
          <h3 style="margin-top:8px" class="${score >= 700 ? 'pass' : 'fail'}">${score >= 700 ? '✓ PASS (estimate)' : '✕ NOT YET: 700 needed'}</h3>
          <p class="mute" style="font-size:12px">${right} of ${n} correct · ${Math.floor(secs / 60)} min ${secs % 60} s. Score is your % correct × 1000 as a rough estimate; the real exam uses a scaled score.${weak ? ` Weakest domain: <b>${DOM[weak[0]][0]}</b>.` : ''}</p>
          <div class="btnrow"><button class="btn" id="againBtn">NEW EXAM</button>${weak ? `<button class="btn gh" id="weakBtn">PRACTICE ${esc(DOM[weak[0]][0].toUpperCase())}</button>` : ''}<button class="btn gh" id="revBtn">REVIEW MY MISTAKES</button></div></div>
        <div class="card"><h3>By domain</h3>${Object.entries(DOM).filter(([k]) => per[k]).map(([k, [nm, w]]) => { const [r, t] = per[k], p = Math.round(r / t * 100); return `<div class="dom"><span>${nm}<br><small class="mute">${Math.round(w * 100)}% of exam</small></span><div class="bar"><i style="width:${p}%;background:${p >= 70 ? 'var(--green)' : p >= 50 ? 'var(--amber)' : 'var(--red)'}"></i></div><b>${r}/${t}</b></div>`; }).join('')}</div></div>
        <h2>ANSWER REVIEW</h2><div class="seg" id="rvSeg">${[['wrong', 'WRONG'], ['flag', 'FLAGGED'], ['all', 'ALL']].map(([k, t]) => `<button data-f="${k}" class="${filter === k ? 'on' : ''}">${t}</button>`).join('')}</div>
        <div class="card" style="margin-top:10px">${S.qs.map((q, i) => ({ q, i })).filter(({ q }) => filter === 'all' || (filter === 'wrong' ? !correct(q) : q.flag)).map(({ q, i }) => `<div class="rv"><div class="q">${correct(q) ? '✓' : '✕'} ${i + 1}. ${esc(q.q)} <span class="pill">${DOM[q.d][0]}</span></div>
          ${q.a.map((a, j) => { const sel = q.multi ? (q.ans || []).includes(j) : q.ans === j, isC = q.multi ? q.c.includes(j) : q.c === j; return `<div class="opt ${isC ? 'r' : sel ? 'w' : ''}" style="cursor:default"><span class="lt">${L(j)}</span><span>${esc(a)}${sel ? ' <b>(your answer)</b>' : ''}${q.w[j] ? `<span class="ex">${esc(q.w[j])}</span>` : ''}</span></div>`; }).join('')}
          <div class="fb"><b>WHY</b>${esc(q.why)}</div></div>`).join('') || '<p class="mute">Nothing here. 🎉</p>'}</div>`;
      $('#againBtn').onclick = home; const wb = $('#weakBtn'); if (wb) wb.onclick = () => start('domain', weak[0]); $('#revBtn').onclick = () => STUDY.review(false);
      app.querySelectorAll('[data-f]').forEach(b => b.onclick = () => { filter = b.dataset.f; draw(); });
    };
    draw(); window.scrollTo(0, 0); if (window.STUDY) STUDY.refreshBadge();
  }
  document.addEventListener('keydown', e => {
    if (!S || S.done || document.querySelector('.st') || !$('.ex-q')) return; const q = S.qs[S.cur]; const k = e.key.toUpperCase(); const i = 'ABCDE'.indexOf(k);
    if (i >= 0 && i < q.a.length) { choose(i); e.preventDefault(); }
    else if (e.key === 'ArrowRight') go(S.cur + 1); else if (e.key === 'ArrowLeft') go(S.cur - 1);
    else if (k === 'F') { q.flag = !q.flag; render(); }
    else if (e.key === 'Enter' && S.fb) { e.preventDefault(); const cb = $('#chkBtn'); if (cb && !cb.disabled) cb.click(); else if (q.locked) S.cur < S.qs.length - 1 ? go(S.cur + 1) : finish(); }
  });
  window.addEventListener('beforeunload', e => { if (S && !S.done && S.qs.some(answered)) { e.preventDefault(); e.returnValue = ''; } });
  home();
})();
