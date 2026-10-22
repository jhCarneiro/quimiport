
import { ProdutoQuimico } from "../../domain/entities/ProdutoQuimico";
import { ProdutoQuimicoRepository } from "../repositories/ProdutoQuimicoRepository";

interface CadastrarProdutoQuimicoInput {
    nome: string;
    descricao: string;
    numeroONU: string;
    classeRisco: string;
    grupoCompatibilidade: string;
}

export class CadastrarProdutoQuimico {
    private repository: ProdutoQuimicoRepository;

    constructor(repository: ProdutoQuimicoRepository) {
        this.repository = repository;
    }

    async execute(
        input: CadastrarProdutoQuimicoInput
    ): Promise<ProdutoQuimico> {

        const produto = new ProdutoQuimico({
            nome: input.nome,
            descricao: input.descricao,
            numeroONU: input.numeroONU,
            classeRisco: input.classeRisco,
            grupoCompatibilidade: input.grupoCompatibilidade,
            status: "ATIVO"
        });

        await this.repository.salvar(produto);

        return produto;
    }
}
