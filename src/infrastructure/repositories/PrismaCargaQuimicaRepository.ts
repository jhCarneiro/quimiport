
import {
    CargaQuimica,
    StatusCarga
} from "../../domain/entities/CargaQuimica";

import { ItemCarga } from "../../domain/entities/ItemCarga";
import {
    CargaQuimicaRepository,
    ItemCargaDetalhado
} from "../../application/repositories/CargaQuimicaRepository";
import { prisma } from "../database/prisma";
import { Inspecao } from "../../domain/entities/Inspecao";
import { Documento } from "../../domain/entities/Documento";


export class PrismaCargaQuimicaRepository implements CargaQuimicaRepository {

    async salvar(carga: CargaQuimica): Promise<void> {
        await prisma.cargaQuimica.create({
            data: {
                id: carga.getID(),
                status: carga.getStatus(),
                criadoEm: carga.getCriadoEm(),
                atualizadoEm: carga.getAtualizadoEm()
            }
        });
    }

    async buscar(id: string): Promise<CargaQuimica | null> {

        const registro = await prisma.cargaQuimica.findUnique({
            where: { id },
            include: {
                itens: true,
                inspecoes: {
                    orderBy: [
                        { dataInspecao: "asc" },
                        { criadoEm: "asc" },
                        { id: "asc" }
                    ]
                },
                documentos: true
            }
        });

        if (!registro) {
            return null;
        }

        return this.converterParaEntidade(registro);
    }

    async listar(): Promise<CargaQuimica[]> {
        const registros = await prisma.cargaQuimica.findMany({

            include: {
                itens: true,
                inspecoes: {
                    orderBy: [
                        { dataInspecao: "asc" },
                        { criadoEm: "asc" },
                        { id: "asc" }
                    ]
                },
                documentos: true
            }

        });

        return registros.map((registro) =>
            this.converterParaEntidade(registro)
        );
    }



    async atualizar(carga: CargaQuimica): Promise<void> {
        await prisma.cargaQuimica.update({
            where: {
                id: carga.getID()
            },
            data: {
                status: carga.getStatus(),
                atualizadoEm: carga.getAtualizadoEm()
            }
        });
    }



    async adicionarItem(
        cargaId: string,
        item: ItemCarga
    ): Promise<void> {
        await prisma.itemCarga.create({
            data: {
                id: item.getID(),
                cargaQuimicaId: cargaId,
                produtoQuimicoId: item.getProdutoQuimicoID(),
                quantidade: item.getQuantidade(),
                unidade: item.getUnidade()
            }
        });
    }

    async listarItens(
        cargaId: string
    ): Promise<ItemCargaDetalhado[]> {
        const registros = await prisma.itemCarga.findMany({
            where: {
                cargaQuimicaId: cargaId
            },
            include: {
                produtoQuimico: true
            }
        });

        return registros.map((registro) => ({
            id: registro.id,
            produtoQuimicoID: registro.produtoQuimicoId,
            nomeProduto: registro.produtoQuimico.nome,
            quantidade: registro.quantidade,
            unidade: registro.unidade
        }));
    }


    private converterParaEntidade(registro: {
        id: string;
        status: string;
        criadoEm: Date;
        atualizadoEm: Date;
        itens: {
            id: string;
            produtoQuimicoId: string;
            quantidade: number;
            unidade: string;
        }[];

        inspecoes: {
            id: string;
            cargaId: string;
            responsavelId: string;
            resultado: string;
            observacao: string;
            dataInspecao: Date;
            criadoEm: Date;
            atualizadoEm: Date;
        }[];

        documentos: {
            id: string;
            tipo: string;
            numero: string;
            dataEmissao: Date;
            dataValidade: Date;
            criadoEm: Date;
            atualizadoEm: Date;
        }[];


    }): CargaQuimica {


        const statusValido = Object.values(StatusCarga).includes(
            registro.status as StatusCarga
        );

        if (!statusValido) {
            throw new Error("Status da carga inválido no banco de dados");
        }

        const carga = new CargaQuimica({
            id: registro.id,
            status: registro.status as StatusCarga,
            criadoEm: registro.criadoEm,
            atualizadoEm: registro.atualizadoEm
        });



        const itens = registro.itens.map((registroItem) =>
            new ItemCarga({
                id: registroItem.id,
                produtoQuimicoID: registroItem.produtoQuimicoId,
                quantidade: registroItem.quantidade,
                unidade: registroItem.unidade
            })
        );


        carga.restaurarItens(itens);

        const inspecoes = registro.inspecoes.map(
            (registroInspecao) =>
                new Inspecao({
                    id: registroInspecao.id,
                    cargaId: registroInspecao.cargaId,
                    responsavelId: registroInspecao.responsavelId,
                    resultado: registroInspecao.resultado,
                    observacao: registroInspecao.observacao,
                    dataInspecao: registroInspecao.dataInspecao,
                    criadoEm: registroInspecao.criadoEm,
                    atualizadoEm: registroInspecao.atualizadoEm
                })
        );

        carga.restaurarInspecoes(inspecoes);


        const documentos = registro.documentos.map(
            (registroDocumento) =>
                new Documento({
                    id: registroDocumento.id,
                    tipo: registroDocumento.tipo,
                    numero: registroDocumento.numero,
                    dataEmissao: registroDocumento.dataEmissao,
                    dataValidade: registroDocumento.dataValidade,
                    criadoEm: registroDocumento.criadoEm,
                    atualizadoEm: registroDocumento.atualizadoEm
                })
        );

        carga.restaurarDocumentos(documentos);

        return carga;

    }
}
