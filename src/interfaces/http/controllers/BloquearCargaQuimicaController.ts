
import { FastifyReply, FastifyRequest } from "fastify";

import { BloquearCargaQuimica } from "../../../application/use-cases/BloquearCargaQuimica";

import { PrismaCargaQuimicaRepository } from "../../../infrastructure/repositories/PrismaCargaQuimicaRepository";

interface Params {
    id: string;
}

export async function BloquearCargaQuimicaController(
    request: FastifyRequest<{ Params: Params }>,
    reply: FastifyReply
) {
    const { id } = request.params;

    const cargaRepository = new PrismaCargaQuimicaRepository();

    const bloquearCargaQuimica = new BloquearCargaQuimica(
        cargaRepository
    );

    try {
        await bloquearCargaQuimica.executar(id);

        return reply.status(200).send({
            mensagem: "Carga química bloqueada com sucesso",
            cargaId: id,
            status: "BLOQUEADA"
        });

    } catch (error) {
        if (error instanceof Error) {

            if (error.message === "CARGA_NAO_ENCONTRADA") {
                return reply.status(404).send({
                    mensagem: "Carga química não encontrada"
                });
            }

            // Erros das regras de negócio da entidade CargaQuimica
            if (
                error.message.includes("documento") ||
                error.message.includes("bloquead") ||
                error.message.includes("movimentad")
            ) {
                return reply.status(400).send({
                    mensagem: error.message
                });
            }
        }

        throw error;
    }
}
