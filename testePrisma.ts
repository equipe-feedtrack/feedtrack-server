import * as PrismaClient from "@prisma/client";
import { StatusProdutoPrisma } from "@prisma/client";
import { $Enums } from "@prisma/client";

console.log($Enums.StatusProdutoPrisma);


console.log(PrismaClient);

console.log(StatusProdutoPrisma.ATIVO);
console.log(StatusProdutoPrisma.INATIVO);

