/* recode-people-papers: MEMBERS/ALUMNI detail pages list the person's RECODE papers. ASCII only. */
(function () {
  var URL_ = "https://psykim.github.io/recode-media/people-papers.json";
  var data = null, queued = false;
  function esc(s) { var d = document.createElement("div"); d.textContent = s; return d.innerHTML; }
  function safe(u) { return /^https?:\/\//.test(u) ? u : "#"; }
  function bottom() { return document.querySelector(".dsgn-body > .page-bottom") || document.querySelector(".dsgn-body > .el-footer"); }
  function build(id, ids) {
    var lim = data.limit && data.limit[id];
    var shown = lim ? ids.slice(0, lim) : ids;
    var rows = shown.map(function (b) {
      var c = data.cards[b];
      return '<li><span class="rpb-y">' + esc(c.y) + '</span><div><a href="' + esc(safe(c.u)) + '" target="_blank" rel="noopener noreferrer">' + esc(c.t) + '</a><p>' + esc(c.j) + "</p></div></li>";
    }).join("");
    var s = document.createElement("section");
    s.id = "recode-pubs";
    s.setAttribute("data-person", id);
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
    return s;
  }
  // PREV/NEXT swap the person without a page load, so the section follows the current path on every DOM change.
  function sync() {
    queued = false;
    var m = location.pathname.match(/^\/(MEMBERS|ALUMNI)\/view\/(\d+)/);
    var id = m && m[2], s = document.getElementById("recode-pubs");
    if (s && s.getAttribute("data-person") !== id) { s.parentNode.removeChild(s); s = null; }
    if (!id || !data) return;
    var foot = bottom();
    if (!foot) return;
    if (!s) {
      var ids = data.people[id];
      if (!ids || !ids.length) return;
      s = build(id, ids);
    }
    if (s.nextElementSibling !== foot) foot.parentNode.insertBefore(s, foot);
  }
  function later() { if (!queued) { queued = true; setTimeout(sync, 30); } }
  if (window.MutationObserver) new MutationObserver(later).observe(document.body, { childList: true, subtree: true });
  window.addEventListener("popstate", later);
  fetch(URL_).then(function (r) { return r.json(); }).then(function (d) { data = d; later(); }).catch(function () {});
})();
