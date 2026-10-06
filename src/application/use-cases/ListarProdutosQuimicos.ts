import { ProdutoQuimico } from "../../domain/entities/ProdutoQuimico";
import { ProdutoQuimicoRepository } from "../repositories/ProdutoQuimicoRepository";

export class ListarProdutosQuimicos{
    private repository : ProdutoQuimicoRepository;

    constructor(repository: ProdutoQuimicoRepository){
        this.repository = repository
    }

    async execute(): Promise<ProdutoQuimico[]>{
      return  this.repository.listar()
    }
}