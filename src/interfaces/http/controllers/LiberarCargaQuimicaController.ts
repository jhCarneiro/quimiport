
import { FastifyReply, FastifyRequest } from "fastify";

import { LiberarCargaQuimica } from "../../../application/use-cases/LiberarCargaQuimica";

import { PrismaCargaQuimicaRepository } from "../../../infrastructure/repositories/PrismaCargaQuimicaRepository";

interface Params {
    id: string;
}

export async function LiberarCargaQuimicaController(
    request: FastifyRequest<{ Params: Params }>,
    reply: FastifyReply
) {
    const { id } = request.params;

    const cargaRepository = new PrismaCargaQuimicaRepository();

    const liberarCargaQuimica = new LiberarCargaQuimica(
        cargaRepository
    );

    try {
        await liberarCargaQuimica.executar(id);

        return reply.status(200).send({
            mensagem: "Carga química liberada com sucesso",
            id,
            status: "LIBERADA"
        });

    } catch (error) {
        if (error instanceof Error) {

            if (error.message === "CARGA_NAO_ENCONTRADA") {
                return reply.status(404).send({
                    mensagem: "Carga química não encontrada"
                });
            }

            // Erros de regras de negócio da entidade
            if (
                error.message.includes("inspeção") ||
                error.message.includes("Inspeção") ||
                error.message.includes("status") ||
                error.message.includes("Status") ||
                error.message.includes("liberada") ||
                error.message.includes("LIBERADA")
            ) {
                return reply.status(400).send({
                    mensagem: error.message
                });
            }
        }

        throw error;
    }
}
