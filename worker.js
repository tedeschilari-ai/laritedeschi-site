// Só roda para arquivos .mp4 (ver "run_worker_first" no wrangler.jsonc); o resto do site
// continua saindo direto dos arquivos estáticos.
// Motivo: os arquivos estáticos do Cloudflare ignoram o pedido de "pedaço do arquivo"
// (Range) e o iPhone só toca vídeo quando o servidor responde 206 com o pedaço pedido.
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const metodo = request.method;
    if (!url.pathname.endsWith('.mp4') || (metodo !== 'GET' && metodo !== 'HEAD')) {
      return env.ASSETS.fetch(request);
    }
    const chave = new Request(url.origin + url.pathname, { method: 'GET' });
    const cache = caches.default;
    let inteiro = await cache.match(chave);
    if (!inteiro) {
      const res = await env.ASSETS.fetch(chave);
      if (res.status !== 200) return res;
      const h = new Headers(res.headers);
      h.set('Cache-Control', 'public, max-age=86400');
      h.set('Accept-Ranges', 'bytes');
      inteiro = new Response(await res.arrayBuffer(), { status: 200, headers: h });
      ctx.waitUntil(cache.put(chave, inteiro.clone()));
    }
    return comPedaco(request, inteiro);
  }
};

export async function comPedaco(request, inteiro) {
  const buf = await inteiro.arrayBuffer();
  const total = buf.byteLength;
  const h = new Headers(inteiro.headers);
  h.set('Accept-Ranges', 'bytes');
  h.delete('Content-Range');
  const corpo = (b) => (request.method === 'HEAD' ? null : b);
  const range = request.headers.get('Range');
  const m = range && /^bytes=(\d*)-(\d*)$/.exec(range.trim());
  if (!m || (m[1] === '' && m[2] === '')) {
    h.set('Content-Length', String(total));
    return new Response(corpo(buf), { status: 200, headers: h });
  }
  let ini, fim;
  if (m[1] === '') { ini = Math.max(0, total - Number(m[2])); fim = total - 1; }
  else { ini = Number(m[1]); fim = m[2] === '' ? total - 1 : Math.min(Number(m[2]), total - 1); }
  if (ini >= total || ini > fim) {
    h.set('Content-Range', `bytes */${total}`);
    h.set('Content-Length', '0');
    return new Response(null, { status: 416, headers: h });
  }
  h.set('Content-Range', `bytes ${ini}-${fim}/${total}`);
  h.set('Content-Length', String(fim - ini + 1));
  return new Response(corpo(buf.slice(ini, fim + 1)), { status: 206, headers: h });
}
