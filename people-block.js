/* recode-people-papers: MEMBERS/ALUMNI detail pages list the person's RECODE papers. ASCII only. */
(function () {
  var m = location.pathname.match(/^\/(MEMBERS|ALUMNI)\/view\/(\d+)/);
  if (!m) return;
  var URL_ = "https://psykim.github.io/recode-media/people-papers.json";
  var tries = 0;
  function esc(s) { var d = document.createElement("div"); d.textContent = s; return d.innerHTML; }
  function safe(u) { return /^https?:\/\//.test(u) ? u : "#"; }
  function render(data) {
    var ids = data.people[m[2]];
    if (!ids || !ids.length || document.getElementById("recode-pubs")) return;
    var foot = document.querySelector(".dsgn-body > .page-bottom") || document.querySelector(".dsgn-body > .el-footer");
    if (!foot) return;
    var lim = data.limit && data.limit[m[2]];
    var shown = lim ? ids.slice(0, lim) : ids;
    var rows = shown.map(function (b) {
      var c = data.cards[b];
      return '<li><span class="rpb-y">' + esc(c.y) + '</span><div><a href="' + esc(safe(c.u)) + '" target="_blank" rel="noopener noreferrer">' + esc(c.t) + '</a><p>' + esc(c.j) + "</p></div></li>";
    }).join("");
    var s = document.createElement("section");
    s.id = "recode-pubs";
    s.innerHTML = '<style>' +
      '#recode-pubs{background:#fff;color:#26343a;padding:8px 0 56px;font-family:Inter,"Noto Sans KR",system-ui,sans-serif}' +
      '#recode-pubs .rpb-in{max-width:1170px;margin:0 auto;padding:0 15px}' +
      '#recode-pubs h2{font-size:20px;font-weight:600;line-height:1.3;margin:0 0 4px;color:#26343a;border-top:1px solid rgba(38,52,58,.16);padding-top:28px}' +
      '#recode-pubs .rpb-n{margin:0 0 14px;font-size:13px;color:#6b7a7e}' +
      '#recode-pubs ol{list-style:none;margin:0;padding:0}' +
      '#recode-pubs li{display:flex;gap:16px;padding:11px 0;border-bottom:1px solid rgba(38,52,58,.08)}' +
      '#recode-pubs .rpb-y{flex:none;width:40px;font-size:13px;font-weight:600;line-height:1.5;color:#3d8aa1;font-variant-numeric:tabular-nums}' +
      '#recode-pubs a{color:#26343a;font-size:14px;font-weight:500;line-height:1.5;text-decoration:none}' +
      '#recode-pubs li a:hover{color:#286f88;text-decoration:underline}' +
      '#recode-pubs li p{margin:2px 0 0;font-size:12.5px;line-height:1.5;color:#6b7a7e}' +
      '#recode-pubs .rpb-all{display:inline-block;margin-top:16px;font-size:13px;color:#286f88;font-weight:600}' +
      '</style><div class="rpb-in"><h2>Publications from RECODE</h2><p class="rpb-n">' +
      (lim && ids.length > lim ? "Latest " + shown.length + " of " + ids.length + " papers" : ids.length + (ids.length === 1 ? " paper" : " papers")) +
      " listed in RECODE PAPERS</p><ol>" + rows + "</ol>" +
      (lim && ids.length > lim ? '<a class="rpb-all" href="/PAPERS">View all in PAPERS</a>' : "") + "</div>";
    foot.parentNode.insertBefore(s, foot);
  }
  function go(data) {
    if (document.querySelector(".dsgn-body > .el-footer")) { render(data); return; }
    if (++tries < 40) setTimeout(function () { go(data); }, 250);
  }
  fetch(URL_).then(function (r) { return r.json(); }).then(go).catch(function () {});
})();
