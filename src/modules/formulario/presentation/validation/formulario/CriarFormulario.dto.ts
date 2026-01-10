import { IsString, IsNotEmpty, IsOptional, IsArray, IsUUID } from 'class-validator';

export class CriarFormularioValidationDTO {
    @IsString()
    @IsNotEmpty()
    titulo: string;

    @IsString()
    @IsOptional()
    descricao?: string;

    @IsArray()
    @IsUUID('4', { each: true })
    @IsOptional()
    perguntas?: string[];
}
