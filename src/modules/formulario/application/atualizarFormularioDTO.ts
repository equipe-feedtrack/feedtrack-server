interface AtualizarFormularioDTO {
  titulo?: string;
  descricao?: string;
  perguntas?: AtualizarPerguntaDTO[];
  ativo?: boolean;
}

interface AtualizarPerguntaDTO {
  id: string;              // importante para identificar qual pergunta atualizar
  texto?: string;
  tipo?: 'texto' | 'nota' | 'multipla_escolha';
  opcoes?: string[];       // só se aplicável ao tipo
}