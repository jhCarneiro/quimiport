import { ProdutoQuimico } from "../../domain/entities/ProdutoQuimico";

export interface ProdutoQuimicoRepository{
    salvar(produto: ProdutoQuimico):Promise<void>

    buscar(id:string):Promise<ProdutoQuimico | null>

    listar(): Promise<ProdutoQuimico[]>
}