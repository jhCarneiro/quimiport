
import { FastifyReply, FastifyRequest } from "fastify";

import { AdicionarItemCarga } from "../../../application/use-cases/AdicionarItemCarga";

import { PrismaCargaQuimicaRepository } from "../../../infrastructure/repositories/PrismaCargaQuimicaRepository";

import { PrismaProdutoQuimicoRepository } from "../../../infrastructure/repositories/PrismaProdutoQuimicoRepository";

interface Params {
    id: string;
}

interface Body {
    produtoQuimicoID: string;
    quantidade: number;
    unidade: string;
}

export async function AdicionarItemCargaController(
    request: FastifyRequest<{ Params: Params; Body: Body }>,
    reply: FastifyReply
) {
    const { id } = request.params;

    const {
        produtoQuimicoID,
        quantidade,
        unidade
    } = request.body;

    try {
        // Criar os repositórios
        const cargaRepository = new PrismaCargaQuimicaRepository();
        const produtoRepository = new PrismaProdutoQuimicoRepository();

        // Injetar os repositórios no caso de uso
        const adicionarItem = new AdicionarItemCarga(
            cargaRepository,
            produtoRepository
        );

        // Executar o caso de uso
        const item = await adicionarItem.executar({
            cargaId: id,
            produtoQuimicoID,
            quantidade,
            unidade
        });

        return reply.status(201).send({
            id: item.getID(),
            produtoQuimicoID: item.getProdutoQuimicoID(),
            quantidade: item.getQuantidade(),
            unidade: item.getUnidade()
        });

    } catch (error) {

        if (error instanceof Error) {

            if (
                error.message === "CARGA_NAO_ENCONTRADA" ||
                error.message === "PRODUTO_NAO_ENCONTRADO"
            ) {
                return reply.status(404).send({
                    mensagem: error.message
                });
            }


            if (
                error.message === "PRODUTO_INATIVO" ||
                error.message === "CARGA_NAO_PERMITE_ITENS" ||
                error.message === "A quantidade precisa ser maior que 0" ||
                error.message === "O ProdutoQuimicoID precisa ser informado" ||
                error.message === "A unidade nao pode estar vazia"
            ) {
                return reply.status(400).send({
                    mensagem: error.message
                });
            }

        }

        throw error;
    }
}
