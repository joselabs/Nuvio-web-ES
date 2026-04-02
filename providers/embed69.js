/**
 * embed69 - Built from src/embed69/
 * Generated: 2026-04-02T02:11:06.346Z
 */
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve2, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve2(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/resolvers/hlswish.js
var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function unpackEval(payload, radix, symtab) {
  const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const unbase = (str) => {
    let result = 0;
    for (let i = 0; i < str.length; i++) {
      const pos = chars.indexOf(str[i]);
      if (pos === -1)
        return NaN;
      result = result * radix + pos;
    }
    return result;
  };
  return payload.replace(/\b([0-9a-zA-Z]+)\b/g, (match) => {
    const idx = unbase(match);
    if (isNaN(idx) || idx >= symtab.length)
      return match;
    return symtab[idx] && symtab[idx] !== "" ? symtab[idx] : match;
  });
}
function extractHlsUrl(unpacked, embedHost) {
  const objMatch = unpacked.match(/\{[^{}]*"hls[234]"\s*:\s*"([^"]+)"[^{}]*\}/);
  if (objMatch) {
    try {
      const normalized = objMatch[0].replace(/(\w+)\s*:/g, '"$1":');
      const obj = JSON.parse(normalized);
      const url = obj.hls4 || obj.hls3 || obj.hls2;
      if (url)
        return url.startsWith("/") ? embedHost + url : url;
    } catch (e) {
      const urlMatch = objMatch[0].match(/"hls[234]"\s*:\s*"([^"]+\.m3u8[^"]*)"/);
      if (urlMatch) {
        const url = urlMatch[1];
        return url.startsWith("/") ? embedHost + url : url;
      }
    }
  }
  const m3u8Match = unpacked.match(/["']([^"']{30,}\.m3u8[^"']*)['"]/i);
  if (m3u8Match) {
    const url = m3u8Match[1];
    return url.startsWith("/") ? embedHost + url : url;
  }
  return null;
}
var DOMAIN_MAP = {
  "hglink.to": "vibuxer.com"
};
function resolve(embedUrl) {
  return __async(this, null, function* () {
    var _a;
    try {
      let fetchUrl = embedUrl;
      for (const [from, to] of Object.entries(DOMAIN_MAP)) {
        if (fetchUrl.includes(from)) {
          fetchUrl = fetchUrl.replace(from, to);
          break;
        }
      }
      const embedHost = ((_a = fetchUrl.match(/^(https?:\/\/[^/]+)/)) == null ? void 0 : _a[1]) || "https://hlswish.com";
      console.log(`[HLSWish] Resolviendo: ${embedUrl}`);
      if (fetchUrl !== embedUrl)
        console.log(`[HLSWish] \u2192 Mapped to: ${fetchUrl}`);
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 15e3);
      const resp = yield fetch(fetchUrl, {
        headers: {
          "User-Agent": UA,
          "Referer": "https://embed69.org/",
          "Origin": "https://embed69.org",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "es-MX,es;q=0.9"
        },
        signal: controller.signal
      });
      clearTimeout(timer);
      const data = yield resp.text();
      const fileMatch = data.match(/file\s*:\s*["']([^"']+)["']/i);
      if (fileMatch) {
        let url = fileMatch[1];
        if (url.startsWith("/"))
          url = embedHost + url;
        if (url.includes("vibuxer.com/stream/")) {
          console.log(`[HLSWish] Siguiendo redirect: ${url.substring(0, 80)}...`);
          try {
            const r2 = yield fetch(url, {
              headers: { "User-Agent": UA, "Referer": embedHost + "/" }
            });
            if (r2.url && r2.url.includes(".m3u8"))
              url = r2.url;
          } catch (e) {
          }
        }
        console.log(`[HLSWish] URL encontrada: ${url.substring(0, 80)}...`);
        return { url, quality: "1080p", headers: { "User-Agent": UA, "Referer": embedHost + "/" } };
      }
      const packMatch = data.match(
        /eval\(function\(p,a,c,k,e,[a-z]\)\{[^}]+\}\s*\('([\s\S]+?)',\s*(\d+),\s*(\d+),\s*'([\s\S]+?)'\.split\('\|'\)/
      );
      if (packMatch) {
        const unpacked = unpackEval(packMatch[1], parseInt(packMatch[2]), packMatch[4].split("|"));
        const url = extractHlsUrl(unpacked, embedHost);
        if (url) {
          console.log(`[HLSWish] URL encontrada: ${url.substring(0, 80)}...`);
          return { url, quality: "1080p", headers: { "User-Agent": UA, "Referer": embedHost + "/" } };
        }
      }
      const rawM3u8 = data.match(/https?:\/\/[^"'\s\\]+\.m3u8[^"'\s\\]*/i);
      if (rawM3u8) {
        console.log(`[HLSWish] URL encontrada: ${rawM3u8[0].substring(0, 80)}...`);
        return { url: rawM3u8[0], quality: "1080p", headers: { "User-Agent": UA, "Referer": embedHost + "/" } };
      }
      console.log("[HLSWish] No se encontr\xF3 URL");
      return null;
    } catch (err) {
      console.log(`[HLSWish] Error: ${err.message}`);
      return null;
    }
  });
}

// src/embed69/index.js
var TMDB_API_KEY = "439c478a771f35c05022f9feabcca01c";
var UA2 = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
var BASE_URL = "https://embed69.org";
var RESOLVER_TIMEOUT = 4e3;
var RESOLVER_MAP = {
  //'voe.sx':           resolveVoe,
  //'hglink.to':        resolveHlswish,    // streamwish
  "streamwish.com": resolve,
  "streamwish.to": resolve,
  "wishembed.online": resolve,
  "filelions.com": resolve
  //'bysedikamoum.com':  resolveFilemoon,  // filemoon alias
  //'filemoon.sx':      resolveFilemoon,
  //'filemoon.to':      resolveFilemoon,
  //'moonembed.pro':    resolveFilemoon,
  //'dintezuvio.com':   resolveVidhide,   // vidhide
  //'vidhide.com':      resolveVidhide,
};
var SERVER_LABELS = {
  //'voe':        'VOE',
  "streamwish": "StreamWish"
  //'filemoon':   'Filemoon',
  //'vidhide':    'VidHide',
};
var LANG_PRIORITY = ["LAT", "ESP", "SUB"];
var BASE64_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
function b64decode(value) {
  if (!value)
    return "";
  let input = String(value).replace(/=+$/, "");
  let output = "";
  let bc = 0, bs, buffer, idx = 0;
  while (buffer = input.charAt(idx++)) {
    buffer = BASE64_CHARS.indexOf(buffer);
    if (~buffer) {
      bs = bc % 4 ? bs * 64 + buffer : buffer;
      if (bc++ % 4)
        output += String.fromCharCode(255 & bs >> (-2 * bc & 6));
    }
  }
  return output;
}
function decodeJwtPayload(token) {
  try {
    const parts = token.split(".");
    if (parts.length < 2)
      return null;
    let payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    payload += "=".repeat((4 - payload.length % 4) % 4);
    return JSON.parse(b64decode(payload));
  } catch (e) {
    return null;
  }
}
function parseDataLink(html) {
  try {
    const match = html.match(/let\s+dataLink\s*=\s*(\[.+\]);/);
    if (!match)
      return null;
    return JSON.parse(match[1]);
  } catch (e) {
    return null;
  }
}
function getResolver(url) {
  if (!url)
    return null;
  for (const [pattern, resolver] of Object.entries(RESOLVER_MAP)) {
    if (url.includes(pattern))
      return resolver;
  }
  return null;
}
function getImdbId(tmdbId, mediaType) {
  return __async(this, null, function* () {
    const endpoint = mediaType === "movie" ? `https://api.themoviedb.org/3/movie/${tmdbId}/external_ids?api_key=${TMDB_API_KEY}` : `https://api.themoviedb.org/3/tv/${tmdbId}/external_ids?api_key=${TMDB_API_KEY}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5e3);
    const res = yield fetch(endpoint, {
      headers: { "User-Agent": UA2 },
      signal: controller.signal
    });
    clearTimeout(timer);
    const data = yield res.json();
    return data.imdb_id || null;
  });
}
function buildEmbedUrl(imdbId, mediaType, season, episode) {
  if (mediaType === "movie")
    return `${BASE_URL}/f/${imdbId}`;
  const e = String(episode).padStart(2, "0");
  return `${BASE_URL}/f/${imdbId}-${parseInt(season)}x${e}`;
}
function getStreams(tmdbId, mediaType, season, episode) {
  return __async(this, null, function* () {
    if (!tmdbId || !mediaType)
      return [];
    const startTime = Date.now();
    console.log(`[Embed69] Buscando: TMDB ${tmdbId} (${mediaType})${season ? ` S${season}E${episode}` : ""}`);
    try {
      let getEmbeds = function(section) {
        const lang = section.video_language || "LAT";
        const embeds = [];
        for (const embed of section.sortedEmbeds || []) {
          if (embed.servername === "download")
            continue;
          const payload = decodeJwtPayload(embed.link);
          if (!payload || !payload.link)
            continue;
          const resolver = getResolver(payload.link);
          if (!resolver) {
            console.log(`[Embed69] Sin resolver para ${embed.servername}: ${payload.link.substring(0, 60)}`);
            continue;
          }
          embeds.push({ url: payload.link, resolver, lang, servername: embed.servername });
        }
        return embeds;
      };
      const imdbId = yield getImdbId(tmdbId, mediaType);
      if (!imdbId) {
        console.log("[Embed69] No se encontr\xF3 IMDB ID");
        return [];
      }
      console.log(`[Embed69] IMDB ID: ${imdbId}`);
      const embedUrl = buildEmbedUrl(imdbId, mediaType, season, episode);
      console.log(`[Embed69] Fetching: ${embedUrl}`);
      const controller2 = new AbortController();
      const timer2 = setTimeout(() => controller2.abort(), 8e3);
      const resp = yield fetch(embedUrl, {
        headers: {
          "User-Agent": UA2,
          "Referer": "https://sololatino.net/",
          "Accept": "text/html,application/xhtml+xml"
        },
        signal: controller2.signal
      });
      clearTimeout(timer2);
      const html = yield resp.text();
      const dataLink = parseDataLink(html);
      if (!dataLink || dataLink.length === 0) {
        console.log("[Embed69] No se encontr\xF3 dataLink en el HTML");
        return [];
      }
      console.log(`[Embed69] ${dataLink.length} idiomas disponibles: ${dataLink.map((d) => d.video_language).join(", ")}`);
      const byLang = {};
      for (const section of dataLink) {
        byLang[section.video_language] = section;
      }
      function resolveBatch(embeds) {
        return __async(this, null, function* () {
          const results = yield Promise.allSettled(
            embeds.map(
              ({ url, resolver, lang, servername }) => Promise.race([
                resolver(url).then((r) => r ? __spreadProps(__spreadValues({}, r), { lang, servername }) : null),
                new Promise(
                  (_, reject) => setTimeout(() => reject(new Error("timeout")), RESOLVER_TIMEOUT)
                )
              ])
            )
          );
          return results.filter((r) => {
            var _a;
            return r.status === "fulfilled" && ((_a = r.value) == null ? void 0 : _a.url);
          }).map((r) => r.value);
        });
      }
      const streams = [];
      for (const lang of LANG_PRIORITY) {
        const section = byLang[lang];
        if (!section)
          continue;
        const embeds = getEmbeds(section);
        if (embeds.length === 0)
          continue;
        console.log(`[Embed69] Resolviendo ${embeds.length} embeds (${lang})...`);
        const resolved = yield resolveBatch(embeds);
        if (resolved.length > 0) {
          for (const { url, quality, lang: l, servername, headers } of resolved) {
            const langLabel = l === "LAT" ? "Latino" : l === "ESP" ? "Espa\xF1ol" : "Subtitulado";
            const serverLabel = SERVER_LABELS[servername] || servername;
            streams.push({
              name: "Embed69",
              title: `${quality || "1080p"} \xB7 ${langLabel} \xB7 ${serverLabel}`,
              url,
              quality: quality || "1080p",
              headers: headers || {}
            });
          }
          console.log(`[Embed69] \u2713 Streams encontrados en ${lang}, omitiendo idiomas de menor prioridad`);
          break;
        } else {
          console.log(`[Embed69] Sin streams en ${lang}, intentando siguiente idioma...`);
        }
      }
      const elapsed = ((Date.now() - startTime) / 1e3).toFixed(2);
      console.log(`[Embed69] \u2713 ${streams.length} streams en ${elapsed}s`);
      return streams;
    } catch (e) {
      console.log(`[Embed69] Error: ${e.message}`);
      return [];
    }
  });
}
module.exports = { getStreams };
