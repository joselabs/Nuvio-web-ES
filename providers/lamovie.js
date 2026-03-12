var we = Object.create;
var b = Object.defineProperty;
var $e = Object.getOwnPropertyDescriptor;
var Ae = Object.getOwnPropertyNames, Y = Object.getOwnPropertySymbols, Se = Object.getPrototypeOf, ee = Object.prototype.hasOwnProperty, Re = Object.prototype.propertyIsEnumerable;
var Z = (e, t, o) => t in e ? b(e, t, { enumerable: true, configurable: true, writable: true, value: o }) : e[t] = o, F = (e, t) => {
  for (var o in t || (t = {}))
    ee.call(t, o) && Z(e, o, t[o]);
  if (Y)
    for (var o of Y(t))
      Re.call(t, o) && Z(e, o, t[o]);
  return e;
};
var xe = (e, t) => {
  for (var o in t)
    b(e, o, { get: t[o], enumerable: true });
}, te = (e, t, o, r) => {
  if (t && typeof t == "object" || typeof t == "function")
    for (let n of Ae(t))
      !ee.call(e, n) && n !== o && b(e, n, { get: () => t[n], enumerable: !(r = $e(t, n)) || r.enumerable });
  return e;
};
var w = (e, t, o) => (o = e != null ? we(Se(e)) : {}, te(t || !e || !e.__esModule ? b(o, "default", { value: e, enumerable: true }) : o, e)), Ee = (e) => te(b({}, "__esModule", { value: true }), e);
var g = (e, t, o) => new Promise((r, n) => {
  var s = (l) => {
    try {
      a(o.next(l));
    } catch (u) {
      n(u);
    }
  }, i = (l) => {
    try {
      a(o.throw(l));
    } catch (u) {
      n(u);
    }
  }, a = (l) => l.done ? r(l.value) : Promise.resolve(l.value).then(s, i);
  a((o = o.apply(e, t)).next());
});
var Ze = {};
xe(Ze, { getStreams: () => Ye });
module.exports = Ee(Ze);
var x = w(require("axios"));
var ne = w(require("axios"));
var oe = w(require("axios"));
var Me = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function H(e, t) {
  return e >= 3840 || t >= 2160 ? "4K" : e >= 1920 || t >= 1080 ? "1080p" : e >= 1280 || t >= 720 ? "720p" : e >= 854 || t >= 480 ? "480p" : "360p";
}
function A(o) {
  return g(this, arguments, function* (e, t = {}) {
    try {
      let { data: r } = yield oe.default.get(e, { timeout: 3e3, headers: F({ "User-Agent": Me }, t), responseType: "text" });
      if (!r.includes("#EXT-X-STREAM-INF")) {
        let a = e.match(/[_-](\d{3,4})p/);
        return a ? `${a[1]}p` : "1080p";
      }
      let n = 0, s = 0, i = r.split(`
`);
      for (let a of i) {
        let l = a.match(/RESOLUTION=(\d+)x(\d+)/);
        if (l) {
          let u = parseInt(l[1]), c = parseInt(l[2]);
          c > s && (s = c, n = u);
        }
      }
      return s > 0 ? H(n, s) : "1080p";
    } catch (r) {
      return "1080p";
    }
  });
}
var re = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function se(e) {
  return g(this, null, function* () {
    try {
      console.log(`[GoodStream] Resolviendo: ${e}`);
      let o = (yield ne.default.get(e, { headers: { "User-Agent": re, Referer: "https://goodstream.one", Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" }, timeout: 15e3, maxRedirects: 5 })).data.match(/file:\s*"([^"]+)"/);
      if (!o)
        return console.log('[GoodStream] No se encontr\xF3 patr\xF3n file:"..."'), null;
      let r = o[1], n = { Referer: e, Origin: "https://goodstream.one", "User-Agent": re }, s = yield A(r, n);
      return console.log(`[GoodStream] URL encontrada (${s}): ${r.substring(0, 80)}...`), { url: r, quality: s, headers: n };
    } catch (t) {
      return console.log(`[GoodStream] Error: ${t.message}`), null;
    }
  });
}
var ae = w(require("axios"));
var Le = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function ie(e) {
  try {
    return typeof atob != "undefined" ? atob(e) : Buffer.from(e, "base64").toString("utf8");
  } catch (t) {
    return null;
  }
}
function We(e, t) {
  try {
    let r = t.replace(/^\[|\]$/g, "").split("','").map((u) => u.replace(/^'+|'+$/g, "")).map((u) => u.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), n = "";
    for (let u of e) {
      let c = u.charCodeAt(0);
      c > 64 && c < 91 ? c = (c - 52) % 26 + 65 : c > 96 && c < 123 && (c = (c - 84) % 26 + 97), n += String.fromCharCode(c);
    }
    for (let u of r)
      n = n.replace(new RegExp(u, "g"), "_");
    n = n.split("_").join("");
    let s = ie(n);
    if (!s)
      return null;
    let i = "";
    for (let u = 0; u < s.length; u++)
      i += String.fromCharCode((s.charCodeAt(u) - 3 + 256) % 256);
    let a = i.split("").reverse().join(""), l = ie(a);
    return l ? JSON.parse(l) : null;
  } catch (o) {
    return console.log("[VOE] voeDecode error:", o.message), null;
  }
}
function V(o) {
  return g(this, arguments, function* (e, t = {}) {
    return ae.default.get(e, { timeout: 15e3, maxRedirects: 5, headers: F({ "User-Agent": Le, Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" }, t), validateStatus: (r) => r < 500 });
  });
}
function le(e) {
  return g(this, null, function* () {
    try {
      console.log(`[VOE] Resolviendo: ${e}`);
      let t = yield V(e, { Referer: e }), o = String(t && t.data ? t.data : "");
      if (/permanentToken/i.test(o)) {
        let l = o.match(/window\.location\.href\s*=\s*'([^']+)'/i);
        if (l) {
          console.log(`[VOE] Permanent token redirect -> ${l[1]}`);
          let u = yield V(l[1], { Referer: e });
          u && u.data && (o = String(u.data));
        }
      }
      let r = o.match(/json">\s*\[\s*['"]([^'"]+)['"]\s*\]\s*<\/script>\s*<script[^>]*src=['"]([^'"]+)['"]/i);
      if (r) {
        let l = r[1], u = r[2].startsWith("http") ? r[2] : new URL(r[2], e).href;
        console.log(`[VOE] Found encoded array + loader: ${u}`);
        let c = yield V(u, { Referer: e }), p = c && c.data ? String(c.data) : "", f = p.match(/(\[(?:'[^']{1,10}'[\s,]*){4,12}\])/i) || p.match(/(\[(?:"[^"]{1,10}"[,\s]*){4,12}\])/i);
        if (f) {
          let d = We(l, f[1]);
          if (d && (d.source || d.direct_access_url)) {
            let m = d.source || d.direct_access_url, v = yield A(m, { Referer: e });
            return console.log(`[VOE] URL encontrada: ${m.substring(0, 80)}...`), { url: m, quality: v, headers: { Referer: e } };
          }
        }
      }
      let n = /(?:mp4|hls)'\s*:\s*'([^']+)'/gi, s = /(?:mp4|hls)"\s*:\s*"([^"]+)"/gi, i = [], a;
      for (; (a = n.exec(o)) !== null; )
        i.push(a);
      for (; (a = s.exec(o)) !== null; )
        i.push(a);
      for (let l of i) {
        let u = l[1];
        if (!u)
          continue;
        let c = u;
        if (c.startsWith("aHR0"))
          try {
            c = atob(c);
          } catch (p) {
          }
        return console.log(`[VOE] URL encontrada (fallback): ${c.substring(0, 80)}...`), { url: c, quality: yield A(c, { Referer: e }), headers: { Referer: e } };
      }
      return console.log("[VOE] No se encontr\xF3 URL"), null;
    } catch (t) {
      return console.log(`[VOE] Error: ${t.message}`), null;
    }
  });
}
var D = w(require("axios")), S = w(require("crypto-js"));
var B = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function q(e) {
  e = e.replace(/-/g, "+").replace(/_/g, "/");
  let t = (4 - e.length % 4) % 4;
  return S.default.enc.Base64.parse(e + "=".repeat(t));
}
function R(e) {
  let t = e.words, o = e.sigBytes, r = new Uint8Array(o);
  for (let n = 0; n < o; n++)
    r[n] = t[n >>> 2] >>> 24 - n % 4 * 8 & 255;
  return r;
}
function P(e) {
  let t = [];
  for (let o = 0; o < e.length; o += 4)
    t.push((e[o] || 0) << 24 | (e[o + 1] || 0) << 16 | (e[o + 2] || 0) << 8 | (e[o + 3] || 0));
  return S.default.lib.WordArray.create(t, e.length);
}
function ce(e) {
  let t = new Uint8Array(e);
  for (let o = 15; o >= 12 && (t[o]++, t[o] === 0); o--)
    ;
  return t;
}
function be(e, t, o) {
  try {
    let r = new Uint8Array(16);
    r.set(t, 0), r[15] = 1;
    let n = ce(r), s = P(e), i = new Uint8Array(o.length);
    for (let a = 0; a < o.length; a += 16) {
      let l = Math.min(16, o.length - a), u = P(n), c = S.default.AES.encrypt(u, s, { mode: S.default.mode.ECB, padding: S.default.pad.NoPadding }), p = R(c.ciphertext);
      for (let f = 0; f < l; f++)
        i[a + f] = o[a + f] ^ p[f];
      n = ce(n);
    }
    return i;
  } catch (r) {
    return console.log("[Filemoon] AES-GCM error:", r.message), null;
  }
}
function j(e) {
  return g(this, null, function* () {
    var t, o, r;
    console.log(`[Filemoon] Resolviendo: ${e}`);
    try {
      let n = e.match(/\/(?:e|d)\/([a-z0-9]{12})/i);
      if (!n)
        return null;
      let s = n[1], { data: i } = yield D.default.get(`https://filemooon.link/api/videos/${s}/embed/playback`, { timeout: 7e3, headers: { "User-Agent": B, Referer: e } });
      if (i.error)
        return console.log(`[Filemoon] API error: ${i.error}`), null;
      let a = i.playback;
      if ((a == null ? void 0 : a.algorithm) !== "AES-256-GCM" || ((t = a.key_parts) == null ? void 0 : t.length) !== 2)
        return console.log("[Filemoon] Formato de cifrado no soportado"), null;
      let l = R(q(a.key_parts[0])), u = R(q(a.key_parts[1])), c = new Uint8Array(l.length + u.length);
      c.set(l, 0), c.set(u, l.length);
      let p;
      if (c.length === 32)
        p = c;
      else {
        let y = P(c);
        p = R(S.default.SHA256(y));
      }
      let f = R(q(a.iv)), d = R(q(a.payload));
      if (d.length < 16)
        return null;
      let m = d.slice(0, -16), v = be(p, f, m);
      if (!v)
        return null;
      let $ = "";
      for (let y = 0; y < v.length; y++)
        $ += String.fromCharCode(v[y]);
      let h = (r = (o = JSON.parse($).sources) == null ? void 0 : o[0]) == null ? void 0 : r.url;
      if (!h)
        return null;
      console.log(`[Filemoon] URL encontrada: ${h.substring(0, 80)}...`);
      let E = h, M = "1080p";
      if (h.includes("master"))
        try {
          let O = (yield D.default.get(h, { timeout: 3e3, headers: { "User-Agent": B, Referer: e }, responseType: "text" })).data.split(`
`), k = 0, K = 0, X = h;
          for (let L = 0; L < O.length; L++) {
            let J = O[L].trim();
            if (J.startsWith("#EXT-X-STREAM-INF")) {
              let _ = J.match(/RESOLUTION=(\d+)x(\d+)/), ve = _ ? parseInt(_[1]) : 0, Q = _ ? parseInt(_[2]) : 0;
              for (let T = L + 1; T < L + 3 && T < O.length; T++) {
                let W = O[T].trim();
                if (W && !W.startsWith("#") && Q > k) {
                  k = Q, K = ve, X = W.startsWith("http") ? W : new URL(W, h).toString();
                  break;
                }
              }
            }
          }
          k > 0 && (E = X, M = H(K, k), console.log(`[Filemoon] Mejor calidad: ${M}`));
        } catch (y) {
          console.log(`[Filemoon] No se pudo parsear master: ${y.message}`);
        }
      return { url: E, quality: M, headers: { "User-Agent": B, Referer: e, Origin: "https://filemoon.sx" } };
    } catch (n) {
      return console.log(`[Filemoon] Error: ${n.message}`), null;
    }
  });
}
var G = w(require("axios"));
var U = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function Ue(e, t, o) {
  let r = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", n = (s) => {
    let i = 0;
    for (let a = 0; a < s.length; a++) {
      let l = r.indexOf(s[a]);
      if (l === -1)
        return NaN;
      i = i * t + l;
    }
    return i;
  };
  return e.replace(/\b([0-9a-zA-Z]+)\b/g, (s) => {
    let i = n(s);
    return isNaN(i) || i >= o.length ? s : o[i] && o[i] !== "" ? o[i] : s;
  });
}
function Ne(e, t) {
  let o = e.match(/\{[^{}]*"hls[234]"\s*:\s*"([^"]+)"[^{}]*\}/);
  if (o)
    try {
      let n = o[0].replace(/(\w+)\s*:/g, '"$1":'), s = JSON.parse(n), i = s.hls4 || s.hls3 || s.hls2;
      if (i)
        return i.startsWith("/") ? t + i : i;
    } catch (n) {
      let s = o[0].match(/"hls[234]"\s*:\s*"([^"]+\.m3u8[^"]*)"/);
      if (s) {
        let i = s[1];
        return i.startsWith("/") ? t + i : i;
      }
    }
  let r = e.match(/["']([^"']{30,}\.m3u8[^"']*)['"]/i);
  if (r) {
    let n = r[1];
    return n.startsWith("/") ? t + n : n;
  }
  return null;
}
var Oe = { "hglink.to": "vibuxer.com" };
function N(e) {
  return g(this, null, function* () {
    var t, o, r, n;
    try {
      let s = e;
      for (let [f, d] of Object.entries(Oe))
        if (s.includes(f)) {
          s = s.replace(f, d);
          break;
        }
      let i = ((t = s.match(/^(https?:\/\/[^/]+)/)) == null ? void 0 : t[1]) || "https://hlswish.com";
      console.log(`[HLSWish] Resolviendo: ${e}`), s !== e && console.log(`[HLSWish] \u2192 Mapped to: ${s}`);
      let a = yield G.default.get(s, { headers: { "User-Agent": U, Referer: "https://embed69.org/", Origin: "https://embed69.org", Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", "Accept-Language": "es-MX,es;q=0.9" }, timeout: 15e3, maxRedirects: 5 }), l = typeof a.data == "string" ? a.data : JSON.stringify(a.data), u = l.match(/file\s*:\s*["']([^"']+)["']/i);
      if (u) {
        let f = u[1];
        if (f.startsWith("/") && (f = i + f), f.includes("vibuxer.com/stream/")) {
          console.log(`[HLSWish] Siguiendo redirect: ${f.substring(0, 80)}...`);
          try {
            let d = yield G.default.get(f, { headers: { "User-Agent": U, Referer: i + "/" }, timeout: 8e3, maxRedirects: 5, validateStatus: (v) => v < 400 }), m = ((r = (o = d.request) == null ? void 0 : o.res) == null ? void 0 : r.responseUrl) || ((n = d.config) == null ? void 0 : n.url);
            m && m.includes(".m3u8") && (f = m);
          } catch (d) {
          }
        }
        return console.log(`[HLSWish] URL encontrada: ${f.substring(0, 80)}...`), { url: f, quality: "1080p", headers: { "User-Agent": U, Referer: i + "/" } };
      }
      let c = l.match(/eval\(function\(p,a,c,k,e,[a-z]\)\{[^}]+\}\s*\('([\s\S]+?)',\s*(\d+),\s*(\d+),\s*'([\s\S]+?)'\.split\('\|'\)/);
      if (c) {
        let f = Ue(c[1], parseInt(c[2]), c[4].split("|")), d = Ne(f, i);
        if (d)
          return console.log(`[HLSWish] URL encontrada: ${d.substring(0, 80)}...`), { url: d, quality: "1080p", headers: { "User-Agent": U, Referer: i + "/" } };
      }
      let p = l.match(/https?:\/\/[^"'\s\\]+\.m3u8[^"'\s\\]*/i);
      return p ? (console.log(`[HLSWish] URL encontrada: ${p[0].substring(0, 80)}...`), { url: p[0], quality: "1080p", headers: { "User-Agent": U, Referer: i + "/" } }) : (console.log("[HLSWish] No se encontr\xF3 URL"), null);
    } catch (s) {
      return console.log(`[HLSWish] Error: ${s.message}`), null;
    }
  });
}
var fe = w(require("axios"));
var ue = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function pe(e) {
  return g(this, null, function* () {
    try {
      console.log(`[Vimeos] Resolviendo: ${e}`);
      let r = (yield fe.default.get(e, { headers: { "User-Agent": ue, Referer: "https://vimeos.net/", Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" }, timeout: 15e3, maxRedirects: 5 })).data.match(/eval\(function\(p,a,c,k,e,[dr]\)\{[\s\S]+?\}\('([\s\S]+?)',(\d+),(\d+),'([\s\S]+?)'\.split\('\|'\)/);
      if (r) {
        let n = r[1], s = parseInt(r[2]), i = r[4].split("|"), a = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", l = (p) => {
          let f = 0;
          for (let d = 0; d < p.length; d++)
            f = f * s + a.indexOf(p[d]);
          return f;
        }, c = n.replace(/\b(\w+)\b/g, (p) => {
          let f = l(p);
          return i[f] && i[f] !== "" ? i[f] : p;
        }).match(/["']([^"']+\.m3u8[^"']*)['"]/i);
        if (c) {
          let p = c[1], f = { "User-Agent": ue, Referer: "https://vimeos.net/" }, d = yield A(p, f);
          return console.log(`[Vimeos] URL encontrada: ${p.substring(0, 80)}...`), { url: p, quality: d, headers: f };
        }
      }
      return console.log("[Vimeos] No se encontr\xF3 URL"), null;
    } catch (t) {
      return console.log(`[Vimeos] Error: ${t.message}`), null;
    }
  });
}
var ke = "439c478a771f35c05022f9feabcca01c", ye = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36", C = { "User-Agent": ye, Accept: "application/json" }, z = "https://la.movie", _e = ["JP", "CN", "KR"], Te = 16, Fe = { "goodstream.one": se, "hlswish.com": N, "streamwish.com": N, "streamwish.to": N, "strwish.com": N, "voe.sx": le, "filemoon.sx": j, "filemoon.to": j, "vimeos.net": pe }, qe = [], de = (e) => e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim(), ge = (e, t) => {
  let o = de(e).replace(/\s*\(\d{4}\)\s*$/, "").trim(), r = de(t).replace(/\s*\(\d{4}\)\s*$/, "").trim();
  if (o === r)
    return 1;
  if (o.includes(r) || r.includes(o))
    return 0.8 * (Math.min(o.length, r.length) / Math.max(o.length, r.length));
  let n = new Set(o.split(/\s+/)), s = new Set(r.split(/\s+/));
  return [...n].filter((a) => s.has(a)).length / Math.max(n.size, s.size);
}, Ce = (e) => {
  let t = e.toString().toLowerCase(), o = t.match(/(\d+)/);
  return o ? `${o[1]}p` : t.includes("4k") || t.includes("uhd") ? "2160p" : t.includes("full") || t.includes("fhd") ? "1080p" : t.includes("hd") ? "720p" : "SD";
}, ze = (e) => e.includes("goodstream") ? "GoodStream" : e.includes("hlswish") || e.includes("streamwish") ? "StreamWish" : e.includes("voe.sx") ? "VOE" : e.includes("filemoon") ? "Filemoon" : e.includes("vimeos.net") ? "Vimeos" : "Online", Ie = (e) => {
  try {
    if (qe.some((t) => e.includes(t)))
      return null;
    for (let [t, o] of Object.entries(Fe))
      if (e.includes(t))
        return o;
  } catch (t) {
  }
  return null;
};
function me(e, t) {
  let o = e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  return t ? `${o}-${t}` : o;
}
function He(e, t, o) {
  return e === "movie" ? ["peliculas"] : (t || []).includes(Te) ? (o || []).some((s) => _e.includes(s)) ? ["animes"] : ["animes", "series"] : ["series"];
}
function Ve(e, t) {
  return g(this, null, function* () {
    var r;
    let o = [{ lang: "es-MX", name: "Latino" }, { lang: "en-US", name: "Ingl\xE9s" }];
    for (let { lang: n, name: s } of o)
      try {
        let i = `https://api.themoviedb.org/3/${t}/${e}?api_key=${ke}&language=${n}`, { data: a } = yield x.default.get(i, { timeout: 5e3, headers: C }), l = t === "movie" ? a.title : a.name, u = t === "movie" ? a.original_title : a.original_name;
        if (n === "es-MX" && /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(l))
          continue;
        return console.log(`[LaMovie] TMDB (${s}): "${l}"${l !== u ? ` | Original: "${u}"` : ""}`), { title: l, originalTitle: u, year: (a.release_date || a.first_air_date || "").substring(0, 4), genres: (a.genres || []).map((c) => c.id), originCountries: a.origin_country || ((r = a.production_countries) == null ? void 0 : r.map((c) => c.iso_3166_1)) || [] };
      } catch (i) {
        console.log(`[LaMovie] Error TMDB ${s}: ${i.message}`);
      }
    return null;
  });
}
var Be = { "User-Agent": ye, Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", "Accept-Language": "es-MX,es;q=0.9", "Accept-Encoding": "gzip, deflate, br", Connection: "keep-alive", "Upgrade-Insecure-Requests": "1" };
function De(e) {
  let t = e.match(/rel=['"]shortlink['"]\s+href=['"][^'"]*\?p=(\d+)['"]/);
  return t ? t[1] : null;
}
function he(e, t) {
  return g(this, null, function* () {
    let o = `${z}/${e}/${t}/`;
    try {
      let { data: r } = yield x.default.get(o, { timeout: 8e3, headers: Be, validateStatus: (s) => s === 200 }), n = De(r);
      return n ? (console.log(`[LaMovie] \u2713 Slug directo: /${e}/${t} \u2192 id:${n}`), { id: n }) : null;
    } catch (r) {
      return null;
    }
  });
}
function Pe(e, t) {
  return g(this, null, function* () {
    let { title: o, originalTitle: r, year: n, genres: s, originCountries: i } = e, a = He(t, s, i), l = [];
    o && l.push(me(o, n)), r && r !== o && l.push(me(r, n));
    for (let u of l)
      if (a.length === 1) {
        let c = yield he(a[0], u);
        if (c)
          return c;
      } else {
        let p = (yield Promise.allSettled(a.map((f) => he(f, u)))).find((f) => f.status === "fulfilled" && f.value);
        if (p)
          return p.value;
      }
    return null;
  });
}
function je(e, t) {
  let o = /* @__PURE__ */ new Set(), { title: r, originalTitle: n, year: s } = e;
  if (r) {
    o.add(r.trim());
    let i = r.replace(/[¿¡:;"']/g, "").replace(/\s+/g, " ").trim();
    i !== r && o.add(i);
  }
  return n && n !== r && !/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(n) && o.add(n.trim()), t === "movie" && s && [...o].forEach((a) => {
    a.includes(s) || (o.add(`${a} ${s}`), o.add(`${a} (${s})`));
  }), [...o].forEach((i) => {
    let a = i.replace(/^(el|la|los|las|the|a|an)\s+/i, "").trim();
    a.length > 2 && o.add(a);
  }), [...o].slice(0, 8);
}
function Ge(e, t) {
  return g(this, null, function* () {
    var n;
    let o = encodeURIComponent(e.trim()), r = `${z}/wp-api/v1/search?filter=%7B%7D&postType=any&q=${o}&postsPerPage=10`;
    try {
      let { data: s } = yield x.default.get(r, { timeout: 8e3, headers: C });
      return (n = s == null ? void 0 : s.data) != null && n.posts ? s.data.posts.filter((i) => t === "movie" ? i.type === "movie" || i.type === "movies" : i.type === "tvshow" || i.type === "tvshows" || i.type === "series") : [];
    } catch (s) {
      return [];
    }
  });
}
function Ke(e, t) {
  if (e.length === 0)
    return null;
  if (e.length === 1)
    return e[0];
  let o = e.map((r) => {
    var i;
    let n = ge(r.title || "", t.title) * 2;
    t.originalTitle && (n += ge(r.title || "", t.originalTitle));
    let s = (i = (r.title || "").match(/\((\d{4})\)/)) == null ? void 0 : i[1];
    return t.year && s && s === t.year && (n += 0.5), { result: r, score: n };
  });
  return o.sort((r, n) => n.score - r.score), o[0].result;
}
function Xe(e, t) {
  return g(this, null, function* () {
    console.log("[LaMovie] Fallback: buscando por t\xEDtulo...");
    let r = je(e, t).slice(0, 3).map((s) => g(this, null, function* () {
      let i = yield Ge(s, t);
      return { variant: s, results: i };
    })), n = yield Promise.allSettled(r);
    for (let s of n)
      if (s.status === "fulfilled" && s.value.results.length > 0) {
        let i = Ke(s.value.results, e);
        if (i)
          return console.log(`[LaMovie] \u2713 Fallback encontr\xF3: "${i.title}" id:${i._id}`), { id: i._id };
      }
    return null;
  });
}
function Je(e, t, o) {
  return g(this, null, function* () {
    var n;
    let r = `${z}/wp-api/v1/single/episodes/list?_id=${e}&season=${t}&page=1&postsPerPage=50`;
    try {
      let { data: s } = yield x.default.get(r, { timeout: 12e3, headers: C });
      if (!((n = s == null ? void 0 : s.data) != null && n.posts))
        return null;
      let i = s.data.posts.find((a) => a.season_number == t && a.episode_number == o);
      return (i == null ? void 0 : i._id) || null;
    } catch (s) {
      return console.log(`[LaMovie] Error episodios: ${s.message}`), null;
    }
  });
}
function Qe(e) {
  return g(this, null, function* () {
    try {
      let t = Ie(e.url);
      if (!t)
        return console.log(`[LaMovie] Sin resolver para: ${e.url}`), null;
      let o = yield t(e.url);
      if (!o || !o.url)
        return null;
      let r = Ce(e.quality || "1080p"), n = ze(e.url);
      return { name: "LaMovie", title: `${r} \xB7 ${n}`, url: o.url, quality: r, headers: o.headers || {} };
    } catch (t) {
      return console.log(`[LaMovie] Error procesando embed: ${t.message}`), null;
    }
  });
}
function Ye(e, t, o, r) {
  return g(this, null, function* () {
    var s;
    if (!e || !t)
      return [];
    let n = Date.now();
    console.log(`[LaMovie] Buscando: TMDB ${e} (${t})${o ? ` S${o}E${r}` : ""}`);
    try {
      let i = yield Ve(e, t);
      if (!i)
        return [];
      let a = yield Pe(i, t);
      if (a || (a = yield Xe(i, t)), !a)
        return console.log("[LaMovie] No encontrado ni por slug ni por b\xFAsqueda"), [];
      let l = a.id;
      if (t === "tv" && o && r) {
        let m = yield Je(l, o, r);
        if (!m)
          return console.log(`[LaMovie] Episodio S${o}E${r} no encontrado`), [];
        l = m;
      }
      let { data: u } = yield x.default.get(`${z}/wp-api/v1/player?postId=${l}&demo=0`, { timeout: 6e3, headers: C });
      if (!((s = u == null ? void 0 : u.data) != null && s.embeds))
        return console.log("[LaMovie] No hay embeds disponibles"), [];
      let c = 5e3, p = u.data.embeds.map((m) => Qe(m)), f = yield new Promise((m) => {
        let v = [], $ = 0, I = p.length, h = () => m(v.filter(Boolean)), E = setTimeout(h, c);
        p.forEach((M) => {
          M.then((y) => {
            y && v.push(y), $++, $ === I && (clearTimeout(E), h());
          }).catch(() => {
            $++, $ === I && (clearTimeout(E), h());
          });
        });
      }), d = ((Date.now() - n) / 1e3).toFixed(2);
      return console.log(`[LaMovie] \u2713 ${f.length} streams en ${d}s`), f;
    } catch (i) {
      return console.log(`[LaMovie] Error: ${i.message}`), [];
    }
  });
}
