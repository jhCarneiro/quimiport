
import { FastifyReply, FastifyRequest } from "fastify";

import { CadastrarDocumento } from "../../../application/use-cases/CadastrarDocumento";

import { PrismaCargaQuimicaRepository } from "../../../infrastructure/repositories/PrismaCargaQuimicaRepository";

import { PrismaDocumentoRepository } from "../../../infrastructure/repositories/PrismaDocumentoRepository";

interface Params {
    id: string;
}

interface Body {
    tipo: string;
    numero: string;
    dataEmissao: string;
    dataValidade: string;
}

export async function CadastrarDocumentoController(
    request: FastifyRequest<{ Params: Params; Body: Body }>,
    reply: FastifyReply
) {
    const { id } = request.params;

    const {
        tipo,
        numero,
        dataEmissao,
        dataValidade
    } = request.body;

    const cargaRepository = new PrismaCargaQuimicaRepository();
    const documentoRepository = new PrismaDocumentoRepository();

    const cadastrarDocumento = new CadastrarDocumento(
        cargaRepository,
        documentoRepository
    );

    try {
        const documento = await cadastrarDocumento.executar({
            cargaId: id,
            tipo,
            numero,
            dataEmissao: new Date(dataEmissao),
            dataValidade: new Date(dataValidade)
        });

        return reply.status(201).send({
            id: documento.getID(),
            cargaId: id,
            tipo: documento.getTipo(),
            numero: documento.getNumero(),
            dataEmissao: documento.getDataEmissao(),
            dataValidade: documento.getDataValidade(),
            criadoEm: documento.getCriadoEm()
        });

    } catch (error) {
        if (error instanceof Error) {

            if (error.message === "CARGA_NAO_ENCONTRADA") {
                return reply.status(404).send({
                    mensagem: "Carga química não encontrada"
                });
            }

            const errosValidacao = [
                "O tipo precisa ser informado",
                "O numero precisa ser informado",
                "A data de emissão deve ser válida",
                "A data de validade deve ser válida",
                "A data de validade nao pode ser anterior a data de emissão"
            ];

            if (errosValidacao.includes(error.message)) {
                return reply.status(400).send({
                    mensagem: error.message
                });
            }
        }

        throw error;
    }
}
