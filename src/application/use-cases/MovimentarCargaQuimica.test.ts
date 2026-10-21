
import { describe, it, expect, vi } from "vitest";

import { MovimentarCargaQuimica } from "./MovimentarCargaQuimica";

import {
    CargaQuimica,
    StatusCarga
} from "../../domain/entities/CargaQuimica";

import { CargaQuimicaRepository } from "../repositories/CargaQuimicaRepository";

describe("MovimentarCargaQuimica", () => {

    it("deve movimentar uma carga liberada", async () => {

        const carga = new CargaQuimica({
            status: StatusCarga.LIBERADA
        });

        const cargaRepository = {
            buscar: vi.fn().mockResolvedValue(carga),
            atualizar: vi.fn().mockResolvedValue(undefined)
        } as unknown as CargaQuimicaRepository;

        const useCase = new MovimentarCargaQuimica(cargaRepository);

        await useCase.executar(carga.getID());

        expect(carga.getStatus()).toBe(StatusCarga.MOVIMENTADA);
        expect(cargaRepository.atualizar).toHaveBeenCalledOnce();
    });

    it("não deve movimentar uma carga inexistente", async () => {

        const cargaRepository = {
            buscar: vi.fn().mockResolvedValue(null),
            atualizar: vi.fn()
        } as unknown as CargaQuimicaRepository;

        const useCase = new MovimentarCargaQuimica(cargaRepository);

        await expect(
            useCase.executar("carga-inexistente")
        ).rejects.toThrow("CARGA_NAO_ENCONTRADA");

        expect(cargaRepository.atualizar).not.toHaveBeenCalled();
    });

    it("não deve movimentar uma carga pendente de inspeção", async () => {

        const carga = new CargaQuimica({
            status: StatusCarga.PENDENTE_INSPECAO
        });

        const cargaRepository = {
            buscar: vi.fn().mockResolvedValue(carga),
            atualizar: vi.fn()
        } as unknown as CargaQuimicaRepository;

        const useCase = new MovimentarCargaQuimica(cargaRepository);

        await expect(
            useCase.executar(carga.getID())
        ).rejects.toThrow();

        expect(carga.getStatus()).toBe(
            StatusCarga.PENDENTE_INSPECAO
        );

        expect(cargaRepository.atualizar).not.toHaveBeenCalled();
    });

    it("não deve movimentar uma carga já movimentada", async () => {

        const carga = new CargaQuimica({
            status: StatusCarga.MOVIMENTADA
        });

        const cargaRepository = {
            buscar: vi.fn().mockResolvedValue(carga),
            atualizar: vi.fn()
        } as unknown as CargaQuimicaRepository;

        const useCase = new MovimentarCargaQuimica(cargaRepository);

        await expect(
            useCase.executar(carga.getID())
        ).rejects.toThrow();

        expect(cargaRepository.atualizar).not.toHaveBeenCalled();
    });
});
