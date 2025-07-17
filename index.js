import axios from "axios";

const cliente = {
    id: "123",
    nome: "Cleilson",
    telefone: "557998615536",
    produto: "Tenis",
    funcionario: "Yago"
};

axios.get("http://localhost:3001/cliente")
  .then((response) => {
    console.log("OK");
    console.log(response.data);

    const linkDeAvaliacao = `https://www.localhost.com/avaliacao?funcionario=${encodeURIComponent(response.data.funcionario)}&nome=${encodeURIComponent(response.data.nome)}&produto=${encodeURIComponent(response.data.produto)}`;



    const url = "http://localhost:3000/api/sendText";
    const data = {
      session: "default",
      chatId: `${cliente.telefone}@c.us`,
      text: `Olá, ${cliente.nome}! Tudo bem?\n\nAqui é da nossa equipe de atendimento. Vimos que você comprou um *${cliente.produto}* (código 123) no dia 25/07/2025, com o vendedor ${cliente.funcionario}.\n\nGostaríamos muito de saber se está tudo certo com seu pedido 😊\n\nSe puder nos dar um feedback, agradecemos demais!\nLink de Avaliação: ${linkDeAvaliacao}`
    };

    const headers = {
      'Content-Type': 'application/json',
      'X-Api-Key': 'yoursecretkey'
    };

    axios.post(url, data, { headers })
      .then(response => console.log("Mensagem enviada:", response.data))
      .catch(error => console.error("Erro ao enviar mensagem:", error));
  })
  .catch(error => {
    console.error("Erro ao buscar cliente:", error);
  });
