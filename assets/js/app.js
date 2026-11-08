/* =========================================================================
   ONE STEP AT A TIME — APP
   Plain JavaScript, no build step, no internet needed. Everything the
   reader types is stored only in this browser (localStorage).
   ========================================================================= */
(function () {
  "use strict";
  var C = window.SBS_CONFIG, SESSIONS = window.SBS_CONTENT.sessions;
  var KEY = "oneStepAtATime_v1";
  var main = document.getElementById("main");

  /* ---------- storage (fails safely if storage is blocked) ---------- */
  var state = defaults();
  try { var saved = JSON.parse(localStorage.getItem(KEY)); if (saved) state = Object.assign(defaults(), saved); } catch (e) {}
  function defaults() { return { character: null, completed: [], checkins: {}, answers: {}, startedAt: null }; }
  function persist() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }
  function ans(id) { return state.answers[id]; }
  function setAns(id, v) { state.answers[id] = v; persist(); }

  /* ---------- helpers ---------- */
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function person() { return C.characters.find(function (c) { return c.id === state.character; }) || C.characters[0]; }
  function fill(t) { return String(t).replace(/\{P\}/g, esc(person().name)).replace(/\{G\}/g, esc(C.guide.name)); }
  function h(html) { var d = document.createElement("div"); d.innerHTML = html.trim(); return d.firstElementChild; }
  function toast(msg) { var t = document.getElementById("toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toast._t); toast._t = setTimeout(function () { t.classList.remove("show"); }, 2600); }
  function unlocked(i) { return i === 0 || !C.sequentialUnlock || state.completed.indexOf(i - 1) > -1; }
  function done(i) { return state.completed.indexOf(i) > -1; }
  function crisisConfigured() { return !!(C.crisis.emergencyNumber || (C.crisis.lines && C.crisis.lines.length)); }

  /* ---------- illustrated avatars (original, simple SVG) ---------- */
  function avatar(p, size) {
    size = size || 72;
    var hair = "";
    if (p.hairStyle === "wrap") hair = '<path d="M14 34 C14 12 58 12 58 34 C52 26 20 26 14 34Z" fill="' + p.shirt + '"/><circle cx="56" cy="20" r="7" fill="' + p.shirt + '"/>';
    else if (p.hairStyle === "bun") hair = '<path d="M16 34 C16 16 56 16 56 34 C50 26 22 26 16 34Z" fill="' + p.hair + '"/><circle cx="36" cy="13" r="7" fill="' + p.hair + '"/>';
    else hair = '<path d="M17 32 C17 17 55 17 55 32 C49 25 23 25 17 32Z" fill="' + p.hair + '"/>';
    return '<svg class="avatar" width="' + size + '" height="' + size + '" viewBox="0 0 72 72" aria-hidden="true">' +
      '<circle cx="36" cy="36" r="36" fill="var(--avatar-bg)"/>' +
      '<path d="M12 72 C12 54 60 54 60 72Z" fill="' + p.shirt + '"/>' +
      '<rect x="31" y="46" width="10" height="9" rx="3" fill="' + p.skin + '"/>' +
      '<ellipse cx="36" cy="35" rx="17" ry="18" fill="' + p.skin + '"/>' + hair +
      '<circle cx="30" cy="36" r="1.8" fill="#1a1a1a"/><circle cx="42" cy="36" r="1.8" fill="#1a1a1a"/>' +
      '<path d="M30 44 Q36 48 42 44" stroke="#1a1a1a" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg>';
  }

  /* ---------- router ---------- */
  function route() {
    var hash = location.hash.replace(/^#\/?/, "");
    var parts = hash.split("/");
    document.querySelectorAll("[data-nav]").forEach(function (a) {
      a.classList.toggle("active", a.dataset.nav === (parts[0] || "home") || (parts[0] === "session" && a.dataset.nav === "home"));
    });
    main.innerHTML = "";
    if (parts[0] === "session") renderSession(parseInt(parts[1], 10) || 0, 0);
    else if (parts[0] === "toolbox") renderToolbox();
    else if (parts[0] === "workbook") renderWorkbook();
    else if (parts[0] === "help") renderHelp();
    else if (parts[0] === "about") renderAbout();
    else renderHome();
    window.scrollTo(0, 0);
    main.focus({ preventScroll: true });
  }
  window.addEventListener("hashchange", route);

  /* ================================================================ HOME */
  function renderHome() {
    var next = SESSIONS.find(function (s) { return !done(s.id) && unlocked(s.id); });
    var p = person();
    var hero = h('<section class="hero">' +
      '<div class="hero-text"><p class="eyebrow">' + esc(C.organisation || "Guided self-help") + '</p>' +
      '<h1>' + esc(C.programmeName) + '</h1><p class="lead">' + esc(C.tagline) + '</p>' +
      (next ? '<a class="btn primary" href="#/session/' + next.id + '">' + (state.completed.length ? "Continue: " : "Begin: ") + esc(next.title) + '</a>'
            : '<p class="pill done-pill">All sessions complete — well done.</p>') +
      '</div><div class="hero-art">' + avatar(C.guide, 96) + (state.character ? avatar(p, 96) : avatar(C.characters[0], 96)) + '</div></section>');
    main.appendChild(hero);

    var pct = Math.round(state.completed.length / SESSIONS.length * 100);
    main.appendChild(h('<div class="progress-line" aria-label="Progress"><div class="bar"><span style="width:' + pct + '%"></span></div><span>' + state.completed.length + ' of ' + SESSIONS.length + ' complete</span></div>'));

    var list = h('<ol class="session-list"></ol>');
    SESSIONS.forEach(function (s) {
      var st = done(s.id) ? "done" : unlocked(s.id) ? "open" : "locked";
      var label = st === "done" ? "Completed" : st === "open" ? "Ready" : "Locked";
      var el = h('<li class="session-card ' + st + '">' +
        '<div class="num">' + (st === "done" ? "✓" : esc(s.short)) + '</div>' +
        '<div class="body"><h2>' + esc(s.title) + '</h2><p>' + esc(s.goal) + '</p>' +
        '<p class="meta">About ' + s.minutes + ' minutes · <span class="status">' + label + '</span></p></div>' +
        (st === "locked" ? '<span class="lock" aria-hidden="true">🔒</span>' :
          '<a class="btn ' + (st === "done" ? "ghost" : "primary") + '" href="#/session/' + s.id + '">' + (st === "done" ? "Review" : "Start") + '</a>') +
        '</li>');
      list.appendChild(el);
    });
    main.appendChild(list);
    if (C.sequentialUnlock) main.appendChild(h('<p class="muted small center">Each session opens when you finish the one before. We suggest about one a week.</p>'));
    if (C.helper.enabled) main.appendChild(h('<aside class="callout"><strong>Your helper.</strong> ' + esc(C.helper.contactText) + (C.helper.contactDetails ? ' <br>' + esc(C.helper.contactDetails) : '') + '</aside>'));
  }

  /* ============================================================= SESSION */
  function renderSession(id, idx) {
    var s = SESSIONS[id];
    if (!s) { location.hash = "#/"; return; }
    if (!unlocked(id)) {
      main.appendChild(h('<section class="panel center"><h1>Not open yet</h1><p>Please finish the session before this one first. The skills build on each other.</p><a class="btn primary" href="#/">Back to sessions</a></section>'));
      return;
    }
    if (!state.startedAt) { state.startedAt = new Date().toISOString(); persist(); }
    var slides = s.slides;
    main.innerHTML = "";
    var wrap = h('<section class="player" aria-labelledby="sessTitle">' +
      '<div class="player-head"><a href="#/" class="back-link">← Sessions</a>' +
      '<h1 id="sessTitle">' + (id ? "Session " + id + ": " : "") + esc(s.title) + '</h1>' +
      '<div class="bar slim"><span style="width:' + Math.round((idx + 1) / slides.length * 100) + '%"></span></div>' +
      '<p class="muted small">' + (idx + 1) + ' / ' + slides.length + '</p></div>' +
      '<div class="slide" aria-live="polite"></div>' +
      '<div class="player-nav"><button class="btn ghost" data-act="prev"' + (idx === 0 ? " disabled" : "") + '>Back</button>' +
      '<button class="btn primary" data-act="next">' + (idx === slides.length - 1 ? "Finish session" : "Next") + '</button></div></section>');
    main.appendChild(wrap);
    var slideEl = wrap.querySelector(".slide");
    var nextBtn = wrap.querySelector('[data-act="next"]');
    var guard = renderSlide(slides[idx], slideEl, id, nextBtn);

    wrap.querySelector('[data-act="prev"]').onclick = function () { renderSession(id, idx - 1); window.scrollTo(0, 0); };
    nextBtn.onclick = function () {
      if (guard && !guard()) return;
      if (idx < slides.length - 1) { renderSession(id, idx + 1); window.scrollTo(0, 0); }
      else {
        if (!done(id)) state.completed.push(id);
        persist();
        toast(id === SESSIONS.length - 1 ? "Programme complete. Well done!" : "Session complete. Well done!");
        location.hash = "#/";
      }
    };
  }

  function renderSlide(sl, el, sessId, nextBtn) {
    if (sl.type === "story") {
      var who = sl.who === "guide" ? C.guide : person();
      var name = sl.who === "guide" ? C.guide.name : person().name;
      el.appendChild(h('<div class="story ' + sl.who + '">' + avatar(who, 84) +
        '<div class="bubble"><p class="speaker">' + esc(name) + '</p><p>' + fill(sl.text) + '</p></div></div>'));
    } else if (sl.type === "info") {
      el.appendChild(h('<article class="info"><h2>' + esc(sl.title) + '</h2>' + (sl.visual === "cycle" ? cycleSVG() : "") + '<div>' + fill(sl.body) + '</div></article>'));
    } else if (sl.type === "summary") {
      el.appendChild(h('<article class="info summary">' + (sl.final ? '<div class="celebrate" aria-hidden="true">★</div>' : "") +
        '<h2>' + (sl.final ? "You did it" : "Session summary") + '</h2>' +
        '<h3>What we covered</h3><ul class="ticks">' + sl.points.map(function (p) { return "<li>" + fill(p) + "</li>"; }).join("") + '</ul>' +
        '<h3>Practise this week</h3><ul class="arrows">' + sl.practice.map(function (p) { return "<li>" + fill(p) + "</li>"; }).join("") + '</ul></article>'));
    } else if (sl.type === "checkin") {
      return checkin(el, sessId, nextBtn);
    } else if (sl.type === "exercise") {
      return exercise(sl, el, nextBtn);
    }
    return null;
  }

  /* ---------- weekly check-in (with safety question) ---------- */
  function checkin(el, sessId, nextBtn) {
    var c = state.checkins[sessId] || {};
    el.appendChild(h('<article class="info checkin"><h2>How are you this week?</h2><p class="muted">Think about the past 7 days. There are no right or wrong answers.</p>' +
      scaleHTML("ci_mood", "How has your mood been?", "Very low", "Very good", c.mood) +
      scaleHTML("ci_func", "How well have you managed daily tasks (work, home, caring for others)?", "Not at all", "Very well", c.func) +
      scaleHTML("ci_stress", "How stressed or worried have you felt?", "Not at all", "Extremely", c.stress) +
      '<fieldset class="safety"><legend>In the past week, have you had thoughts that life isn’t worth living, or thoughts of ending your life?</legend>' +
      ["no:No", "sometimes:Sometimes", "often:Often", "skip:I’d prefer not to say"].map(function (o) {
        var v = o.split(":"); return '<label class="radio"><input type="radio" name="ci_safe" value="' + v[0] + '"' + (c.safety === v[0] ? " checked" : "") + '> ' + v[1] + '</label>';
      }).join("") + '</fieldset><div class="safety-msg"></div></article>'));
    var msg = el.querySelector(".safety-msg");
    function save() {
      var get = function (n) { var i = el.querySelector('[name="' + n + '"]'); return i && i.dataset.touched ? +i.value : undefined; };
      var r = el.querySelector('[name="ci_safe"]:checked');
      state.checkins[sessId] = { date: new Date().toISOString(), mood: get("ci_mood"), func: get("ci_func"), stress: get("ci_stress"), safety: r ? r.value : undefined };
      persist();
      showSafety(r ? r.value : null);
    }
    function showSafety(v) {
      if (v === "sometimes" || v === "often") {
        msg.innerHTML = '<div class="alert"><h3>Thank you for telling us.</h3><p>Having these thoughts is a sign you are carrying a lot right now, and you deserve support from a person — not just this guide.</p>' +
          '<p><strong>Please talk to someone today:</strong> a health worker, your doctor, or someone you trust.' + (C.helper.enabled ? " You can also contact your helper." : "") + '</p>' +
          '<p>If you might act on these thoughts or are in danger, get help now.</p><a class="btn danger" href="#/help">See urgent help</a></div>';
      } else if (v === "skip") {
        msg.innerHTML = '<div class="note">That’s alright. If you ever have these thoughts, <a href="#/help">urgent help</a> is always one tap away.</div>';
      } else msg.innerHTML = "";
    }
    bindScales(el, save);
    el.querySelectorAll('[name="ci_safe"]').forEach(function (r) { r.onchange = save; });
    showSafety(c.safety);
    return function () {
      if (!el.querySelector('[name="ci_safe"]:checked')) { toast("Please answer the last question (you can choose “prefer not to say”)."); return false; }
      return true;
    };
  }

  function scaleHTML(name, label, lo, hi, val) {
    var touched = val !== undefined && val !== null;
    return '<div class="scale"><label for="' + name + '">' + esc(label) + '</label>' +
      '<div class="scale-row"><span>' + esc(lo) + '</span><input type="range" min="0" max="10" step="1" id="' + name + '" name="' + name + '" value="' + (touched ? val : 5) + '"' + (touched ? ' data-touched="1"' : "") + '><span>' + esc(hi) + '</span></div>' +
      '<output for="' + name + '">' + (touched ? val : "–") + '</output></div>';
  }
  function bindScales(el, onChange) {
    el.querySelectorAll('input[type="range"]').forEach(function (r) {
      var out = el.querySelector('output[for="' + r.id + '"]');
      r.oninput = function () { r.dataset.touched = "1"; out.textContent = r.value; onChange(); };
    });
  }

  /* ---------- exercises ---------- */
  function exercise(sl, el, nextBtn) {
    var box = h('<article class="info exercise"><span class="tag">Your turn</span><h2>' + fill(sl.prompt) + '</h2>' + (sl.hint ? '<p class="muted">' + fill(sl.hint) + '</p>' : "") + '<div class="ex-body"></div><p class="saved muted small" aria-live="polite"></p></article>');
    el.appendChild(box);
    var body = box.querySelector(".ex-body");
    var savedNote = box.querySelector(".saved");
    function saved() { savedNote.textContent = "Saved on this device"; }
    var v = ans(sl.id);

    switch (sl.kind) {
      case "character":
        body.appendChild(h('<div class="char-pick">' + C.characters.map(function (c) {
          return '<button type="button" class="char' + (state.character === c.id ? " sel" : "") + '" data-id="' + c.id + '">' + avatar(c, 88) + '<strong>' + esc(c.name) + '</strong><span>' + esc(c.blurb) + '</span></button>';
        }).join("") + '</div>'));
        body.querySelectorAll(".char").forEach(function (b) {
          b.onclick = function () { state.character = b.dataset.id; persist(); body.querySelectorAll(".char").forEach(function (x) { x.classList.toggle("sel", x === b); }); saved(); };
        });
        return function () { if (!state.character) { toast("Please choose who to follow."); return false; } return true; };

      case "text":
        var ta = h('<textarea rows="4" placeholder="' + esc(fill(sl.placeholder || "")) + '"></textarea>');
        ta.value = v || ""; ta.oninput = function () { setAns(sl.id, ta.value); saved(); };
        body.appendChild(ta); break;

      case "list":
        v = v || [];
        for (var i = 0; i < sl.count; i++) (function (i) {
          var inp = h('<input type="text" class="list-in" placeholder="' + esc(sl.placeholder || "") + ' ' + (i + 1) + '">');
          inp.value = v[i] || "";
          inp.oninput = function () { var a = ans(sl.id) || []; a[i] = inp.value; setAns(sl.id, a); saved(); };
          body.appendChild(inp);
        })(i);
        break;

      case "choices":
        v = v || { picked: [], other: "" };
        var grid = h('<div class="chips"></div>');
        sl.options.forEach(function (o) {
          var lab = h('<label class="chip"><input type="checkbox"> <span>' + esc(o) + '</span></label>');
          var cb = lab.querySelector("input"); cb.checked = v.picked.indexOf(o) > -1;
          cb.onchange = function () { var a = ans(sl.id) || { picked: [], other: "" }; a.picked = a.picked.filter(function (x) { return x !== o; }); if (cb.checked) a.picked.push(o); setAns(sl.id, a); saved(); };
          grid.appendChild(lab);
        });
        body.appendChild(grid);
        if (sl.other) {
          var oth = h('<input type="text" placeholder="Something else (optional)">'); oth.value = v.other || "";
          oth.oninput = function () { var a = ans(sl.id) || { picked: [], other: "" }; a.other = oth.value; setAns(sl.id, a); saved(); };
          body.appendChild(oth);
        }
        break;

      case "planner":
        body.appendChild(plannerEl(sl.id, sl.rows, saved)); break;

      case "review":
        var plan = (ans(sl.source) || []).filter(function (r) { return r && r.what; });
        if (!plan.length) { body.appendChild(h('<p class="note">You didn’t write down a plan last time — that’s fine. Think about anything you did this week, however small. What did you notice?</p>')); var t2 = h('<textarea rows="3"></textarea>'); t2.value = (v && v.note) || ""; t2.oninput = function () { setAns(sl.id, { note: t2.value }); saved(); }; body.appendChild(t2); break; }
        v = v || {};
        plan.forEach(function (r, i) {
          var cur = v[i] || {};
          var row = h('<div class="review-row"><p class="what"><strong>' + esc(r.what) + '</strong>' + (r.when ? ' <span class="muted">— ' + esc(r.when) + '</span>' : "") + '</p>' +
            '<div class="seg" role="radiogroup" aria-label="Did you do it?">' + ["Yes", "Partly", "Not this time"].map(function (o) { return '<button type="button" class="seg-b' + (cur.done === o ? " sel" : "") + '">' + o + '</button>'; }).join("") + '</div>' +
            '<label class="small muted">How did you feel afterwards? <select><option value="">—</option><option>Worse</option><option>About the same</option><option>A little better</option><option>Much better</option></select></label></div>');
          row.querySelectorAll(".seg-b").forEach(function (b) {
            b.onclick = function () { var a = ans(sl.id) || {}; a[i] = a[i] || {}; a[i].done = b.textContent; setAns(sl.id, a); row.querySelectorAll(".seg-b").forEach(function (x) { x.classList.toggle("sel", x === b); }); saved(); };
          });
          var sel = row.querySelector("select"); sel.value = cur.feel || "";
          sel.onchange = function () { var a = ans(sl.id) || {}; a[i] = a[i] || {}; a[i].feel = sel.value; setAns(sl.id, a); saved(); };
          body.appendChild(row);
        });
        body.appendChild(h('<p class="muted small">Whatever happened, noticing it is useful. Missed activities tell us what to make smaller next time.</p>'));
        break;

      case "pairs":
        v = v || [];
        for (var j = 0; j < sl.count; j++) (function (j) {
          var cur = v[j] || {};
          var row = h('<div class="pair"><label><span>' + esc(sl.left) + '</span><textarea rows="2"></textarea></label><span class="arrow" aria-hidden="true">→</span><label><span>' + esc(sl.right) + '</span><textarea rows="2"></textarea></label></div>');
          var tas = row.querySelectorAll("textarea"); tas[0].value = cur.a || ""; tas[1].value = cur.b || "";
          tas.forEach(function (t, k) { t.oninput = function () { var a = ans(sl.id) || []; a[j] = a[j] || {}; a[j][k ? "b" : "a"] = t.value; setAns(sl.id, a); saved(); }; });
          body.appendChild(row);
        })(j);
        break;

      case "scale":
        body.appendChild(h(scaleHTML(sl.id + "_r", "", sl.min, sl.max, v)));
        bindScales(body, function () { setAns(sl.id, +body.querySelector("input").value); saved(); });
        break;

      case "breathing":
        body.appendChild(breathingEl()); break;

      case "progress":
        body.appendChild(progressEl()); break;
    }
    return null;
  }

  function plannerEl(id, rows, onSave) {
    var v = ans(id) || [];
    var wrap = h('<div class="planner"><div class="planner-head"><span>Activity</span><span>When</span></div></div>');
    var days = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "Every day"];
    for (var i = 0; i < rows; i++) (function (i) {
      var cur = v[i] || {};
      var row = h('<div class="planner-row"><input type="text" placeholder="e.g. Walk to the market and back" aria-label="Activity ' + (i + 1) + '">' +
        '<div class="when"><select aria-label="Day">' + days.map(function (d) { return '<option value="' + d + '">' + (d || "Day…") + '</option>'; }).join("") + '</select>' +
        '<input type="text" placeholder="Time" aria-label="Time" class="time"></div></div>');
      var a = row.querySelector('input[type="text"]'), d = row.querySelector("select"), t = row.querySelector(".time");
      a.value = cur.what || ""; d.value = cur.day || ""; t.value = cur.time || "";
      function save() { var arr = ans(id) || []; arr[i] = { what: a.value, day: d.value, time: t.value, when: [d.value, t.value].filter(Boolean).join(", ") }; setAns(id, arr); onSave && onSave(); }
      a.oninput = save; d.onchange = save; t.oninput = save;
      wrap.appendChild(row);
    })(i);
    return wrap;
  }

  /* ---------- slow breathing widget ---------- */
  function breathingEl() {
    var IN = 4000, OUT = 6000, TOTAL = 120;
    var w = h('<div class="breath"><div class="breath-stage"><div class="breath-circle"></div><p class="breath-word">Ready</p></div>' +
      '<p class="breath-time muted">2:00</p><div class="row-center"><button type="button" class="btn primary" data-b="go">Start</button>' +
      '<label class="small muted"><input type="checkbox" data-b="sound"> Gentle sound</label></div></div>');
    var circle = w.querySelector(".breath-circle"), word = w.querySelector(".breath-word"), time = w.querySelector(".breath-time"), btn = w.querySelector('[data-b="go"]');
    var running = false, timer = null, ticker = null, left = TOTAL, ac = null;
    function tone(f) {
      if (!w.querySelector('[data-b="sound"]').checked) return;
      try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); var o = ac.createOscillator(), g = ac.createGain(); o.frequency.value = f; g.gain.setValueAtTime(0.0001, ac.currentTime); g.gain.exponentialRampToValueAtTime(0.08, ac.currentTime + 0.1); g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.9); o.connect(g); g.connect(ac.destination); o.start(); o.stop(ac.currentTime + 1); } catch (e) {}
    }
    function phase(inhale) {
      if (!running) return;
      circle.style.transitionDuration = (inhale ? IN : OUT) + "ms";
      circle.classList.toggle("big", inhale);
      word.textContent = inhale ? "Breathe in… 1 2 3 4" : "Breathe out… 1 2 3 4 5 6";
      tone(inhale ? 392 : 294);
      timer = setTimeout(function () { phase(!inhale); }, inhale ? IN : OUT);
    }
    function stop(finished) {
      running = false; clearTimeout(timer); clearInterval(ticker);
      circle.classList.remove("big"); btn.textContent = "Start again";
      word.textContent = finished ? "Well done. Notice how your body feels." : "Paused";
      left = TOTAL;
    }
    btn.onclick = function () {
      if (running) return stop(false);
      running = true; btn.textContent = "Stop"; left = TOTAL; time.textContent = "2:00";
      ticker = setInterval(function () { left--; time.textContent = Math.floor(left / 60) + ":" + String(left % 60).padStart(2, "0"); if (left <= 0) stop(true); }, 1000);
      phase(true);
    };
    window.addEventListener("hashchange", function () { if (running) stop(false); }, { once: true });
    return w;
  }

  /* ---------- progress chart ---------- */
  function progressEl() {
    var rows = SESSIONS.map(function (s) { return { s: s, c: state.checkins[s.id] }; }).filter(function (r) { return r.c && r.c.mood !== undefined; });
    if (rows.length < 2) return h('<p class="note">Your check-ins will appear here once you have completed at least two.</p>');
    var metric = function (key, label, cls, invert) {
      return '<div class="chart"><h4>' + label + '</h4><div class="bars">' + rows.map(function (r) {
        var val = r.c[key]; if (val === undefined) val = 0;
        return '<div class="b"><span class="fill ' + cls + '" style="height:' + (val * 10) + '%"></span><em>' + val + '</em><small>' + (r.s.id ? "S" + r.s.id : "Start") + '</small></div>';
      }).join("") + '</div>' + (invert ? '<p class="muted small">Lower is better</p>' : '<p class="muted small">Higher is better</p>') + '</div>';
    };
    return h('<div class="charts">' + metric("mood", "Mood", "m") + metric("func", "Managing daily tasks", "f") + metric("stress", "Stress", "s", true) + '</div>');
  }

  /* ---------- cycle diagram ---------- */
  function cycleSVG() {
    return '<svg class="cycle" viewBox="0 0 360 220" role="img" aria-label="Cycle: feel low, do less, fewer good moments and more problems, feel even lower">' +
      '<defs><marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--accent)"/></marker></defs>' +
      '<g font-size="13" text-anchor="middle" fill="var(--ink)">' +
      '<rect x="125" y="8" width="110" height="38" rx="19" fill="var(--soft)"/><text x="180" y="32">Feel low</text>' +
      '<rect x="250" y="91" width="104" height="38" rx="19" fill="var(--soft)"/><text x="302" y="115">Do less</text>' +
      '<rect x="105" y="172" width="150" height="40" rx="20" fill="var(--soft)"/><text x="180" y="190">Fewer good moments,</text><text x="180" y="205">more problems</text>' +
      '<rect x="6" y="91" width="110" height="38" rx="19" fill="var(--soft)"/><text x="61" y="115">Feel lower</text></g>' +
      '<g stroke="var(--accent)" stroke-width="2.2" fill="none" marker-end="url(#ah)">' +
      '<path d="M238 32 Q290 40 300 86"/><path d="M300 134 Q290 170 260 186"/><path d="M100 186 Q66 172 62 134"/><path d="M62 86 Q70 40 120 30"/></g></svg>';
  }

  /* ============================================================= TOOLBOX */
  function latestPlanId() {
    var ids = ["s4_plan", "s3_plan", "s2_plan", "s1_plan"];
    for (var i = 0; i < ids.length; i++) if ((ans(ids[i]) || []).some(function (r) { return r && r.what; })) return ids[i];
    return null;
  }
  function renderToolbox() {
    main.appendChild(h('<section class="page-head"><h1>My toolbox</h1><p class="lead">Your skills and plans in one place. Use them any time.</p></section>'));
    var grid = h('<div class="tool-grid"></div>'); main.appendChild(grid);

    var b = h('<section class="panel"><h2>Slow breathing</h2><p class="muted">Two minutes. In for 4, out for 6.</p></section>');
    b.appendChild(breathingEl()); grid.appendChild(b);

    var pid = latestPlanId() || "toolbox_plan";
    var p = h('<section class="panel"><h2>My activity plan</h2><p class="muted">Small, specific, with a time. Edit it whenever you like.</p></section>');
    p.appendChild(plannerEl(pid, 4, function () { toast("Plan saved"); })); grid.appendChild(p);

    var t = h('<section class="panel"><h2>Kinder thoughts</h2><p class="muted">Caught a harsh thought? Write what a kind friend would say.</p></section>');
    var sw = (ans("s3_swaps") || []).concat(ans("toolbox_swaps") || []).filter(function (x) { return x && (x.a || x.b); });
    t.appendChild(h('<ul class="swaps">' + (sw.length ? sw.map(function (x) { return '<li><s>' + esc(x.a) + '</s><span>' + esc(x.b) + '</span></li>'; }).join("") : '<li class="muted">None yet — they’ll appear here.</li>') + '</ul>'));
    var add = h('<form class="add-swap"><input placeholder="Harsh thought" required><input placeholder="Kinder thought" required><button class="btn ghost">Add</button></form>');
    add.onsubmit = function (e) { e.preventDefault(); var i = add.querySelectorAll("input"); var a = ans("toolbox_swaps") || []; a.push({ a: i[0].value, b: i[1].value }); setAns("toolbox_swaps", a); route(); };
    t.appendChild(add);
    if (ans("s3_phrase")) t.appendChild(h('<p class="phrase">“' + esc(ans("s3_phrase")) + '”</p>'));
    grid.appendChild(t);

    var str = ans("s0_strengths"); var pr = [].concat(str ? str.picked : [], str && str.other ? [str.other] : [], (ans("s3_overcome") || []).filter(Boolean));
    grid.appendChild(h('<section class="panel"><h2>My strengths</h2>' + (pr.length ? '<ul class="tags">' + pr.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + '</ul>' : '<p class="muted">Complete “Getting started” to fill this in.</p>') + '</section>'));

    var sig = (ans("s5_signs") || []).filter(Boolean), act = (ans("s5_actions") || []).filter(Boolean), con = (ans("s5_contacts") || []).filter(Boolean);
    grid.appendChild(h('<section class="panel wide"><h2>My staying-well plan</h2>' + (sig.length || act.length || con.length ?
      '<div class="cols3"><div><h4>Warning signs</h4><ul>' + sig.map(li).join("") + '</ul></div><div><h4>What I’ll do</h4><ul>' + act.map(li).join("") + '</ul></div><div><h4>Who I’ll contact</h4><ul>' + con.map(li).join("") + '</ul></div></div>'
      : '<p class="muted">You’ll make this in Session 5.</p>') + '</section>'));
    function li(x) { return "<li>" + esc(x) + "</li>"; }
  }

  /* ============================================================ WORKBOOK */
  function renderWorkbook() {
    var p = person();
    var head = h('<section class="page-head"><h1>My workbook</h1><p class="lead">Everything you’ve written, session by session. You can print it or save it as a PDF.</p>' +
      '<div class="row"><button class="btn primary" type="button" onclick="window.print()">Print / save as PDF</button></div></section>');
    main.appendChild(head);
    var out = h('<div class="workbook"></div>');
    SESSIONS.forEach(function (s) {
      var sec = '<section class="wb-session"><h2>' + (s.id ? "Session " + s.id + ": " : "") + esc(s.title) + (done(s.id) ? ' <span class="pill">Done</span>' : "") + '</h2>';
      var c = state.checkins[s.id];
      if (c && c.mood !== undefined) sec += '<p class="muted small">Check-in — mood ' + c.mood + '/10 · daily tasks ' + (c.func != null ? c.func : "–") + '/10 · stress ' + (c.stress != null ? c.stress : "–") + '/10</p>';
      s.slides.forEach(function (sl) {
        if (sl.type !== "exercise" || ["breathing", "progress", "character"].indexOf(sl.kind) > -1) return;
        sec += '<div class="wb-item"><h3>' + fill(sl.prompt) + '</h3>' + formatAnswer(sl) + '</div>';
      });
      out.appendChild(h(sec + '</section>'));
    });
    main.appendChild(out);
    function formatAnswer(sl) {
      var v = ans(sl.id), empty = '<p class="muted">—</p>';
      if (v == null) return empty;
      if (sl.kind === "text") return v ? '<p>' + esc(v) + '</p>' : empty;
      if (sl.kind === "scale") return '<p>' + v + ' / 10</p>';
      if (sl.kind === "list") { var l = v.filter(Boolean); return l.length ? '<ul>' + l.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + '</ul>' : empty; }
      if (sl.kind === "choices") { var c = v.picked.concat(v.other ? [v.other] : []); return c.length ? '<ul class="tags">' + c.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + '</ul>' : empty; }
      if (sl.kind === "planner") { var r = v.filter(function (x) { return x && x.what; }); return r.length ? '<ul>' + r.map(function (x) { return "<li>" + esc(x.what) + (x.when ? " — " + esc(x.when) : "") + "</li>"; }).join("") + '</ul>' : empty; }
      if (sl.kind === "pairs") { var q = v.filter(function (x) { return x && (x.a || x.b); }); return q.length ? '<ul class="swaps">' + q.map(function (x) { return '<li><s>' + esc(x.a) + '</s><span>' + esc(x.b) + '</span></li>'; }).join("") + '</ul>' : empty; }
      if (sl.kind === "review") {
        if (v.note !== undefined) return '<p>' + esc(v.note) + '</p>';
        var plan = (ans(sl.source) || []).filter(function (x) { return x && x.what; });
        return '<ul>' + plan.map(function (x, i) { var r = v[i] || {}; return "<li>" + esc(x.what) + " — " + esc(r.done || "not recorded") + (r.feel ? " (felt " + esc(r.feel.toLowerCase()) + ")" : "") + "</li>"; }).join("") + '</ul>';
      }
      return empty;
    }
  }

  /* ========================================================= URGENT HELP */
  function renderHelp() {
    var cc = C.crisis, lines = cc.lines || [];
    var contacts = crisisConfigured()
      ? (cc.emergencyNumber ? '<a class="call big" href="tel:' + esc(cc.emergencyNumber.replace(/\s/g, "")) + '"><span>' + esc(cc.emergencyLabel) + '</span><strong>' + esc(cc.emergencyNumber) + '</strong></a>' : "") +
        lines.map(function (l) { return '<a class="call" href="tel:' + esc((l.phone || "").replace(/\s/g, "")) + '"><span>' + esc(l.name) + (l.hours ? ' · ' + esc(l.hours) : "") + '</span><strong>' + esc(l.phone) + '</strong>' + (l.note ? '<em>' + esc(l.note) + '</em>' : "") + '</a>'; }).join("")
      : '<div class="note">Contact your local emergency services, or go to ' + esc(cc.nearestCare) + '. If you can, ask someone you trust to go with you.</div>';
    main.appendChild(h('<section class="help-page">' +
      '<div class="help-hero"><h1>Urgent help</h1><p class="lead">If you are thinking about ending your life, or you are in danger, please reach out now. You don’t have to go through this alone.</p></div>' +
      '<div class="panel"><h2>Get help now</h2>' + contacts +
      '<p>You can also go to ' + esc(cc.nearestCare) + '.</p>' +
      (C.helper.enabled && C.helper.contactDetails ? '<p><strong>Your helper:</strong> ' + esc(C.helper.contactDetails) + '</p>' : "") + '</div>' +
      '<div class="tool-grid"><div class="panel"><h2>Right now, you could…</h2><ul class="arrows">' +
      '<li>Tell someone you trust how you are feeling — a family member, friend, neighbour or faith leader.</li>' +
      '<li>Ask them to stay with you.</li>' +
      '<li>Move away from anything you could use to hurt yourself.</li>' +
      '<li>Go somewhere other people are around.</li>' +
      '<li>Breathe slowly: in for 4, out for 6.</li></ul></div>' +
      '<div class="panel"><h2>Get help the same day if you…</h2><ul class="arrows">' +
      '<li>Have made a plan to end your life, or have started preparing.</li>' +
      '<li>Have hurt yourself.</li><li>Feel you can’t keep yourself safe.</li>' +
      '<li>Are hearing or seeing things others don’t, or feel very confused.</li>' +
      '<li>Are thinking of harming someone else.</li></ul></div></div>' +
      '<div class="panel"><h2>Ground yourself: 5-4-3-2-1</h2><p>Look around and name <strong>5</strong> things you can see, <strong>4</strong> you can touch, <strong>3</strong> you can hear, <strong>2</strong> you can smell and <strong>1</strong> you can taste. This can help when feelings are overwhelming.</p></div>' +
      '<p class="center"><a class="btn ghost" href="#/">Back to sessions</a></p></section>'));
  }

  /* =============================================================== ABOUT */
  function renderAbout() {
    main.appendChild(h('<section class="page-head"><h1>About this guide</h1></section>'));
    main.appendChild(h('<div class="panel prose">' +
      '<p><strong>' + esc(C.programmeName) + '</strong> is a five-session self-help programme for low mood and stress. It teaches skills drawn from behavioural activation and related approaches recommended for common mental health problems: understanding low mood, planning small activities, slow breathing, kinder self-talk, using your strengths, connecting with others and planning to stay well.</p>' +
      '<p>It is designed to be used on its own or with short weekly support from a trained helper. It does not diagnose or treat any condition and is not a substitute for professional care.</p>' +
      '<h2>Your data</h2><p>Everything you type is saved only in this browser on this device. It is not sent anywhere. If you clear your browser data or use a different device, your answers will not be there.</p>' +
      '<div class="row"><button class="btn ghost" type="button" data-a="export">Download my answers</button><button class="btn danger-ghost" type="button" data-a="reset">Delete all my answers</button></div></div>'));
    main.querySelector('[data-a="export"]').onclick = function () {
      var blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
      var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "one-step-at-a-time-answers.json"; a.click();
    };
    main.querySelector('[data-a="reset"]').onclick = function () {
      if (confirm("Delete all your answers and progress from this device? This cannot be undone.")) { state = defaults(); persist(); toast("All answers deleted"); location.hash = "#/"; }
    };
  }

  /* ---------- boot ---------- */
  document.getElementById("brandName").textContent = C.programmeName;
  document.title = C.programmeName;
  route();
})();
