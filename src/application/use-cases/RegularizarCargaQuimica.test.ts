
import { describe, it, expect, vi } from "vitest";

import { RegularizarCargaQuimica } from "./RegularizarCargaQuimica";

import {
    CargaQuimica,
    StatusCarga
} from "../../domain/entities/CargaQuimica";

import { Documento } from "../../domain/entities/Documento";

import { CargaQuimicaRepository } from "../repositories/CargaQuimicaRepository";

describe("RegularizarCargaQuimica", () => {

    it("deve regularizar uma carga bloqueada", async () => {

        // Criar uma carga
        const carga = new CargaQuimica();

        // Adicionar documento para permitir o bloqueio
        const documento = new Documento({
            tipo: "Licença Ambiental",
            numero: "LA-2026-001",
            dataEmissao: new Date("2026-01-10"),
            dataValidade: new Date("2027-01-10")
        });

        carga.adicionarDocumento(documento);

        // Bloquear a carga
        carga.bloquear();

        expect(carga.getStatus()).toBe(StatusCarga.BLOQUEADA);

        // Simular o repositório
        const cargaRepository = {
            buscar: vi.fn().mockResolvedValue(carga),
            atualizar: vi.fn().mockResolvedValue(undefined)
        } as unknown as CargaQuimicaRepository;

        const useCase = new RegularizarCargaQuimica(
            cargaRepository
        );

        // Executar a regularização
        await useCase.executar(carga.getID());

        // Verificar o novo status
        expect(carga.getStatus()).toBe(
            StatusCarga.PENDENTE_INSPECAO
        );

        // Verificar se o repositório foi chamado
        expect(cargaRepository.atualizar).toHaveBeenCalledWith(
            carga
        );
    });

    it("não deve regularizar uma carga inexistente", async () => {

        const cargaRepository = {
            buscar: vi.fn().mockResolvedValue(null),
            atualizar: vi.fn()
        } as unknown as CargaQuimicaRepository;

        const useCase = new RegularizarCargaQuimica(
            cargaRepository
        );

        await expect(
            useCase.executar("carga-inexistente")
        ).rejects.toThrow("CARGA_NAO_ENCONTRADA");

        expect(cargaRepository.atualizar).not.toHaveBeenCalled();
    });

    it("não deve regularizar uma carga que não está bloqueada", async () => {

        const carga = new CargaQuimica();

        const cargaRepository = {
            buscar: vi.fn().mockResolvedValue(carga),
            atualizar: vi.fn()
        } as unknown as CargaQuimicaRepository;

        const useCase = new RegularizarCargaQuimica(
            cargaRepository
        );

        await expect(
            useCase.executar(carga.getID())
        ).rejects.toThrow();

        // O status não pode ser alterado
        expect(carga.getStatus()).toBe(
            StatusCarga.PENDENTE_DOCUMENTACAO
        );

        // Nenhuma atualização deve ser persistida
        expect(cargaRepository.atualizar).not.toHaveBeenCalled();
    });
});
