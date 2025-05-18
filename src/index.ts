import { Pergunta } from '@modules/formulario/domain/pergunta/pergunta.entity';
import { RecuperarPerguntaProps } from '@modules/formulario/domain/pergunta/pergunta.types';
import { PerguntaMap } from '@modules/formulario/mappers/pergunta.map';
import { DomainException } from '@shared/domain/domain.exception';
import { readFile, writeFile } from 'fs';

// Testando pergunta

try {
    const pergunta = Pergunta.criar( { texto: 'Como você avalia sua experiência geral?', tipo: 'nota', opcoes:["1","2","3"], ordem: 1 });
    console.log(pergunta);

     let propspergunta: RecuperarPerguntaProps = {
        id: '4ede92e2-5a0c-4b0c-85d7-c4eed09ee7a5',
        texto: 'fale de sua experiência',
        tipo: 'texto',
        ordem: 1 
    };
     let pergunta2 = Pergunta.recuperar(propspergunta);
    console.log(pergunta2);

    //////////////////////////////////////////////////////
    //Persistinto e Recuperando em Arquivo - File System//
    //////////////////////////////////////////////////////

    let arrayperguntas = [];
    arrayperguntas.push(pergunta.toDTO());
	arrayperguntas.push(pergunta2.toDTO());

     writeFile('perguntas.json', JSON.stringify(arrayperguntas), function (error:any) {
        if (error) throw error;
        console.log('Arquivo Salvo com Sucesso!');
        readFile('perguntas.json', (error, dadoGravadoArquivo) => {
            if (error) throw error;
            console.log('Leitura de Arquivo!');
            let categoriasSalvas: [] = JSON.parse(dadoGravadoArquivo.toString());
            categoriasSalvas.forEach(categoriaJSON => {
                console.log(categoriaJSON);
                console.log(PerguntaMap.toDomain(categoriaJSON));
            })
        });
    });








} catch (error:any) {
    if (error instanceof DomainException) {
        console.log('Execeção de Dóminio');
        console.log(error.message);
    }
    else {
        console.log('Outras Exceções');
        console.log(error.message);
    }
}


/// Falta eu mexer nessa parte.!! (Yago)

// // Exemplo de Modelo Base para Feedback (sem alterações necessárias)
// const modeloBaseFeedback = new Formulario({
//   titulo: 'Modelo Padrão de Feedback',
//   modeloPadrao: true,
//   perguntas: [
//     { texto: 'Como você avalia sua experiência geral?', tipo: 'nota', opcoes: ['Sim', 'Não', 'Parcialmente'], ordem: 1 },
//     { texto: 'Qual aspecto você mais gostou?', tipo: 'texto', opcoes: ['Sim', 'Não', 'Parcialmente'], ordem: 2 },
//     { texto: 'Há algo que poderíamos melhorar?', tipo: 'texto', opcoes: ['Sim', 'Não', 'Parcialmente'], ordem: 3 },
//     { texto: 'Em uma escala de 0 a 10, o quanto você recomendaria nossa empresa?', tipo: 'nota', opcoes: ['Sim', 'Não', 'Parcialmente'], ordem: 4 },
//   ],
// });

// // Exemplos de uso com modelo base e perguntas personalizadas:
// try {
//   // Criando um formulário baseado no modelo de feedback
//   const formularioCampanhaA = new Formulario({
//     titulo: 'Feedback Campanha A - Produto Novo',
//     modeloBaseId: modeloBaseFeedback.modeloBaseId,
//     perguntas: [
//       { texto: 'O que você achou da principal novidade do produto?', tipo: 'texto', opcoes: ['Sim', 'Não', 'Parcialmente'], ordem: 5 }, // OK, 'opcoes' não é necessário
//       { texto: 'A funcionalidade X atendeu às suas expectativas?', tipo: 'multipla_escolha', opcoes: ['Sim', 'Não', 'Parcialmente'], ordem: 6 }, // OK, 'opcoes' está presente
//     ],
//   });

//   // Adicionando uma pergunta personalizada diretamente ao formulário
//   formularioCampanhaA.adicionarPergunta({ texto: 'Se você pudesse sugerir uma melhoria, qual seria?', tipo: 'texto', opcoes: ['Sim', 'Não', 'Parcialmente'], ordem: 7 }); // OK, 'opcoes' não é necessário

//   console.log('Modelo Base de Feedback:', modeloBaseFeedback);
//   console.log('Formulário Campanha A:', formularioCampanhaA);

//   // Tentativa de adicionar uma pergunta de múltipla escolha sem opções (agora causará um erro)
//   // formularioCampanhaA.adicionarPergunta({ texto: 'Escolha uma opção:', tipo: 'multipla_escolha', ordem: 8 });

// } catch (error: any) {
//   console.error('Erro:', error.message);
// }


//Testando Feedback

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
