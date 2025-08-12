import { IsString, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { TipoUsuario, StatusUsuario } from '@modules/acesso_e_identidade/domain/usuario/usuario.types';

export class AtualizarUsuarioValidationDTO {
  @IsString()
  @IsOptional()
  nomeUsuario?: string;

  @IsString()
  @IsOptional()
  senhaHash?: string;

  @IsEnum(TipoUsuario)
  @IsOptional()
  tipo?: TipoUsuario;

  @IsEnum(StatusUsuario)
  @IsOptional()
  status?: StatusUsuario;

  @IsBoolean()
  @IsOptional()
  ativo?: boolean;
}
