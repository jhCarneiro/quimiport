import { ProdutoQuimico } from "../../domain/entities/ProdutoQuimico";
import { ProdutoQuimicoRepository } from "../../application/repositories/ProdutoQuimicoRepository";
import { prisma } from "../database/prisma";

export class PrismaProdutoQuimicoRepository implements ProdutoQuimicoRepository {

    async salvar(produto: ProdutoQuimico): Promise<void> {
        await prisma.produtoQuimico.create({
            data: {
                id: produto.getID(),
                nome: produto.getNome(),
                numeroONU: produto.getNumeroONU(),
                classeRisco: produto.getClasseRisco(),
                criadoEm: produto.getCriadoEm(),
                atualizadoEm: produto.getAtualizadoEm()
            }
        });
    }

    async buscar(id: string): Promise<ProdutoQuimico | null> {
        const produto = await prisma.produtoQuimico.findUnique({
            where: { id }
        });

        if (!produto) {
            return null;
        }

        return new ProdutoQuimico({
            id: produto.id,
            nome: produto.nome,
            numeroONU: produto.numeroONU,
            classeRisco: produto.classeRisco,
            criadoEm: produto.criadoEm,
            atualizadoEm: produto.atualizadoEm
        });
    }

    async listar(): Promise<ProdutoQuimico[]> {
        const produtos = await prisma.produtoQuimico.findMany();

        return produtos.map(produto => new ProdutoQuimico({
            id: produto.id,
            nome: produto.nome,
            numeroONU: produto.numeroONU,
            classeRisco: produto.classeRisco,
            criadoEm: produto.criadoEm,
            atualizadoEm: produto.atualizadoEm
        }));
    }
}