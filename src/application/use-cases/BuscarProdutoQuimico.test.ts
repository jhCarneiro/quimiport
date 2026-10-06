import { describe, expect, it } from "vitest";
import { ProdutoQuimico } from "../../domain/entities/ProdutoQuimico";
import { InMemoryProdutoQuimicoRepository } from "../repositories/InMemoryProdutoQuimicoRepository";
import { BuscarProdutoQuimico } from "./BuscarProdutoQuimico";

describe("BuscarProdutoQuimico", () => {

    it("deve buscar um produto químico pelo ID", async () => {
        const repository = new InMemoryProdutoQuimicoRepository();

        const produto = new ProdutoQuimico({
            nome: "Ácido Sulfúrico",
            numeroONU: "1830",
            classeRisco: "Corrosivo"
        });

        await repository.salvar(produto);

        const buscarProduto = new BuscarProdutoQuimico(repository);
        const produtoEncontrado = await buscarProduto.execute(
            produto.getID()
        )
        expect(produtoEncontrado?.getID()).toBe(produto.getID())
       
    });

    it("deve retornar null quando o produto não existir", async () => {
        const repository = new InMemoryProdutoQuimicoRepository();

        const buscarProduto = new BuscarProdutoQuimico(repository);

       const produtoEncontrado = await buscarProduto.execute("id")
       expect(produtoEncontrado).toBeNull()
    });

});