
import { CargaQuimicaRepository } from "../repositories/CargaQuimicaRepository";

export class LiberarCargaQuimica {

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

        // 3. Aplicar as regras de negócio
        carga.liberar();

        // 4. Salvar o novo status no banco
        await this.cargaRepository.atualizar(carga);
    }
}
