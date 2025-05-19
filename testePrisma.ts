import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testarCriacaoProduto() {
    try {
        const novoProduto = await prisma.produto.create({
            data: {
                nome: "Produto Teste",
                descricao: "Este é um produto de teste.",
                valor: 99.99,
                dataCriacao: new Date(),
                status: "ATIVO" // Ajuste conforme necessário para seu enum
            }
        });

        console.log("Produto criado com sucesso:", novoProduto);
    } catch (error) {
        console.error("Erro ao criar produto:", error);
    } finally {
        await prisma.$disconnect();
    }
}

testarCriacaoProduto();
