
import { describe, it, expect, vi } from "vitest";
import { AdicionarItemCarga } from "./AdicionarItemCarga";

import { ProdutoQuimico } from "../../domain/entities/ProdutoQuimico";
import { CargaQuimica, StatusCarga } from "../../domain/entities/CargaQuimica";

import type { ProdutoQuimicoRepository } from "../repositories/ProdutoQuimicoRepository";
import type { CargaQuimicaRepository } from "../repositories/CargaQuimicaRepository";

describe("AdicionarItemCarga", () => {

    function criarProduto() {
        return new ProdutoQuimico({
            nome: "Ácido Sulfúrico",
            descricao: "Produto corrosivo",
            numeroONU: "1830",
            classeRisco: "8",
            grupoCompatibilidade: "CORROSIVOS"
        });
    }

    function criarCarga() {
        return new CargaQuimica({
            status: StatusCarga.PENDENTE_DOCUMENTACAO
        });
    }

    function criarRepositories(
        carga: CargaQuimica | null,
        produto: ProdutoQuimico | null
    ) {
        const cargaRepository = {
            buscar: vi.fn(async () => carga),
            adicionarItem: vi.fn(async () => { })
        } as unknown as CargaQuimicaRepository;

        const produtoRepository: ProdutoQuimicoRepository = {
            buscar: vi.fn(async () => produto),
            salvar: vi.fn(async () => { }),
            listar: vi.fn(async () => [])
        };

        return { cargaRepository, produtoRepository };
    }

    function criarDados(cargaId: string, produtoId: string) {
        return {
            cargaId,
            produtoQuimicoID: produtoId,
            quantidade: 100,
            unidade: "L"
        };
    }

    it("deve adicionar um produto ativo a uma carga pendente", async () => {
        const carga = criarCarga();
        const produto = criarProduto();

        const { cargaRepository, produtoRepository } =
            criarRepositories(carga, produto);

        const useCase = new AdicionarItemCarga(
            cargaRepository,
            produtoRepository
        );

        const item = await useCase.executar(
            criarDados(carga.getID(), produto.getID())
        );

        expect(item).toBeDefined();
        expect(cargaRepository.adicionarItem).toHaveBeenCalledOnce();
    });

    it("não deve adicionar um produto inativo", async () => {
        const carga = criarCarga();
        const produto = criarProduto();

        produto.inativar();

        const { cargaRepository, produtoRepository } =
            criarRepositories(carga, produto);

        const useCase = new AdicionarItemCarga(
            cargaRepository,
            produtoRepository
        );

        await expect(
            useCase.executar(
                criarDados(carga.getID(), produto.getID())
            )
        ).rejects.toThrow("PRODUTO_INATIVO");

        expect(cargaRepository.adicionarItem).not.toHaveBeenCalled();
    });

    it("não deve adicionar um produto inexistente", async () => {
        const carga = criarCarga();

        const { cargaRepository, produtoRepository } =
            criarRepositories(carga, null);

        const useCase = new AdicionarItemCarga(
            cargaRepository,
            produtoRepository
        );

        await expect(
            useCase.executar(
                criarDados(carga.getID(), "produto-inexistente")
            )
        ).rejects.toThrow("PRODUTO_NAO_ENCONTRADO");

        expect(cargaRepository.adicionarItem).not.toHaveBeenCalled();
    });

    it("não deve adicionar itens a uma carga bloqueada", async () => {

        const carga = new CargaQuimica({
            status: StatusCarga.BLOQUEADA
        });

        const produto = criarProduto();


        const { cargaRepository, produtoRepository } =
            criarRepositories(carga, produto);

        const useCase = new AdicionarItemCarga(
            cargaRepository,
            produtoRepository
        );

        await expect(
            useCase.executar(
                criarDados(carga.getID(), produto.getID())
            )
        ).rejects.toThrow("CARGA_NAO_PERMITE_ITENS");

        expect(cargaRepository.adicionarItem).not.toHaveBeenCalled();
    });
});
