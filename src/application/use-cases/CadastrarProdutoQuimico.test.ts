import { describe, expect, it } from "vitest";
import { CadastrarProdutoQuimico } from "./CadastrarProdutoQuimico";
import { InMemoryProdutoQuimicoRepository } from "../repositories/InMemoryProdutoQuimicoRepository";


describe("CadastrarProdutoQuimico", () => {
    it("deve cadastrar um produto químico", async () => {
        const repository = new InMemoryProdutoQuimicoRepository();
        const cadastrarProduto = new CadastrarProdutoQuimico(repository);

        const produto = await cadastrarProduto.execute({
            nome: "Ácido Sulfúrico",
            descricao: "Produto químico corrosivo utilizado em processos industriais",
            numeroONU: "1830",
            classeRisco: "Corrosivo",
            grupoCompatibilidade: "CORROSIVOS"
        });


        expect(repository.produtos.length).toBe(1)
        expect(produto.getNome()).toBe("Ácido Sulfúrico")
    })
})