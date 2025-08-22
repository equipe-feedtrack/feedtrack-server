import { CanalEnvio } from '@prisma/client';

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



export interface ICampanha {
  id: string;
  titulo: string;
<<<<<<< HEAD
  descricao: string | null;
  tipoCampanha: TipoCampanha;
  segmentoAlvo: SegmentoAlvo;
  dataInicio: Date;
  dataFim: Date | null;
  templateMensagem: string;
=======
  descricao?: string;
  templateMensagem?: string ;
>>>>>>> develop
  canalEnvio: CanalEnvio; // Canal de envio da campanha
  formularioId: string;
  empresaId: string;
  dataCriacao: Date;
  dataAtualizacao: Date;
  dataExclusao: Date | null; // Para exclusão lógica
  
}

export type CriarCampanhaProps = Omit<ICampanha, 'id' | 'ativo' | 'dataCriacao' | 'dataAtualizacao' | 'dataExclusao'>;
export type RecuperarCampanhaProps = ICampanha;
export { CanalEnvio };