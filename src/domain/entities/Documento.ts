import { v4 as uuid } from "uuid"

export interface DocumentoProps {
    tipo: string
    numero: string
    dataEmissao: Date
    dataValidade: Date
    criadoEm?: Date
    atualizadoEm?: Date
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
        if(props.tipo.trim() ===""){
            throw new Error("O tipo precisa ser informado")
        }
        if(props.numero.trim() ===""){
            throw new Error("O numero precisa ser informado")
        }
        if(props.dataValidade.getTime() < props.dataEmissao.getTime()){
            throw new Error("A data de validade nao pode ser anterior a data de emissão")
        }
        
        this.id = uuid()
        this.tipo = props.tipo;
        this.numero = props.numero;
        this.dataEmissao = props.dataEmissao;
        this.dataValidade = props.dataValidade;
        this.criadoEm = props.criadoEm ?? new Date();
        this.atualizadoEm = props.atualizadoEm ?? new Date();
    }

    getID(): string{
        return this.id
    }
    getTipo(): string{
        return this.tipo
    }
    getNumero(): string{
        return this.numero
    }
    getDataEmissao(): Date{
        return this.dataEmissao
    }
    getDataValidade(): Date{
     return this.dataValidade
    }
    getCriadoEm(): Date{
        return this.criadoEm
    }
    getAtualizadoEm(): Date{
        return this.atualizadoEm
    }

}