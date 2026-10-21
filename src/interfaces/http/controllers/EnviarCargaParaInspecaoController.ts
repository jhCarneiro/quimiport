
import { FastifyReply, FastifyRequest } from "fastify";

import { EnviarCargaParaInspecao } from "../../../application/use-cases/EnviarCargaParaInspecao";

import { PrismaCargaQuimicaRepository } from "../../../infrastructure/repositories/PrismaCargaQuimicaRepository";

interface Params {
    id: string;
}

export async function EnviarCargaParaInspecaoController(
    request: FastifyRequest<{ Params: Params }>,
    reply: FastifyReply
) {
    const { id } = request.params;

    const repository = new PrismaCargaQuimicaRepository();
    const enviarCarga = new EnviarCargaParaInspecao(repository);

    try {
        const carga = await enviarCarga.executar(id);

        return reply.status(200).send({
            id: carga.getID(),
            status: carga.getStatus(),
            atualizadoEm: carga.getAtualizadoEm()
        });

    } catch (error) {
        if (error instanceof Error) {

            if (error.message === "CARGA_NAO_ENCONTRADA") {
                return reply.status(404).send({
                    mensagem: "Carga química não encontrada"
                });
            }

            if (
                error.message.includes(
                    "Apenas cargas com Status PENDENTE_DOCUMENTACAO"
                )
            ) {
                return reply.status(400).send({
                    mensagem: error.message
                });
            }
        }

        throw error;
    }
}
