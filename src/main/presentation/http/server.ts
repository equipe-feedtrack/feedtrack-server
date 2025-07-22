import http from 'node:http';
import express, { Application } from 'express';
import morgan from 'morgan';
import { apiv1Router } from './rest/api.v1';

const app: Application = express();

const createHTTPServer = async (): Promise<http.Server>  => {
    app.disabled('x-powered-by');
    app.use(express.json());
    app.use(morgan('tiny'));
    app.use('/api/v1', apiv1Router);
    const httpServer: http.Server = http.createServer(app);
    return httpServer;
};

export { createHTTPServer }




// Em algum lugar na inicialização da sua aplicação...

// 1. Instancia as implementações da camada de INFRA
// const prisma = new PrismaClient();
// const envioRepository = new EnvioRepositoryPrisma(prisma);
// const clienteRepository = new ClienteRepositoryPrisma(prisma); // (Exemplo)
// const whatsAppGateway = new WhatsAppApiGateway();
// const feedbackService = new FeedbackService();

// // 2. Instancia o CASO DE USO, passando as implementações concretas
// const iniciarEnvioUseCase = new IniciarEnvioFormularioUseCase(
//   envioRepository,
//   whatsAppGateway,
//   feedbackService,
//   clienteRepository
// );

// 3. Agora, o 'iniciarEnvioUseCase' está pronto para ser usado nos seus Controllers!



// const token = 'EAAOdEXXYwNIBO6vx942hqkfxhEK3YSNTKuofFcLhpkm3SnnESkFYIxh1ZCXXGIkzzywIU0yAVeLPf6kcOJHVVCvVO4eZCfJchZBhMeY60jZBqivbRTLg9npUxixk0NQZCFZBDi4W9ylLycZAjvyBliGFT7sQ3V5S1aR72SgW5rPA9YnWflxyBDIZBfZCzUcTZAZA09qjl8oD3VhpJPuxBfBJvv8H0zPWIybVKbtrMoZD';

// const nome = "João";
// const produto = "Meia";
// const numero = "5579998615536";

// setTimeout(() => {
//   console.log('Enviando mensagem...');

//   const data = {
//     messaging_product: 'whatsapp',
//     to: numero,
//     type: 'template',
//     template: {
//       name: 'feedback',
//       language: {
//         code: 'en_US ' // Altere se o idioma real do template for diferente
//       },
//       components: [
//         {
//           type: 'body',
//           parameters: [
//             { type: 'text', text: nome },    // Preenche {{1}}
//             { type: 'text', text: produto }  // Preenche {{2}}
//           ]
//         }
//       ]
//     }
//   };

//   fetch(url, {
//     method: 'POST',
//     headers: {
//       'Authorization': `Bearer ${token}`,
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(data)
//   })
//   .then(res => res.json())
//   .then(json => console.log('Resposta da API:', json))
//   .catch(err => console.error('Erro ao enviar mensagem:', err));

// }, 2000);
