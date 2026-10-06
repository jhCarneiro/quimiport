import { describe, expect, it } from "vitest";
import { ProdutoQuimico } from "../../domain/entities/ProdutoQuimico";
import { InMemoryProdutoQuimicoRepository } from "../repositories/InMemoryProdutoQuimicoRepository";
import { ListarProdutosQuimicos } from "./ListarProdutosQuimicos";


describe("ListarProdutosQuimicos",()=>{
    let produto1: ProdutoQuimico
    let produto2: ProdutoQuimico
    it("", async ()=>{
        const repository = new InMemoryProdutoQuimicoRepository();

        const produto1 = new ProdutoQuimico({
            nome: "Ácido Sulfúrico",
            numeroONU: "1830",
            classeRisco: "Corrosivo"
        })
        const produto2 = new ProdutoQuimico({
            nome: "Agua",
            numeroONU: "1830",
            classeRisco: "Nehuma"
        })

        repository.salvar(produto1)
        repository.salvar(produto2)

        const listarProdutos = new ListarProdutosQuimicos(repository)
        const produtos = await listarProdutos.execute()

        expect(produtos.length).toBe(2)
    })
})