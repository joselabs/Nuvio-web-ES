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
  return new Promise((resolve6, reject) => {
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
    var step = (x) => x.done ? resolve6(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
var cinecalidad_exports = {};
__export(cinecalidad_exports, {
  getStreams: () => getStreams
});
module.exports = __toCommonJS(cinecalidad_exports);
var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
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
function detectQuality(_0) {
  return __async(this, arguments, function* (m3u8Url, headers = {}) {
    try {
      const res = yield fetch(m3u8Url, {
        headers: __spreadValues({ "User-Agent": UA }, headers),
        redirect: "follow"
      });
      const data = yield res.text();
      if (!data.includes("#EXT-X-STREAM-INF")) {
        const match = m3u8Url.match(/[_-](\d{3,4})p/);
        return match ? `${match[1]}p` : "1080p";
      }
      let bestWidth = 0;
      let bestHeight = 0;
      const lines = data.split("\n");
      for (const line of lines) {
        const m = line.match(/RESOLUTION=(\d+)x(\d+)/);
        if (m) {
          const w = parseInt(m[1]);
          const h = parseInt(m[2]);
          if (h > bestHeight) {
            bestHeight = h;
            bestWidth = w;
          }
        }
      }
      return bestHeight > 0 ? normalizeResolution(bestWidth, bestHeight) : "1080p";
    } catch (e) {
      return "1080p";
    }
  });
}
var UA2 = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function resolve(embedUrl) {
  return __async(this, null, function* () {
    try {
      console.log(`[GoodStream] Resolviendo: ${embedUrl}`);
      const response = yield fetch(embedUrl, {
        headers: {
          "User-Agent": UA2,
          "Referer": "https://goodstream.one",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
        },
        redirect: "follow"
      });
      if (!response.ok)
        throw new Error(`HTTP ${response.status}`);
      const html = yield response.text();
      const match = html.match(/file:\s*"([^"]+)"/);
      if (!match) {
        console.log('[GoodStream] No se encontr\xF3 patr\xF3n file:"..."');
        return null;
      }
      const videoUrl = match[1];
      const refererHeaders = { "Referer": embedUrl, "Origin": "https://goodstream.one", "User-Agent": UA2 };
      const quality = yield detectQuality(videoUrl, refererHeaders);
      console.log(`[GoodStream] URL encontrada (${quality}): ${videoUrl.substring(0, 80)}...`);
      return { url: videoUrl, quality, headers: refererHeaders };
    } catch (err) {
      console.log(`[GoodStream] Error: ${err.message}`);
      return null;
    }
  });
}
var UA3 = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
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
    const resp = yield fetch(url, {
      method: "GET",
      headers: __spreadValues({
        "User-Agent": UA3,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
      }, headers),
      redirect: "follow"
    });
    return resp;
  });
}
function resolve2(embedUrl) {
  return __async(this, null, function* () {
    try {
      console.log(`[VOE] Resolviendo: ${embedUrl}`);
      let pageResp = yield fetchUrl(embedUrl, { Referer: embedUrl });
      if (!pageResp.ok)
        throw new Error(`HTTP ${pageResp.status}`);
      let data = yield pageResp.text();
      if (/permanentToken/i.test(data)) {
        const m2 = data.match(/window\.location\.href\s*=\s*'([^']+)'/i);
        if (m2) {
          console.log(`[VOE] Permanent token redirect -> ${m2[1]}`);
          const r2 = yield fetchUrl(m2[1], { Referer: embedUrl });
          if (r2.ok) {
            data = yield r2.text();
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
        const jsData = jsResp.ok ? yield jsResp.text() : "";
        const replMatch = jsData.match(/(\[(?:'[^']{1,10}'[\s,]*){4,12}\])/i) || jsData.match(/(\[(?:"[^"]{1,10}"[,\s]*){4,12}\])/i);
        if (replMatch) {
          const decoded = voeDecode(encodedArray, replMatch[1]);
          if (decoded && (decoded.source || decoded.direct_access_url)) {
            const url = decoded.source || decoded.direct_access_url;
            const quality = yield detectQuality(url, { Referer: embedUrl });
            console.log(`[VOE] URL encontrada: ${url.substring(0, 80)}...`);
            return { url, quality, headers: { Referer: embedUrl } };
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
        return { url, quality: yield detectQuality(url, { Referer: embedUrl }), headers: { Referer: embedUrl } };
      }
      console.log("[VOE] No se encontr\xF3 URL");
      return null;
    } catch (err) {
      console.log(`[VOE] Error: ${err.message}`);
      return null;
    }
  });
}
var import_crypto_js = __toESM(require("crypto-js"));
var UA4 = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
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
      const playbackJson = yield fetch(
        `https://filemooon.link/api/videos/${id}/embed/playback`,
        { headers: { "User-Agent": UA4, "Referer": embedUrl } }
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
            headers: { "User-Agent": UA4, "Referer": embedUrl },
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
          "User-Agent": UA4,
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
var UA5 = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
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
function resolve4(embedUrl) {
  return __async(this, null, function* () {
    var _a;
    try {
      let fetchUrl2 = embedUrl;
      for (const [from, to] of Object.entries(DOMAIN_MAP)) {
        if (fetchUrl2.includes(from)) {
          fetchUrl2 = fetchUrl2.replace(from, to);
          break;
        }
      }
      const embedHost = ((_a = fetchUrl2.match(/^(https?:\/\/[^/]+)/)) == null ? void 0 : _a[1]) || "https://hlswish.com";
      console.log(`[HLSWish] Resolviendo: ${embedUrl}`);
      if (fetchUrl2 !== embedUrl)
        console.log(`[HLSWish] \u2192 Mapped to: ${fetchUrl2}`);
      const resp = yield fetch(fetchUrl2, {
        headers: {
          "User-Agent": UA5,
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
              headers: { "User-Agent": UA5, "Referer": embedHost + "/" },
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
        return { url, quality: "1080p", headers: { "User-Agent": UA5, "Referer": embedHost + "/" } };
      }
      const packMatch = data.match(
        /eval\(function\(p,a,c,k,e,[a-z]\)\{[^}]+\}\s*\('([\s\S]+?)',\s*(\d+),\s*(\d+),\s*'([\s\S]+?)'\.split\('\|'\)/
      );
      if (packMatch) {
        const unpacked = unpackEval(packMatch[1], parseInt(packMatch[2]), packMatch[4].split("|"));
        const url = extractHlsUrl(unpacked, embedHost);
        if (url) {
          console.log(`[HLSWish] URL encontrada: ${url.substring(0, 80)}...`);
          return { url, quality: "1080p", headers: { "User-Agent": UA5, "Referer": embedHost + "/" } };
        }
      }
      const rawM3u8 = data.match(/https?:\/\/[^"'\s\\]+\.m3u8[^"'\s\\]*/i);
      if (rawM3u8) {
        console.log(`[HLSWish] URL encontrada: ${rawM3u8[0].substring(0, 80)}...`);
        return { url: rawM3u8[0], quality: "1080p", headers: { "User-Agent": UA5, "Referer": embedHost + "/" } };
      }
      console.log("[HLSWish] No se encontr\xF3 URL");
      return null;
    } catch (err) {
      console.log(`[HLSWish] Error: ${err.message}`);
      return null;
    }
  });
}
var UA6 = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function resolve5(embedUrl) {
  return __async(this, null, function* () {
    try {
      console.log(`[Vimeos] Resolviendo: ${embedUrl}`);
      const resp = yield fetch(embedUrl, {
        headers: {
          "User-Agent": UA6,
          "Referer": "https://vimeos.net/",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
        },
        redirect: "follow"
      });
      if (!resp.ok)
        throw new Error(`HTTP ${resp.status}`);
      const data = yield resp.text();
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
          const url = m3u8Match[1];
          const refererHeaders = { "User-Agent": UA6, "Referer": "https://vimeos.net/" };
          const quality = yield detectQuality(url, refererHeaders);
          console.log(`[Vimeos] URL encontrada: ${url.substring(0, 80)}...`);
          return { url, quality, headers: refererHeaders };
        }
      }
      console.log("[Vimeos] No se encontr\xF3 URL");
      return null;
    } catch (err) {
      console.log(`[Vimeos] Error: ${err.message}`);
      return null;
    }
  });
}
var TMDB_API_KEY = "439c478a771f35c05022f9feabcca01c";
var HOST = "https://www.cinecalidad.vg";
var UA7 = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
var HEADERS = {
  "User-Agent": UA7,
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "es-MX,es;q=0.9",
  "Connection": "keep-alive",
  "Upgrade-Insecure-Requests": "1",
  "Referer": "https://www.cinecalidad.vg/"
};
var RESOLVERS = {
  "goodstream.one": resolve,
  "hlswish.com": resolve4,
  "streamwish.com": resolve4,
  "streamwish.to": resolve4,
  "strwish.com": resolve4,
  "voe.sx": resolve2,
  "filemoon.sx": resolve3,
  "filemoon.to": resolve3,
  "vimeos.net": resolve5
};
var getServerName = (url) => {
  if (url.includes("goodstream"))
    return "GoodStream";
  if (url.includes("hlswish") || url.includes("streamwish") || url.includes("strwish"))
    return "StreamWish";
  if (url.includes("voe.sx"))
    return "VOE";
  if (url.includes("filemoon"))
    return "Filemoon";
  if (url.includes("vimeos"))
    return "Vimeos";
  return "Online";
};
var getResolver = (url) => {
  if (!url || !url.startsWith("http"))
    return null;
  for (const pattern in RESOLVERS) {
    if (url.includes(pattern))
      return RESOLVERS[pattern];
  }
  return null;
};
function b64decode(str) {
  try {
    if (typeof atob !== "undefined")
      return atob(str);
    return Buffer.from(str, "base64").toString("utf8");
  } catch (e) {
    return null;
  }
}
function getTmdbData(tmdbId, mediaType) {
  return __async(this, null, function* () {
    const attempts = [
      { lang: "es-MX", name: "Latino" },
      { lang: "es-ES", name: "Espa\xF1a" },
      { lang: "en-US", name: "Ingl\xE9s" }
    ];
    for (const { lang, name } of attempts) {
      try {
        const url = `https://api.themoviedb.org/3/${mediaType}/${tmdbId}?api_key=${TMDB_API_KEY}&language=${lang}`;
        const data = yield fetch(url, { headers: HEADERS }).then((r) => r.json());
        const title = mediaType === "movie" ? data.title : data.name;
        const originalTitle = mediaType === "movie" ? data.original_title : data.original_name;
        if (!title)
          continue;
        if (lang === "es-MX" && /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(title))
          continue;
        console.log(`[CineCalidad] TMDB (${name}): "${title}"${title !== originalTitle ? ` | Original: "${originalTitle}"` : ""}`);
        return {
          title,
          originalTitle,
          year: (data.release_date || data.first_air_date || "").substring(0, 4)
        };
      } catch (e) {
        console.log(`[CineCalidad] Error TMDB ${name}: ${e.message}`);
      }
    }
    return null;
  });
}
function buildSlug(title) {
  return title.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}
function extractYearFromHtml(html) {
  const match = html.match(/<h1[^>]*>[^<]*\((\d{4})\)[^<]*<\/h1>/);
  return match ? match[1] : null;
}
function getMovieUrl(slug, expectedYear) {
  return __async(this, null, function* () {
    const slugsToTry = [slug, `${slug}-2`, `${slug}-3`];
    for (const s of slugsToTry) {
      const url = `${HOST}/pelicula/${s}/`;
      try {
        const html = yield fetch(url, { headers: HEADERS }).then((r) => r.text());
        const year = extractYearFromHtml(html);
        if (!year || !expectedYear || year === expectedYear) {
          console.log(`[CineCalidad] \u2713 Slug directo: /pelicula/${s}/ (${year || "?"})`);
          return url;
        }
        console.log(`[CineCalidad] A\xF1o no coincide: esperado ${expectedYear}, encontrado ${year} en /pelicula/${s}/`);
      } catch (e) {
      }
    }
    return null;
  });
}
var KNOWN_EMBED_DOMAINS = [
  "goodstream.one",
  "voe.sx",
  "filemoon.sx",
  "filemoon.to",
  "hlswish.com",
  "streamwish.com",
  "streamwish.to",
  "strwish.com",
  "vimeos.net"
];
function isKnownEmbed(url) {
  return KNOWN_EMBED_DOMAINS.some((d) => url.includes(d));
}
function getEmbedUrls(movieUrl) {
  return __async(this, null, function* () {
    try {
      const data = yield fetch(movieUrl, { headers: HEADERS }).then((r) => r.text());
      const embedLinks = [];
      const regex = /data-src="([A-Za-z0-9+/=]{20,})"/g;
      let match;
      while ((match = regex.exec(data)) !== null)
        embedLinks.push(match[1]);
      const decodedUrls = [...new Set(
        embedLinks.map((b64) => b64decode(b64)).filter((url) => url && url.startsWith("http"))
      )];
      const directEmbeds = decodedUrls.filter(isKnownEmbed);
      const intermediateUrls = decodedUrls.filter((u) => !isKnownEmbed(u));
      console.log(`[CineCalidad] ${directEmbeds.length} embeds directos, ${intermediateUrls.length} intermedios`);
      const embedUrls = new Set(directEmbeds);
      if (intermediateUrls.length > 0) {
        yield Promise.allSettled(intermediateUrls.map((decoded) => __async(this, null, function* () {
          try {
            const midData = yield fetch(decoded, { headers: HEADERS }).then((r) => r.text());
            let finalUrl = "";
            const btnMatch = midData.match(/id="btn_enlace"[^>]*>[\s\S]*?href="([^"]+)"/);
            if (btnMatch)
              finalUrl = btnMatch[1];
            if (!finalUrl) {
              const iframeMatch = midData.match(/<iframe[^>]+src="([^"]+)"/);
              if (iframeMatch)
                finalUrl = iframeMatch[1];
            }
            if (!finalUrl && decoded.includes("/e/"))
              finalUrl = decoded;
            if (finalUrl && finalUrl.startsWith("http"))
              embedUrls.add(finalUrl);
          } catch (e) {
          }
        })));
      }
      return [...embedUrls];
    } catch (e) {
      console.log(`[CineCalidad] Error obteniendo embeds: ${e.message}`);
      return [];
    }
  });
}
function processEmbed(embedUrl) {
  return __async(this, null, function* () {
    try {
      const resolver = getResolver(embedUrl);
      if (!resolver) {
        console.log(`[CineCalidad] Sin resolver para: ${embedUrl.substring(0, 60)}`);
        return null;
      }
      const serverName = getServerName(embedUrl);
      const result = yield resolver(embedUrl);
      if (!result || !result.url)
        return null;
      return {
        name: "CineCalidad",
        title: `1080p \xB7 ${serverName}`,
        url: result.url,
        quality: "1080p",
        headers: result.headers || {}
      };
    } catch (e) {
      return null;
    }
  });
}
function getStreams(tmdbId, mediaType, season, episode) {
  return __async(this, null, function* () {
    if (!tmdbId || !mediaType)
      return [];
    const startTime = Date.now();
    console.log(`[CineCalidad] Buscando: TMDB ${tmdbId} (${mediaType})${season ? ` S${season}E${episode}` : ""}`);
    if (mediaType === "tv") {
      console.log("[CineCalidad] Series no soportadas a\xFAn");
      return [];
    }
    try {
      const tmdbInfo = yield getTmdbData(tmdbId, mediaType);
      if (!tmdbInfo)
        return [];
      const slug = buildSlug(tmdbInfo.title);
      const movieUrl = yield getMovieUrl(slug, tmdbInfo.year);
      let selectedUrl = movieUrl;
      if (!selectedUrl && tmdbInfo.originalTitle && tmdbInfo.originalTitle !== tmdbInfo.title) {
        const altSlug = buildSlug(tmdbInfo.originalTitle);
        selectedUrl = yield getMovieUrl(altSlug, tmdbInfo.year);
      }
      if (!selectedUrl) {
        console.log("[CineCalidad] No encontrado por slug");
        return [];
      }
      const embedUrls = yield getEmbedUrls(selectedUrl);
      if (embedUrls.length === 0) {
        console.log("[CineCalidad] No se encontraron embeds");
        return [];
      }
      console.log(`[CineCalidad] Resolviendo ${embedUrls.length} embeds...`);
      const RESOLVER_TIMEOUT = 5e3;
      const uniqueEmbeds = [...new Set(embedUrls)];
      const streams = yield new Promise((resolve6) => {
        const results = [];
        let completed = 0;
        const total = uniqueEmbeds.length;
        const finish = () => resolve6(results.filter(Boolean));
        uniqueEmbeds.forEach((url) => {
          processEmbed(url).then((result) => {
            if (result)
              results.push(result);
            completed++;
            if (completed === total)
              finish();
          }).catch(() => {
            completed++;
            if (completed === total)
              finish();
          });
        });
      });
      const elapsed = ((Date.now() - startTime) / 1e3).toFixed(2);
      console.log(`[CineCalidad] \u2713 ${streams.length} streams en ${elapsed}s`);
      return streams;
    } catch (e) {
      console.log(`[CineCalidad] Error: ${e.message}`);
      return [];
    }
  });
}
