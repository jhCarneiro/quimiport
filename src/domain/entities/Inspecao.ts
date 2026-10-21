
import { v4 as uuid } from "uuid";

export enum ResultadoInspecao {
    APROVADA = "Aprovada",
    REPROVADA = "Reprovada"
}

export interface InspecaoProps {
    id?: string;
    cargaId: string;
    responsavelId: string;
    resultado: string;
    observacao: string;
    dataInspecao: Date;
    criadoEm?: Date;
    atualizadoEm?: Date;
}

export class Inspecao {
    private id: string;
    private cargaId: string;
    private responsavelId: string;
    private resultado: string;
    private observacao: string;
    private dataInspecao: Date;
    private criadoEm: Date;
    private atualizadoEm: Date;

    constructor(props: InspecaoProps) {

        if (!props.cargaId || props.cargaId.trim() === "") {
            throw new Error("cargaId não pode ser vazio");
        }

        if (!props.responsavelId || props.responsavelId.trim() === "") {
            throw new Error("responsavelId não pode ser vazio");
        }


        if (!props.resultado || props.resultado.trim() === "") {
            throw new Error("resultado não pode ser vazio");
        }

        if (
            props.resultado !== ResultadoInspecao.APROVADA &&
            props.resultado !== ResultadoInspecao.REPROVADA
        ) {
            throw new Error(
                "resultado deve ser Aprovada ou Reprovada"
            );
        }



        if (
            !(props.dataInspecao instanceof Date) ||
            Number.isNaN(props.dataInspecao.getTime())
        ) {
            throw new Error("dataInspecao deve ser informada");
        }


        this.id = props.id ?? uuid();
        this.cargaId = props.cargaId;
        this.responsavelId = props.responsavelId;
        this.resultado = props.resultado;
        this.observacao = props.observacao;
        this.dataInspecao = props.dataInspecao;
        this.criadoEm = props.criadoEm ?? new Date();
        this.atualizadoEm = props.atualizadoEm ?? new Date();
    }

    getID(): string {
        return this.id;
    }

    getCargaId(): string {
        return this.cargaId;
    }

    getResponsavelId(): string {
        return this.responsavelId;
    }

    getResultado(): string {
        return this.resultado;
    }

    getObservacao(): string {
        return this.observacao;
    }

    getDataInspecao(): Date {
        return this.dataInspecao;
    }

    getCriadoEm(): Date {
        return this.criadoEm;
    }

    getAtualizadoEm(): Date {
        return this.atualizadoEm;
    }
}
