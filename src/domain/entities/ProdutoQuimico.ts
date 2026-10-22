
import { v4 as uuid } from "uuid";

export type StatusProdutoQuimico = "ATIVO" | "INATIVO";

export interface ProdutoQuimicoProps {
    id?: string;
    nome: string;
    descricao?: string;
    numeroONU: string;
    classeRisco: string;
    grupoCompatibilidade?: string;
    status?: StatusProdutoQuimico;
    criadoEm?: Date;
    atualizadoEm?: Date;
}

export class ProdutoQuimico {
    private id: string;
    private nome: string;
    private descricao: string;
    private numeroONU: string;
    private classeRisco: string;
    private grupoCompatibilidade: string;
    private status: StatusProdutoQuimico;
    private criadoEm: Date;
    private atualizadoEm: Date;

    constructor(props: ProdutoQuimicoProps) {
        if (!props.nome?.trim()) {
            throw new Error("O nome precisa ser preenchido corretamente");
        }

        if (!props.numeroONU?.trim()) {
            throw new Error("O numeroONU precisa ser preenchido corretamente");
        }

        if (!props.classeRisco?.trim()) {
            throw new Error("A classeRisco precisa ser preenchida corretamente");
        }

        if (
            props.status !== undefined &&
            props.status !== "ATIVO" &&
            props.status !== "INATIVO"
        ) {
            throw new Error("Status do produto químico inválido");
        }

        this.id = props.id ?? uuid();
        this.nome = props.nome;
        this.descricao = props.descricao ?? "";
        this.numeroONU = props.numeroONU;
        this.classeRisco = props.classeRisco;
        this.grupoCompatibilidade = props.grupoCompatibilidade ?? "";
        this.status = props.status ?? "ATIVO";
        this.criadoEm = props.criadoEm ?? new Date();
        this.atualizadoEm = props.atualizadoEm ?? new Date();
    }

    private atualizarTimestamp(): void {
        this.atualizadoEm = new Date();
    }

    atualizarDados(dados: {
        nome: string;
        descricao: string;
        numeroONU: string;
        classeRisco: string;
        grupoCompatibilidade: string;
    }): void {
        if (!dados.nome?.trim()) {
            throw new Error("O nome precisa ser preenchido corretamente");
        }

        if (!dados.numeroONU?.trim()) {
            throw new Error("O numeroONU precisa ser preenchido corretamente");
        }

        if (!dados.classeRisco?.trim()) {
            throw new Error("A classeRisco precisa ser preenchida corretamente");
        }

        this.nome = dados.nome;
        this.descricao = dados.descricao;
        this.numeroONU = dados.numeroONU;
        this.classeRisco = dados.classeRisco;
        this.grupoCompatibilidade = dados.grupoCompatibilidade;

        this.atualizarTimestamp();
    }

    inativar(): void {
        if (this.status === "INATIVO") {
            throw new Error("O produto químico já está inativo");
        }

        this.status = "INATIVO";
        this.atualizarTimestamp();
    }

    getID(): string {
        return this.id;
    }

    getNome(): string {
        return this.nome;
    }

    getDescricao(): string {
        return this.descricao;
    }

    getNumeroONU(): string {
        return this.numeroONU;
    }

    getClasseRisco(): string {
        return this.classeRisco;
    }

    getGrupoCompatibilidade(): string {
        return this.grupoCompatibilidade;
    }

    getStatus(): StatusProdutoQuimico {
        return this.status;
    }

    getCriadoEm(): Date {
        return this.criadoEm;
    }

    getAtualizadoEm(): Date {
        return this.atualizadoEm;
    }
}
