import { ProdutoQuimico } from "../../domain/entities/ProdutoQuimico";
import { ProdutoQuimicoRepository } from "../repositories/ProdutoQuimicoRepository";

export class BuscarProdutoQuimico {
    private repository: ProdutoQuimicoRepository;

    constructor(repository: ProdutoQuimicoRepository) {
        this.repository = repository
    }

    async execute(id: string): Promise<ProdutoQuimico | null> {
        return this.repository.buscar(id)
    }
}