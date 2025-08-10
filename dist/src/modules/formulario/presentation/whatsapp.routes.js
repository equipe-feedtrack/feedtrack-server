"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WhatsAppApiGateway_1 = require("@modules/formulario/infra/envio/gateways/WhatsAppApiGateway");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post('/envio-unico', async (req, res) => {
    const { chatId, text } = req.body;
    if (!chatId || !text) {
        return res.status(400).json({ error: 'chatId and text are required' });
    }
    console.log(`Enviando mensagem para ${chatId}: ${text}`);
    // Aqui você pode chamar o WhatsAppApiGateway para enviar a mensagem
    const whatsAppGateway = new WhatsAppApiGateway_1.WhatsAppApiGateway();
    await whatsAppGateway.enviar(`${chatId}@c.us`, text).then(() => {
        console.log('Mensagem enviada com sucesso!');
    }).catch((error) => {
        console.error('Erro ao enviar mensagem:', error.message);
    });
});
exports.default = router;
//# sourceMappingURL=whatsapp.routes.js.map