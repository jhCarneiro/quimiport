
import { CargaQuimicaRepository } from "../repositories/CargaQuimicaRepository";

export class MovimentarCargaQuimica {

    constructor(
        private readonly cargaRepository: CargaQuimicaRepository
    ) {}

    async executar(cargaId: string): Promise<void> {

        // 1. Buscar a carga no banco
        const carga = await this.cargaRepository.buscar(cargaId);

        // 2. Verificar se a carga existe
        if (!carga) {
            throw new Error("CARGA_NAO_ENCONTRADA");
        }

        // 3. Aplicar as regras de movimentação
        carga.movimentar();

        // 4. Persistir o novo status
        await this.cargaRepository.atualizar(carga);
    }
}
