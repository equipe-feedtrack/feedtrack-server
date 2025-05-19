import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

console.log(prisma.$queryRaw`SELECT '${PrismaClient.StatusProdutoPrisma.ATIVO}'`);
