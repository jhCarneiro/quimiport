
import { describe, it, expect, vi } from "vitest";

import { CargaQuimica, StatusCarga } from "../../domain/entities/CargaQuimica";
import { Documento } from "../../domain/entities/Documento";
import { CargaQuimicaRepository } from "../repositories/CargaQuimicaRepository";
import { BloquearCargaQuimica } from "./BloquearCargaQuimica";


describe("BloquearCargaQuimica", () => {


    it("deve bloquear uma carga que possui documento", async () => {

        // 1. Criar uma carga química
        const carga = new CargaQuimica();

        // 2. Criar um documento válido
        const documento = new Documento({
            tipo: "Licença Ambiental",
            numero: "LA-2026-001",
            dataEmissao: new Date("2026-01-10"),
            dataValidade: new Date("2027-01-10")
        });

        // 3. Adicionar o documento à carga
        carga.adicionarDocumento(documento);

        // 4. Simular o repositório
        const cargaRepository = {
            buscar: vi.fn().mockResolvedValue(carga),
            atualizar: vi.fn().mockResolvedValue(undefined)
        } as unknown as CargaQuimicaRepository;

        // 5. Executar o caso de uso
        const useCase = new BloquearCargaQuimica(cargaRepository);

        await useCase.executar(carga.getID());

        // 6. Verificar o novo status
        expect(carga.getStatus()).toBe(StatusCarga.BLOQUEADA);

        // 7. Verificar se a alteração foi salva
        expect(cargaRepository.atualizar).toHaveBeenCalledWith(carga);
    });


    it("não deve bloquear uma carga inexistente", async () => {

        const cargaRepository = {
            buscar: vi.fn().mockResolvedValue(null),
            atualizar: vi.fn()
        } as unknown as CargaQuimicaRepository;

        const useCase = new BloquearCargaQuimica(cargaRepository);

        await expect(
            useCase.executar("carga-inexistente")
        ).rejects.toThrow("CARGA_NAO_ENCONTRADA");

        expect(cargaRepository.atualizar).not.toHaveBeenCalled();
    });

    it("não deve bloquear uma carga sem documentação", async () => {

        const carga = new CargaQuimica();

        const cargaRepository = {
            buscar: vi.fn().mockResolvedValue(carga),
            atualizar: vi.fn()
        } as unknown as CargaQuimicaRepository;

        const useCase = new BloquearCargaQuimica(cargaRepository);

        await expect(
            useCase.executar(carga.getID())
        ).rejects.toThrow();

        expect(cargaRepository.atualizar).not.toHaveBeenCalled();
    });
});
