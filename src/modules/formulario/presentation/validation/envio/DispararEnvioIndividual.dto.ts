import { IsUUID, IsNotEmpty } from 'class-validator';

export class DispararEnvioIndividualValidationDTO {
    @IsUUID()
    @IsNotEmpty()
    clienteId: string;

    @IsUUID()
    @IsNotEmpty()
    formularioId: string;

    @IsUUID()
    @IsNotEmpty()
    campanhaId: string;

    @IsUUID()
    @IsNotEmpty()
    usuarioId: string;
}
