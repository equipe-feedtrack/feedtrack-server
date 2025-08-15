import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { DispararEnvioIndividualValidationDTO } from './DispararEnvioIndividual.dto';

export class DispararEnvioEmMassaValidationDTO {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => DispararEnvioIndividualValidationDTO)
    envios: DispararEnvioIndividualValidationDTO[];
}
