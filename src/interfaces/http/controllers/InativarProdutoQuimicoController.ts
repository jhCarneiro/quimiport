
import type { FastifyReply, FastifyRequest } from "fastify";
import { InativarProdutoQuimico } from "../../../application/use-cases/InativarProdutoQuimico";
import { PrismaProdutoQuimicoRepository } from "../../../infrastructure/repositories/PrismaProdutoQuimicoRepository";

interface Params {
    id: string;
}

export async function InativarProdutoQuimicoController(
    request: FastifyRequest<{ Params: Params }>,
    reply: FastifyReply
) {
    const repository = new PrismaProdutoQuimicoRepository();
    const useCase = new InativarProdutoQuimico(repository);

    try {
        await useCase.executar(request.params.id);

        return reply.status(200).send({
            mensagem: "Produto químico inativado com sucesso",
            id: request.params.id,
            status: "INATIVO"
        });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "PRODUTO_NAO_ENCONTRADO") {
                return reply.status(404).send({
                    mensagem: "Produto químico não encontrado"
                });
            }

            if (error.message === "O produto químico já está inativo") {
                return reply.status(400).send({
                    mensagem: error.message
                });
            }
        }

        throw error;
    }
}
