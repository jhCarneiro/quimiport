
import {
    CargaQuimicaRepository
} from "../repositories/CargaQuimicaRepository";

import {
    InspecaoRepository
} from "../repositories/InspecaoRepository";

import {
    StatusCarga
} from "../../domain/entities/CargaQuimica";

import {
    Inspecao
} from "../../domain/entities/Inspecao";

interface RegistrarInspecaoDTO {
    cargaId: string;
    responsavelId: string;
    resultado: string;
    observacao: string;
    dataInspecao: Date;
}

export class RegistrarInspecao {

    constructor(
        private readonly cargaRepository: CargaQuimicaRepository,
        private readonly inspecaoRepository: InspecaoRepository
    ) {}

    async executar(dados: RegistrarInspecaoDTO): Promise<Inspecao> {

        // 1. Verificar se a carga existe
        const carga = await this.cargaRepository.buscar(dados.cargaId);

        if (!carga) {
            throw new Error("CARGA_NAO_ENCONTRADA");
        }

        // 2. Verificar se a carga está aguardando inspeção
        if (carga.getStatus() !== StatusCarga.PENDENTE_INSPECAO) {
            throw new Error("CARGA_NAO_PERMITE_INSPECAO");
        }

        // 3. Criar a inspeção com as validações da entidade
        const inspecao = new Inspecao({
            cargaId: dados.cargaId,
            responsavelId: dados.responsavelId,
            resultado: dados.resultado,
            observacao: dados.observacao,
            dataInspecao: dados.dataInspecao
        });

        // 4. Persistir a inspeção no PostgreSQL
        await this.inspecaoRepository.salvar(inspecao);

        return inspecao;
    }
}
