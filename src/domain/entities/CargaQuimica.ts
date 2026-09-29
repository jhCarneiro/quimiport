import { v4 as uuid } from "uuid";
import { ItemCarga } from "./ItemCarga";
import { Inspecao } from "./Inspecao";
import { Documento } from "./Documento";

export enum StatusCarga {
    PENDENTE_DOCUMENTACAO = "PENDENTE_DOCUMENTACAO",
    PENDENTE_INSPECAO = "PENDENTE_INSPECAO",
    LIBERADA = "LIBERADA",
    MOVIMENTADA = "MOVIMENTADA",
    BLOQUEADA = "BLOQUEADA"
}

export interface CargaQuimicaProps {
    criadoEm?: Date;
    atualizadoEm?: Date;
}

export class CargaQuimica {
    private id: string;
    private itens: ItemCarga[];
    private inspecoes: Inspecao[];
    private documentos: Documento[]
    private status: StatusCarga;
    private criadoEm: Date;
    private atualizadoEm: Date;

    constructor(props: CargaQuimicaProps) {
        this.id = uuid();
        this.itens = [];
        this.inspecoes = [];
        this.documentos = [];
        this.status = StatusCarga.PENDENTE_DOCUMENTACAO;
        this.criadoEm = props.criadoEm ?? new Date();
        this.atualizadoEm = props.atualizadoEm ?? new Date();
    }

    adicionarInspecao(inspecao: Inspecao): void{
        this.inspecoes.push(inspecao)
        this.atualizadoEm = new Date()
    }

    getInspecoes(): Inspecao[]{
        return this.inspecoes
    }

    getDocumentos(): Documento[]{
        return this.documentos
    }

    adicionarDocumento(documento: Documento): void{
        this.documentos.push(documento)
        this.atualizadoEm = new Date()
    }

    adicionarItem(item: ItemCarga): void {
        this.itens.push(item);
        this.atualizadoEm = new Date();
    }

    getItens(): ItemCarga[] {
        return this.itens;
    }

    getQuantidadeTotal(): number {
        return this.itens.reduce((total, item) => total + item.getQuantidade(), 0);
    }

    getQuantidadePorProduto(produtoQuimicoId: string): number {
        const item = this.itens.find(i => i.getProdutoQuimicoID() === produtoQuimicoId);
        if (!item) {
            throw new Error("Produto não encontrado na carga");
        }
        return item.getQuantidade();
    }

    // --- Transições de status ---
    pendenteInspecao(): void {
        if (this.status !== StatusCarga.PENDENTE_DOCUMENTACAO) {
            throw new Error("Apenas cargas com Status PENDENTE_DOCUMENTACAO podem ser alteradas para PENDENTE_INSPECAO");
        }
        this.status = StatusCarga.PENDENTE_INSPECAO;
        this.atualizadoEm = new Date();
    }

    liberar(): void {
        
        if (this.status !== StatusCarga.PENDENTE_INSPECAO) {
            throw new Error("A carga não pode ser liberada antes de ser inspecionada");
        }
        if( this.inspecoes.length <= 0 ){
            throw new Error("A carga precisa possuir uma inspeção")
        }
        const resultado2 = this.inspecoes[this.inspecoes.length-1].getResultado()
        if(resultado2 === "Reprovada"){
            throw new Error("A carga não pode ser liberada pois a inspeção foi reprovada")
        }
        this.status = StatusCarga.LIBERADA;
        this.atualizadoEm = new Date();
    }

    movimentar(): void {
        if (this.status !== StatusCarga.LIBERADA) {
            throw new Error("A carga só pode ser movimentada após a liberação da mesma");
        }
        this.status = StatusCarga.MOVIMENTADA;
        this.atualizadoEm = new Date();
    }

    bloquear(): void {
        if (this.status === StatusCarga.BLOQUEADA) {
            throw new Error("Não é possivel bloquear uma carga já bloqueada");
        }
        if (this.status === StatusCarga.MOVIMENTADA) {
            throw new Error("Não é possível bloquear uma carga movimentada");
        }
        if (this.documentos.length === 0 ) {
            throw new Error("Uma carga sem documentação não pode ser bloqueada.");
        }
        this.status = StatusCarga.BLOQUEADA;
        this.atualizadoEm = new Date();
    }

    regularizar(): void {
        if (this.status !== StatusCarga.BLOQUEADA) {
            throw new Error("Apenas cargas bloqueadas podem ser regularizadas");
        }
        this.status = StatusCarga.PENDENTE_INSPECAO;
        this.atualizadoEm = new Date();
    }

    getStatus(): StatusCarga {
        return this.status;
    }

    getID(): string {
        return this.id;
    }
}
