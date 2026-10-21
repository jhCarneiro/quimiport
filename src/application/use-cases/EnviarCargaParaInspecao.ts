
import { CargaQuimicaRepository } from "../repositories/CargaQuimicaRepository";
import { CargaQuimica } from "../../domain/entities/CargaQuimica";

export class EnviarCargaParaInspecao {

    constructor(
        private readonly cargaRepository: CargaQuimicaRepository
    ) {}

    async executar(id: string): Promise<CargaQuimica> {

        // 1. Buscar a carga no banco
        const carga = await this.cargaRepository.buscar(id);

        // 2. Verificar se a carga existe
        if (!carga) {
            throw new Error("CARGA_NAO_ENCONTRADA");
        }

        // 3. Executar a regra de negócio
        carga.pendenteInspecao();

        // 4. Persistir o novo status
        await this.cargaRepository.atualizar(carga);

        // 5. Retornar a carga atualizada
        return carga;
    }
}
