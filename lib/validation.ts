import { isValidCpf, isValidEmail, onlyDigits } from '@/lib/format';

export interface CheckoutFields {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  district: string;
  city: string;
  state: string;
}

export type FieldErrors = Partial<Record<keyof CheckoutFields | 'payment' | 'accepted', string>>;

export const BR_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
  'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
] as const;

/** Usada no navegador (mensagens ao lado dos campos) e no servidor (nunca confie só no front-end). */
export function validateFields(f: CheckoutFields): FieldErrors {
  const e: FieldErrors = {};
  if (f.name.trim().split(/\s+/).filter(Boolean).length < 2) e.name = 'Informe nome e sobrenome.';
  if (!isValidEmail(f.email)) e.email = 'Informe um e-mail válido.';
  const phone = onlyDigits(f.phone);
  if (phone.length < 10 || phone.length > 11) e.phone = 'Informe DDD e telefone.';
  if (!isValidCpf(f.cpf)) e.cpf = 'CPF inválido. Confira os números.';
  if (onlyDigits(f.cep).length !== 8) e.cep = 'Informe um CEP com 8 dígitos.';
  if (!f.street.trim()) e.street = 'Informe a rua.';
  if (!f.number.trim()) e.number = 'Informe o número (ou S/N).';
  if (!f.district.trim()) e.district = 'Informe o bairro.';
  if (!f.city.trim()) e.city = 'Informe a cidade.';
  if (!(BR_STATES as readonly string[]).includes(f.state)) e.state = 'Escolha o estado.';
  return e;
}
