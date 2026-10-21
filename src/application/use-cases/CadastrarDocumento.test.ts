
import { describe, it, expect, vi } from "vitest";

import { CadastrarDocumento } from "./CadastrarDocumento";
import { CargaQuimica } from "../../domain/entities/CargaQuimica";
import { CargaQuimicaRepository } from "../repositories/CargaQuimicaRepository";
import { DocumentoRepository } from "../repositories/DocumentoRepository";

describe("CadastrarDocumento", () => {

    const dados = {
        cargaId: "carga-123",
        tipo: "Licença Ambiental",
        numero: "LA-2026-001",
        dataEmissao: new Date("2026-01-10"),
        dataValidade: new Date("2027-01-10")
    };

    it("deve cadastrar um documento para uma carga existente", async () => {

        const carga = new CargaQuimica();

        const cargaRepository = {
            buscar: vi.fn().mockResolvedValue(carga)
        } as unknown as CargaQuimicaRepository;

        const documentoRepository = {
            salvar: vi.fn().mockResolvedValue(undefined)
        } as unknown as DocumentoRepository;

        const useCase = new CadastrarDocumento(
            cargaRepository,
            documentoRepository
        );

        const documento = await useCase.executar(dados);

        expect(documento.getTipo()).toBe("Licença Ambiental");
        expect(documento.getNumero()).toBe("LA-2026-001");

        expect(documentoRepository.salvar).toHaveBeenCalledWith(
            carga.getID(),
            documento
        );
    });

    it("não deve cadastrar documento para uma carga inexistente", async () => {

        const cargaRepository = {
            buscar: vi.fn().mockResolvedValue(null)
        } as unknown as CargaQuimicaRepository;

        const documentoRepository = {
            salvar: vi.fn()
        } as unknown as DocumentoRepository;

        const useCase = new CadastrarDocumento(
            cargaRepository,
            documentoRepository
        );

        await expect(
            useCase.executar(dados)
        ).rejects.toThrow("CARGA_NAO_ENCONTRADA");

        expect(documentoRepository.salvar).not.toHaveBeenCalled();
    });

    it("não deve cadastrar documento com validade anterior à emissão", async () => {

        const carga = new CargaQuimica();

        const cargaRepository = {
            buscar: vi.fn().mockResolvedValue(carga)
        } as unknown as CargaQuimicaRepository;

        const documentoRepository = {
            salvar: vi.fn()
        } as unknown as DocumentoRepository;

        const useCase = new CadastrarDocumento(
            cargaRepository,
            documentoRepository
        );

        await expect(
            useCase.executar({
                ...dados,
                dataEmissao: new Date("2027-01-10"),
                dataValidade: new Date("2026-01-10")
            })
        ).rejects.toThrow(
            "A data de validade nao pode ser anterior a data de emissão"
        );

        expect(documentoRepository.salvar).not.toHaveBeenCalled();
    });

    it("não deve cadastrar documento sem tipo", async () => {

        const carga = new CargaQuimica();

        const cargaRepository = {
            buscar: vi.fn().mockResolvedValue(carga)
        } as unknown as CargaQuimicaRepository;

        const documentoRepository = {
            salvar: vi.fn()
        } as unknown as DocumentoRepository;

        const useCase = new CadastrarDocumento(
            cargaRepository,
            documentoRepository
        );

        await expect(
            useCase.executar({
                ...dados,
                tipo: ""
            })
        ).rejects.toThrow("O tipo precisa ser informado");

        expect(documentoRepository.salvar).not.toHaveBeenCalled();
    });
});
