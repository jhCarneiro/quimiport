
import { FastifyReply, FastifyRequest } from "fastify";

import { RegistrarInspecao } from "../../../application/use-cases/RegistrarInspecao";

import { PrismaCargaQuimicaRepository } from "../../../infrastructure/repositories/PrismaCargaQuimicaRepository";

import { PrismaInspecaoRepository } from "../../../infrastructure/repositories/PrismaInspecaoRepository";

interface Params {
    id: string;
}

interface Body {
    responsavelId: string;
    resultado: string;
    observacao: string;
    dataInspecao: string;
}

export async function RegistrarInspecaoController(
    request: FastifyRequest<{ Params: Params; Body: Body }>,
    reply: FastifyReply
) {
    const { id } = request.params;

    const {
        responsavelId,
        resultado,
        observacao,
        dataInspecao
    } = request.body;

    const cargaRepository = new PrismaCargaQuimicaRepository();
    const inspecaoRepository = new PrismaInspecaoRepository();

    const registrarInspecao = new RegistrarInspecao(
        cargaRepository,
        inspecaoRepository
    );

    try {
        const inspecao = await registrarInspecao.executar({
            cargaId: id,
            responsavelId,
            resultado,
            observacao,
            dataInspecao: new Date(dataInspecao)
        });

        return reply.status(201).send({
            id: inspecao.getID(),
            cargaId: inspecao.getCargaId(),
            responsavelId: inspecao.getResponsavelId(),
            resultado: inspecao.getResultado(),
            observacao: inspecao.getObservacao(),
            dataInspecao: inspecao.getDataInspecao(),
            criadoEm: inspecao.getCriadoEm()
        });

    } catch (error) {
        if (error instanceof Error) {

            if (error.message === "CARGA_NAO_ENCONTRADA") {
                return reply.status(404).send({
                    mensagem: "Carga química não encontrada"
                });
            }

            if (
                error.message === "CARGA_NAO_PERMITE_INSPECAO" ||
                error.message === "responsavelId não pode ser vazio" ||
                error.message === "resultado não pode ser vazio" ||
                error.message === "resultado deve ser Aprovada ou Reprovada" ||
                error.message === "dataInspecao deve ser informada"
            ) {
                return reply.status(400).send({
                    mensagem: error.message
                });
            }
        }

        throw error;
    }
}
