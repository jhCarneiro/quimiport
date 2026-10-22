
import type { FastifyReply, FastifyRequest } from "fastify";
import { PrismaProdutoQuimicoRepository } from "../../../infrastructure/repositories/PrismaProdutoQuimicoRepository";
import { ListarProdutosQuimicos } from "../../../application/use-cases/ListarProdutosQuimicos";

export async function ListarProdutosQuimicosController(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const repository = new PrismaProdutoQuimicoRepository();
    const listarProdutos = new ListarProdutosQuimicos(repository);

    const produtos = await listarProdutos.execute();


    const resultado = produtos.map((produto) => ({
        id: produto.getID(),
        nome: produto.getNome(),
        descricao: produto.getDescricao(),
        numeroONU: produto.getNumeroONU(),
        classeRisco: produto.getClasseRisco(),
        grupoCompatibilidade: produto.getGrupoCompatibilidade(),
        status: produto.getStatus(),
        criadoEm: produto.getCriadoEm(),
        atualizadoEm: produto.getAtualizadoEm()
    }));


    return reply.code(200).send(resultado);
}
