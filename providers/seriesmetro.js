var $ = Object.defineProperty, I = Object.defineProperties, D = Object.getOwnPropertyDescriptor, N = Object.getOwnPropertyDescriptors, W = Object.getOwnPropertyNames, T = Object.getOwnPropertySymbols;
var v = Object.prototype.hasOwnProperty, _ = Object.prototype.propertyIsEnumerable;
var y = (e, t, r) => t in e ? $(e, t, { enumerable: true, configurable: true, writable: true, value: r }) : e[t] = r, d = (e, t) => {
  for (var r in t || (t = {}))
    v.call(t, r) && y(e, r, t[r]);
  if (T)
    for (var r of T(t))
      _.call(t, r) && y(e, r, t[r]);
  return e;
}, b = (e, t) => I(e, N(t));
var q = (e, t) => {
  for (var r in t)
    $(e, r, { get: t[r], enumerable: true });
}, C = (e, t, r, o) => {
  if (t && typeof t == "object" || typeof t == "function")
    for (let n of W(t))
      !v.call(e, n) && n !== r && $(e, n, { get: () => t[n], enumerable: !(o = D(t, n)) || o.enumerable });
  return e;
};
var K = (e) => C($({}, "__esModule", { value: true }), e);
var m = (e, t, r) => new Promise((o, n) => {
  var s = (a) => {
    try {
      p(r.next(a));
    } catch (c) {
      n(c);
    }
  }, l = (a) => {
    try {
      p(r.throw(a));
    } catch (c) {
      n(c);
    }
  }, p = (a) => a.done ? o(a.value) : Promise.resolve(a.value).then(s, l);
  p((r = r.apply(e, t)).next());
});
var Z = {};
q(Z, { getStreams: () => V });
module.exports = K(Z);
var O = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function z(e, t) {
  return e >= 3840 || t >= 2160 ? "4K" : e >= 1920 || t >= 1080 ? "1080p" : e >= 1280 || t >= 720 ? "720p" : e >= 854 || t >= 480 ? "480p" : "360p";
}
function U(r) {
  return m(this, arguments, function* (e, t = {}) {
    try {
      let n = yield (yield fetch(e, { headers: d({ "User-Agent": O }, t), signal: AbortSignal.timeout(3e3) })).text();
      if (!n.includes("#EXT-X-STREAM-INF")) {
        let a = e.match(/[_-](\d{3,4})p/);
        return a ? `${a[1]}p` : "1080p";
      }
      let s = 0, l = 0, p = n.split(`
`);
      for (let a of p) {
        let c = a.match(/RESOLUTION=(\d+)x(\d+)/);
        if (c) {
          let i = parseInt(c[1]), u = parseInt(c[2]);
          u > l && (l = u, s = i);
        }
      }
      return l > 0 ? z(s, l) : "1080p";
    } catch (o) {
      return "1080p";
    }
  });
}
var L = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
function H(e) {
  let t = e.match(/eval\(function\(p,a,c,k,e,d\)\{.*?\}\('([\s\S]*?)',(\d+),(\d+),'([\s\S]*?)'\.split\('\|'\)\)\)/);
  if (!t)
    return null;
  let [, r, o, n, s] = t;
  for (o = parseInt(o), n = parseInt(n), s = s.split("|"); n--; )
    s[n] && (r = r.replace(new RegExp("\\b" + n.toString(o) + "\\b", "g"), s[n]));
  return r;
}
function R(e) {
  return m(this, null, function* () {
    var t;
    try {
      let o = yield (yield fetch(e, { headers: { "User-Agent": L, Referer: "https://www3.seriesmetro.net/" } })).text(), n = H(o);
      if (!n)
        return null;
      let s = (t = n.match(/file:"(https?:\/\/[^"]+\.m3u8[^"]*)"/)) == null ? void 0 : t[1];
      if (!s)
        return null;
      let l = yield U(s, { Referer: "https://fastream.to/" });
      return { url: s, quality: l, headers: { "User-Agent": L, Referer: "https://fastream.to/" } };
    } catch (r) {
      return console.error("[Fastream] Error:", r.message), null;
    }
  });
}
var X = "439c478a771f35c05022f9feabcca01c", x = "https://www3.seriesmetro.net", F = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36", P = { "User-Agent": F, Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", "Accept-Language": "es-MX,es;q=0.9", Connection: "keep-alive", "Upgrade-Insecure-Requests": "1" }, k = ["latino", "lat", "castellano", "espa\xF1ol", "esp", "vose", "sub", "subtitulado"], B = { latino: "Latino", lat: "Latino", castellano: "Espa\xF1ol", espa\u00F1ol: "Espa\xF1ol", esp: "Espa\xF1ol", vose: "Subtitulado", sub: "Subtitulado", subtitulado: "Subtitulado" };
function E(r) {
  return m(this, arguments, function* (e, t = {}) {
    let o = yield fetch(e, b(d({}, t), { headers: d(d({}, P), t.headers), signal: AbortSignal.timeout(t.timeout || 8e3) }));
    if (!o.ok)
      throw new Error(`HTTP ${o.status}`);
    return o.text();
  });
}
function G(r) {
  return m(this, arguments, function* (e, t = {}) {
    let o = yield fetch(e, b(d({}, t), { headers: d({ "User-Agent": F, Accept: "application/json" }, t.headers), signal: AbortSignal.timeout(t.timeout || 5e3) }));
    if (!o.ok)
      throw new Error(`HTTP ${o.status}`);
    return o.json();
  });
}
function A(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}
function j(e, t) {
  return m(this, null, function* () {
    let r = ["es-MX", "es-ES", "en-US"], o = yield Promise.allSettled(r.map((f) => G(`https://api.themoviedb.org/3/${t}/${e}?api_key=${X}&language=${f}`, { timeout: 5e3 }).then((g) => ({ lang: f, data: g })))), n = {};
    for (let f of o)
      f.status === "fulfilled" && (n[f.value.lang] = f.value.data);
    let s = (f) => f ? t === "movie" ? f.title : f.name : null, l = (f) => f ? t === "movie" ? f.original_title : f.original_name : null, p = s(n["es-MX"]), a = s(n["es-ES"]), c = s(n["en-US"]), i = l(n["en-US"]) || l(n["es-MX"]), u = p;
    return (!u || /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(u)) && (u = c), u || (u = a), u ? (console.log(`[SeriesMetro] TMDB: "${u}"${a && a !== u ? ` | ES: "${a}"` : ""}`), { title: u, originalTitle: i, esTitle: a, enTitle: c }) : null;
  });
}
function Q(e, t) {
  return m(this, null, function* () {
    let { title: r, originalTitle: o, esTitle: n, enTitle: s } = e, l = t === "movie" ? "pelicula" : "serie", p = [];
    r && p.push(A(r)), o && o !== r && p.push(A(o)), n && n !== r && n !== o && p.push(A(n)), s && s !== r && s !== o && s !== n && p.push(A(s));
    let a = [...new Set(p.filter((i) => i.length > 0))], c = yield Promise.allSettled(a.map((i) => E(`${x}/${l}/${i}/`).then((u) => u.includes("trembed=") || u.includes("data-post=") ? { url: `${x}/${l}/${i}/`, html: u } : null)));
    for (let i of c)
      if (i.status === "fulfilled" && i.value)
        return console.log(`[SeriesMetro] \u2713 Encontrado: ${i.value.url}`), i.value;
    return console.log("[SeriesMetro] No encontrado por slug"), null;
  });
}
function Y(e, t, r, o) {
  return m(this, null, function* () {
    var a;
    let n = (a = t.match(/data-post="(\d+)"/)) == null ? void 0 : a[1];
    if (!n)
      throw new Error("No dpost found");
    return [...(yield (yield fetch(`${x}/wp-admin/admin-ajax.php`, { method: "POST", headers: b(d({}, P), { "Content-Type": "application/x-www-form-urlencoded", Referer: e }), body: new URLSearchParams({ action: "action_select_season", post: n, season: String(r) }), signal: AbortSignal.timeout(8e3) })).text()).matchAll(/href="([^"]+\/capitulo\/[^"]+)"/g)].map((c) => c[1]).find((c) => {
      let i = c.match(/temporada-(\d+)-capitulo-(\d+)/);
      return i && parseInt(i[1]) === r && parseInt(i[2]) === o;
    }) || null;
  });
}
function J(e, t) {
  return m(this, null, function* () {
    var c;
    let r = yield E(e, { headers: { Referer: t } }), o = [...r.matchAll(/href="#options-(\d+)"[^>]*>[\s\S]*?<span class="server">([\s\S]*?)<\/span>/g)], n = [...r.matchAll(/\?trembed=(\d+)(?:&#038;|&)trid=(\d+)(?:&#038;|&)trtype=(\d+)/g)];
    if (n.length === 0 || o.length === 0)
      return [];
    let s = n[0][2], l = n[0][3], p = o.sort(([, , i], [, , u]) => {
      let f = i.replace(/<[^>]+>/g, "").split("-").pop().trim().toLowerCase(), g = u.replace(/<[^>]+>/g, "").split("-").pop().trim().toLowerCase(), h = k.indexOf(f), w = k.indexOf(g);
      return (h === -1 ? 99 : h) - (w === -1 ? 99 : w);
    }), a = [];
    for (let [, i, u] of p) {
      let g = u.replace(/<[^>]+>/g, "").trim().split("-").pop().trim().toLowerCase(), h = B[g] || g;
      try {
        let M = (c = (yield E(`${x}/?trembed=${i}&trid=${s}&trtype=${l}`, { headers: { Referer: e } })).match(/<iframe[^>]*src="(https?:\/\/fastream\.to\/[^"]+)"/i)) == null ? void 0 : c[1];
        if (!M)
          continue;
        let S = yield R(M);
        if (!S)
          continue;
        if (a.push({ name: "SeriesMetro", title: `${S.quality} \xB7 ${h} \xB7 Fastream`, url: S.url, quality: S.quality, headers: S.headers }), h === "Latino")
          return console.log("[SeriesMetro] Latino encontrado, retornando"), a;
      } catch (w) {
        console.log(`[SeriesMetro] Error embed ${i}: ${w.message}`);
      }
    }
    return a;
  });
}
function V(e, t, r, o) {
  return m(this, null, function* () {
    if (!e || !t)
      return [];
    let n = Date.now();
    console.log(`[SeriesMetro] Buscando: TMDB ${e} (${t})${r ? ` S${r}E${o}` : ""}`);
    try {
      let s = yield j(e, t);
      if (!s)
        return [];
      let l = yield Q(s, t);
      if (!l)
        return [];
      let p = l.url;
      if (t === "tv" && r && o) {
        let i = yield Y(l.url, l.html, r, o);
        if (!i)
          return console.log(`[SeriesMetro] Episodio S${r}E${o} no encontrado`), [];
        console.log(`[SeriesMetro] Episodio: ${i}`), p = i;
      }
      let a = yield J(p, l.url), c = ((Date.now() - n) / 1e3).toFixed(2);
      return console.log(`[SeriesMetro] \u2713 ${a.length} streams en ${c}s`), a;
    } catch (s) {
      return console.log(`[SeriesMetro] Error: ${s.message}`), [];
    }
  });
}
