export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const cut = (v: unknown, n: number) => String(v ?? '').slice(0, n);

/**
 * Registra a movimentação da loja (entrou / clicou / saiu) nos Logs da Vercel.
 * Não guarda dados pessoais: só evento, página, origem e tipo de aparelho.
 */
export async function POST(req: Request) {
  let b: Record<string, unknown> = {};
  try {
    b = JSON.parse(await req.text());
  } catch {
    /* corpo inválido: registra vazio */
  }
  const ua = req.headers.get('user-agent') ?? '';
  const aparelho = /mobile|android|iphone|ipad/i.test(ua) ? 'celular' : 'computador';
  const extra = b.texto ? ` botão="${cut(b.texto, 40)}"` : b.segundos != null ? ` ficou=${Number(b.segundos) || 0}s` : '';
  const origem = b.origem ? ` origem=${cut(b.origem, 80)}` : '';
  console.log(`[site] ${cut(b.evento, 12)} página=${cut(b.pagina, 80)}${extra}${origem} aparelho=${aparelho}`);
  return new Response(null, { status: 204 });
}
