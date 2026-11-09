/* NotPaper Hub — funcionamento offline (PWA). Trocar VERSAO a cada publicação. */
var VERSAO = "notpaper-hub-v1";
var ARQUIVOS = [
  "./", "index.html", "hub.css", "hub.js", "config.js", "manifest.webmanifest",
  "assets/img/logo-dark.svg", "assets/img/symbol-dark.svg",
  "assets/icons/icon-180.png", "assets/icons/icon-192.png", "assets/icons/icon-512.png",
  "assets/fonts/poppins-latin-400-normal.woff2", "assets/fonts/poppins-latin-500-normal.woff2",
  "assets/fonts/poppins-latin-600-normal.woff2", "assets/fonts/poppins-latin-700-normal.woff2",
  "assets/fonts/poppins-latin-800-normal.woff2", "assets/fonts/inter-latin-400-normal.woff2",
  "assets/fonts/inter-latin-500-normal.woff2", "assets/fonts/inter-latin-600-normal.woff2",
  "assets/video/omnichannel.mp4", "assets/video/omnichannel-poster.jpg"
];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(VERSAO).then(function (c) { return c.addAll(ARQUIVOS); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== VERSAO; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

// Vídeo no Safari/iOS usa requisições com "Range": responde com o trecho pedido (206).
function respostaParcial(req, resp) {
  var range = req.headers.get("range");
  return resp.arrayBuffer().then(function (buf) {
    var m = /bytes=(\d*)-(\d*)/.exec(range) || [];
    var ini = m[1] ? parseInt(m[1], 10) : 0;
    var fim = m[2] ? parseInt(m[2], 10) : buf.byteLength - 1;
    return new Response(buf.slice(ini, fim + 1), {
      status: 206, statusText: "Partial Content",
      headers: { "Content-Type": resp.headers.get("Content-Type") || "video/mp4",
        "Content-Range": "bytes " + ini + "-" + fim + "/" + buf.byteLength,
        "Content-Length": String(fim - ini + 1), "Accept-Ranges": "bytes" }
    });
  });
}

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  e.respondWith(caches.match(req, { ignoreSearch: true }).then(function (hit) {
    if (hit) return req.headers.get("range") ? respostaParcial(req, hit) : hit;
    return fetch(req);
  }));
});
