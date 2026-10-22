
import { ProdutoQuimicoRepository } from "../repositories/ProdutoQuimicoRepository";

export class InativarProdutoQuimico {

    constructor(
        private produtoRepository: ProdutoQuimicoRepository
    ) {}

    async executar(id: string): Promise<void> {

        const produto = await this.produtoRepository.buscar(id);

        if (!produto) {
            throw new Error("PRODUTO_NAO_ENCONTRADO");
        }

        produto.inativar();

        await this.produtoRepository.salvar(produto);
    }
}
