'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { ConditionBadge } from '@/components/ui/ConditionBadge';
import { SmartImage } from '@/components/ui/SmartImage';
import { cn } from '@/lib/cn';
import { useEscape, useLockBody } from '@/lib/useLockBody';
import type { Product } from '@/lib/types';

export function ProductGallery({ product }: { product: Product }) {
  const { images } = product;
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const [lightbox, setLightbox] = useState(false);
  const current = images[index];
  const many = images.length > 1;

  const go = useCallback((dir: 1 | -1) => setIndex((i) => (i + dir + images.length) % images.length), [images.length]);

  useLockBody(lightbox);
  useEscape(lightbox, () => setLightbox(false));
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, go]);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setLightbox(true);
    }
  };

  const arrow =
    'absolute top-1/2 z-20 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur transition hover:border-accent hover:text-accent';

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        aria-label="Ampliar imagem do produto"
        onPointerMove={onMove}
        onPointerLeave={() => setZoom(null)}
        onClick={() => setLightbox(true)}
        onKeyDown={onKeyDown}
        className="group relative aspect-[4/5] cursor-zoom-in overflow-hidden rounded-card border border-white/10 bg-white/[0.04]"
      >
        <SmartImage
          key={current.src}
          src={current.src}
          alt={current.alt}
          fill
          priority={index === 0}
          sizes="(min-width: 1024px) 560px, 100vw"
          className={cn('transition-transform duration-200 ease-out', current.fit === 'contain' ? 'object-contain' : 'object-cover')}
          style={zoom ? { transform: 'scale(2)', transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
        />
        <div className="absolute left-3 top-3 z-10">
          <ConditionBadge condition={product.condition} />
        </div>
        <span className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs text-white/80 backdrop-blur">
          <ZoomIn className="size-3.5" aria-hidden />
          Ampliar
        </span>
        {many && (
          <>
            <button type="button" aria-label="Foto anterior" className={cn(arrow, 'left-3')} onClick={(e) => { e.stopPropagation(); go(-1); }}>
              <ChevronLeft className="size-5" />
            </button>
            <button type="button" aria-label="Próxima foto" className={cn(arrow, 'right-3')} onClick={(e) => { e.stopPropagation(); go(1); }}>
              <ChevronRight className="size-5" />
            </button>
          </>
        )}
      </div>

      {many && (
        <ul className="mt-3 flex gap-3 overflow-x-auto pb-1" aria-label="Miniaturas">
          {images.map((img, i) => (
            <li key={img.src} className="shrink-0">
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Ver foto ${i + 1} de ${images.length}`}
                aria-current={i === index}
                className={cn(
                  'relative block h-[5.5rem] w-[4.4rem] overflow-hidden rounded-xl border-2 bg-white/5 transition',
                  i === index ? 'border-accent shadow-glow' : 'border-white/10 opacity-70 hover:border-white/40 hover:opacity-100',
                )}
              >
                <Image src={img.src} alt="" fill sizes="72px" className={img.fit === 'contain' ? 'object-contain' : 'object-cover'} />
              </button>
            </li>
          ))}
        </ul>
      )}

      {lightbox && (
        <div className="fixed inset-0 z-[90] animate-fade-in bg-black/95" role="dialog" aria-modal="true" aria-label="Galeria de fotos">
          <button aria-label="Fechar" onClick={() => setLightbox(false)} className="absolute right-4 top-4 z-10 grid size-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20">
            <X className="size-6" />
          </button>
          <div className="absolute inset-0" onClick={() => setLightbox(false)}>
            <Image src={current.src} alt={current.alt} fill sizes="100vw" quality={90} className="object-contain p-4 sm:p-10" />
          </div>
          {many && (
            <>
              <button aria-label="Foto anterior" onClick={() => go(-1)} className={cn(arrow, 'left-3 sm:left-6')}>
                <ChevronLeft className="size-5" />
              </button>
              <button aria-label="Próxima foto" onClick={() => go(1)} className={cn(arrow, 'right-3 sm:right-6')}>
                <ChevronRight className="size-5" />
              </button>
              <p className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-1.5 text-sm text-white/80">
                {index + 1} / {images.length}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
