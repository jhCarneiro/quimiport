
import { CargaQuimica } from "../../domain/entities/CargaQuimica";
import { ItemCarga } from "../../domain/entities/ItemCarga";

export interface ItemCargaDetalhado {
    id: string;
    produtoQuimicoID: string;
    nomeProduto: string;
    quantidade: number;
    unidade: string;
}

export interface CargaQuimicaRepository {
    salvar(carga: CargaQuimica): Promise<void>;
    salvarComItem(carga: CargaQuimica, item: ItemCarga): Promise<void>;
    buscar(id: string): Promise<CargaQuimica | null>;
    listar(): Promise<CargaQuimica[]>;

    atualizar(carga: CargaQuimica): Promise<void>;

    adicionarItem(
        cargaId: string,
        item: ItemCarga
    ): Promise<void>;

    listarItens(
        cargaId: string
    ): Promise<ItemCargaDetalhado[]>;
}
