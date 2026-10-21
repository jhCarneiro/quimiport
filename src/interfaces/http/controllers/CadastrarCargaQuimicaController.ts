
import { FastifyReply, FastifyRequest } from "fastify";

import { CadastrarCargaQuimica } from "../../../application/use-cases/CadastrarCargaQuimica";
import { PrismaCargaQuimicaRepository } from "../../../infrastructure/repositories/PrismaCargaQuimicaRepository";

export async function CadastrarCargaQuimicaController(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const repository = new PrismaCargaQuimicaRepository();
    const cadastrarCarga = new CadastrarCargaQuimica(repository);

    const carga = await cadastrarCarga.executar();

    return reply.status(201).send({
        id: carga.getID(),
        status: carga.getStatus(),
        criadoEm: carga.getCriadoEm(),
        atualizadoEm: carga.getAtualizadoEm()
    });
}
