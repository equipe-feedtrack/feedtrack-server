// import axios from "axios";

// const cliente = {
//     id: "123",
//     nome: "Cleilson",
//     telefone: "557998615536",
//     produto: "Tenis",
//     funcionario: "Yago"
// };


// async function testarEnvio() {
//   try {
//     const response = await axios.post('http://localhost:3002/campanha', {
//       chatId: '557998615536@c.us',
//       text: 'Teste via axios interno'
//     });

//     console.log('✅ Resposta:', response.data);
//   } catch (error) {
//     console.error('❌ Erro no envio:', error.response?.data || error.message);
//   }
// }

// testarEnvio();

  

import cron from 'node-cron';

cron.schedule('* * * * *', () => {
  console.log('running a task every minute');
});