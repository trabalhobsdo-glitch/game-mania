import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container-x flex min-h-[55vh] flex-col items-center justify-center gap-5 py-20 text-center">
      <p className="font-display text-7xl font-bold text-accent">404</p>
      <h1 className="text-2xl font-bold sm:text-3xl">Página não encontrada</h1>
      <p className="max-w-md text-white/60">O endereço que você acessou não existe ou o produto saiu do ar.</p>
      <Link href="/#produtos" className="btn btn-primary">
        Ver produtos
      </Link>
    </div>
  );
}
