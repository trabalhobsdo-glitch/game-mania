import { store } from '@/data/store';

/**
 * TEXTOS LEGAIS — MODELO.
 * TODO: REVISAR COM RESPONSÁVEL LEGAL antes de publicar a loja.
 * Depois de revisar, mude `legalDraftNotice` para false em data/store.ts.
 */
export interface LegalSection {
  title: string;
  paragraphs: string[];
}
export interface LegalDoc {
  slug: string;
  title: string;
  description: string;
  sections: LegalSection[];
}

const who = `${store.company.legalName || store.name}${store.company.cnpj ? `, CNPJ ${store.company.cnpj}` : ''}`;
const contactLine = store.contact.email ? `pelo e-mail ${store.contact.email}` : 'pelos canais de atendimento informados no rodapé do site';

export const legalDocs: LegalDoc[] = [
  {
    slug: 'politica-de-privacidade',
    title: 'Política de privacidade',
    description: `Como a ${store.name} coleta, usa e protege seus dados pessoais (LGPD).`,
    sections: [
      { title: 'Quem somos', paragraphs: [`Esta loja é operada por ${who}. Somos responsáveis pelo tratamento dos dados pessoais coletados neste site, conforme a Lei Geral de Proteção de Dados (Lei 13.709/2018).`] },
      { title: 'Quais dados coletamos', paragraphs: ['Coletamos os dados que você informa ao comprar ou falar conosco: nome, e-mail, telefone, CPF e endereço de entrega. Também guardamos os itens do carrinho no seu próprio navegador para que você não os perca ao sair da página.'] },
      { title: 'Para que usamos', paragraphs: ['Usamos seus dados para processar e entregar pedidos, emitir documentos fiscais, receber pagamentos, prestar atendimento e cumprir obrigações legais.'] },
      { title: 'Com quem compartilhamos', paragraphs: ['Compartilhamos apenas o necessário com a plataforma de pagamento, transportadoras e serviços de hospedagem do site, além de autoridades quando a lei exigir. Não vendemos seus dados.'] },
      { title: 'Segurança e armazenamento', paragraphs: ['Adotamos medidas técnicas para proteger seus dados e os mantemos pelo tempo necessário para cumprir as finalidades acima e as obrigações legais.'] },
      { title: 'Seus direitos', paragraphs: ['Você pode solicitar a confirmação do tratamento, acesso, correção, anonimização, portabilidade e eliminação dos seus dados, além de revogar consentimentos. Para exercer esses direitos, fale conosco ' + contactLine + '.'] },
      { title: 'Alterações', paragraphs: ['Podemos atualizar esta política. A versão vigente estará sempre disponível nesta página.'] },
    ],
  },
  {
    slug: 'termos-de-uso',
    title: 'Termos de uso',
    description: `Condições para navegar e comprar na ${store.name}.`,
    sections: [
      { title: 'Aceitação', paragraphs: [`Ao usar este site e comprar na ${store.name}, você concorda com estes termos. Se não concordar, não utilize o site.`] },
      { title: 'Produtos e disponibilidade', paragraphs: ['Cada produto informa se é novo ou usado e apresenta fotos. A disponibilidade pode mudar a qualquer momento: produtos indisponíveis não podem ser comprados.'] },
      { title: 'Produtos usados', paragraphs: ['Produtos usados podem apresentar marcas de uso. O estado do produto é descrito na página de cada item e nas fotos da galeria.'] },
      { title: 'Preços e pagamento', paragraphs: ['Os preços estão em reais (R$) e podem ser alterados sem aviso prévio, sem afetar pedidos já confirmados. O pedido só é confirmado após a aprovação do pagamento.'] },
      { title: 'Entrega', paragraphs: ['Enviamos para todo o Brasil. Valor e prazo do frete são informados antes do pagamento e dependem do endereço de entrega.'] },
      { title: 'Marcas de terceiros', paragraphs: ['PlayStation e demais marcas citadas pertencem aos seus respectivos proprietários. A loja é independente e não é afiliada a esses titulares.'] },
      { title: 'Foro', paragraphs: ['Para questões de consumo, fica assegurado ao consumidor o foro de seu domicílio, conforme o Código de Defesa do Consumidor.'] },
    ],
  },
  {
    slug: 'politica-de-troca',
    title: 'Política de troca e devolução',
    description: 'Direito de arrependimento, trocas e devoluções na GAME MANIA.',
    sections: [
      { title: 'Direito de arrependimento (7 dias)', paragraphs: ['Em compras feitas pela internet, você pode desistir do pedido em até 7 dias corridos, contados do recebimento do produto, sem precisar justificar (art. 49 do Código de Defesa do Consumidor). Nesse caso, devolvemos os valores pagos.'] },
      { title: 'Como solicitar', paragraphs: [`Entre em contato ${contactLine}, informando o número do pedido e o motivo. Enviaremos as orientações para a devolução.`] },
      { title: 'Estado do produto na devolução', paragraphs: ['Para desistência, o produto deve ser devolvido com os acessórios recebidos. Produtos usados devem voltar no mesmo estado em que foram entregues.'] },
      { title: 'Defeitos', paragraphs: ['Se o produto apresentar defeito, fale conosco o quanto antes. Os prazos e direitos aplicáveis seguem o Código de Defesa do Consumidor e as condições de garantia informadas na página do produto.'] },
      { title: 'Reembolso', paragraphs: ['O reembolso é feito pelo mesmo meio de pagamento usado na compra, respeitados os prazos da operadora ou instituição financeira.'] },
    ],
  },
];

export const getLegalDoc = (slug: string) => legalDocs.find((d) => d.slug === slug);
