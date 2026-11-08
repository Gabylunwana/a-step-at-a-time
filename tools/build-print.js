// Builds print/workbook.html — a paper version of the guide with blank spaces
// to write in, for people without a phone or internet.
// Run after editing content or config:   node tools/build-print.js
const fs = require("fs"), path = require("path"), vm = require("vm");
const root = path.join(__dirname, "..");
const ctx = { window: {} }; vm.createContext(ctx);
for (const f of ["config.js", "content.js"]) vm.runInContext(fs.readFileSync(path.join(root, "assets/js", f), "utf8"), ctx);
const C = ctx.window.SBS_CONFIG, S = ctx.window.SBS_CONTENT.sessions;
const P = C.characters[0].name, G = C.guide.name;
const fill = t => String(t).replace(/\{P\}/g, P).replace(/\{G\}/g, G).replace(/<a [^>]*>(.*?)<\/a>/g, "$1");
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
const lines = n => '<div class="lines">' + '<span></span>'.repeat(n) + "</div>";

function checkin() {
  const sc = l => `<div class="scale"><p>${l}</p><div class="nums">${[...Array(11).keys()].map(i => `<span>${i}</span>`).join("")}</div></div>`;
  return `<div class="box"><h3>Weekly check-in — circle a number</h3>${sc("Mood (0 very low – 10 very good)")}${sc("Managing daily tasks (0 not at all – 10 very well)")}${sc("Stress (0 none – 10 extreme)")}
  <p><strong>In the past week, have you had thoughts that life isn't worth living, or of ending your life?</strong> &nbsp; ☐ No &nbsp; ☐ Sometimes &nbsp; ☐ Often</p>
  <p class="warn">If you ticked “Sometimes” or “Often”, please talk to a health worker or someone you trust today. See the Urgent Help page at the back.</p></div>`;
}
function ex(sl) {
  let b = `<div class="box"><h3>✎ ${fill(sl.prompt)}</h3>${sl.hint ? `<p class="hint">${fill(sl.hint)}</p>` : ""}`;
  switch (sl.kind) {
    case "character": return `<p class="hint">In this paper version you will follow ${P}'s story.</p>`;
    case "text": b += lines(3); break;
    case "list": for (let i = 1; i <= sl.count; i++) b += `<div class="li">${i}.</div>`; break;
    case "choices": b += `<ul class="cb">${sl.options.map(o => `<li>☐ ${esc(o)}</li>`).join("")}${sl.other ? "<li>☐ Other: ____________</li>" : ""}</ul>`; break;
    case "planner": b += `<table><tr><th>Activity</th><th>Day</th><th>Time</th><th>Done?</th><th>How I felt after</th></tr>${'<tr><td></td><td></td><td></td><td></td><td></td></tr>'.repeat(sl.rows + 1)}</table>`; break;
    case "review": b += `<p class="hint">Look back at your plan from last session. For each activity: did you do it (yes / partly / not this time)? How did you feel afterwards?</p>${lines(4)}`; break;
    case "pairs": b += `<table><tr><th>${sl.left}</th><th>${sl.right}</th></tr>${'<tr><td class="tall"></td><td class="tall"></td></tr>'.repeat(sl.count)}</table>`; break;
    case "scale": b += `<div class="nums">${[...Array(11).keys()].map(i => `<span>${i}</span>`).join("")}</div><p class="hint">0 = ${sl.min}, 10 = ${sl.max}</p>`; break;
    case "breathing": b += `<p>Breathe in through your nose counting 1-2-3-4. Breathe out slowly counting 1-2-3-4-5-6. Repeat for about two minutes.</p>`; break;
    case "progress": b += `<p class="hint">Look back at your check-in scores from each session. What has changed?</p>${lines(3)}`; break;
  }
  return b + "</div>";
}
let body = "";
for (const s of S) {
  body += `<section class="session"><p class="eyebrow">${s.id ? "Session " + s.id : "Start here"} · about ${s.minutes} minutes</p><h1>${esc(s.title)}</h1><p class="goal">${esc(s.goal)}</p>`;
  for (const sl of s.slides) {
    if (sl.type === "story") body += `<div class="story ${sl.who}"><strong>${sl.who === "guide" ? G : P}:</strong> ${fill(sl.text)}</div>`;
    else if (sl.type === "info") body += `<div class="info"><h2>${esc(sl.title)}</h2>${sl.visual === "cycle" ? '<p class="cycle">Feel low → Do less → Fewer good moments, more problems → Feel lower → …</p>' : ""}${fill(sl.body)}</div>`;
    else if (sl.type === "checkin") body += checkin();
    else if (sl.type === "exercise") body += ex(sl);
    else if (sl.type === "summary") body += `<div class="summary"><h2>${sl.final ? "You did it" : "Summary"}</h2><ul>${sl.points.map(p => `<li>${fill(p)}</li>`).join("")}</ul><h3>Practise this week</h3><ul>${sl.practice.map(p => `<li>${fill(p)}</li>`).join("")}</ul></div>`;
  }
  body += "</section>";
}
const cc = C.crisis;
const help = (cc.emergencyNumber || cc.lines.length)
  ? `${cc.emergencyNumber ? `<p class="big">${esc(cc.emergencyLabel)}: <strong>${esc(cc.emergencyNumber)}</strong></p>` : ""}${cc.lines.map(l => `<p><strong>${esc(l.name)}</strong>: ${esc(l.phone)} ${l.hours ? "(" + esc(l.hours) + ")" : ""}${l.note ? " — " + esc(l.note) : ""}</p>`).join("")}`
  : `<p>Emergency number: ____________________ &nbsp; Local helpline: ____________________</p>`;
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(C.programmeName)} — Printable workbook</title>
<style>
body{font:12pt/1.5 Georgia,serif;color:#111;max-width:760px;margin:0 auto;padding:24px}
h1{font-size:22pt;margin:.2em 0}h2{font-size:14pt;margin:.2em 0 .4em}h3{font-size:12pt;margin:0 0 .4em}
.cover{text-align:center;padding:120px 0;page-break-after:always}.cover h1{font-size:32pt}
.session{page-break-before:always}.eyebrow{text-transform:uppercase;letter-spacing:.1em;font:bold 9pt sans-serif;color:#2f8f83}
.goal{font-style:italic;color:#444}.story{margin:10px 0;padding:8px 12px;border-left:4px solid #ddd}.story.guide{border-color:#2f8f83;background:#f2f8f7}
.info,.summary{margin:14px 0}.box{border:1.5px solid #2f8f83;border-radius:10px;padding:12px 14px;margin:14px 0;page-break-inside:avoid}
.hint{color:#555;font-size:10.5pt}.lines span{display:block;border-bottom:1px solid #aaa;height:28px}.li{border-bottom:1px solid #aaa;height:30px;padding-top:6px}
.cb{columns:2;list-style:none;padding:0}table{width:100%;border-collapse:collapse}th,td{border:1px solid #999;padding:6px;height:30px;text-align:left;font-size:10pt}td.tall{height:60px}
.nums{display:flex;gap:6px}.nums span{border:1px solid #999;border-radius:50%;width:26px;height:26px;display:inline-grid;place-items:center;font:10pt sans-serif}
.warn{font-size:10pt;color:#a01}.compare{display:flex;gap:10px}.compare>div{flex:1;border:1px solid #ccc;padding:6px}.compare span{display:block;font:bold 9pt sans-serif}
.mini-card{border:1px solid #ccc;padding:6px;margin:4px 0}.cards2{display:grid;grid-template-columns:1fr 1fr;gap:6px}.grid2{columns:2}.muted{color:#555}
.helpp{page-break-before:always;border:3px solid #b3261e;padding:20px;border-radius:12px}.big{font-size:16pt}.cycle{font-weight:bold;text-align:center}
@media print{body{padding:0}}
</style></head><body>
<div class="cover"><h1>${esc(C.programmeName)}</h1><p>${esc(C.tagline)}</p><p>${esc(C.organisation || "")}</p><p style="margin-top:80px">Name: ________________________________</p><p>Start date: ____________________</p></div>
<div><h2>How to use this workbook</h2><p>There are five sessions plus a short “Start here” section. Do about one session a week. Each session follows the story of ${P}, who is learning to cope with low mood with help from ${G}, ${esc(C.guide.role)}. Write your answers in the boxes. The practice between sessions is where most of the change happens.</p><p><strong>This is a self-help guide. It does not replace professional care.</strong> If you ever feel unsafe, turn to the Urgent Help page at the back.</p></div>
${body}
<section class="helpp"><h1>Urgent help</h1><p>If you are thinking about ending your life or you are in danger, get help now. Tell someone you trust, ask them to stay with you, and contact:</p>${help}<p>Or go to ${esc(cc.nearestCare)}.</p>
<h3>Get help the same day if you:</h3><ul><li>have made a plan to end your life or started preparing</li><li>have hurt yourself</li><li>feel you can't keep yourself safe</li><li>are hearing or seeing things others don't, or feel very confused</li><li>are thinking of harming someone else</li></ul></section>
</body></html>`;
fs.writeFileSync(path.join(root, "print/workbook.html"), html);
console.log("Wrote print/workbook.html");
