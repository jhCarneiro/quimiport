import { StatusCarga } from "../../domain/entities/CargaQuimica";
import { CargaQuimicaRepository } from "../repositories/CargaQuimicaRepository";
export class AlterarStatusCargaQuimica {
    constructor(private readonly repository: CargaQuimicaRepository) {}
    async executar(id: string, status: StatusCarga) {
        const carga = await this.repository.buscar(id);
        if (!carga) throw new Error("CARGA_NAO_ENCONTRADA");
        carga.transicionar(status);
        await this.repository.atualizar(carga);
        return carga;
    }
}
