import express from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

// Permite receber JSON no corpo das requisições
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/cadastro-usuario', async (req, res) => {
  const { nome, telefone } = req.body;

  try {
    const novoUsuario = await prisma.clientes.create({
      data: {
        nome,
        telefone,
      },
    });

    res.status(201).json(novoUsuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao cadastrar o usuário' });
  }
});

app.get('/ver-dados', async (req, res) => {
    try {
      const dados = await prisma.clientes.findMany({
        select: {
          nome: true,
          telefone: true
        }
      });
  
      res.json(dados);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      res.status(500).json({ erro: 'Erro ao buscar dados' });
    }
  });
  


app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
