var ye = Object.create;
var E = Object.defineProperty;
var we = Object.getOwnPropertyDescriptor;
var xe = Object.getOwnPropertyNames, Q = Object.getOwnPropertySymbols, Se = Object.getPrototypeOf, Y = Object.prototype.hasOwnProperty, Ae = Object.prototype.propertyIsEnumerable;
var Z = (e, t, n) => t in e ? E(e, t, { enumerable: true, configurable: true, writable: true, value: n }) : e[t] = n, q = (e, t) => {
  for (var n in t || (t = {}))
    Y.call(t, n) && Z(e, n, t[n]);
  if (Q)
    for (var n of Q(t))
      Ae.call(t, n) && Z(e, n, t[n]);
  return e;
};
var Re = (e, t) => {
  for (var n in t)
    E(e, n, { get: t[n], enumerable: true });
}, ee = (e, t, n, r) => {
  if (t && typeof t == "object" || typeof t == "function")
    for (let o of xe(t))
      !Y.call(e, o) && o !== n && E(e, o, { get: () => t[o], enumerable: !(r = we(t, o)) || r.enumerable });
  return e;
};
var x = (e, t, n) => (n = e != null ? ye(Se(e)) : {}, ee(t || !e || !e.__esModule ? E(n, "default", { value: e, enumerable: true }) : n, e)), ve = (e) => ee(E({}, "__esModule", { value: true }), e);
var p = (e, t, n) => new Promise((r, o) => {
  var i = (c) => {
    try {
      l(n.next(c));
    } catch (u) {
      o(u);
    }
  }, s = (c) => {
    try {
      l(n.throw(c));
    } catch (u) {
      o(u);
    }
  }, l = (c) => c.done ? r(c.value) : Promise.resolve(c.value).then(i, s);
  l((n = n.apply(e, t)).next());
});
var De = {};
Re(De, { getStreams: () => Be });
module.exports = ve(De);
var U = x(require("axios"));
var re = x(require("axios"));
var te = x(require("axios"));
var $e = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function z(e, t) {
  return e >= 3840 || t >= 2160 ? "4K" : e >= 1920 || t >= 1080 ? "1080p" : e >= 1280 || t >= 720 ? "720p" : e >= 854 || t >= 480 ? "480p" : "360p";
}
function S(n) {
  return p(this, arguments, function* (e, t = {}) {
    try {
      let { data: r } = yield te.default.get(e, { timeout: 3e3, headers: q({ "User-Agent": $e }, t), responseType: "text" });
      if (!r.includes("#EXT-X-STREAM-INF")) {
        let l = e.match(/[_-](\d{3,4})p/);
        return l ? `${l[1]}p` : "1080p";
      }
      let o = 0, i = 0, s = r.split(`
`);
      for (let l of s) {
        let c = l.match(/RESOLUTION=(\d+)x(\d+)/);
        if (c) {
          let u = parseInt(c[1]), a = parseInt(c[2]);
          a > i && (i = a, o = u);
        }
      }
      return i > 0 ? z(o, i) : "1080p";
    } catch (r) {
      return "1080p";
    }
  });
}
var ne = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function oe(e) {
  return p(this, null, function* () {
    try {
      console.log(`[GoodStream] Resolviendo: ${e}`);
      let n = (yield re.default.get(e, { headers: { "User-Agent": ne, Referer: "https://goodstream.one", Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" }, timeout: 15e3, maxRedirects: 5 })).data.match(/file:\s*"([^"]+)"/);
      if (!n)
        return console.log('[GoodStream] No se encontr\xF3 patr\xF3n file:"..."'), null;
      let r = n[1], o = { Referer: e, Origin: "https://goodstream.one", "User-Agent": ne }, i = yield S(r, o);
      return console.log(`[GoodStream] URL encontrada (${i}): ${r.substring(0, 80)}...`), { url: r, quality: i, headers: o };
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
function We(e, t) {
  try {
    let r = t.replace(/^\[|\]$/g, "").split("','").map((u) => u.replace(/^'+|'+$/g, "")).map((u) => u.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), o = "";
    for (let u of e) {
      let a = u.charCodeAt(0);
      a > 64 && a < 91 ? a = (a - 52) % 26 + 65 : a > 96 && a < 123 && (a = (a - 84) % 26 + 97), o += String.fromCharCode(a);
    }
    for (let u of r)
      o = o.replace(new RegExp(u, "g"), "_");
    o = o.split("_").join("");
    let i = se(o);
    if (!i)
      return null;
    let s = "";
    for (let u = 0; u < i.length; u++)
      s += String.fromCharCode((i.charCodeAt(u) - 3 + 256) % 256);
    let l = s.split("").reverse().join(""), c = se(l);
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
          let u = yield H(c[1], { Referer: e });
          u && u.data && (n = String(u.data));
        }
      }
      let r = n.match(/json">\s*\[\s*['"]([^'"]+)['"]\s*\]\s*<\/script>\s*<script[^>]*src=['"]([^'"]+)['"]/i);
      if (r) {
        let c = r[1], u = r[2].startsWith("http") ? r[2] : new URL(r[2], e).href;
        console.log(`[VOE] Found encoded array + loader: ${u}`);
        let a = yield H(u, { Referer: e }), d = a && a.data ? String(a.data) : "", f = d.match(/(\[(?:'[^']{1,10}'[\s,]*){4,12}\])/i) || d.match(/(\[(?:"[^"]{1,10}"[,\s]*){4,12}\])/i);
        if (f) {
          let h = We(c, f[1]);
          if (h && (h.source || h.direct_access_url)) {
            let g = h.source || h.direct_access_url, m = yield S(g, { Referer: e });
            return console.log(`[VOE] URL encontrada: ${g.substring(0, 80)}...`), { url: g, quality: m, headers: { Referer: e } };
          }
        }
      }
      let o = /(?:mp4|hls)'\s*:\s*'([^']+)'/gi, i = /(?:mp4|hls)"\s*:\s*"([^"]+)"/gi, s = [], l;
      for (; (l = o.exec(n)) !== null; )
        s.push(l);
      for (; (l = i.exec(n)) !== null; )
        s.push(l);
      for (let c of s) {
        let u = c[1];
        if (!u)
          continue;
        let a = u;
        if (a.startsWith("aHR0"))
          try {
            a = atob(a);
          } catch (d) {
          }
        return console.log(`[VOE] URL encontrada (fallback): ${a.substring(0, 80)}...`), { url: a, quality: yield S(a, { Referer: e }), headers: { Referer: e } };
      }
      return console.log("[VOE] No se encontr\xF3 URL"), null;
    } catch (t) {
      return console.log(`[VOE] Error: ${t.message}`), null;
    }
  });
}
var D = x(require("axios")), A = x(require("crypto-js"));
var B = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function V(e) {
  e = e.replace(/-/g, "+").replace(/_/g, "/");
  let t = (4 - e.length % 4) % 4;
  return A.default.enc.Base64.parse(e + "=".repeat(t));
}
function v(e) {
  let t = e.words, n = e.sigBytes, r = new Uint8Array(n);
  for (let o = 0; o < n; o++)
    r[o] = t[o >>> 2] >>> 24 - o % 4 * 8 & 255;
  return r;
}
function j(e) {
  let t = [];
  for (let n = 0; n < e.length; n += 4)
    t.push((e[n] || 0) << 24 | (e[n + 1] || 0) << 16 | (e[n + 2] || 0) << 8 | (e[n + 3] || 0));
  return A.default.lib.WordArray.create(t, e.length);
}
function le(e) {
  let t = new Uint8Array(e);
  for (let n = 15; n >= 12 && (t[n]++, t[n] === 0); n--)
    ;
  return t;
}
function Ee(e, t, n) {
  try {
    let r = new Uint8Array(16);
    r.set(t, 0), r[15] = 1;
    let o = le(r), i = j(e), s = new Uint8Array(n.length);
    for (let l = 0; l < n.length; l += 16) {
      let c = Math.min(16, n.length - l), u = j(o), a = A.default.AES.encrypt(u, i, { mode: A.default.mode.ECB, padding: A.default.pad.NoPadding }), d = v(a.ciphertext);
      for (let f = 0; f < c; f++)
        s[l + f] = n[l + f] ^ d[f];
      o = le(o);
    }
    return s;
  } catch (r) {
    return console.log("[Filemoon] AES-GCM error:", r.message), null;
  }
}
function I(e) {
  return p(this, null, function* () {
    var t, n, r;
    console.log(`[Filemoon] Resolviendo: ${e}`);
    try {
      let o = e.match(/\/(?:e|d)\/([a-z0-9]{12})/i);
      if (!o)
        return null;
      let i = o[1], { data: s } = yield D.default.get(`https://filemooon.link/api/videos/${i}/embed/playback`, { timeout: 7e3, headers: { "User-Agent": B, Referer: e } });
      if (s.error)
        return console.log(`[Filemoon] API error: ${s.error}`), null;
      let l = s.playback;
      if ((l == null ? void 0 : l.algorithm) !== "AES-256-GCM" || ((t = l.key_parts) == null ? void 0 : t.length) !== 2)
        return console.log("[Filemoon] Formato de cifrado no soportado"), null;
      let c = v(V(l.key_parts[0])), u = v(V(l.key_parts[1])), a = new Uint8Array(c.length + u.length);
      a.set(c, 0), a.set(u, c.length);
      let d;
      if (a.length === 32)
        d = a;
      else {
        let w = j(a);
        d = v(A.default.SHA256(w));
      }
      let f = v(V(l.iv)), h = v(V(l.payload));
      if (h.length < 16)
        return null;
      let g = h.slice(0, -16), m = Ee(d, f, g);
      if (!m)
        return null;
      let $ = "";
      for (let w = 0; w < m.length; w++)
        $ += String.fromCharCode(m[w]);
      let y = (r = (n = JSON.parse($).sources) == null ? void 0 : n[0]) == null ? void 0 : r.url;
      if (!y)
        return null;
      console.log(`[Filemoon] URL encontrada: ${y.substring(0, 80)}...`);
      let L = y, R = "1080p";
      if (y.includes("master"))
        try {
          let T = (yield D.default.get(y, { timeout: 3e3, headers: { "User-Agent": B, Referer: e }, responseType: "text" })).data.split(`
`), O = 0, G = 0, P = y;
          for (let b = 0; b < T.length; b++) {
            let X = T[b].trim();
            if (X.startsWith("#EXT-X-STREAM-INF")) {
              let N = X.match(/RESOLUTION=(\d+)x(\d+)/), ge = N ? parseInt(N[1]) : 0, J = N ? parseInt(N[2]) : 0;
              for (let F = b + 1; F < b + 3 && F < T.length; F++) {
                let W = T[F].trim();
                if (W && !W.startsWith("#") && J > O) {
                  O = J, G = ge, P = W.startsWith("http") ? W : new URL(W, y).toString();
                  break;
                }
              }
            }
          }
          O > 0 && (L = P, R = z(G, O), console.log(`[Filemoon] Mejor calidad: ${R}`));
        } catch (w) {
          console.log(`[Filemoon] No se pudo parsear master: ${w.message}`);
        }
      return { url: L, quality: R, headers: { "User-Agent": B, Referer: e, Origin: "https://filemoon.sx" } };
    } catch (o) {
      return console.log(`[Filemoon] Error: ${o.message}`), null;
    }
  });
}
var K = x(require("axios"));
var C = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function Ce(e, t, n) {
  let r = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", o = (i) => {
    let s = 0;
    for (let l = 0; l < i.length; l++) {
      let c = r.indexOf(i[l]);
      if (c === -1)
        return NaN;
      s = s * t + c;
    }
    return s;
  };
  return e.replace(/\b([0-9a-zA-Z]+)\b/g, (i) => {
    let s = o(i);
    return isNaN(s) || s >= n.length ? i : n[s] && n[s] !== "" ? n[s] : i;
  });
}
function Me(e, t) {
  let n = e.match(/\{[^{}]*"hls[234]"\s*:\s*"([^"]+)"[^{}]*\}/);
  if (n)
    try {
      let o = n[0].replace(/(\w+)\s*:/g, '"$1":'), i = JSON.parse(o), s = i.hls4 || i.hls3 || i.hls2;
      if (s)
        return s.startsWith("/") ? t + s : s;
    } catch (o) {
      let i = n[0].match(/"hls[234]"\s*:\s*"([^"]+\.m3u8[^"]*)"/);
      if (i) {
        let s = i[1];
        return s.startsWith("/") ? t + s : s;
      }
    }
  let r = e.match(/["']([^"']{30,}\.m3u8[^"']*)['"]/i);
  if (r) {
    let o = r[1];
    return o.startsWith("/") ? t + o : o;
  }
  return null;
}
var Ue = { "hglink.to": "vibuxer.com" };
function M(e) {
  return p(this, null, function* () {
    var t, n, r, o;
    try {
      let i = e;
      for (let [f, h] of Object.entries(Ue))
        if (i.includes(f)) {
          i = i.replace(f, h);
          break;
        }
      let s = ((t = i.match(/^(https?:\/\/[^/]+)/)) == null ? void 0 : t[1]) || "https://hlswish.com";
      console.log(`[HLSWish] Resolviendo: ${e}`), i !== e && console.log(`[HLSWish] \u2192 Mapped to: ${i}`);
      let l = yield K.default.get(i, { headers: { "User-Agent": C, Referer: "https://embed69.org/", Origin: "https://embed69.org", Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", "Accept-Language": "es-MX,es;q=0.9" }, timeout: 15e3, maxRedirects: 5 }), c = typeof l.data == "string" ? l.data : JSON.stringify(l.data), u = c.match(/file\s*:\s*["']([^"']+)["']/i);
      if (u) {
        let f = u[1];
        if (f.startsWith("/") && (f = s + f), f.includes("vibuxer.com/stream/")) {
          console.log(`[HLSWish] Siguiendo redirect: ${f.substring(0, 80)}...`);
          try {
            let h = yield K.default.get(f, { headers: { "User-Agent": C, Referer: s + "/" }, timeout: 8e3, maxRedirects: 5, validateStatus: (m) => m < 400 }), g = ((r = (n = h.request) == null ? void 0 : n.res) == null ? void 0 : r.responseUrl) || ((o = h.config) == null ? void 0 : o.url);
            g && g.includes(".m3u8") && (f = g);
          } catch (h) {
          }
        }
        return console.log(`[HLSWish] URL encontrada: ${f.substring(0, 80)}...`), { url: f, quality: "1080p", headers: { "User-Agent": C, Referer: s + "/" } };
      }
      let a = c.match(/eval\(function\(p,a,c,k,e,[a-z]\)\{[^}]+\}\s*\('([\s\S]+?)',\s*(\d+),\s*(\d+),\s*'([\s\S]+?)'\.split\('\|'\)/);
      if (a) {
        let f = Ce(a[1], parseInt(a[2]), a[4].split("|")), h = Me(f, s);
        if (h)
          return console.log(`[HLSWish] URL encontrada: ${h.substring(0, 80)}...`), { url: h, quality: "1080p", headers: { "User-Agent": C, Referer: s + "/" } };
      }
      let d = c.match(/https?:\/\/[^"'\s\\]+\.m3u8[^"'\s\\]*/i);
      return d ? (console.log(`[HLSWish] URL encontrada: ${d[0].substring(0, 80)}...`), { url: d[0], quality: "1080p", headers: { "User-Agent": C, Referer: s + "/" } }) : (console.log("[HLSWish] No se encontr\xF3 URL"), null);
    } catch (i) {
      return console.log(`[HLSWish] Error: ${i.message}`), null;
    }
  });
}
var ue = x(require("axios"));
var ce = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function fe(e) {
  return p(this, null, function* () {
    try {
      console.log(`[Vimeos] Resolviendo: ${e}`);
      let r = (yield ue.default.get(e, { headers: { "User-Agent": ce, Referer: "https://vimeos.net/", Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" }, timeout: 15e3, maxRedirects: 5 })).data.match(/eval\(function\(p,a,c,k,e,[dr]\)\{[\s\S]+?\}\('([\s\S]+?)',(\d+),(\d+),'([\s\S]+?)'\.split\('\|'\)/);
      if (r) {
        let o = r[1], i = parseInt(r[2]), s = r[4].split("|"), l = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", c = (d) => {
          let f = 0;
          for (let h = 0; h < d.length; h++)
            f = f * i + l.indexOf(d[h]);
          return f;
        }, a = o.replace(/\b(\w+)\b/g, (d) => {
          let f = c(d);
          return s[f] && s[f] !== "" ? s[f] : d;
        }).match(/["']([^"']+\.m3u8[^"']*)['"]/i);
        if (a) {
          let d = a[1], f = { "User-Agent": ce, Referer: "https://vimeos.net/" }, h = yield S(d, f);
          return console.log(`[Vimeos] URL encontrada: ${d.substring(0, 80)}...`), { url: d, quality: h, headers: f };
        }
      }
      return console.log("[Vimeos] No se encontr\xF3 URL"), null;
    } catch (t) {
      return console.log(`[Vimeos] Error: ${t.message}`), null;
    }
  });
}
var ke = "439c478a771f35c05022f9feabcca01c", me = "https://cinecalidad.vg", Le = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36", _ = { "User-Agent": Le, Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", "Accept-Language": "es-MX,es;q=0.9", Referer: me + "/" }, de = { "goodstream.one": oe, "hlswish.com": M, "streamwish.com": M, "streamwish.to": M, "strwish.com": M, "voe.sx": ae, "filemoon.sx": I, "filemoon.to": I, "vimeos.net": fe }, he = (e) => e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim(), pe = (e, t) => {
  let n = he(e), r = he(t);
  if (n === r)
    return 1;
  if (n.includes(r) || r.includes(n))
    return 0.8;
  let o = new Set(n.split(/\s+/)), i = new Set(r.split(/\s+/));
  return [...o].filter((l) => i.has(l)).length / Math.max(o.size, i.size);
}, Te = (e) => e.includes("goodstream") ? "GoodStream" : e.includes("hlswish") || e.includes("streamwish") || e.includes("strwish") ? "StreamWish" : e.includes("voe.sx") ? "VOE" : e.includes("filemoon") ? "Filemoon" : e.includes("vimeos") ? "Vimeos" : "Online", Oe = (e) => {
  if (!e || !e.startsWith("http"))
    return null;
  for (let t in de)
    if (e.includes(t))
      return de[t];
  return null;
};
function Ne(e) {
  try {
    return typeof atob != "undefined" ? atob(e) : Buffer.from(e, "base64").toString("utf8");
  } catch (t) {
    return null;
  }
}
function Fe(e, t) {
  return p(this, null, function* () {
    let n = (l, c) => p(this, null, function* () {
      let u = `https://api.themoviedb.org/3/${t}/${e}?api_key=${ke}&language=${l}`, { data: a } = yield U.default.get(u, { timeout: 5e3, headers: _ }), d = t === "movie" ? a.title : a.name, f = t === "movie" ? a.original_title : a.original_name;
      if (!d)
        throw new Error("No title");
      if (l === "es-MX" && /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(d))
        throw new Error("Japanese title");
      return { title: d, originalTitle: f, year: (a.release_date || a.first_air_date || "").substring(0, 4) };
    }), [r, o, i] = yield Promise.allSettled([n("es-MX", "Latino"), n("en-US", "Ingl\xE9s"), n("es-ES", "Espa\xF1a")]), s = r.status === "fulfilled" ? r.value : o.status === "fulfilled" ? o.value : i.status === "fulfilled" ? i.value : null;
    return s && console.log(`[CineCalidad] TMDB: "${s.title}"${s.title !== s.originalTitle ? ` | Original: "${s.originalTitle}"` : ""}`), s;
  });
}
function qe(e) {
  let t = /* @__PURE__ */ new Set(), { title: n, originalTitle: r, year: o } = e;
  if (n) {
    t.add(n.trim());
    let i = n.replace(/[¿¡:;"']/g, "").replace(/\s+/g, " ").trim();
    i !== n && t.add(i);
  }
  return r && r !== n && !/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(r) && t.add(r.trim()), [...t].slice(0, 4);
}
function Ve(e) {
  return p(this, null, function* () {
    let t = `${me}/?s=${encodeURIComponent(e)}`;
    try {
      let { data: n } = yield U.default.get(t, { timeout: 8e3, headers: _ }), r = [], o = 0;
      for (; ; ) {
        let s = n.indexOf("<article", o);
        if (s === -1)
          break;
        let l = n.indexOf("</article>", s);
        if (l === -1)
          break;
        r.push(n.substring(s, l + 10)), o = l + 10;
      }
      let i = [];
      for (let s of r) {
        if (s.includes("/serie/"))
          continue;
        let l = s.match(/class="absolute top-0[^"]*"[^>]+href="([^"]+)"/);
        if (!l)
          continue;
        let c = l[1], u = s.match(/<span class="sr-only">([^<]+)<\/span>/);
        if (!u)
          continue;
        let a = u[1].trim(), d = s.match(/>\s*(\d{4})\s*<\/div>/), f = d ? d[1] : "";
        i.push({ url: c, title: a, year: f });
      }
      return i;
    } catch (n) {
      return console.log(`[CineCalidad] Error b\xFAsqueda "${e}": ${n.message}`), [];
    }
  });
}
function _e(e, t) {
  if (e.length === 0)
    return null;
  if (e.length === 1)
    return e[0];
  let n = e.map((r) => {
    let o = pe(r.title, t.title) * 2;
    return t.originalTitle && (o += pe(r.title, t.originalTitle)), t.year && r.year && r.year === t.year && (o += 0.5), { result: r, score: o };
  });
  return n.sort((r, o) => o.score - r.score), n[0].result;
}
function ze(e) {
  return p(this, null, function* () {
    try {
      let { data: t } = yield U.default.get(e, { timeout: 8e3, headers: _ }), n = [], r = /class="[^"]*inline-block[^"]*"[^>]+data-url="([^"]+)"/g, o;
      for (; (o = r.exec(t)) !== null; )
        n.push(o[1]);
      let i = /data-src="([A-Za-z0-9+/=]{20,})"/g;
      for (; (o = i.exec(t)) !== null; )
        n.push(o[1]);
      let s = [...new Set(n.map((c) => Ne(c)).filter((c) => c && c.startsWith("http")))];
      console.log(`[CineCalidad] ${s.length} URLs intermedias \xFAnicas`);
      let l = /* @__PURE__ */ new Set();
      return yield Promise.allSettled(s.map((c) => p(this, null, function* () {
        try {
          let { data: u } = yield U.default.get(c, { timeout: 3e3, headers: _, maxRedirects: 3 }), a = "", d = u.match(/id="btn_enlace"[^>]*>[\s\S]*?href="([^"]+)"/);
          if (d && (a = d[1]), !a) {
            let f = u.match(/<iframe[^>]+src="([^"]+)"/);
            f && (a = f[1]);
          }
          !a && c.includes("/e/") && (a = c), a && a.startsWith("http") && l.add(a);
        } catch (u) {
        }
      }))), [...l];
    } catch (t) {
      return console.log(`[CineCalidad] Error obteniendo embeds: ${t.message}`), [];
    }
  });
}
function He(e) {
  return p(this, null, function* () {
    try {
      let t = Oe(e);
      if (!t)
        return console.log(`[CineCalidad] Sin resolver para: ${e.substring(0, 60)}`), null;
      let n = Te(e), r = yield t(e);
      return !r || !r.url ? null : { name: "CineCalidad", title: `${r.quality || "1080p"} \xB7 ${n}`, url: r.url, quality: r.quality || "1080p", headers: r.headers || {} };
    } catch (t) {
      return null;
    }
  });
}
function Be(e, t, n, r) {
  return p(this, null, function* () {
    if (!e || !t)
      return [];
    let o = Date.now();
    if (console.log(`[CineCalidad] Buscando: TMDB ${e} (${t})${n ? ` S${n}E${r}` : ""}`), t === "tv")
      return console.log("[CineCalidad] Series no soportadas a\xFAn"), [];
    try {
      let i = yield Fe(e, t);
      if (!i)
        return [];
      let s = qe(i);
      console.log(`[CineCalidad] ${s.length} variantes: ${s.join(", ")}`);
      let l = null;
      for (let h of s) {
        let g = yield Ve(h);
        if (g.length > 0) {
          let m = _e(g, i);
          if (m) {
            l = m, console.log(`[CineCalidad] \u2713 "${h}" \u2192 "${m.title}" (${m.url})`);
            break;
          }
        }
      }
      if (!l)
        return console.log("[CineCalidad] Sin resultados"), [];
      let c = yield ze(l.url);
      if (c.length === 0)
        return console.log("[CineCalidad] No se encontraron embeds"), [];
      console.log(`[CineCalidad] Resolviendo ${c.length} embeds...`);
      let u = 5e3, a = [...new Set(c)], d = yield new Promise((h) => {
        let g = [], m = 0, $ = a.length, k = () => h(g.filter(Boolean)), y = setTimeout(k, u);
        a.forEach((L) => {
          He(L).then((R) => {
            R && g.push(R), m++, m === $ && (clearTimeout(y), k());
          }).catch(() => {
            m++, m === $ && (clearTimeout(y), k());
          });
        });
      }), f = ((Date.now() - o) / 1e3).toFixed(2);
      return console.log(`[CineCalidad] \u2713 ${d.length} streams en ${f}s`), d;
    } catch (i) {
      return console.log(`[CineCalidad] Error: ${i.message}`), [];
    }
  });
}
