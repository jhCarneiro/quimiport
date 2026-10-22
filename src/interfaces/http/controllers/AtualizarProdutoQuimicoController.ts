
import type { FastifyReply, FastifyRequest } from "fastify";
import { AtualizarProdutoQuimico } from "../../../application/use-cases/AtualizarProdutoQuimico";
import { PrismaProdutoQuimicoRepository } from "../../../infrastructure/repositories/PrismaProdutoQuimicoRepository";

interface Params {
    id: string;
}

interface Body {
    nome: string;
    descricao: string;
    numeroONU: string;
    classeRisco: string;
    grupoCompatibilidade: string;
}

export async function AtualizarProdutoQuimicoController(
    request: FastifyRequest<{ Params: Params; Body: Body }>,
    reply: FastifyReply
) {
    const repository = new PrismaProdutoQuimicoRepository();
    const useCase = new AtualizarProdutoQuimico(repository);

    try {
        await useCase.executar({
            id: request.params.id,
            ...request.body
        });

        return reply.status(200).send({
            mensagem: "Produto químico atualizado com sucesso",
            id: request.params.id
        });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "PRODUTO_NAO_ENCONTRADO") {
                return reply.status(404).send({
                    mensagem: "Produto químico não encontrado"
                });
            }

            if (error.message === "PRODUTO_INATIVO") {
                return reply.status(400).send({
                    mensagem: "Não é permitido atualizar um produto inativo"
                });
            }

            if (
                error.message.includes("preenchido") ||
                error.message.includes("preenchida")
            ) {
                return reply.status(400).send({
                    mensagem: error.message
                });
            }
        }

        throw error;
    }
}
