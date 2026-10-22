import { CargaQuimica, StatusCarga } from "../../domain/entities/CargaQuimica";
import { ItemCarga } from "../../domain/entities/ItemCarga";
import { CargaQuimicaRepository } from "../repositories/CargaQuimicaRepository";
import { ProdutoQuimicoRepository } from "../repositories/ProdutoQuimicoRepository";

export interface CadastrarCargaDTO {
    codigo: string; produtoQuimicoID: string; quantidade: number; unidade: string;
    origem: string; destino: string; responsavelTecnico: string;
    documentacaoObrigatoria: string; dataEntrada?: Date;
}
export class CadastrarCargaQuimica {
    constructor(private readonly repository: CargaQuimicaRepository,
                private readonly produtos: ProdutoQuimicoRepository) {}

    async executar(dados: CadastrarCargaDTO): Promise<CargaQuimica> {
        for (const valor of [dados.codigo, dados.produtoQuimicoID, dados.unidade, dados.origem,
            dados.destino, dados.responsavelTecnico, dados.documentacaoObrigatoria]) {
            if (!valor?.trim()) throw new Error("CAMPOS_OBRIGATORIOS_AUSENTES");
        }
        if (!Number.isFinite(dados.quantidade) || dados.quantidade <= 0) throw new Error("QUANTIDADE_INVALIDA");
        if (dados.dataEntrada && Number.isNaN(dados.dataEntrada.getTime())) throw new Error("DATA_ENTRADA_INVALIDA");
        const produto = await this.produtos.buscar(dados.produtoQuimicoID);
        if (!produto) throw new Error("PRODUTO_NAO_ENCONTRADO");
        if (produto.getStatus() !== "ATIVO") throw new Error("PRODUTO_INATIVO");
        const carga = new CargaQuimica({
            status: StatusCarga.REGISTRADA, codigo: dados.codigo, origem: dados.origem,
            destino: dados.destino, responsavelTecnico: dados.responsavelTecnico,
            documentacaoObrigatoria: dados.documentacaoObrigatoria, dataEntrada: dados.dataEntrada
        });
        const item = new ItemCarga({ produtoQuimicoID: dados.produtoQuimicoID,
            quantidade: dados.quantidade, unidade: dados.unidade });
        // Persistência atômica: criar a carga e seu item associado na mesma transação.
        await this.repository.salvarComItem(carga, item);
        carga.adicionarItem(item);
        return carga;
    }
}
