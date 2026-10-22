import { CargaQuimica } from "../../../domain/entities/CargaQuimica";
export function apresentarCarga(carga: CargaQuimica) {
    return { id: carga.getID(), codigo: carga.getCodigo(), origem: carga.getOrigem(),
        destino: carga.getDestino(), responsavelTecnico: carga.getResponsavelTecnico(),
        documentacaoObrigatoria: carga.getDocumentacaoObrigatoria(), dataEntrada: carga.getDataEntrada(),
        itens: carga.getItens().map(item => ({ produtoQuimicoID: item.getProdutoQuimicoID(),
            quantidade: item.getQuantidade(), unidade: item.getUnidade() })),
        status: carga.getStatus(), criadoEm: carga.getCriadoEm(), atualizadoEm: carga.getAtualizadoEm() };
}
