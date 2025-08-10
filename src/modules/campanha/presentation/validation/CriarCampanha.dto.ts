import { IsString, IsNotEmpty, IsOptional, IsDateString, IsEnum, IsUUID } from 'class-validator';
import { TipoCampanha, SegmentoAlvo } from '@modules/campanha/domain/campanha.types';
import { CanalEnvio } from '@prisma/client';

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
    dataFim: Date | null;

    @IsString()
    @IsNotEmpty()
    templateMensagem: string;

    @IsUUID()
    @IsNotEmpty()
    formularioId: string;

    @IsEnum(CanalEnvio)
    @IsNotEmpty()
    canalEnvio: CanalEnvio;
}
