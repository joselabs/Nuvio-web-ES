var ge = Object.create;
var k = Object.defineProperty;
var ye = Object.getOwnPropertyDescriptor;
var we = Object.getOwnPropertyNames, Q = Object.getOwnPropertySymbols, ve = Object.getPrototypeOf, J = Object.prototype.hasOwnProperty, xe = Object.prototype.propertyIsEnumerable;
var X = (e, t, o) => t in e ? k(e, t, { enumerable: true, configurable: true, writable: true, value: o }) : e[t] = o, q = (e, t) => {
  for (var o in t || (t = {}))
    J.call(t, o) && X(e, o, t[o]);
  if (Q)
    for (var o of Q(t))
      xe.call(t, o) && X(e, o, t[o]);
  return e;
};
var Se = (e, t) => {
  for (var o in t)
    k(e, o, { get: t[o], enumerable: true });
}, Y = (e, t, o, r) => {
  if (t && typeof t == "object" || typeof t == "function")
    for (let n of we(t))
      !J.call(e, n) && n !== o && k(e, n, { get: () => t[n], enumerable: !(r = ye(t, n)) || r.enumerable });
  return e;
};
var S = (e, t, o) => (o = e != null ? ge(ve(e)) : {}, Y(t || !e || !e.__esModule ? k(o, "default", { value: e, enumerable: true }) : o, e)), $e = (e) => Y(k({}, "__esModule", { value: true }), e);
var h = (e, t, o) => new Promise((r, n) => {
  var i = (f) => {
    try {
      a(o.next(f));
    } catch (u) {
      n(u);
    }
  }, s = (f) => {
    try {
      a(o.throw(f));
    } catch (u) {
      n(u);
    }
  }, a = (f) => f.done ? r(f.value) : Promise.resolve(f.value).then(i, s);
  a((o = o.apply(e, t)).next());
});
var Ce = {};
Se(Ce, { getStreams: () => Ve });
module.exports = $e(Ce);
var F = S(require("axios"));
var te = S(require("axios"));
var Z = S(require("axios"));
var Ae = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function z(e, t) {
  return e >= 3840 || t >= 2160 ? "4K" : e >= 1920 || t >= 1080 ? "1080p" : e >= 1280 || t >= 720 ? "720p" : e >= 854 || t >= 480 ? "480p" : "360p";
}
function y(o) {
  return h(this, arguments, function* (e, t = {}) {
    try {
      let { data: r } = yield Z.default.get(e, { timeout: 3e3, headers: q({ "User-Agent": Ae }, t), responseType: "text" });
      if (!r.includes("#EXT-X-STREAM-INF")) {
        let a = e.match(/[_-](\d{3,4})p/);
        return a ? `${a[1]}p` : "1080p";
      }
      let n = 0, i = 0, s = r.split(`
`);
      for (let a of s) {
        let f = a.match(/RESOLUTION=(\d+)x(\d+)/);
        if (f) {
          let u = parseInt(f[1]), l = parseInt(f[2]);
          l > i && (i = l, n = u);
        }
      }
      return i > 0 ? z(n, i) : "1080p";
    } catch (r) {
      return "1080p";
    }
  });
}
var ee = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function oe(e) {
  return h(this, null, function* () {
    try {
      console.log(`[GoodStream] Resolviendo: ${e}`);
      let o = (yield te.default.get(e, { headers: { "User-Agent": ee, Referer: "https://goodstream.one", Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" }, timeout: 15e3, maxRedirects: 5 })).data.match(/file:\s*"([^"]+)"/);
      if (!o)
        return console.log('[GoodStream] No se encontr\xF3 patr\xF3n file:"..."'), null;
      let r = o[1], n = { Referer: e, Origin: "https://goodstream.one", "User-Agent": ee }, i = yield y(r, n);
      return console.log(`[GoodStream] URL encontrada (${i}): ${r.substring(0, 80)}...`), { url: r, quality: i, headers: n };
    } catch (t) {
      return console.log(`[GoodStream] Error: ${t.message}`), null;
    }
  });
}
var ne = S(require("axios"));
var Re = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function re(e) {
  try {
    return typeof atob != "undefined" ? atob(e) : Buffer.from(e, "base64").toString("utf8");
  } catch (t) {
    return null;
  }
}
function Ee(e, t) {
  try {
    let r = t.replace(/^\[|\]$/g, "").split("','").map((u) => u.replace(/^'+|'+$/g, "")).map((u) => u.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), n = "";
    for (let u of e) {
      let l = u.charCodeAt(0);
      l > 64 && l < 91 ? l = (l - 52) % 26 + 65 : l > 96 && l < 123 && (l = (l - 84) % 26 + 97), n += String.fromCharCode(l);
    }
    for (let u of r)
      n = n.replace(new RegExp(u, "g"), "_");
    n = n.split("_").join("");
    let i = re(n);
    if (!i)
      return null;
    let s = "";
    for (let u = 0; u < i.length; u++)
      s += String.fromCharCode((i.charCodeAt(u) - 3 + 256) % 256);
    let a = s.split("").reverse().join(""), f = re(a);
    return f ? JSON.parse(f) : null;
  } catch (o) {
    return console.log("[VOE] voeDecode error:", o.message), null;
  }
}
function B(o) {
  return h(this, arguments, function* (e, t = {}) {
    return ne.default.get(e, { timeout: 15e3, maxRedirects: 5, headers: q({ "User-Agent": Re, Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" }, t), validateStatus: (r) => r < 500 });
  });
}
function se(e) {
  return h(this, null, function* () {
    try {
      console.log(`[VOE] Resolviendo: ${e}`);
      let t = yield B(e, { Referer: e }), o = String(t && t.data ? t.data : "");
      if (/permanentToken/i.test(o)) {
        let f = o.match(/window\.location\.href\s*=\s*'([^']+)'/i);
        if (f) {
          console.log(`[VOE] Permanent token redirect -> ${f[1]}`);
          let u = yield B(f[1], { Referer: e });
          u && u.data && (o = String(u.data));
        }
      }
      let r = o.match(/json">\s*\[\s*['"]([^'"]+)['"]\s*\]\s*<\/script>\s*<script[^>]*src=['"]([^'"]+)['"]/i);
      if (r) {
        let f = r[1], u = r[2].startsWith("http") ? r[2] : new URL(r[2], e).href;
        console.log(`[VOE] Found encoded array + loader: ${u}`);
        let l = yield B(u, { Referer: e }), c = l && l.data ? String(l.data) : "", p = c.match(/(\[(?:'[^']{1,10}'[\s,]*){4,12}\])/i) || c.match(/(\[(?:"[^"]{1,10}"[,\s]*){4,12}\])/i);
        if (p) {
          let d = Ee(f, p[1]);
          if (d && (d.source || d.direct_access_url)) {
            let $ = d.source || d.direct_access_url, w = yield y($, { Referer: e });
            return console.log(`[VOE] URL encontrada: ${$.substring(0, 80)}...`), { url: $, quality: w, headers: { Referer: e } };
          }
        }
      }
      let n = /(?:mp4|hls)'\s*:\s*'([^']+)'/gi, i = /(?:mp4|hls)"\s*:\s*"([^"]+)"/gi, s = [], a;
      for (; (a = n.exec(o)) !== null; )
        s.push(a);
      for (; (a = i.exec(o)) !== null; )
        s.push(a);
      for (let f of s) {
        let u = f[1];
        if (!u)
          continue;
        let l = u;
        if (l.startsWith("aHR0"))
          try {
            l = atob(l);
          } catch (c) {
          }
        return console.log(`[VOE] URL encontrada (fallback): ${l.substring(0, 80)}...`), { url: l, quality: yield y(l, { Referer: e }), headers: { Referer: e } };
      }
      return console.log("[VOE] No se encontr\xF3 URL"), null;
    } catch (t) {
      return console.log(`[VOE] Error: ${t.message}`), null;
    }
  });
}
var I = S(require("axios")), E = S(require("crypto-js"));
var D = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function V(e) {
  e = e.replace(/-/g, "+").replace(/_/g, "/");
  let t = (4 - e.length % 4) % 4;
  return E.default.enc.Base64.parse(e + "=".repeat(t));
}
function W(e) {
  let t = e.words, o = e.sigBytes, r = new Uint8Array(o);
  for (let n = 0; n < o; n++)
    r[n] = t[n >>> 2] >>> 24 - n % 4 * 8 & 255;
  return r;
}
function H(e) {
  let t = [];
  for (let o = 0; o < e.length; o += 4)
    t.push((e[o] || 0) << 24 | (e[o + 1] || 0) << 16 | (e[o + 2] || 0) << 8 | (e[o + 3] || 0));
  return E.default.lib.WordArray.create(t, e.length);
}
function ae(e) {
  let t = new Uint8Array(e);
  for (let o = 15; o >= 12 && (t[o]++, t[o] === 0); o--)
    ;
  return t;
}
function We(e, t, o) {
  try {
    let r = new Uint8Array(16);
    r.set(t, 0), r[15] = 1;
    let n = ae(r), i = H(e), s = new Uint8Array(o.length);
    for (let a = 0; a < o.length; a += 16) {
      let f = Math.min(16, o.length - a), u = H(n), l = E.default.AES.encrypt(u, i, { mode: E.default.mode.ECB, padding: E.default.pad.NoPadding }), c = W(l.ciphertext);
      for (let p = 0; p < f; p++)
        s[a + p] = o[a + p] ^ c[p];
      n = ae(n);
    }
    return s;
  } catch (r) {
    return console.log("[Filemoon] AES-GCM error:", r.message), null;
  }
}
function P(e) {
  return h(this, null, function* () {
    var t, o, r;
    console.log(`[Filemoon] Resolviendo: ${e}`);
    try {
      let n = e.match(/\/(?:e|d)\/([a-z0-9]{12})/i);
      if (!n)
        return null;
      let i = n[1], { data: s } = yield I.default.get(`https://filemooon.link/api/videos/${i}/embed/playback`, { timeout: 7e3, headers: { "User-Agent": D, Referer: e } });
      if (s.error)
        return console.log(`[Filemoon] API error: ${s.error}`), null;
      let a = s.playback;
      if ((a == null ? void 0 : a.algorithm) !== "AES-256-GCM" || ((t = a.key_parts) == null ? void 0 : t.length) !== 2)
        return console.log("[Filemoon] Formato de cifrado no soportado"), null;
      let f = W(V(a.key_parts[0])), u = W(V(a.key_parts[1])), l = new Uint8Array(f.length + u.length);
      l.set(f, 0), l.set(u, f.length);
      let c;
      if (l.length === 32)
        c = l;
      else {
        let g = H(l);
        c = W(E.default.SHA256(g));
      }
      let p = W(V(a.iv)), d = W(V(a.payload));
      if (d.length < 16)
        return null;
      let $ = d.slice(0, -16), w = We(c, p, $);
      if (!w)
        return null;
      let L = "";
      for (let g = 0; g < w.length; g++)
        L += String.fromCharCode(w[g]);
      let m = (r = (o = JSON.parse(L).sources) == null ? void 0 : o[0]) == null ? void 0 : r.url;
      if (!m)
        return null;
      console.log(`[Filemoon] URL encontrada: ${m.substring(0, 80)}...`);
      let A = m, v = "1080p";
      if (m.includes("master"))
        try {
          let x = (yield I.default.get(m, { timeout: 3e3, headers: { "User-Agent": D, Referer: e }, responseType: "text" })).data.split(`
`), R = 0, O = 0, M = m;
          for (let b = 0; b < x.length; b++) {
            let j = x[b].trim();
            if (j.startsWith("#EXT-X-STREAM-INF")) {
              let N = j.match(/RESOLUTION=(\d+)x(\d+)/), he = N ? parseInt(N[1]) : 0, G = N ? parseInt(N[2]) : 0;
              for (let _ = b + 1; _ < b + 3 && _ < x.length; _++) {
                let T = x[_].trim();
                if (T && !T.startsWith("#") && G > R) {
                  R = G, O = he, M = T.startsWith("http") ? T : new URL(T, m).toString();
                  break;
                }
              }
            }
          }
          R > 0 && (A = M, v = z(O, R), console.log(`[Filemoon] Mejor calidad: ${v}`));
        } catch (g) {
          console.log(`[Filemoon] No se pudo parsear master: ${g.message}`);
        }
      return { url: A, quality: v, headers: { "User-Agent": D, Referer: e, Origin: "https://filemoon.sx" } };
    } catch (n) {
      return console.log(`[Filemoon] Error: ${n.message}`), null;
    }
  });
}
var le = S(require("axios"));
var ie = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function U(e) {
  return h(this, null, function* () {
    try {
      let o = (yield le.default.get(e, { headers: { "User-Agent": ie, Referer: "https://hlswish.com/", Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" }, timeout: 15e3, maxRedirects: 5 })).data;
      console.log(`[HLSWish] Resolviendo: ${e}`);
      let r = o.match(/eval\(function\(p,a,c,k,e,[dr]\)\{[\s\S]+?\}\('([\s\S]+?)',(\d+),(\d+),'([\s\S]+?)'\.split\('\|'\)/);
      if (r) {
        let n = r[1], i = parseInt(r[2]), s = r[4].split("|"), a = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", f = (c) => {
          let p = 0;
          for (let d = 0; d < c.length; d++)
            p = p * i + a.indexOf(c[d]);
          return p;
        }, l = n.replace(/\b(\w+)\b/g, (c) => {
          let p = f(c);
          return s[p] && s[p] !== "" ? s[p] : c;
        }).match(/["']([^"']+\.m3u8[^"']*)['"]/i);
        if (l) {
          let c = l[1];
          c.startsWith("/") && (c = "https://hlswish.com" + c);
          let p = { "User-Agent": ie, Referer: "https://hlswish.com/" }, d = yield y(c, p);
          return console.log(`[HLSWish] URL encontrada (${d}): ${c.substring(0, 80)}...`), { url: c, quality: d, headers: p };
        }
      }
      return console.log("[HLSWish] No se encontr\xF3 URL"), null;
    } catch (t) {
      return console.log(`[HLSWish] Error: ${t.message}`), null;
    }
  });
}
var ue = S(require("axios"));
var ce = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function pe(e) {
  return h(this, null, function* () {
    try {
      console.log(`[Vimeos] Resolviendo: ${e}`);
      let r = (yield ue.default.get(e, { headers: { "User-Agent": ce, Referer: "https://vimeos.net/", Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" }, timeout: 15e3, maxRedirects: 5 })).data.match(/eval\(function\(p,a,c,k,e,[dr]\)\{[\s\S]+?\}\('([\s\S]+?)',(\d+),(\d+),'([\s\S]+?)'\.split\('\|'\)/);
      if (r) {
        let n = r[1], i = parseInt(r[2]), s = r[4].split("|"), a = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", f = (c) => {
          let p = 0;
          for (let d = 0; d < c.length; d++)
            p = p * i + a.indexOf(c[d]);
          return p;
        }, l = n.replace(/\b(\w+)\b/g, (c) => {
          let p = f(c);
          return s[p] && s[p] !== "" ? s[p] : c;
        }).match(/["']([^"']+\.m3u8[^"']*)['"]/i);
        if (l) {
          let c = l[1], p = { "User-Agent": ce, Referer: "https://vimeos.net/" }, d = yield y(c, p);
          return console.log(`[Vimeos] URL encontrada: ${c.substring(0, 80)}...`), { url: c, quality: d, headers: p };
        }
      }
      return console.log("[Vimeos] No se encontr\xF3 URL"), null;
    } catch (t) {
      return console.log(`[Vimeos] Error: ${t.message}`), null;
    }
  });
}
var Le = "439c478a771f35c05022f9feabcca01c", Me = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36", C = { "User-Agent": Me, Accept: "application/json" }, fe = { "goodstream.one": oe, "hlswish.com": U, "streamwish.com": U, "streamwish.to": U, "strwish.com": U, "voe.sx": se, "filemoon.sx": P, "filemoon.to": P, "vimeos.net": pe }, de = (e) => e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim(), me = (e, t) => {
  let o = de(e), r = de(t);
  if (o === r)
    return 1;
  if (o.includes(r) || r.includes(o))
    return 0.8;
  let n = new Set(o.split(/\s+/)), i = new Set(r.split(/\s+/));
  return [...n].filter((a) => i.has(a)).length / Math.max(n.size, i.size);
}, be = (e) => {
  let t = e.toString().toLowerCase(), o = t.match(/(\d+)/);
  return o ? `${o[1]}p` : t.includes("4k") || t.includes("uhd") ? "2160p" : t.includes("full") || t.includes("fhd") ? "1080p" : t.includes("hd") ? "720p" : "SD";
}, Te = (e) => e.includes("goodstream") ? "GoodStream" : e.includes("hlswish") || e.includes("streamwish") ? "StreamWish" : e.includes("voe.sx") ? "VOE" : e.includes("filemoon") ? "Filemoon" : e.includes("vimeos.net") ? "Vimeos" : "Online", ke = (e) => {
  if (!e || !e.startsWith("http"))
    return null;
  for (let t in fe)
    if (e.includes(t))
      return fe[t];
  return null;
};
function Ue(e, t) {
  return h(this, null, function* () {
    let o = (a, f) => h(this, null, function* () {
      let u = `https://api.themoviedb.org/3/${t}/${e}?api_key=${Le}&language=${a}`, { data: l } = yield F.default.get(u, { timeout: 5e3, headers: C }), c = t === "movie" ? l.title : l.name, p = t === "movie" ? l.original_title : l.original_name;
      if (!c)
        throw new Error("No title");
      if (a === "es-MX" && /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(c))
        throw new Error("Japanese title");
      return { title: c, originalTitle: p, year: (l.release_date || l.first_air_date || "").substring(0, 4) };
    }), [r, n, i] = yield Promise.allSettled([o("es-MX", "Latino"), o("en-US", "Ingl\xE9s"), o("es-ES", "Espa\xF1a")]), s = r.status === "fulfilled" ? r.value : n.status === "fulfilled" ? n.value : i.status === "fulfilled" ? i.value : null;
    return s && console.log(`[LaMovie] TMDB: "${s.title}"${s.title !== s.originalTitle ? ` | Original: "${s.originalTitle}"` : ""}`), s;
  });
}
function Fe(e, t) {
  let o = /* @__PURE__ */ new Set(), { title: r, originalTitle: n, year: i } = e;
  if (r) {
    o.add(r.trim());
    let s = r.replace(/[¿¡:;"']/g, "").replace(/\s+/g, " ").trim();
    s !== r && o.add(s);
  }
  return n && n !== r && !/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(n) && o.add(n.trim()), t === "movie" && i && [...o].forEach((a) => {
    a.includes(i) || (o.add(`${a} ${i}`), o.add(`${a} (${i})`));
  }), [...o].forEach((s) => {
    let a = s.replace(/^(el|la|los|las|the|a|an)\s+/i, "").trim();
    a.length > 2 && o.add(a);
  }), [...o].slice(0, 8);
}
function Oe(e, t) {
  return h(this, null, function* () {
    var n;
    let r = `https://la.movie/wp-api/v1/search?filter=%7B%7D&postType=any&q=${encodeURIComponent(e.trim())}&postsPerPage=10`;
    try {
      let { data: i } = yield F.default.get(r, { timeout: 8e3, headers: C });
      return (n = i == null ? void 0 : i.data) != null && n.posts ? i.data.posts.filter((s) => t === "movie" ? s.type === "movie" || s.type === "movies" : s.type === "tvshow" || s.type === "tvshows" || s.type === "series") : [];
    } catch (i) {
      return [];
    }
  });
}
function Ne(e, t) {
  if (e.length === 0)
    return null;
  if (e.length === 1)
    return e[0];
  let o = e.map((r) => {
    let n = me(r.title || "", t.title) * 2;
    return t.originalTitle && (n += me(r.title || "", t.originalTitle)), t.year && r.year && r.year.toString() === t.year && (n += 0.5), { result: r, score: n };
  });
  return o.sort((r, n) => n.score - r.score), o[0].result;
}
function _e(e, t, o) {
  return h(this, null, function* () {
    var n;
    let r = `https://la.movie/wp-api/v1/single/episodes/list?_id=${e}&season=${t}&page=1&postsPerPage=50`;
    try {
      let { data: i } = yield F.default.get(r, { timeout: 12e3, headers: C });
      if (!((n = i == null ? void 0 : i.data) != null && n.posts))
        return null;
      let s = i.data.posts.find((a) => a.season_number == t && a.episode_number == o);
      return (s == null ? void 0 : s._id) || null;
    } catch (i) {
      return console.log(`[LaMovie] Error episodios: ${i.message}`), null;
    }
  });
}
function qe(e) {
  return h(this, null, function* () {
    try {
      let t = ke(e.url);
      if (!t)
        return console.log(`[LaMovie] Sin resolver para: ${e.url}`), null;
      let o = yield t(e.url);
      if (!o || !o.url)
        return null;
      let r = be(e.quality || "1080p"), n = Te(e.url);
      return { name: "LaMovie", title: `${o.quality || "1080p"} \xB7 ${n}`, url: o.url, quality: o.quality || "1080p", headers: o.headers || {} };
    } catch (t) {
      return console.log(`[LaMovie] Error procesando embed: ${t.message}`), null;
    }
  });
}
function Ve(e, t, o, r) {
  return h(this, null, function* () {
    var i;
    if (!e || !t)
      return [];
    let n = Date.now();
    console.log(`[LaMovie] Buscando: TMDB ${e} (${t})${o ? ` S${o}E${r}` : ""}`);
    try {
      let s = yield Ue(e, t);
      if (!s)
        return [];
      let a = Fe(s, t);
      console.log(`[LaMovie] ${a.length} variantes generadas`);
      let f = a.slice(0, 3).map((m) => h(this, null, function* () {
        let A = yield Oe(m, t);
        return { variant: m, results: A };
      })), u = yield Promise.allSettled(f), l = null;
      for (let m of u)
        if (m.status === "fulfilled" && m.value.results.length > 0) {
          l = m.value;
          break;
        }
      if (!l)
        return console.log("[LaMovie] Sin resultados"), [];
      console.log(`[LaMovie] \u2713 "${l.variant}" (${l.results.length} resultados)`);
      let c = Ne(l.results, s);
      if (!c)
        return [];
      let p = c._id;
      if (t === "tv" && o && r) {
        let m = yield _e(p, o, r);
        if (!m)
          return console.log(`[LaMovie] Episodio S${o}E${r} no encontrado`), [];
        p = m;
      }
      let { data: d } = yield F.default.get(`https://la.movie/wp-api/v1/player?postId=${p}&demo=0`, { timeout: 6e3, headers: C });
      if (!((i = d == null ? void 0 : d.data) != null && i.embeds))
        return console.log("[LaMovie] No hay embeds disponibles"), [];
      let $ = 5e3, w = d.data.embeds.map((m) => qe(m)), L = yield new Promise((m) => {
        let A = [], v = 0, g = w.length, x = () => m(A.filter(Boolean)), R = setTimeout(x, $);
        w.forEach((O) => {
          O.then((M) => {
            M && A.push(M), v++, v === g && (clearTimeout(R), x());
          }).catch(() => {
            v++, v === g && (clearTimeout(R), x());
          });
        });
      }), K = ((Date.now() - n) / 1e3).toFixed(2);
      return console.log(`[LaMovie] \u2713 ${L.length} streams en ${K}s`), L;
    } catch (s) {
      return console.log(`[LaMovie] Error: ${s.message}`), [];
    }
  });
}
