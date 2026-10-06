import { ProdutoQuimico } from "../../domain/entities/ProdutoQuimico";
import { ProdutoQuimicoRepository } from "./ProdutoQuimicoRepository";

export class InMemoryProdutoQuimicoRepository
    implements ProdutoQuimicoRepository {
    public produtos: ProdutoQuimico[] = [];


    async salvar(produto: ProdutoQuimico): Promise<void>{
        this.produtos.push(produto)
    }

    async buscar(id: string): Promise<ProdutoQuimico | null>{
        const produtoEncontrado = this.produtos.find((produto)=>produto.getID() === id)
        return produtoEncontrado ?? null
    }   

    async listar():Promise<ProdutoQuimico[]>{
        return this.produtos
    }
}
