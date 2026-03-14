var _ = Object.create;
var x = Object.defineProperty, q = Object.defineProperties, C = Object.getOwnPropertyDescriptor, D = Object.getOwnPropertyDescriptors, P = Object.getOwnPropertyNames, T = Object.getOwnPropertySymbols, K = Object.getPrototypeOf, L = Object.prototype.hasOwnProperty, z = Object.prototype.propertyIsEnumerable;
var y = (e, t, n) => t in e ? x(e, t, { enumerable: true, configurable: true, writable: true, value: n }) : e[t] = n, h = (e, t) => {
  for (var n in t || (t = {}))
    L.call(t, n) && y(e, n, t[n]);
  if (T)
    for (var n of T(t))
      z.call(t, n) && y(e, n, t[n]);
  return e;
}, E = (e, t) => q(e, D(t));
var O = (e, t) => {
  for (var n in t)
    x(e, n, { get: t[n], enumerable: true });
}, U = (e, t, n, s) => {
  if (t && typeof t == "object" || typeof t == "function")
    for (let r of P(t))
      !L.call(e, r) && r !== n && x(e, r, { get: () => t[r], enumerable: !(s = C(t, r)) || s.enumerable });
  return e;
};
var R = (e, t, n) => (n = e != null ? _(K(e)) : {}, U(t || !e || !e.__esModule ? x(n, "default", { value: e, enumerable: true }) : n, e)), X = (e) => U(x({}, "__esModule", { value: true }), e);
var m = (e, t, n) => new Promise((s, r) => {
  var o = (a) => {
    try {
      l(n.next(a));
    } catch (u) {
      r(u);
    }
  }, c = (a) => {
    try {
      l(n.throw(a));
    } catch (u) {
      r(u);
    }
  }, l = (a) => a.done ? s(a.value) : Promise.resolve(a.value).then(o, c);
  l((n = n.apply(e, t)).next());
});
var nt = {};
O(nt, { getStreams: () => et });
module.exports = X(nt);
var S = R(require("axios"));
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
      let r = 0, o = 0, c = s.split(`
`);
      for (let l of c) {
        let a = l.match(/RESOLUTION=(\d+)x(\d+)/);
        if (a) {
          let u = parseInt(a[1]), i = parseInt(a[2]);
          i > o && (o = i, r = u);
        }
      }
      return o > 0 ? G(r, o) : "1080p";
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
  let [, n, s, r, o] = t;
  for (s = parseInt(s), r = parseInt(r), o = o.split("|"); r--; )
    o[r] && (n = n.replace(new RegExp("\\b" + r.toString(s) + "\\b", "g"), o[r]));
  return n;
}
function N(e) {
  return m(this, null, function* () {
    var t;
    try {
      let s = yield (yield fetch(e, { headers: { "User-Agent": k, Referer: "https://www3.seriesmetro.net/" } })).text(), r = H(s);
      if (!r)
        return null;
      let o = (t = r.match(/file:"(https?:\/\/[^"]+\.m3u8[^"]*)"/)) == null ? void 0 : t[1];
      if (!o)
        return null;
      let c = yield I(o, { Referer: "https://fastream.to/" });
      return { url: o, quality: c, headers: { "User-Agent": k, Referer: "https://fastream.to/" } };
    } catch (n) {
      return console.error("[Fastream] Error:", n.message), null;
    }
  });
}
var Q = "439c478a771f35c05022f9feabcca01c", M = "https://www3.seriesmetro.net", Y = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36", A = { "User-Agent": Y, Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", "Accept-Language": "es-MX,es;q=0.9", Connection: "keep-alive", "Upgrade-Insecure-Requests": "1" }, W = ["latino", "lat", "castellano", "espa\xF1ol", "esp", "vose", "sub", "subtitulado"], j = { latino: "Latino", lat: "Latino", castellano: "Espa\xF1ol", espa\u00F1ol: "Espa\xF1ol", esp: "Espa\xF1ol", vose: "Subtitulado", sub: "Subtitulado", subtitulado: "Subtitulado" };
function b(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}
function J(e, t) {
  return m(this, null, function* () {
    let n = [{ lang: "es-MX", name: "Latino" }, { lang: "es-ES", name: "Espa\xF1a" }, { lang: "en-US", name: "Ingl\xE9s" }], s = yield Promise.allSettled(n.map(({ lang: f }) => S.default.get(`https://api.themoviedb.org/3/${t}/${e}?api_key=${Q}&language=${f}`, { timeout: 5e3 }).then((g) => ({ lang: f, data: g.data })))), r = {};
    for (let f of s)
      f.status === "fulfilled" && (r[f.value.lang] = f.value.data);
    let o = (f) => f ? t === "movie" ? f.title : f.name : null, c = (f) => f ? t === "movie" ? f.original_title : f.original_name : null, l = o(r["es-MX"]), a = o(r["es-ES"]), u = o(r["en-US"]), i = c(r["en-US"]) || c(r["es-MX"]), p = l;
    return (!p || /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(p)) && (p = u), p || (p = a), p ? (console.log(`[SeriesMetro] TMDB: "${p}"${a && a !== p ? ` | ES: "${a}"` : ""}`), { title: p, originalTitle: i, esTitle: a, enTitle: u }) : null;
  });
}
function V(e, t) {
  return m(this, null, function* () {
    let { title: n, originalTitle: s, esTitle: r, enTitle: o } = e, c = t === "movie" ? "pelicula" : "serie", l = [];
    n && l.push(b(n)), s && s !== n && l.push(b(s)), r && r !== n && r !== s && l.push(b(r)), o && o !== n && o !== s && o !== r && l.push(b(o));
    let a = [...new Set(l.filter((i) => i.length > 0))], u = yield Promise.allSettled(a.map((i) => S.default.get(`${M}/${c}/${i}/`, { timeout: 8e3, headers: A }).then(({ data: p }) => p.includes("trembed=") || p.includes("data-post=") ? { url: `${M}/${c}/${i}/`, html: p } : null)));
    for (let i of u)
      if (i.status === "fulfilled" && i.value)
        return console.log(`[SeriesMetro] \u2713 Encontrado: ${i.value.url}`), i.value;
    return console.log("[SeriesMetro] No encontrado por slug"), null;
  });
}
function Z(e, t, n, s) {
  return m(this, null, function* () {
    var l;
    let r = (l = t.match(/data-post="(\d+)"/)) == null ? void 0 : l[1];
    if (!r)
      throw new Error("No dpost found");
    let { data: o } = yield S.default.post(`${M}/wp-admin/admin-ajax.php`, new URLSearchParams({ action: "action_select_season", post: r, season: String(n) }), { headers: E(h({}, A), { "Content-Type": "application/x-www-form-urlencoded", Referer: e }) });
    return [...o.matchAll(/href="([^"]+\/capitulo\/[^"]+)"/g)].map((a) => a[1]).find((a) => {
      let u = a.match(/temporada-(\d+)-capitulo-(\d+)/);
      return u && parseInt(u[1]) === n && parseInt(u[2]) === s;
    }) || null;
  });
}
function tt(e, t) {
  return m(this, null, function* () {
    var u;
    let { data: n } = yield S.default.get(e, { timeout: 8e3, headers: E(h({}, A), { Referer: t }) }), s = [...n.matchAll(/href="#options-(\d+)"[^>]*>[\s\S]*?<span class="server">([\s\S]*?)<\/span>/g)], r = [...n.matchAll(/\?trembed=(\d+)(?:&#038;|&)trid=(\d+)(?:&#038;|&)trtype=(\d+)/g)];
    if (r.length === 0 || s.length === 0)
      return [];
    let o = r[0][2], c = r[0][3], l = s.sort(([, , i], [, , p]) => {
      let f = i.replace(/<[^>]+>/g, "").split("-").pop().trim().toLowerCase(), g = p.replace(/<[^>]+>/g, "").split("-").pop().trim().toLowerCase(), w = W.indexOf(f), d = W.indexOf(g);
      return (w === -1 ? 99 : w) - (d === -1 ? 99 : d);
    }), a = [];
    for (let [, i, p] of l) {
      let g = p.replace(/<[^>]+>/g, "").trim().split("-").pop().trim().toLowerCase(), w = j[g] || g;
      try {
        let { data: d } = yield S.default.get(`${M}/?trembed=${i}&trid=${o}&trtype=${c}`, { timeout: 8e3, headers: E(h({}, A), { Referer: e }) }), v = (u = d.match(/<iframe[^>]*src="(https?:\/\/fastream\.to\/[^"]+)"/i)) == null ? void 0 : u[1];
        if (!v)
          continue;
        let $ = yield N(v);
        if (!$)
          continue;
        if (a.push({ name: "SeriesMetro", title: `${$.quality} \xB7 ${w} \xB7 Fastream`, url: $.url, quality: $.quality, headers: $.headers }), w === "Latino")
          return console.log("[SeriesMetro] Latino encontrado, retornando"), a;
      } catch (d) {
        console.log(`[SeriesMetro] Error embed ${i}: ${d.message}`);
      }
    }
    return a;
  });
}
function et(e, t, n, s) {
  return m(this, null, function* () {
    if (!e || !t)
      return [];
    let r = Date.now();
    console.log(`[SeriesMetro] Buscando: TMDB ${e} (${t})${n ? ` S${n}E${s}` : ""}`);
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
          return console.log(`[SeriesMetro] Episodio S${n}E${s} no encontrado`), [];
        console.log(`[SeriesMetro] Episodio: ${i}`), l = i;
      }
      let a = yield tt(l, c.url), u = ((Date.now() - r) / 1e3).toFixed(2);
      return console.log(`[SeriesMetro] \u2713 ${a.length} streams en ${u}s`), a;
    } catch (o) {
      return console.log(`[SeriesMetro] Error: ${o.message}`), [];
    }
  });
}
