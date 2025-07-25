"use strict";
// const url = 'https://graph.facebook.com/v18.0/727356933783650/messages';
Object.defineProperty(exports, "__esModule", { value: true });
const IniciarEnvioFormularioUseCase_1 = require("@modules/formulario/application/use-cases/envio/IniciarEnvioFormularioUseCase");
const EnvioRepositoryPrisma_1 = require("infra/database/prisma/repositories/EnvioRepositoryPrisma");
const WhatsAppApiGateway_1 = require("infra/gateways/WhatsAppApiGateway");
const FeedbackService_1 = require("infra/presentation/FeedbackService");
const client_1 = require("@prisma/client");
// Em algum lugar na inicialização da sua aplicação...
// 1. Instancia as implementações da camada de INFRA
const prisma = new client_1.PrismaClient();
const envioRepository = new EnvioRepositoryPrisma_1.EnvioRepositoryPrisma(prisma);
const clienteRepository = new ClienteRepositoryPrisma(prisma); // (Exemplo)
const whatsAppGateway = new WhatsAppApiGateway_1.WhatsAppApiGateway();
const feedbackService = new FeedbackService_1.FeedbackService();
// 2. Instancia o CASO DE USO, passando as implementações concretas
const iniciarEnvioUseCase = new IniciarEnvioFormularioUseCase_1.IniciarEnvioFormularioUseCase(envioRepository, whatsAppGateway, feedbackService, clienteRepository);
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
//# sourceMappingURL=server.js.map