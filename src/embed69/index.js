// src/embed69/index.js
// Provider basado en embed69.org — soporta películas y series
// Flujo: TMDB → IMDB ID → embed69.org/f/{imdb_id} → dataLink (JWT) → resolvers

//import { resolve as resolveVoe } from '../resolvers/voe.js';
//import { resolve as resolveFilemoon } from '../resolvers/filemoon.js';
import { resolve as resolveHlswish } from '../resolvers/hlswish.js';
//import { resolve as resolveVidhide } from '../resolvers/vidhide.js';

const TMDB_API_KEY = '439c478a771f35c05022f9feabcca01c';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const BASE_URL = 'https://embed69.org';
const RESOLVER_TIMEOUT = 4000;

const RESOLVER_MAP = {
  //'voe.sx':           resolveVoe,
  'hglink.to':        resolveHlswish,
  'streamwish.com':   resolveHlswish,
  'streamwish.to':    resolveHlswish,
  'wishembed.online': resolveHlswish,
  'filelions.com':    resolveHlswish,
  //'bysedikamoum.com': resolveFilemoon,
  //'filemoon.sx':      resolveFilemoon,
  //'filemoon.to':      resolveFilemoon,
  //'moonembed.pro':    resolveFilemoon,
  //'dintezuvio.com':   resolveVidhide,
  //'vidhide.com':      resolveVidhide,
};

const SERVER_LABELS = {
  'voe':        'VOE',
  'streamwish': 'StreamWish',
  'filemoon':   'Filemoon',
  'vidhide':    'VidHide',
};

const LANG_PRIORITY = ['LAT', 'ESP', 'SUB'];

function decodeJwtPayload(token) {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    let payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    payload += '='.repeat((4 - payload.length % 4) % 4);
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

function parseDataLink(html) {
  try {
    const match = html.match(/let\s+dataLink\s*=\s*(\[.+\]);/);
    if (!match) return null;
    return JSON.parse(match[1]);
  } catch {
    return null;
  }
}

function getResolver(url) {
  if (!url) return null;
  for (const [pattern, resolver] of Object.entries(RESOLVER_MAP)) {
    if (url.includes(pattern)) return resolver;
  }
  return null;
}

async function getImdbId(tmdbId, mediaType) {
  const endpoint = mediaType === 'movie'
    ? `https://api.themoviedb.org/3/movie/${tmdbId}/external_ids?api_key=${TMDB_API_KEY}`
    : `https://api.themoviedb.org/3/tv/${tmdbId}/external_ids?api_key=${TMDB_API_KEY}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);
  const res = await fetch(endpoint, {
    headers: { 'User-Agent': UA },
    signal: controller.signal,
  });
  clearTimeout(timer);
  const data = await res.json();
  return data.imdb_id || null;
}

function buildEmbedUrl(imdbId, mediaType, season, episode) {
  if (mediaType === 'movie') return `${BASE_URL}/f/${imdbId}`;
  const e = String(episode).padStart(2, '0');
  return `${BASE_URL}/f/${imdbId}-${parseInt(season)}x${e}`;
}

export async function getStreams(tmdbId, mediaType, season, episode) {
  if (!tmdbId || !mediaType) return [];

  const startTime = Date.now();
  console.log(`[Embed69] Buscando: TMDB ${tmdbId} (${mediaType})${season ? ` S${season}E${episode}` : ''}`);

  try {
    const imdbId = await getImdbId(tmdbId, mediaType);
    if (!imdbId) {
      console.log('[Embed69] No se encontró IMDB ID');
      return [];
    }
    console.log(`[Embed69] IMDB ID: ${imdbId}`);

    const embedUrl = buildEmbedUrl(imdbId, mediaType, season, episode);
    console.log(`[Embed69] Fetching: ${embedUrl}`);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(embedUrl, {
      headers: {
        'User-Agent': UA,
        'Referer': 'https://sololatino.net/',
        'Accept': 'text/html,application/xhtml+xml',
      },
      signal: controller.signal,
    });
    clearTimeout(timer);
    const html = await res.text();

    const dataLink = parseDataLink(html);
    console.log('[Embed69] dataLink raw:', dataLink ? 'OK' : 'NULL');
    if (!dataLink || dataLink.length === 0) {
      console.log('[Embed69] No se encontró dataLink en el HTML');
      return [];
    }

    console.log(`[Embed69] ${dataLink.length} idiomas disponibles: ${dataLink.map(d => d.video_language).join(', ')}`);

    const byLang = {};
    for (const section of dataLink) {
      byLang[section.video_language] = section;
    }

    function getEmbeds(section) {
      const lang = section.video_language || 'LAT';
      const embeds = [];
      for (const embed of (section.sortedEmbeds || [])) {
        if (embed.servername === 'download') continue;
        console.log('[Embed69] JWT raw:', embed.link?.substring(0, 50));
        const payload = decodeJwtPayload(embed.link);
        if (!payload) {
          console.log('[Embed69] ❌ JWT decode FAILED');
        } else {
          console.log('[Embed69] ✅ JWT decode OK:', payload.link?.substring(0, 60));
        }
        if (!payload || !payload.link) continue;
        const resolver = getResolver(payload.link);
        if (!resolver) {
          console.log('[Embed69] ❌ No resolver match for:', payload.link);
        } else {
          console.log('[Embed69] ✅ Resolver encontrado');
        }
        if (!resolver) {
          console.log(`[Embed69] Sin resolver para ${embed.servername}: ${payload.link.substring(0, 60)}`);
          continue;
        }
        embeds.push({ url: payload.link, resolver, lang, servername: embed.servername });
      }
      return embeds;
    }

    async function resolveBatch(embeds) {
      console.log('[Embed69] resolveBatch START');
      const results = await Promise.allSettled(
        embeds.map(({ url, resolver, lang, servername }) =>
          Promise.race([
            resolver(url).then(r => r ? { ...r, lang, servername } : null),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error('timeout')), RESOLVER_TIMEOUT)
            )
          ])
        )
      );
      console.log('[Embed69] resolveBatch DONE:', results.length);
      return results
        .filter(r => r.status === 'fulfilled' && r.value?.url)
        .map(r => r.value);
    }

    const streams = [];
    for (const lang of LANG_PRIORITY) {
      const section = byLang[lang];
      if (!section) continue;

      const embeds = getEmbeds(section);
      if (embeds.length === 0) continue;

      console.log(`[Embed69] Resolviendo ${embeds.length} embeds (${lang})...`);
      console.log(`[Embed69] Intentando resolver ${embeds.length} embeds`);
      const resolved = await resolveBatch(embeds);

      if (resolved.length > 0) {
        for (const { url, quality, lang: l, servername, headers } of resolved) {
          const langLabel = l === 'LAT' ? 'Latino' : l === 'ESP' ? 'Español' : 'Subtitulado';
          const serverLabel = SERVER_LABELS[servername] || servername;
          streams.push({
            name: 'Embed69',
            title: `${quality || '1080p'} · ${langLabel} · ${serverLabel}`,
            url,
            quality: quality || '1080p',
            headers: headers || {},
          });
        }
        console.log(`[Embed69] ✓ Streams encontrados en ${lang}, omitiendo idiomas de menor prioridad`);
        break;
      } else {
        console.log(`[Embed69] Sin streams en ${lang}, intentando siguiente idioma...`);
      }
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`[Embed69] ✓ ${streams.length} streams en ${elapsed}s`);
    return streams;

  } catch (e) {
    console.log(`[Embed69] Error: ${e.message}`);
    return [];
  }
}
