
import { describe, it, expect, afterEach } from "vitest";
import { criarApp } from "./app";

import type { FastifyInstance } from "fastify";

describe("QuimiPort API - Testes HTTP", () => {

    let app: FastifyInstance | undefined;

    afterEach(async () => {
        if (app) {
            await app.close();
            app = undefined;
        }
    });


    it("deve retornar HTTP 500 sem expor detalhes internos", async () => {

        app = criarApp();

        // Rota criada exclusivamente para este teste
        app.get("/teste-erro-interno", async () => {
            throw new Error("Erro interno com informação sensível");
        });

        const resposta = await app.inject({
            method: "GET",
            url: "/teste-erro-interno"
        });

        expect(resposta.statusCode).toBe(500);

        expect(resposta.json()).toEqual({
            mensagem: "Erro interno do servidor"
        });

        expect(resposta.body).not.toContain(
            "Erro interno com informação sensível"
        );
    });


    it("deve retornar HTTP 404 para uma rota inexistente", async () => {

        app = criarApp();

        const resposta = await app.inject({
            method: "GET",
            url: "/rota-que-nao-existe"
        });

        expect(resposta.statusCode).toBe(404);
    });


    it("deve retornar HTTP 200 no endpoint /health", async () => {

        app = criarApp();

        const resposta = await app.inject({
            method: "GET",
            url: "/health"
        });

        expect(resposta.statusCode).toBe(200);

        expect(resposta.json()).toEqual({
            status: "ok",
            sistema: "QuimiPort"
        });
    });

    it("deve retornar HTTP 400 quando o ID da carga for inválido", async () => {

        app = criarApp();

        const resposta = await app.inject({
            method: "GET",
            url: "/cargas-quimicas/id-invalido"
        });

        expect(resposta.statusCode).toBe(400);

        expect(resposta.json()).toEqual({
            mensagem: "Dados inválidos na requisição"
        });
    });
});
