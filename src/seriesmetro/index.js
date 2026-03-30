import { resolveFastream } from '../resolvers/fastream.js';

// ============================================================================
// CONFIGURACIÓN
// ============================================================================
const TMDB_API_KEY = '439c478a771f35c05022f9feabcca01c';
const BASE = 'https://www3.seriesmetro.net';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const HEADERS = {
  'User-Agent': UA,
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'es-MX,es;q=0.9',
  'Connection': 'keep-alive',
  'Upgrade-Insecure-Requests': '1',
};

const LANG_PRIORITY = ['latino', 'lat', 'castellano', 'español', 'esp', 'vose', 'sub', 'subtitulado'];

const LANG_MAP = {
  'latino': 'Latino', 'lat': 'Latino',
  'castellano': 'Español', 'español': 'Español', 'esp': 'Español',
  'vose': 'Subtitulado', 'sub': 'Subtitulado', 'subtitulado': 'Subtitulado',
};

// ============================================================================
// FETCH HELPER
// ============================================================================
async function fetchText(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: { ...HEADERS, ...options.headers },
    signal: AbortSignal.timeout(options.timeout || 8000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

async function fetchJson(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: { 'User-Agent': UA, 'Accept': 'application/json', ...options.headers },
    signal: AbortSignal.timeout(options.timeout || 5000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// ============================================================================
// UTILIDADES
// ============================================================================
function buildSlug(title) {
  return title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// ============================================================================
// TMDB — 3 idiomas en paralelo
// ============================================================================
async function getTmdbData(tmdbId, mediaType) {
  const langs = ['es-MX', 'es-ES', 'en-US'];

  const results = await Promise.allSettled(langs.map(lang =>
    fetchJson(`https://api.themoviedb.org/3/${mediaType}/${tmdbId}?api_key=${TMDB_API_KEY}&language=${lang}`, { timeout: 5000 })
      .then(data => ({ lang, data }))
  ));

  const byLang = {};
  for (const r of results) {
    if (r.status === 'fulfilled') byLang[r.value.lang] = r.value.data;
  }

  const getTitle = (d) => d ? (mediaType === 'movie' ? d.title : d.name) : null;
  const getOriginal = (d) => d ? (mediaType === 'movie' ? d.original_title : d.original_name) : null;

  const mxTitle = getTitle(byLang['es-MX']);
  const esTitle = getTitle(byLang['es-ES']);
  const enTitle = getTitle(byLang['en-US']);
  const originalTitle = getOriginal(byLang['en-US']) || getOriginal(byLang['es-MX']);

  let title = mxTitle;
  if (!title || /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(title)) title = enTitle;
  if (!title) title = esTitle;
  if (!title) return null;

  console.log(`[SeriesMetro] TMDB: "${title}"${esTitle && esTitle !== title ? ` | ES: "${esTitle}"` : ''}`);
  return { title, originalTitle, esTitle, enTitle };
}

// ============================================================================
// BUSCAR URL POR SLUG DIRECTO
// ============================================================================
async function findContentUrl(tmdbInfo, mediaType) {
  const { title, originalTitle, esTitle, enTitle } = tmdbInfo;
  const category = mediaType === 'movie' ? 'pelicula' : 'serie';

  const slugs = [];
  if (title) slugs.push(buildSlug(title));
  if (originalTitle && originalTitle !== title) slugs.push(buildSlug(originalTitle));
  if (esTitle && esTitle !== title && esTitle !== originalTitle) slugs.push(buildSlug(esTitle));
  if (enTitle && enTitle !== title && enTitle !== originalTitle && enTitle !== esTitle) slugs.push(buildSlug(enTitle));

  const uniqueSlugs = [...new Set(slugs.filter(s => s.length > 0))];

  const results = await Promise.allSettled(uniqueSlugs.map(slug =>
    fetchText(`${BASE}/${category}/${slug}/`)
      .then(data => {
        if (data.includes('trembed=') || data.includes('data-post='))
          return { url: `${BASE}/${category}/${slug}/`, html: data };
        return null;
      })
  ));

  for (const r of results) {
    if (r.status === 'fulfilled' && r.value) {
      console.log(`[SeriesMetro] ✓ Encontrado: ${r.value.url}`);
      return r.value;
    }
  }
  console.log('[SeriesMetro] No encontrado por slug');
  return null;
}

// ============================================================================
// EPISODIOS
// ============================================================================
async function getEpisodeUrl(serieUrl, serieHtml, season, episode) {
  const dpost = serieHtml.match(/data-post="(\d+)"/)?.[1];
  if (!dpost) throw new Error('No dpost found');

  const res = await fetch(`${BASE}/wp-admin/admin-ajax.php`, {
    method: 'POST',
    headers: { ...HEADERS, 'Content-Type': 'application/x-www-form-urlencoded', 'Referer': serieUrl },
    body: new URLSearchParams({ action: 'action_select_season', post: dpost, season: String(season) }),
    signal: AbortSignal.timeout(8000),
  });
  const epData = await res.text();

  const epUrls = [...epData.matchAll(/href="([^"]+\/capitulo\/[^"]+)"/g)].map(m => m[1]);

  return epUrls.find(u => {
    const m = u.match(/temporada-(\d+)-capitulo-(\d+)/);
    return m && parseInt(m[1]) === season && parseInt(m[2]) === episode;
  }) || null;
}

// ============================================================================
// STREAMS CON CASCADA DE IDIOMAS
// ============================================================================
async function extractStreams(pageUrl, referer) {
  const data = await fetchText(pageUrl, { headers: { 'Referer': referer } });

  const options = [...data.matchAll(/href="#options-(\d+)"[^>]*>[\s\S]*?<span class="server">([\s\S]*?)<\/span>/g)];
  const trids = [...data.matchAll(/\?trembed=(\d+)(?:&#038;|&)trid=(\d+)(?:&#038;|&)trtype=(\d+)/g)];

  if (trids.length === 0 || options.length === 0) return [];

  const trid = trids[0][2];
  const trtype = trids[0][3];

  const sorted = options.sort(([, , a], [, , b]) => {
    const aLang = a.replace(/<[^>]+>/g, '').split('-').pop().trim().toLowerCase();
    const bLang = b.replace(/<[^>]+>/g, '').split('-').pop().trim().toLowerCase();
    const ai = LANG_PRIORITY.indexOf(aLang);
    const bi = LANG_PRIORITY.indexOf(bLang);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  const streams = [];

  for (const [, idx, srvRaw] of sorted) {
    const srvText = srvRaw.replace(/<[^>]+>/g, '').trim();
    const langRaw = srvText.split('-').pop().trim().toLowerCase();
    const lang = LANG_MAP[langRaw] || langRaw;

    try {
      const embedPage = await fetchText(`${BASE}/?trembed=${idx}&trid=${trid}&trtype=${trtype}`, {
        headers: { 'Referer': pageUrl }
      });

      const fastreamUrl = embedPage.match(/<iframe[^>]*src="(https?:\/\/fastream\.to\/[^"]+)"/i)?.[1];
      if (!fastreamUrl) continue;

      const stream = await resolveFastream(fastreamUrl);
      if (!stream) continue;

      streams.push({
        name: 'SeriesMetro',
        title: `${stream.quality} · ${lang} · Fastream`,
        url: stream.url,
        quality: stream.quality,
        headers: stream.headers,
      });

      if (lang === 'Latino') {
        console.log('[SeriesMetro] Latino encontrado, retornando');
        return streams;
      }

    } catch (e) {
      console.log(`[SeriesMetro] Error embed ${idx}: ${e.message}`);
    }
  }

  return streams;
}

// ============================================================================
// FUNCIÓN PRINCIPAL EXPORTADA
// ============================================================================
export async function getStreams(tmdbId, mediaType, season, episode) {
  if (!tmdbId || !mediaType) return [];

  const startTime = Date.now();
  console.log(`[SeriesMetro] Buscando: TMDB ${tmdbId} (${mediaType})${season ? ` S${season}E${episode}` : ''}`);

  try {
    const tmdbInfo = await getTmdbData(tmdbId, mediaType);
    if (!tmdbInfo) return [];

    const found = await findContentUrl(tmdbInfo, mediaType);
    if (!found) return [];

    let targetUrl = found.url;

    if (mediaType === 'tv' && season && episode) {
      const epUrl = await getEpisodeUrl(found.url, found.html, season, episode);
      if (!epUrl) {
        console.log(`[SeriesMetro] Episodio S${season}E${episode} no encontrado`);
        return [];
      }
      console.log(`[SeriesMetro] Episodio: ${epUrl}`);
      targetUrl = epUrl;
    }

    const streams = await extractStreams(targetUrl, found.url);

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`[SeriesMetro] ✓ ${streams.length} streams en ${elapsed}s`);
    return streams;

  } catch (e) {
    console.log(`[SeriesMetro] Error: ${e.message}`);
    return [];
  }
}