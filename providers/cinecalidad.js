var ye = Object.create;
var E = Object.defineProperty;
var we = Object.getOwnPropertyDescriptor;
var xe = Object.getOwnPropertyNames, X = Object.getOwnPropertySymbols, Se = Object.getPrototypeOf, Q = Object.prototype.hasOwnProperty, Ae = Object.prototype.propertyIsEnumerable;
var J = (e, t, n) => t in e ? E(e, t, { enumerable: true, configurable: true, writable: true, value: n }) : e[t] = n, N = (e, t) => {
  for (var n in t || (t = {}))
    Q.call(t, n) && J(e, n, t[n]);
  if (X)
    for (var n of X(t))
      Ae.call(t, n) && J(e, n, t[n]);
  return e;
};
var Re = (e, t) => {
  for (var n in t)
    E(e, n, { get: t[n], enumerable: true });
}, Y = (e, t, n, o) => {
  if (t && typeof t == "object" || typeof t == "function")
    for (let r of xe(t))
      !Q.call(e, r) && r !== n && E(e, r, { get: () => t[r], enumerable: !(o = we(t, r)) || o.enumerable });
  return e;
};
var S = (e, t, n) => (n = e != null ? ye(Se(e)) : {}, Y(t || !e || !e.__esModule ? E(n, "default", { value: e, enumerable: true }) : n, e)), ve = (e) => Y(E({}, "__esModule", { value: true }), e);
var p = (e, t, n) => new Promise((o, r) => {
  var d = (l) => {
    try {
      a(n.next(l));
    } catch (c) {
      r(c);
    }
  }, i = (l) => {
    try {
      a(n.throw(l));
    } catch (c) {
      r(c);
    }
  }, a = (l) => l.done ? o(l.value) : Promise.resolve(l.value).then(d, i);
  a((n = n.apply(e, t)).next());
});
var ze = {};
Re(ze, { getStreams: () => _e });
module.exports = ve(ze);
var k = S(require("axios"));
var te = S(require("axios"));
var Z = S(require("axios"));
var $e = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function _(e, t) {
  return e >= 3840 || t >= 2160 ? "4K" : e >= 1920 || t >= 1080 ? "1080p" : e >= 1280 || t >= 720 ? "720p" : e >= 854 || t >= 480 ? "480p" : "360p";
}
function w(n) {
  return p(this, arguments, function* (e, t = {}) {
    try {
      let { data: o } = yield Z.default.get(e, { timeout: 3e3, headers: N({ "User-Agent": $e }, t), responseType: "text" });
      if (!o.includes("#EXT-X-STREAM-INF")) {
        let a = e.match(/[_-](\d{3,4})p/);
        return a ? `${a[1]}p` : "1080p";
      }
      let r = 0, d = 0, i = o.split(`
`);
      for (let a of i) {
        let l = a.match(/RESOLUTION=(\d+)x(\d+)/);
        if (l) {
          let c = parseInt(l[1]), s = parseInt(l[2]);
          s > d && (d = s, r = c);
        }
      }
      return d > 0 ? _(r, d) : "1080p";
    } catch (o) {
      return "1080p";
    }
  });
}
var ee = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function ne(e) {
  return p(this, null, function* () {
    try {
      console.log(`[GoodStream] Resolviendo: ${e}`);
      let n = (yield te.default.get(e, { headers: { "User-Agent": ee, Referer: "https://goodstream.one", Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" }, timeout: 15e3, maxRedirects: 5 })).data.match(/file:\s*"([^"]+)"/);
      if (!n)
        return console.log('[GoodStream] No se encontr\xF3 patr\xF3n file:"..."'), null;
      let o = n[1], r = { Referer: e, Origin: "https://goodstream.one", "User-Agent": ee }, d = yield w(o, r);
      return console.log(`[GoodStream] URL encontrada (${d}): ${o.substring(0, 80)}...`), { url: o, quality: d, headers: r };
    } catch (t) {
      return console.log(`[GoodStream] Error: ${t.message}`), null;
    }
  });
}
var re = S(require("axios"));
var be = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function oe(e) {
  try {
    return typeof atob != "undefined" ? atob(e) : Buffer.from(e, "base64").toString("utf8");
  } catch (t) {
    return null;
  }
}
function Ce(e, t) {
  try {
    let o = t.replace(/^\[|\]$/g, "").split("','").map((c) => c.replace(/^'+|'+$/g, "")).map((c) => c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), r = "";
    for (let c of e) {
      let s = c.charCodeAt(0);
      s > 64 && s < 91 ? s = (s - 52) % 26 + 65 : s > 96 && s < 123 && (s = (s - 84) % 26 + 97), r += String.fromCharCode(s);
    }
    for (let c of o)
      r = r.replace(new RegExp(c, "g"), "_");
    r = r.split("_").join("");
    let d = oe(r);
    if (!d)
      return null;
    let i = "";
    for (let c = 0; c < d.length; c++)
      i += String.fromCharCode((d.charCodeAt(c) - 3 + 256) % 256);
    let a = i.split("").reverse().join(""), l = oe(a);
    return l ? JSON.parse(l) : null;
  } catch (n) {
    return console.log("[VOE] voeDecode error:", n.message), null;
  }
}
function z(n) {
  return p(this, arguments, function* (e, t = {}) {
    return re.default.get(e, { timeout: 15e3, maxRedirects: 5, headers: N({ "User-Agent": be, Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" }, t), validateStatus: (o) => o < 500 });
  });
}
function se(e) {
  return p(this, null, function* () {
    try {
      console.log(`[VOE] Resolviendo: ${e}`);
      let t = yield z(e, { Referer: e }), n = String(t && t.data ? t.data : "");
      if (/permanentToken/i.test(n)) {
        let l = n.match(/window\.location\.href\s*=\s*'([^']+)'/i);
        if (l) {
          console.log(`[VOE] Permanent token redirect -> ${l[1]}`);
          let c = yield z(l[1], { Referer: e });
          c && c.data && (n = String(c.data));
        }
      }
      let o = n.match(/json">\s*\[\s*['"]([^'"]+)['"]\s*\]\s*<\/script>\s*<script[^>]*src=['"]([^'"]+)['"]/i);
      if (o) {
        let l = o[1], c = o[2].startsWith("http") ? o[2] : new URL(o[2], e).href;
        console.log(`[VOE] Found encoded array + loader: ${c}`);
        let s = yield z(c, { Referer: e }), u = s && s.data ? String(s.data) : "", f = u.match(/(\[(?:'[^']{1,10}'[\s,]*){4,12}\])/i) || u.match(/(\[(?:"[^"]{1,10}"[,\s]*){4,12}\])/i);
        if (f) {
          let m = Ce(l, f[1]);
          if (m && (m.source || m.direct_access_url)) {
            let g = m.source || m.direct_access_url, h = yield w(g, { Referer: e });
            return console.log(`[VOE] URL encontrada: ${g.substring(0, 80)}...`), { url: g, quality: h, headers: { Referer: e } };
          }
        }
      }
      let r = /(?:mp4|hls)'\s*:\s*'([^']+)'/gi, d = /(?:mp4|hls)"\s*:\s*"([^"]+)"/gi, i = [], a;
      for (; (a = r.exec(n)) !== null; )
        i.push(a);
      for (; (a = d.exec(n)) !== null; )
        i.push(a);
      for (let l of i) {
        let c = l[1];
        if (!c)
          continue;
        let s = c;
        if (s.startsWith("aHR0"))
          try {
            s = atob(s);
          } catch (u) {
          }
        return console.log(`[VOE] URL encontrada (fallback): ${s.substring(0, 80)}...`), { url: s, quality: yield w(s, { Referer: e }), headers: { Referer: e } };
      }
      return console.log("[VOE] No se encontr\xF3 URL"), null;
    } catch (t) {
      return console.log(`[VOE] Error: ${t.message}`), null;
    }
  });
}
var B = S(require("axios")), A = S(require("crypto-js"));
var H = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function q(e) {
  e = e.replace(/-/g, "+").replace(/_/g, "/");
  let t = (4 - e.length % 4) % 4;
  return A.default.enc.Base64.parse(e + "=".repeat(t));
}
function v(e) {
  let t = e.words, n = e.sigBytes, o = new Uint8Array(n);
  for (let r = 0; r < n; r++)
    o[r] = t[r >>> 2] >>> 24 - r % 4 * 8 & 255;
  return o;
}
function D(e) {
  let t = [];
  for (let n = 0; n < e.length; n += 4)
    t.push((e[n] || 0) << 24 | (e[n + 1] || 0) << 16 | (e[n + 2] || 0) << 8 | (e[n + 3] || 0));
  return A.default.lib.WordArray.create(t, e.length);
}
function ae(e) {
  let t = new Uint8Array(e);
  for (let n = 15; n >= 12 && (t[n]++, t[n] === 0); n--)
    ;
  return t;
}
function Ee(e, t, n) {
  try {
    let o = new Uint8Array(16);
    o.set(t, 0), o[15] = 1;
    let r = ae(o), d = D(e), i = new Uint8Array(n.length);
    for (let a = 0; a < n.length; a += 16) {
      let l = Math.min(16, n.length - a), c = D(r), s = A.default.AES.encrypt(c, d, { mode: A.default.mode.ECB, padding: A.default.pad.NoPadding }), u = v(s.ciphertext);
      for (let f = 0; f < l; f++)
        i[a + f] = n[a + f] ^ u[f];
      r = ae(r);
    }
    return i;
  } catch (o) {
    return console.log("[Filemoon] AES-GCM error:", o.message), null;
  }
}
function K(e) {
  return p(this, null, function* () {
    var t, n, o;
    console.log(`[Filemoon] Resolviendo: ${e}`);
    try {
      let r = e.match(/\/(?:e|d)\/([a-z0-9]{12})/i);
      if (!r)
        return null;
      let d = r[1], { data: i } = yield B.default.get(`https://filemooon.link/api/videos/${d}/embed/playback`, { timeout: 7e3, headers: { "User-Agent": H, Referer: e } });
      if (i.error)
        return console.log(`[Filemoon] API error: ${i.error}`), null;
      let a = i.playback;
      if ((a == null ? void 0 : a.algorithm) !== "AES-256-GCM" || ((t = a.key_parts) == null ? void 0 : t.length) !== 2)
        return console.log("[Filemoon] Formato de cifrado no soportado"), null;
      let l = v(q(a.key_parts[0])), c = v(q(a.key_parts[1])), s = new Uint8Array(l.length + c.length);
      s.set(l, 0), s.set(c, l.length);
      let u;
      if (s.length === 32)
        u = s;
      else {
        let x = D(s);
        u = v(A.default.SHA256(x));
      }
      let f = v(q(a.iv)), m = v(q(a.payload));
      if (m.length < 16)
        return null;
      let g = m.slice(0, -16), h = Ee(u, f, g);
      if (!h)
        return null;
      let $ = "";
      for (let x = 0; x < h.length; x++)
        $ += String.fromCharCode(h[x]);
      let y = (o = (n = JSON.parse($).sources) == null ? void 0 : n[0]) == null ? void 0 : o.url;
      if (!y)
        return null;
      console.log(`[Filemoon] URL encontrada: ${y.substring(0, 80)}...`);
      let M = y, R = "1080p";
      if (y.includes("master"))
        try {
          let U = (yield B.default.get(y, { timeout: 3e3, headers: { "User-Agent": H, Referer: e }, responseType: "text" })).data.split(`
`), L = 0, G = 0, I = y;
          for (let b = 0; b < U.length; b++) {
            let j = U[b].trim();
            if (j.startsWith("#EXT-X-STREAM-INF")) {
              let F = j.match(/RESOLUTION=(\d+)x(\d+)/), ge = F ? parseInt(F[1]) : 0, P = F ? parseInt(F[2]) : 0;
              for (let O = b + 1; O < b + 3 && O < U.length; O++) {
                let C = U[O].trim();
                if (C && !C.startsWith("#") && P > L) {
                  L = P, G = ge, I = C.startsWith("http") ? C : new URL(C, y).toString();
                  break;
                }
              }
            }
          }
          L > 0 && (M = I, R = _(G, L), console.log(`[Filemoon] Mejor calidad: ${R}`));
        } catch (x) {
          console.log(`[Filemoon] No se pudo parsear master: ${x.message}`);
        }
      return { url: M, quality: R, headers: { "User-Agent": H, Referer: e, Origin: "https://filemoon.sx" } };
    } catch (r) {
      return console.log(`[Filemoon] Error: ${r.message}`), null;
    }
  });
}
var le = S(require("axios"));
var ie = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function W(e) {
  return p(this, null, function* () {
    try {
      let n = (yield le.default.get(e, { headers: { "User-Agent": ie, Referer: "https://hlswish.com/", Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" }, timeout: 15e3, maxRedirects: 5 })).data;
      console.log(`[HLSWish] Resolviendo: ${e}`);
      let o = n.match(/eval\(function\(p,a,c,k,e,[dr]\)\{[\s\S]+?\}\('([\s\S]+?)',(\d+),(\d+),'([\s\S]+?)'\.split\('\|'\)/);
      if (o) {
        let r = o[1], d = parseInt(o[2]), i = o[4].split("|"), a = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", l = (u) => {
          let f = 0;
          for (let m = 0; m < u.length; m++)
            f = f * d + a.indexOf(u[m]);
          return f;
        }, s = r.replace(/\b(\w+)\b/g, (u) => {
          let f = l(u);
          return i[f] && i[f] !== "" ? i[f] : u;
        }).match(/["']([^"']+\.m3u8[^"']*)['"]/i);
        if (s) {
          let u = s[1];
          u.startsWith("/") && (u = "https://hlswish.com" + u);
          let f = { "User-Agent": ie, Referer: "https://hlswish.com/" }, m = yield w(u, f);
          return console.log(`[HLSWish] URL encontrada (${m}): ${u.substring(0, 80)}...`), { url: u, quality: m, headers: f };
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
function de(e) {
  return p(this, null, function* () {
    try {
      console.log(`[Vimeos] Resolviendo: ${e}`);
      let o = (yield ue.default.get(e, { headers: { "User-Agent": ce, Referer: "https://vimeos.net/", Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" }, timeout: 15e3, maxRedirects: 5 })).data.match(/eval\(function\(p,a,c,k,e,[dr]\)\{[\s\S]+?\}\('([\s\S]+?)',(\d+),(\d+),'([\s\S]+?)'\.split\('\|'\)/);
      if (o) {
        let r = o[1], d = parseInt(o[2]), i = o[4].split("|"), a = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", l = (u) => {
          let f = 0;
          for (let m = 0; m < u.length; m++)
            f = f * d + a.indexOf(u[m]);
          return f;
        }, s = r.replace(/\b(\w+)\b/g, (u) => {
          let f = l(u);
          return i[f] && i[f] !== "" ? i[f] : u;
        }).match(/["']([^"']+\.m3u8[^"']*)['"]/i);
        if (s) {
          let u = s[1], f = { "User-Agent": ce, Referer: "https://vimeos.net/" }, m = yield w(u, f);
          return console.log(`[Vimeos] URL encontrada: ${u.substring(0, 80)}...`), { url: u, quality: m, headers: f };
        }
      }
      return console.log("[Vimeos] No se encontr\xF3 URL"), null;
    } catch (t) {
      return console.log(`[Vimeos] Error: ${t.message}`), null;
    }
  });
}
var We = "439c478a771f35c05022f9feabcca01c", he = "https://cinecalidad.vg", ke = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36", V = { "User-Agent": ke, Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", "Accept-Language": "es-MX,es;q=0.9", Referer: he + "/" }, fe = { "goodstream.one": ne, "hlswish.com": W, "streamwish.com": W, "streamwish.to": W, "strwish.com": W, "voe.sx": se, "filemoon.sx": K, "filemoon.to": K, "vimeos.net": de }, me = (e) => e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim(), pe = (e, t) => {
  let n = me(e), o = me(t);
  if (n === o)
    return 1;
  if (n.includes(o) || o.includes(n))
    return 0.8;
  let r = new Set(n.split(/\s+/)), d = new Set(o.split(/\s+/));
  return [...r].filter((a) => d.has(a)).length / Math.max(r.size, d.size);
}, Te = (e) => e.includes("goodstream") ? "GoodStream" : e.includes("hlswish") || e.includes("streamwish") || e.includes("strwish") ? "StreamWish" : e.includes("voe.sx") ? "VOE" : e.includes("filemoon") ? "Filemoon" : e.includes("vimeos") ? "Vimeos" : "Online", Me = (e) => {
  if (!e || !e.startsWith("http"))
    return null;
  for (let t in fe)
    if (e.includes(t))
      return fe[t];
  return null;
};
function Ue(e) {
  try {
    return typeof atob != "undefined" ? atob(e) : Buffer.from(e, "base64").toString("utf8");
  } catch (t) {
    return null;
  }
}
function Le(e, t) {
  return p(this, null, function* () {
    let n = (a, l) => p(this, null, function* () {
      let c = `https://api.themoviedb.org/3/${t}/${e}?api_key=${We}&language=${a}`, { data: s } = yield k.default.get(c, { timeout: 5e3, headers: V }), u = t === "movie" ? s.title : s.name, f = t === "movie" ? s.original_title : s.original_name;
      if (!u)
        throw new Error("No title");
      if (a === "es-MX" && /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(u))
        throw new Error("Japanese title");
      return { title: u, originalTitle: f, year: (s.release_date || s.first_air_date || "").substring(0, 4) };
    }), [o, r, d] = yield Promise.allSettled([n("es-MX", "Latino"), n("en-US", "Ingl\xE9s"), n("es-ES", "Espa\xF1a")]), i = o.status === "fulfilled" ? o.value : r.status === "fulfilled" ? r.value : d.status === "fulfilled" ? d.value : null;
    return i && console.log(`[CineCalidad] TMDB: "${i.title}"${i.title !== i.originalTitle ? ` | Original: "${i.originalTitle}"` : ""}`), i;
  });
}
function Fe(e) {
  let t = /* @__PURE__ */ new Set(), { title: n, originalTitle: o, year: r } = e;
  if (n) {
    t.add(n.trim());
    let d = n.replace(/[¿¡:;"']/g, "").replace(/\s+/g, " ").trim();
    d !== n && t.add(d);
  }
  return o && o !== n && !/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(o) && t.add(o.trim()), [...t].slice(0, 4);
}
function Oe(e) {
  return p(this, null, function* () {
    let t = `${he}/?s=${encodeURIComponent(e)}`;
    try {
      let { data: n } = yield k.default.get(t, { timeout: 8e3, headers: V }), o = [], r = 0;
      for (; ; ) {
        let i = n.indexOf("<article", r);
        if (i === -1)
          break;
        let a = n.indexOf("</article>", i);
        if (a === -1)
          break;
        o.push(n.substring(i, a + 10)), r = a + 10;
      }
      let d = [];
      for (let i of o) {
        if (i.includes("/serie/"))
          continue;
        let a = i.match(/class="absolute top-0[^"]*"[^>]+href="([^"]+)"/);
        if (!a)
          continue;
        let l = a[1], c = i.match(/<span class="sr-only">([^<]+)<\/span>/);
        if (!c)
          continue;
        let s = c[1].trim(), u = i.match(/>\s*(\d{4})\s*<\/div>/), f = u ? u[1] : "";
        d.push({ url: l, title: s, year: f });
      }
      return d;
    } catch (n) {
      return console.log(`[CineCalidad] Error b\xFAsqueda "${e}": ${n.message}`), [];
    }
  });
}
function Ne(e, t) {
  if (e.length === 0)
    return null;
  if (e.length === 1)
    return e[0];
  let n = e.map((o) => {
    let r = pe(o.title, t.title) * 2;
    return t.originalTitle && (r += pe(o.title, t.originalTitle)), t.year && o.year && o.year === t.year && (r += 0.5), { result: o, score: r };
  });
  return n.sort((o, r) => r.score - o.score), n[0].result;
}
function qe(e) {
  return p(this, null, function* () {
    try {
      let { data: t } = yield k.default.get(e, { timeout: 8e3, headers: V }), n = [], o = /class="[^"]*inline-block[^"]*"[^>]+data-url="([^"]+)"/g, r;
      for (; (r = o.exec(t)) !== null; )
        n.push(r[1]);
      let d = /data-src="([A-Za-z0-9+/=]{20,})"/g;
      for (; (r = d.exec(t)) !== null; )
        n.push(r[1]);
      let i = [...new Set(n.map((l) => Ue(l)).filter((l) => l && l.startsWith("http")))];
      console.log(`[CineCalidad] ${i.length} URLs intermedias \xFAnicas`);
      let a = /* @__PURE__ */ new Set();
      return yield Promise.allSettled(i.map((l) => p(this, null, function* () {
        try {
          let { data: c } = yield k.default.get(l, { timeout: 3e3, headers: V, maxRedirects: 3 }), s = "", u = c.match(/id="btn_enlace"[^>]*>[\s\S]*?href="([^"]+)"/);
          if (u && (s = u[1]), !s) {
            let f = c.match(/<iframe[^>]+src="([^"]+)"/);
            f && (s = f[1]);
          }
          !s && l.includes("/e/") && (s = l), s && s.startsWith("http") && a.add(s);
        } catch (c) {
        }
      }))), [...a];
    } catch (t) {
      return console.log(`[CineCalidad] Error obteniendo embeds: ${t.message}`), [];
    }
  });
}
function Ve(e) {
  return p(this, null, function* () {
    try {
      let t = Me(e);
      if (!t)
        return console.log(`[CineCalidad] Sin resolver para: ${e.substring(0, 60)}`), null;
      let n = Te(e), o = yield t(e);
      return !o || !o.url ? null : { name: "CineCalidad", title: `${o.quality || "1080p"} \xB7 ${n}`, url: o.url, quality: o.quality || "1080p", headers: o.headers || {} };
    } catch (t) {
      return null;
    }
  });
}
function _e(e, t, n, o) {
  return p(this, null, function* () {
    if (!e || !t)
      return [];
    let r = Date.now();
    if (console.log(`[CineCalidad] Buscando: TMDB ${e} (${t})${n ? ` S${n}E${o}` : ""}`), t === "tv")
      return console.log("[CineCalidad] Series no soportadas a\xFAn"), [];
    try {
      let d = yield Le(e, t);
      if (!d)
        return [];
      let i = Fe(d);
      console.log(`[CineCalidad] ${i.length} variantes: ${i.join(", ")}`);
      let a = null;
      for (let m of i) {
        let g = yield Oe(m);
        if (g.length > 0) {
          let h = Ne(g, d);
          if (h) {
            a = h, console.log(`[CineCalidad] \u2713 "${m}" \u2192 "${h.title}" (${h.url})`);
            break;
          }
        }
      }
      if (!a)
        return console.log("[CineCalidad] Sin resultados"), [];
      let l = yield qe(a.url);
      if (l.length === 0)
        return console.log("[CineCalidad] No se encontraron embeds"), [];
      console.log(`[CineCalidad] Resolviendo ${l.length} embeds...`);
      let c = 5e3, s = [...new Set(l)], u = yield new Promise((m) => {
        let g = [], h = 0, $ = s.length, T = () => m(g.filter(Boolean)), y = setTimeout(T, c);
        s.forEach((M) => {
          Ve(M).then((R) => {
            R && g.push(R), h++, h === $ && (clearTimeout(y), T());
          }).catch(() => {
            h++, h === $ && (clearTimeout(y), T());
          });
        });
      }), f = ((Date.now() - r) / 1e3).toFixed(2);
      return console.log(`[CineCalidad] \u2713 ${u.length} streams en ${f}s`), u;
    } catch (d) {
      return console.log(`[CineCalidad] Error: ${d.message}`), [];
    }
  });
}
