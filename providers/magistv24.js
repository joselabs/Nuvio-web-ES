var _ = Object.create;
var S = Object.defineProperty, q = Object.defineProperties, C = Object.getOwnPropertyDescriptor, D = Object.getOwnPropertyDescriptors, P = Object.getOwnPropertyNames, A = Object.getOwnPropertySymbols, K = Object.getPrototypeOf, L = Object.prototype.hasOwnProperty, z = Object.prototype.propertyIsEnumerable;
var y = (e, t, n) => t in e ? S(e, t, { enumerable: true, configurable: true, writable: true, value: n }) : e[t] = n, h = (e, t) => {
  for (var n in t || (t = {}))
    L.call(t, n) && y(e, n, t[n]);
  if (A)
    for (var n of A(t))
      z.call(t, n) && y(e, n, t[n]);
  return e;
}, T = (e, t) => q(e, D(t));
var O = (e, t) => {
  for (var n in t)
    S(e, n, { get: t[n], enumerable: true });
}, U = (e, t, n, s) => {
  if (t && typeof t == "object" || typeof t == "function")
    for (let a of P(t))
      !L.call(e, a) && a !== n && S(e, a, { get: () => t[a], enumerable: !(s = C(t, a)) || s.enumerable });
  return e;
};
var R = (e, t, n) => (n = e != null ? _(K(e)) : {}, U(t || !e || !e.__esModule ? S(n, "default", { value: e, enumerable: true }) : n, e)), X = (e) => U(S({}, "__esModule", { value: true }), e);
var m = (e, t, n) => new Promise((s, a) => {
  var o = (r) => {
    try {
      l(n.next(r));
    } catch (u) {
      a(u);
    }
  }, c = (r) => {
    try {
      l(n.throw(r));
    } catch (u) {
      a(u);
    }
  }, l = (r) => r.done ? s(r.value) : Promise.resolve(r.value).then(o, c);
  l((n = n.apply(e, t)).next());
});
var nt = {};
O(nt, { getStreams: () => et });
module.exports = X(nt);
var w = R(require("axios"));
var F = R(require("axios"));
var B = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function G(e, t) {
  return e >= 3840 || t >= 2160 ? "4K" : e >= 1920 || t >= 1080 ? "1080p" : e >= 1280 || t >= 720 ? "720p" : e >= 854 || t >= 480 ? "480p" : "360p";
}
function I(n) {
  return m(this, arguments, function* (e, t = {}) {
    try {
      let { data: s } = yield F.default.get(e, { timeout: 3e3, headers: h({ "User-Agent": B }, t), responseType: "text" });
      if (!s.includes("#EXT-X-STREAM-INF")) {
        let l = e.match(/[_-](\d{3,4})p/);
        return l ? `${l[1]}p` : "1080p";
      }
      let a = 0, o = 0, c = s.split(`
`);
      for (let l of c) {
        let r = l.match(/RESOLUTION=(\d+)x(\d+)/);
        if (r) {
          let u = parseInt(r[1]), i = parseInt(r[2]);
          i > o && (o = i, a = u);
        }
      }
      return o > 0 ? G(a, o) : "1080p";
    } catch (s) {
      return "1080p";
    }
  });
}
var k = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
function H(e) {
  let t = e.match(/eval\(function\(p,a,c,k,e,d\)\{.*?\}\('([\s\S]*?)',(\d+),(\d+),'([\s\S]*?)'\.split\('\|'\)\)\)/);
  if (!t)
    return null;
  let [, n, s, a, o] = t;
  for (s = parseInt(s), a = parseInt(a), o = o.split("|"); a--; )
    o[a] && (n = n.replace(new RegExp("\\b" + a.toString(s) + "\\b", "g"), o[a]));
  return n;
}
function N(e) {
  return m(this, null, function* () {
    var t;
    try {
      let s = yield (yield fetch(e, { headers: { "User-Agent": k, Referer: "https://www3.seriesmetro.net/" } })).text(), a = H(s);
      if (!a)
        return null;
      let o = (t = a.match(/file:"(https?:\/\/[^"]+\.m3u8[^"]*)"/)) == null ? void 0 : t[1];
      if (!o)
        return null;
      let c = yield I(o, { Referer: "https://fastream.to/" });
      return { url: o, quality: c, headers: { "User-Agent": k, Referer: "https://fastream.to/" } };
    } catch (n) {
      return console.error("[Fastream] Error:", n.message), null;
    }
  });
}
var Q = "439c478a771f35c05022f9feabcca01c", E = "https://magistv24.com", Y = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36", b = { "User-Agent": Y, Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", "Accept-Language": "es-MX,es;q=0.9", Connection: "keep-alive", "Upgrade-Insecure-Requests": "1" }, W = ["latino", "lat", "castellano", "espa\xF1ol", "esp", "vose", "sub", "subtitulado"], j = { latino: "Latino", lat: "Latino", castellano: "Espa\xF1ol", espa\u00F1ol: "Espa\xF1ol", esp: "Espa\xF1ol", vose: "Subtitulado", sub: "Subtitulado", subtitulado: "Subtitulado" };
function x(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}
function J(e, t) {
  return m(this, null, function* () {
    let n = [{ lang: "es-MX", name: "Latino" }, { lang: "es-ES", name: "Espa\xF1a" }, { lang: "en-US", name: "Ingl\xE9s" }], s = yield Promise.allSettled(n.map(({ lang: f }) => w.default.get(`https://api.themoviedb.org/3/${t}/${e}?api_key=${Q}&language=${f}`, { timeout: 5e3 }).then((g) => ({ lang: f, data: g.data })))), a = {};
    for (let f of s)
      f.status === "fulfilled" && (a[f.value.lang] = f.value.data);
    let o = (f) => f ? t === "movie" ? f.title : f.name : null, c = (f) => f ? t === "movie" ? f.original_title : f.original_name : null, l = o(a["es-MX"]), r = o(a["es-ES"]), u = o(a["en-US"]), i = c(a["en-US"]) || c(a["es-MX"]), p = l;
    return (!p || /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(p)) && (p = u), p || (p = r), p ? (console.log(`[MagisTv24] TMDB: "${p}"${r && r !== p ? ` | ES: "${r}"` : ""}`), { title: p, originalTitle: i, esTitle: r, enTitle: u }) : null;
  });
}
function V(e, t) {
  return m(this, null, function* () {
    let { title: n, originalTitle: s, esTitle: a, enTitle: o } = e, c = t === "movie" ? "pelicula" : "serie", l = [];
    n && l.push(x(n)), s && s !== n && l.push(x(s)), a && a !== n && a !== s && l.push(x(a)), o && o !== n && o !== s && o !== a && l.push(x(o));
    let r = [...new Set(l.filter((i) => i.length > 0))], u = yield Promise.allSettled(r.map((i) => w.default.get(`${E}/${c}/${i}/`, { timeout: 8e3, headers: b }).then(({ data: p }) => p.includes("trembed=") || p.includes("data-post=") ? { url: `${E}/${c}/${i}/`, html: p } : null)));
    for (let i of u)
      if (i.status === "fulfilled" && i.value)
        return console.log(`[MagisTv24] \u2713 Encontrado: ${i.value.url}`), i.value;
    return console.log("[MagisTv24] No encontrado por slug"), null;
  });
}
function Z(e, t, n, s) {
  return m(this, null, function* () {
    var l;
    let a = (l = t.match(/data-post="(\d+)"/)) == null ? void 0 : l[1];
    if (!a)
      throw new Error("No dpost found");
    let { data: o } = yield w.default.post(`${E}/wp-admin/admin-ajax.php`, new URLSearchParams({ action: "action_select_season", post: a, season: String(n) }), { headers: T(h({}, b), { "Content-Type": "application/x-www-form-urlencoded", Referer: e }) });
    return [...o.matchAll(/href="([^"]+\/capitulo\/[^"]+)"/g)].map((r) => r[1]).find((r) => {
      let u = r.match(/temporada-(\d+)-capitulo-(\d+)/);
      return u && parseInt(u[1]) === n && parseInt(u[2]) === s;
    }) || null;
  });
}
function tt(e, t) {
  return m(this, null, function* () {
    var u;
    let { data: n } = yield w.default.get(e, { timeout: 8e3, headers: T(h({}, b), { Referer: t }) }), s = [...n.matchAll(/href="#options-(\d+)"[^>]*>[\s\S]*?<span class="server">([\s\S]*?)<\/span>/g)], a = [...n.matchAll(/\?trembed=(\d+)(?:&#038;|&)trid=(\d+)(?:&#038;|&)trtype=(\d+)/g)];
    if (a.length === 0 || s.length === 0)
      return [];
    let o = a[0][2], c = a[0][3], l = s.sort(([, , i], [, , p]) => {
      let f = i.replace(/<[^>]+>/g, "").split("-").pop().trim().toLowerCase(), g = p.replace(/<[^>]+>/g, "").split("-").pop().trim().toLowerCase(), $ = W.indexOf(f), d = W.indexOf(g);
      return ($ === -1 ? 99 : $) - (d === -1 ? 99 : d);
    }), r = [];
    for (let [, i, p] of l) {
      let g = p.replace(/<[^>]+>/g, "").trim().split("-").pop().trim().toLowerCase(), $ = j[g] || g;
      try {
        let { data: d } = yield w.default.get(`${E}/?trembed=${i}&trid=${o}&trtype=${c}`, { timeout: 8e3, headers: T(h({}, b), { Referer: e }) }), M = (u = d.match(/<iframe[^>]*src="(https?:\/\/fastream\.to\/[^"]+)"/i)) == null ? void 0 : u[1];
        if (!M)
          continue;
        let v = yield N(M);
        if (!v)
          continue;
        if (r.push({ name: "MagisTv24", title: `${v.quality} \xB7 ${$} \xB7 Fastream`, url: v.url, quality: v.quality, headers: v.headers }), $ === "Latino")
          return console.log("[MagisTv24] Latino encontrado, retornando"), r;
      } catch (d) {
        console.log(`[MagisTv24] Error embed ${i}: ${d.message}`);
      }
    }
    return r;
  });
}
function et(e, t, n, s) {
  return m(this, null, function* () {
    if (!e || !t)
      return [];
    let a = Date.now();
    console.log(`[MagisTv24] Buscando: TMDB ${e} (${t})${n ? ` S${n}E${s}` : ""}`);
    try {
      let o = yield J(e, t);
      if (!o)
        return [];
      let c = yield V(o, t);
      if (!c)
        return [];
      let l = c.url;
      if (t === "tv" && n && s) {
        let i = yield Z(c.url, c.html, n, s);
        if (!i)
          return console.log(`[MagisTv24] Episodio S${n}E${s} no encontrado`), [];
        console.log(`[MagisTv24] Episodio: ${i}`), l = i;
      }
      let r = yield tt(l, c.url), u = ((Date.now() - a) / 1e3).toFixed(2);
      return console.log(`[MagisTv24] \u2713 ${r.length} streams en ${u}s`), r;
    } catch (o) {
      return console.log(`[MagisTv24] Error: ${o.message}`), [];
    }
  });
}
