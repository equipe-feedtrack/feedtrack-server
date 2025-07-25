"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pergunta_entity_1 = require("@modules/formulario/domain/pergunta/domain/pergunta.entity");
const pergunta_map_1 = require("@modules/formulario/mappers/pergunta.map");
const domain_exception_1 = require("@shared/domain/domain.exception");
const fs_1 = require("fs");
// ENVIANDO POR EMAIL O FORMULARIO.
// async function main() {
//     const pessoa = new Pessoa({
//   nome: "João",
//   email: "joao@email.com",
//   telefone: "12345678"
// });
//     // 1. Criar o cliente
//   const cliente = Cliente.criarCliente({
//     pessoa,
//     cidade: "Aracaju",
//     vendedorResponsavel: "Yago",
//     produtos: [
//       {
//         nome: "Tênis de corrida",
//         descricao: "Tênis profissional para quem já tem experiência",
//         valor: 320
//       }
//     ]
//   });
//   // 2. somente dados essenciais de Cliente
//   const dadosEssenciais = cliente.recuperarDadosEssenciais();
//   // 2. Criar o formulário com as perguntas e cliente
//   const formulario = new Formulario({
//     titulo: "Pesquisa de Satisfação",
//     descricao: "Queremos saber sua opinião!",
//     perguntas: [
//       new Pergunta({ texto: "Você gostou do atendimento?", tipo: "texto", ordem: 1 }),
//       new Pergunta({ texto: "Indicaria para um amigo?", tipo: "multipla_escolha", opcoes: ['não', 'talvez', 'posso indicar'],ordem: 2})
//     ],
//     cliente: dadosEssenciais// 🔥 aqui está a correção principal
//   });
//   // 3. Executar o envio
//   const envioService = new EnvioFormularioService();
//   const enviarUseCase = new EnviarFormularioUseCase(envioService);
//   await enviarUseCase.execute({
//     destinatario: "cliente@exemplo.com",
//     formulario,
//     canal: "email",
//   });
//   console.log("✅ Formulário enviado com sucesso!");
// }
// main().catch((err) => {
//   console.error("❌ Erro ao enviar o formulário:", err);
// })
// RELACIONADO AO MODULO PERGUNTA! (YAGO)
// // Criando  e recuperando  perguntas.
function test() {
    try {
        const pergunta = pergunta_entity_1.Pergunta.criar({ texto: 'Como você avalia sua experiência geral?', tipo: 'nota', opcoes: ["1", "2", "3"] });
        console.log(pergunta);
        let propspergunta = {
            id: '4ede92e2-5a0c-4b0c-85d7-c4eed09ee7a5',
            texto: 'fale de sua experiência',
            tipo: 'texto',
        };
        let pergunta2 = pergunta_entity_1.Pergunta.recuperar(propspergunta);
        console.log(pergunta2);
        //////////////////////////////////////////////////////
        //Persistinto e Recuperando em Arquivo - File System//
        //////////////////////////////////////////////////////
        let arrayperguntas = [];
        arrayperguntas.push(pergunta.toDTO());
        arrayperguntas.push(pergunta2.toDTO());
        (0, fs_1.writeFile)('perguntas.json', JSON.stringify(arrayperguntas), function (error) {
            if (error)
                throw error;
            console.log('Arquivo Salvo com Sucesso!');
            (0, fs_1.readFile)('perguntas.json', (error, dadoGravadoArquivo) => {
                if (error)
                    throw error;
                console.log('Leitura de Arquivo!');
                let categoriasSalvas = JSON.parse(dadoGravadoArquivo.toString());
                categoriasSalvas.forEach(categoriaJSON => {
                    console.log(categoriaJSON);
                    console.log(pergunta_map_1.PerguntaMap.toDomain(categoriaJSON));
                });
            });
        });
    }
    catch (error) {
        if (error instanceof domain_exception_1.DomainException) {
            console.log('Execeção de Dominio');
            console.log(error.message);
        }
        else {
            console.log('Outras Exceções');
            console.log(error.message);
        }
    }
}
test();
// Testando Feedback (AINDA NÃO MEXI, APENAS CONTEÚDO GENÉRICO DE FEEDBACK - YAGO)
// const feedback = Feedback.criar({
//   formulario_id: 'form123',
//   pergunta_id: 11,
//   resposta_texto: 'gostei bastante!',
//   nota: 9,
//    data_resposta: new Date()  // opcional
// });
// console.log(feedback)
// Cleilson.
// import express from 'express';
// import { PrismaClient } from '@prisma/client';
// const app = express();
// const prisma = new PrismaClient();
// // Permite receber JSON no corpo das requisições
// app.use(express.json());
// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });
// app.post('/cadastro-usuario', async (req, res) => {
//   const { nome, telefone } = req.body;
//   try {
//     const novoUsuario = await prisma.clientes.create({
//       data: {
//         nome,
//         telefone,
//       },
//     });
//     res.status(201).json(novoUsuario);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ erro: 'Erro ao cadastrar o usuário' });
//   }
// });
// app.get('/ver-dados', async (req, res) => {
//     try {
//       const dados = await prisma.clientes.findMany({
//         select: {
//           nome: true,
//           telefone: true
//         }
//       });
//       res.json(dados);
//     } catch (error) {
//       console.error('Erro ao buscar dados:', error);
//       res.status(500).json({ erro: 'Erro ao buscar dados' });
//     }
//   });
// app.listen(3000, () => {
//   console.log('Server is running on http://localhost:3000');
// });
//# sourceMappingURL=index.js.map