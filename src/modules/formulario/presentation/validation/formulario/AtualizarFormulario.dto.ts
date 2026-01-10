import { IsString, IsOptional, IsArray, IsUUID, IsBoolean } from 'class-validator';

export class AtualizarFormularioValidationDTO {
    @IsString()
    @IsOptional()
    titulo?: string;

    @IsString()
    @IsOptional()
    descricao?: string;

    @IsArray()
    @IsUUID('4', { each: true })
    @IsOptional()
    perguntas?: string[];

    @IsBoolean()
    @IsOptional()
    ativo?: boolean;
}
