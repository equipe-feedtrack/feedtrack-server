1. Coleta e Armazenamento de Respostas (Feedback)
História de Usuário:

Como um cliente, eu quero responder um questionário rapidamente pelo WhatsApp para que eu possa avaliar a empresa com facilidade.

Como o sistema, quando o cliente responde, eu salvo essas respostas, porque elas são essenciais para análises futuras.

Como um gestor, eu quero ver todas as respostas recebidas para que eu possa entender a percepção do cliente.

📌 Entidades
Feedback

id, pesquisa_id, pergunta_id, respostaTexto, nota, dataResposta (Criado)

📌 Regras de Negócio
Associar Formulário à Feedback correto

Validar tipo de resposta (nota, texto, múltipla escolha)

📌 Tarefas do Desenvolvedor
 Criar model Resposta

 Validar estrutura do formulário

 Implementar salvamento e versionamento

 Gerar timestamp e vinculação correta

 Cobrir com testes

2. Geração de Relatórios e Observações
História de Usuário:

Como um gestor, eu quero visualizar relatórios com dados dos feedbacks para que eu possa tomar decisões estratégicas.

A fim de agir rapidamente, como um gestor, eu quero receber observações automáticas sobre feedbacks negativos.

Como o sistema, quando a nota for muito baixa, eu gero uma observação automática, porque isso alerta o time para agir.

📌 Entidades
Relatório

id, tipo, filtro, dataGeracao

Observação

id, relatorio_id, conteudo, origem, tipo (manual/automático)

📌 Tarefas do Desenvolvedor
 Criar mecanismos de geração de relatórios

 Criar serviço GerarObservacaoService

 Regras para gerar observações automáticas (ex: nota < 3)

 Criar filtros dinâmicos para relatórios

 Permitir anotações manuais em relatórios

3. Segmentação e Ações de Marketing (DEESEJAVEL - APOS CONCLUIR OS DEMAIS)
História de Usuário:

Como um gestor, eu quero filtrar clientes por tipo de feedback para que eu possa fazer ações específicas de marketing.

Como o sistema, quando um cliente responde com nota alta, eu marco como "promotor", porque ele pode indicar novos clientes.

A fim de melhorar engajamento, como um gestor, eu quero enviar mensagens personalizadas via WhatsApp para cada grupo de clientes.

📌 Entidades
SegmentoCliente (VO) – classificado a partir da nota do feedback

Campanha

id, titulo, mensagem, segmento, status, dataEnvio

📌 Tarefas do Desenvolvedor
 Calcular NPS automaticamente após resposta

 Criar mecanismo de segmentação dinâmica

 Criar entidade e endpoint de campanhas

 Integrar envio de campanhas com API do WhatsApp