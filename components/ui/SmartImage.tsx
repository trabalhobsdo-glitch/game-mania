'use client';

import Image, { type ImageProps } from 'next/image';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/cn';

/**
 * Imagem com estado de carregamento (skeleton) — o pai precisa ser `relative`.
 * Aparece com fade quando termina de carregar.
 */
export function SmartImage({ className, ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false);

  // Segurança: se o evento onLoad se perder, libera a imagem depois de alguns segundos.
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <span
        aria-hidden
        className={cn('skeleton absolute inset-0 transition-opacity duration-500', loaded && 'opacity-0')}
      />
      <Image
        {...props}
        onLoad={() => setLoaded(true)}
        className={cn('transition-opacity duration-500', loaded ? 'opacity-100' : 'opacity-0', className)}
      />
    </>
  );
}
