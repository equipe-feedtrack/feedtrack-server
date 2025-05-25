import { Pergunta } from '@modules/formulario/domain/pergunta/pergunta.entity';
import { RecuperarPerguntaProps } from '@modules/formulario/domain/pergunta/pergunta.types';
import { PerguntaMap } from '@modules/formulario/mappers/pergunta.map';
import { DomainException } from '@shared/domain/domain.exception';
import { readFile, writeFile } from 'fs';





//RELACIONADO AO MODULO PERGUNTA! (YAGO)
// // Criando  e recuperando  perguntas.
// try {
//     const pergunta = Pergunta.criar( { texto: 'Como você avalia sua experiência geral?', tipo: 'nota', opcoes:["1","2","3"], ordem: 1 });
//     console.log(pergunta);

//      let propspergunta: RecuperarPerguntaProps = {
//         id: '4ede92e2-5a0c-4b0c-85d7-c4eed09ee7a5',
//         texto: 'fale de sua experiência',
//         tipo: 'texto',
//         ordem: 1 
//     };
//      let pergunta2 = Pergunta.recuperar(propspergunta);
//     console.log(pergunta2);

//     //////////////////////////////////////////////////////
//     //Persistinto e Recuperando em Arquivo - File System//
//     //////////////////////////////////////////////////////

//     let arrayperguntas = [];
//     arrayperguntas.push(pergunta.toDTO());
// 	arrayperguntas.push(pergunta2.toDTO());

//      writeFile('perguntas.json', JSON.stringify(arrayperguntas), function (error:any) {
//         if (error) throw error;
//         console.log('Arquivo Salvo com Sucesso!');
//         readFile('perguntas.json', (error, dadoGravadoArquivo) => {
//             if (error) throw error;
//             console.log('Leitura de Arquivo!');
//             let categoriasSalvas: [] = JSON.parse(dadoGravadoArquivo.toString());
//             categoriasSalvas.forEach(categoriaJSON => {
//                 console.log(categoriaJSON);
//                 console.log(PerguntaMap.toDomain(categoriaJSON));
//             })
//         });
//     });

// } catch (error:any) {
//     if (error instanceof DomainException) {
//         console.log('Execeção de Dominio');
//         console.log(error.message);
//     }
//     else {
//         console.log('Outras Exceções');
//         console.log(error.message);
//     }
// }

//Testando Feedback (AINDA NÃO MEXI, APENAS CONTEÚDO GENÉRICO DE FEEDBACK - YAGO)

// const feedback = Feedback.criar({
//   formulario_id: 'form123',
//   pergunta_id: 11,
//   resposta_texto: 'gostei bastante!',
//   nota: 9,
//    data_resposta: new Date()  // opcional
// });

// console.log(feedback)



//Cleilson.

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
