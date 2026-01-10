import { IsString, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { TipoUsuario, StatusUsuario } from '@modules/acesso_e_identidade/domain/usuario/usuario.types';

/**
 * @swagger
 * components:
 *   schemas:
 *     AtualizarUsuarioValidationDTO:
 *       type: object
 *       properties:
 *         nomeUsuario:
 *           type: string
 *           description: Novo nome de usuário.
 *         senhaHash:
 *           type: string
 *           description: Nova senha do usuário (já hashada).
 *         tipo:
 *           type: string
 *           enum: [ADMIN, EMPRESA, FUNCIONARIO]
 *           description: Novo tipo de usuário.
 *         status:
 *           type: string
 *           enum: [ATIVO, INATIVO]
 *           description: Novo status do usuário.
 *         ativo:
 *           type: boolean
 *           description: Indica se o usuário está ativo.
 */
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
