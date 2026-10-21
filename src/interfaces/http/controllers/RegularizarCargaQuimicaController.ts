
import { FastifyReply, FastifyRequest } from "fastify";

import { RegularizarCargaQuimica } from "../../../application/use-cases/RegularizarCargaQuimica";

import { PrismaCargaQuimicaRepository } from "../../../infrastructure/repositories/PrismaCargaQuimicaRepository";

interface Params {
    id: string;
}

export async function RegularizarCargaQuimicaController(
    request: FastifyRequest<{ Params: Params }>,
    reply: FastifyReply
) {
    const { id } = request.params;

    const cargaRepository = new PrismaCargaQuimicaRepository();

    const regularizarCargaQuimica = new RegularizarCargaQuimica(
        cargaRepository
    );

    try {
        await regularizarCargaQuimica.executar(id);

        return reply.status(200).send({
            mensagem: "Carga química regularizada com sucesso",
            cargaId: id,
            status: "PENDENTE_INSPECAO"
        });

    } catch (error) {
        if (error instanceof Error) {

            if (error.message === "CARGA_NAO_ENCONTRADA") {
                return reply.status(404).send({
                    mensagem: "Carga química não encontrada"
                });
            }

            // Erro de regra de negócio:
            // somente cargas bloqueadas podem ser regularizadas.
            if (
                error.message.includes("regulariz") ||
                error.message.includes("bloquead")
            ) {
                return reply.status(400).send({
                    mensagem: error.message
                });
            }
        }

        // Erros inesperados são tratados pelo Fastify.
        throw error;
    }
}
