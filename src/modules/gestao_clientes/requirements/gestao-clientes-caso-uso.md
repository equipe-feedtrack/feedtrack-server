Como um gestor, eu quero cadastrar novos clientes para que eu possa enviar pesquisas personalizadas após uma venda.

Como um gestor, eu posso registrar informações de contato dos clientes para que o sistema envie mensagens automatizadas corretamente.

A fim de garantir uma boa comunicação, como um gestor, eu quero armazenar telefone e nome corretamente.

Como um gestor, quando recebo dados de uma nova venda, eu registro o cliente no sistema, porque preciso acompanhar o relacionamento desde o início.

📌 Modelos/Entidades
Cliente

id: UUID

nome: string

telefone: string

email: string (opcional)

cidade: string

vendedorResponsavel: string

dataCadastro: datetime

📌 Validações
Telefone obrigatório e único

Nome obrigatório

Validação de formato (e-mail, telefone)

📌 Regras de Negócio
Não permitir duplicação de telefone

Associar cliente a vendedor, se informado

Registrar dataCadastro automaticamente