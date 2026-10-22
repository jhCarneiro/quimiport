import { apresentarCarga } from "./apresentarCarga";

import { FastifyReply, FastifyRequest } from "fastify";
import { BuscarCargaQuimica } from "../../../application/use-cases/BuscarCargaQuimica";
import { PrismaCargaQuimicaRepository } from "../../../infrastructure/repositories/PrismaCargaQuimicaRepository";

interface BuscarCargaParams {
    id: string;
}

export async function BuscarCargaQuimicaController(
    request: FastifyRequest<{ Params: BuscarCargaParams }>,
    reply: FastifyReply
) {
    const { id } = request.params;

    const repository = new PrismaCargaQuimicaRepository();
    const buscarCarga = new BuscarCargaQuimica(repository);

    const carga = await buscarCarga.executar(id);

    if (!carga) {
        return reply.status(404).send({
            mensagem: "Carga química não encontrada"
        });
    }

    return reply.status(200).send(apresentarCarga(carga));
}
