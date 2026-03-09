var ae = Object.create;
var R = Object.defineProperty;
var ie = Object.getOwnPropertyDescriptor;
var le = Object.getOwnPropertyNames, G = Object.getOwnPropertySymbols, ce = Object.getPrototypeOf, q = Object.prototype.hasOwnProperty, ue = Object.prototype.propertyIsEnumerable;
var H = (e, o, t) => o in e ? R(e, o, { enumerable: true, configurable: true, writable: true, value: t }) : e[o] = t, I = (e, o) => {
  for (var t in o || (o = {}))
    q.call(o, t) && H(e, t, o[t]);
  if (G)
    for (var t of G(o))
      ue.call(o, t) && H(e, t, o[t]);
  return e;
};
var de = (e, o) => {
  for (var t in o)
    R(e, t, { get: o[t], enumerable: true });
}, K = (e, o, t, r) => {
  if (o && typeof o == "object" || typeof o == "function")
    for (let n of le(o))
      !q.call(e, n) && n !== t && R(e, n, { get: () => o[n], enumerable: !(r = ie(o, n)) || r.enumerable });
  return e;
};
var w = (e, o, t) => (t = e != null ? ae(ce(e)) : {}, K(o || !e || !e.__esModule ? R(t, "default", { value: e, enumerable: true }) : t, e)), fe = (e) => K(R({}, "__esModule", { value: true }), e);
var h = (e, o, t) => new Promise((r, n) => {
  var i = (u) => {
    try {
      a(t.next(u));
    } catch (c) {
      n(c);
    }
  }, s = (u) => {
    try {
      a(t.throw(u));
    } catch (c) {
      n(c);
    }
  }, a = (u) => u.done ? r(u.value) : Promise.resolve(u.value).then(i, s);
  a((t = t.apply(e, o)).next());
});
var Fe = {};
de(Fe, { getStreams: () => be });
module.exports = fe(Fe);
var L = w(require("axios"));
var X = w(require("axios"));
var J = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function Q(e) {
  return h(this, null, function* () {
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
var Z = w(require("axios"));
var pe = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function Y(e) {
  try {
    return typeof atob != "undefined" ? atob(e) : Buffer.from(e, "base64").toString("utf8");
  } catch (o) {
    return null;
  }
}
function ge(e, o) {
  try {
    let r = o.replace(/^\[|\]$/g, "").split("','").map((c) => c.replace(/^'+|'+$/g, "")).map((c) => c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), n = "";
    for (let c of e) {
      let l = c.charCodeAt(0);
      l > 64 && l < 91 ? l = (l - 52) % 26 + 65 : l > 96 && l < 123 && (l = (l - 84) % 26 + 97), n += String.fromCharCode(l);
    }
    for (let c of r)
      n = n.replace(new RegExp(c, "g"), "_");
    n = n.split("_").join("");
    let i = Y(n);
    if (!i)
      return null;
    let s = "";
    for (let c = 0; c < i.length; c++)
      s += String.fromCharCode((i.charCodeAt(c) - 3 + 256) % 256);
    let a = s.split("").reverse().join(""), u = Y(a);
    return u ? JSON.parse(u) : null;
  } catch (t) {
    return console.log("[VOE] voeDecode error:", t.message), null;
  }
}
function _(t) {
  return h(this, arguments, function* (e, o = {}) {
    return Z.default.get(e, { timeout: 15e3, maxRedirects: 5, headers: I({ "User-Agent": pe, Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" }, o), validateStatus: (r) => r < 500 });
  });
}
function ee(e) {
  return h(this, null, function* () {
    try {
      console.log(`[VOE] Resolviendo: ${e}`);
      let o = yield _(e, { Referer: e }), t = String(o && o.data ? o.data : "");
      if (/permanentToken/i.test(t)) {
        let u = t.match(/window\.location\.href\s*=\s*'([^']+)'/i);
        if (u) {
          console.log(`[VOE] Permanent token redirect -> ${u[1]}`);
          let c = yield _(u[1], { Referer: e });
          c && c.data && (t = String(c.data));
        }
      }
      let r = t.match(/json">\s*\[\s*['"]([^'"]+)['"]\s*\]\s*<\/script>\s*<script[^>]*src=['"]([^'"]+)['"]/i);
      if (r) {
        let u = r[1], c = r[2].startsWith("http") ? r[2] : new URL(r[2], e).href;
        console.log(`[VOE] Found encoded array + loader: ${c}`);
        let l = yield _(c, { Referer: e }), p = l && l.data ? String(l.data) : "", f = p.match(/(\[(?:'[^']{1,10}'[\s,]*){4,12}\])/i) || p.match(/(\[(?:"[^"]{1,10}"[,\s]*){4,12}\])/i);
        if (f) {
          let g = ge(u, f[1]);
          if (g && (g.source || g.direct_access_url)) {
            let v = g.source || g.direct_access_url;
            return console.log(`[VOE] URL encontrada: ${v.substring(0, 80)}...`), { url: v, headers: { Referer: e } };
          }
        }
      }
      let n = /(?:mp4|hls)'\s*:\s*'([^']+)'/gi, i = /(?:mp4|hls)"\s*:\s*"([^"]+)"/gi, s = [], a;
      for (; (a = n.exec(t)) !== null; )
        s.push(a);
      for (; (a = i.exec(t)) !== null; )
        s.push(a);
      for (let u of s) {
        let c = u[1];
        if (!c)
          continue;
        let l = c;
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
var N = w(require("axios")), y = w(require("crypto-js"));
var T = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function U(e) {
  e = e.replace(/-/g, "+").replace(/_/g, "/");
  let o = (4 - e.length % 4) % 4;
  return y.default.enc.Base64.parse(e + "=".repeat(o));
}
function S(e) {
  let o = e.words, t = e.sigBytes, r = new Uint8Array(t);
  for (let n = 0; n < t; n++)
    r[n] = o[n >>> 2] >>> 24 - n % 4 * 8 & 255;
  return r;
}
function C(e) {
  let o = [];
  for (let t = 0; t < e.length; t += 4)
    o.push((e[t] || 0) << 24 | (e[t + 1] || 0) << 16 | (e[t + 2] || 0) << 8 | (e[t + 3] || 0));
  return y.default.lib.WordArray.create(o, e.length);
}
function te(e) {
  let o = new Uint8Array(e);
  for (let t = 15; t >= 12 && (o[t]++, o[t] === 0); t--)
    ;
  return o;
}
function he(e, o, t) {
  try {
    let r = new Uint8Array(16);
    r.set(o, 0), r[15] = 1;
    let n = te(r), i = C(e), s = new Uint8Array(t.length);
    for (let a = 0; a < t.length; a += 16) {
      let u = Math.min(16, t.length - a), c = C(n), l = y.default.AES.encrypt(c, i, { mode: y.default.mode.ECB, padding: y.default.pad.NoPadding }), p = S(l.ciphertext);
      for (let f = 0; f < u; f++)
        s[a + f] = t[a + f] ^ p[f];
      n = te(n);
    }
    return s;
  } catch (r) {
    return console.log("[Filemoon] AES-GCM error:", r.message), null;
  }
}
function D(e) {
  return h(this, null, function* () {
    var o, t, r;
    console.log(`[Filemoon] Resolviendo: ${e}`);
    try {
      let n = e.match(/\/(?:e|d)\/([a-z0-9]{12})/i);
      if (!n)
        return null;
      let i = n[1], { data: s } = yield N.default.get(`https://filemooon.link/api/videos/${i}/embed/playback`, { timeout: 7e3, headers: { "User-Agent": T, Referer: e } });
      if (s.error)
        return console.log(`[Filemoon] API error: ${s.error}`), null;
      let a = s.playback;
      if ((a == null ? void 0 : a.algorithm) !== "AES-256-GCM" || ((o = a.key_parts) == null ? void 0 : o.length) !== 2)
        return console.log("[Filemoon] Formato de cifrado no soportado"), null;
      let u = S(U(a.key_parts[0])), c = S(U(a.key_parts[1])), l = new Uint8Array(u.length + c.length);
      l.set(u, 0), l.set(c, u.length);
      let p;
      if (l.length === 32)
        p = l;
      else {
        let m = C(l);
        p = S(y.default.SHA256(m));
      }
      let f = S(U(a.iv)), g = S(U(a.payload));
      if (g.length < 16)
        return null;
      let v = g.slice(0, -16), M = he(p, f, v);
      if (!M)
        return null;
      let $ = "";
      for (let m = 0; m < M.length; m++)
        $ += String.fromCharCode(M[m]);
      let d = (r = (t = JSON.parse($).sources) == null ? void 0 : t[0]) == null ? void 0 : r.url;
      if (!d)
        return null;
      console.log(`[Filemoon] URL encontrada: ${d.substring(0, 80)}...`);
      let W = d;
      if (d.includes("master"))
        try {
          let b = (yield N.default.get(d, { timeout: 3e3, headers: { "User-Agent": T, Referer: e }, responseType: "text" })).data.split(`
`), F = 0, V = d;
          for (let A = 0; A < b.length; A++) {
            let z = b[A].trim();
            if (z.startsWith("#EXT-X-STREAM-INF")) {
              let P = z.match(/RESOLUTION=\d+x(\d+)/), j = P ? parseInt(P[1]) : 0;
              for (let k = A + 1; k < A + 3 && k < b.length; k++) {
                let x = b[k].trim();
                if (x && !x.startsWith("#") && j > F) {
                  F = j, V = x.startsWith("http") ? x : new URL(x, d).toString();
                  break;
                }
              }
            }
          }
          F > 0 && (W = V, console.log(`[Filemoon] Mejor calidad: ${F}p`));
        } catch (m) {
          console.log(`[Filemoon] No se pudo parsear master: ${m.message}`);
        }
      return { url: W, headers: { "User-Agent": T, Referer: e, Origin: "https://filemoon.sx" } };
    } catch (n) {
      return console.log(`[Filemoon] Error: ${n.message}`), null;
    }
  });
}
var re = w(require("axios"));
var oe = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function E(e) {
  return h(this, null, function* () {
    try {
      let t = (yield re.default.get(e, { headers: { "User-Agent": oe, Referer: "https://hlswish.com/", Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" }, timeout: 15e3, maxRedirects: 5 })).data;
      console.log(`[HLSWish] Resolviendo: ${e}`);
      let r = t.match(/eval\(function\(p,a,c,k,e,[dr]\)\{[\s\S]+?\}\('([\s\S]+?)',(\d+),(\d+),'([\s\S]+?)'\.split\('\|'\)/);
      if (r) {
        let n = r[1], i = parseInt(r[2]), s = r[4].split("|"), a = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", u = (p) => {
          let f = 0;
          for (let g = 0; g < p.length; g++)
            f = f * i + a.indexOf(p[g]);
          return f;
        }, l = n.replace(/\b(\w+)\b/g, (p) => {
          let f = u(p);
          return s[f] && s[f] !== "" ? s[f] : p;
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
var me = "439c478a771f35c05022f9feabcca01c", ye = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36", O = { "User-Agent": ye, Accept: "application/json" }, ve = { "goodstream.one": Q, "hlswish.com": E, "streamwish.com": E, "streamwish.to": E, "strwish.com": E, "voe.sx": ee, "filemoon.sx": D, "filemoon.to": D }, we = ["vimeos.net"], ne = (e) => e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim(), se = (e, o) => {
  let t = ne(e), r = ne(o);
  if (t === r)
    return 1;
  if (t.includes(r) || r.includes(t))
    return 0.8;
  let n = new Set(t.split(/\s+/)), i = new Set(r.split(/\s+/));
  return [...n].filter((a) => i.has(a)).length / Math.max(n.size, i.size);
}, Se = (e) => {
  let o = e.toString().toLowerCase(), t = o.match(/(\d+)/);
  return t ? `${t[1]}p` : o.includes("4k") || o.includes("uhd") ? "2160p" : o.includes("full") || o.includes("fhd") ? "1080p" : o.includes("hd") ? "720p" : "SD";
}, $e = (e) => e.includes("goodstream") ? "GoodStream" : e.includes("hlswish") || e.includes("streamwish") ? "StreamWish" : e.includes("voe.sx") ? "VOE" : e.includes("filemoon") ? "Filemoon" : "Online", Ae = (e) => {
  try {
    let o = new URL(e).hostname.replace("www.", "");
    if (we.some((t) => e.includes(t)))
      return null;
    for (let [t, r] of Object.entries(ve))
      if (e.includes(t))
        return r;
  } catch (o) {
  }
  return null;
};
function xe(e, o) {
  return h(this, null, function* () {
    let t = [{ lang: "es-MX", name: "Latino" }, { lang: "en-US", name: "Ingl\xE9s" }, { lang: "es-ES", name: "Espa\xF1a" }];
    for (let { lang: r, name: n } of t)
      try {
        let i = `https://api.themoviedb.org/3/${o}/${e}?api_key=${me}&language=${r}`, { data: s } = yield L.default.get(i, { timeout: 5e3, headers: O }), a = o === "movie" ? s.title : s.name, u = o === "movie" ? s.original_title : s.original_name;
        if (r === "es-MX" && /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(a))
          continue;
        return console.log(`[LaMovie] TMDB (${n}): "${a}"${a !== u ? ` | Original: "${u}"` : ""}`), { title: a, originalTitle: u, year: (s.release_date || s.first_air_date || "").substring(0, 4) };
      } catch (i) {
        console.log(`[LaMovie] Error TMDB ${n}: ${i.message}`);
      }
    return null;
  });
}
function Re(e, o) {
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
function Ee(e, o) {
  return h(this, null, function* () {
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
function Le(e, o) {
  if (e.length === 0)
    return null;
  if (e.length === 1)
    return e[0];
  let t = e.map((r) => {
    let n = se(r.title || "", o.title) * 2;
    return o.originalTitle && (n += se(r.title || "", o.originalTitle)), o.year && r.year && r.year.toString() === o.year && (n += 0.5), { result: r, score: n };
  });
  return t.sort((r, n) => n.score - r.score), t[0].result;
}
function Me(e, o, t) {
  return h(this, null, function* () {
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
function We(e) {
  return h(this, null, function* () {
    try {
      let o = Ae(e.url);
      if (!o)
        return console.log(`[LaMovie] Sin resolver para: ${e.url}`), null;
      let t = yield o(e.url);
      if (!t || !t.url)
        return null;
      let r = Se(e.quality || "1080p"), n = $e(e.url);
      return { name: "LaMovie", title: `${r} \xB7 ${n}`, url: t.url, quality: r, headers: t.headers || {} };
    } catch (o) {
      return console.log(`[LaMovie] Error procesando embed: ${o.message}`), null;
    }
  });
}
function be(e, o, t, r) {
  return h(this, null, function* () {
    var i;
    if (!e || !o)
      return [];
    let n = Date.now();
    console.log(`[LaMovie] Buscando: TMDB ${e} (${o})${t ? ` S${t}E${r}` : ""}`);
    try {
      let s = yield xe(e, o);
      if (!s)
        return [];
      let a = Re(s, o);
      console.log(`[LaMovie] ${a.length} variantes generadas`);
      let u = a.slice(0, 5).map((d) => h(this, null, function* () {
        let W = yield Ee(d, o);
        return { variant: d, results: W };
      })), c = yield Promise.allSettled(u), l = null;
      for (let d of c)
        if (d.status === "fulfilled" && d.value.results.length > 0) {
          l = d.value;
          break;
        }
      if (!l)
        return console.log("[LaMovie] Sin resultados"), [];
      console.log(`[LaMovie] \u2713 "${l.variant}" (${l.results.length} resultados)`);
      let p = Le(l.results, s);
      if (!p)
        return [];
      let f = p._id;
      if (o === "tv" && t && r) {
        let d = yield Me(f, t, r);
        if (!d)
          return console.log(`[LaMovie] Episodio S${t}E${r} no encontrado`), [];
        f = d;
      }
      let { data: g } = yield L.default.get(`https://la.movie/wp-api/v1/player?postId=${f}&demo=0`, { timeout: 6e3, headers: O });
      if (!((i = g == null ? void 0 : g.data) != null && i.embeds))
        return console.log("[LaMovie] No hay embeds disponibles"), [];
      let v = g.data.embeds.map((d) => We(d)), $ = (yield Promise.allSettled(v)).filter((d) => d.status === "fulfilled" && d.value).map((d) => d.value), B = ((Date.now() - n) / 1e3).toFixed(2);
      return console.log(`[LaMovie] \u2713 ${$.length} streams en ${B}s`), $;
    } catch (s) {
      return console.log(`[LaMovie] Error: ${s.message}`), [];
    }
  });
}
