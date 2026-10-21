import { CargaQuimica } from "../../domain/entities/CargaQuimica";
import { CargaQuimicaRepository } from "../repositories/CargaQuimicaRepository";

export class ListarCargasQuimicas{
    constructor(
        private readonly repository: CargaQuimicaRepository
    ){}

    async executar(): Promise<CargaQuimica[]>{
        return await this.repository .listar()
    }
}