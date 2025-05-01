O FeedTrack é um software de gestão empresarial que tem como objetivo 
principal coletar, analisar e fornecer insights sobre o feedback dos clientes em 
relação ao atendimento presencial, qualidade do produto, desempenho dos 
funcionários e outros aspectos relevantes. Ele também gera métricas que ajudam a 
empresa a monitorar seu desenvolvimento e a alinhar estratégias de crescimento. Quem pode ter acesso ao sistema são os funcionários e os administradores (donos, gerentes, setor responsável) cada um com suas devidas delimitações.

Gestão de Experiência e Relacionamento com o Cliente por meio da coleta automatizada de feedbacks e análise de dados.

Funcionários podem registrar, atualizar produtos, cadastrar clientes, registro manual de feedback, envio de formulários e também observações sobre o cliente.

Administrador pode gerenciar funcionários, gerenciar produtos, registrar feedback, criar observações.

Administradores e funcionários são usuários do sistema feedtrack. Os funcionários gerenciam somente suas informações de usuários e os administradores podem gerenciar suas próprias informações e informações de funcionários, se necessário. Funcionários devem possuir status no sistema para fins de controle de acesso e relatórios.


🧩 Contextos Delimitados (Bounded Contexts)

Clientes
Responsável por identificar o cliente, associar a compra e fornecer os dados básicos para envio dos feedbacks.

Feedback & Pesquisa
Gerencia a criação, envio e coleta de pesquisas de satisfação via WhatsApp ou outros canais.

Análise & Relatórios
Processa os dados coletados, gera insights e apresenta relatórios de apoio à gestão.

Comunicação & Engajamento
Cuida da comunicação ativa com o cliente (novidades, eventos, promoções).

🔧 Entidades Principais
Cliente
A pessoa que realizou uma compra e pode receber pesquisas.
Atributos: nome, telefone, email, data_cadastro, preferencias.

Pesquisa (formulários)
Questionário enviado ao cliente.
Atributos: perguntas, tipo, data_envio, status, canal

Resposta
Feedback fornecido pelo cliente.
Atributos: pesquisa_id, cliente_id, respostas, nota_satisfacao, comentario

Relatório
Documento gerado com base nas respostas recebidas.
Atributos: periodo, métricas, observações, recomendações

📦 Objetos de Valor (Value Objects)
Contato (telefone, e-mail validados)
Nota de Satisfação (ex: escala de 0 a 10)
Segmento de Cliente (ex: recorrente, novo, inativo)

🧠 Regras de Negócio (algumas)
Uma pesquisa só pode ser enviada após a confirmação de uma compra.
Um cliente não deve receber a mesma pesquisa mais de uma vez por compra.
Caso um cliente tenha comprado recentemente não deve ser enviado a pesquisa novamente referente a compra por um período mínimo de 7 dias.
Respostas são vinculadas a um cliente e compra específicos.
Relatórios são gerados periodicamente ou sob demanda.

É essencial está em conformidade com a LGPD.
