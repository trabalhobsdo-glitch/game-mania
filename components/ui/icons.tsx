import { CreditCard, Flame, Gamepad2, Headset, Joystick, Lock, Star, Truck, type LucideProps } from 'lucide-react';

const trustIcons = {
  truck: Truck,
  lock: Lock,
  card: CreditCard,
  gamepad: Gamepad2,
  headset: Headset,
} as const;

const categoryIcons = {
  gamepad: Gamepad2,
  joystick: Joystick,
  flame: Flame,
  star: Star,
} as const;

export function TrustIcon({ name, ...props }: { name: string } & LucideProps) {
  const Icon = trustIcons[name as keyof typeof trustIcons] ?? Gamepad2;
  return <Icon aria-hidden {...props} />;
}

export function CategoryIcon({ name, ...props }: { name: string } & LucideProps) {
  const Icon = categoryIcons[name as keyof typeof categoryIcons] ?? Gamepad2;
  return <Icon aria-hidden {...props} />;
}
