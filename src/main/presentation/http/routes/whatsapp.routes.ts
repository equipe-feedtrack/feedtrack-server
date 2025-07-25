import { WhatsAppApiGateway } from '@modules/formulario/infra/envio/gateways/WhatsAppApiGateway';
import { Router } from 'express';

const router = Router();

router.post('/campanha', async (req: any, res: any) => {

    const { chatId, text } = req.body;

    if (!chatId || !text) {
        return res.status(400).json({ error: 'chatId and text are required' });
    }

    console.log(`Enviando mensagem para ${chatId}: ${text}`);

    // Aqui você pode chamar o WhatsAppApiGateway para enviar a mensagem

  const whatsAppGateway = new WhatsAppApiGateway();

    await whatsAppGateway.enviar(`${chatId}@c.us`, text).then(() => {
        console.log('Mensagem enviada com sucesso!');
    }).catch((error) => {
        console.error('Erro ao enviar mensagem:', error.message);
    });

});

export default router;
