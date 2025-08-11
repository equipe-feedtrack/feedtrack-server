import { IsString, IsNotEmpty, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { TipoUsuario } from '@modules/acesso_e_identidade/domain/usuario/usuario.types';

export class CriarUsuarioValidationDTO {

  

  @IsString()
  @IsNotEmpty()
  nomeUsuario: string;

  @IsString()
  @IsNotEmpty()
  senhaHash: string;

  @IsEnum(TipoUsuario)
  @IsNotEmpty()
  tipo: TipoUsuario;


}
