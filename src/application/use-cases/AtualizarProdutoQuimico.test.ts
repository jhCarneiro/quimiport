
import { describe, it, expect, vi } from "vitest";
import { AtualizarProdutoQuimico } from "./AtualizarProdutoQuimico";
import { ProdutoQuimico } from "../../domain/entities/ProdutoQuimico";
import type { ProdutoQuimicoRepository } from "../repositories/ProdutoQuimicoRepository";

describe("AtualizarProdutoQuimico", () => {

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

    const dadosAtualizados = {
        nome: "Ácido Sulfúrico Concentrado",
        descricao: "Produto químico concentrado",
        numeroONU: "1830",
        classeRisco: "8",
        grupoCompatibilidade: "CORROSIVOS"
    };

    it("deve atualizar um produto existente", async () => {

        const produto = criarProduto();
        const repository = criarRepositoryMock(produto);
        const useCase = new AtualizarProdutoQuimico(repository);

        await useCase.executar({
            id: produto.getID(),
            ...dadosAtualizados
        });

        expect(produto.getNome()).toBe("Ácido Sulfúrico Concentrado");
        expect(produto.getDescricao()).toBe("Produto químico concentrado");
        expect(repository.salvar).toHaveBeenCalledWith(produto);
    });

    it("não deve atualizar um produto inexistente", async () => {

        const repository = criarRepositoryMock(null);
        const useCase = new AtualizarProdutoQuimico(repository);

        await expect(
            useCase.executar({
                id: "produto-inexistente",
                ...dadosAtualizados
            })
        ).rejects.toThrow("PRODUTO_NAO_ENCONTRADO");

        expect(repository.salvar).not.toHaveBeenCalled();
    });

    it("não deve atualizar um produto inativo", async () => {

        const produto = criarProduto();
        produto.inativar();

        const repository = criarRepositoryMock(produto);
        const useCase = new AtualizarProdutoQuimico(repository);

        await expect(
            useCase.executar({
                id: produto.getID(),
                ...dadosAtualizados
            })
        ).rejects.toThrow("PRODUTO_INATIVO");

        expect(repository.salvar).not.toHaveBeenCalled();
    });
});
