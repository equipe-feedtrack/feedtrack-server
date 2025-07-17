import axios from "axios";

const url = "https://261bb16e347e.ngrok-free.app";
const data = {
    session: "default",
    chatId: "557998615536@c.us",
    text: "Olá, Cleilson! Tudo bem?\n\nAqui é da nossa equipe de atendimento. Vimos que você comprou um *Tenis da Nike* (código 123) no dia 25/07/2025, com o vendedor Yago\n\nGostaríamos muito de saber se está tudo certo com seu pedido 😊\n\nSe puder nos dar um feedback, agradecemos demais!\nLink de Avaliação: https://preview--feedback-flicks-produto-x.lovable.app/"
    
};
const headers = {
    'Content-Type': 'application/json',
    'X-Api-Key': 'yoursecretkey'
};

axios.post(url, data, { headers })
    .then(response => console.log(response.data))
    .catch(error => console.error(error));