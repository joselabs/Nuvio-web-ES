var ge = Object.create;
var k = Object.defineProperty;
var ye = Object.getOwnPropertyDescriptor;
var ve = Object.getOwnPropertyNames, X = Object.getOwnPropertySymbols, we = Object.getPrototypeOf, Z = Object.prototype.hasOwnProperty, Se = Object.prototype.propertyIsEnumerable;
var Y = (e, t, o) => t in e ? k(e, t, { enumerable: true, configurable: true, writable: true, value: o }) : e[t] = o, V = (e, t) => {
  for (var o in t || (t = {}))
    Z.call(t, o) && Y(e, o, t[o]);
  if (X)
    for (var o of X(t))
      Se.call(t, o) && Y(e, o, t[o]);
  return e;
};
var xe = (e, t) => {
  for (var o in t)
    k(e, o, { get: t[o], enumerable: true });
}, ee = (e, t, o, r) => {
  if (t && typeof t == "object" || typeof t == "function")
    for (let n of ve(t))
      !Z.call(e, n) && n !== o && k(e, n, { get: () => t[n], enumerable: !(r = ye(t, n)) || r.enumerable });
  return e;
};
var x = (e, t, o) => (o = e != null ? ge(we(e)) : {}, ee(t || !e || !e.__esModule ? k(o, "default", { value: e, enumerable: true }) : o, e)), Ae = (e) => ee(k({}, "__esModule", { value: true }), e);
var m = (e, t, o) => new Promise((r, n) => {
  var i = (u) => {
    try {
      a(o.next(u));
    } catch (f) {
      n(f);
    }
  }, s = (u) => {
    try {
      a(o.throw(u));
    } catch (f) {
      n(f);
    }
  }, a = (u) => u.done ? r(u.value) : Promise.resolve(u.value).then(i, s);
  a((o = o.apply(e, t)).next());
});
var De = {};
xe(De, { getStreams: () => He });
module.exports = Ae(De);
var O = x(require("axios"));
var re = x(require("axios"));
var te = x(require("axios"));
var Re = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function H(e, t) {
  return e >= 3840 || t >= 2160 ? "4K" : e >= 1920 || t >= 1080 ? "1080p" : e >= 1280 || t >= 720 ? "720p" : e >= 854 || t >= 480 ? "480p" : "360p";
}
function $(o) {
  return m(this, arguments, function* (e, t = {}) {
    try {
      let { data: r } = yield te.default.get(e, { timeout: 3e3, headers: V({ "User-Agent": Re }, t), responseType: "text" });
      if (!r.includes("#EXT-X-STREAM-INF")) {
        let a = e.match(/[_-](\d{3,4})p/);
        return a ? `${a[1]}p` : "1080p";
      }
      let n = 0, i = 0, s = r.split(`
`);
      for (let a of s) {
        let u = a.match(/RESOLUTION=(\d+)x(\d+)/);
        if (u) {
          let f = parseInt(u[1]), l = parseInt(u[2]);
          l > i && (i = l, n = f);
        }
      }
      return i > 0 ? H(n, i) : "1080p";
    } catch (r) {
      return "1080p";
    }
  });
}
var oe = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function ne(e) {
  return m(this, null, function* () {
    try {
      console.log(`[GoodStream] Resolviendo: ${e}`);
      let o = (yield re.default.get(e, { headers: { "User-Agent": oe, Referer: "https://goodstream.one", Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" }, timeout: 15e3, maxRedirects: 5 })).data.match(/file:\s*"([^"]+)"/);
      if (!o)
        return console.log('[GoodStream] No se encontr\xF3 patr\xF3n file:"..."'), null;
      let r = o[1], n = { Referer: e, Origin: "https://goodstream.one", "User-Agent": oe }, i = yield $(r, n);
      return console.log(`[GoodStream] URL encontrada (${i}): ${r.substring(0, 80)}...`), { url: r, quality: i, headers: n };
    } catch (t) {
      return console.log(`[GoodStream] Error: ${t.message}`), null;
    }
  });
}
var ie = x(require("axios"));
var $e = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function se(e) {
  try {
    return typeof atob != "undefined" ? atob(e) : Buffer.from(e, "base64").toString("utf8");
  } catch (t) {
    return null;
  }
}
function Ee(e, t) {
  try {
    let r = t.replace(/^\[|\]$/g, "").split("','").map((f) => f.replace(/^'+|'+$/g, "")).map((f) => f.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), n = "";
    for (let f of e) {
      let l = f.charCodeAt(0);
      l > 64 && l < 91 ? l = (l - 52) % 26 + 65 : l > 96 && l < 123 && (l = (l - 84) % 26 + 97), n += String.fromCharCode(l);
    }
    for (let f of r)
      n = n.replace(new RegExp(f, "g"), "_");
    n = n.split("_").join("");
    let i = se(n);
    if (!i)
      return null;
    let s = "";
    for (let f = 0; f < i.length; f++)
      s += String.fromCharCode((i.charCodeAt(f) - 3 + 256) % 256);
    let a = s.split("").reverse().join(""), u = se(a);
    return u ? JSON.parse(u) : null;
  } catch (o) {
    return console.log("[VOE] voeDecode error:", o.message), null;
  }
}
function D(o) {
  return m(this, arguments, function* (e, t = {}) {
    return ie.default.get(e, { timeout: 15e3, maxRedirects: 5, headers: V({ "User-Agent": $e, Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" }, t), validateStatus: (r) => r < 500 });
  });
}
function ae(e) {
  return m(this, null, function* () {
    try {
      console.log(`[VOE] Resolviendo: ${e}`);
      let t = yield D(e, { Referer: e }), o = String(t && t.data ? t.data : "");
      if (/permanentToken/i.test(o)) {
        let u = o.match(/window\.location\.href\s*=\s*'([^']+)'/i);
        if (u) {
          console.log(`[VOE] Permanent token redirect -> ${u[1]}`);
          let f = yield D(u[1], { Referer: e });
          f && f.data && (o = String(f.data));
        }
      }
      let r = o.match(/json">\s*\[\s*['"]([^'"]+)['"]\s*\]\s*<\/script>\s*<script[^>]*src=['"]([^'"]+)['"]/i);
      if (r) {
        let u = r[1], f = r[2].startsWith("http") ? r[2] : new URL(r[2], e).href;
        console.log(`[VOE] Found encoded array + loader: ${f}`);
        let l = yield D(f, { Referer: e }), p = l && l.data ? String(l.data) : "", c = p.match(/(\[(?:'[^']{1,10}'[\s,]*){4,12}\])/i) || p.match(/(\[(?:"[^"]{1,10}"[,\s]*){4,12}\])/i);
        if (c) {
          let d = Ee(u, c[1]);
          if (d && (d.source || d.direct_access_url)) {
            let g = d.source || d.direct_access_url, v = yield $(g, { Referer: e });
            return console.log(`[VOE] URL encontrada: ${g.substring(0, 80)}...`), { url: g, quality: v, headers: { Referer: e } };
          }
        }
      }
      let n = /(?:mp4|hls)'\s*:\s*'([^']+)'/gi, i = /(?:mp4|hls)"\s*:\s*"([^"]+)"/gi, s = [], a;
      for (; (a = n.exec(o)) !== null; )
        s.push(a);
      for (; (a = i.exec(o)) !== null; )
        s.push(a);
      for (let u of s) {
        let f = u[1];
        if (!f)
          continue;
        let l = f;
        if (l.startsWith("aHR0"))
          try {
            l = atob(l);
          } catch (p) {
          }
        return console.log(`[VOE] URL encontrada (fallback): ${l.substring(0, 80)}...`), { url: l, quality: yield $(l, { Referer: e }), headers: { Referer: e } };
      }
      return console.log("[VOE] No se encontr\xF3 URL"), null;
    } catch (t) {
      return console.log(`[VOE] Error: ${t.message}`), null;
    }
  });
}
var B = x(require("axios")), E = x(require("crypto-js"));
var I = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function z(e) {
  e = e.replace(/-/g, "+").replace(/_/g, "/");
  let t = (4 - e.length % 4) % 4;
  return E.default.enc.Base64.parse(e + "=".repeat(t));
}
function M(e) {
  let t = e.words, o = e.sigBytes, r = new Uint8Array(o);
  for (let n = 0; n < o; n++)
    r[n] = t[n >>> 2] >>> 24 - n % 4 * 8 & 255;
  return r;
}
function P(e) {
  let t = [];
  for (let o = 0; o < e.length; o += 4)
    t.push((e[o] || 0) << 24 | (e[o + 1] || 0) << 16 | (e[o + 2] || 0) << 8 | (e[o + 3] || 0));
  return E.default.lib.WordArray.create(t, e.length);
}
function le(e) {
  let t = new Uint8Array(e);
  for (let o = 15; o >= 12 && (t[o]++, t[o] === 0); o--)
    ;
  return t;
}
function Me(e, t, o) {
  try {
    let r = new Uint8Array(16);
    r.set(t, 0), r[15] = 1;
    let n = le(r), i = P(e), s = new Uint8Array(o.length);
    for (let a = 0; a < o.length; a += 16) {
      let u = Math.min(16, o.length - a), f = P(n), l = E.default.AES.encrypt(f, i, { mode: E.default.mode.ECB, padding: E.default.pad.NoPadding }), p = M(l.ciphertext);
      for (let c = 0; c < u; c++)
        s[a + c] = o[a + c] ^ p[c];
      n = le(n);
    }
    return s;
  } catch (r) {
    return console.log("[Filemoon] AES-GCM error:", r.message), null;
  }
}
function j(e) {
  return m(this, null, function* () {
    var t, o, r;
    console.log(`[Filemoon] Resolviendo: ${e}`);
    try {
      let n = e.match(/\/(?:e|d)\/([a-z0-9]{12})/i);
      if (!n)
        return null;
      let i = n[1], { data: s } = yield B.default.get(`https://filemooon.link/api/videos/${i}/embed/playback`, { timeout: 7e3, headers: { "User-Agent": I, Referer: e } });
      if (s.error)
        return console.log(`[Filemoon] API error: ${s.error}`), null;
      let a = s.playback;
      if ((a == null ? void 0 : a.algorithm) !== "AES-256-GCM" || ((t = a.key_parts) == null ? void 0 : t.length) !== 2)
        return console.log("[Filemoon] Formato de cifrado no soportado"), null;
      let u = M(z(a.key_parts[0])), f = M(z(a.key_parts[1])), l = new Uint8Array(u.length + f.length);
      l.set(u, 0), l.set(f, u.length);
      let p;
      if (l.length === 32)
        p = l;
      else {
        let y = P(l);
        p = M(E.default.SHA256(y));
      }
      let c = M(z(a.iv)), d = M(z(a.payload));
      if (d.length < 16)
        return null;
      let g = d.slice(0, -16), v = Me(p, c, g);
      if (!v)
        return null;
      let W = "";
      for (let y = 0; y < v.length; y++)
        W += String.fromCharCode(v[y]);
      let h = (r = (o = JSON.parse(W).sources) == null ? void 0 : o[0]) == null ? void 0 : r.url;
      if (!h)
        return null;
      console.log(`[Filemoon] URL encontrada: ${h.substring(0, 80)}...`);
      let A = h, w = "1080p";
      if (h.includes("master"))
        try {
          let S = (yield B.default.get(h, { timeout: 3e3, headers: { "User-Agent": I, Referer: e }, responseType: "text" })).data.split(`
`), R = 0, F = 0, L = h;
          for (let b = 0; b < S.length; b++) {
            let J = S[b].trim();
            if (J.startsWith("#EXT-X-STREAM-INF")) {
              let q = J.match(/RESOLUTION=(\d+)x(\d+)/), me = q ? parseInt(q[1]) : 0, Q = q ? parseInt(q[2]) : 0;
              for (let _ = b + 1; _ < b + 3 && _ < S.length; _++) {
                let U = S[_].trim();
                if (U && !U.startsWith("#") && Q > R) {
                  R = Q, F = me, L = U.startsWith("http") ? U : new URL(U, h).toString();
                  break;
                }
              }
            }
          }
          R > 0 && (A = L, w = H(F, R), console.log(`[Filemoon] Mejor calidad: ${w}`));
        } catch (y) {
          console.log(`[Filemoon] No se pudo parsear master: ${y.message}`);
        }
      return { url: A, quality: w, headers: { "User-Agent": I, Referer: e, Origin: "https://filemoon.sx" } };
    } catch (n) {
      return console.log(`[Filemoon] Error: ${n.message}`), null;
    }
  });
}
var K = x(require("axios"));
var T = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function We(e, t, o) {
  let r = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", n = (i) => {
    let s = 0;
    for (let a = 0; a < i.length; a++) {
      let u = r.indexOf(i[a]);
      if (u === -1)
        return NaN;
      s = s * t + u;
    }
    return s;
  };
  return e.replace(/\b([0-9a-zA-Z]+)\b/g, (i) => {
    let s = n(i);
    return isNaN(s) || s >= o.length ? i : o[s] && o[s] !== "" ? o[s] : i;
  });
}
function Le(e, t) {
  let o = e.match(/\{[^{}]*"hls[234]"\s*:\s*"([^"]+)"[^{}]*\}/);
  if (o)
    try {
      let n = o[0].replace(/(\w+)\s*:/g, '"$1":'), i = JSON.parse(n), s = i.hls4 || i.hls3 || i.hls2;
      if (s)
        return s.startsWith("/") ? t + s : s;
    } catch (n) {
      let i = o[0].match(/"hls[234]"\s*:\s*"([^"]+\.m3u8[^"]*)"/);
      if (i) {
        let s = i[1];
        return s.startsWith("/") ? t + s : s;
      }
    }
  let r = e.match(/["']([^"']{30,}\.m3u8[^"']*)['"]/i);
  if (r) {
    let n = r[1];
    return n.startsWith("/") ? t + n : n;
  }
  return null;
}
var be = { "hglink.to": "vibuxer.com" };
function N(e) {
  return m(this, null, function* () {
    var t, o, r, n;
    try {
      let i = e;
      for (let [c, d] of Object.entries(be))
        if (i.includes(c)) {
          i = i.replace(c, d);
          break;
        }
      let s = ((t = i.match(/^(https?:\/\/[^/]+)/)) == null ? void 0 : t[1]) || "https://hlswish.com";
      console.log(`[HLSWish] Resolviendo: ${e}`), i !== e && console.log(`[HLSWish] \u2192 Mapped to: ${i}`);
      let a = yield K.default.get(i, { headers: { "User-Agent": T, Referer: "https://embed69.org/", Origin: "https://embed69.org", Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", "Accept-Language": "es-MX,es;q=0.9" }, timeout: 15e3, maxRedirects: 5 }), u = typeof a.data == "string" ? a.data : JSON.stringify(a.data), f = u.match(/file\s*:\s*["']([^"']+)["']/i);
      if (f) {
        let c = f[1];
        if (c.startsWith("/") && (c = s + c), c.includes("vibuxer.com/stream/")) {
          console.log(`[HLSWish] Siguiendo redirect: ${c.substring(0, 80)}...`);
          try {
            let d = yield K.default.get(c, { headers: { "User-Agent": T, Referer: s + "/" }, timeout: 8e3, maxRedirects: 5, validateStatus: (v) => v < 400 }), g = ((r = (o = d.request) == null ? void 0 : o.res) == null ? void 0 : r.responseUrl) || ((n = d.config) == null ? void 0 : n.url);
            g && g.includes(".m3u8") && (c = g);
          } catch (d) {
          }
        }
        return console.log(`[HLSWish] URL encontrada: ${c.substring(0, 80)}...`), { url: c, quality: "1080p", headers: { "User-Agent": T, Referer: s + "/" } };
      }
      let l = u.match(/eval\(function\(p,a,c,k,e,[a-z]\)\{[^}]+\}\s*\('([\s\S]+?)',\s*(\d+),\s*(\d+),\s*'([\s\S]+?)'\.split\('\|'\)/);
      if (l) {
        let c = We(l[1], parseInt(l[2]), l[4].split("|")), d = Le(c, s);
        if (d)
          return console.log(`[HLSWish] URL encontrada: ${d.substring(0, 80)}...`), { url: d, quality: "1080p", headers: { "User-Agent": T, Referer: s + "/" } };
      }
      let p = u.match(/https?:\/\/[^"'\s\\]+\.m3u8[^"'\s\\]*/i);
      return p ? (console.log(`[HLSWish] URL encontrada: ${p[0].substring(0, 80)}...`), { url: p[0], quality: "1080p", headers: { "User-Agent": T, Referer: s + "/" } }) : (console.log("[HLSWish] No se encontr\xF3 URL"), null);
    } catch (i) {
      return console.log(`[HLSWish] Error: ${i.message}`), null;
    }
  });
}
var ue = x(require("axios"));
var ce = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function fe(e) {
  return m(this, null, function* () {
    try {
      console.log(`[Vimeos] Resolviendo: ${e}`);
      let r = (yield ue.default.get(e, { headers: { "User-Agent": ce, Referer: "https://vimeos.net/", Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" }, timeout: 15e3, maxRedirects: 5 })).data.match(/eval\(function\(p,a,c,k,e,[dr]\)\{[\s\S]+?\}\('([\s\S]+?)',(\d+),(\d+),'([\s\S]+?)'\.split\('\|'\)/);
      if (r) {
        let n = r[1], i = parseInt(r[2]), s = r[4].split("|"), a = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", u = (p) => {
          let c = 0;
          for (let d = 0; d < p.length; d++)
            c = c * i + a.indexOf(p[d]);
          return c;
        }, l = n.replace(/\b(\w+)\b/g, (p) => {
          let c = u(p);
          return s[c] && s[c] !== "" ? s[c] : p;
        }).match(/["']([^"']+\.m3u8[^"']*)['"]/i);
        if (l) {
          let p = l[1], c = { "User-Agent": ce, Referer: "https://vimeos.net/" }, d = yield $(p, c);
          return console.log(`[Vimeos] URL encontrada: ${p.substring(0, 80)}...`), { url: p, quality: d, headers: c };
        }
      }
      return console.log("[Vimeos] No se encontr\xF3 URL"), null;
    } catch (t) {
      return console.log(`[Vimeos] Error: ${t.message}`), null;
    }
  });
}
var Ue = "439c478a771f35c05022f9feabcca01c", ke = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36", C = { "User-Agent": ke, Accept: "application/json" }, pe = { "goodstream.one": ne, "hlswish.com": N, "streamwish.com": N, "streamwish.to": N, "strwish.com": N, "voe.sx": ae, "filemoon.sx": j, "filemoon.to": j, "vimeos.net": fe }, de = (e) => e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim(), he = (e, t) => {
  let o = de(e), r = de(t);
  if (o === r)
    return 1;
  if (o.includes(r) || r.includes(o))
    return 0.8;
  let n = new Set(o.split(/\s+/)), i = new Set(r.split(/\s+/));
  return [...n].filter((a) => i.has(a)).length / Math.max(n.size, i.size);
}, Te = (e) => {
  let t = e.toString().toLowerCase(), o = t.match(/(\d+)/);
  return o ? `${o[1]}p` : t.includes("4k") || t.includes("uhd") ? "2160p" : t.includes("full") || t.includes("fhd") ? "1080p" : t.includes("hd") ? "720p" : "SD";
}, Ne = (e) => e.includes("goodstream") ? "GoodStream" : e.includes("hlswish") || e.includes("streamwish") ? "StreamWish" : e.includes("voe.sx") ? "VOE" : e.includes("filemoon") ? "Filemoon" : e.includes("vimeos.net") ? "Vimeos" : "Online", Oe = (e) => {
  if (!e || !e.startsWith("http"))
    return null;
  for (let t in pe)
    if (e.includes(t))
      return pe[t];
  return null;
};
function Fe(e, t) {
  return m(this, null, function* () {
    let o = (a, u) => m(this, null, function* () {
      let f = `https://api.themoviedb.org/3/${t}/${e}?api_key=${Ue}&language=${a}`, { data: l } = yield O.default.get(f, { timeout: 5e3, headers: C }), p = t === "movie" ? l.title : l.name, c = t === "movie" ? l.original_title : l.original_name;
      if (!p)
        throw new Error("No title");
      if (a === "es-MX" && /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(p))
        throw new Error("Japanese title");
      return { title: p, originalTitle: c, year: (l.release_date || l.first_air_date || "").substring(0, 4) };
    }), [r, n, i] = yield Promise.allSettled([o("es-MX", "Latino"), o("en-US", "Ingl\xE9s"), o("es-ES", "Espa\xF1a")]), s = r.status === "fulfilled" ? r.value : n.status === "fulfilled" ? n.value : i.status === "fulfilled" ? i.value : null;
    return s && console.log(`[LaMovie] TMDB: "${s.title}"${s.title !== s.originalTitle ? ` | Original: "${s.originalTitle}"` : ""}`), s;
  });
}
function qe(e, t) {
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
function _e(e, t) {
  return m(this, null, function* () {
    var n;
    let r = `https://la.movie/wp-api/v1/search?filter=%7B%7D&postType=any&q=${encodeURIComponent(e.trim())}&postsPerPage=10`;
    try {
      let { data: i } = yield O.default.get(r, { timeout: 8e3, headers: C });
      return (n = i == null ? void 0 : i.data) != null && n.posts ? i.data.posts.filter((s) => t === "movie" ? s.type === "movie" || s.type === "movies" : s.type === "tvshow" || s.type === "tvshows" || s.type === "series") : [];
    } catch (i) {
      return [];
    }
  });
}
function Ve(e, t) {
  if (e.length === 0)
    return null;
  if (e.length === 1)
    return e[0];
  let o = e.map((r) => {
    let n = he(r.title || "", t.title) * 2;
    return t.originalTitle && (n += he(r.title || "", t.originalTitle)), t.year && r.year && r.year.toString() === t.year && (n += 0.5), { result: r, score: n };
  });
  return o.sort((r, n) => n.score - r.score), o[0].result;
}
function ze(e, t, o) {
  return m(this, null, function* () {
    var n;
    let r = `https://la.movie/wp-api/v1/single/episodes/list?_id=${e}&season=${t}&page=1&postsPerPage=50`;
    try {
      let { data: i } = yield O.default.get(r, { timeout: 12e3, headers: C });
      if (!((n = i == null ? void 0 : i.data) != null && n.posts))
        return null;
      let s = i.data.posts.find((a) => a.season_number == t && a.episode_number == o);
      return (s == null ? void 0 : s._id) || null;
    } catch (i) {
      return console.log(`[LaMovie] Error episodios: ${i.message}`), null;
    }
  });
}
function Ce(e) {
  return m(this, null, function* () {
    try {
      let t = Oe(e.url);
      if (!t)
        return console.log(`[LaMovie] Sin resolver para: ${e.url}`), null;
      let o = yield t(e.url);
      if (!o || !o.url)
        return null;
      let r = Te(e.quality || "1080p"), n = Ne(e.url);
      return { name: "LaMovie", title: `${o.quality || "1080p"} \xB7 ${n}`, url: o.url, quality: o.quality || "1080p", headers: o.headers || {} };
    } catch (t) {
      return console.log(`[LaMovie] Error procesando embed: ${t.message}`), null;
    }
  });
}
function He(e, t, o, r) {
  return m(this, null, function* () {
    var i;
    if (!e || !t)
      return [];
    let n = Date.now();
    console.log(`[LaMovie] Buscando: TMDB ${e} (${t})${o ? ` S${o}E${r}` : ""}`);
    try {
      let s = yield Fe(e, t);
      if (!s)
        return [];
      let a = qe(s, t);
      console.log(`[LaMovie] ${a.length} variantes generadas`);
      let u = a.slice(0, 3).map((h) => m(this, null, function* () {
        let A = yield _e(h, t);
        return { variant: h, results: A };
      })), f = yield Promise.allSettled(u), l = null;
      for (let h of f)
        if (h.status === "fulfilled" && h.value.results.length > 0) {
          l = h.value;
          break;
        }
      if (!l)
        return console.log("[LaMovie] Sin resultados"), [];
      console.log(`[LaMovie] \u2713 "${l.variant}" (${l.results.length} resultados)`);
      let p = Ve(l.results, s);
      if (!p)
        return [];
      let c = p._id;
      if (t === "tv" && o && r) {
        let h = yield ze(c, o, r);
        if (!h)
          return console.log(`[LaMovie] Episodio S${o}E${r} no encontrado`), [];
        c = h;
      }
      let { data: d } = yield O.default.get(`https://la.movie/wp-api/v1/player?postId=${c}&demo=0`, { timeout: 6e3, headers: C });
      if (!((i = d == null ? void 0 : d.data) != null && i.embeds))
        return console.log("[LaMovie] No hay embeds disponibles"), [];
      let g = 5e3, v = d.data.embeds.map((h) => Ce(h)), W = yield new Promise((h) => {
        let A = [], w = 0, y = v.length, S = () => h(A.filter(Boolean)), R = setTimeout(S, g);
        v.forEach((F) => {
          F.then((L) => {
            L && A.push(L), w++, w === y && (clearTimeout(R), S());
          }).catch(() => {
            w++, w === y && (clearTimeout(R), S());
          });
        });
      }), G = ((Date.now() - n) / 1e3).toFixed(2);
      return console.log(`[LaMovie] \u2713 ${W.length} streams en ${G}s`), W;
    } catch (s) {
      return console.log(`[LaMovie] Error: ${s.message}`), [];
    }
  });
}
