import { IsString, IsOptional, IsDateString, IsEnum, IsBoolean } from 'class-validator';
import { StatusUsuario } from '@modules/acesso_e_identidade/domain/usuario/usuario.types';

/**
 * @swagger
 * components:
 *   schemas:
 *     AtualizarFuncionarioValidationDTO:
 *       type: object
 *       properties:
 *         cargo:
 *           type: string
 *           description: Novo cargo do funcionário.
 *         dataAdmissao:
 *           type: string
 *           format: date-time
 *           description: Nova data de admissão do funcionário.
 *         status:
 *           type: string
 *           enum: [ATIVO, INATIVO]
 *           description: Novo status do funcionário.
 *         ativo:
 *           type: boolean
 *           description: Indica se o funcionário está ativo.
 */
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
