
import { Documento } from "../../domain/entities/Documento";

import { DocumentoRepository } from "../../application/repositories/DocumentoRepository";

import { prisma } from "../database/prisma";

export class PrismaDocumentoRepository implements DocumentoRepository {

    async salvar(
        cargaId: string,
        documento: Documento
    ): Promise<void> {

        await prisma.documento.create({
            data: {
                id: documento.getID(),
                cargaQuimicaId: cargaId,
                tipo: documento.getTipo(),
                numero: documento.getNumero(),
                dataEmissao: documento.getDataEmissao(),
                dataValidade: documento.getDataValidade(),
                criadoEm: documento.getCriadoEm(),
                atualizadoEm: documento.getAtualizadoEm()
            }
        });
    }

    async buscar(id: string): Promise<Documento | null> {

        const registro = await prisma.documento.findUnique({
            where: { id }
        });

        if (!registro) {
            return null;
        }

        return this.converterParaEntidade(registro);
    }

    async listarPorCarga(cargaId: string): Promise<Documento[]> {

        const registros = await prisma.documento.findMany({
            where: {
                cargaQuimicaId: cargaId
            },
            orderBy: [
                { criadoEm: "asc" },
                { id: "asc" }
            ]
        });

        return registros.map((registro) =>
            this.converterParaEntidade(registro)
        );
    }

    private converterParaEntidade(registro: {
        id: string;
        tipo: string;
        numero: string;
        dataEmissao: Date;
        dataValidade: Date;
        criadoEm: Date;
        atualizadoEm: Date;
    }): Documento {

        return new Documento({
            id: registro.id,
            tipo: registro.tipo,
            numero: registro.numero,
            dataEmissao: registro.dataEmissao,
            dataValidade: registro.dataValidade,
            criadoEm: registro.criadoEm,
            atualizadoEm: registro.atualizadoEm
        });
    }
}
