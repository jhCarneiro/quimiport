
import { FastifyReply, FastifyRequest } from "fastify";
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
        numeroONU: produto.getNumeroONU(),
        classeRisco: produto.getClasseRisco(),
        criadoEm: produto.getCriadoEm(),
        atualizadoEm: produto.getAtualizadoEm()
    }));

    return reply.code(200).send(resultado);
}
