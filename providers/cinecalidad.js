var we = Object.create;
var C = Object.defineProperty;
var ye = Object.getOwnPropertyDescriptor;
var xe = Object.getOwnPropertyNames, Q = Object.getOwnPropertySymbols, Se = Object.getPrototypeOf, Y = Object.prototype.hasOwnProperty, Ae = Object.prototype.propertyIsEnumerable;
var Z = (e, t, n) => t in e ? C(e, t, { enumerable: true, configurable: true, writable: true, value: n }) : e[t] = n, q = (e, t) => {
  for (var n in t || (t = {}))
    Y.call(t, n) && Z(e, n, t[n]);
  if (Q)
    for (var n of Q(t))
      Ae.call(t, n) && Z(e, n, t[n]);
  return e;
};
var Re = (e, t) => {
  for (var n in t)
    C(e, n, { get: t[n], enumerable: true });
}, ee = (e, t, n, r) => {
  if (t && typeof t == "object" || typeof t == "function")
    for (let s of xe(t))
      !Y.call(e, s) && s !== n && C(e, s, { get: () => t[s], enumerable: !(r = ye(t, s)) || r.enumerable });
  return e;
};
var x = (e, t, n) => (n = e != null ? we(Se(e)) : {}, ee(t || !e || !e.__esModule ? C(n, "default", { value: e, enumerable: true }) : n, e)), $e = (e) => ee(C({}, "__esModule", { value: true }), e);
var p = (e, t, n) => new Promise((r, s) => {
  var i = (c) => {
    try {
      a(n.next(c));
    } catch (l) {
      s(l);
    }
  }, o = (c) => {
    try {
      a(n.throw(c));
    } catch (l) {
      s(l);
    }
  }, a = (c) => c.done ? r(c.value) : Promise.resolve(c.value).then(i, o);
  a((n = n.apply(e, t)).next());
});
var Ie = {};
Re(Ie, { getStreams: () => De });
module.exports = $e(Ie);
var L = x(require("axios"));
var oe = x(require("axios"));
var te = x(require("axios"));
var ve = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function _(e, t) {
  return e >= 3840 || t >= 2160 ? "4K" : e >= 1920 || t >= 1080 ? "1080p" : e >= 1280 || t >= 720 ? "720p" : e >= 854 || t >= 480 ? "480p" : "360p";
}
function A(n) {
  return p(this, arguments, function* (e, t = {}) {
    try {
      let { data: r } = yield te.default.get(e, { timeout: 3e3, headers: q({ "User-Agent": ve }, t), responseType: "text" });
      if (!r.includes("#EXT-X-STREAM-INF")) {
        let a = e.match(/[_-](\d{3,4})p/);
        return a ? `${a[1]}p` : "1080p";
      }
      let s = 0, i = 0, o = r.split(`
`);
      for (let a of o) {
        let c = a.match(/RESOLUTION=(\d+)x(\d+)/);
        if (c) {
          let l = parseInt(c[1]), u = parseInt(c[2]);
          u > i && (i = u, s = l);
        }
      }
      return i > 0 ? _(s, i) : "1080p";
    } catch (r) {
      return "1080p";
    }
  });
}
var ne = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function re(e) {
  return p(this, null, function* () {
    try {
      console.log(`[GoodStream] Resolviendo: ${e}`);
      let n = (yield oe.default.get(e, { headers: { "User-Agent": ne, Referer: "https://goodstream.one", Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" }, timeout: 15e3, maxRedirects: 5 })).data.match(/file:\s*"([^"]+)"/);
      if (!n)
        return console.log('[GoodStream] No se encontr\xF3 patr\xF3n file:"..."'), null;
      let r = n[1], s = { Referer: e, Origin: "https://goodstream.one", "User-Agent": ne }, i = yield A(r, s);
      return console.log(`[GoodStream] URL encontrada (${i}): ${r.substring(0, 80)}...`), { url: r, quality: i, headers: s };
    } catch (t) {
      return console.log(`[GoodStream] Error: ${t.message}`), null;
    }
  });
}
var ie = x(require("axios"));
var be = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function se(e) {
  try {
    return typeof atob != "undefined" ? atob(e) : Buffer.from(e, "base64").toString("utf8");
  } catch (t) {
    return null;
  }
}
function Ee(e, t) {
  try {
    let r = t.replace(/^\[|\]$/g, "").split("','").map((l) => l.replace(/^'+|'+$/g, "")).map((l) => l.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), s = "";
    for (let l of e) {
      let u = l.charCodeAt(0);
      u > 64 && u < 91 ? u = (u - 52) % 26 + 65 : u > 96 && u < 123 && (u = (u - 84) % 26 + 97), s += String.fromCharCode(u);
    }
    for (let l of r)
      s = s.replace(new RegExp(l, "g"), "_");
    s = s.split("_").join("");
    let i = se(s);
    if (!i)
      return null;
    let o = "";
    for (let l = 0; l < i.length; l++)
      o += String.fromCharCode((i.charCodeAt(l) - 3 + 256) % 256);
    let a = o.split("").reverse().join(""), c = se(a);
    return c ? JSON.parse(c) : null;
  } catch (n) {
    return console.log("[VOE] voeDecode error:", n.message), null;
  }
}
function H(n) {
  return p(this, arguments, function* (e, t = {}) {
    return ie.default.get(e, { timeout: 15e3, maxRedirects: 5, headers: q({ "User-Agent": be, Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" }, t), validateStatus: (r) => r < 500 });
  });
}
function ae(e) {
  return p(this, null, function* () {
    try {
      console.log(`[VOE] Resolviendo: ${e}`);
      let t = yield H(e, { Referer: e }), n = String(t && t.data ? t.data : "");
      if (/permanentToken/i.test(n)) {
        let c = n.match(/window\.location\.href\s*=\s*'([^']+)'/i);
        if (c) {
          console.log(`[VOE] Permanent token redirect -> ${c[1]}`);
          let l = yield H(c[1], { Referer: e });
          l && l.data && (n = String(l.data));
        }
      }
      let r = n.match(/json">\s*\[\s*['"]([^'"]+)['"]\s*\]\s*<\/script>\s*<script[^>]*src=['"]([^'"]+)['"]/i);
      if (r) {
        let c = r[1], l = r[2].startsWith("http") ? r[2] : new URL(r[2], e).href;
        console.log(`[VOE] Found encoded array + loader: ${l}`);
        let u = yield H(l, { Referer: e }), f = u && u.data ? String(u.data) : "", d = f.match(/(\[(?:'[^']{1,10}'[\s,]*){4,12}\])/i) || f.match(/(\[(?:"[^"]{1,10}"[,\s]*){4,12}\])/i);
        if (d) {
          let m = Ee(c, d[1]);
          if (m && (m.source || m.direct_access_url)) {
            let h = m.source || m.direct_access_url, g = yield A(h, { Referer: e });
            return console.log(`[VOE] URL encontrada: ${h.substring(0, 80)}...`), { url: h, quality: g, headers: { Referer: e } };
          }
        }
      }
      let s = /(?:mp4|hls)'\s*:\s*'([^']+)'/gi, i = /(?:mp4|hls)"\s*:\s*"([^"]+)"/gi, o = [], a;
      for (; (a = s.exec(n)) !== null; )
        o.push(a);
      for (; (a = i.exec(n)) !== null; )
        o.push(a);
      for (let c of o) {
        let l = c[1];
        if (!l)
          continue;
        let u = l;
        if (u.startsWith("aHR0"))
          try {
            u = atob(u);
          } catch (f) {
          }
        return console.log(`[VOE] URL encontrada (fallback): ${u.substring(0, 80)}...`), { url: u, quality: yield A(u, { Referer: e }), headers: { Referer: e } };
      }
      return console.log("[VOE] No se encontr\xF3 URL"), null;
    } catch (t) {
      return console.log(`[VOE] Error: ${t.message}`), null;
    }
  });
}
var D = x(require("axios")), R = x(require("crypto-js"));
var V = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function F(e) {
  e = e.replace(/-/g, "+").replace(/_/g, "/");
  let t = (4 - e.length % 4) % 4;
  return R.default.enc.Base64.parse(e + "=".repeat(t));
}
function $(e) {
  let t = e.words, n = e.sigBytes, r = new Uint8Array(n);
  for (let s = 0; s < n; s++)
    r[s] = t[s >>> 2] >>> 24 - s % 4 * 8 & 255;
  return r;
}
function I(e) {
  let t = [];
  for (let n = 0; n < e.length; n += 4)
    t.push((e[n] || 0) << 24 | (e[n + 1] || 0) << 16 | (e[n + 2] || 0) << 8 | (e[n + 3] || 0));
  return R.default.lib.WordArray.create(t, e.length);
}
function le(e) {
  let t = new Uint8Array(e);
  for (let n = 15; n >= 12 && (t[n]++, t[n] === 0); n--)
    ;
  return t;
}
function We(e, t, n) {
  try {
    let r = new Uint8Array(16);
    r.set(t, 0), r[15] = 1;
    let s = le(r), i = I(e), o = new Uint8Array(n.length);
    for (let a = 0; a < n.length; a += 16) {
      let c = Math.min(16, n.length - a), l = I(s), u = R.default.AES.encrypt(l, i, { mode: R.default.mode.ECB, padding: R.default.pad.NoPadding }), f = $(u.ciphertext);
      for (let d = 0; d < c; d++)
        o[a + d] = n[a + d] ^ f[d];
      s = le(s);
    }
    return o;
  } catch (r) {
    return console.log("[Filemoon] AES-GCM error:", r.message), null;
  }
}
function B(e) {
  return p(this, null, function* () {
    var t, n, r;
    console.log(`[Filemoon] Resolviendo: ${e}`);
    try {
      let s = e.match(/\/(?:e|d)\/([a-z0-9]{12})/i);
      if (!s)
        return null;
      let i = s[1], { data: o } = yield D.default.get(`https://filemooon.link/api/videos/${i}/embed/playback`, { timeout: 7e3, headers: { "User-Agent": V, Referer: e } });
      if (o.error)
        return console.log(`[Filemoon] API error: ${o.error}`), null;
      let a = o.playback;
      if ((a == null ? void 0 : a.algorithm) !== "AES-256-GCM" || ((t = a.key_parts) == null ? void 0 : t.length) !== 2)
        return console.log("[Filemoon] Formato de cifrado no soportado"), null;
      let c = $(F(a.key_parts[0])), l = $(F(a.key_parts[1])), u = new Uint8Array(c.length + l.length);
      u.set(c, 0), u.set(l, c.length);
      let f;
      if (u.length === 32)
        f = u;
      else {
        let y = I(u);
        f = $(R.default.SHA256(y));
      }
      let d = $(F(a.iv)), m = $(F(a.payload));
      if (m.length < 16)
        return null;
      let h = m.slice(0, -16), g = We(f, d, h);
      if (!g)
        return null;
      let S = "";
      for (let y = 0; y < g.length; y++)
        S += String.fromCharCode(g[y]);
      let w = (r = (n = JSON.parse(S).sources) == null ? void 0 : n[0]) == null ? void 0 : r.url;
      if (!w)
        return null;
      console.log(`[Filemoon] URL encontrada: ${w.substring(0, 80)}...`);
      let v = w, b = "1080p";
      if (w.includes("master"))
        try {
          let N = (yield D.default.get(w, { timeout: 3e3, headers: { "User-Agent": V, Referer: e }, responseType: "text" })).data.split(`
`), O = 0, G = 0, X = w;
          for (let E = 0; E < N.length; E++) {
            let P = N[E].trim();
            if (P.startsWith("#EXT-X-STREAM-INF")) {
              let T = P.match(/RESOLUTION=(\d+)x(\d+)/), ge = T ? parseInt(T[1]) : 0, J = T ? parseInt(T[2]) : 0;
              for (let k = E + 1; k < E + 3 && k < N.length; k++) {
                let W = N[k].trim();
                if (W && !W.startsWith("#") && J > O) {
                  O = J, G = ge, X = W.startsWith("http") ? W : new URL(W, w).toString();
                  break;
                }
              }
            }
          }
          O > 0 && (v = X, b = _(G, O), console.log(`[Filemoon] Mejor calidad: ${b}`));
        } catch (y) {
          console.log(`[Filemoon] No se pudo parsear master: ${y.message}`);
        }
      return { url: v, quality: b, headers: { "User-Agent": V, Referer: e, Origin: "https://filemoon.sx" } };
    } catch (s) {
      return console.log(`[Filemoon] Error: ${s.message}`), null;
    }
  });
}
var K = x(require("axios"));
var U = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function Ce(e, t, n) {
  let r = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", s = (i) => {
    let o = 0;
    for (let a = 0; a < i.length; a++) {
      let c = r.indexOf(i[a]);
      if (c === -1)
        return NaN;
      o = o * t + c;
    }
    return o;
  };
  return e.replace(/\b([0-9a-zA-Z]+)\b/g, (i) => {
    let o = s(i);
    return isNaN(o) || o >= n.length ? i : n[o] && n[o] !== "" ? n[o] : i;
  });
}
function Ue(e, t) {
  let n = e.match(/\{[^{}]*"hls[234]"\s*:\s*"([^"]+)"[^{}]*\}/);
  if (n)
    try {
      let s = n[0].replace(/(\w+)\s*:/g, '"$1":'), i = JSON.parse(s), o = i.hls4 || i.hls3 || i.hls2;
      if (o)
        return o.startsWith("/") ? t + o : o;
    } catch (s) {
      let i = n[0].match(/"hls[234]"\s*:\s*"([^"]+\.m3u8[^"]*)"/);
      if (i) {
        let o = i[1];
        return o.startsWith("/") ? t + o : o;
      }
    }
  let r = e.match(/["']([^"']{30,}\.m3u8[^"']*)['"]/i);
  if (r) {
    let s = r[1];
    return s.startsWith("/") ? t + s : s;
  }
  return null;
}
var Me = { "hglink.to": "vibuxer.com" };
function M(e) {
  return p(this, null, function* () {
    var t, n, r, s;
    try {
      let i = e;
      for (let [d, m] of Object.entries(Me))
        if (i.includes(d)) {
          i = i.replace(d, m);
          break;
        }
      let o = ((t = i.match(/^(https?:\/\/[^/]+)/)) == null ? void 0 : t[1]) || "https://hlswish.com";
      console.log(`[HLSWish] Resolviendo: ${e}`), i !== e && console.log(`[HLSWish] \u2192 Mapped to: ${i}`);
      let a = yield K.default.get(i, { headers: { "User-Agent": U, Referer: "https://embed69.org/", Origin: "https://embed69.org", Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", "Accept-Language": "es-MX,es;q=0.9" }, timeout: 15e3, maxRedirects: 5 }), c = typeof a.data == "string" ? a.data : JSON.stringify(a.data), l = c.match(/file\s*:\s*["']([^"']+)["']/i);
      if (l) {
        let d = l[1];
        if (d.startsWith("/") && (d = o + d), d.includes("vibuxer.com/stream/")) {
          console.log(`[HLSWish] Siguiendo redirect: ${d.substring(0, 80)}...`);
          try {
            let m = yield K.default.get(d, { headers: { "User-Agent": U, Referer: o + "/" }, timeout: 8e3, maxRedirects: 5, validateStatus: (g) => g < 400 }), h = ((r = (n = m.request) == null ? void 0 : n.res) == null ? void 0 : r.responseUrl) || ((s = m.config) == null ? void 0 : s.url);
            h && h.includes(".m3u8") && (d = h);
          } catch (m) {
          }
        }
        return console.log(`[HLSWish] URL encontrada: ${d.substring(0, 80)}...`), { url: d, quality: "1080p", headers: { "User-Agent": U, Referer: o + "/" } };
      }
      let u = c.match(/eval\(function\(p,a,c,k,e,[a-z]\)\{[^}]+\}\s*\('([\s\S]+?)',\s*(\d+),\s*(\d+),\s*'([\s\S]+?)'\.split\('\|'\)/);
      if (u) {
        let d = Ce(u[1], parseInt(u[2]), u[4].split("|")), m = Ue(d, o);
        if (m)
          return console.log(`[HLSWish] URL encontrada: ${m.substring(0, 80)}...`), { url: m, quality: "1080p", headers: { "User-Agent": U, Referer: o + "/" } };
      }
      let f = c.match(/https?:\/\/[^"'\s\\]+\.m3u8[^"'\s\\]*/i);
      return f ? (console.log(`[HLSWish] URL encontrada: ${f[0].substring(0, 80)}...`), { url: f[0], quality: "1080p", headers: { "User-Agent": U, Referer: o + "/" } }) : (console.log("[HLSWish] No se encontr\xF3 URL"), null);
    } catch (i) {
      return console.log(`[HLSWish] Error: ${i.message}`), null;
    }
  });
}
var ue = x(require("axios"));
var ce = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function de(e) {
  return p(this, null, function* () {
    try {
      console.log(`[Vimeos] Resolviendo: ${e}`);
      let r = (yield ue.default.get(e, { headers: { "User-Agent": ce, Referer: "https://vimeos.net/", Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" }, timeout: 15e3, maxRedirects: 5 })).data.match(/eval\(function\(p,a,c,k,e,[dr]\)\{[\s\S]+?\}\('([\s\S]+?)',(\d+),(\d+),'([\s\S]+?)'\.split\('\|'\)/);
      if (r) {
        let s = r[1], i = parseInt(r[2]), o = r[4].split("|"), a = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", c = (f) => {
          let d = 0;
          for (let m = 0; m < f.length; m++)
            d = d * i + a.indexOf(f[m]);
          return d;
        }, u = s.replace(/\b(\w+)\b/g, (f) => {
          let d = c(f);
          return o[d] && o[d] !== "" ? o[d] : f;
        }).match(/["']([^"']+\.m3u8[^"']*)['"]/i);
        if (u) {
          let f = u[1], d = { "User-Agent": ce, Referer: "https://vimeos.net/" }, m = yield A(f, d);
          return console.log(`[Vimeos] URL encontrada: ${f.substring(0, 80)}...`), { url: f, quality: m, headers: d };
        }
      }
      return console.log("[Vimeos] No se encontr\xF3 URL"), null;
    } catch (t) {
      return console.log(`[Vimeos] Error: ${t.message}`), null;
    }
  });
}
var Le = "439c478a771f35c05022f9feabcca01c", Ne = "https://www.cinecalidad.vg", Oe = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36", j = { "User-Agent": Oe, Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", "Accept-Language": "es-MX,es;q=0.9", "Accept-Encoding": "gzip, deflate, br", Connection: "keep-alive", "Upgrade-Insecure-Requests": "1", Referer: "https://www.cinecalidad.vg/" }, fe = { "goodstream.one": re, "hlswish.com": M, "streamwish.com": M, "streamwish.to": M, "strwish.com": M, "voe.sx": ae, "filemoon.sx": B, "filemoon.to": B, "vimeos.net": de };
var Te = (e) => e.includes("goodstream") ? "GoodStream" : e.includes("hlswish") || e.includes("streamwish") || e.includes("strwish") ? "StreamWish" : e.includes("voe.sx") ? "VOE" : e.includes("filemoon") ? "Filemoon" : e.includes("vimeos") ? "Vimeos" : "Online", ke = (e) => {
  if (!e || !e.startsWith("http"))
    return null;
  for (let t in fe)
    if (e.includes(t))
      return fe[t];
  return null;
};
function qe(e) {
  try {
    return typeof atob != "undefined" ? atob(e) : Buffer.from(e, "base64").toString("utf8");
  } catch (t) {
    return null;
  }
}
function Fe(e, t) {
  return p(this, null, function* () {
    let n = [{ lang: "es-MX", name: "Latino" }, { lang: "es-ES", name: "Espa\xF1a" }, { lang: "en-US", name: "Ingl\xE9s" }];
    for (let { lang: r, name: s } of n)
      try {
        let i = `https://api.themoviedb.org/3/${t}/${e}?api_key=${Le}&language=${r}`, { data: o } = yield L.default.get(i, { timeout: 5e3 }), a = t === "movie" ? o.title : o.name, c = t === "movie" ? o.original_title : o.original_name;
        if (!a || r === "es-MX" && /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(a))
          continue;
        return console.log(`[CineCalidad] TMDB (${s}): "${a}"${a !== c ? ` | Original: "${c}"` : ""}`), { title: a, originalTitle: c, year: (o.release_date || o.first_air_date || "").substring(0, 4) };
      } catch (i) {
        console.log(`[CineCalidad] Error TMDB ${s}: ${i.message}`);
      }
    return null;
  });
}
function me(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}
function ze(e) {
  let t = e.match(/<h1[^>]*>[^<]*\((\d{4})\)[^<]*<\/h1>/);
  return t ? t[1] : null;
}
function pe(e, t) {
  return p(this, null, function* () {
    let n = [e, `${e}-2`, `${e}-3`];
    for (let r of n) {
      let s = `${Ne}/pelicula/${r}/`;
      try {
        let { data: i } = yield L.default.get(s, { timeout: 8e3, headers: j, validateStatus: (a) => a === 200 }), o = ze(i);
        if (!o || !t || o === t)
          return console.log(`[CineCalidad] \u2713 Slug directo: /pelicula/${r}/ (${o || "?"})`), s;
        console.log(`[CineCalidad] A\xF1o no coincide: esperado ${t}, encontrado ${o} en /pelicula/${r}/`);
      } catch (i) {
      }
    }
    return null;
  });
}
var _e = ["goodstream.one", "voe.sx", "filemoon.sx", "filemoon.to", "hlswish.com", "streamwish.com", "streamwish.to", "strwish.com", "vimeos.net"];
function he(e) {
  return _e.some((t) => e.includes(t));
}
function He(e) {
  return p(this, null, function* () {
    try {
      let { data: t } = yield L.default.get(e, { timeout: 8e3, headers: j }), n = [], r = /data-src="([A-Za-z0-9+/=]{20,})"/g, s;
      for (; (s = r.exec(t)) !== null; )
        n.push(s[1]);
      let i = [...new Set(n.map((l) => qe(l)).filter((l) => l && l.startsWith("http")))], o = i.filter(he), a = i.filter((l) => !he(l));
      console.log(`[CineCalidad] ${o.length} embeds directos, ${a.length} intermedios`);
      let c = new Set(o);
      return a.length > 0 && (yield Promise.allSettled(a.map((l) => p(this, null, function* () {
        try {
          let { data: u } = yield L.default.get(l, { timeout: 6e3, headers: j, maxRedirects: 5 }), f = "", d = u.match(/id="btn_enlace"[^>]*>[\s\S]*?href="([^"]+)"/);
          if (d && (f = d[1]), !f) {
            let m = u.match(/<iframe[^>]+src="([^"]+)"/);
            m && (f = m[1]);
          }
          !f && l.includes("/e/") && (f = l), f && f.startsWith("http") && c.add(f);
        } catch (u) {
        }
      })))), [...c];
    } catch (t) {
      return console.log(`[CineCalidad] Error obteniendo embeds: ${t.message}`), [];
    }
  });
}
function Ve(e) {
  return p(this, null, function* () {
    try {
      let t = ke(e);
      if (!t)
        return console.log(`[CineCalidad] Sin resolver para: ${e.substring(0, 60)}`), null;
      let n = Te(e), r = yield t(e);
      return !r || !r.url ? null : { name: "CineCalidad", title: `1080p \xB7 ${n}`, url: r.url, quality: "1080p", headers: r.headers || {} };
    } catch (t) {
      return null;
    }
  });
}
function De(e, t, n, r) {
  return p(this, null, function* () {
    if (!e || !t)
      return [];
    let s = Date.now();
    if (console.log(`[CineCalidad] Buscando: TMDB ${e} (${t})${n ? ` S${n}E${r}` : ""}`), t === "tv")
      return console.log("[CineCalidad] Series no soportadas a\xFAn"), [];
    try {
      let o = yield Fe(e, t);
      if (!o)
        return [];
      let a = me(o.title), c = yield pe(a, o.year);
      if (c)
        var i = c;
      else {
        let h = null;
        if (o.originalTitle && o.originalTitle !== o.title) {
          let g = me(o.originalTitle);
          h = yield pe(g, o.year);
        }
        if (!h)
          return console.log("[CineCalidad] No encontrado por slug"), [];
        var i = h;
      }
      let l = yield He(i);
      if (l.length === 0)
        return console.log("[CineCalidad] No se encontraron embeds"), [];
      console.log(`[CineCalidad] Resolviendo ${l.length} embeds...`);
      let u = 5e3, f = [...new Set(l)], d = yield new Promise((h) => {
        let g = [], S = 0, z = f.length, w = () => h(g.filter(Boolean)), v = setTimeout(w, u);
        f.forEach((b) => {
          Ve(b).then((y) => {
            y && g.push(y), S++, S === z && (clearTimeout(v), w());
          }).catch(() => {
            S++, S === z && (clearTimeout(v), w());
          });
        });
      }), m = ((Date.now() - s) / 1e3).toFixed(2);
      return console.log(`[CineCalidad] \u2713 ${d.length} streams en ${m}s`), d;
    } catch (o) {
      return console.log(`[CineCalidad] Error: ${o.message}`), [];
    }
  });
}
