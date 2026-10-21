
import { describe, it, expect, vi } from "vitest";

import { RegistrarInspecao } from "./RegistrarInspecao";
import {
    CargaQuimica,
    StatusCarga
} from "../../domain/entities/CargaQuimica";

import { CargaQuimicaRepository } from "../repositories/CargaQuimicaRepository";
import { InspecaoRepository } from "../repositories/InspecaoRepository";

describe("RegistrarInspecao", () => {

    const dados = {
        cargaId: "carga-123",
        responsavelId: "responsavel-123",
        resultado: "Aprovada",
        observacao: "Carga inspecionada sem irregularidades",
        dataInspecao: new Date()
    };

    it("deve registrar uma inspeção em carga pendente de inspeção", async () => {

        const carga = new CargaQuimica();
        carga.pendenteInspecao();

        const cargaRepository = {
            buscar: vi.fn().mockResolvedValue(carga)
        } as unknown as CargaQuimicaRepository;

        const inspecaoRepository = {
            salvar: vi.fn().mockResolvedValue(undefined)
        } as unknown as InspecaoRepository;

        const useCase = new RegistrarInspecao(
            cargaRepository,
            inspecaoRepository
        );

        const resultado = await useCase.executar(dados);

        expect(resultado.getResultado()).toBe("Aprovada");
        expect(inspecaoRepository.salvar).toHaveBeenCalledOnce();
    });

    it("não deve registrar inspeção em carga inexistente", async () => {

        const cargaRepository = {
            buscar: vi.fn().mockResolvedValue(null)
        } as unknown as CargaQuimicaRepository;

        const inspecaoRepository = {
            salvar: vi.fn()
        } as unknown as InspecaoRepository;

        const useCase = new RegistrarInspecao(
            cargaRepository,
            inspecaoRepository
        );

        await expect(
            useCase.executar(dados)
        ).rejects.toThrow("CARGA_NAO_ENCONTRADA");

        expect(inspecaoRepository.salvar).not.toHaveBeenCalled();
    });

    it("não deve registrar inspeção em carga com status inválido", async () => {

        const carga = new CargaQuimica();

        expect(carga.getStatus()).toBe(
            StatusCarga.PENDENTE_DOCUMENTACAO
        );

        const cargaRepository = {
            buscar: vi.fn().mockResolvedValue(carga)
        } as unknown as CargaQuimicaRepository;

        const inspecaoRepository = {
            salvar: vi.fn()
        } as unknown as InspecaoRepository;

        const useCase = new RegistrarInspecao(
            cargaRepository,
            inspecaoRepository
        );

        await expect(
            useCase.executar(dados)
        ).rejects.toThrow("CARGA_NAO_PERMITE_INSPECAO");

        expect(inspecaoRepository.salvar).not.toHaveBeenCalled();
    });
});
