
import { CargaQuimica } from "../../domain/entities/CargaQuimica";
import { CargaQuimicaRepository } from "../repositories/CargaQuimicaRepository";

export class CadastrarCargaQuimica {
    constructor(
        private readonly repository: CargaQuimicaRepository
    ) {}

    async executar(): Promise<CargaQuimica> {
        const carga = new CargaQuimica();

        await this.repository.salvar(carga);

        return carga;
    }
}
