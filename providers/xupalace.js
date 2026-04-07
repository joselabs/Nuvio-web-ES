import { resolve as resolveHlsWish } from '../resolvers/hlswish.js';
import { resolve as resolveFilemoon } from '../resolvers/filemoon.js';
import { resolve as resolveVoe } from '../resolvers/voe.js';
import { resolve as resolveVidhide } from '../resolvers/vidhide.js';

const TMDB_API_KEY = '439c478a771f35c05022f9feabcca01c';
const BASE_URL = 'https://xupalace.org';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

const HTML_HEADERS = {
  'User-Agent': UA,
  'Accept': 'text/html',
  'Accept-Language': 'es-MX,es;q=0.9',
  'Connection': 'keep-alive',
};

const RESOLVER_MAP = {
  'hglink.to':          { fn: resolveHlsWish,  name: 'StreamWish' },
  'vibuxer.com':        { fn: resolveHlsWish,  name: 'StreamWish' },
  'bysedikamoum.com':   { fn: resolveFilemoon, name: 'Filemoon'   },
  'voe.sx':             { fn: resolveVoe,       name: 'VOE'        },
  'vidhidepro.com':     { fn: resolveVidhide,  name: 'VidHide'    },
  'vidhide.com':        { fn: resolveVidhide,  name: 'VidHide'    },
  'dintezuvio.com':     { fn: resolveVidhide,  name: 'VidHide'    },
  'filelions.to': { fn: resolveVidhide, name: 'VidHide' },
};

async function getImdbId(tmdbId, mediaType) {
  try {
    const url = `https://api.themoviedb.org/3/${mediaType}/${tmdbId}/external_ids?api_key=${TMDB_API_KEY}`;
    const resp = await fetch(url, { headers: { 'User-Agent': UA } });
    if (!resp.ok) return null;
    const data = await resp.json();
    return data.imdb_id || null;
  } catch (e) {
    console.log(`[XuPalace] Error IMDB ID: ${e.message}`);
    return null;
  }
}

async function getEmbeds(imdbId, mediaType, season, episode) {
  try {
    let path;
    if (mediaType === 'movie') {
      path = `/video/${imdbId}/`;
    } else {
      path = `/video/${imdbId}-${season}x${String(episode).padStart(2, '0')}/`;
    }

    console.log(`[XuPalace] Fetching: ${BASE_URL}${path}`);

    const resp = await fetch(`${BASE_URL}${path}`, {
      headers: HTML_HEADERS
    });

    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const html = await resp.text();

    // Extraer con data-lang
    const matches = [...html.matchAll(/go_to_playerVast\('(https?:\/\/[^']+)'[^)]+\)[^<]*data-lang="(\d+)"/g)];
    
    // Si no hay matches con lang, fallback sin idioma
    if (matches.length === 0) {
      const fallback = [...html.matchAll(/go_to_playerVast\('(https?:\/\/[^']+)'/g)];
      return { 0: [...new Set(fallback.map(m => m[1]))] };
    }

    // Agrupar por idioma
    const byLang = {};
    for (const m of matches) {
      const url = m[1];
      const lang = parseInt(m[2]);
      if (!byLang[lang]) byLang[lang] = [];
      if (!byLang[lang].includes(url)) byLang[lang].push(url);
    }

    return byLang;
  } catch (e) {
    console.log(`[XuPalace] Error fetch: ${e.message}`);
    return {};
  }
}

export async function getStreams(tmdbId, mediaType, season, episode) {
  if (!tmdbId) return [];

  const startTime = Date.now();
  console.log(`[XuPalace] Buscando: TMDB ${tmdbId} (${mediaType})`);

  const LANG_NAMES = { 0: 'Latino', 1: 'Español', 2: 'Subtitulado' };

  try {
    const imdbId = await getImdbId(tmdbId, mediaType);
    if (!imdbId) {
      console.log('[XuPalace] No se encontró IMDB ID');
      return [];
    }
    console.log(`[XuPalace] IMDB ID: ${imdbId}`);

    const byLang = await getEmbeds(imdbId, mediaType, season, episode);
    if (Object.keys(byLang).length === 0) {
      console.log('[XuPalace] No hay embeds');
      return [];
    }

    // Cascada LAT → ESP → SUB
    for (const lang of [0, 1, 2]) {
      const urls = byLang[lang];
      if (!urls || urls.length === 0) continue;

      const langName = LANG_NAMES[lang];
      console.log(`[XuPalace] Resolviendo ${urls.length} embeds (${langName})...`);

      const results = await Promise.allSettled(
        urls.map(async url => {
          const domain = new URL(url).hostname.replace('www.', '');
          const resolver = RESOLVER_MAP[domain];
          if (!resolver) {
            console.log(`[XuPalace] Sin resolver para: ${domain} → ${url}`);
            return null;
          }
          const result = await resolver.fn(url);
          if (result) result.server = resolver.name;
          return result;
        })
      );

      const streams = results
        .filter(r => r.status === 'fulfilled' && r.value)
        .map(r => ({
          name: 'XuPalace',
          title: `${r.value.quality || '1080p'} · ${langName} · ${r.value.server}`,
          url: r.value.url,
          quality: r.value.quality || '1080p',
          headers: r.value.headers || {},
        }));

      if (streams.length > 0) {
        console.log(`[XuPalace] ✓ Streams encontrados en ${langName}, omitiendo idiomas de menor prioridad`);
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`[XuPalace] ✓ ${streams.length} streams en ${elapsed}s`);
        return streams;
      }
    }

    console.log('[XuPalace] No se encontraron streams en ningún idioma');
    return [];
  } catch (e) {
    console.log(`[XuPalace] Error: ${e.message}`);
    return [];
  }
}
