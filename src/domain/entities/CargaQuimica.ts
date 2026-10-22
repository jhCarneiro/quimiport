import { v4 as uuid } from "uuid";
import { ItemCarga } from "./ItemCarga";
import { Inspecao } from "./Inspecao";
import { Documento } from "./Documento";

export enum StatusCarga {
    PENDENTE_DOCUMENTACAO = "PENDENTE_DOCUMENTACAO",
    PENDENTE_INSPECAO = "PENDENTE_INSPECAO",
    LIBERADA = "LIBERADA",
    MOVIMENTADA = "MOVIMENTADA",
    BLOQUEADA = "BLOQUEADA",
    REGISTRADA = "REGISTRADA",
    EM_ANALISE = "EM_ANALISE",
    EM_INSPECAO = "EM_INSPECAO",
    EM_MOVIMENTACAO = "EM_MOVIMENTACAO",
    FINALIZADA = "FINALIZADA",
    CANCELADA = "CANCELADA"
}


export interface CargaQuimicaProps {
    id?: string;
    status?: StatusCarga;
    criadoEm?: Date;
    atualizadoEm?: Date;
    codigo?: string;
    origem?: string;
    destino?: string;
    responsavelTecnico?: string;
    documentacaoObrigatoria?: string;
    dataEntrada?: Date;
}


export class CargaQuimica {
    private id: string;
    private codigo: string;
    private origem: string;
    private destino: string;
    private responsavelTecnico: string;
    private documentacaoObrigatoria: string;
    private dataEntrada: Date;
    private itens: ItemCarga[];
    private inspecoes: Inspecao[];
    private documentos: Documento[];
    private status: StatusCarga;
    private criadoEm: Date;
    private atualizadoEm: Date;

    constructor(props: CargaQuimicaProps = {}) {
        this.id = props.id ?? uuid();
        this.codigo = props.codigo ?? "";
        this.origem = props.origem ?? "";
        this.destino = props.destino ?? "";
        this.responsavelTecnico = props.responsavelTecnico ?? "";
        this.documentacaoObrigatoria = props.documentacaoObrigatoria ?? "";
        this.dataEntrada = props.dataEntrada ?? new Date();
        this.itens = [];
        this.inspecoes = [];
        this.documentos = [];
        this.status = props.status ?? StatusCarga.PENDENTE_DOCUMENTACAO;
        this.criadoEm = props.criadoEm ?? new Date();
        this.atualizadoEm = props.atualizadoEm ?? new Date();
    }

    // =========================
    // Documentos
    // =========================

    adicionarDocumento(documento: Documento): void {
        if ([StatusCarga.FINALIZADA, StatusCarga.CANCELADA].includes(this.status)) throw new Error("CARGA_ENCERRADA");
        this.documentos.push(documento);
        this.atualizadoEm = new Date();
    }


    restaurarDocumentos(documentos: Documento[]): void {
        this.documentos = [...documentos];
    }


    getDocumentos(): Documento[] {
        return this.documentos;
    }

    // =========================
    // Inspeções
    // =========================

    adicionarInspecao(inspecao: Inspecao): void {
        if ([StatusCarga.FINALIZADA, StatusCarga.CANCELADA].includes(this.status)) throw new Error("CARGA_ENCERRADA");
        this.inspecoes.push(inspecao);
        this.atualizadoEm = new Date();
    }


    restaurarInspecoes(inspecoes: Inspecao[]): void {
        this.inspecoes = [...inspecoes];
    }

    getInspecoes(): Inspecao[] {
        return [...this.inspecoes];
    }

    // =========================
    // Itens da carga
    // =========================


    adicionarItem(item: ItemCarga): void {
        if ([StatusCarga.FINALIZADA, StatusCarga.CANCELADA].includes(this.status)) throw new Error("CARGA_ENCERRADA");
        this.itens.push(item);
        this.atualizadoEm = new Date();
    }

    restaurarItens(itens: ItemCarga[]): void {
        this.itens = [...itens];
    }


    getItens(): ItemCarga[] {
        return this.itens;
    }

    getQuantidadeTotal(): number {
        return this.itens.reduce(
            (total, item) => total + item.getQuantidade(),
            0
        );
    }

    getQuantidadePorProduto(produtoQuimicoId: string): number {
        const item = this.itens.find(
            (item) => item.getProdutoQuimicoID() === produtoQuimicoId
        );

        if (!item) {
            throw new Error("Produto não encontrado na carga");
        }

        return item.getQuantidade();
    }

    // =========================
    // Transições de status
    // =========================

    pendenteInspecao(): void {
        if (this.status !== StatusCarga.PENDENTE_DOCUMENTACAO && this.status !== StatusCarga.EM_ANALISE) {
            throw new Error(
                "Apenas cargas com Status PENDENTE_DOCUMENTACAO podem ser alteradas para PENDENTE_INSPECAO"
            );
        }

        this.status = this.status === StatusCarga.EM_ANALISE ? StatusCarga.EM_INSPECAO : StatusCarga.PENDENTE_INSPECAO;
        this.atualizadoEm = new Date();
    }

