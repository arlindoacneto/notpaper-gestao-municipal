/* NotPaper Hub — renderização compartilhada (app/totem e banner) */
(function () {
  "use strict";
  var C = window.HUB_CONFIG;

  var ICONS = {
    gestor: '<rect x="3" y="3" width="7.5" height="9" rx="1.8"/><rect x="13.5" y="3" width="7.5" height="5.5" rx="1.8"/><rect x="13.5" y="11.5" width="7.5" height="9.5" rx="1.8"/><rect x="3" y="15" width="7.5" height="6" rx="1.8"/>',
    ecm: '<circle cx="5" cy="6" r="2.6"/><circle cx="19" cy="6" r="2.6"/><circle cx="12" cy="18.5" r="2.6"/><path d="M7.6 6h8.8M6.3 8.3l4.4 7.9M17.7 8.3l-4.4 7.9"/>',
    sign: '<path d="M4 20h4.2L19.3 8.9a2.9 2.9 0 0 0-4.1-4.1L4 15.9V20z"/><path d="M13.6 6.4l4 4"/><path d="M13 20h7"/>',
    cert: '<path d="M12 2.8l7.2 3v5.3c0 4.6-3.1 8.4-7.2 10.1-4.1-1.7-7.2-5.5-7.2-10.1V5.8L12 2.8z"/><path d="M8.7 12l2.3 2.3 4.4-4.5"/>',
    ged: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M2.5 13.5h19"/>',
    omni: '<path d="M21 11.5a8.4 8.4 0 0 1-12.2 7.5L3.5 20.5l1.3-4.6A8.4 8.4 0 1 1 21 11.5z"/><path d="M8.4 11.6h.01M12.3 11.6h.01M16.2 11.6h.01"/>',
    check: '<circle cx="12" cy="12" r="9"/><path d="M8 12.2l2.7 2.7L16.2 9.4"/>',
    ext: '<path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4"/>',
    home: '<path d="M3.5 11L12 4l8.5 7"/><path d="M6 9.5V20h12V9.5"/>',
    code: '<path d="M8 7l-5 5 5 5M16 7l5 5-5 5M13.5 4l-3 16"/>',
    play: '<circle cx="12" cy="12" r="9"/><path d="M10 8.5v7l6-3.5z"/>',
    law: '<path d="M12 3v18M5 7h14M7 7l-3 7a3.5 3.5 0 0 0 6 0L7 7zM17 7l-3 7a3.5 3.5 0 0 0 6 0l-3-7zM8 21h8"/>'
  };
  function icon(n) { return '<svg viewBox="0 0 24 24">' + (ICONS[n] || "") + "</svg>"; }

  // Posições no diagrama (caixa 1080 x 1240) — centro do HUB em (540, 620)
  var POS = {
    gestor: { x: 540, y: 112, w: 600, h: 196 },
    ecm:    { x: 275, y: 352, w: 470, h: 152 },
    sign:   { x: 805, y: 352, w: 470, h: 152 },
    ged:    { x: 275, y: 888, w: 470, h: 152 },
    cert:   { x: 805, y: 888, w: 470, h: 152 },
    omni:   { x: 275, y: 1132, w: 470, h: 152 },
    dev:    { x: 805, y: 1132, w: 470, h: 152 }
  };
  var CX = 540, CY = 620;

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  // Fundo: circuitos nos cantos superiores, malha de pontos e ondas nos cantos inferiores
  function background(w, h, seed) {
    var s = seed || 7;
    function rnd() { s = (s * 9301 + 49297) % 233280; return s / 233280; }
    var out = [];
    // malha
    var pts = [];
    for (var i = 0; i < 46; i++) pts.push([rnd() * w, rnd() * h]);
    for (i = 0; i < pts.length; i++) {
      for (var j = i + 1; j < pts.length; j++) {
        var dx = pts[i][0] - pts[j][0], dy = pts[i][1] - pts[j][1];
        if (dx * dx + dy * dy < Math.pow(w * 0.2, 2)) out.push('<line x1="' + pts[i][0].toFixed(1) + '" y1="' + pts[i][1].toFixed(1) + '" x2="' + pts[j][0].toFixed(1) + '" y2="' + pts[j][1].toFixed(1) + '" stroke="rgba(110,160,255,0.10)" stroke-width="1.2"/>');
      }
      out.push('<circle cx="' + pts[i][0].toFixed(1) + '" cy="' + pts[i][1].toFixed(1) + '" r="2.6" fill="rgba(140,185,255,0.35)"/>');
    }
    // circuitos (cantos superiores, espelhados)
    var k = w / 1080, circ = [];
    for (i = 0; i < 6; i++) {
      var x = (34 + i * 26) * k, y0 = 0, y1 = (90 + i * 34) * k, x2 = x + (30 + i * 8) * k, y2 = y1 + 36 * k;
      circ.push("M" + x + "," + y0 + " V" + y1 + " L" + x2 + "," + y2 + " V" + (y2 + 40 * k));
      out.push('<circle cx="' + x2 + '" cy="' + (y2 + 40 * k) + '" r="' + 5 * k + '" fill="none" stroke="rgba(120,170,255,0.55)" stroke-width="' + 2 * k + '"/>');
      out.push('<circle cx="' + (w - x2) + '" cy="' + (y2 + 40 * k) + '" r="' + 5 * k + '" fill="none" stroke="rgba(120,170,255,0.55)" stroke-width="' + 2 * k + '"/>');
    }
    out.push('<g fill="none" stroke="rgba(120,170,255,0.45)" stroke-width="' + 2 * k + '"><path d="' + circ.join(" ") + '"/><path transform="translate(' + w + ',0) scale(-1,1)" d="' + circ.join(" ") + '"/></g>');
    // ondas
    var waves = [];
    for (i = 0; i < 18; i++) {
      var o = i * 9 * k;
      waves.push("M" + (-40 * k) + "," + (h - 330 * k + o) + " C" + (180 * k) + "," + (h - 420 * k + o * 1.6) + " " + (260 * k) + "," + (h - 60 * k + o * 0.4) + " " + (520 * k) + "," + (h + 20 * k));
    }
    out.push('<g fill="none" stroke="rgba(130,175,255,0.16)" stroke-width="' + 1.4 * k + '"><path d="' + waves.join(" ") + '"/><path transform="translate(' + w + ',0) scale(-1,1)" d="' + waves.join(" ") + '"/></g>');
    return '<svg viewBox="0 0 ' + w + " " + h + '" preserveAspectRatio="none">' + out.join("") + "</svg>";
  }

  function renderHub(el, interactive) {
    var lines = [], cards = [];
    C.frentes.forEach(function (f, idx) {
      var p = POS[f.id]; if (!p) return;
      var dx = p.x - CX, dy = p.y - CY, len = Math.sqrt(dx * dx + dy * dy);
      var mx = CX + dx * 0.6, my = CY + dy * 0.6;
      lines.push('<line class="base" x1="' + CX + '" y1="' + CY + '" x2="' + p.x + '" y2="' + p.y + '"/>');
      lines.push('<line class="flow" style="animation-delay:' + (-idx * 0.53).toFixed(2) + 's" x1="' + CX + '" y1="' + CY + '" x2="' + p.x + '" y2="' + p.y + '"/>');
      lines.push('<circle class="dot" cx="' + mx.toFixed(1) + '" cy="' + my.toFixed(1) + '" r="7"/>');
      cards.push(
        '<div class="card' + (f.destaque ? " feat" : "") + (interactive ? " tap" : "") + '" data-id="' + f.id + '" style="left:' + p.x + "px;top:" + p.y + "px;width:" + p.w + "px;height:" + p.h + 'px">' +
          (f.destaque ? '<span class="badge">' + esc(f.destaque) + "</span>" : "") +
          '<div class="ic">' + icon(f.icone) + "</div>" +
          '<div><div class="nm">' + esc(f.nome) + '</div><div class="sb">' + esc(f.sub) + "</div></div>" +
        "</div>");
    });
    el.innerHTML =
      '<svg class="hub-lines" viewBox="0 0 1080 1240">' + lines.join("") + "</svg>" +
      '<div class="core"><div class="ring r2"></div><div class="ring r1"></div><div class="ring r3"></div>' +
        '<div class="disc"><img src="' + (el.getAttribute("data-asset") || "") + 'assets/img/symbol-dark.svg" alt=""><div class="t1">NotPaper</div><div class="t2">HUB</div></div></div>' +
      cards.join("");
  }

  window.NotPaperHubUI = { renderHub: renderHub, background: background, icon: icon, esc: esc };

  // ---------------- Aplicativo / totem ----------------
  var stage = document.getElementById("stage");
  if (!stage) return;

  // Retrato (totem/celular) 1080x1920 · Paisagem (projetor) 1920x1080
  var LAND = document.body.classList.contains("land"), SW = LAND ? 1920 : 1080, SH = LAND ? 1080 : 1920;
  function fit() {
    var vw = window.innerWidth, vh = window.innerHeight, s = Math.min(vw / SW, vh / SH);
    stage.style.transform = "translate(" + (vw - SW * s) / 2 + "px," + (vh - SH * s) / 2 + "px) scale(" + s + ")";
  }
  window.addEventListener("resize", fit); fit();

  document.getElementById("bg").innerHTML = background(SW, SH, 11);
  document.getElementById("selo").innerHTML = esc(C.selo).replace(/\. /, ".<br>").replace(/(FRENTES\.) /, "$1<br>");
  var fr = esc(C.frase).split(", ");
  document.getElementById("frase").innerHTML = fr.length > 1 ? fr[0] + ',<br><span class="grad">' + fr.slice(1).join(", ") + "</span>" : esc(C.frase);
  document.getElementById("subfrase").textContent = C.subfrase;
  document.getElementById("dica").lastChild.textContent = C.dica;
  document.getElementById("foot").textContent = C.rodape + (C.versao ? " · v" + C.versao : "");
  var hubEl = document.getElementById("hub");
  renderHub(hubEl, true);

  var detail = document.getElementById("detail"), panel = document.getElementById("panel");
  var idleTimer = null, timerBar = null, current = null;

  function bridge() { return window.NotPaperHubNative || null; }

  function openDetail(id) {
    var f = C.frentes.filter(function (x) { return x.id === id; })[0]; if (!f) return;
    current = f;
    var items = f.itens.map(function (t) { return "<li>" + icon("check") + "<span>" + esc(t) + "</span></li>"; }).join("");
    panel.innerHTML =
      '<div class="x" data-act="home" aria-label="Fechar">×</div>' +
      (LAND ? '<div class="c1">' : "") +
      '<div class="hd"><div class="ic">' + icon(f.icone) + "</div><div>" +
        (f.destaque ? '<span class="bdg">' + esc(f.destaque) + "</span>" : "") +
        "<h2>" + esc(f.nome) + "</h2><h3>" + esc(f.sub) + "</h3></div></div>" +
      '<p class="rs">' + esc(f.resumo) + "</p><ul>" + items + "</ul>" +
      (LAND ? '</div><div class="c2">' : "") +
      (f.casos && f.casos.length ? '<div class="cases"><div class="ct">' + esc(f.casosTitulo || "Casos") + "</div>" +
        f.casos.map(function (c) { return '<div class="case' + (c.imagem ? " hasimg" : "") + '"' + (c.url ? ' data-act="case" data-url="' + esc(c.url) + '"' + (c.abrirEm ? ' data-abrir="' + esc(c.abrirEm) + '"' : "") : "") + ">" +
          (c.imagem ? '<img class="thumb" data-act="zoom" data-img="' + esc(c.imagem) + '" src="' + esc(c.imagem) + '" alt="Tela do sistema">' : "") +
          '<div class="ctx"><b>' + esc(c.nome) + "</b><span>" + esc(c.desc || "") + "</span>" + (c.imagem ? '<em>Toque na imagem para ampliar</em>' : "") + "</div>" + (c.url ? icon("ext") : "") + "</div>"; }).join("") +
        "</div>" : "") +
      (f.imagem ? '<img class="shot" src="' + esc(f.imagem) + '" alt="">' : "") +
      (f.base ? '<div class="lg">' + '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + ICONS.law + "</svg>" + esc(f.base) + "</div>" : "") +
      '<div class="act">' +
        (f.video ? '<div class="btn pri" data-act="video">' + icon("play") + "Assistir ao vídeo</div>" : "") +
        (f.url ? '<div class="btn pri" data-act="open">' + icon("ext") + esc(f.rotuloUrl || "Acessar o sistema") + "</div>" : "") +
        '<div class="btn sec" data-act="home">' + icon("home") + "Voltar ao HUB</div>" +
      "</div>" +
      (LAND ? "</div>" : "") +
      '<div class="timer"><i></i></div>';
    timerBar = panel.querySelector(".timer i");
    detail.classList.add("on");
    armIdle();
  }

  function goHome() {
    detail.classList.remove("on");
    current = null;
    armIdle();
  }

  function openSystem() {
    if (!current || !current.url) return;
    openUrl(current.url, current.abrirEm, current.nome);
  }
  // abrirEm: "quadro" (padrão: dentro do HUB, com barra "Voltar ao HUB") ou "aba" (sistemas que não aceitam ser exibidos dentro de outra página)
  function openUrl(url, abrirEm, titulo) {
    if (!url) return;
    var b = bridge();
    goHome(); // ao retornar do sistema, o HUB já está na tela inicial
    if (b && b.openSystem) { b.openSystem(url, String(C.retornoAutomaticoSistema || 0)); return; } // app Android: botão nativo
    if (abrirEm === "aba") {
      // Sistemas que não aceitam quadro (ECM, gov.br): abrem na MESMA janela.
      // App instalado no iPhone/Android: o sistema mostra o site com botão "OK"/"X" que volta ao HUB.
      // No navegador comum: o botão/gesto "voltar" retorna ao HUB.
      try { sessionStorage.setItem("hubVoltou", "1"); } catch (e) {}
      location.href = url;
      return;
    }
    openFrame(url, titulo);
  }

  // ---- Sistema dentro do HUB ----
  var frame = document.getElementById("frame"), ifr = frame.querySelector("iframe");
  // Troca o conteúdo do quadro sem criar entrada no histórico (o "voltar" do navegador volta ao HUB)
  function frameLoad(url) {
    try { ifr.contentWindow.location.replace(url); } catch (e) { ifr.src = url; }
  }
  function openFrame(url, titulo) {
    frame.querySelector(".ftitle b").textContent = titulo || url.replace(/^https?:\/\//, "").replace(/\/$/, "");
    frame.querySelector(".fext").href = url;
    frameLoad(url);
    frame.classList.add("on");
    try { history.pushState({ hubFrame: 1 }, ""); } catch (e) {}
  }
  function closeFrame(fromHistory) {
    if (!frame.classList.contains("on")) return;
    frame.classList.remove("on");
    frameLoad("about:blank");
    goHome();
    if (!fromHistory) { try { if (history.state && history.state.hubFrame) history.back(); } catch (e) {} }
  }
  frame.querySelector("[data-act=fclose]").addEventListener("click", function () { closeFrame(false); });
  frame.querySelector("[data-act=fext]").addEventListener("click", function () { setTimeout(function () { closeFrame(false); }, 300); });
  // Gesto/botão "voltar" do navegador fecha o sistema e volta ao HUB
  window.addEventListener("popstate", function () { closeFrame(true); });

  function armIdle() {
    clearTimeout(idleTimer);
    if (player && player.classList.contains("on")) return; // vídeo em reprodução: sem retorno automático
    var secs = C.retornoAutomaticoHub || 0;
    if (timerBar) { timerBar.style.transition = "none"; timerBar.style.transform = "scaleX(1)"; }
    if (!secs || !detail.classList.contains("on")) return;
    if (timerBar) {
      void timerBar.offsetWidth;
      timerBar.style.transition = "transform " + secs + "s linear";
      timerBar.style.transform = "scaleX(0)";
    }
    idleTimer = setTimeout(goHome, secs * 1000);
  }

  hubEl.addEventListener("click", function (e) {
    var c = e.target.closest(".card"); if (c) openDetail(c.getAttribute("data-id"));
  });
  detail.addEventListener("click", function (e) {
    var a = e.target.closest("[data-act]");
    if (!a) { if (e.target === detail) goHome(); else armIdle(); return; }
    var act = a.getAttribute("data-act");
    if (act === "open") openSystem(); else if (act === "video") playVideo();
    else if (act === "case") openUrl(a.getAttribute("data-url"), a.getAttribute("data-abrir"), a.querySelector("b") && a.querySelector("b").textContent);
    else if (act === "zoom") openZoom(a.getAttribute("data-img")); else goHome();
  });
  document.addEventListener("pointerdown", function () { if (detail.classList.contains("on")) armIdle(); }, true);

  // ---- Ampliar imagem (tela cheia) ----
  var zoom = document.getElementById("zoom");
  function openZoom(src) { zoom.querySelector("img").src = src; zoom.classList.add("on"); armIdle(); }
  zoom.addEventListener("click", function () { zoom.classList.remove("on"); armIdle(); });

  // ---- Player de vídeo (tela cheia, offline) ----
  var player = document.getElementById("player"), vid = player.querySelector("video");
  function playVideo() {
    if (!current || !current.video) return;
    clearTimeout(idleTimer);
    vid.src = current.video; if (current.poster) vid.poster = current.poster;
    player.classList.add("on");
    vid.currentTime = 0;
    var p = vid.play(); if (p && p.catch) p.catch(function () { vid.controls = true; });
  }
  function closeVideo() {
    vid.pause(); vid.removeAttribute("src"); vid.load();
    player.classList.remove("on");
    goHome();
  }
  vid.addEventListener("ended", closeVideo);
  player.querySelector("[data-act=close]").addEventListener("click", closeVideo);
  vid.addEventListener("click", function () { if (vid.paused) vid.play(); else vid.pause(); });

  // ---- Modo totem: tela sempre ligada (substitui o recurso do APK) ----
  if (document.body.classList.contains("totem") && "wakeLock" in navigator) {
    var lock = null;
    var pedir = function () { navigator.wakeLock.request("screen").then(function (l) { lock = l; }).catch(function () {}); };
    pedir();
    document.addEventListener("visibilitychange", function () { if (document.visibilityState === "visible") pedir(); });
    document.addEventListener("pointerdown", function () { if (!lock || lock.released) pedir(); }, true);
  }

  // Chamados pela camada Android
  window.hubBack = function () {
    if (frame.classList.contains("on")) { closeFrame(false); return true; }
    if (player.classList.contains("on")) { closeVideo(); return true; }
    if (zoom.classList.contains("on")) { zoom.classList.remove("on"); return true; }
    if (detail.classList.contains("on")) { goHome(); return true; } return false; };
  window.hubHome = goHome;
})();
