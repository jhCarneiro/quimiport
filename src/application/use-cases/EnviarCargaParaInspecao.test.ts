
import { describe, it, expect, vi } from "vitest";

import { EnviarCargaParaInspecao } from "./EnviarCargaParaInspecao";
import {
    CargaQuimica,
    StatusCarga
} from "../../domain/entities/CargaQuimica";

import { CargaQuimicaRepository } from "../repositories/CargaQuimicaRepository";

describe("EnviarCargaParaInspecao", () => {

    it("deve enviar uma carga para inspeção", async () => {

        const carga = new CargaQuimica();

        const repository = {
            buscar: vi.fn().mockResolvedValue(carga),
            atualizar: vi.fn().mockResolvedValue(undefined)
        } as unknown as CargaQuimicaRepository;

        const useCase = new EnviarCargaParaInspecao(repository);

        const resultado = await useCase.executar(carga.getID());

        expect(resultado.getStatus()).toBe(
            StatusCarga.PENDENTE_INSPECAO
        );

        expect(repository.atualizar).toHaveBeenCalledWith(carga);
    });

    it("deve rejeitar uma carga inexistente", async () => {

        const repository = {
            buscar: vi.fn().mockResolvedValue(null),
            atualizar: vi.fn()
        } as unknown as CargaQuimicaRepository;

        const useCase = new EnviarCargaParaInspecao(repository);

        await expect(
            useCase.executar("carga-inexistente")
        ).rejects.toThrow("CARGA_NAO_ENCONTRADA");

        expect(repository.atualizar).not.toHaveBeenCalled();
    });

    it("não deve enviar novamente uma carga já pendente de inspeção", async () => {

        const carga = new CargaQuimica();
        carga.pendenteInspecao();

        const repository = {
            buscar: vi.fn().mockResolvedValue(carga),
            atualizar: vi.fn()
        } as unknown as CargaQuimicaRepository;

        const useCase = new EnviarCargaParaInspecao(repository);

        await expect(
            useCase.executar(carga.getID())
        ).rejects.toThrow(
            "Apenas cargas com Status PENDENTE_DOCUMENTACAO"
        );

        expect(repository.atualizar).not.toHaveBeenCalled();
    });
});
