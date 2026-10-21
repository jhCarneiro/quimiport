import { StatusCarga, CargaQuimica } from "./CargaQuimica";
import { describe, expect, it, beforeEach } from "vitest";
import { ItemCarga } from "./ItemCarga";
import { Inspecao } from "./Inspecao";
import { Documento } from "./Documento";


const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const item1 = new ItemCarga({ produtoQuimicoID: "H2SO4", quantidade: 100, unidade: "L" });
const item2 = new ItemCarga({ produtoQuimicoID: "NaOH", quantidade: 50, unidade: "kg" });
const documento1 = new Documento({
    tipo: "string",
    numero: "1234",
    dataEmissao: new Date(),
    dataValidade: new Date(),
    criadoEm: new Date(),
    atualizadoEm: new Date()
})
const documento2 = new Documento({
    tipo: "string",
    numero: "1234",
    dataEmissao: new Date(),
    dataValidade: new Date(),
    criadoEm: new Date(),
    atualizadoEm: new Date()
})
const inspecao1 = new Inspecao({
    cargaId: "string",
    responsavelId: "string",
    resultado: "Aprovada",
    observacao: "string",
    dataInspecao: new Date("2026-09-10T10:00:00"),
    criadoEm: new Date(),
    atualizadoEm: new Date()
})
const inspecao2 = new Inspecao({
    cargaId: "string",
    responsavelId: "string",
    resultado: "Aprovada",
    observacao: "string",
    dataInspecao: new Date("2026-09-10T10:00:00"),
    criadoEm: new Date(),
    atualizadoEm: new Date()
})
const inspecao3 = new Inspecao({
    cargaId: "string",
    responsavelId: "string",
    resultado: "Reprovada",
    observacao: "string",
    dataInspecao: new Date("2026-09-10T10:00:00"),
    criadoEm: new Date(),
    atualizadoEm: new Date()
})
describe("CargaQuimica", () => {
    let carga: CargaQuimica;
    let carga2: CargaQuimica;

    beforeEach(() => {
        carga = new CargaQuimica({
            criadoEm: new Date(),
            atualizadoEm: new Date()
        });

        carga2 = new CargaQuimica({
            criadoEm: new Date(),
            atualizadoEm: new Date()
        });
    });

    it("deve permitir adicionar um documento à carga", () => {
        carga.adicionarDocumento(documento1)
        expect(carga.getDocumentos()).toContain(documento1)
    })

    it("uma carga pode possuir mais de um documento", () => {
        carga.adicionarDocumento(documento1)
        carga.adicionarDocumento(documento2)
        expect(carga.getDocumentos()).toContain(documento1)
        expect(carga.getDocumentos()).toContain(documento2)
    })

    /* TESTES DE INSPECAO */
    it("uma carga PENDENTE_INSPECAO deve possuir uma inspeção", () => {
        carga.pendenteInspecao()
        expect(() => carga.liberar()).toThrow("A carga precisa possuir uma inspeção")
    })

    it("Uma carga com uma inspeção pode ser liberada.", () => {
        carga.pendenteInspecao()
        carga.adicionarInspecao(inspecao1)
        carga.liberar()

        expect(carga.getStatus()).toBe(StatusCarga.LIBERADA)
    })

    it("uma carga com inspeção reprovada não pode ser liberada", () => {

        const inspecao3 = new Inspecao({
            cargaId: "string",
            responsavelId: "string",
            resultado: "Reprovada",
            observacao: "string",
            dataInspecao: new Date("2026-09-10T10:00:00"),
            criadoEm: new Date(),
            atualizadoEm: new Date()
        })
        carga.pendenteInspecao()
        carga.adicionarInspecao(inspecao3)
        expect(() => carga.liberar()).toThrow("A carga não pode ser liberada pois a inspeção foi reprovada")
    })

    it("a carga não pode ser liberada quando a última inspeção for reprovada", () => {
        const inspecao3 = new Inspecao({
            cargaId: "string",
            responsavelId: "string",
            resultado: "Aprovada",
            observacao: "string",
            dataInspecao: new Date("2026-09-10T10:00:00"),
            criadoEm: new Date(),
            atualizadoEm: new Date()
        })
        carga.pendenteInspecao()
        carga.adicionarInspecao(inspecao3)
        carga.liberar()
        expect(carga.getStatus()).toBe(StatusCarga.LIBERADA)
    })

    it("deve considerar a última inspeção para liberar a carga", () => {
        carga.pendenteInspecao()
        carga.adicionarInspecao(inspecao1)
        carga.adicionarInspecao(inspecao3)
        expect(() => carga.liberar()).toThrow("A carga não pode ser liberada pois a inspeção foi reprovada")
    })

    it("só liberar quandoa a ultima inspecao for Aprovada", () => {
        carga.pendenteInspecao()
        carga.adicionarInspecao(inspecao3)
        carga.adicionarInspecao(inspecao1)
        carga.liberar()
        expect(carga.getStatus()).toBe(StatusCarga.LIBERADA)
    })

    it("Apenas cargas com Status PENDENTE_DOCUMENTACAO podem ser alteradas para PENDENTE_INSPECAO", () => {
        carga.pendenteInspecao();
        expect(() => carga.pendenteInspecao())
            .toThrow("Apenas cargas com Status PENDENTE_DOCUMENTACAO podem ser alteradas para PENDENTE_INSPECAO");
    });

    it("deve permitir adicionar uma inspeção à carga", () => {
        const cargaLimpa = new CargaQuimica({
            criadoEm: new Date(),
            atualizadoEm: new Date()
        })
        cargaLimpa.adicionarInspecao(inspecao1)
        cargaLimpa.adicionarInspecao(inspecao2)
        expect(cargaLimpa.getInspecoes()).toContain(inspecao1)
        expect(cargaLimpa.getInspecoes()).toContain(inspecao2)

    })

    /* TESTES DE LIBERACAO */
    it("deve liberar uma carga após a inspeção", () => {
        carga.pendenteInspecao();
        carga.adicionarInspecao(inspecao1)
        carga.liberar();
        expect(carga.getStatus()).toBe(StatusCarga.LIBERADA);
    });

    it("A carga não pode ser liberada antes de ser inspecionada", () => {
        expect(() => carga.liberar())
            .toThrow("A carga não pode ser liberada antes de ser inspecionada");
    });

    it("Uma carga LIBERADA pode ser bloqueada.", () => {
        carga.adicionarDocumento(documento1)
        carga.pendenteInspecao();
        carga.adicionarInspecao(inspecao1)
        carga.liberar();
        carga.bloquear();
        expect(carga.getStatus()).toBe(StatusCarga.BLOQUEADA);
    });

    /* TESTES DE MOVIMENTACAO */
    it("uma carga só pode ser movimentada depois de liberada.", () => {
        expect(() => carga.movimentar())
            .toThrow("A carga só pode ser movimentada após a liberação da mesma");
    });

    /* TESTES DE BLOQUEIO */
    it("Uma carga movimentada não pode ser bloqueada.", () => {
        carga.pendenteInspecao();
        carga.adicionarInspecao(inspecao1)
        carga.liberar();
        carga.movimentar();
        expect(() => carga.bloquear())
            .toThrow("Não é possível bloquear uma carga movimentada");
    });

    it("Uma carga pode ser bloqueada após a inspeção.", () => {
        carga.adicionarDocumento(documento1)
        carga.pendenteInspecao();
        carga.bloquear();
        expect(carga.getStatus()).toBe(StatusCarga.BLOQUEADA);
    });

    it("Uma carga bloqueada não pode voltar diretamente para PENDENTE_INSPECAO.", () => {
        carga.adicionarDocumento(documento1)
        carga.pendenteInspecao();
        carga.bloquear();
        expect(() => carga.pendenteInspecao())
            .toThrow("Apenas cargas com Status PENDENTE_DOCUMENTACAO podem ser alteradas para PENDENTE_INSPECAO");
    });

    it("Não é possivel bloquear uma carga já bloqueada", () => {
        carga.adicionarDocumento(documento1)
        carga.pendenteInspecao();
        carga.bloquear();
        expect(() => carga.bloquear())
            .toThrow("Não é possivel bloquear uma carga já bloqueada");
    });

    it("uma carga sem documentos não pode ser bloqueada", () => {
        carga.pendenteInspecao()

        expect(() => carga.bloquear())
            .toThrow("Uma carga sem documentação não pode ser bloqueada.")
    })

    it("uma carga com documento pode ser bloqueada", () => {

        carga.pendenteInspecao()
        carga.adicionarDocumento(documento1)
        carga.bloquear()

        expect(carga.getStatus()).toBe(StatusCarga.BLOQUEADA)
    })

    /* TESTES DE REGULARIZAR */
    it("regularizando carga bloqueada", () => {
        carga.adicionarDocumento(documento1)
        carga.pendenteInspecao();
        carga.bloquear();
        carga.regularizar();
        expect(carga.getStatus()).toBe(StatusCarga.PENDENTE_INSPECAO);
    });

    it("Apenas cargas bloqueadas podem ser regularizadas", () => {
        expect(() => carga.regularizar())
            .toThrow("Apenas cargas bloqueadas podem ser regularizadas");
    });

    /* TESTES DE QUANTIDADE */
    it("ao adicionar item H2SO4 com quantidade 100, deve retornar 100.", () => {
        carga.adicionarItem(item1);
        expect(carga.getQuantidadePorProduto("H2SO4")).toBe(100);
    });

    it("ao adicionar dois itens, getQuantidadeTotal deve somar corretamente", () => {
        carga.adicionarItem(item1);
        carga.adicionarItem(item2);
        expect(carga.getQuantidadeTotal()).toBe(150);
    });

    it("não deve permitir criar ItemCarga com quantidade menor ou igual a 0", () => {
        expect(() => {
            new ItemCarga({
                produtoQuimicoID: "H2SO4",
                quantidade: 0,
                unidade: "L"
            });
        }).toThrow("A quantidade precisa ser maior que 0");
    });

    /* TESTES DE UNIDADE */
    it("não deve permitir criar ItemCarga com unidade vazia", () => {
        expect(() => {
            new ItemCarga({
                produtoQuimicoID: "H2SO4",
                quantidade: 10,
                unidade: "   " // unidade em branco
            });
        }).toThrow("A unidade nao pode estar vazia");
    });

    /* TESTES DE ID */
    it("O ID deve ser gerado automaticamente", () => {
        expect(carga.getID()).toBeTruthy();
    });

    it("Duas cargas criadas independentemente devem receber IDs diferentes.", () => {
        expect(carga.getID()).not.toBe(carga2.getID());
    });

    it("O ID deve seguir o formato de um UUID v4", () => {
        expect(uuidRegex.test(carga.getID())).toBe(true);
    });


    it("deve restaurar itens sem alterar a data de atualização da carga", () => {
        const dataOriginal = new Date("2026-10-01T10:00:00.000Z");

        const carga = new CargaQuimica({
            atualizadoEm: dataOriginal
        });

        const item = new ItemCarga({
            produtoQuimicoID: "produto-123",
            quantidade: 500,
            unidade: "g"
        });

        carga.restaurarItens([item]);

        expect(carga.getItens()).toHaveLength(1);
        expect(carga.getItens()[0].getID()).toBe(item.getID());
        expect(carga.getAtualizadoEm()).toEqual(dataOriginal);
    });

});
