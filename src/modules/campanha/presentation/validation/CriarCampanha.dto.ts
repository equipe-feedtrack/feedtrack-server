import { IsString, IsNotEmpty, IsEnum, IsDateString, IsOptional, IsUUID } from 'class-validator';
import { TipoCampanha, SegmentoAlvo, CanalEnvio } from '../../domain/campanha.types';

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