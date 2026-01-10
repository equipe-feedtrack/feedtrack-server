import { IsString, IsNotEmpty, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { RespostaValidationDTO } from './CriarFeedback.dto';

export class CriarFeedbackManualValidationDTO {
    @IsString()
    @IsNotEmpty()
    clienteNome: string;

    @IsString()
    @IsNotEmpty()
    produtoNome: string;

    @IsString()
    @IsOptional()
    funcionarioNome?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RespostaValidationDTO)
    respostas: RespostaValidationDTO[];
}
