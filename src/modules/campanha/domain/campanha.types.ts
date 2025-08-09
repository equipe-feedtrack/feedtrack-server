export enum TipoCampanha {
  POS_COMPRA = 'POS_COMPRA',
  AUTOMATICO = 'AUTOMATICO',
  PROMOCIONAL = 'PROMOCIONAL',
  SATISFACAO = 'SATISFACAO',
}

export enum SegmentoAlvo {
  TODOS_CLIENTES = 'TODOS_CLIENTES',
  CLIENTES_REGULARES = 'CLIENTES_REGULARES',
  NOVOS_CLIENTES = 'NOVOS_CLIENTES',
  CLIENTES_PREMIUM = 'CLIENTES_PREMIUM',
}

export enum CanalEnvio {
  EMAIL = "EMAIL",
  WHATSAPP = "WHATSAPP",
}

export interface ICampanha {
  id: string;
  titulo: string;
  descricao?: string;
  tipoCampanha: TipoCampanha;
  segmentoAlvo: SegmentoAlvo;
  dataInicio: Date;
  dataFim: Date | null;
  templateMensagem: string;
  canalEnvio: string;
  formularioId: string;
  ativo: boolean; // Campanha é ativa ou inativa
  dataCriacao: Date;
  dataAtualizacao: Date;
  dataExclusao: Date | null; // Para exclusão lógica
  
}

export type CriarCampanhaProps = Omit<ICampanha, 'id' | 'ativo' | 'dataCriacao' | 'dataAtualizacao' | 'dataExclusao'>;
export type RecuperarCampanhaProps = ICampanha;