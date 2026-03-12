var ye = Object.create;
var C = Object.defineProperty;
var we = Object.getOwnPropertyDescriptor;
var xe = Object.getOwnPropertyNames, Q = Object.getOwnPropertySymbols, Se = Object.getPrototypeOf, Y = Object.prototype.hasOwnProperty, Ae = Object.prototype.propertyIsEnumerable;
var Z = (e, t, o) => t in e ? C(e, t, { enumerable: true, configurable: true, writable: true, value: o }) : e[t] = o, q = (e, t) => {
  for (var o in t || (t = {}))
    Y.call(t, o) && Z(e, o, t[o]);
  if (Q)
    for (var o of Q(t))
      Ae.call(t, o) && Z(e, o, t[o]);
  return e;
};
var Re = (e, t) => {
  for (var o in t)
    C(e, o, { get: t[o], enumerable: true });
}, ee = (e, t, o, s) => {
  if (t && typeof t == "object" || typeof t == "function")
    for (let i of xe(t))
      !Y.call(e, i) && i !== o && C(e, i, { get: () => t[i], enumerable: !(s = we(t, i)) || s.enumerable });
  return e;
};
var x = (e, t, o) => (o = e != null ? ye(Se(e)) : {}, ee(t || !e || !e.__esModule ? C(o, "default", { value: e, enumerable: true }) : o, e)), $e = (e) => ee(C({}, "__esModule", { value: true }), e);
var p = (e, t, o) => new Promise((s, i) => {
  var n = (c) => {
    try {
      a(o.next(c));
    } catch (l) {
      i(l);
    }
  }, r = (c) => {
    try {
      a(o.throw(c));
    } catch (l) {
      i(l);
    }
  }, a = (c) => c.done ? s(c.value) : Promise.resolve(c.value).then(n, r);
  a((o = o.apply(e, t)).next());
});
var Ie = {};
Re(Ie, { getStreams: () => De });
module.exports = $e(Ie);
var L = x(require("axios"));
var ne = x(require("axios"));
var te = x(require("axios"));
var ve = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function H(e, t) {
  return e >= 3840 || t >= 2160 ? "4K" : e >= 1920 || t >= 1080 ? "1080p" : e >= 1280 || t >= 720 ? "720p" : e >= 854 || t >= 480 ? "480p" : "360p";
}
function A(o) {
  return p(this, arguments, function* (e, t = {}) {
    try {
      let { data: s } = yield te.default.get(e, { timeout: 3e3, headers: q({ "User-Agent": ve }, t), responseType: "text" });
      if (!s.includes("#EXT-X-STREAM-INF")) {
        let a = e.match(/[_-](\d{3,4})p/);
        return a ? `${a[1]}p` : "1080p";
      }
      let i = 0, n = 0, r = s.split(`
`);
      for (let a of r) {
        let c = a.match(/RESOLUTION=(\d+)x(\d+)/);
        if (c) {
          let l = parseInt(c[1]), u = parseInt(c[2]);
          u > n && (n = u, i = l);
        }
      }
      return n > 0 ? H(i, n) : "1080p";
    } catch (s) {
      return "1080p";
    }
  });
}
var oe = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function re(e) {
  return p(this, null, function* () {
    try {
      console.log(`[GoodStream] Resolviendo: ${e}`);
      let o = (yield ne.default.get(e, { headers: { "User-Agent": oe, Referer: "https://goodstream.one", Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" }, timeout: 15e3, maxRedirects: 5 })).data.match(/file:\s*"([^"]+)"/);
      if (!o)
        return console.log('[GoodStream] No se encontr\xF3 patr\xF3n file:"..."'), null;
      let s = o[1], i = { Referer: e, Origin: "https://goodstream.one", "User-Agent": oe }, n = yield A(s, i);
      return console.log(`[GoodStream] URL encontrada (${n}): ${s.substring(0, 80)}...`), { url: s, quality: n, headers: i };
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
    let s = t.replace(/^\[|\]$/g, "").split("','").map((l) => l.replace(/^'+|'+$/g, "")).map((l) => l.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), i = "";
    for (let l of e) {
      let u = l.charCodeAt(0);
      u > 64 && u < 91 ? u = (u - 52) % 26 + 65 : u > 96 && u < 123 && (u = (u - 84) % 26 + 97), i += String.fromCharCode(u);
    }
    for (let l of s)
      i = i.replace(new RegExp(l, "g"), "_");
    i = i.split("_").join("");
    let n = se(i);
    if (!n)
      return null;
    let r = "";
    for (let l = 0; l < n.length; l++)
      r += String.fromCharCode((n.charCodeAt(l) - 3 + 256) % 256);
    let a = r.split("").reverse().join(""), c = se(a);
    return c ? JSON.parse(c) : null;
  } catch (o) {
    return console.log("[VOE] voeDecode error:", o.message), null;
  }
}
function V(o) {
  return p(this, arguments, function* (e, t = {}) {
    return ie.default.get(e, { timeout: 15e3, maxRedirects: 5, headers: q({ "User-Agent": be, Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" }, t), validateStatus: (s) => s < 500 });
  });
}
function ae(e) {
  return p(this, null, function* () {
    try {
      console.log(`[VOE] Resolviendo: ${e}`);
      let t = yield V(e, { Referer: e }), o = String(t && t.data ? t.data : "");
      if (/permanentToken/i.test(o)) {
        let c = o.match(/window\.location\.href\s*=\s*'([^']+)'/i);
        if (c) {
          console.log(`[VOE] Permanent token redirect -> ${c[1]}`);
          let l = yield V(c[1], { Referer: e });
          l && l.data && (o = String(l.data));
        }
      }
      let s = o.match(/json">\s*\[\s*['"]([^'"]+)['"]\s*\]\s*<\/script>\s*<script[^>]*src=['"]([^'"]+)['"]/i);
      if (s) {
        let c = s[1], l = s[2].startsWith("http") ? s[2] : new URL(s[2], e).href;
        console.log(`[VOE] Found encoded array + loader: ${l}`);
        let u = yield V(l, { Referer: e }), f = u && u.data ? String(u.data) : "", d = f.match(/(\[(?:'[^']{1,10}'[\s,]*){4,12}\])/i) || f.match(/(\[(?:"[^"]{1,10}"[,\s]*){4,12}\])/i);
        if (d) {
          let m = Ee(c, d[1]);
          if (m && (m.source || m.direct_access_url)) {
            let g = m.source || m.direct_access_url, w = yield A(g, { Referer: e });
            return console.log(`[VOE] URL encontrada: ${g.substring(0, 80)}...`), { url: g, quality: w, headers: { Referer: e } };
          }
        }
      }
      let i = /(?:mp4|hls)'\s*:\s*'([^']+)'/gi, n = /(?:mp4|hls)"\s*:\s*"([^"]+)"/gi, r = [], a;
      for (; (a = i.exec(o)) !== null; )
        r.push(a);
      for (; (a = n.exec(o)) !== null; )
        r.push(a);
      for (let c of r) {
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
var z = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function F(e) {
  e = e.replace(/-/g, "+").replace(/_/g, "/");
  let t = (4 - e.length % 4) % 4;
  return R.default.enc.Base64.parse(e + "=".repeat(t));
}
function $(e) {
  let t = e.words, o = e.sigBytes, s = new Uint8Array(o);
  for (let i = 0; i < o; i++)
    s[i] = t[i >>> 2] >>> 24 - i % 4 * 8 & 255;
  return s;
}
function I(e) {
  let t = [];
  for (let o = 0; o < e.length; o += 4)
    t.push((e[o] || 0) << 24 | (e[o + 1] || 0) << 16 | (e[o + 2] || 0) << 8 | (e[o + 3] || 0));
  return R.default.lib.WordArray.create(t, e.length);
}
function le(e) {
  let t = new Uint8Array(e);
  for (let o = 15; o >= 12 && (t[o]++, t[o] === 0); o--)
    ;
  return t;
}
function We(e, t, o) {
  try {
    let s = new Uint8Array(16);
    s.set(t, 0), s[15] = 1;
    let i = le(s), n = I(e), r = new Uint8Array(o.length);
    for (let a = 0; a < o.length; a += 16) {
      let c = Math.min(16, o.length - a), l = I(i), u = R.default.AES.encrypt(l, n, { mode: R.default.mode.ECB, padding: R.default.pad.NoPadding }), f = $(u.ciphertext);
      for (let d = 0; d < c; d++)
        r[a + d] = o[a + d] ^ f[d];
      i = le(i);
    }
    return r;
  } catch (s) {
    return console.log("[Filemoon] AES-GCM error:", s.message), null;
  }
}
function B(e) {
  return p(this, null, function* () {
    var t, o, s;
    console.log(`[Filemoon] Resolviendo: ${e}`);
    try {
      let i = e.match(/\/(?:e|d)\/([a-z0-9]{12})/i);
      if (!i)
        return null;
      let n = i[1], { data: r } = yield D.default.get(`https://filemooon.link/api/videos/${n}/embed/playback`, { timeout: 7e3, headers: { "User-Agent": z, Referer: e } });
      if (r.error)
        return console.log(`[Filemoon] API error: ${r.error}`), null;
      let a = r.playback;
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
      let g = m.slice(0, -16), w = We(f, d, g);
      if (!w)
        return null;
      let S = "";
      for (let y = 0; y < w.length; y++)
        S += String.fromCharCode(w[y]);
      let h = (s = (o = JSON.parse(S).sources) == null ? void 0 : o[0]) == null ? void 0 : s.url;
      if (!h)
        return null;
      console.log(`[Filemoon] URL encontrada: ${h.substring(0, 80)}...`);
      let v = h, b = "1080p";
      if (h.includes("master"))
        try {
          let O = (yield D.default.get(h, { timeout: 3e3, headers: { "User-Agent": z, Referer: e }, responseType: "text" })).data.split(`
`), N = 0, G = 0, X = h;
          for (let E = 0; E < O.length; E++) {
            let P = O[E].trim();
            if (P.startsWith("#EXT-X-STREAM-INF")) {
              let k = P.match(/RESOLUTION=(\d+)x(\d+)/), he = k ? parseInt(k[1]) : 0, J = k ? parseInt(k[2]) : 0;
              for (let T = E + 1; T < E + 3 && T < O.length; T++) {
                let W = O[T].trim();
                if (W && !W.startsWith("#") && J > N) {
                  N = J, G = he, X = W.startsWith("http") ? W : new URL(W, h).toString();
                  break;
                }
              }
            }
          }
          N > 0 && (v = X, b = H(G, N), console.log(`[Filemoon] Mejor calidad: ${b}`));
        } catch (y) {
          console.log(`[Filemoon] No se pudo parsear master: ${y.message}`);
        }
      return { url: v, quality: b, headers: { "User-Agent": z, Referer: e, Origin: "https://filemoon.sx" } };
    } catch (i) {
      return console.log(`[Filemoon] Error: ${i.message}`), null;
    }
  });
}
var K = x(require("axios"));
var U = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function Ce(e, t, o) {
  let s = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", i = (n) => {
    let r = 0;
    for (let a = 0; a < n.length; a++) {
      let c = s.indexOf(n[a]);
      if (c === -1)
        return NaN;
      r = r * t + c;
    }
    return r;
  };
  return e.replace(/\b([0-9a-zA-Z]+)\b/g, (n) => {
    let r = i(n);
    return isNaN(r) || r >= o.length ? n : o[r] && o[r] !== "" ? o[r] : n;
  });
}
function Ue(e, t) {
  let o = e.match(/\{[^{}]*"hls[234]"\s*:\s*"([^"]+)"[^{}]*\}/);
  if (o)
    try {
      let i = o[0].replace(/(\w+)\s*:/g, '"$1":'), n = JSON.parse(i), r = n.hls4 || n.hls3 || n.hls2;
      if (r)
        return r.startsWith("/") ? t + r : r;
    } catch (i) {
      let n = o[0].match(/"hls[234]"\s*:\s*"([^"]+\.m3u8[^"]*)"/);
      if (n) {
        let r = n[1];
        return r.startsWith("/") ? t + r : r;
      }
    }
  let s = e.match(/["']([^"']{30,}\.m3u8[^"']*)['"]/i);
  if (s) {
    let i = s[1];
    return i.startsWith("/") ? t + i : i;
  }
  return null;
}
var Me = { "hglink.to": "vibuxer.com" };
function M(e) {
  return p(this, null, function* () {
    var t, o, s, i;
    try {
      let n = e;
      for (let [d, m] of Object.entries(Me))
        if (n.includes(d)) {
          n = n.replace(d, m);
          break;
        }
      let r = ((t = n.match(/^(https?:\/\/[^/]+)/)) == null ? void 0 : t[1]) || "https://hlswish.com";
      console.log(`[HLSWish] Resolviendo: ${e}`), n !== e && console.log(`[HLSWish] \u2192 Mapped to: ${n}`);
      let a = yield K.default.get(n, { headers: { "User-Agent": U, Referer: "https://embed69.org/", Origin: "https://embed69.org", Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", "Accept-Language": "es-MX,es;q=0.9" }, timeout: 15e3, maxRedirects: 5 }), c = typeof a.data == "string" ? a.data : JSON.stringify(a.data), l = c.match(/file\s*:\s*["']([^"']+)["']/i);
      if (l) {
        let d = l[1];
        if (d.startsWith("/") && (d = r + d), d.includes("vibuxer.com/stream/")) {
          console.log(`[HLSWish] Siguiendo redirect: ${d.substring(0, 80)}...`);
          try {
            let m = yield K.default.get(d, { headers: { "User-Agent": U, Referer: r + "/" }, timeout: 8e3, maxRedirects: 5, validateStatus: (w) => w < 400 }), g = ((s = (o = m.request) == null ? void 0 : o.res) == null ? void 0 : s.responseUrl) || ((i = m.config) == null ? void 0 : i.url);
            g && g.includes(".m3u8") && (d = g);
          } catch (m) {
          }
        }
        return console.log(`[HLSWish] URL encontrada: ${d.substring(0, 80)}...`), { url: d, quality: "1080p", headers: { "User-Agent": U, Referer: r + "/" } };
      }
      let u = c.match(/eval\(function\(p,a,c,k,e,[a-z]\)\{[^}]+\}\s*\('([\s\S]+?)',\s*(\d+),\s*(\d+),\s*'([\s\S]+?)'\.split\('\|'\)/);
      if (u) {
        let d = Ce(u[1], parseInt(u[2]), u[4].split("|")), m = Ue(d, r);
        if (m)
          return console.log(`[HLSWish] URL encontrada: ${m.substring(0, 80)}...`), { url: m, quality: "1080p", headers: { "User-Agent": U, Referer: r + "/" } };
      }
      let f = c.match(/https?:\/\/[^"'\s\\]+\.m3u8[^"'\s\\]*/i);
      return f ? (console.log(`[HLSWish] URL encontrada: ${f[0].substring(0, 80)}...`), { url: f[0], quality: "1080p", headers: { "User-Agent": U, Referer: r + "/" } }) : (console.log("[HLSWish] No se encontr\xF3 URL"), null);
    } catch (n) {
      return console.log(`[HLSWish] Error: ${n.message}`), null;
    }
  });
}
var ue = x(require("axios"));
var ce = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function de(e) {
  return p(this, null, function* () {
    try {
      console.log(`[Vimeos] Resolviendo: ${e}`);
      let s = (yield ue.default.get(e, { headers: { "User-Agent": ce, Referer: "https://vimeos.net/", Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" }, timeout: 15e3, maxRedirects: 5 })).data.match(/eval\(function\(p,a,c,k,e,[dr]\)\{[\s\S]+?\}\('([\s\S]+?)',(\d+),(\d+),'([\s\S]+?)'\.split\('\|'\)/);
      if (s) {
        let i = s[1], n = parseInt(s[2]), r = s[4].split("|"), a = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", c = (f) => {
          let d = 0;
          for (let m = 0; m < f.length; m++)
            d = d * n + a.indexOf(f[m]);
          return d;
        }, u = i.replace(/\b(\w+)\b/g, (f) => {
          let d = c(f);
          return r[d] && r[d] !== "" ? r[d] : f;
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
var Le = "439c478a771f35c05022f9feabcca01c", Oe = "https://www.cinecalidad.vg", Ne = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36", j = { "User-Agent": Ne, Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", "Accept-Language": "es-MX,es;q=0.9", "Accept-Encoding": "gzip, deflate, br", Connection: "keep-alive", "Upgrade-Insecure-Requests": "1", Referer: "https://www.cinecalidad.vg/" }, fe = { "goodstream.one": re, "hlswish.com": M, "streamwish.com": M, "streamwish.to": M, "strwish.com": M, "voe.sx": ae, "filemoon.sx": B, "filemoon.to": B, "vimeos.net": de }, ke = (e) => e.includes("goodstream") ? "GoodStream" : e.includes("hlswish") || e.includes("streamwish") || e.includes("strwish") ? "StreamWish" : e.includes("voe.sx") ? "VOE" : e.includes("filemoon") ? "Filemoon" : e.includes("vimeos") ? "Vimeos" : "Online", Te = (e) => {
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
    let o = [{ lang: "es-MX", name: "Latino" }, { lang: "es-ES", name: "Espa\xF1a" }, { lang: "en-US", name: "Ingl\xE9s" }];
    for (let { lang: s, name: i } of o)
      try {
        let n = `https://api.themoviedb.org/3/${t}/${e}?api_key=${Le}&language=${s}`, { data: r } = yield L.default.get(n, { timeout: 5e3 }), a = t === "movie" ? r.title : r.name, c = t === "movie" ? r.original_title : r.original_name;
        if (!a || s === "es-MX" && /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(a))
          continue;
        return console.log(`[CineCalidad] TMDB (${i}): "${a}"${a !== c ? ` | Original: "${c}"` : ""}`), { title: a, originalTitle: c, year: (r.release_date || r.first_air_date || "").substring(0, 4) };
      } catch (n) {
        console.log(`[CineCalidad] Error TMDB ${i}: ${n.message}`);
      }
    return null;
  });
}
function me(e) {
  return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}
function _e(e) {
  let t = e.match(/<h1[^>]*>[^<]*\((\d{4})\)[^<]*<\/h1>/);
  return t ? t[1] : null;
}
function pe(e, t) {
  return p(this, null, function* () {
    let o = [e, `${e}-2`, `${e}-3`];
    for (let s of o) {
      let i = `${Oe}/pelicula/${s}/`;
      try {
        let { data: n } = yield L.default.get(i, { timeout: 8e3, headers: j, validateStatus: (a) => a === 200 }), r = _e(n);
        if (!r || !t || r === t)
          return console.log(`[CineCalidad] \u2713 Slug directo: /pelicula/${s}/ (${r || "?"})`), i;
        console.log(`[CineCalidad] A\xF1o no coincide: esperado ${t}, encontrado ${r} en /pelicula/${s}/`);
      } catch (n) {
      }
    }
    return null;
  });
}
var He = ["goodstream.one", "voe.sx", "filemoon.sx", "filemoon.to", "hlswish.com", "streamwish.com", "streamwish.to", "strwish.com", "vimeos.net"];
function ge(e) {
  return He.some((t) => e.includes(t));
}
function Ve(e) {
  return p(this, null, function* () {
    try {
      let { data: t } = yield L.default.get(e, { timeout: 8e3, headers: j }), o = [], s = /data-src="([A-Za-z0-9+/=]{20,})"/g, i;
      for (; (i = s.exec(t)) !== null; )
        o.push(i[1]);
      let n = [...new Set(o.map((l) => qe(l)).filter((l) => l && l.startsWith("http")))], r = n.filter(ge), a = n.filter((l) => !ge(l));
      console.log(`[CineCalidad] ${r.length} embeds directos, ${a.length} intermedios`);
      let c = new Set(r);
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
function ze(e) {
  return p(this, null, function* () {
    try {
      let t = Te(e);
      if (!t)
        return console.log(`[CineCalidad] Sin resolver para: ${e.substring(0, 60)}`), null;
      let o = ke(e), s = yield t(e);
      return !s || !s.url ? null : { name: "CineCalidad", title: `1080p \xB7 ${o}`, url: s.url, quality: "1080p", headers: s.headers || {} };
    } catch (t) {
      return null;
    }
  });
}
function De(e, t, o, s) {
  return p(this, null, function* () {
    if (!e || !t)
      return [];
    let i = Date.now();
    if (console.log(`[CineCalidad] Buscando: TMDB ${e} (${t})${o ? ` S${o}E${s}` : ""}`), t === "tv")
      return console.log("[CineCalidad] Series no soportadas a\xFAn"), [];
    try {
      let n = yield Fe(e, t);
      if (!n)
        return [];
      let r = me(n.title), c = yield pe(r, n.year);
      if (!c && n.originalTitle && n.originalTitle !== n.title) {
        let g = me(n.originalTitle);
        c = yield pe(g, n.year);
      }
      if (!c)
        return console.log("[CineCalidad] No encontrado por slug"), [];
      let l = yield Ve(c);
      if (l.length === 0)
        return console.log("[CineCalidad] No se encontraron embeds"), [];
      console.log(`[CineCalidad] Resolviendo ${l.length} embeds...`);
      let u = 5e3, f = [...new Set(l)], d = yield new Promise((g) => {
        let w = [], S = 0, _ = f.length, h = () => g(w.filter(Boolean)), v = setTimeout(h, u);
        f.forEach((b) => {
          ze(b).then((y) => {
            y && w.push(y), S++, S === _ && (clearTimeout(v), h());
          }).catch(() => {
            S++, S === _ && (clearTimeout(v), h());
          });
        });
      }), m = ((Date.now() - i) / 1e3).toFixed(2);
      return console.log(`[CineCalidad] \u2713 ${d.length} streams en ${m}s`), d;
    } catch (n) {
      return console.log(`[CineCalidad] Error: ${n.message}`), [];
    }
  });
}
