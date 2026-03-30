var $ = Object.defineProperty, P = Object.defineProperties, I = Object.getOwnPropertyDescriptor, N = Object.getOwnPropertyDescriptors, W = Object.getOwnPropertyNames, y = Object.getOwnPropertySymbols;
var v = Object.prototype.hasOwnProperty, _ = Object.prototype.propertyIsEnumerable;
var M = (e, t, o) => t in e ? $(e, t, { enumerable: true, configurable: true, writable: true, value: o }) : e[t] = o, g = (e, t) => {
  for (var o in t || (t = {}))
    v.call(t, o) && M(e, o, t[o]);
  if (y)
    for (var o of y(t))
      _.call(t, o) && M(e, o, t[o]);
  return e;
}, T = (e, t) => P(e, N(t));
var q = (e, t) => {
  for (var o in t)
    $(e, o, { get: t[o], enumerable: true });
}, D = (e, t, o, s) => {
  if (t && typeof t == "object" || typeof t == "function")
    for (let r of W(t))
      !v.call(e, r) && r !== o && $(e, r, { get: () => t[r], enumerable: !(s = I(t, r)) || s.enumerable });
  return e;
};
var K = (e) => D($({}, "__esModule", { value: true }), e);
var m = (e, t, o) => new Promise((s, r) => {
  var n = (l) => {
    try {
      u(o.next(l));
    } catch (f) {
      r(f);
    }
  }, c = (l) => {
    try {
      u(o.throw(l));
    } catch (f) {
      r(f);
    }
  }, u = (l) => l.done ? s(l.value) : Promise.resolve(l.value).then(n, c);
  u((o = o.apply(e, t)).next());
});
var Z = {};
q(Z, { getStreams: () => V });
module.exports = K(Z);
var O = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function z(e, t) {
  return e >= 3840 || t >= 2160 ? "4K" : e >= 1920 || t >= 1080 ? "1080p" : e >= 1280 || t >= 720 ? "720p" : e >= 854 || t >= 480 ? "480p" : "360p";
}
function U(o) {
  return m(this, arguments, function* (e, t = {}) {
    let s = new AbortController(), r = setTimeout(() => s.abort(), 3e3);
    try {
      let n = yield fetch(e, { headers: g({ "User-Agent": O }, t), signal: s.signal });
      clearTimeout(r);
      let c = yield n.text();
      if (!c.includes("#EXT-X-STREAM-INF")) {
        let a = e.match(/[_-](\d{3,4})p/);
        return a ? `${a[1]}p` : "1080p";
      }
      let u = 0, l = 0, f = c.split(`
`);
      for (let a of f) {
        let i = a.match(/RESOLUTION=(\d+)x(\d+)/);
        if (i) {
          let p = parseInt(i[1]), d = parseInt(i[2]);
          d > l && (l = d, u = p);
        }
      }
      return l > 0 ? z(u, l) : "1080p";
    } catch (n) {
      return clearTimeout(r), "1080p";
    }
  });
}
var L = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
function H(e) {
  let t = e.match(/eval\(function\(p,a,c,k,e,d\)\{.*?\}\('([\s\S]*?)',(\d+),(\d+),'([\s\S]*?)'\.split\('\|'\)\)\)/);
  if (!t)
    return null;
  let [, o, s, r, n] = t;
  for (s = parseInt(s), r = parseInt(r), n = n.split("|"); r--; )
    n[r] && (o = o.replace(new RegExp("\\b" + r.toString(s) + "\\b", "g"), n[r]));
  return o;
}
function R(e) {
  return m(this, null, function* () {
    var t;
    try {
      let s = yield (yield fetch(e, { headers: { "User-Agent": L, Referer: "https://www3.seriesmetro.net/" } })).text(), r = H(s);
      if (!r)
        return null;
      let n = (t = r.match(/file:"(https?:\/\/[^"]+\.m3u8[^"]*)"/)) == null ? void 0 : t[1];
      if (!n)
        return null;
      let c = yield U(n, { Referer: "https://fastream.to/" });
      return { url: n, quality: c, headers: { "User-Agent": L, Referer: "https://fastream.to/" } };
    } catch (o) {
      return console.error("[Fastream] Error:", o.message), null;
    }
  });
}
var X = "439c478a771f35c05022f9feabcca01c", A = "https://www3.seriesmetro.net", C = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36", F = { "User-Agent": C, Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", "Accept-Language": "es-MX,es;q=0.9", Connection: "keep-alive", "Upgrade-Insecure-Requests": "1" }, k = ["latino", "lat", "castellano", "espa\xF1ol", "esp", "vose", "sub", "subtitulado"], B = { latino: "Latino", lat: "Latino", castellano: "Espa\xF1ol", espa\u00F1ol: "Espa\xF1ol", esp: "Espa\xF1ol", vose: "Subtitulado", sub: "Subtitulado", subtitulado: "Subtitulado" };
function x(o) {
  return m(this, arguments, function* (e, t = {}) {
    let s = new AbortController(), r = setTimeout(() => s.abort(), t.timeout || 8e3);
    try {
      let n = yield fetch(e, T(g({}, t), { headers: g(g({}, F), t.headers), signal: s.signal }));
      if (clearTimeout(r), !n.ok)
        throw new Error(`HTTP ${n.status}`);
      return n.text();
    } catch (n) {
      throw clearTimeout(r), n;
    }
  });
}
function G(o) {
  return m(this, arguments, function* (e, t = {}) {
    let s = new AbortController(), r = setTimeout(() => s.abort(), t.timeout || 5e3);
    try {
      let n = yield fetch(e, T(g({}, t), { headers: g({ "User-Agent": C, Accept: "application/json" }, t.headers), signal: s.signal }));
      if (clearTimeout(r), !n.ok)
        throw new Error(`HTTP ${n.status}`);
      return n.json();
    } catch (n) {
      throw clearTimeout(r), n;
    }
  });
}
function b(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}
function j(e, t) {
  return m(this, null, function* () {
    let o = ["es-MX", "es-ES", "en-US"], s = yield Promise.allSettled(o.map((p) => G(`https://api.themoviedb.org/3/${t}/${e}?api_key=${X}&language=${p}`, { timeout: 5e3 }).then((d) => ({ lang: p, data: d })))), r = {};
    for (let p of s)
      p.status === "fulfilled" && (r[p.value.lang] = p.value.data);
    let n = (p) => p ? t === "movie" ? p.title : p.name : null, c = (p) => p ? t === "movie" ? p.original_title : p.original_name : null, u = n(r["es-MX"]), l = n(r["es-ES"]), f = n(r["en-US"]), a = c(r["en-US"]) || c(r["es-MX"]), i = u;
    return (!i || /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(i)) && (i = f), i || (i = l), i ? (console.log(`[SeriesMetro] TMDB: "${i}"${l && l !== i ? ` | ES: "${l}"` : ""}`), { title: i, originalTitle: a, esTitle: l, enTitle: f }) : null;
  });
}
function Q(e, t) {
  return m(this, null, function* () {
    let { title: o, originalTitle: s, esTitle: r, enTitle: n } = e, c = t === "movie" ? "pelicula" : "serie", u = [];
    o && u.push(b(o)), s && s !== o && u.push(b(s)), r && r !== o && r !== s && u.push(b(r)), n && n !== o && n !== s && n !== r && u.push(b(n));
    let l = [...new Set(u.filter((a) => a.length > 0))], f = yield Promise.allSettled(l.map((a) => x(`${A}/${c}/${a}/`).then((i) => i.includes("trembed=") || i.includes("data-post=") ? { url: `${A}/${c}/${a}/`, html: i } : null)));
    for (let a of f)
      if (a.status === "fulfilled" && a.value)
        return console.log(`[SeriesMetro] \u2713 Encontrado: ${a.value.url}`), a.value;
    return console.log("[SeriesMetro] No encontrado por slug"), null;
  });
}
function Y(e, t, o, s) {
  return m(this, null, function* () {
    var f;
    let r = (f = t.match(/data-post="(\d+)"/)) == null ? void 0 : f[1];
    if (!r)
      throw new Error("No dpost found");
    let n = new AbortController(), c = setTimeout(() => n.abort(), 8e3), u;
    try {
      u = yield (yield fetch(`${A}/wp-admin/admin-ajax.php`, { method: "POST", headers: T(g({}, F), { "Content-Type": "application/x-www-form-urlencoded", Referer: e }), body: new URLSearchParams({ action: "action_select_season", post: r, season: String(o) }), signal: n.signal })).text();
    } finally {
      clearTimeout(c);
    }
    return [...u.matchAll(/href="([^"]+\/capitulo\/[^"]+)"/g)].map((a) => a[1]).find((a) => {
      let i = a.match(/temporada-(\d+)-capitulo-(\d+)/);
      return i && parseInt(i[1]) === o && parseInt(i[2]) === s;
    }) || null;
  });
}
function J(e, t) {
  return m(this, null, function* () {
    var f;
    let o = yield x(e, { headers: { Referer: t } }), s = [...o.matchAll(/href="#options-(\d+)"[^>]*>[\s\S]*?<span class="server">([\s\S]*?)<\/span>/g)], r = [...o.matchAll(/\?trembed=(\d+)(?:&#038;|&)trid=(\d+)(?:&#038;|&)trtype=(\d+)/g)];
    if (r.length === 0 || s.length === 0)
      return [];
    let n = r[0][2], c = r[0][3], u = s.sort(([, , a], [, , i]) => {
      let p = a.replace(/<[^>]+>/g, "").split("-").pop().trim().toLowerCase(), d = i.replace(/<[^>]+>/g, "").split("-").pop().trim().toLowerCase(), h = k.indexOf(p), w = k.indexOf(d);
      return (h === -1 ? 99 : h) - (w === -1 ? 99 : w);
    }), l = [];
    for (let [, a, i] of u) {
      let d = i.replace(/<[^>]+>/g, "").trim().split("-").pop().trim().toLowerCase(), h = B[d] || d;
      try {
        let E = (f = (yield x(`${A}/?trembed=${a}&trid=${n}&trtype=${c}`, { headers: { Referer: e } })).match(/<iframe[^>]*src="(https?:\/\/fastream\.to\/[^"]+)"/i)) == null ? void 0 : f[1];
        if (!E)
          continue;
        let S = yield R(E);
        if (!S)
          continue;
        if (l.push({ name: "SeriesMetro", title: `${S.quality} \xB7 ${h} \xB7 Fastream`, url: S.url, quality: S.quality, headers: S.headers }), h === "Latino")
          return console.log("[SeriesMetro] Latino encontrado, retornando"), l;
      } catch (w) {
        console.log(`[SeriesMetro] Error embed ${a}: ${w.message}`);
      }
    }
    return l;
  });
}
function V(e, t, o, s) {
  return m(this, null, function* () {
    if (!e || !t)
      return [];
    let r = Date.now();
    console.log(`[SeriesMetro] Buscando: TMDB ${e} (${t})${o ? ` S${o}E${s}` : ""}`);
    try {
      let n = yield j(e, t);
      if (!n)
        return [];
      let c = yield Q(n, t);
      if (!c)
        return [];
      let u = c.url;
      if (t === "tv" && o && s) {
        let a = yield Y(c.url, c.html, o, s);
        if (!a)
          return console.log(`[SeriesMetro] Episodio S${o}E${s} no encontrado`), [];
        console.log(`[SeriesMetro] Episodio: ${a}`), u = a;
      }
      let l = yield J(u, c.url), f = ((Date.now() - r) / 1e3).toFixed(2);
      return console.log(`[SeriesMetro] \u2713 ${l.length} streams en ${f}s`), l;
    } catch (n) {
      return console.log(`[SeriesMetro] Error: ${n.message}`), [];
    }
  });
}
