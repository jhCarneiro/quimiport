import { FastifyRequest, FastifyReply } from "fastify";
import { StatusCarga } from "../../../domain/entities/CargaQuimica";
import { AlterarStatusCargaQuimica } from "../../../application/use-cases/AlterarStatusCargaQuimica";
import { PrismaCargaQuimicaRepository } from "../../../infrastructure/repositories/PrismaCargaQuimicaRepository";
export async function AlterarStatusCargaQuimicaController(request: FastifyRequest<{Params:{id:string};Body:{status:StatusCarga}}>, reply: FastifyReply) {
    try {
        const uc = new AlterarStatusCargaQuimica(new PrismaCargaQuimicaRepository());
        const carga = await uc.executar(request.params.id, request.body.status);
        return reply.status(200).send({ id: carga.getID(), status: carga.getStatus(), atualizadoEm: carga.getAtualizadoEm() });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "CARGA_NAO_ENCONTRADA") return reply.status(404).send({ mensagem: error.message });
            if (["TRANSICAO_STATUS_INVALIDA", "DOCUMENTACAO_OBRIGATORIA_AUSENTE", "INSPECAO_APROVADA_OBRIGATORIA"].includes(error.message))
                return reply.status(400).send({ mensagem: error.message });
        }
        throw error;
    }
}
