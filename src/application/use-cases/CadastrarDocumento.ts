
import { CargaQuimicaRepository } from "../repositories/CargaQuimicaRepository";
import { DocumentoRepository } from "../repositories/DocumentoRepository";
import { Documento } from "../../domain/entities/Documento";

export interface CadastrarDocumentoDTO {
    cargaId: string;
    tipo: string;
    numero: string;
    dataEmissao: Date;
    dataValidade: Date;
}

export class CadastrarDocumento {

    constructor(
        private readonly cargaRepository: CargaQuimicaRepository,
        private readonly documentoRepository: DocumentoRepository
    ) {}

    async executar(dados: CadastrarDocumentoDTO): Promise<Documento> {

        // 1. Verificar se a carga existe
        const carga = await this.cargaRepository.buscar(dados.cargaId);

        if (!carga) {
            throw new Error("CARGA_NAO_ENCONTRADA");
        }

        // 2. Criar e validar o documento
        const documento = new Documento({
            tipo: dados.tipo,
            numero: dados.numero,
            dataEmissao: dados.dataEmissao,
            dataValidade: dados.dataValidade
        });

        // 3. Salvar o documento no PostgreSQL
        await this.documentoRepository.salvar(
            carga.getID(),
            documento
        );

        return documento;
    }
}
