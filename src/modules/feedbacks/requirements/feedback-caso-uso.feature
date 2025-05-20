// Dados Incompletos:

Como um Funcionário, eu quero registrar um feedback.

Meta/Desejo: Preencher todos os campos obrigatórios.

Benefício: Garantir que todas as informações necessárias sejam fornecidas para um feedback completo e útil.

Tarefas Técnicas: Validar todos os campos obrigatórios antes de permitir o registro do feedback. Se algum campo estiver em branco, exibir uma mensagem de erro específica e solicitar ao usuário que complete as informações pendentes.

Falha no Armazenamento:

Como um Sistema, eu quero armazenar o feedback no banco de dados.

Meta/Desejo: Salvar os dados do feedback de forma segura e eficiente.

Benefício: Manter um registro confiável e acessível dos feedbacks para análise e tomada de decisões.

Tarefas Técnicas: Implementar mecanismos de segurança e integridade para garantir que o armazenamento do feedback seja robusto. Em caso de falha ao salvar no banco de dados, notificar imediatamente o usuário sobre o problema e oferecer opções para tentar novamente ou reportar o erro para a equipe de suporte técnico.

Validações:

🔹 1. Nome do Cliente
Obrigatoriedade: Não pode estar vazio.

Validação de formato: Deve conter apenas letras, espaços e caracteres comuns (acentos).

Tamanho mínimo: Pelo menos 2 caracteres.

Tamanho máximo: 100 caracteres.

🔹 2. Data do Feedback
Obrigatoriedade: Não pode estar vazia.

Validação de formato: Deve estar em um formato válido (ex: DD/MM/AAAA ou YYYY-MM-DD).

Validação lógica: Não pode ser uma data futura ou muito distante no passado.

🔹 3. Tipo de Feedback (ex: Produto, Atendimento, Entrega)
Obrigatoriedade: Deve ser selecionado.

Validação: Deve corresponder a um dos tipos previamente definidos pelo sistema (lista fechada ou enum).

🔹 4. Descrição do Feedback
Obrigatoriedade: Não pode estar vazia.

Validação de conteúdo: Deve conter informações suficientes para contextualizar o feedback.

Tamanho mínimo: 10 caracteres.

Tamanho máximo: 1000 caracteres.

🔹 5. Nota ou Avaliação Numérica (caso exista, ex: 1 a 5)
Obrigatoriedade: Deve ser fornecida.

Validação de faixa: O valor deve estar entre 1 e 5.

Validação de tipo: Deve ser um número inteiro.

🔹 6. Canal de Atendimento (opcional ou obrigatório, dependendo do sistema)
Validação de valor: Se fornecido, deve corresponder a um dos canais disponíveis (ex: WhatsApp, Telefone, Presencial).