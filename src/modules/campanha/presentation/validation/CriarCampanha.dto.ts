import { IsString, IsNotEmpty, IsEnum, IsDateString, IsOptional, IsUUID } from 'class-validator';
import { TipoCampanha, SegmentoAlvo, CanalEnvio } from '../../domain/campanha.types';

/**
 * @swagger
 * components:
 *   schemas:
 *     CriarCampanhaValidationDTO:
 *       type: object
 *       required:
 *         - titulo
 *         - tipoCampanha
 *         - segmentoAlvo
 *         - dataInicio
 *         - templateMensagem
 *         - canalEnvio
 *         - formularioId
 *       properties:
 *         titulo:
 *           type: string
 *           description: Título da campanha.
 *         descricao:
 *           type: string
 *           description: Descrição detalhada da campanha.
 *         tipoCampanha:
 *           type: string
 *           enum: [PESQUISA_SATISFACAO, PROMOCIONAL, INFORMATIVA]
 *           description: Tipo da campanha.
 *         segmentoAlvo:
 *           type: string
 *           enum: [CLIENTES_NOVOS, CLIENTES_ANTIGOS, TODOS]
 *           description: Segmento de clientes alvo da campanha.
 *         dataInicio:
 *           type: string
 *           format: date-time
 *           description: Data de início da campanha.
 *         dataFim:
 *           type: string
 *           format: date-time
 *           description: Data de término da campanha (opcional).
 *         templateMensagem:
 *           type: string
 *           description: Conteúdo do template da mensagem a ser enviada.
 *         canalEnvio:
 *           type: string
 *           enum: [EMAIL, WHATSAPP, SMS]
 *           description: Canal de envio da campanha.
 *         formularioId:
 *           type: string
 *           format: uuid
 *           description: ID do formulário associado à campanha.
 */
export class CriarCampanhaValidationDTO {
    @IsString()
    @IsNotEmpty()
    titulo: string;

    @IsString()
    @IsOptional()
    descricao?: string;

    @IsEnum(TipoCampanha)
    @IsNotEmpty()
    tipoCampanha: TipoCampanha;

    @IsEnum(SegmentoAlvo)
    @IsNotEmpty()
    segmentoAlvo: SegmentoAlvo;

    @IsDateString()
    @IsNotEmpty()
    dataInicio: Date;

    @IsDateString()
    @IsOptional()
    dataFim?: Date;

    @IsString()
    @IsNotEmpty()
    templateMensagem: string;

    @IsEnum(CanalEnvio)
    @IsNotEmpty()
    canalEnvio: CanalEnvio;

    @IsUUID()
    @IsNotEmpty()
    formularioId: string;
}