import { IsString, IsOptional, IsDateString, IsEnum, IsBoolean } from 'class-validator';
import { TipoCampanha, SegmentoAlvo } from '@modules/campanha/domain/campanha.types';

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
    dataFim?: Date | null;

    @IsString()
    @IsOptional()
    templateMensagem?: string;

    @IsBoolean()
    @IsOptional()
    ativo?: boolean;
}
