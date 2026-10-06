import { ProdutoQuimico } from "../../domain/entities/ProdutoQuimico";
import { ProdutoQuimicoRepository } from "../repositories/ProdutoQuimicoRepository";

interface CadastrarProdutoQuimicoInput {
    nome: string;
    numeroONU: string;
    classeRisco: string;
}

export class CadastrarProdutoQuimico {
    private repository: ProdutoQuimicoRepository;

    constructor(repository: ProdutoQuimicoRepository) {
        this.repository = repository
    }

    async execute(
        input: CadastrarProdutoQuimicoInput
    ): Promise<ProdutoQuimico> {

        const produto = new ProdutoQuimico({
            nome: input.nome,
            numeroONU: input.numeroONU,
            classeRisco: input.classeRisco
        })

        await this.repository.salvar(produto)
        return produto
    }

}