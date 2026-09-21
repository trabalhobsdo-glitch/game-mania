'use client';

import { Lock } from 'lucide-react';
import { Field } from '@/components/checkout/Field';
import { checkoutConfig } from '@/config/checkout';
import { maskCardNumber, maskCvv, maskExpiry, type CardErrors, type CardFields as CardValues } from '@/lib/card';
import { brl } from '@/lib/format';

/** Campos do cartão de crédito. Os dados só são usados no navegador, para gerar o token da Beehive. */
export function CardFields({
  value,
  errors,
  onChange,
  total,
  installments,
  onInstallmentsChange,
}: {
  value: CardValues;
  errors: CardErrors;
  onChange: (key: keyof CardValues, next: string) => void;
  total: number;
  installments: number;
  onInstallmentsChange: (n: number) => void;
}) {
  const { enabled, max } = checkoutConfig.installments;
  const invalid = (k: keyof CardValues) => (errors[k] ? true : undefined);
  const describe = (k: keyof CardValues) => (errors[k] ? `card-${k}-error` : undefined);

  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2">
      <Field id="card-number" label="Número do cartão" error={errors.number} className="sm:col-span-2">
        <input
          id="card-number"
          name="cc-number"
          inputMode="numeric"
          autoComplete="cc-number"
          placeholder="0000 0000 0000 0000"
          className="field"
          value={value.number}
          onChange={(e) => onChange('number', maskCardNumber(e.target.value))}
          aria-invalid={invalid('number')}
          aria-describedby={describe('number')}
        />
      </Field>
      <Field id="card-holder" label="Nome impresso no cartão" error={errors.holder} className="sm:col-span-2">
        <input
          id="card-holder"
          name="cc-name"
          autoComplete="cc-name"
          className="field uppercase"
          value={value.holder}
          onChange={(e) => onChange('holder', e.target.value)}
          aria-invalid={invalid('holder')}
          aria-describedby={describe('holder')}
        />
      </Field>
      <Field id="card-expiry" label="Validade" error={errors.expiry}>
        <input
          id="card-expiry"
          name="cc-exp"
          inputMode="numeric"
          autoComplete="cc-exp"
          placeholder="MM/AA"
          className="field"
          value={value.expiry}
          onChange={(e) => onChange('expiry', maskExpiry(e.target.value))}
          aria-invalid={invalid('expiry')}
          aria-describedby={describe('expiry')}
        />
      </Field>
      <Field id="card-cvv" label="CVV" error={errors.cvv}>
        <input
          id="card-cvv"
          name="cc-csc"
          inputMode="numeric"
          autoComplete="cc-csc"
          placeholder="123"
          className="field"
          value={value.cvv}
          onChange={(e) => onChange('cvv', maskCvv(e.target.value))}
          aria-invalid={invalid('cvv')}
          aria-describedby={describe('cvv')}
        />
      </Field>

      {enabled && max > 1 && (
        <Field id="card-installments" label="Parcelas" className="sm:col-span-2">
          <select
            id="card-installments"
            className="field appearance-none"
            value={installments}
            onChange={(e) => onInstallmentsChange(Number(e.target.value))}
          >
            {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n} className="bg-black">
                {n}x de {brl(total / n)}
              </option>
            ))}
          </select>
        </Field>
      )}

      <p className="flex items-start gap-2 text-xs leading-relaxed text-white/45 sm:col-span-2">
        <Lock className="mt-0.5 size-3.5 shrink-0 text-accent" aria-hidden />
        Os dados do cartão são criptografados no seu navegador e enviados direto à Beehive Pay. A loja não guarda nem vê o número do cartão.
      </p>
    </div>
  );
}
