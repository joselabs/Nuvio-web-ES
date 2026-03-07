var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
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
  return new Promise((resolve5, reject) => {
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
    var step = (x) => x.done ? resolve5(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
var lamovie_exports = {};
__export(lamovie_exports, {
  getStreams: () => getStreams
});
module.exports = __toCommonJS(lamovie_exports);
var import_axios5 = __toESM(require("axios"));
var import_axios = __toESM(require("axios"));
var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function resolve(embedUrl) {
  return __async(this, null, function* () {
    try {
      console.log(`[GoodStream] Resolviendo: ${embedUrl}`);
      const response = yield import_axios.default.get(embedUrl, {
        headers: {
          "User-Agent": UA,
          "Referer": "https://goodstream.one",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
        },
        timeout: 15e3,
        maxRedirects: 5
      });
      const match = response.data.match(/file:\s*"([^"]+)"/);
      if (!match) {
        console.log('[GoodStream] No se encontr\xF3 patr\xF3n file:"..."');
        return null;
      }
      const videoUrl = match[1];
      console.log(`[GoodStream] URL encontrada: ${videoUrl.substring(0, 80)}...`);
      return {
        url: videoUrl,
        headers: {
          "Referer": embedUrl,
          "Origin": "https://goodstream.one",
          "User-Agent": UA
        }
      };
    } catch (err) {
      console.log(`[GoodStream] Error: ${err.message}`);
      return null;
    }
  });
}
var import_axios2 = __toESM(require("axios"));
var UA2 = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function b64toString(str) {
  try {
    if (typeof atob !== "undefined")
      return atob(str);
    return Buffer.from(str, "base64").toString("utf8");
  } catch (e) {
    return null;
  }
}
function voeDecode(ct, luts) {
  try {
    const rawLuts = luts.replace(/^\[|\]$/g, "").split("','").map((s) => s.replace(/^'+|'+$/g, ""));
    const escapedLuts = rawLuts.map((i) => i.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    let txt = "";
    for (let ch of ct) {
      let x = ch.charCodeAt(0);
      if (x > 64 && x < 91)
        x = (x - 52) % 26 + 65;
      else if (x > 96 && x < 123)
        x = (x - 84) % 26 + 97;
      txt += String.fromCharCode(x);
    }
    for (const pat of escapedLuts)
      txt = txt.replace(new RegExp(pat, "g"), "_");
    txt = txt.split("_").join("");
    const decoded1 = b64toString(txt);
    if (!decoded1)
      return null;
    let step4 = "";
    for (let i = 0; i < decoded1.length; i++) {
      step4 += String.fromCharCode((decoded1.charCodeAt(i) - 3 + 256) % 256);
    }
    const revBase64 = step4.split("").reverse().join("");
    const finalStr = b64toString(revBase64);
    if (!finalStr)
      return null;
    return JSON.parse(finalStr);
  } catch (e) {
    console.log("[VOE] voeDecode error:", e.message);
    return null;
  }
}
function fetchUrl(_0) {
  return __async(this, arguments, function* (url, headers = {}) {
    return import_axios2.default.get(url, {
      timeout: 15e3,
      maxRedirects: 5,
      headers: __spreadValues({
        "User-Agent": UA2,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
      }, headers),
      validateStatus: (s) => s < 500
    });
  });
}
function resolve2(embedUrl) {
  return __async(this, null, function* () {
    try {
      console.log(`[VOE] Resolviendo: ${embedUrl}`);
      let pageResp = yield fetchUrl(embedUrl, { Referer: embedUrl });
      let data = String(pageResp && pageResp.data ? pageResp.data : "");
      if (/permanentToken/i.test(data)) {
        const m2 = data.match(/window\.location\.href\s*=\s*'([^']+)'/i);
        if (m2) {
          console.log(`[VOE] Permanent token redirect -> ${m2[1]}`);
          const r2 = yield fetchUrl(m2[1], { Referer: embedUrl });
          if (r2 && r2.data) {
            data = String(r2.data);
          }
        }
      }
      const rMain = data.match(
        /json">\s*\[\s*['"]([^'"]+)['"]\s*\]\s*<\/script>\s*<script[^>]*src=['"]([^'"]+)['"]/i
      );
      if (rMain) {
        const encodedArray = rMain[1];
        const loaderUrl = rMain[2].startsWith("http") ? rMain[2] : new URL(rMain[2], embedUrl).href;
        console.log(`[VOE] Found encoded array + loader: ${loaderUrl}`);
        const jsResp = yield fetchUrl(loaderUrl, { Referer: embedUrl });
        const jsData = jsResp && jsResp.data ? String(jsResp.data) : "";
        const replMatch = jsData.match(/(\[(?:'[^']{1,10}'[\s,]*){4,12}\])/i) || jsData.match(/(\[(?:"[^"]{1,10}"[,\s]*){4,12}\])/i);
        if (replMatch) {
          const decoded = voeDecode(encodedArray, replMatch[1]);
          if (decoded && (decoded.source || decoded.direct_access_url)) {
            const url = decoded.source || decoded.direct_access_url;
            console.log(`[VOE] URL encontrada: ${url.substring(0, 80)}...`);
            return { url, headers: { Referer: embedUrl } };
          }
        }
      }
      const re1 = /(?:mp4|hls)'\s*:\s*'([^']+)'/gi;
      const re2 = /(?:mp4|hls)"\s*:\s*"([^"]+)"/gi;
      const matches = [];
      let m;
      while ((m = re1.exec(data)) !== null)
        matches.push(m);
      while ((m = re2.exec(data)) !== null)
        matches.push(m);
      for (const match of matches) {
        const candidate = match[1];
        if (!candidate)
          continue;
        let url = candidate;
        if (url.startsWith("aHR0")) {
          try {
            url = atob(url);
          } catch (e) {
          }
        }
        console.log(`[VOE] URL encontrada (fallback): ${url.substring(0, 80)}...`);
        return { url, headers: { Referer: embedUrl } };
      }
      console.log("[VOE] No se encontr\xF3 URL");
      return null;
    } catch (err) {
      console.log(`[VOE] Error: ${err.message}`);
      return null;
    }
  });
}
var import_axios3 = __toESM(require("axios"));
var import_crypto_js = __toESM(require("crypto-js"));
var UA3 = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
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
function resolve3(embedUrl) {
  return __async(this, null, function* () {
    var _a, _b, _c;
    console.log(`[Filemoon] Resolviendo: ${embedUrl}`);
    try {
      const match = embedUrl.match(/\/(?:e|d)\/([a-z0-9]{12})/i);
      if (!match)
        return null;
      const id = match[1];
      const { data: playbackJson } = yield import_axios3.default.get(
        `https://filemooon.link/api/videos/${id}/embed/playback`,
        { timeout: 7e3, headers: { "User-Agent": UA3, "Referer": embedUrl } }
      );
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
      if (m3u8Url.includes("master")) {
        try {
          const masterResp = yield import_axios3.default.get(m3u8Url, {
            timeout: 3e3,
            headers: { "User-Agent": UA3, "Referer": embedUrl },
            responseType: "text"
          });
          const lines = masterResp.data.split("\n");
          let bestHeight = 0;
          let bestUrl = m3u8Url;
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.startsWith("#EXT-X-STREAM-INF")) {
              const mRes = line.match(/RESOLUTION=\d+x(\d+)/);
              const height = mRes ? parseInt(mRes[1]) : 0;
              for (let j = i + 1; j < i + 3 && j < lines.length; j++) {
                const urlLine = lines[j].trim();
                if (urlLine && !urlLine.startsWith("#") && height > bestHeight) {
                  bestHeight = height;
                  bestUrl = urlLine.startsWith("http") ? urlLine : new URL(urlLine, m3u8Url).toString();
                  break;
                }
              }
            }
          }
          if (bestHeight > 0) {
            finalUrl = bestUrl;
            console.log(`[Filemoon] Mejor calidad: ${bestHeight}p`);
          }
        } catch (e) {
          console.log(`[Filemoon] No se pudo parsear master: ${e.message}`);
        }
      }
      return {
        url: finalUrl,
        headers: {
          "User-Agent": UA3,
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
var import_axios4 = __toESM(require("axios"));
var UA4 = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function resolve4(embedUrl) {
  return __async(this, null, function* () {
    try {
      const resp = yield import_axios4.default.get(embedUrl, {
        headers: {
          "User-Agent": UA4,
          "Referer": "https://hlswish.com/",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
        },
        timeout: 15e3,
        maxRedirects: 5
      });
      const data = resp.data;
      console.log(`[HLSWish] Resolviendo: ${embedUrl}`);
      const packMatch = data.match(
        /eval\(function\(p,a,c,k,e,[dr]\)\{[\s\S]+?\}\('([\s\S]+?)',(\d+),(\d+),'([\s\S]+?)'\.split\('\|'\)/
      );
      if (packMatch) {
        const payload = packMatch[1];
        const radix = parseInt(packMatch[2]);
        const symtab = packMatch[4].split("|");
        const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const unbase = (str) => {
          let result = 0;
          for (let i = 0; i < str.length; i++) {
            result = result * radix + chars.indexOf(str[i]);
          }
          return result;
        };
        const unpacked = payload.replace(/\b(\w+)\b/g, (match) => {
          const idx = unbase(match);
          return symtab[idx] && symtab[idx] !== "" ? symtab[idx] : match;
        });
        const m3u8Match = unpacked.match(/["']([^"']+\.m3u8[^"']*)['"]/i);
        if (m3u8Match) {
          console.log(`[HLSWish] URL encontrada: ${m3u8Match[1].substring(0, 80)}...`);
          return {
            url: m3u8Match[1],
            headers: {
              "User-Agent": UA4,
              "Referer": "https://hlswish.com/"
            }
          };
        }
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
var UA5 = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
var HEADERS = { "User-Agent": UA5, "Accept": "application/json" };
var RESOLVERS = {
  "goodstream.one": resolve,
  "hlswish.com": resolve4,
  "streamwish.com": resolve4,
  "streamwish.to": resolve4,
  "strwish.com": resolve4,
  "voe.sx": resolve2,
  "filemoon.sx": resolve3,
  "filemoon.to": resolve3
};
var IGNORED_HOSTS = ["vimeos.net"];
var normalizeText = (text) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
var calculateSimilarity = (str1, str2) => {
  const s1 = normalizeText(str1);
  const s2 = normalizeText(str2);
  if (s1 === s2)
    return 1;
  if (s1.includes(s2) || s2.includes(s1))
    return 0.8;
  const words1 = new Set(s1.split(/\s+/));
  const words2 = new Set(s2.split(/\s+/));
  const intersection = [...words1].filter((w) => words2.has(w));
  return intersection.length / Math.max(words1.size, words2.size);
};
var normalizeQuality = (quality) => {
  const str = quality.toString().toLowerCase();
  const match = str.match(/(\d+)/);
  if (match)
    return `${match[1]}p`;
  if (str.includes("4k") || str.includes("uhd"))
    return "2160p";
  if (str.includes("full") || str.includes("fhd"))
    return "1080p";
  if (str.includes("hd"))
    return "720p";
  return "SD";
};
var getServerName = (url) => {
  if (url.includes("goodstream"))
    return "GoodStream";
  if (url.includes("hlswish") || url.includes("streamwish"))
    return "StreamWish";
  if (url.includes("voe.sx"))
    return "VOE";
  if (url.includes("filemoon"))
    return "Filemoon";
  return "Online";
};
var getResolver = (url) => {
  try {
    const host = new URL(url).hostname.replace("www.", "");
    if (IGNORED_HOSTS.some((h) => url.includes(h)))
      return null;
    for (const [pattern, resolver] of Object.entries(RESOLVERS)) {
      if (url.includes(pattern))
        return resolver;
    }
  } catch (e) {
  }
  return null;
};
function getTmdbData(tmdbId, mediaType) {
  return __async(this, null, function* () {
    const attempts = [
      { lang: "es-MX", name: "Latino" },
      { lang: "en-US", name: "Ingl\xE9s" },
      { lang: "es-ES", name: "Espa\xF1a" }
    ];
    for (const { lang, name } of attempts) {
      try {
        const url = `https://api.themoviedb.org/3/${mediaType}/${tmdbId}?api_key=${TMDB_API_KEY}&language=${lang}`;
        const { data } = yield import_axios5.default.get(url, { timeout: 5e3, headers: HEADERS });
        const title = mediaType === "movie" ? data.title : data.name;
        const originalTitle = mediaType === "movie" ? data.original_title : data.original_name;
        if (lang === "es-MX" && /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(title))
          continue;
        console.log(`[LaMovie] TMDB (${name}): "${title}"${title !== originalTitle ? ` | Original: "${originalTitle}"` : ""}`);
        return {
          title,
          originalTitle,
          year: (data.release_date || data.first_air_date || "").substring(0, 4)
        };
      } catch (e) {
        console.log(`[LaMovie] Error TMDB ${name}: ${e.message}`);
      }
    }
    return null;
  });
}
function generateSearchVariants(tmdbInfo, mediaType) {
  const variants = /* @__PURE__ */ new Set();
  const { title, originalTitle, year } = tmdbInfo;
  if (title) {
    variants.add(title.trim());
    const cleaned = title.replace(/[¿¡:;"']/g, "").replace(/\s+/g, " ").trim();
    if (cleaned !== title)
      variants.add(cleaned);
  }
  if (originalTitle && originalTitle !== title && !/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(originalTitle)) {
    variants.add(originalTitle.trim());
  }
  if (mediaType === "movie" && year) {
    const base = [...variants];
    base.forEach((v) => {
      if (!v.includes(year)) {
        variants.add(`${v} ${year}`);
        variants.add(`${v} (${year})`);
      }
    });
  }
  [...variants].forEach((v) => {
    const noArticle = v.replace(/^(el|la|los|las|the|a|an)\s+/i, "").trim();
    if (noArticle.length > 2)
      variants.add(noArticle);
  });
  return [...variants].slice(0, 8);
}
function searchLamovie(query, mediaType) {
  return __async(this, null, function* () {
    var _a;
    const encodedQuery = encodeURIComponent(query.trim());
    const url = `https://la.movie/wp-api/v1/search?filter=%7B%7D&postType=any&q=${encodedQuery}&postsPerPage=10`;
    try {
      const { data } = yield import_axios5.default.get(url, { timeout: 8e3, headers: HEADERS });
      if (!((_a = data == null ? void 0 : data.data) == null ? void 0 : _a.posts))
        return [];
      return data.data.posts.filter((item) => {
        if (mediaType === "movie")
          return item.type === "movie" || item.type === "movies";
        return item.type === "tvshow" || item.type === "tvshows" || item.type === "series";
      });
    } catch (e) {
      return [];
    }
  });
}
function selectBestResult(results, tmdbInfo) {
  if (results.length === 0)
    return null;
  if (results.length === 1)
    return results[0];
  const scored = results.map((result) => {
    let score = calculateSimilarity(result.title || "", tmdbInfo.title) * 2;
    if (tmdbInfo.originalTitle)
      score += calculateSimilarity(result.title || "", tmdbInfo.originalTitle);
    if (tmdbInfo.year && result.year && result.year.toString() === tmdbInfo.year)
      score += 0.5;
    return { result, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored[0].result;
}
function getEpisodeId(seriesId, seasonNum, episodeNum) {
  return __async(this, null, function* () {
    var _a;
    const url = `https://la.movie/wp-api/v1/single/episodes/list?_id=${seriesId}&season=${seasonNum}&page=1&postsPerPage=50`;
    try {
      const { data } = yield import_axios5.default.get(url, { timeout: 12e3, headers: HEADERS });
      if (!((_a = data == null ? void 0 : data.data) == null ? void 0 : _a.posts))
        return null;
      const ep = data.data.posts.find((e) => e.season_number == seasonNum && e.episode_number == episodeNum);
      return (ep == null ? void 0 : ep._id) || null;
    } catch (e) {
      console.log(`[LaMovie] Error episodios: ${e.message}`);
      return null;
    }
  });
}
function processEmbed(embed) {
  return __async(this, null, function* () {
    try {
      const resolver = getResolver(embed.url);
      if (!resolver) {
        console.log(`[LaMovie] Sin resolver para: ${embed.url}`);
        return null;
      }
      const result = yield resolver(embed.url);
      if (!result || !result.url)
        return null;
      const quality = normalizeQuality(embed.quality || "1080p");
      const serverName = getServerName(embed.url);
      return {
        name: "LaMovie",
        title: `${quality} \xB7 ${serverName}`,
        url: result.url,
        quality,
        headers: result.headers || {}
      };
    } catch (e) {
      console.log(`[LaMovie] Error procesando embed: ${e.message}`);
      return null;
    }
  });
}
function getStreams(tmdbId, mediaType, season, episode) {
  return __async(this, null, function* () {
    var _a;
    if (!tmdbId || !mediaType)
      return [];
    const startTime = Date.now();
    console.log(`[LaMovie] Buscando: TMDB ${tmdbId} (${mediaType})${season ? ` S${season}E${episode}` : ""}`);
    try {
      const tmdbInfo = yield getTmdbData(tmdbId, mediaType);
      if (!tmdbInfo)
        return [];
      const variants = generateSearchVariants(tmdbInfo, mediaType);
      console.log(`[LaMovie] ${variants.length} variantes generadas`);
      const searchPromises = variants.slice(0, 5).map((v) => __async(this, null, function* () {
        const results2 = yield searchLamovie(v, mediaType);
        return { variant: v, results: results2 };
      }));
      const searchResults = yield Promise.allSettled(searchPromises);
      let selected = null;
      for (const r of searchResults) {
        if (r.status === "fulfilled" && r.value.results.length > 0) {
          selected = r.value;
          break;
        }
      }
      if (!selected) {
        console.log("[LaMovie] Sin resultados");
        return [];
      }
      console.log(`[LaMovie] \u2713 "${selected.variant}" (${selected.results.length} resultados)`);
      const bestMatch = selectBestResult(selected.results, tmdbInfo);
      if (!bestMatch)
        return [];
      let targetId = bestMatch._id;
      if (mediaType === "tv" && season && episode) {
        const epId = yield getEpisodeId(targetId, season, episode);
        if (!epId) {
          console.log(`[LaMovie] Episodio S${season}E${episode} no encontrado`);
          return [];
        }
        targetId = epId;
      }
      const { data } = yield import_axios5.default.get(
        `https://la.movie/wp-api/v1/player?postId=${targetId}&demo=0`,
        { timeout: 6e3, headers: HEADERS }
      );
      if (!((_a = data == null ? void 0 : data.data) == null ? void 0 : _a.embeds)) {
        console.log("[LaMovie] No hay embeds disponibles");
        return [];
      }
      const embedPromises = data.data.embeds.map((embed) => processEmbed(embed));
      const results = yield Promise.allSettled(embedPromises);
      const streams = results.filter((r) => r.status === "fulfilled" && r.value).map((r) => r.value);
      const elapsed = ((Date.now() - startTime) / 1e3).toFixed(2);
      console.log(`[LaMovie] \u2713 ${streams.length} streams en ${elapsed}s`);
      return streams;
    } catch (e) {
      console.log(`[LaMovie] Error: ${e.message}`);
      return [];
    }
  });
}
