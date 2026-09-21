'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import { CircleAlert, Info, Loader2, Lock, ShoppingBag } from 'lucide-react';
import { useCart } from '@/components/cart/CartProvider';
import { CardFields } from '@/components/checkout/CardFields';
import { Field } from '@/components/checkout/Field';
import { OrderConfirmation } from '@/components/checkout/OrderConfirmation';
import { PixPayment } from '@/components/checkout/PixPayment';
import { checkoutConfig, enabledPaymentMethods, type PaymentMethodId } from '@/config/checkout';
import { displayName } from '@/lib/catalog';
import { emptyCard, parseExpiry, validateCard, type CardErrors, type CardFields as CardValues } from '@/lib/card';
import { cn } from '@/lib/cn';
import { brl, maskCep, maskCpf, maskPhone, onlyDigits } from '@/lib/format';
import { buildOrder } from '@/lib/order';
import { preloadBeehive, tokenizeCard, TokenizeError } from '@/lib/payments/beehive-browser';
import { submitCheckout } from '@/lib/payments/client';
import type { CheckoutResult, PixPaymentData } from '@/lib/payments/types';
import { getShippingOptions } from '@/lib/shipping';
import { BR_STATES, validateFields, type CheckoutFields, type FieldErrors } from '@/lib/validation';

const emptyFields: CheckoutFields = {
  name: '', email: '', phone: '', cpf: '', cep: '', street: '', number: '', complement: '', district: '', city: '', state: '',
};

