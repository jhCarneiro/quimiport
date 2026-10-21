
import { CargaQuimicaRepository } from "../repositories/CargaQuimicaRepository";

export class RegularizarCargaQuimica {

    constructor(
        private readonly cargaRepository: CargaQuimicaRepository
    ) {}

    async executar(cargaId: string): Promise<void> {

        // 1. Buscar a carga química
        const carga = await this.cargaRepository.buscar(cargaId);

        // 2. Verificar se a carga existe
        if (!carga) {
            throw new Error("CARGA_NAO_ENCONTRADA");
        }

        // 3. Aplicar a regra de regularização
        carga.regularizar();

        // 4. Persistir o novo status
        await this.cargaRepository.atualizar(carga);
    }
}
