import axios from 'axios';
import { detectQuality } from './quality.js';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

export async function resolve(embedUrl) {
  try {
    const resp = await axios.get(embedUrl, {
      headers: {
        'User-Agent': UA,
        'Referer': 'https://hlswish.com/',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      timeout: 15000,
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
      const symtab = packMatch[4].split('|');
      const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const unbase = (str) => {
        let result = 0;
        for (let i = 0; i < str.length; i++) result = result * radix + chars.indexOf(str[i]);
        return result;
      };
      const unpacked = payload.replace(/\b(\w+)\b/g, (match) => {
        const idx = unbase(match);
        return (symtab[idx] && symtab[idx] !== '') ? symtab[idx] : match;
      });

      const m3u8Match = unpacked.match(/["']([^"']+\.m3u8[^"']*)['"]/i);
      if (m3u8Match) {
        let url = m3u8Match[1];
        if (url.startsWith('/')) url = 'https://hlswish.com' + url;
        const refererHeaders = { 'User-Agent': UA, 'Referer': 'https://hlswish.com/' };
        const quality = await detectQuality(url, refererHeaders);
        console.log(`[HLSWish] URL encontrada (${quality}): ${url.substring(0, 80)}...`);
        return { url, quality, headers: refererHeaders };
      }
    }

    console.log('[HLSWish] No se encontró URL');
    return null;
  } catch (err) {
    console.log(`[HLSWish] Error: ${err.message}`);
    return null;
  }
}