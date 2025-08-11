import { IsString, IsNotEmpty, IsDateString, IsUUID, IsEnum } from 'class-validator';
import { StatusUsuario } from '@modules/acesso_e_identidade/domain/usuario/usuario.types';

export class CriarFuncionarioValidationDTO {
  @IsString()
  @IsNotEmpty()
  cargo: string;

  @IsDateString()
  @IsNotEmpty()
  dataAdmissao: Date;

  @IsUUID()
  @IsNotEmpty()
  usuarioId: string;

  @IsString()
  @IsNotEmpty()
  pessoaId: string;
}
