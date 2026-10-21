
import { FastifyReply, FastifyRequest } from "fastify";
import { ListarItensCarga } from "../../../application/use-cases/ListarItensCarga";
import { PrismaCargaQuimicaRepository } from "../../../infrastructure/repositories/PrismaCargaQuimicaRepository";

interface Params {
    id: string;
}

export async function ListarItensCargaController(
    request: FastifyRequest<{ Params: Params }>,
    reply: FastifyReply
) {
    const repository = new PrismaCargaQuimicaRepository();
    const listarItensCarga = new ListarItensCarga(repository);

    const { id } = request.params;

    const itens = await listarItensCarga.executar(id);

    if (itens === null) {
        return reply.status(404).send({
            mensagem: "Carga química não encontrada"
        });
    }

    return reply.status(200).send(itens);
}
