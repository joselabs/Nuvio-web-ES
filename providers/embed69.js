var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
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
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve3, reject) => {
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
    var step = (x) => x.done ? resolve3(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
var embed69_exports = {};
__export(embed69_exports, {
  getStreams: () => getStreams
});
module.exports = __toCommonJS(embed69_exports);
var import_crypto_js = __toESM(require("crypto-js"));
function normalizeResolution(width, height) {
  if (width >= 3840 || height >= 2160)
    return "4K";
  if (width >= 1920 || height >= 1080)
    return "1080p";
  if (width >= 1280 || height >= 720)
    return "720p";
  if (width >= 854 || height >= 480)
    return "480p";
  return "360p";
}
var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function b64urlToWordArray(s) {
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  const pad = (4 - s.length % 4) % 4;
  return import_crypto_js.default.enc.Base64.parse(s + "=".repeat(pad));
}
function wordArrayToBytes(wa) {
  const words = wa.words;
  const sigBytes = wa.sigBytes;
  const bytes = new Uint8Array(sigBytes);
  for (let i = 0; i < sigBytes; i++) {
    bytes[i] = words[i >>> 2] >>> 24 - i % 4 * 8 & 255;
  }
  return bytes;
}
function bytesToWordArray(bytes) {
  const words = [];
  for (let i = 0; i < bytes.length; i += 4) {
    words.push(
      (bytes[i] || 0) << 24 | (bytes[i + 1] || 0) << 16 | (bytes[i + 2] || 0) << 8 | (bytes[i + 3] || 0)
    );
  }
  return import_crypto_js.default.lib.WordArray.create(words, bytes.length);
}
function incCounter(block) {
  const b = new Uint8Array(block);
  for (let i = 15; i >= 12; i--) {
    b[i]++;
    if (b[i] !== 0)
      break;
  }
  return b;
}
function aesGcmDecrypt(key32bytes, iv12bytes, ciphertextBytes) {
  try {
    const j0 = new Uint8Array(16);
    j0.set(iv12bytes, 0);
    j0[15] = 1;
    let counter = incCounter(j0);
    const keyWA = bytesToWordArray(key32bytes);
    const result = new Uint8Array(ciphertextBytes.length);
    for (let offset = 0; offset < ciphertextBytes.length; offset += 16) {
      const blockSize = Math.min(16, ciphertextBytes.length - offset);
      const counterWA = bytesToWordArray(counter);
      const encrypted = import_crypto_js.default.AES.encrypt(
        counterWA,
        keyWA,
        { mode: import_crypto_js.default.mode.ECB, padding: import_crypto_js.default.pad.NoPadding }
      );
      const keystreamBytes = wordArrayToBytes(encrypted.ciphertext);
      for (let i = 0; i < blockSize; i++) {
        result[offset + i] = ciphertextBytes[offset + i] ^ keystreamBytes[i];
      }
      counter = incCounter(counter);
    }
    return result;
  } catch (e) {
    console.log("[Filemoon] AES-GCM error:", e.message);
    return null;
  }
}
function resolve(embedUrl) {
  return __async(this, null, function* () {
    var _a, _b, _c;
    console.log(`[Filemoon] Resolviendo: ${embedUrl}`);
    try {
      const match = embedUrl.match(/\/(?:e|d)\/([a-z0-9]{12})/i);
      if (!match)
        return null;
      const id = match[1];
      const playbackJson = yield fetch(
        `https://filemooon.link/api/videos/${id}/embed/playback`,
        { headers: { "User-Agent": UA, "Referer": embedUrl } }
      ).then((r) => r.json());
      if (playbackJson.error) {
        console.log(`[Filemoon] API error: ${playbackJson.error}`);
        return null;
      }
      const pb = playbackJson.playback;
      if ((pb == null ? void 0 : pb.algorithm) !== "AES-256-GCM" || ((_a = pb.key_parts) == null ? void 0 : _a.length) !== 2) {
        console.log("[Filemoon] Formato de cifrado no soportado");
        return null;
      }
      const k1 = wordArrayToBytes(b64urlToWordArray(pb.key_parts[0]));
      const k2 = wordArrayToBytes(b64urlToWordArray(pb.key_parts[1]));
      const rawKey = new Uint8Array(k1.length + k2.length);
      rawKey.set(k1, 0);
      rawKey.set(k2, k1.length);
      let key32;
      if (rawKey.length === 32) {
        key32 = rawKey;
      } else {
        const keyWA = bytesToWordArray(rawKey);
        key32 = wordArrayToBytes(import_crypto_js.default.SHA256(keyWA));
      }
      const ivBytes = wordArrayToBytes(b64urlToWordArray(pb.iv));
      const payloadBytes = wordArrayToBytes(b64urlToWordArray(pb.payload));
      if (payloadBytes.length < 16)
        return null;
      const ciphertext = payloadBytes.slice(0, -16);
      const decrypted = aesGcmDecrypt(key32, ivBytes, ciphertext);
      if (!decrypted)
        return null;
      let decStr = "";
      for (let i = 0; i < decrypted.length; i++) {
        decStr += String.fromCharCode(decrypted[i]);
      }
      const inner = JSON.parse(decStr);
      const m3u8Url = (_c = (_b = inner.sources) == null ? void 0 : _b[0]) == null ? void 0 : _c.url;
      if (!m3u8Url)
        return null;
      console.log(`[Filemoon] URL encontrada: ${m3u8Url.substring(0, 80)}...`);
      let finalUrl = m3u8Url;
      let quality = "1080p";
      if (m3u8Url.includes("master")) {
        try {
          const masterResp = yield fetch(m3u8Url, {
            headers: { "User-Agent": UA, "Referer": embedUrl },
            responseType: "text"
          }).then((r) => r.text());
          const lines = masterResp.split("\n");
          let bestHeight = 0;
          let bestWidth = 0;
          let bestUrl = m3u8Url;
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.startsWith("#EXT-X-STREAM-INF")) {
              const mRes = line.match(/RESOLUTION=(\d+)x(\d+)/);
              const w = mRes ? parseInt(mRes[1]) : 0;
              const h = mRes ? parseInt(mRes[2]) : 0;
              for (let j = i + 1; j < i + 3 && j < lines.length; j++) {
                const urlLine = lines[j].trim();
                if (urlLine && !urlLine.startsWith("#") && h > bestHeight) {
                  bestHeight = h;
                  bestWidth = w;
                  bestUrl = urlLine.startsWith("http") ? urlLine : new URL(urlLine, m3u8Url).toString();
                  break;
                }
              }
            }
          }
          if (bestHeight > 0) {
            finalUrl = bestUrl;
            quality = normalizeResolution(bestWidth, bestHeight);
            console.log(`[Filemoon] Mejor calidad: ${quality}`);
          }
        } catch (e) {
          console.log(`[Filemoon] No se pudo parsear master: ${e.message}`);
        }
      }
      return {
        url: finalUrl,
        quality,
        headers: {
          "User-Agent": UA,
          "Referer": embedUrl,
          "Origin": "https://filemoon.sx"
        }
      };
    } catch (error) {
      console.log(`[Filemoon] Error: ${error.message}`);
      return null;
    }
  });
}
var UA2 = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
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
function resolve2(embedUrl) {
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
      const resp = yield fetch(fetchUrl, {
        headers: {
          "User-Agent": UA2,
          "Referer": "https://embed69.org/",
          "Origin": "https://embed69.org",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "es-MX,es;q=0.9"
        },
        redirect: "follow"
      });
      if (!resp.ok)
        throw new Error(`HTTP ${resp.status}`);
      const data = yield resp.text();
      const fileMatch = data.match(/file\s*:\s*["']([^"']+)["']/i);
      if (fileMatch) {
        let url = fileMatch[1];
        if (url.startsWith("/"))
          url = embedHost + url;
        if (url.includes("vibuxer.com/stream/")) {
          console.log(`[HLSWish] Siguiendo redirect: ${url.substring(0, 80)}...`);
          try {
            const redirectResp = yield fetch(url, {
              headers: { "User-Agent": UA2, "Referer": embedHost + "/" },
              redirect: "follow"
            });
            const finalUrl = redirectResp.url;
            if (finalUrl && finalUrl.includes(".m3u8")) {
              url = finalUrl;
            }
          } catch (e) {
          }
        }
        console.log(`[HLSWish] URL encontrada: ${url.substring(0, 80)}...`);
        return { url, quality: "1080p", headers: { "User-Agent": UA2, "Referer": embedHost + "/" } };
      }
      const packMatch = data.match(
        /eval\(function\(p,a,c,k,e,[a-z]\)\{[^}]+\}\s*\('([\s\S]+?)',\s*(\d+),\s*(\d+),\s*'([\s\S]+?)'\.split\('\|'\)/
      );
      if (packMatch) {
        const unpacked = unpackEval(packMatch[1], parseInt(packMatch[2]), packMatch[4].split("|"));
        const url = extractHlsUrl(unpacked, embedHost);
        if (url) {
          console.log(`[HLSWish] URL encontrada: ${url.substring(0, 80)}...`);
          return { url, quality: "1080p", headers: { "User-Agent": UA2, "Referer": embedHost + "/" } };
        }
      }
      const rawM3u8 = data.match(/https?:\/\/[^"'\s\\]+\.m3u8[^"'\s\\]*/i);
      if (rawM3u8) {
        console.log(`[HLSWish] URL encontrada: ${rawM3u8[0].substring(0, 80)}...`);
        return { url: rawM3u8[0], quality: "1080p", headers: { "User-Agent": UA2, "Referer": embedHost + "/" } };
      }
      console.log("[HLSWish] No se encontr\xF3 URL");
      return null;
    } catch (err) {
      console.log(`[HLSWish] Error: ${err.message}`);
      return null;
    }
  });
}
var TMDB_API_KEY = "439c478a771f35c05022f9feabcca01c";
var UA3 = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
var BASE_URL = "https://embed69.org";
var RESOLVER_MAP = {
  //'voe.sx':           resolveVoe,
  "hglink.to": resolve2,
  // streamwish
  "streamwish.com": resolve2,
  "streamwish.to": resolve2,
  "wishembed.online": resolve2,
  "filelions.com": resolve2,
  "bysedikamoum.com": resolve,
  // filemoon alias
  "filemoon.sx": resolve,
  "filemoon.to": resolve,
  "moonembed.pro": resolve
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
function decodeJwtPayload(token) {
  try {
    const parts = token.split(".");
    if (parts.length < 2)
      return null;
    let payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    payload += "=".repeat((4 - payload.length % 4) % 4);
    return JSON.parse(atob(payload));
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
    const data = yield fetch(endpoint, {
      headers: { "User-Agent": UA3 }
    }).then((r) => r.json());
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
      let resolveBatch2 = function(embeds) {
        return __async(this, null, function* () {
          const results = yield Promise.allSettled(
            embeds.map(
              ({ url, resolver, lang, servername }) => Promise.race([
                resolver(url).then((r) => r ? __spreadProps(__spreadValues({}, r), { lang, servername }) : null)
              ])
            )
          );
          return results.filter((r) => {
            var _a;
            return r.status === "fulfilled" && ((_a = r.value) == null ? void 0 : _a.url);
          }).map((r) => r.value);
        });
      };
      var resolveBatch = resolveBatch2;
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
      const html = yield fetch(embedUrl, {
        headers: {
          "User-Agent": UA3,
          "Referer": "https://sololatino.net/",
          "Accept": "text/html,application/xhtml+xml"
        }
      }).then((r) => r.text());
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
      const streams = [];
      for (const lang of LANG_PRIORITY) {
        const section = byLang[lang];
        if (!section)
          continue;
        const embeds = getEmbeds(section);
        if (embeds.length === 0)
          continue;
        console.log(`[Embed69] Resolviendo ${embeds.length} embeds (${lang})...`);
        const resolved = yield resolveBatch2(embeds);
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

