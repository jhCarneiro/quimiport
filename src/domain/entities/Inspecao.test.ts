import { beforeEach, describe, expect, it } from "vitest";
import { Inspecao } from "./Inspecao";

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/;

describe("Inspecao", () => {
    let teste1: Inspecao;
    let teste2: Inspecao;

    beforeEach(() => {
        teste1 = new Inspecao({
            cargaId: "carga-123",
            responsavelId: "responsavel-123",
            resultado: "Aprovada",
            observacao: "Carga em conformidade",
            dataInspecao: new Date("2026-09-10T10:00:00"),
            criadoEm: new Date(),
            atualizadoEm: new Date()
        });

        teste2 = new Inspecao({
            cargaId: "carga-456",
            responsavelId: "responsavel-456",
            resultado: "Reprovada",
            observacao: "Documentação irregular",
            dataInspecao: new Date("2026-09-11T10:00:00"),
            criadoEm: new Date(),
            atualizadoEm: new Date()
        });
    });

    it("deve criar uma inspeção corretamente", () => {
        expect(teste1.getCargaId()).toBe("carga-123");
        expect(teste1.getResponsavelId()).toBe("responsavel-123");
        expect(teste1.getResultado()).toBe("Aprovada");
        expect(teste1.getObservacao()).toBe("Carga em conformidade");
        expect(teste1.getDataInspecao()).toEqual(
            new Date("2026-09-10T10:00:00")
        );
    });

    it("cargaId não pode ser vazio", () => {
        expect(() => {
            teste1 = new Inspecao({
                cargaId: " ",
                responsavelId: "responsavel-123",
                resultado: "Aprovada",
                observacao: "Carga em conformidade",
                dataInspecao: new Date()
            });
        }).toThrow("cargaId não pode ser vazio");
    });

    it("responsavelId não pode ser vazio", () => {
        expect(() => {
            teste1 = new Inspecao({
                cargaId: "carga-123",
                responsavelId: " ",
                resultado: "Aprovada",
                observacao: "Carga em conformidade",
                dataInspecao: new Date()
            });
        }).toThrow("responsavelId não pode ser vazio");
    });

    it("resultado não pode ser vazio", () => {
        expect(() => {
            teste1 = new Inspecao({
                cargaId: "carga-123",
                responsavelId: "responsavel-123",
                resultado: " ",
                observacao: "Carga em conformidade",
                dataInspecao: new Date()
            });
        }).toThrow("resultado não pode ser vazio");
    });

    it("dataInspecao deve ser uma data válida", () => {
        expect(() => {
            teste1 = new Inspecao({
                cargaId: "carga-123",
                responsavelId: "responsavel-123",
                resultado: "Aprovada",
                observacao: "Carga em conformidade",
                dataInspecao: new Date("data inválida")
            });
        }).toThrow("dataInspecao deve ser informada");
    });

    it("o ID deve seguir o formato UUID v4", () => {
        expect(teste1.getID()).toMatch(uuidRegex);
    });

    it("duas inspeções diferentes devem receber IDs diferentes", () => {
        expect(teste1.getID()).not.toBe(teste2.getID());
    });

    it("deve retornar o cargaId informado", () => {
        expect(teste1.getCargaId()).toBe("carga-123");
    });

    it("deve retornar o responsavelId informado", () => {
        expect(teste1.getResponsavelId()).toBe("responsavel-123");
    });

    it("deve retornar o resultado informado", () => {
        expect(teste1.getResultado()).toBe("Aprovada");
    });

    it("deve retornar a observação informada", () => {
        expect(teste1.getObservacao()).toBe("Carga em conformidade");
    });

    it("deve retornar a data da inspeção informada", () => {
        const data = new Date("2026-09-10T10:00:00");

        expect(teste1.getDataInspecao()).toEqual(data);
    });

    it("deve criar as datas automaticamente quando não forem fornecidas", () => {
        const inspeção = new Inspecao({
            cargaId: "carga-123",
            responsavelId: "responsavel-123",
            resultado: "Aprovada",
            observacao: "Carga em conformidade",
            dataInspecao: new Date()
        });

        expect(inspeção.getCriadoEm()).toBeInstanceOf(Date);
        expect(inspeção.getAtualizadoEm()).toBeInstanceOf(Date);
    });

    it("deve utilizar criadoEm e atualizadoEm quando forem fornecidos", () => {
        const criado = new Date("2020-01-01T00:00:00");
        const atualizado = new Date("2021-01-01T00:00:00");

        const inspeção = new Inspecao({
            cargaId: "carga-123",
            responsavelId: "responsavel-123",
            resultado: "Aprovada",
            observacao: "Carga em conformidade",
            dataInspecao: new Date("2026-09-10T10:00:00"),
            criadoEm: criado,
            atualizadoEm: atualizado
        });

        expect(inspeção.getCriadoEm()).toBe(criado);
        expect(inspeção.getAtualizadoEm()).toBe(atualizado);
    });
});