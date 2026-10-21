
import { Inspecao } from "../../domain/entities/Inspecao";
import { InspecaoRepository } from "../../application/repositories/InspecaoRepository";
import { prisma } from "../database/prisma";

export class PrismaInspecaoRepository implements InspecaoRepository {

    async salvar(inspecao: Inspecao): Promise<void> {
        await prisma.inspecao.create({
            data: {
                id: inspecao.getID(),
                cargaId: inspecao.getCargaId(),
                responsavelId: inspecao.getResponsavelId(),
                resultado: inspecao.getResultado(),
                observacao: inspecao.getObservacao(),
                dataInspecao: inspecao.getDataInspecao(),
                criadoEm: inspecao.getCriadoEm(),
                atualizadoEm: inspecao.getAtualizadoEm()
            }
        });
    }

    async buscar(id: string): Promise<Inspecao | null> {
        const registro = await prisma.inspecao.findUnique({
            where: { id }
        });

        if (!registro) {
            return null;
        }

        return this.converterParaEntidade(registro);
    }

    async listarPorCarga(cargaId: string): Promise<Inspecao[]> {
        const registros = await prisma.inspecao.findMany({
            where: { cargaId },
            orderBy: {
                dataInspecao: "asc"
            }
        });

        return registros.map((registro) =>
            this.converterParaEntidade(registro)
        );
    }

    private converterParaEntidade(registro: {
        id: string;
        cargaId: string;
        responsavelId: string;
        resultado: string;
        observacao: string;
        dataInspecao: Date;
        criadoEm: Date;
        atualizadoEm: Date;
    }): Inspecao {
        return new Inspecao({
            id: registro.id,
            cargaId: registro.cargaId,
            responsavelId: registro.responsavelId,
            resultado: registro.resultado,
            observacao: registro.observacao,
            dataInspecao: registro.dataInspecao,
            criadoEm: registro.criadoEm,
            atualizadoEm: registro.atualizadoEm
        });
    }
}
