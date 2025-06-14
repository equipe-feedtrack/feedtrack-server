const url = 'https://graph.facebook.com/v18.0/727356933783650/messages';

const token = 'EAAOdEXXYwNIBO6vx942hqkfxhEK3YSNTKuofFcLhpkm3SnnESkFYIxh1ZCXXGIkzzywIU0yAVeLPf6kcOJHVVCvVO4eZCfJchZBhMeY60jZBqivbRTLg9npUxixk0NQZCFZBDi4W9ylLycZAjvyBliGFT7sQ3V5S1aR72SgW5rPA9YnWflxyBDIZBfZCzUcTZAZA09qjl8oD3VhpJPuxBfBJvv8H0zPWIybVKbtrMoZD';

const nome = "João";
const produto = "Meia";
const numero = "5579998615536";

setTimeout(() => {
  console.log('Enviando mensagem...');

  const data = {
    messaging_product: 'whatsapp',
    to: numero,
    type: 'template',
    template: {
      name: 'feedback',
      language: {
        code: 'en_US ' // Altere se o idioma real do template for diferente
      },
      components: [
        {
          type: 'body',
          parameters: [
            { type: 'text', text: nome },    // Preenche {{1}}
            { type: 'text', text: produto }  // Preenche {{2}}
          ]
        }
      ]
    }
  };

  fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(json => console.log('Resposta da API:', json))
  .catch(err => console.error('Erro ao enviar mensagem:', err));

}, 2000);
