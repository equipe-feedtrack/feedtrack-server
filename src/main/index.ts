import "reflect-metadata";
import dotenv from "dotenv";
import { createHTTPServer } from "./presentation/http/server";

async function bootstrap() {
  //Carrega variáveis de ambiente do arquivo .env
  dotenv.config();

  const api_name = process.env.API_NAME || "FeedTrack API";
  const host_name = process.env.HOST_NAME || "localhost";
  const port = Number(process.env.PORT) || 3006;

  console.log(`[${api_name}] 🚀 Inicializando a API....`);
  

  const httpServer = await createHTTPServer();

  

  httpServer.listen({ port: port }, async () => {
    console.log(
      `[${api_name}] ✅ Servidor HTTP pronto e ouvindo em http://${host_name}:${port}/api/v1`
    );
    console.log(
      `[Swagger Docs] ✅ Swagger disponível em http://${host_name}:${port}/api-docs`
    );
  });
}

bootstrap().catch((error) => {
  console.error(error);
});
