import { describe, expect, it } from "vitest";
import { CargaQuimica, StatusCarga } from "./CargaQuimica";

describe("Ciclo de vida oficial da Fase 2", () => {
    it("permite registro, análise e inspeção", () => {
        const carga = new CargaQuimica({ status: StatusCarga.REGISTRADA });
        carga.transicionar(StatusCarga.EM_ANALISE);
        carga.transicionar(StatusCarga.EM_INSPECAO);
        expect(carga.getStatus()).toBe(StatusCarga.EM_INSPECAO);
    });
    it("permite cancelamento e impede saída de estado terminal", () => {
        const carga = new CargaQuimica({ status: StatusCarga.REGISTRADA });
        carga.cancelar();
        expect(() => carga.transicionar(StatusCarga.LIBERADA)).toThrow("TRANSICAO_STATUS_INVALIDA");
        expect(() => carga.cancelar()).toThrow("TRANSICAO_STATUS_INVALIDA");
    });
    it("permite finalizar apenas após movimentação", () => {
        const carga = new CargaQuimica({ status: StatusCarga.LIBERADA });
        expect(() => carga.finalizar()).toThrow("TRANSICAO_STATUS_INVALIDA");
        carga.transicionar(StatusCarga.EM_MOVIMENTACAO);
        carga.finalizar();
        expect(carga.getStatus()).toBe(StatusCarga.FINALIZADA);
        expect(() => carga.transicionar(StatusCarga.EM_MOVIMENTACAO)).toThrow("TRANSICAO_STATUS_INVALIDA");
    });
    it("não libera sem documentação e inspeção aprovada", () => {
        const carga = new CargaQuimica({ status: StatusCarga.EM_INSPECAO });
        expect(() => carga.transicionar(StatusCarga.LIBERADA)).toThrow("DOCUMENTACAO_OBRIGATORIA_AUSENTE");
    });
    it("não movimenta carga bloqueada", () => {
        const carga = new CargaQuimica({ status: StatusCarga.BLOQUEADA });
        expect(() => carga.transicionar(StatusCarga.EM_MOVIMENTACAO)).toThrow("TRANSICAO_STATUS_INVALIDA");
    });
});
