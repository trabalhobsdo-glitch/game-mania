'use client';

import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/cn';

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max,
  size = 'md',
  label = 'Quantidade',
}: {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max: number;
  size?: 'sm' | 'md';
  label?: string;
}) {
  const btn = cn(
    'grid place-items-center text-white/80 transition hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-30',
    size === 'md' ? 'size-12' : 'size-9',
  );
  return (
    <div
      role="group"
      aria-label={label}
      className={cn('inline-flex items-center overflow-hidden rounded-control border border-white/15 bg-white/[0.04]')}
    >
      <button type="button" className={btn} onClick={() => onChange(value - 1)} disabled={value <= min} aria-label="Diminuir quantidade">
        <Minus className={size === 'md' ? 'size-4' : 'size-3.5'} />
      </button>
      <span
        className={cn('text-center font-display font-semibold tabular-nums', size === 'md' ? 'w-10 text-lg' : 'w-8 text-sm')}
        aria-live="polite"
      >
        {value}
      </span>
      <button type="button" className={btn} onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="Aumentar quantidade">
        <Plus className={size === 'md' ? 'size-4' : 'size-3.5'} />
      </button>
    </div>
  );
}
