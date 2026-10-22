import { FastifyReply, FastifyRequest } from "fastify";
import { CadastrarCargaQuimica, CadastrarCargaDTO } from "../../../application/use-cases/CadastrarCargaQuimica";
import { PrismaCargaQuimicaRepository } from "../../../infrastructure/repositories/PrismaCargaQuimicaRepository";
import { PrismaProdutoQuimicoRepository } from "../../../infrastructure/repositories/PrismaProdutoQuimicoRepository";
import { apresentarCarga } from "./apresentarCarga";

export async function CadastrarCargaQuimicaController(request: FastifyRequest<{ Body: CadastrarCargaDTO }>, reply: FastifyReply) {
    try {
        const useCase = new CadastrarCargaQuimica(new PrismaCargaQuimicaRepository(), new PrismaProdutoQuimicoRepository());
        const carga = await useCase.executar({
            ...request.body,
            dataEntrada: request.body.dataEntrada ? new Date(request.body.dataEntrada) : undefined
        });
        return reply.status(201).send(apresentarCarga(carga));
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "PRODUTO_NAO_ENCONTRADO") return reply.status(404).send({ mensagem: error.message });
            if (["PRODUTO_INATIVO", "QUANTIDADE_INVALIDA", "CAMPOS_OBRIGATORIOS_AUSENTES", "DATA_ENTRADA_INVALIDA"].includes(error.message))
                return reply.status(400).send({ mensagem: error.message });
        }
        throw error;
    }
}
