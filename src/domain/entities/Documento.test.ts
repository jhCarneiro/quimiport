import { describe, it, expect, beforeEach } from "vitest";
import { Documento } from "./Documento";

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/;

describe("Documento", () => {
    let documento: Documento
    let documento2: Documento

    beforeEach(() => {
        documento = new Documento({
            tipo: "Pedra",
            numero: "1234",
            dataEmissao: new Date(2026, 9, 20),
            dataValidade: new Date(2026, 10, 10),
            criadoEm: new Date(),
            atualizadoEm: new Date(),
        });
        documento2 = new Documento({
            tipo: "Açucar",
            numero: "2345",
            dataEmissao: new Date(2026, 9, 20),
            dataValidade: new Date(2026, 10, 10),
            criadoEm: new Date(),
            atualizadoEm: new Date(),
        })
    })

    it("cria um documento corretamente.", () => {

        expect(documento.getID()).toMatch(uuid)
        expect(documento.getTipo()).toBe("Pedra")
        expect(documento.getNumero()).toBe("1234")
        expect(documento.getDataValidade() > documento.getDataEmissao()).toBe(true)
    })

    it("O tipo precisa ser informado", () => {
        expect(() => {
            new Documento({
                tipo: " ",
                numero: "1234",
                dataEmissao: new Date(2026, 9, 20),
                dataValidade: new Date(2026, 10, 10),
                criadoEm: new Date(),
                atualizadoEm: new Date(),
            })
        }).toThrow("O tipo precisa ser informado")
    })

    it("O numero precisa ser informado",()=>{
        expect(()=>{
            new Documento({
                tipo: "Jhonatha",
                numero: " ",
                dataEmissao: new Date(2026, 9, 20),
                dataValidade: new Date(2026, 10, 10),
                criadoEm: new Date(),
                atualizadoEm: new Date(),
            })
        }).toThrow("O numero precisa ser informado")
    })

    it("A data de validade nao pode ser anterior a data de emissão",()=>{
        expect(()=>{
            new Documento({
                tipo: "Jhonatha",
                numero: "1234",
                dataEmissao: new Date(2026, 9, 20),
                dataValidade: new Date(2026, 8, 10),
                criadoEm: new Date(),
                atualizadoEm: new Date(),
            })
        }).toThrow("A data de validade nao pode ser anterior a data de emissão")
    })

    it("validando formato do ID",()=>{
        expect(documento.getID()).toMatch(uuid)
    })

    it("verificando IDs diferentes",()=>{
       expect(
        documento.getID() !== documento2.getID()
       ).toBe(true)
    })

    it("GETTER tipo",()=>{
        expect(documento.getTipo()).toBe("Pedra")
    })

    it("GETTER numero",()=>{
        expect(documento.getNumero()).toBe("1234")
    })

    it("GETTER data emissao",()=>{
        expect(documento.getDataEmissao()).toEqual(new Date(2026,9,20))
    })

    it("GETTER data validade",()=>{
        expect(documento.getDataValidade()).toEqual(new Date(2026, 10, 10))
    })

    it("Data de Atualização deve ser gerada automatica quando nao infromada",()=>{
        expect(documento.getAtualizadoEm()).toBeInstanceOf(Date)
    })

    it("Data de criação deve ser gerada automaticamente quando nao informada",()=>{
        expect(documento.getCriadoEm()).toBeInstanceOf(Date)
    })
})