
import { ProdutoQuimico } from "../../domain/entities/ProdutoQuimico";
import { ProdutoQuimicoRepository } from "../../application/repositories/ProdutoQuimicoRepository";
import { prisma } from "../database/prisma";

export class PrismaProdutoQuimicoRepository implements ProdutoQuimicoRepository {

    async salvar(produto: ProdutoQuimico): Promise<void> {
        await prisma.produtoQuimico.upsert({
            where: {
                id: produto.getID()
            },
            create: {
                id: produto.getID(),
                nome: produto.getNome(),
                descricao: produto.getDescricao(),
                numeroONU: produto.getNumeroONU(),
                classeRisco: produto.getClasseRisco(),
                grupoCompatibilidade: produto.getGrupoCompatibilidade(),
                status: produto.getStatus(),
                criadoEm: produto.getCriadoEm(),
                atualizadoEm: produto.getAtualizadoEm()
            },
            update: {
                nome: produto.getNome(),
                descricao: produto.getDescricao(),
                numeroONU: produto.getNumeroONU(),
                classeRisco: produto.getClasseRisco(),
                grupoCompatibilidade: produto.getGrupoCompatibilidade(),
                status: produto.getStatus(),
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
            descricao: produto.descricao,
            numeroONU: produto.numeroONU,
            classeRisco: produto.classeRisco,
            grupoCompatibilidade: produto.grupoCompatibilidade,
            status: produto.status as "ATIVO" | "INATIVO",
            criadoEm: produto.criadoEm,
            atualizadoEm: produto.atualizadoEm
        });
    }

    async listar(): Promise<ProdutoQuimico[]> {
        const produtos = await prisma.produtoQuimico.findMany();

        return produtos.map(produto => new ProdutoQuimico({
            id: produto.id,
            nome: produto.nome,
            descricao: produto.descricao,
            numeroONU: produto.numeroONU,
            classeRisco: produto.classeRisco,
            grupoCompatibilidade: produto.grupoCompatibilidade,
            status: produto.status as "ATIVO" | "INATIVO",
            criadoEm: produto.criadoEm,
            atualizadoEm: produto.atualizadoEm
        }));
    }
}
