var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var lamovie_exports = {};
__export(lamovie_exports, {
  getStreams: () => getStreams
});
module.exports = __toCommonJS(lamovie_exports);
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
function resolve2(embedUrl) {
  return __async(this, null, function* () {
    try {
      console.log(`[Vimeos] Resolviendo: ${embedUrl}`);
      const resp = yield fetch(embedUrl, {
        headers: {
          "User-Agent": UA3,
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
          const refererHeaders = { "User-Agent": UA3, "Referer": "https://vimeos.net/" };
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
var UA4 = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
var HEADERS = { "User-Agent": UA4, "Accept": "application/json" };
var BASE_URL = "https://la.movie";
var ANIME_COUNTRIES = ["JP", "CN", "KR"];
var GENRE_ANIMATION = 16;
var RESOLVERS = {
  "goodstream.one": resolve,
  //'hlswish.com': resolveHlswish,
  //'streamwish.com': resolveHlswish,
  //'streamwish.to': resolveHlswish,
  //'strwish.com': resolveHlswish,
  //'voe.sx': resolveVoe,
  //'filemoon.sx': resolveFilemoon,
  //'filemoon.to': resolveFilemoon,
  "vimeos.net": resolve2
};
var IGNORED_HOSTS = [];
function httpGet(_0) {
  return __async(this, arguments, function* (url, options = {}) {
    const res = yield fetch(url, {
      headers: __spreadValues({ "User-Agent": UA4 }, options.headers),
      redirect: "follow"
    });
    if (!res.ok)
      throw new Error(`HTTP ${res.status}`);
    const contentType = res.headers.get("content-type") || "";
    return contentType.includes("json") ? res.json() : res.text();
  });
}
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
  if (url.includes("vimeos.net"))
    return "Vimeos";
  return "Online";
};
var getResolver = (url) => {
  try {
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
function buildSlug(title, year) {
  const slug = title.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  return year ? `${slug}-${year}` : slug;
}
function getCategories(mediaType, genres, originCountries) {
  if (mediaType === "movie")
    return ["peliculas"];
  const isAnimation = (genres || []).includes(GENRE_ANIMATION);
  if (!isAnimation)
    return ["series"];
  const isAnimeCountry = (originCountries || []).some((c) => ANIME_COUNTRIES.includes(c));
  if (isAnimeCountry)
    return ["animes"];
  return ["animes", "series"];
}
function getTmdbData(tmdbId, mediaType) {
  return __async(this, null, function* () {
    var _a;
    const attempts = [
      { lang: "es-MX", name: "Latino" },
      { lang: "en-US", name: "Ingl\xE9s" }
    ];
    for (const { lang, name } of attempts) {
      try {
        const url = `https://api.themoviedb.org/3/${mediaType}/${tmdbId}?api_key=${TMDB_API_KEY}&language=${lang}`;
        const data = yield httpGet(url, { headers: HEADERS });
        const title = mediaType === "movie" ? data.title : data.name;
        const originalTitle = mediaType === "movie" ? data.original_title : data.original_name;
        if (lang === "es-MX" && /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(title))
          continue;
        console.log(`[LaMovie] TMDB (${name}): "${title}"${title !== originalTitle ? ` | Original: "${originalTitle}"` : ""}`);
        return {
          title,
          originalTitle,
          year: (data.release_date || data.first_air_date || "").substring(0, 4),
          genres: (data.genres || []).map((g) => g.id),
          originCountries: data.origin_country || ((_a = data.production_countries) == null ? void 0 : _a.map((c) => c.iso_3166_1)) || []
        };
      } catch (e) {
        console.log(`[LaMovie] Error TMDB ${name}: ${e.message}`);
      }
    }
    return null;
  });
}
var HTML_HEADERS = {
  "User-Agent": UA4,
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "es-MX,es;q=0.9",
  "Connection": "keep-alive",
  "Upgrade-Insecure-Requests": "1"
};
function extractIdFromHtml(html) {
  const match = html.match(/rel=['"]shortlink['"]\s+href=['"][^'"]*\?p=(\d+)['"]/);
  return match ? match[1] : null;
}
function getIdBySlug(category, slug) {
  return __async(this, null, function* () {
    const url = `${BASE_URL}/${category}/${slug}/`;
    try {
      const html = yield httpGet(url, {
        headers: HTML_HEADERS,
        validateStatus: (s) => s === 200
      });
      const id = extractIdFromHtml(html);
      if (id) {
        console.log(`[LaMovie] \u2713 Slug directo: /${category}/${slug} \u2192 id:${id}`);
        return { id };
      }
      return null;
    } catch (e) {
      return null;
    }
  });
}
function findBySlug(tmdbInfo, mediaType) {
  return __async(this, null, function* () {
    const { title, originalTitle, year, genres, originCountries } = tmdbInfo;
    const categories = getCategories(mediaType, genres, originCountries);
    const slugs = [];
    if (title)
      slugs.push(buildSlug(title, year));
    if (originalTitle && originalTitle !== title)
      slugs.push(buildSlug(originalTitle, year));
    for (const slug of slugs) {
      if (categories.length === 1) {
        const result = yield getIdBySlug(categories[0], slug);
        if (result)
          return result;
      } else {
        const results = yield Promise.allSettled(
          categories.map((cat) => getIdBySlug(cat, slug))
        );
        const found = results.find((r) => r.status === "fulfilled" && r.value);
        if (found)
          return found.value;
      }
    }
    return null;
  });
}
function getEpisodeId(seriesId, seasonNum, episodeNum) {
  return __async(this, null, function* () {
    var _a;
    const url = `${BASE_URL}/wp-api/v1/single/episodes/list?_id=${seriesId}&season=${seasonNum}&page=1&postsPerPage=50`;
    try {
      const data = yield httpGet(url, { headers: HEADERS });
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
      const found = yield findBySlug(tmdbInfo, mediaType);
      if (!found) {
        console.log("[LaMovie] No encontrado por slug");
        return [];
      }
      let targetId = found.id;
      if (mediaType === "tv" && season && episode) {
        const epId = yield getEpisodeId(targetId, season, episode);
        if (!epId) {
          console.log(`[LaMovie] Episodio S${season}E${episode} no encontrado`);
          return [];
        }
        targetId = epId;
      }
      const data = yield httpGet(
        `${BASE_URL}/wp-api/v1/player?postId=${targetId}&demo=0`,
        { headers: HEADERS }
      );
      if (!((_a = data == null ? void 0 : data.data) == null ? void 0 : _a.embeds)) {
        console.log("[LaMovie] No hay embeds disponibles");
        return [];
      }
      const embedPromises = data.data.embeds.map((embed) => processEmbed(embed));
      const streams = yield new Promise((resolve3) => {
        const results = [];
        let completed = 0;
        const total = embedPromises.length;
        const finish = () => resolve3(results.filter(Boolean));
        embedPromises.forEach((p) => {
          p.then((result) => {
            if (result)
              results.push(result);
            completed++;
            if (completed === total) {
              finish();
            }
          }).catch(() => {
            completed++;
            if (completed === total) {
              finish();
            }
          });
        });
      });
      const elapsed = ((Date.now() - startTime) / 1e3).toFixed(2);
      console.log(`[LaMovie] \u2713 ${streams.length} streams en ${elapsed}s`);
      return streams;
    } catch (e) {
      console.log(`[LaMovie] Error: ${e.message}`);
      return [];
    }
  });
}

