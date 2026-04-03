var ue = Object.create;
var W = Object.defineProperty;
var fe = Object.getOwnPropertyDescriptor;
var pe = Object.getOwnPropertyNames, J = Object.getOwnPropertySymbols, de = Object.getPrototypeOf, Q = Object.prototype.hasOwnProperty, he = Object.prototype.propertyIsEnumerable;
var G = (e, n, t) => n in e ? W(e, n, { enumerable: true, configurable: true, writable: true, value: t }) : e[n] = t, N = (e, n) => {
  for (var t in n || (n = {}))
    Q.call(n, t) && G(e, t, n[t]);
  if (J)
    for (var t of J(n))
      he.call(n, t) && G(e, t, n[t]);
  return e;
};
var ge = (e, n) => {
  for (var t in n)
    W(e, t, { get: n[t], enumerable: true });
}, Y = (e, n, t, c) => {
  if (n && typeof n == "object" || typeof n == "function")
    for (let o of pe(n))
      !Q.call(e, o) && o !== t && W(e, o, { get: () => n[o], enumerable: !(c = fe(n, o)) || c.enumerable });
  return e;
};
var R = (e, n, t) => (t = e != null ? ue(de(e)) : {}, Y(n || !e || !e.__esModule ? W(t, "default", { value: e, enumerable: true }) : t, e)), me = (e) => Y(W({}, "__esModule", { value: true }), e);
var d = (e, n, t) => new Promise((c, o) => {
  var l = (a) => {
    try {
      r(t.next(a));
    } catch (i) {
      o(i);
    }
  }, s = (a) => {
    try {
      r(t.throw(a));
    } catch (i) {
      o(i);
    }
  }, r = (a) => a.done ? c(a.value) : Promise.resolve(a.value).then(l, s);
  r((t = t.apply(e, n)).next());
});
var Ue = {};
ge(Ue, { getStreams: () => ke });
module.exports = me(Ue);
var F = R(require("axios"));
var V = R(require("axios"));
var b = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function ye(e, n, t) {
  let c = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", o = (l) => {
    let s = 0;
    for (let r = 0; r < l.length; r++) {
      let a = c.indexOf(l[r]);
      if (a === -1)
        return NaN;
      s = s * n + a;
    }
    return s;
  };
  return e.replace(/\b([0-9a-zA-Z]+)\b/g, (l) => {
    let s = o(l);
    return isNaN(s) || s >= t.length ? l : t[s] && t[s] !== "" ? t[s] : l;
  });
}
function Ae(e, n) {
  let t = e.match(/\{[^{}]*"hls[234]"\s*:\s*"([^"]+)"[^{}]*\}/);
  if (t)
    try {
      let o = t[0].replace(/(\w+)\s*:/g, '"$1":'), l = JSON.parse(o), s = l.hls4 || l.hls3 || l.hls2;
      if (s)
        return s.startsWith("/") ? n + s : s;
    } catch (o) {
      let l = t[0].match(/"hls[234]"\s*:\s*"([^"]+\.m3u8[^"]*)"/);
      if (l) {
        let s = l[1];
        return s.startsWith("/") ? n + s : s;
      }
    }
  let c = e.match(/["']([^"']{30,}\.m3u8[^"']*)['"]/i);
  if (c) {
    let o = c[1];
    return o.startsWith("/") ? n + o : o;
  }
  return null;
}
var Re = { "hglink.to": "vibuxer.com" };
function _(e) {
  return d(this, null, function* () {
    var n, t, c, o;
    try {
      let l = e;
      for (let [p, f] of Object.entries(Re))
        if (l.includes(p)) {
          l = l.replace(p, f);
          break;
        }
      let s = ((n = l.match(/^(https?:\/\/[^/]+)/)) == null ? void 0 : n[1]) || "https://hlswish.com";
      console.log(`[HLSWish] Resolviendo: ${e}`), l !== e && console.log(`[HLSWish] \u2192 Mapped to: ${l}`);
      let r = yield V.default.get(l, { headers: { "User-Agent": b, Referer: "https://embed69.org/", Origin: "https://embed69.org", Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", "Accept-Language": "es-MX,es;q=0.9" }, timeout: 15e3, maxRedirects: 5 }), a = typeof r.data == "string" ? r.data : JSON.stringify(r.data), i = a.match(/file\s*:\s*["']([^"']+)["']/i);
      if (i) {
        let p = i[1];
        if (p.startsWith("/") && (p = s + p), p.includes("vibuxer.com/stream/")) {
          console.log(`[HLSWish] Siguiendo redirect: ${p.substring(0, 80)}...`);
          try {
            let f = yield V.default.get(p, { headers: { "User-Agent": b, Referer: s + "/" }, timeout: 8e3, maxRedirects: 5, validateStatus: (m) => m < 400 }), g = ((c = (t = f.request) == null ? void 0 : t.res) == null ? void 0 : c.responseUrl) || ((o = f.config) == null ? void 0 : o.url);
            g && g.includes(".m3u8") && (p = g);
          } catch (f) {
          }
        }
        return console.log(`[HLSWish] URL encontrada: ${p.substring(0, 80)}...`), { url: p, quality: "1080p", headers: { "User-Agent": b, Referer: s + "/" } };
      }
      let u = a.match(/eval\(function\(p,a,c,k,e,[a-z]\)\{[^}]+\}\s*\('([\s\S]+?)',\s*(\d+),\s*(\d+),\s*'([\s\S]+?)'\.split\('\|'\)/);
      if (u) {
        let p = ye(u[1], parseInt(u[2]), u[4].split("|")), f = Ae(p, s);
        if (f)
          return console.log(`[HLSWish] URL encontrada: ${f.substring(0, 80)}...`), { url: f, quality: "1080p", headers: { "User-Agent": b, Referer: s + "/" } };
      }
      let h = a.match(/https?:\/\/[^"'\s\\]+\.m3u8[^"'\s\\]*/i);
      return h ? (console.log(`[HLSWish] URL encontrada: ${h[0].substring(0, 80)}...`), { url: h[0], quality: "1080p", headers: { "User-Agent": b, Referer: s + "/" } }) : (console.log("[HLSWish] No se encontr\xF3 URL"), null);
    } catch (l) {
      return console.log(`[HLSWish] Error: ${l.message}`), null;
    }
  });
}
var T = R(require("axios")), x = R(require("crypto-js"));
var Z = R(require("axios"));
var xe = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function I(e, n) {
  return e >= 3840 || n >= 2160 ? "4K" : e >= 1920 || n >= 1080 ? "1080p" : e >= 1280 || n >= 720 ? "720p" : e >= 854 || n >= 480 ? "480p" : "360p";
}
function P(t) {
  return d(this, arguments, function* (e, n = {}) {
    try {
      let { data: c } = yield Z.default.get(e, { timeout: 3e3, headers: N({ "User-Agent": xe }, n), responseType: "text" });
      if (!c.includes("#EXT-X-STREAM-INF")) {
        let r = e.match(/[_-](\d{3,4})p/);
        return r ? `${r[1]}p` : "1080p";
      }
      let o = 0, l = 0, s = c.split(`
`);
      for (let r of s) {
        let a = r.match(/RESOLUTION=(\d+)x(\d+)/);
        if (a) {
          let i = parseInt(a[1]), u = parseInt(a[2]);
          u > l && (l = u, o = i);
        }
      }
      return l > 0 ? I(o, l) : "1080p";
    } catch (c) {
      return "1080p";
    }
  });
}
var q = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function O(e) {
  e = e.replace(/-/g, "+").replace(/_/g, "/");
  let n = (4 - e.length % 4) % 4;
  return x.default.enc.Base64.parse(e + "=".repeat(n));
}
function v(e) {
  let n = e.words, t = e.sigBytes, c = new Uint8Array(t);
  for (let o = 0; o < t; o++)
    c[o] = n[o >>> 2] >>> 24 - o % 4 * 8 & 255;
  return c;
}
function X(e) {
  let n = [];
  for (let t = 0; t < e.length; t += 4)
    n.push((e[t] || 0) << 24 | (e[t + 1] || 0) << 16 | (e[t + 2] || 0) << 8 | (e[t + 3] || 0));
  return x.default.lib.WordArray.create(n, e.length);
}
function ee(e) {
  let n = new Uint8Array(e);
  for (let t = 15; t >= 12 && (n[t]++, n[t] === 0); t--)
    ;
  return n;
}
function $e(e, n, t) {
  try {
    let c = new Uint8Array(16);
    c.set(n, 0), c[15] = 1;
    let o = ee(c), l = X(e), s = new Uint8Array(t.length);
    for (let r = 0; r < t.length; r += 16) {
      let a = Math.min(16, t.length - r), i = X(o), u = x.default.AES.encrypt(i, l, { mode: x.default.mode.ECB, padding: x.default.pad.NoPadding }), h = v(u.ciphertext);
      for (let p = 0; p < a; p++)
        s[r + p] = t[r + p] ^ h[p];
      o = ee(o);
    }
    return s;
  } catch (c) {
    return console.log("[Filemoon] AES-GCM error:", c.message), null;
  }
}
function te(e) {
  return d(this, null, function* () {
    var n, t, c;
    console.log(`[Filemoon] Resolviendo: ${e}`);
    try {
      let o = e.match(/\/(?:e|d)\/([a-z0-9]{12})/i);
      if (!o)
        return null;
      let l = o[1], { data: s } = yield T.default.get(`https://filemooon.link/api/videos/${l}/embed/playback`, { timeout: 7e3, headers: { "User-Agent": q, Referer: e } });
      if (s.error)
        return console.log(`[Filemoon] API error: ${s.error}`), null;
      let r = s.playback;
      if ((r == null ? void 0 : r.algorithm) !== "AES-256-GCM" || ((n = r.key_parts) == null ? void 0 : n.length) !== 2)
        return console.log("[Filemoon] Formato de cifrado no soportado"), null;
      let a = v(O(r.key_parts[0])), i = v(O(r.key_parts[1])), u = new Uint8Array(a.length + i.length);
      u.set(a, 0), u.set(i, a.length);
      let h;
      if (u.length === 32)
        h = u;
      else {
        let y = X(u);
        h = v(x.default.SHA256(y));
      }
      let p = v(O(r.iv)), f = v(O(r.payload));
      if (f.length < 16)
        return null;
      let g = f.slice(0, -16), m = $e(h, p, g);
      if (!m)
        return null;
      let $ = "";
      for (let y = 0; y < m.length; y++)
        $ += String.fromCharCode(m[y]);
      let A = (c = (t = JSON.parse($).sources) == null ? void 0 : t[0]) == null ? void 0 : c.url;
      if (!A)
        return null;
      console.log(`[Filemoon] URL encontrada: ${A.substring(0, 80)}...`);
      let z = A, H = "1080p";
      if (A.includes("master"))
        try {
          let L = (yield T.default.get(A, { timeout: 3e3, headers: { "User-Agent": q, Referer: e }, responseType: "text" })).data.split(`
`), M = 0, C = 0, B = A;
          for (let w = 0; w < L.length; w++) {
            let j = L[w].trim();
            if (j.startsWith("#EXT-X-STREAM-INF")) {
              let k = j.match(/RESOLUTION=(\d+)x(\d+)/), ie = k ? parseInt(k[1]) : 0, K = k ? parseInt(k[2]) : 0;
              for (let U = w + 1; U < w + 3 && U < L.length; U++) {
                let S = L[U].trim();
                if (S && !S.startsWith("#") && K > M) {
                  M = K, C = ie, B = S.startsWith("http") ? S : new URL(S, A).toString();
                  break;
                }
              }
            }
          }
          M > 0 && (z = B, H = I(C, M), console.log(`[Filemoon] Mejor calidad: ${H}`));
        } catch (y) {
          console.log(`[Filemoon] No se pudo parsear master: ${y.message}`);
        }
      return { url: z, quality: H, headers: { "User-Agent": q, Referer: e, Origin: "https://filemoon.sx" } };
    } catch (o) {
      return console.log(`[Filemoon] Error: ${o.message}`), null;
    }
  });
}
var oe = R(require("axios"));
var ve = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function ne(e) {
  try {
    return typeof atob != "undefined" ? atob(e) : Buffer.from(e, "base64").toString("utf8");
  } catch (n) {
    return null;
  }
}
function we(e, n) {
  try {
    let c = n.replace(/^\[|\]$/g, "").split("','").map((i) => i.replace(/^'+|'+$/g, "")).map((i) => i.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), o = "";
    for (let i of e) {
      let u = i.charCodeAt(0);
      u > 64 && u < 91 ? u = (u - 52) % 26 + 65 : u > 96 && u < 123 && (u = (u - 84) % 26 + 97), o += String.fromCharCode(u);
    }
    for (let i of c)
      o = o.replace(new RegExp(i, "g"), "_");
    o = o.split("_").join("");
    let l = ne(o);
    if (!l)
      return null;
    let s = "";
    for (let i = 0; i < l.length; i++)
      s += String.fromCharCode((l.charCodeAt(i) - 3 + 256) % 256);
    let r = s.split("").reverse().join(""), a = ne(r);
    return a ? JSON.parse(a) : null;
  } catch (t) {
    return console.log("[VOE] voeDecode error:", t.message), null;
  }
}
function D(t) {
  return d(this, arguments, function* (e, n = {}) {
    return oe.default.get(e, { timeout: 15e3, maxRedirects: 5, headers: N({ "User-Agent": ve, Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" }, n), validateStatus: (c) => c < 500 });
  });
}
function re(e) {
  return d(this, null, function* () {
    try {
      console.log(`[VOE] Resolviendo: ${e}`);
      let n = yield D(e, { Referer: e }), t = String(n && n.data ? n.data : "");
      if (/permanentToken/i.test(t)) {
        let a = t.match(/window\.location\.href\s*=\s*'([^']+)'/i);
        if (a) {
          console.log(`[VOE] Permanent token redirect -> ${a[1]}`);
          let i = yield D(a[1], { Referer: e });
          i && i.data && (t = String(i.data));
        }
      }
      let c = t.match(/json">\s*\[\s*['"]([^'"]+)['"]\s*\]\s*<\/script>\s*<script[^>]*src=['"]([^'"]+)['"]/i);
      if (c) {
        let a = c[1], i = c[2].startsWith("http") ? c[2] : new URL(c[2], e).href;
        console.log(`[VOE] Found encoded array + loader: ${i}`);
        let u = yield D(i, { Referer: e }), h = u && u.data ? String(u.data) : "", p = h.match(/(\[(?:'[^']{1,10}'[\s,]*){4,12}\])/i) || h.match(/(\[(?:"[^"]{1,10}"[,\s]*){4,12}\])/i);
        if (p) {
          let f = we(a, p[1]);
          if (f && (f.source || f.direct_access_url)) {
            let g = f.source || f.direct_access_url, m = yield P(g, { Referer: e });
            return console.log(`[VOE] URL encontrada: ${g.substring(0, 80)}...`), { url: g, quality: m, headers: { Referer: e } };
          }
        }
      }
      let o = /(?:mp4|hls)'\s*:\s*'([^']+)'/gi, l = /(?:mp4|hls)"\s*:\s*"([^"]+)"/gi, s = [], r;
      for (; (r = o.exec(t)) !== null; )
        s.push(r);
      for (; (r = l.exec(t)) !== null; )
        s.push(r);
      for (let a of s) {
        let i = a[1];
        if (!i)
          continue;
        let u = i;
        if (u.startsWith("aHR0"))
          try {
            u = atob(u);
          } catch (h) {
          }
        return console.log(`[VOE] URL encontrada (fallback): ${u.substring(0, 80)}...`), { url: u, quality: yield P(u, { Referer: e }), headers: { Referer: e } };
      }
      return console.log("[VOE] No se encontr\xF3 URL"), null;
    } catch (n) {
      return console.log(`[VOE] Error: ${n.message}`), null;
    }
  });
}
var ae = R(require("axios"));
var se = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function Se(e) {
  try {
    let n = e.match(/eval\(function\(p,a,c,k,e,[rd]\)\{.*?\}\s*\('([\s\S]*?)',\s*(\d+),\s*(\d+),\s*'([\s\S]*?)'\.split\('\|'\)/);
    if (!n)
      return null;
    let [, t, c, o, l] = n;
    c = parseInt(c), o = parseInt(o), l = l.split("|");
    let s = (r, a) => {
      let i = "0123456789abcdefghijklmnopqrstuvwxyz", u = "";
      for (; r > 0; )
        u = i[r % a] + u, r = Math.floor(r / a);
      return u || "0";
    };
    return t = t.replace(/\b\w+\b/g, (r) => {
      let a = parseInt(r, 36);
      return a < l.length && l[a] ? l[a] : s(a, c);
    }), t;
  } catch (n) {
    return null;
  }
}
function E(e) {
  return d(this, null, function* () {
    var n;
    try {
      console.log(`[VidHide] Resolviendo: ${e}`);
      let { data: t } = yield ae.default.get(e, { timeout: 15e3, maxRedirects: 10, headers: { "User-Agent": se, Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", Referer: "https://embed69.org/" } }), c = t.match(/eval\(function\(p,a,c,k,e,[rd]\)[\s\S]*?\.split\('\|'\)[^\)]*\)\)/);
      if (!c)
        return console.log("[VidHide] No se encontr\xF3 bloque eval"), null;
      let o = Se(c[0]);
      if (!o)
        return console.log("[VidHide] No se pudo desempacar"), null;
      let l = o.match(/"hls4"\s*:\s*"([^"]+)"/), s = o.match(/"hls2"\s*:\s*"([^"]+)"/), r = (n = l || s) == null ? void 0 : n[1];
      if (!r)
        return console.log("[VidHide] No se encontr\xF3 hls4/hls2"), null;
      let a = r;
      r.startsWith("http") || (a = `${new URL(e).origin}${r}`), console.log(`[VidHide] URL encontrada: ${a.substring(0, 80)}...`);
      let i = new URL(e).origin;
      return { url: a, headers: { "User-Agent": se, Referer: `${i}/`, Origin: i } };
    } catch (t) {
      return console.log(`[VidHide] Error: ${t.message}`), null;
    }
  });
}
var We = "439c478a771f35c05022f9feabcca01c", le = "https://xupalace.org", ce = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36", be = { "User-Agent": ce, Accept: "text/html", "Accept-Language": "es-MX,es;q=0.9", Connection: "keep-alive" }, Ee = { "hglink.to": { fn: _, name: "StreamWish" }, "vibuxer.com": { fn: _, name: "StreamWish" }, "bysedikamoum.com": { fn: te, name: "Filemoon" }, "voe.sx": { fn: re, name: "VOE" }, "vidhidepro.com": { fn: E, name: "VidHide" }, "vidhide.com": { fn: E, name: "VidHide" }, "dintezuvio.com": { fn: E, name: "VidHide" }, "filelions.to": { fn: E, name: "VidHide" } };
function Le(e, n) {
  return d(this, null, function* () {
    try {
      let t = `https://api.themoviedb.org/3/${n}/${e}/external_ids?api_key=${We}`, { data: c } = yield F.default.get(t, { timeout: 5e3, headers: { "User-Agent": ce } });
      return c.imdb_id || null;
    } catch (t) {
      return console.log(`[XuPalace] Error IMDB ID: ${t.message}`), null;
    }
  });
}
function Me(e, n, t, c) {
  return d(this, null, function* () {
    try {
      let o;
      n === "movie" ? o = `/video/${e}/` : o = `/video/${e}-${t}x${String(c).padStart(2, "0")}/`, console.log(`[XuPalace] Fetching: ${le}${o}`);
      let { data: l } = yield F.default.get(`${le}${o}`, { timeout: 8e3, headers: be }), s = [...l.matchAll(/go_to_playerVast\('(https?:\/\/[^']+)'[^)]+\)[^<]*data-lang="(\d+)"/g)];
      if (s.length === 0) {
        let a = [...l.matchAll(/go_to_playerVast\('(https?:\/\/[^']+)'/g)];
        return { 0: [...new Set(a.map((i) => i[1]))] };
      }
      let r = {};
      for (let a of s) {
        let i = a[1], u = parseInt(a[2]);
        r[u] || (r[u] = []), r[u].includes(i) || r[u].push(i);
      }
      return r;
    } catch (o) {
      return console.log(`[XuPalace] Error fetch: ${o.message}`), {};
    }
  });
}
function ke(e, n, t, c) {
  return d(this, null, function* () {
    if (!e)
      return [];
    let o = Date.now();
    console.log(`[XuPalace] Buscando: TMDB ${e} (${n})`);
    let l = { 0: "Latino", 1: "Espa\xF1ol", 2: "Subtitulado" };
    try {
      let s = yield Le(e, n);
      if (!s)
        return console.log("[XuPalace] No se encontr\xF3 IMDB ID"), [];
      console.log(`[XuPalace] IMDB ID: ${s}`);
      let r = yield Me(s, n, t, c);
      if (Object.keys(r).length === 0)
        return console.log("[XuPalace] No hay embeds"), [];
      for (let a of [0, 1, 2]) {
        let i = r[a];
        if (!i || i.length === 0)
          continue;
        let u = l[a];
        console.log(`[XuPalace] Resolviendo ${i.length} embeds (${u})...`);
        let p = (yield Promise.allSettled(i.map((f) => d(this, null, function* () {
          let g = new URL(f).hostname.replace("www.", ""), m = Ee[g];
          if (!m)
            return console.log(`[XuPalace] Sin resolver para: ${g} \u2192 ${f}`), null;
          let $ = yield m.fn(f);
          return $ && ($.server = m.name), $;
        })))).filter((f) => f.status === "fulfilled" && f.value).map((f) => ({ name: "XuPalace", title: `${f.value.quality || "1080p"} \xB7 ${u} \xB7 ${f.value.server}`, url: f.value.url, quality: f.value.quality || "1080p", headers: f.value.headers || {} }));
        if (p.length > 0) {
          console.log(`[XuPalace] \u2713 Streams encontrados en ${u}, omitiendo idiomas de menor prioridad`);
          let f = ((Date.now() - o) / 1e3).toFixed(2);
          return console.log(`[XuPalace] \u2713 ${p.length} streams en ${f}s`), p;
        }
      }
      return console.log("[XuPalace] No se encontraron streams en ning\xFAn idioma"), [];
    } catch (s) {
      return console.log(`[XuPalace] Error: ${s.message}`), [];
    }
  });
}
