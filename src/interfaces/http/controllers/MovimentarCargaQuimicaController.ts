
import { FastifyReply, FastifyRequest } from "fastify";

import { MovimentarCargaQuimica } from "../../../application/use-cases/MovimentarCargaQuimica";

import { PrismaCargaQuimicaRepository } from "../../../infrastructure/repositories/PrismaCargaQuimicaRepository";

interface Params {
    id: string;
}

export async function MovimentarCargaQuimicaController(
    request: FastifyRequest<{ Params: Params }>,
    reply: FastifyReply
) {
    const { id } = request.params;

    const cargaRepository = new PrismaCargaQuimicaRepository();

    const movimentarCarga = new MovimentarCargaQuimica(
        cargaRepository
    );

    try {
        await movimentarCarga.executar(id);

        return reply.status(200).send({
            mensagem: "Carga química movimentada com sucesso",
            id,
            status: "MOVIMENTADA"
        });

    } catch (error) {
        if (error instanceof Error) {

            if (error.message === "CARGA_NAO_ENCONTRADA") {
                return reply.status(404).send({
                    mensagem: "Carga química não encontrada"
                });
            }

            // Erros de regras de negócio
            if (
                error.message.includes("moviment") ||
                error.message.includes("Moviment") ||
                error.message.includes("liberad") ||
                error.message.includes("Liberad") ||
                error.message.includes("status") ||
                error.message.includes("Status")
            ) {
                return reply.status(400).send({
                    mensagem: error.message
                });
            }
        }

        throw error;
    }
}
