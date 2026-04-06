// providers/lamovie.js
var TMDB_API_KEY = "439c478a771f35c05022f9feabcca01c";
var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
var HEADERS = { "User-Agent": UA, "Accept": "application/json" };
var BASE_URL = "https://la.movie";

var ANIME_COUNTRIES = ["JP", "CN", "KR"];
var GENRE_ANIMATION = 16;

var RESOLVERS = {
  "vimeos.net": resolveVimeos
};

var IGNORED_HOSTS = [];

// Helper httpGet (ya lo tenías)
function httpGet(url, options) {
  options = options || {};
  var controller = new AbortController();
  var timer = setTimeout(function() { controller.abort(); }, options.timeout || 8000);

  return fetch(url, {
    headers: Object.assign({ "User-Agent": UA }, options.headers || {}),
    signal: controller.signal,
    redirect: "follow"
  }).then(function(res) {
    clearTimeout(timer);
    if (!res.ok) throw new Error("HTTP " + res.status);
    var ct = res.headers.get("content-type") || "";
    return ct.includes("json") ? res.json() : res.text();
  });
}

// ============================================================================
// UTILIDADES (las tuyas intactas)
// ============================================================================
function normalizeText(text) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

function buildSlug(title, year) {
  var slug = title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return year ? slug + "-" + year : slug;
}

function getCategories(mediaType, genres, originCountries) {
  if (mediaType === "movie") return ["peliculas"];
  var isAnimation = (genres || []).indexOf(GENRE_ANIMATION) !== -1;
  if (!isAnimation) return ["series"];
  var isAnimeCountry = (originCountries || []).some(function(c) { return ANIME_COUNTRIES.indexOf(c) !== -1; });
  if (isAnimeCountry) return ["animes"];
  return ["animes", "series"];
}

function normalizeQuality(quality) {
  var str = quality.toString().toLowerCase();
  var match = str.match(/(\d+)/);
  if (match) return match[1] + "p";
  if (str.includes("4k") || str.includes("uhd")) return "2160p";
  if (str.includes("full") || str.includes("fhd")) return "1080p";
  if (str.includes("hd")) return "720p";
  return "SD";
}

function getServerName(url) {
  if (url.includes("vimeos.net")) return "Vimeos";
  return "Online";
}

function getResolver(url) {
  for (var pattern in RESOLVERS) {
    if (url.includes(pattern)) return RESOLVERS[pattern];
  }
  return null;
}

// ============================================================================
// TMDB (tu lógica intacta, solo en .then)
// ============================================================================
function getTmdbData(tmdbId, mediaType) {
  var attempts = [
    { lang: "es-MX", name: "Latino" },
    { lang: "en-US", name: "Inglés" }
  ];

  function tryNext(i) {
    if (i >= attempts.length) return Promise.resolve(null);
    var attempt = attempts[i];

    return httpGet("https://api.themoviedb.org/3/" + mediaType + "/" + tmdbId + "?api_key=" + TMDB_API_KEY + "&language=" + attempt.lang, { timeout: 10000, headers: HEADERS })
      .then(function(data) {
        var title = mediaType === "movie" ? data.title : data.name;
        var originalTitle = mediaType === "movie" ? data.original_title : data.original_name;

        if (attempt.lang === "es-MX" && /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(title)) {
          return tryNext(i + 1);
        }

        console.log("[LaMovie] TMDB (" + attempt.name + "): \"" + title + "\"" + (title !== originalTitle ? " | Original: \"" + originalTitle + "\"" : ""));
        return {
          title: title,
          originalTitle: originalTitle,
          year: (data.release_date || data.first_air_date || "").substring(0, 4),
          genres: (data.genres || []).map(function(g) { return g.id; }),
          originCountries: data.origin_country || (data.production_countries || []).map(function(c) { return c.iso_3166_1; }) || []
        };
      })
      .catch(function(e) {
        console.log("[LaMovie] Error TMDB " + attempt.name + ": " + e.message);
        return tryNext(i + 1);
      });
  }

  return tryNext(0);
}

