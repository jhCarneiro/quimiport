import { beforeEach, describe, expect,  it } from "vitest";
import { ProdutoQuimico } from "./ProdutoQuimico";

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/;


describe("ProdutoQuimico", () => {
    let teste1: ProdutoQuimico
    let teste2: ProdutoQuimico

    beforeEach(() => {
        teste1 = new ProdutoQuimico({
            nome: "Jhonatha",
            numeroONU: "1234",
            classeRisco: "Inflamável",
            criadoEm: new Date(),
            atualizadoEm: new Date()
        });

        teste2 = new ProdutoQuimico({
            nome: "Rafela",
            numeroONU: "2345",
            classeRisco: "Inflamável",
            criadoEm: new Date(),
            atualizadoEm: new Date()
        })
    })

    it("deve criar um produto químico corretamente", () => {

        expect(teste1.getNome()).toBe("Jhonatha");
        expect(teste1.getNumeroONU()).toBe("1234");
        expect(teste1.getClasseRisco()).toBe("Inflamável");
        expect(teste1.getID()).toMatch(uuidRegex);

    })

    it("O nome precisa ser preenchido corretamente", () => {
        expect(() => {
            teste1 = new ProdutoQuimico({
                nome: " ",
                numeroONU: "1234",
                classeRisco: "Inflamável",
                criadoEm: new Date(),
                atualizadoEm: new Date()

            })
        }).toThrow("O nome precisa ser preenchido corretamente")
    })

    it("O numeroONU precisa ser preenchido corretamente", () => {
        expect(() => {
            teste1 = new ProdutoQuimico({
                nome: "Jhonatha",
                numeroONU: " ",
                classeRisco: "Inflamável",
                criadoEm: new Date(),
                atualizadoEm: new Date()
            })
        }).toThrow("O numeroONU precisa ser preenchido corretamente")
    })

    it("A classeRisco precisa ser preenchida corretamente", () => {
        expect(() => {
            teste1 = new ProdutoQuimico({
                nome: "Jhonatha",
                numeroONU: "1234",
                classeRisco: " ",
                criadoEm: new Date(),
                atualizadoEm: new Date()
            })
        }).toThrow("A classeRisco precisa ser preenchida corretamente")
    })

    it("deve retornar o nome informado.", () => {
        expect(teste1.getNome()).toBe("Jhonatha")
    })

    it("deve retornar o número ONU informado.", () => {
        expect(teste1.getNumeroONU()).toBe("1234")
    })

    it("deve retornar a classe informada.", () => {
        expect(teste1.getClasseRisco()).toBe("Inflamável")
    })

    it("o ID deve seguir o formato UUID v4.", () => {
        expect(teste1.getID()).toMatch(uuidRegex)
    })

    it("dois produtos diferentes devem receber IDs diferentes.", () => {
       expect(teste1.getID()).not.toBe(teste2.getID())
    })

    it("deve utilizar criadoEm e atualizadoEm quando forem fornecidos.",()=>{
         const criado = new Date("2020-01-01T00:00:00");
        const atualizado = new Date("2021-01-01T00:00:00");

        const produto = new ProdutoQuimico({
            nome: "Ácido Sulfúrico",
            numeroONU: "1830",
            classeRisco: "Corrosivo",
            criadoEm: criado,
            atualizadoEm: atualizado
        });

        expect(produto.getCriadoEm()).toBe(criado)
        expect(produto.getAtualizadoEm()).toBe(atualizado)
    })

    it("deve criar as datas automaticamente quando não forem fornecidas.",()=>{
        expect(teste1.getCriadoEm()).toBeInstanceOf(Date)
        expect(teste1.getAtualizadoEm()).toBeInstanceOf(Date)
    })



    function criarProduto() {
        return new ProdutoQuimico({
            nome: "Ácido Sulfúrico",
            descricao: "Produto químico corrosivo",
            numeroONU: "1830",
            classeRisco: "8",
            grupoCompatibilidade: "CORROSIVOS"
        });
    }

    it("deve atualizar os dados de um produto químico", () => {

        const produto = criarProduto();

        produto.atualizarDados({
            nome: "Ácido Sulfúrico Concentrado",
            descricao: "Produto corrosivo concentrado",
            numeroONU: "1830",
            classeRisco: "8",
            grupoCompatibilidade: "CORROSIVOS"
        });

        expect(produto.getNome()).toBe("Ácido Sulfúrico Concentrado");
        expect(produto.getDescricao()).toBe("Produto corrosivo concentrado");
        expect(produto.getGrupoCompatibilidade()).toBe("CORROSIVOS");
    });

    it("não deve permitir atualização com nome vazio", () => {

        const produto = criarProduto();

        expect(() => {
            produto.atualizarDados({
                nome: "",
                descricao: "Descrição",
                numeroONU: "1830",
                classeRisco: "8",
                grupoCompatibilidade: "CORROSIVOS"
            });
        }).toThrow("O nome precisa ser preenchido corretamente");
    });

    it("deve inativar um produto químico", () => {

        const produto = criarProduto();

        expect(produto.getStatus()).toBe("ATIVO");

        produto.inativar();

        expect(produto.getStatus()).toBe("INATIVO");
    });

    it("não deve permitir inativar um produto já inativo", () => {

        const produto = criarProduto();

        produto.inativar();

        expect(() => {
            produto.inativar();
        }).toThrow("O produto químico já está inativo");
    });

    it("não deve permitir criar produto com status inválido", () => {

        expect(() => {
            new ProdutoQuimico({
                nome: "Ácido Sulfúrico",
                numeroONU: "1830",
                classeRisco: "8",
                status: "DESCONHECIDO" as any
            });
        }).toThrow("Status do produto químico inválido");
    });

});
