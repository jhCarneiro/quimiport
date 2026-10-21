import { v4 as uuid } from "uuid"

export interface ProdutoQuimicoProps{
    id?: string,
    nome: string,
    numeroONU: string,
    classeRisco: string,
    criadoEm?: Date,
    atualizadoEm?: Date
}

export class ProdutoQuimico{
    private id: string;
    private nome: string;
    private numeroONU: string;
    private classeRisco: string;
    private criadoEm: Date;
    private atualizadoEm: Date
    

    constructor(props: ProdutoQuimicoProps){
        if(props.nome.trim() ===""){
            throw new Error("O nome precisa ser preenchido corretamente")
        }
        if(props.numeroONU.trim() === ""){
            throw new Error("O numeroONU precisa ser preenchido corretamente")
        }
        if(props.classeRisco.trim() === ""){
            throw new Error("A classeRisco precisa ser preenchida corretamente")
        }

        this.id = props.id ?? uuid();
        this.nome = props.nome;
        this.numeroONU = props.numeroONU;
        this.classeRisco = props.classeRisco;
        this.criadoEm = props.criadoEm ?? new Date();
        this.atualizadoEm = props.atualizadoEm ?? new Date();

    }

    private atualizarTimestamp():void{
        this.atualizadoEm = new Date()
    }
    
    getID(): string{
        return this.id
    }

    getNome(): string{
        return this.nome
    }

    getNumeroONU(): string{
        return this.numeroONU
    }

    getClasseRisco(): string{
        return this.classeRisco
    }

    getCriadoEm(): Date{
        return this.criadoEm
    }

    getAtualizadoEm(): Date{
        return this.atualizadoEm
    }
}