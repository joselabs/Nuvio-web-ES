var de = Object.create;
var b = Object.defineProperty;
var fe = Object.getOwnPropertyDescriptor;
var he = Object.getOwnPropertyNames, j = Object.getOwnPropertySymbols, me = Object.getPrototypeOf, P = Object.prototype.hasOwnProperty, ge = Object.prototype.propertyIsEnumerable;
var K = (e, t, n) => t in e ? b(e, t, { enumerable: true, configurable: true, writable: true, value: n }) : e[t] = n, I = (e, t) => {
  for (var n in t || (t = {}))
    P.call(t, n) && K(e, n, t[n]);
  if (j)
    for (var n of j(t))
      ge.call(t, n) && K(e, n, t[n]);
  return e;
};
var pe = (e, t) => {
  for (var n in t)
    b(e, n, { get: t[n], enumerable: true });
}, X = (e, t, n, o) => {
  if (t && typeof t == "object" || typeof t == "function")
    for (let r of he(t))
      !P.call(e, r) && r !== n && b(e, r, { get: () => t[r], enumerable: !(o = fe(t, r)) || o.enumerable });
  return e;
};
var x = (e, t, n) => (n = e != null ? de(me(e)) : {}, X(t || !e || !e.__esModule ? b(n, "default", { value: e, enumerable: true }) : n, e)), ye = (e) => X(b({}, "__esModule", { value: true }), e);
var m = (e, t, n) => new Promise((o, r) => {
  var u = (i) => {
    try {
      a(n.next(i));
    } catch (c) {
      r(c);
    }
  }, l = (i) => {
    try {
      a(n.throw(i));
    } catch (c) {
      r(c);
    }
  }, a = (i) => i.done ? o(i.value) : Promise.resolve(i.value).then(u, l);
  a((n = n.apply(e, t)).next());
});
var Fe = {};
pe(Fe, { getStreams: () => Oe });
module.exports = ye(Fe);
var W = x(require("axios"));
var Y = x(require("axios"));
var J = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function Z(e) {
  return m(this, null, function* () {
    try {
      console.log(`[GoodStream] Resolviendo: ${e}`);
      let n = (yield Y.default.get(e, { headers: { "User-Agent": J, Referer: "https://goodstream.one", Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" }, timeout: 15e3, maxRedirects: 5 })).data.match(/file:\s*"([^"]+)"/);
      if (!n)
        return console.log('[GoodStream] No se encontr\xF3 patr\xF3n file:"..."'), null;
      let o = n[1];
      return console.log(`[GoodStream] URL encontrada: ${o.substring(0, 80)}...`), { url: o, headers: { Referer: e, Origin: "https://goodstream.one", "User-Agent": J } };
    } catch (t) {
      return console.log(`[GoodStream] Error: ${t.message}`), null;
    }
  });
}
var ee = x(require("axios"));
var xe = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function Q(e) {
  try {
    return typeof atob != "undefined" ? atob(e) : Buffer.from(e, "base64").toString("utf8");
  } catch (t) {
    return null;
  }
}
function we(e, t) {
  try {
    let o = t.replace(/^\[|\]$/g, "").split("','").map((c) => c.replace(/^'+|'+$/g, "")).map((c) => c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), r = "";
    for (let c of e) {
      let s = c.charCodeAt(0);
      s > 64 && s < 91 ? s = (s - 52) % 26 + 65 : s > 96 && s < 123 && (s = (s - 84) % 26 + 97), r += String.fromCharCode(s);
    }
    for (let c of o)
      r = r.replace(new RegExp(c, "g"), "_");
    r = r.split("_").join("");
    let u = Q(r);
    if (!u)
      return null;
    let l = "";
    for (let c = 0; c < u.length; c++)
      l += String.fromCharCode((u.charCodeAt(c) - 3 + 256) % 256);
    let a = l.split("").reverse().join(""), i = Q(a);
    return i ? JSON.parse(i) : null;
  } catch (n) {
    return console.log("[VOE] voeDecode error:", n.message), null;
  }
}
function L(n) {
  return m(this, arguments, function* (e, t = {}) {
    return ee.default.get(e, { timeout: 15e3, maxRedirects: 5, headers: I({ "User-Agent": xe, Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" }, t), validateStatus: (o) => o < 500 });
  });
}
function te(e) {
  return m(this, null, function* () {
    try {
      console.log(`[VOE] Resolviendo: ${e}`);
      let t = yield L(e, { Referer: e }), n = String(t && t.data ? t.data : "");
      if (/permanentToken/i.test(n)) {
        let i = n.match(/window\.location\.href\s*=\s*'([^']+)'/i);
        if (i) {
          console.log(`[VOE] Permanent token redirect -> ${i[1]}`);
          let c = yield L(i[1], { Referer: e });
          c && c.data && (n = String(c.data));
        }
      }
      let o = n.match(/json">\s*\[\s*['"]([^'"]+)['"]\s*\]\s*<\/script>\s*<script[^>]*src=['"]([^'"]+)['"]/i);
      if (o) {
        let i = o[1], c = o[2].startsWith("http") ? o[2] : new URL(o[2], e).href;
        console.log(`[VOE] Found encoded array + loader: ${c}`);
        let s = yield L(c, { Referer: e }), f = s && s.data ? String(s.data) : "", d = f.match(/(\[(?:'[^']{1,10}'[\s,]*){4,12}\])/i) || f.match(/(\[(?:"[^"]{1,10}"[,\s]*){4,12}\])/i);
        if (d) {
          let h = we(i, d[1]);
          if (h && (h.source || h.direct_access_url)) {
            let g = h.source || h.direct_access_url;
            return console.log(`[VOE] URL encontrada: ${g.substring(0, 80)}...`), { url: g, headers: { Referer: e } };
          }
        }
      }
      let r = /(?:mp4|hls)'\s*:\s*'([^']+)'/gi, u = /(?:mp4|hls)"\s*:\s*"([^"]+)"/gi, l = [], a;
      for (; (a = r.exec(n)) !== null; )
        l.push(a);
      for (; (a = u.exec(n)) !== null; )
        l.push(a);
      for (let i of l) {
        let c = i[1];
        if (!c)
          continue;
        let s = c;
        if (s.startsWith("aHR0"))
          try {
            s = atob(s);
          } catch (f) {
          }
        return console.log(`[VOE] URL encontrada (fallback): ${s.substring(0, 80)}...`), { url: s, headers: { Referer: e } };
      }
      return console.log("[VOE] No se encontr\xF3 URL"), null;
    } catch (t) {
      return console.log(`[VOE] Error: ${t.message}`), null;
    }
  });
}
var N = x(require("axios")), w = x(require("crypto-js"));
var T = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function O(e) {
  e = e.replace(/-/g, "+").replace(/_/g, "/");
  let t = (4 - e.length % 4) % 4;
  return w.default.enc.Base64.parse(e + "=".repeat(t));
}
function A(e) {
  let t = e.words, n = e.sigBytes, o = new Uint8Array(n);
  for (let r = 0; r < n; r++)
    o[r] = t[r >>> 2] >>> 24 - r % 4 * 8 & 255;
  return o;
}
function V(e) {
  let t = [];
  for (let n = 0; n < e.length; n += 4)
    t.push((e[n] || 0) << 24 | (e[n + 1] || 0) << 16 | (e[n + 2] || 0) << 8 | (e[n + 3] || 0));
  return w.default.lib.WordArray.create(t, e.length);
}
function ne(e) {
  let t = new Uint8Array(e);
  for (let n = 15; n >= 12 && (t[n]++, t[n] === 0); n--)
    ;
  return t;
}
function Se(e, t, n) {
  try {
    let o = new Uint8Array(16);
    o.set(t, 0), o[15] = 1;
    let r = ne(o), u = V(e), l = new Uint8Array(n.length);
    for (let a = 0; a < n.length; a += 16) {
      let i = Math.min(16, n.length - a), c = V(r), s = w.default.AES.encrypt(c, u, { mode: w.default.mode.ECB, padding: w.default.pad.NoPadding }), f = A(s.ciphertext);
      for (let d = 0; d < i; d++)
        l[a + d] = n[a + d] ^ f[d];
      r = ne(r);
    }
    return l;
  } catch (o) {
    return console.log("[Filemoon] AES-GCM error:", o.message), null;
  }
}
function _(e) {
  return m(this, null, function* () {
    var t, n, o;
    console.log(`[Filemoon] Resolviendo: ${e}`);
    try {
      let r = e.match(/\/(?:e|d)\/([a-z0-9]{12})/i);
      if (!r)
        return null;
      let u = r[1], { data: l } = yield N.default.get(`https://filemooon.link/api/videos/${u}/embed/playback`, { timeout: 7e3, headers: { "User-Agent": T, Referer: e } });
      if (l.error)
        return console.log(`[Filemoon] API error: ${l.error}`), null;
      let a = l.playback;
      if ((a == null ? void 0 : a.algorithm) !== "AES-256-GCM" || ((t = a.key_parts) == null ? void 0 : t.length) !== 2)
        return console.log("[Filemoon] Formato de cifrado no soportado"), null;
      let i = A(O(a.key_parts[0])), c = A(O(a.key_parts[1])), s = new Uint8Array(i.length + c.length);
      s.set(i, 0), s.set(c, i.length);
      let f;
      if (s.length === 32)
        f = s;
      else {
        let y = V(s);
        f = A(w.default.SHA256(y));
      }
      let d = A(O(a.iv)), h = A(O(a.payload));
      if (h.length < 16)
        return null;
      let g = h.slice(0, -16), S = Se(f, d, g);
      if (!S)
        return null;
      let $ = "";
      for (let y = 0; y < S.length; y++)
        $ += String.fromCharCode(S[y]);
      let p = (o = (n = JSON.parse($).sources) == null ? void 0 : n[0]) == null ? void 0 : o.url;
      if (!p)
        return null;
      console.log(`[Filemoon] URL encontrada: ${p.substring(0, 80)}...`);
      let R = p;
      if (p.includes("master"))
        try {
          let k = (yield N.default.get(p, { timeout: 3e3, headers: { "User-Agent": T, Referer: e }, responseType: "text" })).data.split(`
`), M = 0, z = p;
          for (let v = 0; v < k.length; v++) {
            let q = k[v].trim();
            if (q.startsWith("#EXT-X-STREAM-INF")) {
              let H = q.match(/RESOLUTION=\d+x(\d+)/), G = H ? parseInt(H[1]) : 0;
              for (let U = v + 1; U < v + 3 && U < k.length; U++) {
                let C = k[U].trim();
                if (C && !C.startsWith("#") && G > M) {
                  M = G, z = C.startsWith("http") ? C : new URL(C, p).toString();
                  break;
                }
              }
            }
          }
          M > 0 && (R = z, console.log(`[Filemoon] Mejor calidad: ${M}p`));
        } catch (y) {
          console.log(`[Filemoon] No se pudo parsear master: ${y.message}`);
        }
      return { url: R, headers: { "User-Agent": T, Referer: e, Origin: "https://filemoon.sx" } };
    } catch (r) {
      return console.log(`[Filemoon] Error: ${r.message}`), null;
    }
  });
}
var re = x(require("axios"));
var oe = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function E(e) {
  return m(this, null, function* () {
    try {
      let n = (yield re.default.get(e, { headers: { "User-Agent": oe, Referer: "https://hlswish.com/", Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" }, timeout: 15e3, maxRedirects: 5 })).data;
      console.log(`[HLSWish] Resolviendo: ${e}`);
      let o = n.match(/eval\(function\(p,a,c,k,e,[dr]\)\{[\s\S]+?\}\('([\s\S]+?)',(\d+),(\d+),'([\s\S]+?)'\.split\('\|'\)/);
      if (o) {
        let r = o[1], u = parseInt(o[2]), l = o[4].split("|"), a = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", i = (f) => {
          let d = 0;
          for (let h = 0; h < f.length; h++)
            d = d * u + a.indexOf(f[h]);
          return d;
        }, s = r.replace(/\b(\w+)\b/g, (f) => {
          let d = i(f);
          return l[d] && l[d] !== "" ? l[d] : f;
        }).match(/["']([^"']+\.m3u8[^"']*)['"]/i);
        if (s)
          return console.log(`[HLSWish] URL encontrada: ${s[1].substring(0, 80)}...`), { url: s[1], headers: { "User-Agent": oe, Referer: "https://hlswish.com/" } };
      }
      return console.log("[HLSWish] No se encontr\xF3 URL"), null;
    } catch (t) {
      return console.log(`[HLSWish] Error: ${t.message}`), null;
    }
  });
}
var ae = x(require("axios"));
var se = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function ie(e) {
  return m(this, null, function* () {
    try {
      console.log(`[Vimeos] Resolviendo: ${e}`);
      let o = (yield ae.default.get(e, { headers: { "User-Agent": se, Referer: "https://vimeos.net/", Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" }, timeout: 15e3, maxRedirects: 5 })).data.match(/eval\(function\(p,a,c,k,e,[dr]\)\{[\s\S]+?\}\('([\s\S]+?)',(\d+),(\d+),'([\s\S]+?)'\.split\('\|'\)/);
      if (o) {
        let r = o[1], u = parseInt(o[2]), l = o[4].split("|"), a = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", i = (f) => {
          let d = 0;
          for (let h = 0; h < f.length; h++)
            d = d * u + a.indexOf(f[h]);
          return d;
        }, s = r.replace(/\b(\w+)\b/g, (f) => {
          let d = i(f);
          return l[d] && l[d] !== "" ? l[d] : f;
        }).match(/["']([^"']+\.m3u8[^"']*)['"]/i);
        if (s)
          return console.log(`[Vimeos] URL encontrada: ${s[1].substring(0, 80)}...`), { url: s[1], headers: { "User-Agent": se, Referer: "https://vimeos.net/" } };
      }
      return console.log("[Vimeos] No se encontr\xF3 URL"), null;
    } catch (t) {
      return console.log(`[Vimeos] Error: ${t.message}`), null;
    }
  });
}
var $e = "439c478a771f35c05022f9feabcca01c", B = "https://cinecalidad.vg", Ae = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36", D = { "User-Agent": Ae, Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", "Accept-Language": "es-MX,es;q=0.9", Referer: B + "/" }, le = { "goodstream.one": Z, "hlswish.com": E, "streamwish.com": E, "streamwish.to": E, "strwish.com": E, "voe.sx": te, "filemoon.sx": _, "filemoon.to": _, "vimeos.net": ie }, ce = (e) => e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim(), ue = (e, t) => {
  let n = ce(e), o = ce(t);
  if (n === o)
    return 1;
  if (n.includes(o) || o.includes(n))
    return 0.8;
  let r = new Set(n.split(/\s+/)), u = new Set(o.split(/\s+/));
  return [...r].filter((a) => u.has(a)).length / Math.max(r.size, u.size);
}, Re = (e) => e.includes("goodstream") ? "GoodStream" : e.includes("hlswish") || e.includes("streamwish") || e.includes("strwish") ? "StreamWish" : e.includes("voe.sx") ? "VOE" : e.includes("filemoon") ? "Filemoon" : e.includes("vimeos") ? "Vimeos" : "Online", ve = (e) => {
  if (!e || !e.startsWith("http"))
    return null;
  for (let t in le)
    if (e.includes(t))
      return le[t];
  return null;
};
function Ce(e) {
  try {
    return typeof atob != "undefined" ? atob(e) : Buffer.from(e, "base64").toString("utf8");
  } catch (t) {
    return null;
  }
}
function be(e, t) {
  return m(this, null, function* () {
    let n = [{ lang: "es-MX", name: "Latino" }, { lang: "es-ES", name: "Espa\xF1a" }, { lang: "en-US", name: "Ingl\xE9s" }];
    for (let { lang: o, name: r } of n)
      try {
        let u = `https://api.themoviedb.org/3/${t}/${e}?api_key=${$e}&language=${o}`, { data: l } = yield W.default.get(u, { timeout: 5e3 }), a = t === "movie" ? l.title : l.name, i = t === "movie" ? l.original_title : l.original_name;
        if (!a || o === "es-MX" && /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(a))
          continue;
        return console.log(`[CineCalidad] TMDB (${r}): "${a}"${a !== i ? ` | Original: "${i}"` : ""}`), { title: a, originalTitle: i, year: (l.release_date || l.first_air_date || "").substring(0, 4) };
      } catch (u) {
        console.log(`[CineCalidad] Error TMDB ${r}: ${u.message}`);
      }
    return null;
  });
}
function Ee(e) {
  let t = /* @__PURE__ */ new Set(), { title: n, originalTitle: o, year: r } = e;
  if (n) {
    t.add(n.trim());
    let u = n.replace(/[¿¡:;"']/g, "").replace(/\s+/g, " ").trim();
    u !== n && t.add(u);
  }
  return o && o !== n && !/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(o) && t.add(o.trim()), [...t].slice(0, 4);
}
function We(e) {
  return m(this, null, function* () {
    let t = `${B}/?s=${encodeURIComponent(e)}`;
    try {
      let { data: n } = yield W.default.get(t, { timeout: 8e3, headers: D }), o = [], r = 0;
      for (; ; ) {
        let l = n.indexOf("<article", r);
        if (l === -1)
          break;
        let a = n.indexOf("</article>", l);
        if (a === -1)
          break;
        o.push(n.substring(l, a + 10)), r = a + 10;
      }
      let u = [];
      for (let l of o) {
        let a = l.match(/href="([^"]+)"/);
        if (!a)
          continue;
        let i = a[1];
        if (!i.includes(B) && !i.startsWith("/"))
          continue;
        let c = l.match(/(?:alt|title)="([^"]+)"/);
        if (!c)
          continue;
        let s = c[1].trim(), f = s.match(/\((\d{4})\)/), d = f ? f[1] : "";
        s = s.replace(/\s*\(\d{4}\)/, "").trim(), u.push({ url: i, title: s, year: d });
      }
      return u;
    } catch (n) {
      return console.log(`[CineCalidad] Error b\xFAsqueda "${e}": ${n.message}`), [];
    }
  });
}
function ke(e, t) {
  if (e.length === 0)
    return null;
  if (e.length === 1)
    return e[0];
  let n = e.map((o) => {
    let r = ue(o.title, t.title) * 2;
    return t.originalTitle && (r += ue(o.title, t.originalTitle)), t.year && o.year && o.year === t.year && (r += 0.5), { result: o, score: r };
  });
  return n.sort((o, r) => r.score - o.score), n[0].result;
}
function Me(e) {
  return m(this, null, function* () {
    try {
      let { data: t } = yield W.default.get(e, { timeout: 8e3, headers: D }), n = [], o = /class="[^"]*inline-block[^"]*"[^>]+data-url="([^"]+)"/g, r;
      for (; (r = o.exec(t)) !== null; )
        n.push(r[1]);
      let u = /data-src="([A-Za-z0-9+/=]{20,})"/g;
      for (; (r = u.exec(t)) !== null; )
        n.push(r[1]);
      console.log(`[CineCalidad] ${n.length} enlaces encontrados en p\xE1gina`);
      let l = [];
      return yield Promise.allSettled(n.map((a) => m(this, null, function* () {
        try {
          let i = Ce(a);
          if (!i || !i.startsWith("http"))
            return;
          let { data: c } = yield W.default.get(i, { timeout: 6e3, headers: D, maxRedirects: 5 }), s = "", f = c.match(/id="btn_enlace"[^>]*>[\s\S]*?href="([^"]+)"/);
          if (f && (s = f[1]), !s) {
            let d = c.match(/<iframe[^>]+src="([^"]+)"/);
            d && (s = d[1]);
          }
          !s && i.includes("/e/") && (s = i), s && s.startsWith("http") && l.push(s);
        } catch (i) {
        }
      }))), l;
    } catch (t) {
      return console.log(`[CineCalidad] Error obteniendo embeds: ${t.message}`), [];
    }
  });
}
function Ue(e) {
  return m(this, null, function* () {
    try {
      let t = ve(e);
      if (!t)
        return console.log(`[CineCalidad] Sin resolver para: ${e.substring(0, 60)}`), null;
      let n = Re(e);
      console.log(`[${n}] Resolviendo: ${e}`);
      let o = yield t(e);
      return !o || !o.url ? null : { name: "CineCalidad", title: `1080p \xB7 ${n}`, url: o.url, quality: "1080p", headers: o.headers || {} };
    } catch (t) {
      return null;
    }
  });
}
function Oe(e, t, n, o) {
  return m(this, null, function* () {
    if (!e || !t)
      return [];
    let r = Date.now();
    if (console.log(`[CineCalidad] Buscando: TMDB ${e} (${t})${n ? ` S${n}E${o}` : ""}`), t === "tv")
      return console.log("[CineCalidad] Series no soportadas a\xFAn"), [];
    try {
      let u = yield be(e, t);
      if (!u)
        return [];
      let l = Ee(u);
      console.log(`[CineCalidad] ${l.length} variantes: ${l.join(", ")}`);
      let a = null;
      for (let d of l) {
        let h = yield We(d);
        if (h.length > 0) {
          let g = ke(h, u);
          if (g) {
            a = g, console.log(`[CineCalidad] \u2713 "${d}" \u2192 "${g.title}" (${g.url})`);
            break;
          }
        }
      }
      if (!a)
        return console.log("[CineCalidad] Sin resultados"), [];
      let i = yield Me(a.url);
      if (i.length === 0)
        return console.log("[CineCalidad] No se encontraron embeds"), [];
      console.log(`[CineCalidad] Resolviendo ${i.length} embeds...`);
      let c = 5e3, s = yield new Promise((d) => {
        let h = [], g = 0, S = i.length, $ = () => d(h.filter(Boolean)), F = setTimeout($, c);
        i.forEach((p) => {
          Ue(p).then((R) => {
            R && h.push(R), g++, g === S && (clearTimeout(F), $());
          }).catch(() => {
            g++, g === S && (clearTimeout(F), $());
          });
        });
      }), f = ((Date.now() - r) / 1e3).toFixed(2);
      return console.log(`[CineCalidad] \u2713 ${s.length} streams en ${f}s`), s;
    } catch (u) {
      return console.log(`[CineCalidad] Error: ${u.message}`), [];
    }
  });
}