// ============================================================================
// SLUG → ID (tu lógica intacta)
// ============================================================================
function extractIdFromHtml(html) {
  var match = html.match(/rel=['"]shortlink['"]\s+href=['"][^'"]*\?p=(\d+)['"]/);
  return match ? match[1] : null;
}

function getIdBySlug(category, slug) {
  var url = BASE_URL + "/" + category + "/" + slug + "/";
  return httpGet(url, { timeout: 8000, headers: {
    "User-Agent": UA,
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "es-MX,es;q=0.9",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1"
  }})
    .then(function(html) {
      var id = extractIdFromHtml(html);
      if (id) {
        console.log("[LaMovie] ✓ Slug directo: /" + category + "/" + slug + " → id:" + id);
        return { id: id };
      }
      return null;
    })
    .catch(function() {
      return null;
    });
}

function findBySlug(tmdbInfo, mediaType) {
  var title = tmdbInfo.title;
  var originalTitle = tmdbInfo.originalTitle;
  var year = tmdbInfo.year;
  var categories = getCategories(mediaType, tmdbInfo.genres, tmdbInfo.originCountries);

  var slugs = [];
  if (title) slugs.push(buildSlug(title, year));
  if (originalTitle && originalTitle !== title) slugs.push(buildSlug(originalTitle, year));

  function tryNextSlug(i) {
    if (i >= slugs.length) return Promise.resolve(null);
    var slug = slugs[i];

    if (categories.length === 1) {
      return getIdBySlug(categories[0], slug).then(function(result) {
        return result || tryNextSlug(i + 1);
      });
    } else {
      var promises = categories.map(function(cat) {
        return getIdBySlug(cat, slug);
      });
      return Promise.all(promises).then(function(results) {
        for (var j = 0; j < results.length; j++) {
          if (results[j]) return results[j];
        }
        return tryNextSlug(i + 1);
      });
    }
  }

  return tryNextSlug(0);
}

// ============================================================================
// EPISODIOS
// ============================================================================
function getEpisodeId(seriesId, seasonNum, episodeNum) {
  var url = BASE_URL + "/wp-api/v1/single/episodes/list?_id=" + seriesId + "&season=" + seasonNum + "&page=1&postsPerPage=50";
  return httpGet(url, { timeout: 12000, headers: HEADERS })
    .then(function(data) {
      if (!data || !data.data || !data.data.posts) return null;
      var ep = data.data.posts.find(function(e) {
        return String(e.season_number) === String(seasonNum) && String(e.episode_number) === String(episodeNum);
      });
      return ep ? ep._id : null;
    })
    .catch(function(e) {
      console.log("[LaMovie] Error episodios: " + e.message);
      return null;
    });
}

// ============================================================================
// RESOLUCIÓN DE EMBEDS
// ============================================================================
function processEmbed(embed) {
  return new Promise(function(resolve) {
    var resolver = getResolver(embed.url);
    if (!resolver) {
      console.log("[LaMovie] Sin resolver para: " + embed.url);
      return resolve(null);
    }

    resolver(embed.url).then(function(result) {
      if (!result || !result.url) return resolve(null);

      var quality = normalizeQuality(embed.quality || "1080p");
      var serverName = getServerName(embed.url);

      resolve({
        name: "LaMovie",
        title: quality + " · " + serverName,
        url: result.url,
        quality: quality,
        headers: result.headers || {}
      });
    }).catch(function(e) {
      console.log("[LaMovie] Error procesando embed: " + e.message);
      resolve(null);
    });
  });
}

// ============================================================================
// FUNCIÓN PRINCIPAL
// ============================================================================
function getStreams(tmdbId, mediaType, season, episode) {
  return new Promise(function(resolve) {
    if (!tmdbId || !mediaType) return resolve([]);

    var startTime = Date.now();
    console.log("[LaMovie] Buscando: TMDB " + tmdbId + " (" + mediaType + ")" + (season ? " S" + season + "E" + episode : ""));

    getTmdbData(tmdbId, mediaType).then(function(tmdbInfo) {
      if (!tmdbInfo) return resolve([]);

      findBySlug(tmdbInfo, mediaType).then(function(found) {
        if (!found) {
          console.log("[LaMovie] No encontrado por slug");
          return resolve([]);
        }

        var targetId = found.id;

        if (mediaType === "tv" && season && episode) {
          getEpisodeId(targetId, season, episode).then(function(epId) {
            if (!epId) {
              console.log("[LaMovie] Episodio S" + season + "E" + episode + " no encontrado");
              return resolve([]);
            }
            targetId = epId;
            continueToPlayer();
          });
        } else {
          continueToPlayer();
        }

        function continueToPlayer() {
          httpGet(BASE_URL + "/wp-api/v1/player?postId=" + targetId + "&demo=0", { timeout: 6000, headers: HEADERS })
            .then(function(data) {
              if (!data || !data.data || !data.data.embeds || data.data.embeds.length === 0) {
                console.log("[LaMovie] No hay embeds disponibles");
                return resolve([]);
              }

              var embeds = data.data.embeds;
              var results = [];
              var completed = 0;

              function next(i) {
                if (i >= embeds.length) {
                  var elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
                  console.log("[LaMovie] ✓ " + results.length + " streams en " + elapsed + "s");
                  return resolve(results);
                }

                processEmbed(embeds[i]).then(function(result) {
                  if (result) results.push(result);
                  completed++;
                  next(i + 1);
                }).catch(function() {
                  completed++;
                  next(i + 1);
                });
              }

              next(0);
            })
            .catch(function(e) {
              console.log("[LaMovie] Error: " + e.message);
              resolve([]);
            });
        }
      });
    }).catch(function(e) {
      console.log("[LaMovie] Error: " + e.message);
      resolve([]);
    });
  });
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { getStreams };
} else {
  global.getStreams = getStreams;
}
