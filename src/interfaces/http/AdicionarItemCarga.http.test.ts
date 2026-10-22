
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { FastifyInstance } from "fastify";

import { criarApp } from "./app";
import { CargaQuimica, StatusCarga } from "../../domain/entities/CargaQuimica";
import { ProdutoQuimico } from "../../domain/entities/ProdutoQuimico";

const mocks = vi.hoisted(() => ({
    buscarCarga: vi.fn(),
    adicionarItem: vi.fn(),
    buscarProduto: vi.fn()
}));

vi.mock("../../infrastructure/repositories/PrismaCargaQuimicaRepository", () => ({
    PrismaCargaQuimicaRepository: class {
        buscar = mocks.buscarCarga;
        adicionarItem = mocks.adicionarItem;
    }
}));

vi.mock("../../infrastructure/repositories/PrismaProdutoQuimicoRepository", () => ({
    PrismaProdutoQuimicoRepository: class {
        buscar = mocks.buscarProduto;
    }
}));

describe("POST /cargas-quimicas/:id/itens", () => {
    let app: FastifyInstance;

    const cargaId = "11111111-1111-4111-8111-111111111111";
    const produtoId = "22222222-2222-4222-8222-222222222222";

    function criarCarga() {
        return new CargaQuimica({
            status: StatusCarga.PENDENTE_DOCUMENTACAO
        });
    }

    function criarProduto() {
        return new ProdutoQuimico({
            id: produtoId,
            nome: "Ácido Sulfúrico",
            descricao: "Produto corrosivo",
            numeroONU: "1830",
            classeRisco: "8",
            grupoCompatibilidade: "CORROSIVOS"
        });
    }

    function criarPayload() {
        return {
            produtoQuimicoID: produtoId,
            quantidade: 100,
            unidade: "L"
        };
    }

    beforeEach(() => {
        vi.clearAllMocks();

        app = criarApp();

        mocks.buscarCarga.mockResolvedValue(criarCarga());
        mocks.buscarProduto.mockResolvedValue(criarProduto());
        mocks.adicionarItem.mockResolvedValue(undefined);
    });

    afterEach(async () => {
        await app.close();
    });

    it("deve retornar HTTP 201 para produto ativo", async () => {
        const resposta = await app.inject({
            method: "POST",
            url: `/cargas-quimicas/${cargaId}/itens`,
            payload: criarPayload()
        });

        expect(resposta.statusCode).toBe(201);
        expect(resposta.json()).toMatchObject({
            produtoQuimicoID: produtoId,
            quantidade: 100,
            unidade: "L"
        });

        expect(mocks.adicionarItem).toHaveBeenCalledOnce();
    });

    it("deve retornar HTTP 400 para produto inativo", async () => {
        const produto = criarProduto();
        produto.inativar();

        mocks.buscarProduto.mockResolvedValue(produto);

        const resposta = await app.inject({
            method: "POST",
            url: `/cargas-quimicas/${cargaId}/itens`,
            payload: criarPayload()
        });

        expect(resposta.statusCode).toBe(400);
        expect(resposta.json()).toEqual({
            mensagem: "PRODUTO_INATIVO"
        });

        expect(mocks.adicionarItem).not.toHaveBeenCalled();
    });

    it("deve retornar HTTP 404 para produto inexistente", async () => {
        mocks.buscarProduto.mockResolvedValue(null);

        const resposta = await app.inject({
            method: "POST",
            url: `/cargas-quimicas/${cargaId}/itens`,
            payload: criarPayload()
        });

        expect(resposta.statusCode).toBe(404);
        expect(resposta.json()).toEqual({
            mensagem: "PRODUTO_NAO_ENCONTRADO"
        });

        expect(mocks.adicionarItem).not.toHaveBeenCalled();
    });

    it("deve retornar HTTP 404 para carga inexistente", async () => {
        mocks.buscarCarga.mockResolvedValue(null);

        const resposta = await app.inject({
            method: "POST",
            url: `/cargas-quimicas/${cargaId}/itens`,
            payload: criarPayload()
        });

        expect(resposta.statusCode).toBe(404);
        expect(resposta.json()).toEqual({
            mensagem: "CARGA_NAO_ENCONTRADA"
        });

        expect(mocks.adicionarItem).not.toHaveBeenCalled();
    });
});
