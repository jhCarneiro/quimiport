
import { v4 as uuid } from "uuid";

export interface DocumentoProps {
    id?: string;
    tipo: string;
    numero: string;
    dataEmissao: Date;
    dataValidade: Date;
    criadoEm?: Date;
    atualizadoEm?: Date;
}

export class Documento {
    private id: string;
    private tipo: string;
    private numero: string;
    private dataEmissao: Date;
    private dataValidade: Date;
    private criadoEm: Date;
    private atualizadoEm: Date;

    constructor(props: DocumentoProps) {

        if (!props.tipo || props.tipo.trim() === "") {
            throw new Error("O tipo precisa ser informado");
        }

        if (!props.numero || props.numero.trim() === "") {
            throw new Error("O numero precisa ser informado");
        }

        if (
            !(props.dataEmissao instanceof Date) ||
            Number.isNaN(props.dataEmissao.getTime())
        ) {
            throw new Error("A data de emissão deve ser válida");
        }

        if (
            !(props.dataValidade instanceof Date) ||
            Number.isNaN(props.dataValidade.getTime())
        ) {
            throw new Error("A data de validade deve ser válida");
        }

        if (
            props.dataValidade.getTime() <
            props.dataEmissao.getTime()
        ) {
            throw new Error(
                "A data de validade nao pode ser anterior a data de emissão"
            );
        }

        this.id = props.id ?? uuid();
        this.tipo = props.tipo;
        this.numero = props.numero;
        this.dataEmissao = props.dataEmissao;
        this.dataValidade = props.dataValidade;
        this.criadoEm = props.criadoEm ?? new Date();
        this.atualizadoEm = props.atualizadoEm ?? new Date();
    }

    getID(): string {
        return this.id;
    }

    getTipo(): string {
        return this.tipo;
    }

    getNumero(): string {
        return this.numero;
    }

    getDataEmissao(): Date {
        return this.dataEmissao;
    }

    getDataValidade(): Date {
        return this.dataValidade;
    }

    getCriadoEm(): Date {
        return this.criadoEm;
    }

    getAtualizadoEm(): Date {
        return this.atualizadoEm;
    }
}
