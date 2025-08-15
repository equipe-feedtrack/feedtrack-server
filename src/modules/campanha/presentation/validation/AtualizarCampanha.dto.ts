import { IsString, IsNotEmpty, IsEnum, IsDateString, IsOptional, IsUUID, IsBoolean } from 'class-validator';
import { TipoCampanha, SegmentoAlvo, CanalEnvio } from '../../domain/campanha.types';

/**
 * @swagger
 * components:
 *   schemas:
 *     AtualizarCampanhaValidationDTO:
 *       type: object
 *       properties:
 *         titulo:
 *           type: string
 *           description: Novo título da campanha.
 *         descricao:
 *           type: string
 *           description: Nova descrição detalhada da campanha.
 *         tipoCampanha:
 *           type: string
 *           enum: [PESQUISA_SATISFACAO, PROMOCIONAL, INFORMATIVA]
 *           description: Novo tipo da campanha.
 *         segmentoAlvo:
 *           type: string
 *           enum: [CLIENTES_NOVOS, CLIENTES_ANTIGOS, TODOS]
 *           description: Novo segmento de clientes alvo da campanha.
 *         dataInicio:
 *           type: string
 *           format: date-time
 *           description: Nova data de início da campanha.
 *         dataFim:
 *           type: string
 *           format: date-time
 *           description: Nova data de término da campanha.
 *         templateMensagem:
 *           type: string
 *           description: Novo conteúdo do template da mensagem a ser enviada.
 *         canalEnvio:
 *           type: string
 *           enum: [EMAIL, WHATSAPP, SMS]
 *           description: Novo canal de envio da campanha.
 *         formularioId:
 *           type: string
 *           format: uuid
 *           description: Novo ID do formulário associado à campanha.
 *         ativo:
 *           type: boolean
 *           description: Indica se a campanha está ativa.
 */
export class AtualizarCampanhaValidationDTO {
    @IsString()
    @IsOptional()
    titulo?: string;

    @IsString()
    @IsOptional()
    descricao?: string;

    @IsEnum(TipoCampanha)
    @IsOptional()
    tipoCampanha?: TipoCampanha;

    @IsEnum(SegmentoAlvo)
    @IsOptional()
    segmentoAlvo?: SegmentoAlvo;

    @IsDateString()
    @IsOptional()
    dataFim?: Date;

    @IsString()
    @IsOptional()
    templateMensagem?: string;

    @IsEnum(CanalEnvio)
    @IsOptional()
    canalEnvio?: CanalEnvio;

    @IsUUID()
    @IsOptional()
    formularioId?: string;

    @IsBoolean()
    @IsOptional()
    ativo?: boolean;
}