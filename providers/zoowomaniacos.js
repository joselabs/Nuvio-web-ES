var k = Object.create;
var f = Object.defineProperty;
var E = Object.getOwnPropertyDescriptor;
var U = Object.getOwnPropertyNames;
var L = Object.getPrototypeOf, b = Object.prototype.hasOwnProperty;
var Z = (o, e) => {
  for (var n in e)
    f(o, n, { get: e[n], enumerable: true });
}, y = (o, e, n, i) => {
  if (e && typeof e == "object" || typeof e == "function")
    for (let l of U(e))
      !b.call(o, l) && l !== n && f(o, l, { get: () => e[l], enumerable: !(i = E(e, l)) || i.enumerable });
  return o;
};
var R = (o, e, n) => (n = o != null ? k(L(o)) : {}, y(e || !o || !o.__esModule ? f(n, "default", { value: o, enumerable: true }) : n, o)), x = (o) => y(f({}, "__esModule", { value: true }), o);
var d = (o, e, n) => new Promise((i, l) => {
  var a = (r) => {
    try {
      t(n.next(r));
    } catch (u) {
      l(u);
    }
  }, s = (r) => {
    try {
      t(n.throw(r));
    } catch (u) {
      l(u);
    }
  }, t = (r) => r.done ? i(r.value) : Promise.resolve(r.value).then(a, s);
  t((n = n.apply(o, e)).next());
});
var F = {};
Z(F, { getStreams: () => C });
module.exports = x(F);
var w = R(require("axios"));
var A = R(require("axios"));
var $ = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function T(o) {
  return d(this, null, function* () {
    try {
      console.log(`[OkRu] Resolviendo: ${o}`);
      let { data: e } = yield A.default.get(o, { timeout: 1e4, headers: { "User-Agent": $, Accept: "text/html", Referer: "https://ok.ru/" } });
      if (e.includes("copyrightsRestricted") || e.includes("COPYRIGHTS_RESTRICTED") || e.includes("LIMITED_ACCESS") || e.includes("notFound") || !e.includes("urls"))
        return console.log("[OkRu] Video no disponible o eliminado"), null;
      let i = [...e.replace(/\\&quot;/g, '"').replace(/\\u0026/g, "&").replace(/\\/g, "").matchAll(/"name":"([^"]+)","url":"([^"]+)"/g)], l = ["full", "hd", "sd", "low", "lowest"], a = i.map((u) => ({ type: u[1], url: u[2] })).filter((u) => !u.type.toLowerCase().includes("mobile") && u.url.startsWith("http"));
      if (a.length === 0)
        return console.log("[OkRu] No se encontraron URLs"), null;
      let t = a.sort((u, h) => {
        let p = l.findIndex((c) => u.type.toLowerCase().includes(c)), g = l.findIndex((c) => h.type.toLowerCase().includes(c));
        return (p === -1 ? 99 : p) - (g === -1 ? 99 : g);
      })[0];
      console.log(`[OkRu] URL encontrada (${t.type}): ${t.url.substring(0, 80)}...`);
      let r = { full: "1080p", hd: "720p", sd: "480p", low: "360p", lowest: "240p" };
      return { url: t.url, quality: r[t.type] || t.type, headers: { "User-Agent": $, Referer: "https://ok.ru/" } };
    } catch (e) {
      return console.log(`[OkRu] Error: ${e.message}`), null;
    }
  });
}
var O = "439c478a771f35c05022f9feabcca01c", m = "https://proyectox.yoyatengoabuela.com", v = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36", D = { "User-Agent": v, Accept: "application/json, text/javascript, */*", Connection: "keep-alive", Referer: m + "/", Origin: m, "X-Requested-With": "XMLHttpRequest" }, M = ["332656282246", "1683045747235"];
function S(o, e) {
  return d(this, null, function* () {
    let n = [{ lang: "es-MX", name: "Latino" }, { lang: "en-US", name: "Ingl\xE9s" }];
    for (let { lang: i, name: l } of n)
      try {
        let a = `https://api.themoviedb.org/3/${e}/${o}?api_key=${O}&language=${i}`, { data: s } = yield w.default.get(a, { timeout: 5e3, headers: { "User-Agent": v } }), t = e === "movie" ? s.title : s.name, r = e === "movie" ? s.original_title : s.original_name;
        if (!t || i === "es-MX" && /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(t))
          continue;
        return console.log(`[Zoowomaniacos] TMDB (${l}): "${t}"`), { title: t, originalTitle: r, year: (s.release_date || "").substring(0, 4) };
      } catch (a) {
        console.log(`[Zoowomaniacos] Error TMDB ${l}: ${a.message}`);
      }
    return null;
  });
}
function _(o) {
  return d(this, null, function* () {
    try {
      let { data: e } = yield w.default.post(`${m}/alternativo3/server.php`, new URLSearchParams({ start: "0", length: "10", metodo: "ObtenerListaTotal", "search[value]": o, "searchPanes[a3][0]": "", "searchPanes[a4][0]": "", "searchPanes[a5][0]": "", "searchPanes[a6][0]": "" }), { timeout: 8e3, headers: D });
      return (e == null ? void 0 : e.data) || [];
    } catch (e) {
      return console.log(`[Zoowomaniacos] Error b\xFAsqueda: ${e.message}`), [];
    }
  });
}
function q(o, e) {
  if (o.length === 0)
    return null;
  if (o.length === 1)
    return o[0];
  let n = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim(), i = n(e.title), l = e.originalTitle ? n(e.originalTitle) : "", a = o.map((s) => {
    let t = n((s.a2 || "").split("-")[0].trim()), r = 0;
    return t === i || t === l ? r += 3 : (t.includes(i) || i.includes(t)) && (r += 1.5), e.year && s.a4 === e.year && (r += 1), { r: s, score: r };
  });
  return a.sort((s, t) => t.score - s.score), a[0].r;
}
function W(o) {
  return d(this, null, function* () {
    try {
      let { data: e } = yield w.default.get(`${m}/testplayer.php?id=${o}`, { timeout: 8e3, headers: { "User-Agent": v, Accept: "text/html", Referer: m + "/" } }), n = [...e.matchAll(/src="(https?:\/\/[^"]+)"/g)], i = [...new Set(n.map((s) => s[1]))], l = i.filter((s) => {
        if (!s.includes("ok.ru/videoembed/"))
          return false;
        let t = s.split("/").pop();
        return !M.includes(t);
      }), a = i.filter((s) => s.includes("archive.org") && (s.endsWith(".mp4") || s.endsWith(".mkv") || s.endsWith(".avi")));
      return { okru: l, archive: a };
    } catch (e) {
      return console.log(`[Zoowomaniacos] Error player: ${e.message}`), { okru: [], archive: [] };
    }
  });
}
function C(o, e, n, i) {
  return d(this, null, function* () {
    if (!o || e !== "movie")
      return [];
    let l = Date.now();
    console.log(`[Zoowomaniacos] Buscando: TMDB ${o}`);
    try {
      let a = yield S(o, e);
      if (!a)
        return [];
      let s = [a.title];
      a.originalTitle && a.originalTitle !== a.title && s.push(a.originalTitle);
      let t = null;
      for (let g of s) {
        let c = yield _(g);
        if (c.length > 0 && (t = q(c, a), t)) {
          console.log(`[Zoowomaniacos] \u2713 Encontrado: "${t.a2}" (${t.a4}) id:${t.a1}`);
          break;
        }
      }
      if (!t)
        return console.log("[Zoowomaniacos] No encontrado"), [];
      let { okru: r, archive: u } = yield W(t.a1);
      if (r.length === 0 && u.length === 0)
        return console.log("[Zoowomaniacos] No hay embeds v\xE1lidos"), [];
      let h = [];
      r.length > 0 && (console.log(`[Zoowomaniacos] Resolviendo ${r.length} embeds ok.ru...`), (yield Promise.allSettled(r.map((c) => T(c)))).filter((c) => c.status === "fulfilled" && c.value).forEach((c) => h.push({ name: "Zoowomaniacos", title: `${c.value.quality} \xB7 OkRu`, url: c.value.url, quality: c.value.quality, headers: c.value.headers || {} })));
      for (let g of u)
        console.log(`[Zoowomaniacos] Archive.org directo: ${g.substring(0, 60)}...`), h.push({ name: "Zoowomaniacos", title: "Archive.org", url: g, quality: "1080p", headers: { "User-Agent": v } });
      let p = ((Date.now() - l) / 1e3).toFixed(2);
      return console.log(`[Zoowomaniacos] \u2713 ${h.length} streams en ${p}s`), h;
    } catch (a) {
      return console.log(`[Zoowomaniacos] Error: ${a.message}`), [];
    }
  });
}
