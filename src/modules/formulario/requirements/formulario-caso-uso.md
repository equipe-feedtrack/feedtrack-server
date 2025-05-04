🎯 Objetivo
Gerenciar a criação, estrutura e envio de formulários com perguntas padronizadas ou personalizadas para clientes. Suporta uso em pesquisas, campanhas e comunicação com novidades.

📚 Conceitos Essenciais (Ubiquitous Language)
Termo	Descrição
Formulário	Estrutura que agrupa perguntas a serem enviadas ao cliente. Pode ser reutilizado.
Pergunta	Item individual do formulário. Pode ser de nota, texto livre, múltipla escolha, etc.
Modelo de Formulário	Um template reutilizável, como "Padrão Pós-Venda", "Lançamento de Produto".
Personalização	Permite editar o conteúdo do formulário para um público ou cliente específico.
Destinatário	Cliente ou grupo de clientes que irá receber o formulário.

Envio de Questionários via WhatsApp
História de Usuário:

Como um gestor, eu quero enviar questionários automáticos via WhatsApp após uma venda para que os clientes possam avaliar o atendimento.

A fim de aumentar o retorno das avaliações, como um gestor, eu quero que os questionários sejam enviados de forma simples e automática.

Como o sistema, quando uma venda é registrada, eu envio uma pesquisa ao cliente, porque é importante medir a experiência logo após o contato.

🏗️ Entidades
📄 Formulario
id

titulo

descricao

modelo_padrao (bool)

ativo (bool)

data_criacao

📄 Pergunta
id

formulario_id

texto

tipo (nota, texto, múltipla_escolha)

opcoes (array, se aplicável)

ordem

📄 EnvioFormulario
id

formulario_id

cliente_id

canal (whatsapp, email)

status_envio (pendente, enviado, respondido)

data_envio

🚀 Casos de Uso e Histórias de Usuário
✅ Criar Modelo de Formulário Padrão
Como um gestor, eu quero criar um modelo padrão de formulário com perguntas frequentes para que ele seja reaproveitado em múltiplas campanhas.

✅ Personalizar Formulário para Cliente
Como um gestor, eu posso editar perguntas de um formulário antes de enviá-lo para um cliente para que ele se adapte ao contexto da campanha.

✅ Enviar Formulário com Novidades
Como um gestor, eu quero enviar um formulário com novidades para clientes segmentados para que eu possa obter feedback ou engajamento.


⚙️ Regras de Negócio
Cada formulário pode ter perguntas obrigatórias ou opcionais.

É possível usar um modelo como base e gerar uma versão personalizada.

Um formulário pode ser enviado apenas para clientes ativos e com canal disponível.

O envio precisa ser registrado para rastrear respostas.

🔁 Integrações
📤 Com o subdomínio Cliente (para selecionar destinatários)

📬 Com o subdomínio Feedback (para registrar respostas recebidas)

📈 Com o subdomínio Relatórios (para análises futuras)

📄 Histórias de Usuário – Subdomínio: Formulário
1. Criação de Modelo de Formulário Padrão
Como um gestor, eu quero criar um formulário com perguntas frequentes de modo que eu possa reutilizá-lo em diversas pesquisas e campanhas.

Como um gestor, eu quero cadastrar perguntas em sequência em um formulário para que o questionário seja organizado e claro para o cliente.

A fim de padronizar a coleta de feedbacks, como um gestor, eu quero ter modelos reutilizáveis de formulários.

Como gestor, quando estou configurando uma nova campanha, eu seleciono um modelo de formulário existente, porque isso agiliza o processo.

Como um gestor, eu posso definir perguntas padrão em um formulário para que todas as campanhas mantenham consistência nos dados coletados.

2. Personalização do Formulário
Como um gestor, eu quero editar o conteúdo de um formulário de modo que ele fique adequado à campanha específica que estou conduzindo.

Como um gestor, eu posso ajustar perguntas para um público específico para que as respostas sejam mais relevantes e direcionadas.

A fim de personalizar a comunicação com o cliente, como um gestor, eu quero adaptar o formulário antes do envio.

Como gestor, quando uma campanha exige abordagem diferente, eu edito o formulário base, porque isso melhora o engajamento do cliente.

Como um gestor, eu posso alterar a ordem e o tipo das perguntas para que o formulário fique mais dinâmico e atraente.

3. Envio de Formulário com Novidades ou Pesquisa
Como um gestor, eu quero enviar formulários com perguntas ou novidades aos clientes de modo que eu obtenha respostas e mantenha contato ativo.

Como um gestor, eu posso disparar formulários via WhatsApp para que o cliente receba diretamente no canal que mais utiliza.

A fim de manter o cliente atualizado, como um gestor, eu quero incluir seções de informação e perguntas no mesmo formulário.

Como gestor, quando uma nova funcionalidade é lançada, eu envio um formulário com novidades, porque isso gera proximidade com o cliente.

Como um gestor, eu posso configurar campanhas com formulários personalizados para que os clientes recebam conteúdo relevante.