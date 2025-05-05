🔻 Fluxos de Exceção – Geração de Relatórios
1. Dados Indisponíveis
Cenário: O sistema tenta gerar um relatório, mas os dados de feedback ou vendas não estão disponíveis.

Ação do Sistema: Exibir mensagem: "Não há dados suficientes para gerar o relatório." e impedir a continuidade da geração.

Resolução Sugerida: Orientar o usuário a verificar filtros ou período selecionado.

2. Erro na Geração do Relatório
Cenário: Ocorre uma falha ao processar ou consolidar os dados.

Ação do Sistema: Exibir erro genérico com ID de rastreio (ex: código de erro) e permitir que o usuário tente novamente.

Resolução Sugerida: Recomendar nova tentativa ou acionar suporte técnico se o erro persistir.

3. Formato Inválido
Cenário: O usuário seleciona um formato de exportação ou visualização não suportado (ex: .exe).

Ação do Sistema: Exibir alerta: "Formato inválido. Por favor, selecione PDF, Excel ou CSV."

Resolução Sugerida: Reforçar os formatos válidos no seletor.

🆕 Fluxos de Exceção Adicionais Sugeridos
4. Intervalo de Datas Inválido
Cenário: O usuário seleciona uma data de início maior que a data de fim.

Ação do Sistema: Exibir mensagem de validação: "A data inicial não pode ser posterior à data final."

Resolução Sugerida: Impedir envio e solicitar correção das datas.

5. Filtro de Dados Inexistente
Cenário: O usuário seleciona filtros (ex: categoria de produto, unidade, período) que não retornam nenhum dado.

Ação do Sistema: Informar: "Nenhum dado encontrado com os filtros selecionados."

Resolução Sugerida: Sugerir ajuste nos filtros.

6. Permissão Insuficiente
Cenário: Um usuário sem privilégios tenta acessar ou gerar um relatório restrito (ex: dados financeiros).

Ação do Sistema: Exibir mensagem: "Você não tem permissão para gerar este relatório."

Resolução Sugerida: Bloquear acesso e sugerir contato com o administrador.

7. Tempo de Resposta Excedido
Cenário: O sistema leva tempo demais para processar grandes volumes de dados.

Ação do Sistema: Informar: "Tempo de geração excedido. Tente novamente mais tarde."

Resolução Sugerida: Dividir por períodos menores ou permitir geração assíncrona (por e-mail).

📌 Fluxos de Exceção com Validações – Geração de Relatórios
1. Dados Indisponíveis
Fluxo de Exceção (Linguagem de Domínio):
Se os dados de feedback ou vendas não estiverem disponíveis para o período ou filtros selecionados, o sistema exibirá uma mensagem de falha e não permitirá a geração do relatório.

Validações:

Verificar se a consulta retorna dados antes de iniciar a geração.

Validar que ao menos um registro existe no resultado.

exemplo:
if dados.isEmpty():
    mostrarErro("Não há dados suficientes para gerar o relatório.")
    bloquearAção()
2. Erro na Geração do Relatório
Fluxo de Exceção:
Se ocorrer um erro durante o processamento do relatório, o sistema exibirá uma mensagem e oferecerá a opção de tentar novamente.

Validações:

Capturar exceções de consolidação, agregação e escrita de arquivos.

Tentar rollback ou reinicialização do processo.

exemplo:
try:
    gerarRelatorio()
except Exception:
    mostrarErro("Erro ao gerar relatório. Tente novamente.")
3. Formato Inválido
Fluxo de Exceção:
Se o usuário selecionar um formato de exportação não suportado, o sistema informará o erro e solicitará a seleção de um formato válido.

Validações:

Verificar se o formato está dentro da lista permitida (ex: PDF, XLSX, CSV).

exemplo:
formatosValidos = ["pdf", "xlsx", "csv"]
if formatoSelecionado not in formatosValidos:
    mostrarErro("Formato inválido. Selecione PDF, Excel ou CSV.")
4. Intervalo de Datas Inválido
Fluxo de Exceção:
Se a data inicial for posterior à data final, o sistema não permitirá continuar e informará o usuário.

Validações:

Comparar data_inicial < data_final.

exemplo:
if dataInicio > dataFim:
    mostrarErro("A data inicial não pode ser maior que a data final.")
5. Filtros Sem Retorno
Fluxo de Exceção:
Se os filtros aplicados retornarem zero registros, o sistema avisará que não foram encontrados dados.

Validações:

Executar a consulta e verificar o total de resultados.

exemplo:
if resultadoConsulta.count == 0:
    mostrarErro("Nenhum dado encontrado com os filtros aplicados.")
6. Permissão Insuficiente
Fluxo de Exceção:
Se o usuário tentar acessar um tipo de relatório para o qual não possui permissão, o sistema bloqueará o acesso e informará.

Validações:

Verificar as permissões do usuário antes de permitir a ação.

exemplo:
if not usuario.temPermissao("ver_relatorio_financeiro"):
    mostrarErro("Você não tem permissão para visualizar este relatório.")
7. Tempo de Resposta Excedido
Fluxo de Exceção:
Se o sistema demorar demais para gerar o relatório, será exibida uma mensagem de timeout.

Validações:

Definir timeout máximo e tratá-lo caso ocorra.

exemplo:
if tempoExecucao > tempoMaximo:
    mostrarErro("Tempo de geração excedido. Reduza o intervalo de datas ou tente mais tarde.")