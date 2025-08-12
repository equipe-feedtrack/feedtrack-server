import { IsString, IsNotEmpty, IsEnum, IsDateString, IsOptional, IsUUID, IsBoolean } from 'class-validator';
import { TipoCampanha, SegmentoAlvo, CanalEnvio } from '../../domain/campanha.types';

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
    dataInicio?: Date;

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