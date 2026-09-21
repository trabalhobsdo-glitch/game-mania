# GAME MANIA — loja virtual

Loja completa em **Next.js 15 (App Router) + TypeScript + Tailwind CSS**, pronta para subir no GitHub e publicar na Vercel.

- Home em formato de LP: hero, categorias, produtos, confiança, sobre, FAQ e rodapé
- Uma página para cada produto (`/produto/<slug>`), com galeria, zoom, condição (novo/usado) e FAQ
- Carrinho (página + mini-carrinho lateral), salvo no navegador
- Checkout completo (dados, endereço com CEP automático, Pix e cartão) com a **camada de pagamento isolada** (Beehive Pay)
- SEO: metadata e Open Graph por página, Schema.org de produto, sitemap e robots

---

## 1. Rodar no seu computador

Requisitos: Node.js 20 ou superior.

```bash
npm install
npm run dev        # http://localhost:3000
```

Para testar a versão de produção: `npm run build && npm start`.

---

## 2. Onde editar cada coisa

| O que | Arquivo |
|---|---|
| Produtos, preços, descrições, fotos, disponibilidade | `data/products.ts` |
| Nome da loja, WhatsApp, Instagram, e-mail, CNPJ, garantia, textos do hero/sobre/confiança | `data/store.ts` |
| Perguntas frequentes | `data/faq.ts` |
| Pagamento, parcelamento, frete, quantidade máxima por pedido | `config/checkout.ts` |
| Textos legais (privacidade, termos, troca) | `data/legal.ts` |
| Cor neon e medidas do header | `app/globals.css` (variável `--accent`) |
| Fotos | `public/images/produtos/<slug>/1.jpg, 2.jpg…` |

Procure por **`TODO: EDITAR`** no código: são os campos que dependem de você.

### Editar um produto
Abra `data/products.ts` e mude os campos do item. Exemplos:

```ts
price: 147.9,              // preço
available: false,          // false = aparece na loja, mas não pode ser comprado
compareAtPrice: 199.9,     // preço antigo → ativa o selo OFERTA, "de/por" e a página Ofertas
bestSeller: true,          // ativa a categoria "Mais vendidos" (use só se for verdade)
```

### Adicionar um produto novo
1. Copie um item de `data/products.ts` e mude `id`, `slug`, nome, preço e textos.
2. Crie a pasta `public/images/produtos/<slug>/` com as fotos `1.jpg`, `2.jpg`…
3. Pronto: a página `/produto/<slug>` e a entrada na home, na busca e no sitemap são criadas sozinhas.

### Trocar fotos
Substitua os arquivos em `public/images/produtos/<slug>/` mantendo os nomes (`1.jpg` é a foto principal) e ajuste o `alt` de cada uma em `data/products.ts`.

### Trocar a cor neon
Em `app/globals.css`, mude `--accent` (formato `R G B`, separado por espaços). A loja inteira acompanha.

### Ofertas e Mais vendidos
Essas categorias (e o item "Ofertas" do menu) **só aparecem quando existe ao menos um produto** com `compareAtPrice` (ofertas) ou `bestSeller: true`.

### Avaliações
Não existem avaliações inventadas. O campo `reviews` de cada produto começa vazio e a loja mostra "Seja o primeiro a avaliar". Só adicione avaliações reais.

---

## 3. Publicar (GitHub + Vercel)

1. Crie um repositório no GitHub e suba esta pasta (o `.gitignore` já protege `node_modules`, `.next` e `.env`).
2. Na Vercel: **Add New → Project → Import** o repositório. O framework (Next.js) é detectado sozinho; não precisa configurar nada.
3. Em **Settings → Environment Variables**, cadastre `NEXT_PUBLIC_SITE_URL` com o endereço final da loja (ex.: `https://www.seudominio.com.br`). Ela é usada no SEO, no sitemap e no Open Graph.
4. Faça o deploy. Cada `git push` publica de novo automaticamente.

---

## 4. Pagamento (Beehive Pay)

