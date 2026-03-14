var W = Object.create;
var w = Object.defineProperty, _ = Object.defineProperties, C = Object.getOwnPropertyDescriptor, q = Object.getOwnPropertyDescriptors, K = Object.getOwnPropertyNames, y = Object.getOwnPropertySymbols, z = Object.getPrototypeOf, R = Object.prototype.hasOwnProperty, B = Object.prototype.propertyIsEnumerable;
var L = (e, t, o) => t in e ? w(e, t, { enumerable: true, configurable: true, writable: true, value: o }) : e[t] = o, f = (e, t) => {
  for (var o in t || (t = {}))
    R.call(t, o) && L(e, o, t[o]);
  if (y)
    for (var o of y(t))
      B.call(t, o) && L(e, o, t[o]);
  return e;
}, S = (e, t) => _(e, q(t));
var P = (e, t) => {
  for (var o in t)
    w(e, o, { get: t[o], enumerable: true });
}, U = (e, t, o, a) => {
  if (t && typeof t == "object" || typeof t == "function")
    for (let r of K(t))
      !R.call(e, r) && r !== o && w(e, r, { get: () => t[r], enumerable: !(a = C(t, r)) || a.enumerable });
  return e;
};
var v = (e, t, o) => (o = e != null ? W(z(e)) : {}, U(t || !e || !e.__esModule ? w(o, "default", { value: e, enumerable: true }) : o, e)), O = (e) => U(w({}, "__esModule", { value: true }), e);
var p = (e, t, o) => new Promise((a, r) => {
  var n = (s) => {
    try {
      i(o.next(s));
    } catch (l) {
      r(l);
    }
  }, c = (s) => {
    try {
      i(o.throw(s));
    } catch (l) {
      r(l);
    }
  }, i = (s) => s.done ? a(s.value) : Promise.resolve(s.value).then(n, c);
  i((o = o.apply(e, t)).next());
});
var ot = {};
P(ot, { getStreams: () => et });
module.exports = O(ot);
var d = v(require("axios"));
var T = v(require("axios"));
var X = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function G(e, t) {
  return e >= 3840 || t >= 2160 ? "4K" : e >= 1920 || t >= 1080 ? "1080p" : e >= 1280 || t >= 720 ? "720p" : e >= 854 || t >= 480 ? "480p" : "360p";
}
function F(o) {
  return p(this, arguments, function* (e, t = {}) {
    try {
      let { data: a } = yield T.default.get(e, { timeout: 3e3, headers: f({ "User-Agent": X }, t), responseType: "text" });
      if (!a.includes("#EXT-X-STREAM-INF")) {
        let i = e.match(/[_-](\d{3,4})p/);
        return i ? `${i[1]}p` : "1080p";
      }
      let r = 0, n = 0, c = a.split(`
`);
      for (let i of c) {
        let s = i.match(/RESOLUTION=(\d+)x(\d+)/);
        if (s) {
          let l = parseInt(s[1]), u = parseInt(s[2]);
          u > n && (n = u, r = l);
        }
      }
      return n > 0 ? G(r, n) : "1080p";
    } catch (a) {
      return "1080p";
    }
  });
}
var I = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
function H(e) {
  let t = e.match(/eval\(function\(p,a,c,k,e,d\)\{.*?\}\('([\s\S]*?)',(\d+),(\d+),'([\s\S]*?)'\.split\('\|'\)\)\)/);
  if (!t)
    return null;
  let [, o, a, r, n] = t;
  for (a = parseInt(a), r = parseInt(r), n = n.split("|"); r--; )
    n[r] && (o = o.replace(new RegExp("\\b" + r.toString(a) + "\\b", "g"), n[r]));
  return o;
}
function k(e) {
  return p(this, null, function* () {
    var t;
    try {
      let a = yield (yield fetch(e, { headers: { "User-Agent": I, Referer: "https://www3.seriesmetro.net/" } })).text(), r = H(a);
      if (!r)
        return null;
      let n = (t = r.match(/file:"(https?:\/\/[^"]+\.m3u8[^"]*)"/)) == null ? void 0 : t[1];
      if (!n)
        return null;
      let c = yield F(n, { Referer: "https://fastream.to/" });
      return { url: n, quality: c, headers: { "User-Agent": I, Referer: "https://fastream.to/" } };
    } catch (o) {
      return console.error("[Fastream] Error:", o.message), null;
    }
  });
}
var Q = "439c478a771f35c05022f9feabcca01c", E = "https://www3.seriesmetro.net", Y = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36", M = { "User-Agent": Y, Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", "Accept-Language": "es-MX,es;q=0.9", Connection: "keep-alive", "Upgrade-Insecure-Requests": "1" }, D = ["latino", "lat", "castellano", "espa\xF1ol", "esp", "vose", "sub", "subtitulado"], j = { latino: "Latino", lat: "Latino", castellano: "Espa\xF1ol", espa\u00F1ol: "Espa\xF1ol", esp: "Espa\xF1ol", vose: "Subtitulado", sub: "Subtitulado", subtitulado: "Subtitulado" };
function N(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}
function J(e, t) {
  return p(this, null, function* () {
    let o = [{ lang: "es-MX", name: "Latino" }, { lang: "es-ES", name: "Espa\xF1a" }, { lang: "en-US", name: "Ingl\xE9s" }];
    for (let { lang: a, name: r } of o)
      try {
        let n = `https://api.themoviedb.org/3/${t}/${e}?api_key=${Q}&language=${a}`, { data: c } = yield d.default.get(n, { timeout: 5e3 }), i = t === "movie" ? c.title : c.name, s = t === "movie" ? c.original_title : c.original_name;
        if (a === "es-MX" && /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(i))
          continue;
        return console.log(`[SeriesMetro] TMDB (${r}): "${i}"`), { title: i, originalTitle: s };
      } catch (n) {
        console.log(`[SeriesMetro] Error TMDB ${r}: ${n.message}`);
      }
    return null;
  });
}
function V(e, t) {
  return p(this, null, function* () {
    let { title: o, originalTitle: a } = e, r = t === "movie" ? "pelicula" : "serie", n = [];
    o && n.push(N(o)), a && a !== o && n.push(N(a));
    for (let c of n) {
      let i = `${E}/${r}/${c}/`;
      try {
        let { data: s } = yield d.default.get(i, { timeout: 8e3, headers: M });
        if (s.includes("trembed=") || s.includes("data-post="))
          return console.log(`[SeriesMetro] \u2713 Encontrado: /${r}/${c}/`), { url: i, html: s };
      } catch (s) {
        console.log(`[SeriesMetro] Error fetch ${i}: ${s.message}`);
      }
    }
    return console.log("[SeriesMetro] No encontrado por slug"), null;
  });
}
function Z(e, t, o, a) {
  return p(this, null, function* () {
    var i;
    let r = (i = t.match(/data-post="(\d+)"/)) == null ? void 0 : i[1];
    if (!r)
      throw new Error("No dpost found");
    let { data: n } = yield d.default.post(`${E}/wp-admin/admin-ajax.php`, new URLSearchParams({ action: "action_select_season", post: r, season: String(o) }), { headers: S(f({}, M), { "Content-Type": "application/x-www-form-urlencoded", Referer: e }) });
    return [...n.matchAll(/href="([^"]+\/capitulo\/[^"]+)"/g)].map((s) => s[1]).find((s) => {
      let l = s.match(/temporada-(\d+)-capitulo-(\d+)/);
      return l && parseInt(l[1]) === o && parseInt(l[2]) === a;
    }) || null;
  });
}
function tt(e, t) {
  return p(this, null, function* () {
    var l;
    let { data: o } = yield d.default.get(e, { timeout: 8e3, headers: S(f({}, M), { Referer: t }) }), a = [...o.matchAll(/href="#options-(\d+)"[^>]*>[\s\S]*?<span class="server">([\s\S]*?)<\/span>/g)], r = [...o.matchAll(/\?trembed=(\d+)(?:&#038;|&)trid=(\d+)(?:&#038;|&)trtype=(\d+)/g)];
    if (r.length === 0 || a.length === 0)
      return [];
    let n = r[0][2], c = r[0][3], i = a.sort(([, , u], [, , x]) => {
      let b = u.replace(/<[^>]+>/g, "").split("-").pop().trim().toLowerCase(), $ = x.replace(/<[^>]+>/g, "").split("-").pop().trim().toLowerCase(), g = D.indexOf(b), m = D.indexOf($);
      return (g === -1 ? 99 : g) - (m === -1 ? 99 : m);
    }), s = [];
    for (let [, u, x] of i) {
      let $ = x.replace(/<[^>]+>/g, "").trim().split("-").pop().trim().toLowerCase(), g = j[$] || $;
      try {
        let { data: m } = yield d.default.get(`${E}/?trembed=${u}&trid=${n}&trtype=${c}`, { timeout: 8e3, headers: S(f({}, M), { Referer: e }) }), A = (l = m.match(/<iframe[^>]*src="(https?:\/\/fastream\.to\/[^"]+)"/i)) == null ? void 0 : l[1];
        if (!A)
          continue;
        let h = yield k(A);
        if (!h)
          continue;
        if (s.push({ name: "SeriesMetro", title: `${h.quality} \xB7 ${g} \xB7 Fastream`, url: h.url, quality: h.quality, headers: h.headers }), g === "Latino")
          return console.log("[SeriesMetro] Latino encontrado, retornando"), s;
      } catch (m) {
        console.log(`[SeriesMetro] Error embed ${u}: ${m.message}`);
      }
    }
    return s;
  });
}
function et(e, t, o, a) {
  return p(this, null, function* () {
    if (!e || !t)
      return [];
    let r = Date.now();
    console.log(`[SeriesMetro] Buscando: TMDB ${e} (${t})${o ? ` S${o}E${a}` : ""}`);
    try {
      let n = yield J(e, t);
      if (!n)
        return [];
      let c = yield V(n, t);
      if (!c)
        return [];
      let i = c.url;
      if (t === "tv" && o && a) {
        let u = yield Z(c.url, c.html, o, a);
        if (!u)
          return console.log(`[SeriesMetro] Episodio S${o}E${a} no encontrado`), [];
        console.log(`[SeriesMetro] Episodio: ${u}`), i = u;
      }
      let s = yield tt(i, c.url), l = ((Date.now() - r) / 1e3).toFixed(2);
      return console.log(`[SeriesMetro] \u2713 ${s.length} streams en ${l}s`), s;
    } catch (n) {
      return console.log(`[SeriesMetro] Error: ${n.message}`), [];
    }
  });
}
