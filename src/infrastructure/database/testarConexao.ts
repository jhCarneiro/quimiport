
import { prisma } from "./prisma";
import { PrismaProdutoQuimicoRepository } from "../repositories/PrismaProdutoQuimicoRepository";
import { ProdutoQuimico } from "../../domain/entities/ProdutoQuimico";

async function main() {
    const repository = new PrismaProdutoQuimicoRepository();

    const produto = new ProdutoQuimico({
        nome: "Ácido Sulfúrico",
        numeroONU: "1830",
        classeRisco: "8",
    });

    await repository.salvar(produto);

    console.log("PRODUTO SALVO COM SUCESSO");

    const produtoEncontrado = await repository.buscar(produto.getID());

    console.log("Produto encontrado", {
        id: produtoEncontrado?.getID(),
        nome: produtoEncontrado?.getNome(),
        numeroONU: produtoEncontrado?.getNumeroONU(),
        classeRisco: produtoEncontrado?.getClasseRisco(),
    });

    const produtosQuimicos = await repository.listar();

    console.log("Total de produtos cadastrados:", produtosQuimicos.length);
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });
