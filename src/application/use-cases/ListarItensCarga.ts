
import { CargaQuimicaRepository } from "../repositories/CargaQuimicaRepository";

export class ListarItensCarga {
    constructor(
        private readonly cargaRepository: CargaQuimicaRepository
    ) {}

    async executar(cargaId: string) {
        const carga = await this.cargaRepository.buscar(cargaId);

        if (!carga) {
            return null;
        }

        return this.cargaRepository.listarItens(cargaId);
    }
}
