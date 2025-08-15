import { IsString, IsNotEmpty, IsUUID, IsArray, ValidateNested, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class RespostaValidationDTO {
    @IsUUID()
    @IsNotEmpty()
    perguntaId: string;

    @IsString()
    @IsNotEmpty()
    tipo: string;

    @IsString()
    @IsOptional()
    resposta_texto?: string;

    @IsNumber()
    @IsOptional()
    nota?: number;

    @IsString()
    @IsOptional()
    opcaoEscolhida?: string;
}

export class CriarFeedbackValidationDTO {
    @IsUUID()
    @IsNotEmpty()
    formularioId: string;

    @IsUUID()
    @IsNotEmpty()
    envioId: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RespostaValidationDTO)
    respostas: RespostaValidationDTO[];
}
