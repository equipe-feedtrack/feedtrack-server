import { IsString, IsNotEmpty, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { TipoUsuario } from '@modules/acesso_e_identidade/domain/usuario/usuario.types';

/**
 * @swagger
 * components:
 *   schemas:
 *     CriarUsuarioValidationDTO:
 *       type: object
 *       required:
 *         - nomeUsuario
 *         - senhaHash
 *         - tipo
 *       properties:
 *         nomeUsuario:
 *           type: string
 *           description: Nome de usuário para login.
 *         senhaHash:
 *           type: string
 *           description: Senha do usuário (já hashada).
 *         tipo:
 *           type: string
 *           enum: [ADMIN, EMPRESA, FUNCIONARIO]
 *           description: Tipo de usuário.
 */
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
