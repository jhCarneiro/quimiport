import { v4 as uuid } from "uuid"

export interface ItemCargaProps {
    produtoQuimicoID: string;
    quantidade: number;
    unidade: string;
}

export class ItemCarga {
    private id: string;
    private produtoQuimicoID: string;
    private quantidade: number;
    private unidade: string

    constructor(props: ItemCargaProps) {
        if (props.produtoQuimicoID.trim() === "") {
            throw new Error("O ProdutoQuimicoID precisa ser informado")
        }

        if (props.quantidade <= 0) {
            throw new Error("A quantidade precisa ser maior que 0")
        }
        if (props.unidade.trim() === "") {
            throw new Error("A unidade nao pode estar vazia")
        }

        this.id = uuid();
        this.produtoQuimicoID = props.produtoQuimicoID;
        this.quantidade = props.quantidade;
        this.unidade = props.unidade;

    }

    getID(): string {
        return this.id
    }
    getProdutoQuimicoID(): string {
        return this.produtoQuimicoID
    }
    getQuantidade(): number {
        return this.quantidade;
    }

    getUnidade(): string {
        return this.unidade
    }

}