
import { FastifyReply, FastifyRequest } from "fastify";

import { ListarCargasQuimicas } from "../../../application/use-cases/ListarCargasQuimicas";
import { PrismaCargaQuimicaRepository } from "../../../infrastructure/repositories/PrismaCargaQuimicaRepository";

export async function ListarCargasQuimicasController(
    request: FastifyRequest,
    reply: FastifyReply
) {
    const repository = new PrismaCargaQuimicaRepository();
    const listarCargas = new ListarCargasQuimicas(repository);

    const cargas = await listarCargas.executar();

    return reply.status(200).send(
        cargas.map((carga) => ({
            id: carga.getID(),
            status: carga.getStatus(),
            criadoEm: carga.getCriadoEm(),
            atualizadoEm: carga.getAtualizadoEm()
        }))
    );
}
