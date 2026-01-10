import { IsString, IsNotEmpty, IsDateString, IsUUID, IsEnum } from 'class-validator';
import { StatusUsuario } from '@modules/acesso_e_identidade/domain/usuario/usuario.types';

/**
 * @swagger
 * components:
 *   schemas:
 *     CriarFuncionarioValidationDTO:
 *       type: object
 *       required:
 *         - cargo
 *         - usuarioId
 *       properties:
 *         cargo:
 *           type: string
 *           description: Cargo do funcionário.
 *         usuarioId:
 *           type: string
 *           format: uuid
 *           description: ID do usuário associado a este funcionário.
 */
export class CriarFuncionarioValidationDTO {
  @IsString()
  @IsNotEmpty()
  cargo: string;

  @IsUUID()
  @IsNotEmpty()
  usuarioId: string;

  

}
