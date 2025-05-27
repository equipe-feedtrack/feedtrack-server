import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { Formulario } from "../../formulario/formulario.entity";
dotenv.config();

class EnvioFormularioService {
  private transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: Number(process.env.MAIL_PORT) === 465,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

   async enviarPorEmail(destinatario: string, formulario: Formulario): Promise<void> {
    // Monta as perguntas com opções se existirem
    const perguntasHtml = formulario.perguntas.map((pergunta) => {
      let opcoesHtml = "";
      if (pergunta.tipo === "multipla_escolha" && pergunta.opcoes) {
        opcoesHtml = `<ul>${pergunta.opcoes.map(opcao => `<li>${opcao}</li>`).join("")}</ul>`;
      }
      return `<li><strong>${pergunta.texto}</strong>${opcoesHtml}</li>`;
    }).join("");

    const corpoHtml = `
      <h1>${formulario.titulo}</h1>
      <p>Por favor, responda as seguintes perguntas:</p>
      <ul>
        ${perguntasHtml}
      </ul>
    `;

    const info = await this.transporter.sendMail({
      from: '"FeedTrack" <no-reply@feedtrack.com>',
      to: destinatario,
      subject: `Formulário: ${formulario.titulo}`,
      html: corpoHtml,
    });

    console.log("📨 Email enviado:", info.messageId);
  }
}

export { EnvioFormularioService };
