var ce = Object.create;
var R = Object.defineProperty;
var ue = Object.getOwnPropertyDescriptor;
var de = Object.getOwnPropertyNames, j = Object.getOwnPropertySymbols, pe = Object.getPrototypeOf, H = Object.prototype.hasOwnProperty, fe = Object.prototype.propertyIsEnumerable;
var G = (e, o, t) => o in e ? R(e, o, { enumerable: true, configurable: true, writable: true, value: t }) : e[o] = t, I = (e, o) => {
  for (var t in o || (o = {}))
    H.call(o, t) && G(e, t, o[t]);
  if (j)
    for (var t of j(o))
      fe.call(o, t) && G(e, t, o[t]);
  return e;
};
var me = (e, o) => {
  for (var t in o)
    R(e, t, { get: o[t], enumerable: true });
}, K = (e, o, t, r) => {
  if (o && typeof o == "object" || typeof o == "function")
    for (let n of de(o))
      !H.call(e, n) && n !== t && R(e, n, { get: () => o[n], enumerable: !(r = ue(o, n)) || r.enumerable });
  return e;
};
var y = (e, o, t) => (t = e != null ? ce(pe(e)) : {}, K(o || !e || !e.__esModule ? R(t, "default", { value: e, enumerable: true }) : t, e)), ge = (e) => K(R({}, "__esModule", { value: true }), e);
var g = (e, o, t) => new Promise((r, n) => {
  var i = (c) => {
    try {
      a(t.next(c));
    } catch (u) {
      n(u);
    }
  }, s = (c) => {
    try {
      a(t.throw(c));
    } catch (u) {
      n(u);
    }
  }, a = (c) => c.done ? r(c.value) : Promise.resolve(c.value).then(i, s);
  a((t = t.apply(e, o)).next());
});
var Oe = {};
me(Oe, { getStreams: () => Fe });
module.exports = ge(Oe);
var L = y(require("axios"));
var X = y(require("axios"));
var J = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function Q(e) {
  return g(this, null, function* () {
    try {
      console.log(`[GoodStream] Resolviendo: ${e}`);
      let t = (yield X.default.get(e, { headers: { "User-Agent": J, Referer: "https://goodstream.one", Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" }, timeout: 15e3, maxRedirects: 5 })).data.match(/file:\s*"([^"]+)"/);
      if (!t)
        return console.log('[GoodStream] No se encontr\xF3 patr\xF3n file:"..."'), null;
      let r = t[1];
      return console.log(`[GoodStream] URL encontrada: ${r.substring(0, 80)}...`), { url: r, headers: { Referer: e, Origin: "https://goodstream.one", "User-Agent": J } };
    } catch (o) {
      return console.log(`[GoodStream] Error: ${o.message}`), null;
    }
  });
}
var Z = y(require("axios"));
var he = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function Y(e) {
  try {
    return typeof atob != "undefined" ? atob(e) : Buffer.from(e, "base64").toString("utf8");
  } catch (o) {
    return null;
  }
}
function ye(e, o) {
  try {
    let r = o.replace(/^\[|\]$/g, "").split("','").map((u) => u.replace(/^'+|'+$/g, "")).map((u) => u.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), n = "";
    for (let u of e) {
      let l = u.charCodeAt(0);
      l > 64 && l < 91 ? l = (l - 52) % 26 + 65 : l > 96 && l < 123 && (l = (l - 84) % 26 + 97), n += String.fromCharCode(l);
    }
    for (let u of r)
      n = n.replace(new RegExp(u, "g"), "_");
    n = n.split("_").join("");
    let i = Y(n);
    if (!i)
      return null;
    let s = "";
    for (let u = 0; u < i.length; u++)
      s += String.fromCharCode((i.charCodeAt(u) - 3 + 256) % 256);
    let a = s.split("").reverse().join(""), c = Y(a);
    return c ? JSON.parse(c) : null;
  } catch (t) {
    return console.log("[VOE] voeDecode error:", t.message), null;
  }
}
function _(t) {
  return g(this, arguments, function* (e, o = {}) {
    return Z.default.get(e, { timeout: 15e3, maxRedirects: 5, headers: I({ "User-Agent": he, Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" }, o), validateStatus: (r) => r < 500 });
  });
}
function ee(e) {
  return g(this, null, function* () {
    try {
      console.log(`[VOE] Resolviendo: ${e}`);
      let o = yield _(e, { Referer: e }), t = String(o && o.data ? o.data : "");
      if (/permanentToken/i.test(t)) {
        let c = t.match(/window\.location\.href\s*=\s*'([^']+)'/i);
        if (c) {
          console.log(`[VOE] Permanent token redirect -> ${c[1]}`);
          let u = yield _(c[1], { Referer: e });
          u && u.data && (t = String(u.data));
        }
      }
      let r = t.match(/json">\s*\[\s*['"]([^'"]+)['"]\s*\]\s*<\/script>\s*<script[^>]*src=['"]([^'"]+)['"]/i);
      if (r) {
        let c = r[1], u = r[2].startsWith("http") ? r[2] : new URL(r[2], e).href;
        console.log(`[VOE] Found encoded array + loader: ${u}`);
        let l = yield _(u, { Referer: e }), p = l && l.data ? String(l.data) : "", d = p.match(/(\[(?:'[^']{1,10}'[\s,]*){4,12}\])/i) || p.match(/(\[(?:"[^"]{1,10}"[,\s]*){4,12}\])/i);
        if (d) {
          let m = ye(c, d[1]);
          if (m && (m.source || m.direct_access_url)) {
            let w = m.source || m.direct_access_url;
            return console.log(`[VOE] URL encontrada: ${w.substring(0, 80)}...`), { url: w, headers: { Referer: e } };
          }
        }
      }
      let n = /(?:mp4|hls)'\s*:\s*'([^']+)'/gi, i = /(?:mp4|hls)"\s*:\s*"([^"]+)"/gi, s = [], a;
      for (; (a = n.exec(t)) !== null; )
        s.push(a);
      for (; (a = i.exec(t)) !== null; )
        s.push(a);
      for (let c of s) {
        let u = c[1];
        if (!u)
          continue;
        let l = u;
        if (l.startsWith("aHR0"))
          try {
            l = atob(l);
          } catch (p) {
          }
        return console.log(`[VOE] URL encontrada (fallback): ${l.substring(0, 80)}...`), { url: l, headers: { Referer: e } };
      }
      return console.log("[VOE] No se encontr\xF3 URL"), null;
    } catch (o) {
      return console.log(`[VOE] Error: ${o.message}`), null;
    }
  });
}
var T = y(require("axios")), v = y(require("crypto-js"));
var N = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function F(e) {
  e = e.replace(/-/g, "+").replace(/_/g, "/");
  let o = (4 - e.length % 4) % 4;
  return v.default.enc.Base64.parse(e + "=".repeat(o));
}
function S(e) {
  let o = e.words, t = e.sigBytes, r = new Uint8Array(t);
  for (let n = 0; n < t; n++)
    r[n] = o[n >>> 2] >>> 24 - n % 4 * 8 & 255;
  return r;
}
function V(e) {
  let o = [];
  for (let t = 0; t < e.length; t += 4)
    o.push((e[t] || 0) << 24 | (e[t + 1] || 0) << 16 | (e[t + 2] || 0) << 8 | (e[t + 3] || 0));
  return v.default.lib.WordArray.create(o, e.length);
}
function te(e) {
  let o = new Uint8Array(e);
  for (let t = 15; t >= 12 && (o[t]++, o[t] === 0); t--)
    ;
  return o;
}
function ve(e, o, t) {
  try {
    let r = new Uint8Array(16);
    r.set(o, 0), r[15] = 1;
    let n = te(r), i = V(e), s = new Uint8Array(t.length);
    for (let a = 0; a < t.length; a += 16) {
      let c = Math.min(16, t.length - a), u = V(n), l = v.default.AES.encrypt(u, i, { mode: v.default.mode.ECB, padding: v.default.pad.NoPadding }), p = S(l.ciphertext);
      for (let d = 0; d < c; d++)
        s[a + d] = t[a + d] ^ p[d];
      n = te(n);
    }
    return s;
  } catch (r) {
    return console.log("[Filemoon] AES-GCM error:", r.message), null;
  }
}
function C(e) {
  return g(this, null, function* () {
    var o, t, r;
    console.log(`[Filemoon] Resolviendo: ${e}`);
    try {
      let n = e.match(/\/(?:e|d)\/([a-z0-9]{12})/i);
      if (!n)
        return null;
      let i = n[1], { data: s } = yield T.default.get(`https://filemooon.link/api/videos/${i}/embed/playback`, { timeout: 7e3, headers: { "User-Agent": N, Referer: e } });
      if (s.error)
        return console.log(`[Filemoon] API error: ${s.error}`), null;
      let a = s.playback;
      if ((a == null ? void 0 : a.algorithm) !== "AES-256-GCM" || ((o = a.key_parts) == null ? void 0 : o.length) !== 2)
        return console.log("[Filemoon] Formato de cifrado no soportado"), null;
      let c = S(F(a.key_parts[0])), u = S(F(a.key_parts[1])), l = new Uint8Array(c.length + u.length);
      l.set(c, 0), l.set(u, c.length);
      let p;
      if (l.length === 32)
        p = l;
      else {
        let h = V(l);
        p = S(v.default.SHA256(h));
      }
      let d = S(F(a.iv)), m = S(F(a.payload));
      if (m.length < 16)
        return null;
      let w = m.slice(0, -16), M = ve(p, d, w);
      if (!M)
        return null;
      let $ = "";
      for (let h = 0; h < M.length; h++)
        $ += String.fromCharCode(M[h]);
      let f = (r = (t = JSON.parse($).sources) == null ? void 0 : t[0]) == null ? void 0 : r.url;
      if (!f)
        return null;
      console.log(`[Filemoon] URL encontrada: ${f.substring(0, 80)}...`);
      let W = f;
      if (f.includes("master"))
        try {
          let b = (yield T.default.get(f, { timeout: 3e3, headers: { "User-Agent": N, Referer: e }, responseType: "text" })).data.split(`
`), k = 0, B = f;
          for (let x = 0; x < b.length; x++) {
            let z = b[x].trim();
            if (z.startsWith("#EXT-X-STREAM-INF")) {
              let P = z.match(/RESOLUTION=\d+x(\d+)/), q = P ? parseInt(P[1]) : 0;
              for (let U = x + 1; U < x + 3 && U < b.length; U++) {
                let A = b[U].trim();
                if (A && !A.startsWith("#") && q > k) {
                  k = q, B = A.startsWith("http") ? A : new URL(A, f).toString();
                  break;
                }
              }
            }
          }
          k > 0 && (W = B, console.log(`[Filemoon] Mejor calidad: ${k}p`));
        } catch (h) {
          console.log(`[Filemoon] No se pudo parsear master: ${h.message}`);
        }
      return { url: W, headers: { "User-Agent": N, Referer: e, Origin: "https://filemoon.sx" } };
    } catch (n) {
      return console.log(`[Filemoon] Error: ${n.message}`), null;
    }
  });
}
var re = y(require("axios"));
var oe = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function E(e) {
  return g(this, null, function* () {
    try {
      let t = (yield re.default.get(e, { headers: { "User-Agent": oe, Referer: "https://hlswish.com/", Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" }, timeout: 15e3, maxRedirects: 5 })).data;
      console.log(`[HLSWish] Resolviendo: ${e}`);
      let r = t.match(/eval\(function\(p,a,c,k,e,[dr]\)\{[\s\S]+?\}\('([\s\S]+?)',(\d+),(\d+),'([\s\S]+?)'\.split\('\|'\)/);
      if (r) {
        let n = r[1], i = parseInt(r[2]), s = r[4].split("|"), a = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", c = (p) => {
          let d = 0;
          for (let m = 0; m < p.length; m++)
            d = d * i + a.indexOf(p[m]);
          return d;
        }, l = n.replace(/\b(\w+)\b/g, (p) => {
          let d = c(p);
          return s[d] && s[d] !== "" ? s[d] : p;
        }).match(/["']([^"']+\.m3u8[^"']*)['"]/i);
        if (l)
          return console.log(`[HLSWish] URL encontrada: ${l[1].substring(0, 80)}...`), { url: l[1], headers: { "User-Agent": oe, Referer: "https://hlswish.com/" } };
      }
      return console.log("[HLSWish] No se encontr\xF3 URL"), null;
    } catch (o) {
      return console.log(`[HLSWish] Error: ${o.message}`), null;
    }
  });
}
var se = y(require("axios"));
var ne = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function ae(e) {
  return g(this, null, function* () {
    try {
      console.log(`[Vimeos] Resolviendo: ${e}`);
      let r = (yield se.default.get(e, { headers: { "User-Agent": ne, Referer: "https://vimeos.net/", Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" }, timeout: 15e3, maxRedirects: 5 })).data.match(/eval\(function\(p,a,c,k,e,[dr]\)\{[\s\S]+?\}\('([\s\S]+?)',(\d+),(\d+),'([\s\S]+?)'\.split\('\|'\)/);
      if (r) {
        let n = r[1], i = parseInt(r[2]), s = r[4].split("|"), a = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", c = (p) => {
          let d = 0;
          for (let m = 0; m < p.length; m++)
            d = d * i + a.indexOf(p[m]);
          return d;
        }, l = n.replace(/\b(\w+)\b/g, (p) => {
          let d = c(p);
          return s[d] && s[d] !== "" ? s[d] : p;
        }).match(/["']([^"']+\.m3u8[^"']*)['"]/i);
        if (l)
          return console.log(`[Vimeos] URL encontrada: ${l[1].substring(0, 80)}...`), { url: l[1], headers: { "User-Agent": ne, Referer: "https://vimeos.net/" } };
      }
      return console.log("[Vimeos] No se encontr\xF3 URL"), null;
    } catch (o) {
      return console.log(`[Vimeos] Error: ${o.message}`), null;
    }
  });
}
var we = "439c478a771f35c05022f9feabcca01c", Se = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36", O = { "User-Agent": Se, Accept: "application/json" }, $e = { "goodstream.one": Q, "hlswish.com": E, "streamwish.com": E, "streamwish.to": E, "strwish.com": E, "voe.sx": ee, "filemoon.sx": C, "filemoon.to": C, "vimeos.net": ae }, xe = [], ie = (e) => e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim(), le = (e, o) => {
  let t = ie(e), r = ie(o);
  if (t === r)
    return 1;
  if (t.includes(r) || r.includes(t))
    return 0.8;
  let n = new Set(t.split(/\s+/)), i = new Set(r.split(/\s+/));
  return [...n].filter((a) => i.has(a)).length / Math.max(n.size, i.size);
}, Ae = (e) => {
  let o = e.toString().toLowerCase(), t = o.match(/(\d+)/);
  return t ? `${t[1]}p` : o.includes("4k") || o.includes("uhd") ? "2160p" : o.includes("full") || o.includes("fhd") ? "1080p" : o.includes("hd") ? "720p" : "SD";
}, Re = (e) => e.includes("goodstream") ? "GoodStream" : e.includes("hlswish") || e.includes("streamwish") ? "StreamWish" : e.includes("voe.sx") ? "VOE" : e.includes("filemoon") ? "Filemoon" : e.includes("vimeos.net") ? "Vimeos" : "Online", Ee = (e) => {
  try {
    let o = new URL(e).hostname.replace("www.", "");
    if (xe.some((t) => e.includes(t)))
      return null;
    for (let [t, r] of Object.entries($e))
      if (e.includes(t))
        return r;
  } catch (o) {
  }
  return null;
};
function Le(e, o) {
  return g(this, null, function* () {
    let t = [{ lang: "es-MX", name: "Latino" }, { lang: "en-US", name: "Ingl\xE9s" }, { lang: "es-ES", name: "Espa\xF1a" }];
    for (let { lang: r, name: n } of t)
      try {
        let i = `https://api.themoviedb.org/3/${o}/${e}?api_key=${we}&language=${r}`, { data: s } = yield L.default.get(i, { timeout: 5e3, headers: O }), a = o === "movie" ? s.title : s.name, c = o === "movie" ? s.original_title : s.original_name;
        if (r === "es-MX" && /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(a))
          continue;
        return console.log(`[LaMovie] TMDB (${n}): "${a}"${a !== c ? ` | Original: "${c}"` : ""}`), { title: a, originalTitle: c, year: (s.release_date || s.first_air_date || "").substring(0, 4) };
      } catch (i) {
        console.log(`[LaMovie] Error TMDB ${n}: ${i.message}`);
      }
    return null;
  });
}
function Me(e, o) {
  let t = /* @__PURE__ */ new Set(), { title: r, originalTitle: n, year: i } = e;
  if (r) {
    t.add(r.trim());
    let s = r.replace(/[¿¡:;"']/g, "").replace(/\s+/g, " ").trim();
    s !== r && t.add(s);
  }
  return n && n !== r && !/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(n) && t.add(n.trim()), o === "movie" && i && [...t].forEach((a) => {
    a.includes(i) || (t.add(`${a} ${i}`), t.add(`${a} (${i})`));
  }), [...t].forEach((s) => {
    let a = s.replace(/^(el|la|los|las|the|a|an)\s+/i, "").trim();
    a.length > 2 && t.add(a);
  }), [...t].slice(0, 8);
}
function We(e, o) {
  return g(this, null, function* () {
    var n;
    let r = `https://la.movie/wp-api/v1/search?filter=%7B%7D&postType=any&q=${encodeURIComponent(e.trim())}&postsPerPage=10`;
    try {
      let { data: i } = yield L.default.get(r, { timeout: 8e3, headers: O });
      return (n = i == null ? void 0 : i.data) != null && n.posts ? i.data.posts.filter((s) => o === "movie" ? s.type === "movie" || s.type === "movies" : s.type === "tvshow" || s.type === "tvshows" || s.type === "series") : [];
    } catch (i) {
      return [];
    }
  });
}
function be(e, o) {
  if (e.length === 0)
    return null;
  if (e.length === 1)
    return e[0];
  let t = e.map((r) => {
    let n = le(r.title || "", o.title) * 2;
    return o.originalTitle && (n += le(r.title || "", o.originalTitle)), o.year && r.year && r.year.toString() === o.year && (n += 0.5), { result: r, score: n };
  });
  return t.sort((r, n) => n.score - r.score), t[0].result;
}
function ke(e, o, t) {
  return g(this, null, function* () {
    var n;
    let r = `https://la.movie/wp-api/v1/single/episodes/list?_id=${e}&season=${o}&page=1&postsPerPage=50`;
    try {
      let { data: i } = yield L.default.get(r, { timeout: 12e3, headers: O });
      if (!((n = i == null ? void 0 : i.data) != null && n.posts))
        return null;
      let s = i.data.posts.find((a) => a.season_number == o && a.episode_number == t);
      return (s == null ? void 0 : s._id) || null;
    } catch (i) {
      return console.log(`[LaMovie] Error episodios: ${i.message}`), null;
    }
  });
}
function Ue(e) {
  return g(this, null, function* () {
    try {
      let o = Ee(e.url);
      if (!o)
        return console.log(`[LaMovie] Sin resolver para: ${e.url}`), null;
      let t = yield o(e.url);
      if (!t || !t.url)
        return null;
      let r = Ae(e.quality || "1080p"), n = Re(e.url);
      return { name: "LaMovie", title: `${r} \xB7 ${n}`, url: t.url, quality: r, headers: t.headers || {} };
    } catch (o) {
      return console.log(`[LaMovie] Error procesando embed: ${o.message}`), null;
    }
  });
}
function Fe(e, o, t, r) {
  return g(this, null, function* () {
    var i;
    if (!e || !o)
      return [];
    let n = Date.now();
    console.log(`[LaMovie] Buscando: TMDB ${e} (${o})${t ? ` S${t}E${r}` : ""}`);
    try {
      let s = yield Le(e, o);
      if (!s)
        return [];
      let a = Me(s, o);
      console.log(`[LaMovie] ${a.length} variantes generadas`);
      let c = a.slice(0, 5).map((f) => g(this, null, function* () {
        let W = yield We(f, o);
        return { variant: f, results: W };
      })), u = yield Promise.allSettled(c), l = null;
      for (let f of u)
        if (f.status === "fulfilled" && f.value.results.length > 0) {
          l = f.value;
          break;
        }
      if (!l)
        return console.log("[LaMovie] Sin resultados"), [];
      console.log(`[LaMovie] \u2713 "${l.variant}" (${l.results.length} resultados)`);
      let p = be(l.results, s);
      if (!p)
        return [];
      let d = p._id;
      if (o === "tv" && t && r) {
        let f = yield ke(d, t, r);
        if (!f)
          return console.log(`[LaMovie] Episodio S${t}E${r} no encontrado`), [];
        d = f;
      }
      let { data: m } = yield L.default.get(`https://la.movie/wp-api/v1/player?postId=${d}&demo=0`, { timeout: 6e3, headers: O });
      if (!((i = m == null ? void 0 : m.data) != null && i.embeds))
        return console.log("[LaMovie] No hay embeds disponibles"), [];
      let w = m.data.embeds.map((f) => Ue(f)), $ = (yield Promise.allSettled(w)).filter((f) => f.status === "fulfilled" && f.value).map((f) => f.value), D = ((Date.now() - n) / 1e3).toFixed(2);
      return console.log(`[LaMovie] \u2713 ${$.length} streams en ${D}s`), $;
    } catch (s) {
      return console.log(`[LaMovie] Error: ${s.message}`), [];
    }
  });
}
