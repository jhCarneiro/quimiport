
import { ProdutoQuimicoRepository } from "../repositories/ProdutoQuimicoRepository";

export interface AtualizarProdutoQuimicoDTO {
    id: string;
    nome: string;
    descricao: string;
    numeroONU: string;
    classeRisco: string;
    grupoCompatibilidade: string;
}

export class AtualizarProdutoQuimico {

    constructor(
        private produtoRepository: ProdutoQuimicoRepository
    ) {}

    async executar(dados: AtualizarProdutoQuimicoDTO): Promise<void> {

        const produto = await this.produtoRepository.buscar(dados.id);

        if (!produto) {
            throw new Error("PRODUTO_NAO_ENCONTRADO");
        }

        if (produto.getStatus() === "INATIVO") {
            throw new Error("PRODUTO_INATIVO");
        }

        produto.atualizarDados({
            nome: dados.nome,
            descricao: dados.descricao,
            numeroONU: dados.numeroONU,
            classeRisco: dados.classeRisco,
            grupoCompatibilidade: dados.grupoCompatibilidade
        });

        await this.produtoRepository.salvar(produto);
    }
}
