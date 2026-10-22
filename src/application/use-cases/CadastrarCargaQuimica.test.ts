import { describe, expect, it, vi } from "vitest";
import { CadastrarCargaQuimica } from "./CadastrarCargaQuimica";
import { ProdutoQuimico } from "../../domain/entities/ProdutoQuimico";
import type { CargaQuimicaRepository } from "../repositories/CargaQuimicaRepository";
import type { ProdutoQuimicoRepository } from "../repositories/ProdutoQuimicoRepository";
const dados = { codigo:"Q-1", produtoQuimicoID:"p1", quantidade:20, unidade:"L", origem:"Santos", destino:"São Paulo", responsavelTecnico:"Eng. A", documentacaoObrigatoria:"FISPQ" };
function setup(inativo = false) {
    const produto = new ProdutoQuimico({ nome:"Produto", numeroONU:"1234", classeRisco:"8" });
    if (inativo) produto.inativar();
    const produtos = { buscar: vi.fn().mockResolvedValue(produto) } as unknown as ProdutoQuimicoRepository;
    const cargas = { salvarComItem: vi.fn().mockResolvedValue(undefined) } as unknown as CargaQuimicaRepository;
    return { uc: new CadastrarCargaQuimica(cargas, produtos), cargas };
}
describe("Registro de carga Fase 2", () => {
    it("cadastra carga com produto ativo e dados obrigatórios", async () => {
        const {uc,cargas}=setup();
        const carga=await uc.executar(dados);
        expect(carga.getCodigo()).toBe("Q-1");
        expect(carga.getItens()).toHaveLength(1);
        expect(cargas.salvarComItem).toHaveBeenCalledOnce();
    });
    it("rejeita produto inativo sem gravar", async () => {
        const {uc,cargas}=setup(true);
        await expect(uc.executar(dados)).rejects.toThrow("PRODUTO_INATIVO");
        expect(cargas.salvarComItem).not.toHaveBeenCalled();
    });
    it("rejeita quantidade zero", async () => {
        const {uc,cargas}=setup();
        await expect(uc.executar({...dados,quantidade:0})).rejects.toThrow("QUANTIDADE_INVALIDA");
        expect(cargas.salvarComItem).not.toHaveBeenCalled();
    });
    it("rejeita responsável técnico vazio", async () => {
        const {uc}=setup();
        await expect(uc.executar({...dados,responsavelTecnico:" "})).rejects.toThrow("CAMPOS_OBRIGATORIOS_AUSENTES");
    });
});