O checkout cobra por **Pix** e **cartão de crédito** pela [Beehive Pay](https://paybeehive.com.br) (API: https://paybeehive.readme.io).

```
app/api/checkout/route.ts          ← recebe o pedido, valida e recalcula preços no servidor
app/api/checkout/status/route.ts   ← consulta se o Pix já foi pago (usada pela tela do Pix)
lib/payments/beehive.ts            ← gateway da Beehive (servidor)
lib/payments/beehive-browser.ts    ← tokenização do cartão (navegador)
lib/payments/index.ts              ← escolhe o gateway pela variável PAYMENT_GATEWAY
config/checkout.ts                 ← paymentsEnabled, métodos, parcelamento, frete
components/checkout/               ← CardFields, PixPayment, OrderConfirmation
.env.example                       ← lista das variáveis necessárias
```

### Como ativar

1. No painel da Beehive (https://app.conta.paybeehive.com.br) abra **Configurações → Credenciais de API** e copie a chave **secreta** e a chave **pública**.
2. Na Vercel (**Settings → Environment Variables**) cadastre:

| Variável | Valor |
|---|---|
| `PAYMENT_GATEWAY` | `beehive` |
| `BEEHIVE_SECRET_KEY` | chave secreta (nunca no GitHub) |
| `NEXT_PUBLIC_BEEHIVE_PUBLIC_KEY` | chave pública |
| `NEXT_PUBLIC_BEEHIVE_TEST_MODE` | `false` (ou `true` só se a Beehive orientar) |
| `BEEHIVE_API_URL` | opcional: só se a Beehive passar uma URL de sandbox |

3. Faça um **novo deploy** (Deployments → Redeploy). As variáveis `NEXT_PUBLIC_…` só entram no site durante o build.
4. Em `config/checkout.ts`, deixe `paymentsEnabled: true`.

### Como funciona

- **Pix:** o servidor cria a transação e a loja mostra o QR Code e o "copia e cola". A tela consulta o pagamento sozinha e, quando cai, mostra a confirmação. Se o navegador recarregar (ex.: ao voltar do app do banco), o Pix continua na tela.
- **Cartão:** o navegador troca os dados do cartão por um token (biblioteca da Beehive) e só o token vai ao servidor. **O número do cartão nunca passa pela loja.**
- **Total:** sempre recalculado no servidor a partir do catálogo. A Beehive não soma o campo de frete ao total, então o frete é enviado como um item ("Frete PAC/SEDEX").
- **Pedidos:** a loja não tem banco de dados. Os pedidos (cliente, endereço, itens, status) ficam no painel da Beehive.
- **Erros:** o detalhe técnico aparece em **Vercel → Logs**, prefixado com `[beehive]` ou `[checkout]`.

### Testar antes de divulgar

1. Faça um pedido de valor baixo por Pix e confira no painel da Beehive se o **valor total** bate com o da loja (produto + frete).
2. Pague e veja a tela virar "Pagamento confirmado".
3. Repita com cartão. Se a Beehive tiver cartões de teste, use-os.

Segurança já incluída: o servidor **ignora preços vindos do navegador**, recalcula o total pelo catálogo, recusa produtos indisponíveis, aceita só as formas de pagamento habilitadas e valida CPF, e-mail, telefone e endereço.

### Frete
Em `config/checkout.ts` há três modos: `arrange` (a combinar), `fixed` (valor único) e `by-region` (valor por estado). Para calcular por CEP com Correios ou Melhor Envio, troque a função em `lib/shipping.ts` por uma consulta ao serviço.

---

## 5. Antes de divulgar a loja (checklist)

- [ ] Conferir TikTok, e-mail e horário em `data/store.ts` (WhatsApp e Instagram são opcionais: só aparecem no rodapé se preenchidos)
- [ ] Preencher razão social e CNPJ em `data/store.ts`
- [ ] Escrever a garantia dos novos e dos usados em `data/store.ts` (`warranty`)
- [ ] Conferir as descrições, "o que acompanha" e "estado do produto" de cada item em `data/products.ts`
- [ ] Conferir qual foto pertence a qual Game Stick (veja o comentário nos produtos 3 e 4)
- [ ] Revisar `data/faq.ts` e os textos legais com um responsável legal; depois `legalDraftNotice: false`
- [ ] Definir o frete em `config/checkout.ts`
- [ ] Cadastrar as chaves da Beehive na Vercel, refazer o deploy e testar Pix e cartão (seção 4)
- [ ] Cadastrar `NEXT_PUBLIC_SITE_URL` na Vercel

---

## Estrutura

```
app/            rotas (home, produto, categoria, carrinho, checkout, legais, api, sitemap, robots)
components/     interface (layout, home, product, cart, checkout, ui)
data/           produtos, loja, FAQ, textos legais
config/         checkout, pagamento e frete
lib/            catálogo, pedido, frete, validação, formatação, pagamentos
public/         logo, imagem de compartilhamento e fotos dos produtos
```
