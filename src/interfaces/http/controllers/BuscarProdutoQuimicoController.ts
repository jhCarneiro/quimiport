
import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaProdutoQuimicoRepository } from "../../../infrastructure/repositories/PrismaProdutoQuimicoRepository";
import { BuscarProdutoQuimico } from "../../../application/use-cases/BuscarProdutoQuimico";

interface BuscarProdutoParams {
    id: string;
}

export async function BuscarProdutoQuimicoController(
    request: FastifyRequest<{ Params: BuscarProdutoParams }>,
    reply: FastifyReply
) {
    const { id } = request.params;

    const repository = new PrismaProdutoQuimicoRepository();
    const buscarProduto = new BuscarProdutoQuimico(repository);

    const produto = await buscarProduto.execute(id);

    if (!produto) {
        return reply.code(404).send({
            mensagem: "Produto químico não encontrado"
        });
    }

    return reply.code(200).send({
        id: produto.getID(),
        nome: produto.getNome(),
        numeroONU: produto.getNumeroONU(),
        classeRisco: produto.getClasseRisco(),
        criadoEm: produto.getCriadoEm(),
        atualizadoEm: produto.getAtualizadoEm()
    });
}
