
import { ItemCarga } from "../../domain/entities/ItemCarga";
import { StatusCarga } from "../../domain/entities/CargaQuimica";

import { CargaQuimicaRepository } from "../repositories/CargaQuimicaRepository";
import { ProdutoQuimicoRepository } from "../repositories/ProdutoQuimicoRepository";

interface AdicionarItemCargaDTO {
    cargaId: string;
    produtoQuimicoID: string;
    quantidade: number;
    unidade: string;
}

export class AdicionarItemCarga {

    constructor(
        private readonly cargaRepository: CargaQuimicaRepository,
        private readonly produtoRepository: ProdutoQuimicoRepository
    ) { }

    async executar(dados: AdicionarItemCargaDTO): Promise<ItemCarga> {

        // 1. Verificar se a carga existe
        const carga = await this.cargaRepository.buscar(dados.cargaId);

        if (!carga) {
            throw new Error("CARGA_NAO_ENCONTRADA");
        }

        // 2. Verificar se o produto químico existe
        const produto = await this.produtoRepository.buscar(
            dados.produtoQuimicoID
        );

        if (!produto) {
            throw new Error("PRODUTO_NAO_ENCONTRADO");
        }

        if (produto.getStatus() === "INATIVO") {
            throw new Error("PRODUTO_INATIVO");
        }


        // 3. Verificar se a carga permite novos itens
        if (![StatusCarga.PENDENTE_DOCUMENTACAO, StatusCarga.REGISTRADA].includes(carga.getStatus())) {
            throw new Error("CARGA_NAO_PERMITE_ITENS");
        }

        // 4. Criar o item com as validações da entidade
        const item = new ItemCarga({
            produtoQuimicoID: dados.produtoQuimicoID,
            quantidade: dados.quantidade,
            unidade: dados.unidade
        });

        // 5. Salvar o item utilizando o repositório
        await this.cargaRepository.adicionarItem(
            dados.cargaId,
            item
        );

        return item;
    }
}