function Step({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <section className="card p-5 sm:p-7" aria-labelledby={`step-${n}`}>
      <h2 id={`step-${n}`} className="mb-5 flex items-center gap-3 text-xl font-bold">
        <span className="grid size-8 place-items-center rounded-full bg-accent font-display text-sm font-bold text-black">{n}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

/** Guarda o Pix na aba para o cliente não perdê-lo se o navegador recarregar (ex.: ao voltar do app do banco). */
const PIX_KEY = 'gamemania:pix:v1';
const PIX_MAX_AGE_MS = 24 * 60 * 60 * 1000;

function savePix(pix: PixPaymentData) {
  try {
    sessionStorage.setItem(PIX_KEY, JSON.stringify({ pix, savedAt: Date.now() }));
  } catch {
    /* armazenamento indisponível: segue sem persistir */
  }
}

function clearPix() {
  try {
    sessionStorage.removeItem(PIX_KEY);
  } catch {
    /* ignora */
  }
}

function loadPix(): PixPaymentData | null {
  try {
    const raw = sessionStorage.getItem(PIX_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw) as { pix?: PixPaymentData; savedAt?: number };
    if (!saved.pix?.transactionId || !saved.savedAt || Date.now() - saved.savedAt > PIX_MAX_AGE_MS) {
      clearPix();
      return null;
    }
    return saved.pix;
  } catch {
    return null;
  }
}

function CorreiosMark() {
  return (
    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white p-1.5" aria-hidden>
      <Image src="/correios-logo.webp" alt="" width={28} height={28} className="h-auto w-full object-contain" />
    </span>
  );
}

export function CheckoutView() {
  const { items, hydrated, clear } = useCart();
  const [fields, setFields] = useState<CheckoutFields>(emptyFields);
  const [payment, setPayment] = useState<PaymentMethodId>(enabledPaymentMethods()[0]?.id ?? 'pix');
  const [shippingMethod, setShippingMethod] = useState<string>('');
  const [accepted, setAccepted] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [cepStatus, setCepStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<CheckoutResult | null>(null);
  const [card, setCard] = useState<CardValues>(emptyCard);
  const [cardErrors, setCardErrors] = useState<CardErrors>({});
  const [installments, setInstallments] = useState(1);
  const lastCep = useRef('');
  const numberRef = useRef<HTMLInputElement>(null);

  const subtotal = useMemo(() => buildOrder(items).subtotal, [items]);
  const shippingOptions = useMemo(() => getShippingOptions(subtotal), [subtotal]);

  // Seleciona a modalidade mais barata (PAC) assim que as opções estiverem disponíveis
  useEffect(() => {
    if (!shippingMethod && shippingOptions[0]) setShippingMethod(shippingOptions[0].id);
  }, [shippingOptions, shippingMethod]);

  const order = useMemo(
    () => buildOrder(items, fields.state, shippingMethod || undefined),
    [items, fields.state, shippingMethod],
  );

  const set = (key: keyof CheckoutFields, mask?: (v: string) => string) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = mask ? mask(e.target.value) : e.target.value;
    setFields((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  // Reabre o Pix pendente se a página foi recarregada
  useEffect(() => {
    const pix = loadPix();
    if (pix) setResult({ status: 'pix', pix });
  }, []);

  // Baixa a biblioteca de tokenização do cartão assim que o cliente escolhe cartão
  useEffect(() => {
    if (payment === 'card') preloadBeehive();
  }, [payment]);

  // Preenchimento automático do endereço pelo CEP (ViaCEP)
  useEffect(() => {
    const cep = onlyDigits(fields.cep);
    if (cep.length !== 8 || cep === lastCep.current) return;
    lastCep.current = cep;
    const controller = new AbortController();
    setCepStatus('loading');
    fetch(`https://viacep.com.br/ws/${cep}/json/`, { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => {
        if (data.erro) {
          setCepStatus('error');
          return;
        }
        setFields((f) => ({
          ...f,
          street: data.logradouro || f.street,
          district: data.bairro || f.district,
          city: data.localidade || f.city,
          state: data.uf || f.state,
        }));
        setErrors((er) => ({ ...er, cep: undefined, street: undefined, district: undefined, city: undefined, state: undefined }));
        setCepStatus('ok');
        numberRef.current?.focus();
      })
      .catch((err) => {
        if (err?.name !== 'AbortError') setCepStatus('error');
      });
    return () => controller.abort();
  }, [fields.cep]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const found: FieldErrors = validateFields(fields);
    if (!accepted) found.accepted = 'Aceite os termos para continuar.';
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      document.getElementById(first)?.focus();
      return;
    }
    if (shippingOptions.length > 0 && !shippingMethod) return;

    if (payment === 'card') {
      const foundCard = validateCard(card);
      setCardErrors(foundCard);
      const firstCard = Object.keys(foundCard)[0];
      if (firstCard) {
        document.getElementById(`card-${firstCard}`)?.focus();
        return;
      }
    }

    setSubmitting(true);
    setResult(null);
    try {
      // Cartão: o navegador troca os dados por um token; só o token vai para o servidor.
      let cardToken: string | undefined;
      if (payment === 'card') {
        const exp = parseExpiry(card.expiry);
        if (!exp) return;
        cardToken = await tokenizeCard({
          number: onlyDigits(card.number),
          holderName: card.holder.trim().toUpperCase(),
          expMonth: exp.month,
          expYear: exp.year,
          cvv: card.cvv,
        });
      }

      const res = await submitCheckout({
        customer: { name: fields.name, email: fields.email, phone: fields.phone, cpf: fields.cpf },
        address: {
          cep: fields.cep, street: fields.street, number: fields.number, complement: fields.complement,
          district: fields.district, city: fields.city, state: fields.state,
        },
        paymentMethod: payment,
        shippingMethod: shippingMethod || undefined,
        items: order.lines.map((l) => ({ slug: l.product.slug, quantity: l.quantity })),
        cardToken,
        installments: payment === 'card' ? installments : undefined,
      });
      if (res.status === 'redirect') {
        window.location.href = res.url;
        return;
      }
      if (res.status === 'pix') savePix(res.pix);
      if (res.status === 'paid' || res.status === 'processing') {
        setCard(emptyCard);
        clear();
      }
      setResult(res);
    } catch (err) {
      if (err instanceof TokenizeError) {
        const messages = {
          config: 'Pagamento com cartão indisponível no momento. Pague com Pix ou fale com o nosso atendimento.',
          load: 'Não foi possível carregar o pagamento seguro. Verifique sua conexão (ou bloqueadores de anúncio) e tente de novo.',
          encrypt: 'Não foi possível validar o cartão. Confira os dados e tente novamente.',
        } as const;
        setResult({ status: 'error', message: messages[err.code] });
      } else {
        setResult({ status: 'error', message: 'Não foi possível processar agora. Verifique sua conexão e tente novamente.' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Telas de depois da compra (vêm antes do resto para funcionar mesmo com o carrinho já limpo)
  if (result?.status === 'pix') {
    return (
      <PixPayment
        pix={result.pix}
        onPaid={(receiptUrl) => {
          clearPix();
          clear();
          setResult({ status: 'paid', transactionId: result.pix.transactionId, receiptUrl });
        }}
        onBack={() => {
          clearPix();
          setResult(null);
        }}
      />
    );
  }
  if (result?.status === 'paid') return <OrderConfirmation transactionId={result.transactionId} receiptUrl={result.receiptUrl} />;
  if (result?.status === 'processing') {
    return <OrderConfirmation pending transactionId={result.transactionId} receiptUrl={result.receiptUrl} message={result.message} />;
  }

  const invalid = (k: keyof FieldErrors) => (errors[k] ? true : undefined);
  const describe = (k: keyof FieldErrors) => (errors[k] ? `${k}-error` : undefined);

  const summary = (
    <div className="card space-y-5 p-5 sm:p-6">
      <h2 className="text-lg font-bold">Resumo do pedido</h2>
      <ul className="divide-y divide-white/10">
        {order.lines.map(({ product, quantity, total }) => (
          <li key={product.slug} className="flex items-center gap-3 py-3 first:pt-0">
            <span className="relative block h-16 w-14 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-white/5">
              <Image src={product.images[0].src} alt="" fill sizes="56px" className="object-cover" />
              <span className="absolute -right-0 -top-0 grid min-w-5 place-items-center rounded-bl-lg bg-accent px-1 text-[0.7rem] font-bold leading-5 text-black">{quantity}</span>
            </span>
            <span className="min-w-0 flex-1 text-sm">
              <span className="block font-display font-semibold leading-snug">{displayName(product)}</span>
              <span className="text-white/50">{product.condition === 'novo' ? 'Novo' : 'Usado'}</span>
            </span>
            <span className="font-display font-bold">{brl(total)}</span>
          </li>
        ))}
      </ul>
      <dl className="space-y-2.5 border-t border-white/10 pt-4 text-sm">
        <div className="flex justify-between text-white/70">
          <dt>Subtotal</dt>
          <dd>{brl(order.subtotal)}</dd>
        </div>
        <div className="flex justify-between text-white/70">
          <dt>Frete</dt>
          <dd className="text-right">
            {order.shipping.amount === null ? order.shipping.label : order.shipping.amount === 0 ? 'Grátis' : brl(order.shipping.amount)}
            {order.shipping.days && <span className="block text-xs font-normal text-white/45">{order.shipping.label} · {order.shipping.days}</span>}
          </dd>
        </div>
        <div className="flex items-baseline justify-between border-t border-white/10 pt-4">
          <dt className="font-display text-base font-semibold">Total</dt>
          <dd className="font-display text-3xl font-bold">{brl(order.total)}</dd>
        </div>
      </dl>
      {order.shipping.amount === null && <p className="text-xs leading-relaxed text-white/50">{checkoutConfig.messages.shippingArrange}</p>}
    </div>
  );

  return (
    <div className="container-x pb-8 pt-8 lg:pt-12">
      <h1 className="mb-8 text-3xl font-bold uppercase tracking-tight sm:text-4xl">Checkout</h1>

      {!hydrated ? (
        <div className="grid gap-8 lg:grid-cols-[1fr_400px]" aria-busy="true" aria-label="Carregando checkout">
          <div className="space-y-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className="skeleton h-56 rounded-card" />
            ))}
          </div>
          <div className="skeleton h-72 rounded-card" />
        </div>
      ) : order.lines.length === 0 ? (
        <div className="card mx-auto flex max-w-xl flex-col items-center gap-5 px-6 py-16 text-center">
          <span className="grid size-20 place-items-center rounded-full border border-white/10 bg-white/[0.04]">
            <ShoppingBag className="size-9 text-accent" aria-hidden />
          </span>
          <div>
            <p className="font-display text-2xl font-bold">Nada para finalizar por aqui</p>
            <p className="mt-2 text-white/60">Adicione um produto ao carrinho para continuar.</p>
          </div>
          <Link href="/#produtos" className="btn btn-primary">
            Ver produtos
          </Link>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate className="grid items-start gap-8 lg:grid-cols-[1fr_400px]">
          <div className="space-y-6">
            <details className="card lg:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 font-display font-semibold [&::-webkit-details-marker]:hidden">
                Resumo do pedido
                <span className="text-accent">{brl(order.total)}</span>
              </summary>
              <div className="border-t border-white/10 p-1">{summary}</div>
            </details>

            <Step n={1} title="Seus dados">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="name" label="Nome completo" error={errors.name} className="sm:col-span-2">
                  <input id="name" name="name" className="field" autoComplete="name" value={fields.name} onChange={set('name')} aria-invalid={invalid('name')} aria-describedby={describe('name')} />
                </Field>
                <Field id="email" label="E-mail" error={errors.email}>
                  <input id="email" name="email" type="email" inputMode="email" className="field" autoComplete="email" value={fields.email} onChange={set('email')} aria-invalid={invalid('email')} aria-describedby={describe('email')} />
                </Field>
                <Field id="phone" label="Telefone / WhatsApp" error={errors.phone}>
                  <input id="phone" name="phone" type="tel" inputMode="tel" className="field" autoComplete="tel-national" placeholder="(00) 00000-0000" value={fields.phone} onChange={set('phone', maskPhone)} aria-invalid={invalid('phone')} aria-describedby={describe('phone')} />
                </Field>
                <Field id="cpf" label="CPF" error={errors.cpf} className="sm:col-span-2">
                  <input id="cpf" name="cpf" inputMode="numeric" className="field sm:max-w-[16rem]" placeholder="000.000.000-00" value={fields.cpf} onChange={set('cpf', maskCpf)} aria-invalid={invalid('cpf')} aria-describedby={describe('cpf')} />
                </Field>
              </div>
            </Step>

            <Step n={2} title="Endereço de entrega">
              <div className="grid gap-4 sm:grid-cols-6">
                <Field id="cep" label="CEP" error={errors.cep || (cepStatus === 'error' ? 'Preencha o endereço manualmente.' : undefined)} className="sm:col-span-2">
                  <div className="relative">
                    <input id="cep" name="cep" inputMode="numeric" className="field pr-11" autoComplete="postal-code" placeholder="00000-000" value={fields.cep} onChange={set('cep', maskCep)} aria-invalid={invalid('cep')} aria-describedby={describe('cep')} />
                    {cepStatus === 'loading' && <Loader2 className="absolute right-3.5 top-1/2 size-5 -translate-y-1/2 animate-spin text-accent" aria-label="Buscando endereço" />}
                  </div>
                </Field>
                <Field id="street" label="Rua / Avenida" error={errors.street} className="sm:col-span-4">
                  <input id="street" name="street" className="field" autoComplete="address-line1" value={fields.street} onChange={set('street')} aria-invalid={invalid('street')} aria-describedby={describe('street')} />
                </Field>
                <Field id="number" label="Número" error={errors.number} className="sm:col-span-2">
                  <input id="number" ref={numberRef} name="number" className="field" inputMode="numeric" autoComplete="address-line2" value={fields.number} onChange={set('number')} aria-invalid={invalid('number')} aria-describedby={describe('number')} />
                </Field>
                <Field id="complement" label="Complemento (opcional)" className="sm:col-span-4">
                  <input id="complement" name="complement" className="field" placeholder="Apto, bloco, referência" value={fields.complement} onChange={set('complement')} />
                </Field>
                <Field id="district" label="Bairro" error={errors.district} className="sm:col-span-3">
                  <input id="district" name="district" className="field" value={fields.district} onChange={set('district')} aria-invalid={invalid('district')} aria-describedby={describe('district')} />
                </Field>
                <Field id="city" label="Cidade" error={errors.city} className="sm:col-span-2">
                  <input id="city" name="city" className="field" autoComplete="address-level2" value={fields.city} onChange={set('city')} aria-invalid={invalid('city')} aria-describedby={describe('city')} />
                </Field>
                <Field id="state" label="Estado" error={errors.state} className="sm:col-span-1">
                  <select id="state" name="state" className="field appearance-none px-3" value={fields.state} onChange={set('state')} aria-invalid={invalid('state')} aria-describedby={describe('state')}>
                    <option value="">UF</option>
                    {BR_STATES.map((uf) => (
                      <option key={uf} value={uf} className="bg-black">{uf}</option>
                    ))}
                  </select>
                </Field>
              </div>
            </Step>

            <Step n={3} title="Frete">
              <fieldset>
                <legend className="sr-only">Escolha a modalidade de envio</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {shippingOptions.map((o) => (
                    <label
                      key={o.id}
                      className={cn(
                        'flex cursor-pointer items-center gap-3 rounded-control border px-4 py-3 transition',
                        shippingMethod === o.id ? 'border-accent bg-accent/[0.08] shadow-[0_0_0_1px_rgb(var(--accent)/0.5)]' : 'border-white/15 bg-white/[0.03] hover:border-white/35',
                      )}
                    >
                      <input type="radio" name="shipping" value={o.id} checked={shippingMethod === o.id} onChange={() => setShippingMethod(o.id)} className="size-4 accent-[rgb(var(--accent))]" />
                      <CorreiosMark />
                      <span className="min-w-0 flex-1">
                        <span className="block font-display font-semibold">{o.label} <span className="font-normal text-white/50">· Correios</span></span>
                        <span className="block text-sm text-white/55">{o.daysMin} a {o.daysMax} dias úteis</span>
                      </span>
                      <span className="shrink-0 font-display font-bold">{o.amount === 0 ? 'Grátis' : brl(o.amount)}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </Step>

            <Step n={4} title="Forma de pagamento">
              <fieldset>
                <legend className="sr-only">Escolha a forma de pagamento</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {enabledPaymentMethods().map((m) => (
                    <label
                      key={m.id}
                      className={cn(
                        'flex min-h-[3.5rem] cursor-pointer items-center gap-3 rounded-control border px-4 py-3 transition',
                        payment === m.id ? 'border-accent bg-accent/[0.08] shadow-[0_0_0_1px_rgb(var(--accent)/0.5)]' : 'border-white/15 bg-white/[0.03] hover:border-white/35',
                      )}
                    >
                      <input type="radio" name="payment" value={m.id} checked={payment === m.id} onChange={() => setPayment(m.id)} className="size-4 accent-[rgb(var(--accent))]" />
                      <span className="font-display font-semibold">{m.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              {checkoutConfig.paymentsEnabled && payment === 'pix' && (
                <p className="mt-4 flex items-start gap-2.5 text-sm text-white/55">
                  <Info className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                  O QR Code e o código Pix copia e cola aparecem na próxima tela, logo depois de finalizar o pedido.
                </p>
              )}
              {checkoutConfig.paymentsEnabled && payment === 'card' && (
                <CardFields
                  value={card}
                  errors={cardErrors}
                  total={order.total}
                  installments={installments}
                  onInstallmentsChange={setInstallments}
                  onChange={(key, next) => {
                    setCard((c) => ({ ...c, [key]: next }));
                    if (cardErrors[key]) setCardErrors((er) => ({ ...er, [key]: undefined }));
                  }}
                />
              )}
              {!checkoutConfig.paymentsEnabled && (
                <p className="mt-4 flex items-start gap-2.5 text-sm text-white/55">
                  <Info className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                  O pagamento online será ativado em breve. Você já pode montar o pedido e conferir os dados.
                </p>
              )}
            </Step>

            <div>
              <label className="flex cursor-pointer items-start gap-3 text-sm text-white/70">
                <input
                  id="accepted"
                  type="checkbox"
                  checked={accepted}
                  onChange={(e) => {
                    setAccepted(e.target.checked);
                    if (e.target.checked) setErrors((er) => ({ ...er, accepted: undefined }));
                  }}
                  className="mt-0.5 size-5 shrink-0 accent-[rgb(var(--accent))]"
                />
                <span>
                  Li e aceito os{' '}
                  <Link href="/termos-de-uso" target="_blank" className="text-accent underline underline-offset-4">Termos de uso</Link>, a{' '}
                  <Link href="/politica-de-privacidade" target="_blank" className="text-accent underline underline-offset-4">Política de privacidade</Link> e a{' '}
                  <Link href="/politica-de-troca" target="_blank" className="text-accent underline underline-offset-4">Política de troca</Link>.
                </span>
              </label>
              {errors.accepted && (
                <p role="alert" className="mt-2 flex items-center gap-1.5 text-sm text-red-300">
                  <CircleAlert className="size-3.5" aria-hidden /> {errors.accepted}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <button type="submit" disabled={submitting} className="btn btn-primary h-14 w-full text-base">
                {submitting ? <Loader2 className="size-5 animate-spin" aria-hidden /> : <Lock className="size-5" aria-hidden />}
                {submitting ? 'Processando…' : 'Finalizar pedido'}
              </button>

              {result && (
                <div
                  role="status"
                  className={cn(
                    'flex items-start gap-3 rounded-card border p-4 text-sm leading-relaxed',
                    result.status === 'error' ? 'border-red-400/40 bg-red-500/10 text-red-100' : 'border-accent/40 bg-accent/[0.08] text-white/85',
                  )}
                >
                  {result.status === 'error' ? <CircleAlert className="mt-0.5 size-5 shrink-0 text-red-300" aria-hidden /> : <Info className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden />}
                  {'message' in result ? result.message : null}
                </div>
              )}
            </div>
          </div>

          <aside className="hidden lg:sticky lg:top-[calc(var(--header-h)+24px)] lg:block" aria-label="Resumo do pedido">
            {summary}
          </aside>
        </form>
      )}
    </div>
  );
}
