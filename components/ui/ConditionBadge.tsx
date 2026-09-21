import { cn } from '@/lib/cn';
import type { Condition } from '@/lib/types';

export function ConditionBadge({ condition, className }: { condition: Condition; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 font-display text-[0.7rem] font-bold uppercase leading-none tracking-wider',
        condition === 'novo' ? 'bg-accent text-black' : 'bg-black/60 text-white ring-1 ring-white/30 backdrop-blur',
        className,
      )}
    >
      {condition === 'novo' ? 'Novo' : 'Usado'}
    </span>
  );
}
