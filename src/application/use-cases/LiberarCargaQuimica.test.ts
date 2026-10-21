
import { describe, it, expect, vi } from "vitest";

import { LiberarCargaQuimica } from "./LiberarCargaQuimica";

import {
    CargaQuimica,
    StatusCarga
} from "../../domain/entities/CargaQuimica";

import { Inspecao } from "../../domain/entities/Inspecao";

import { CargaQuimicaRepository } from "../repositories/CargaQuimicaRepository";

describe("LiberarCargaQuimica", () => {

    function criarCargaPendenteInspecao() {
        const carga = new CargaQuimica();
        carga.pendenteInspecao();
        return carga;
    }

    function criarInspecao(
        cargaId: string,
        resultado: string
    ) {
        return new Inspecao({
            cargaId,
            responsavelId: "fiscal-001",
            resultado,
            observacao: "Inspeção realizada",
            dataInspecao: new Date()
        });
    }

    it("deve liberar carga com inspeção aprovada", async () => {

        const carga = criarCargaPendenteInspecao();

        carga.adicionarInspecao(
            criarInspecao(carga.getID(), "Aprovada")
        );

        const cargaRepository = {
            buscar: vi.fn().mockResolvedValue(carga),
            atualizar: vi.fn().mockResolvedValue(undefined)
        } as unknown as CargaQuimicaRepository;

        const useCase = new LiberarCargaQuimica(cargaRepository);

        await useCase.executar(carga.getID());

        expect(carga.getStatus()).toBe(StatusCarga.LIBERADA);
        expect(cargaRepository.atualizar).toHaveBeenCalledOnce();
    });

    it("não deve liberar carga inexistente", async () => {

        const cargaRepository = {
            buscar: vi.fn().mockResolvedValue(null),
            atualizar: vi.fn()
        } as unknown as CargaQuimicaRepository;

        const useCase = new LiberarCargaQuimica(cargaRepository);

        await expect(
            useCase.executar("carga-inexistente")
        ).rejects.toThrow("CARGA_NAO_ENCONTRADA");

        expect(cargaRepository.atualizar).not.toHaveBeenCalled();
    });

    it("não deve liberar carga sem inspeções", async () => {

        const carga = criarCargaPendenteInspecao();

        const cargaRepository = {
            buscar: vi.fn().mockResolvedValue(carga),
            atualizar: vi.fn()
        } as unknown as CargaQuimicaRepository;

        const useCase = new LiberarCargaQuimica(cargaRepository);

        await expect(
            useCase.executar(carga.getID())
        ).rejects.toThrow();

        expect(carga.getStatus()).toBe(
            StatusCarga.PENDENTE_INSPECAO
        );

        expect(cargaRepository.atualizar).not.toHaveBeenCalled();
    });

    it("não deve liberar carga com última inspeção reprovada", async () => {

        const carga = criarCargaPendenteInspecao();

        carga.adicionarInspecao(
            criarInspecao(carga.getID(), "Reprovada")
        );

        const cargaRepository = {
            buscar: vi.fn().mockResolvedValue(carga),
            atualizar: vi.fn()
        } as unknown as CargaQuimicaRepository;

        const useCase = new LiberarCargaQuimica(cargaRepository);

        await expect(
            useCase.executar(carga.getID())
        ).rejects.toThrow();

        expect(carga.getStatus()).toBe(
            StatusCarga.PENDENTE_INSPECAO
        );

        expect(cargaRepository.atualizar).not.toHaveBeenCalled();
    });

    it("não deve liberar carga que não está pendente de inspeção", async () => {

        const carga = new CargaQuimica();

        const cargaRepository = {
            buscar: vi.fn().mockResolvedValue(carga),
            atualizar: vi.fn()
        } as unknown as CargaQuimicaRepository;

        const useCase = new LiberarCargaQuimica(cargaRepository);

        await expect(
            useCase.executar(carga.getID())
        ).rejects.toThrow();

        expect(carga.getStatus()).toBe(
            StatusCarga.PENDENTE_DOCUMENTACAO
        );

        expect(cargaRepository.atualizar).not.toHaveBeenCalled();
    });
});
