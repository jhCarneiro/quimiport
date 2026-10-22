
import { describe, it, expect, vi } from "vitest";
import { InativarProdutoQuimico } from "./InativarProdutoQuimico";
import { ProdutoQuimico } from "../../domain/entities/ProdutoQuimico";
import type { ProdutoQuimicoRepository } from "../repositories/ProdutoQuimicoRepository";

describe("InativarProdutoQuimico", () => {

    function criarProduto() {
        return new ProdutoQuimico({
            nome: "Ácido Sulfúrico",
            descricao: "Produto corrosivo",
            numeroONU: "1830",
            classeRisco: "8",
            grupoCompatibilidade: "CORROSIVOS"
        });
    }

    function criarRepositoryMock(produto: ProdutoQuimico | null) {
        const repository: ProdutoQuimicoRepository = {
            salvar: vi.fn(async () => {}),
            buscar: vi.fn(async () => produto),
            listar: vi.fn(async () => [])
        };

        return repository;
    }

    it("deve inativar um produto ativo", async () => {

        const produto = criarProduto();
        const repository = criarRepositoryMock(produto);
        const useCase = new InativarProdutoQuimico(repository);

        await useCase.executar(produto.getID());

        expect(produto.getStatus()).toBe("INATIVO");
        expect(repository.salvar).toHaveBeenCalledWith(produto);
    });

    it("não deve inativar um produto inexistente", async () => {

        const repository = criarRepositoryMock(null);
        const useCase = new InativarProdutoQuimico(repository);

        await expect(
            useCase.executar("produto-inexistente")
        ).rejects.toThrow("PRODUTO_NAO_ENCONTRADO");

        expect(repository.salvar).not.toHaveBeenCalled();
    });

    it("não deve inativar um produto já inativo", async () => {

        const produto = criarProduto();
        produto.inativar();

        const repository = criarRepositoryMock(produto);
        const useCase = new InativarProdutoQuimico(repository);

        await expect(
            useCase.executar(produto.getID())
        ).rejects.toThrow("O produto químico já está inativo");

        expect(repository.salvar).not.toHaveBeenCalled();
    });
});
