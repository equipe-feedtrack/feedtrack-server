-- AlterTable
ALTER TABLE "public"."usuarios" ADD COLUMN     "token_recuperacao" TEXT,
ADD COLUMN     "token_recuperacao_expiracao" TIMESTAMP(3);
