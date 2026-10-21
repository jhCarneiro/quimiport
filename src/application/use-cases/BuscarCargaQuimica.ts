
import { CargaQuimica } from "../../domain/entities/CargaQuimica";
import { CargaQuimicaRepository } from "../repositories/CargaQuimicaRepository";

export class BuscarCargaQuimica {
    constructor(
        private readonly repository: CargaQuimicaRepository
    ) {}

    async executar(id: string): Promise<CargaQuimica | null> {
        return this.repository.buscar(id);
    }
}
