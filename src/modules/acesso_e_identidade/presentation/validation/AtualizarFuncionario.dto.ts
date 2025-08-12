import { IsString, IsOptional, IsDateString, IsEnum, IsBoolean } from 'class-validator';
import { StatusUsuario } from '@modules/acesso_e_identidade/domain/usuario/usuario.types';

export class AtualizarFuncionarioValidationDTO {
  @IsString()
  @IsOptional()
  cargo?: string;

  @IsDateString()
  @IsOptional()
  dataAdmissao?: Date;

  @IsEnum(StatusUsuario)
  @IsOptional()
  status?: StatusUsuario;

  @IsBoolean()
  @IsOptional()
  ativo?: boolean;
}