    liberar(): void {
        if (this.status !== StatusCarga.PENDENTE_INSPECAO && this.status !== StatusCarga.EM_INSPECAO) {
            throw new Error(
                "A carga não pode ser liberada antes de ser inspecionada"
            );
        }

        if (this.codigo && this.documentos.length === 0) {
            throw new Error("DOCUMENTACAO_OBRIGATORIA_AUSENTE");
        }
        if (this.inspecoes.length === 0) {
            throw new Error(
                "A carga precisa possuir uma inspeção"
            );
        }

        const ultimaInspecao =
            this.inspecoes[this.inspecoes.length - 1];

        if (ultimaInspecao.getResultado() === "Reprovada") {
            throw new Error(
                "A carga não pode ser liberada pois a inspeção foi reprovada"
            );
        }

        this.status = StatusCarga.LIBERADA;
        this.atualizadoEm = new Date();
    }

    movimentar(): void {
        if (this.status !== StatusCarga.LIBERADA) {
            throw new Error(
                "A carga só pode ser movimentada após a liberação da mesma"
            );
        }

        this.status = StatusCarga.MOVIMENTADA;
        this.atualizadoEm = new Date();
    }

    bloquear(): void {
        if (this.status === StatusCarga.BLOQUEADA) {
            throw new Error(
                "Não é possivel bloquear uma carga já bloqueada"
            );
        }

        if ([StatusCarga.MOVIMENTADA, StatusCarga.EM_MOVIMENTACAO, StatusCarga.FINALIZADA, StatusCarga.CANCELADA].includes(this.status)) {
            throw new Error(
                "Não é possível bloquear uma carga movimentada"
            );
        }

        if (this.documentos.length === 0) {
            throw new Error(
                "Uma carga sem documentação não pode ser bloqueada."
            );
        }

        this.status = StatusCarga.BLOQUEADA;
        this.atualizadoEm = new Date();
    }

    regularizar(): void {
        if (this.status !== StatusCarga.BLOQUEADA) {
            throw new Error(
                "Apenas cargas bloqueadas podem ser regularizadas"
            );
        }

        this.status = StatusCarga.PENDENTE_INSPECAO;
        this.atualizadoEm = new Date();
    }

    // Transições do fluxo oficial da Fase 2 (compatíveis com registros legados).
    transicionar(novoStatus: StatusCarga): void {
        const transicoes: Partial<Record<StatusCarga, StatusCarga[]>> = {
            [StatusCarga.REGISTRADA]: [StatusCarga.EM_ANALISE, StatusCarga.CANCELADA],
            [StatusCarga.EM_ANALISE]: [StatusCarga.EM_INSPECAO, StatusCarga.CANCELADA],
            [StatusCarga.EM_INSPECAO]: [StatusCarga.LIBERADA, StatusCarga.BLOQUEADA, StatusCarga.CANCELADA],
            [StatusCarga.LIBERADA]: [StatusCarga.EM_MOVIMENTACAO, StatusCarga.CANCELADA],
            [StatusCarga.EM_MOVIMENTACAO]: [StatusCarga.FINALIZADA],
            [StatusCarga.BLOQUEADA]: [StatusCarga.CANCELADA],
            [StatusCarga.PENDENTE_DOCUMENTACAO]: [StatusCarga.PENDENTE_INSPECAO, StatusCarga.CANCELADA],
            [StatusCarga.PENDENTE_INSPECAO]: [StatusCarga.LIBERADA, StatusCarga.BLOQUEADA, StatusCarga.CANCELADA],
            [StatusCarga.MOVIMENTADA]: [StatusCarga.FINALIZADA]
        };
        if (!transicoes[this.status]?.includes(novoStatus)) {
            throw new Error("TRANSICAO_STATUS_INVALIDA");
        }
        if (novoStatus === StatusCarga.LIBERADA) {
            if (this.documentos.length === 0) throw new Error("DOCUMENTACAO_OBRIGATORIA_AUSENTE");
            if (this.inspecoes.length === 0 || this.inspecoes.at(-1)?.getResultado() !== "Aprovada") {
                throw new Error("INSPECAO_APROVADA_OBRIGATORIA");
            }
        }
        this.status = novoStatus;
        this.atualizadoEm = new Date();
    }

    cancelar(): void { this.transicionar(StatusCarga.CANCELADA); }
    finalizar(): void { this.transicionar(StatusCarga.FINALIZADA); }

    getCodigo(): string { return this.codigo; }
    getOrigem(): string { return this.origem; }
    getDestino(): string { return this.destino; }
    getResponsavelTecnico(): string { return this.responsavelTecnico; }
    getDocumentacaoObrigatoria(): string { return this.documentacaoObrigatoria; }
    getDataEntrada(): Date { return this.dataEntrada; }

    // =========================
    // Getters
    // =========================

    getStatus(): StatusCarga {
        return this.status;
    }

    getID(): string {
        return this.id;
    }

    getCriadoEm(): Date {
        return this.criadoEm;
    }

    getAtualizadoEm(): Date {
        return this.atualizadoEm;
    }

}