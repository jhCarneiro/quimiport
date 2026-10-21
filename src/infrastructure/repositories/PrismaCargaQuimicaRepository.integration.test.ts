
import { describe, it, expect } from "vitest";

import { CargaQuimica } from "../../domain/entities/CargaQuimica";

import { PrismaCargaQuimicaRepository } from "./PrismaCargaQuimicaRepository";

import { prisma } from "../database/prisma";

import { garantirBancoDeTeste } from "../../tests/garantirBancoDeTeste";
import { Documento } from "../../domain/entities/Documento";
import { PrismaDocumentoRepository } from "./PrismaDocumentoRepository";

import { Inspecao } from "../../domain/entities/Inspecao";
import { PrismaInspecaoRepository } from "./PrismaInspecaoRepository";

import { StatusCarga } from "../../domain/entities/CargaQuimica";

import { BloquearCargaQuimica } from "../../application/use-cases/BloquearCargaQuimica";

import { RegularizarCargaQuimica } from "../../application/use-cases/RegularizarCargaQuimica";

import { LiberarCargaQuimica } from "../../application/use-cases/LiberarCargaQuimica";

import { MovimentarCargaQuimica } from "../../application/use-cases/MovimentarCargaQuimica";



describe("PrismaCargaQuimicaRepository - Integração", () => {


    it("deve liberar e movimentar uma carga após inspeção aprovada", async () => {

        garantirBancoDeTeste();

        // Confirmar a conexão real antes de gravar dados
        const resultado = await prisma.$queryRaw<
            Array<{ nome: string }>
        >`SELECT current_database() AS nome`;

        expect(resultado[0]?.nome).toBe("quimiport_test");

        const cargaRepository = new PrismaCargaQuimicaRepository();
        const documentoRepository = new PrismaDocumentoRepository();
        const inspecaoRepository = new PrismaInspecaoRepository();

        const bloquearCarga = new BloquearCargaQuimica(cargaRepository);
        const regularizarCarga = new RegularizarCargaQuimica(cargaRepository);
        const liberarCarga = new LiberarCargaQuimica(cargaRepository);
        const movimentarCarga = new MovimentarCargaQuimica(cargaRepository);

        const carga = new CargaQuimica();

        const documento = new Documento({
            tipo: "Licença Ambiental",
            numero: "LA-TESTE-MOVIMENTACAO",
            dataEmissao: new Date("2026-01-10"),
            dataValidade: new Date("2027-01-10")
        });

        const inspecao = new Inspecao({
            cargaId: carga.getID(),
            responsavelId: "fiscal-teste-002",
            resultado: "Aprovada",
            observacao: "Carga aprovada para liberação",
            dataInspecao: new Date("2026-10-20T15:00:00.000Z")
        });

        try {
            // 1. Salvar a carga e o documento
            await cargaRepository.salvar(carga);

            await documentoRepository.salvar(
                carga.getID(),
                documento
            );

            // 2. Bloquear e regularizar a carga
            await bloquearCarga.executar(carga.getID());
            await regularizarCarga.executar(carga.getID());

            // 3. Registrar a inspeção aprovada no PostgreSQL
            await inspecaoRepository.salvar(inspecao);

            // 4. Liberar a carga
            await liberarCarga.executar(carga.getID());

            const cargaLiberada = await cargaRepository.buscar(
                carga.getID()
            );

            expect(cargaLiberada?.getStatus()).toBe(
                StatusCarga.LIBERADA
            );

            expect(cargaLiberada?.getInspecoes()).toHaveLength(1);

            expect(
                cargaLiberada?.getInspecoes()[0].getResultado()
            ).toBe("Aprovada");

            // 5. Movimentar a carga
            await movimentarCarga.executar(carga.getID());

            const cargaMovimentada = await cargaRepository.buscar(
                carga.getID()
            );

            expect(cargaMovimentada?.getStatus()).toBe(
                StatusCarga.MOVIMENTADA
            );

            // 6. Confirmar que os relacionamentos foram preservados
            expect(cargaMovimentada?.getDocumentos()).toHaveLength(1);
            expect(cargaMovimentada?.getInspecoes()).toHaveLength(1);

        } finally {

            garantirBancoDeTeste();

            // Remover apenas os registros criados neste teste
            await prisma.inspecao.deleteMany({
                where: {
                    cargaId: carga.getID()
                }
            });

            await prisma.documento.deleteMany({
                where: {
                    cargaQuimicaId: carga.getID()
                }
            });

            await prisma.cargaQuimica.deleteMany({
                where: {
                    id: carga.getID()
                }
            });
        }
    });

    it("deve bloquear e regularizar uma carga recuperada do PostgreSQL", async () => {

        // 1. Confirmar que estamos no banco de testes
        garantirBancoDeTeste();

        const resultado = await prisma.$queryRaw<
            Array<{ nome: string }>
        >`SELECT current_database() AS nome`;

        expect(resultado[0]?.nome).toBe("quimiport_test");

        // 2. Preparar os repositórios
        const cargaRepository = new PrismaCargaQuimicaRepository();
        const documentoRepository = new PrismaDocumentoRepository();

        // 3. Preparar os casos de uso
        const bloquearCarga = new BloquearCargaQuimica(
            cargaRepository
        );

        const regularizarCarga = new RegularizarCargaQuimica(
            cargaRepository
        );

        // 4. Criar uma carga química
        const carga = new CargaQuimica();

        // 5. Criar um documento válido
        const documento = new Documento({
            tipo: "Licença Ambiental",
            numero: "LA-TESTE-BLOQUEIO",
            dataEmissao: new Date("2026-01-10"),
            dataValidade: new Date("2027-01-10")
        });

        try {
            // 6. Salvar a carga
            await cargaRepository.salvar(carga);

            // 7. Salvar o documento associado
            await documentoRepository.salvar(
                carga.getID(),
                documento
            );

            // 8. Executar o bloqueio
            await bloquearCarga.executar(carga.getID());

            // 9. Buscar novamente do PostgreSQL
            const cargaBloqueada = await cargaRepository.buscar(
                carga.getID()
            );

            expect(cargaBloqueada).not.toBeNull();

            expect(cargaBloqueada?.getStatus()).toBe(
                StatusCarga.BLOQUEADA
            );

            // 10. Executar a regularização
            await regularizarCarga.executar(carga.getID());

            // 11. Buscar novamente do PostgreSQL
            const cargaRegularizada = await cargaRepository.buscar(
                carga.getID()
            );

            expect(cargaRegularizada).not.toBeNull();

            expect(cargaRegularizada?.getStatus()).toBe(
                StatusCarga.PENDENTE_INSPECAO
            );

            // 12. Confirmar que o documento foi preservado
            expect(
                cargaRegularizada?.getDocumentos()
            ).toHaveLength(1);

            expect(
                cargaRegularizada?.getDocumentos()[0].getID()
            ).toBe(documento.getID());

        } finally {

            // 13. Garantir que estamos no banco de testes
            garantirBancoDeTeste();

            // 14. Remover o documento criado pelo teste
            await prisma.documento.deleteMany({
                where: {
                    cargaQuimicaId: carga.getID()
                }
            });

            // 15. Remover a carga criada pelo teste
            await prisma.cargaQuimica.deleteMany({
                where: {
                    id: carga.getID()
                }
            });
        }
    });

    it("deve recuperar as inspeções associadas a uma carga", async () => {

        // 1. Garantir que estamos no banco de testes
        garantirBancoDeTeste();

        const resultado = await prisma.$queryRaw<
            Array<{ nome: string }>
        >`SELECT current_database() AS nome`;

        expect(resultado[0]?.nome).toBe("quimiport_test");

        // 2. Preparar os repositórios
        const cargaRepository = new PrismaCargaQuimicaRepository();
        const inspecaoRepository = new PrismaInspecaoRepository();

        // 3. Criar uma carga química
        const carga = new CargaQuimica();

        // 4. Criar uma inspeção aprovada
        const inspecao = new Inspecao({
            cargaId: carga.getID(),
            responsavelId: "fiscal-teste-001",
            resultado: "Aprovada",
            observacao: "Inspeção aprovada no teste de integração",
            dataInspecao: new Date("2026-10-20T15:00:00.000Z")
        });

        try {
            // 5. Salvar a carga no PostgreSQL
            await cargaRepository.salvar(carga);

            // 6. Salvar a inspeção associada
            await inspecaoRepository.salvar(inspecao);

            // 7. Recuperar a carga do banco
            const cargaEncontrada = await cargaRepository.buscar(
                carga.getID()
            );

            expect(cargaEncontrada).not.toBeNull();

            // 8. Verificar se a inspeção foi recuperada
            const inspecoes = cargaEncontrada!.getInspecoes();

            expect(inspecoes).toHaveLength(1);

            expect(inspecoes[0].getID()).toBe(
                inspecao.getID()
            );

            expect(inspecoes[0].getResponsavelId()).toBe(
                "fiscal-teste-001"
            );

            expect(inspecoes[0].getResultado()).toBe(
                "Aprovada"
            );

            expect(inspecoes[0].getObservacao()).toBe(
                "Inspeção aprovada no teste de integração"
            );

        } finally {

            // 9. Garantir novamente que estamos no banco de testes
            garantirBancoDeTeste();

            // 10. Excluir a inspeção criada pelo teste
            await prisma.inspecao.deleteMany({
                where: {
                    cargaId: carga.getID()
                }
            });

            // 11. Excluir a carga criada pelo teste
            await prisma.cargaQuimica.deleteMany({
                where: {
                    id: carga.getID()
                }
            });
        }
    });


    it("deve recuperar os documentos associados a uma carga", async () => {

        garantirBancoDeTeste();

        // Confirmar a conexão real antes de gravar dados
        const resultado = await prisma.$queryRaw<
            Array<{ nome: string }>
        >`SELECT current_database() AS nome`;

        expect(resultado[0]?.nome).toBe("quimiport_test");

        const cargaRepository = new PrismaCargaQuimicaRepository();
        const documentoRepository = new PrismaDocumentoRepository();

        const carga = new CargaQuimica();

        const documento = new Documento({
            tipo: "Licença Ambiental",
            numero: "LA-TESTE-001",
            dataEmissao: new Date("2026-01-10"),
            dataValidade: new Date("2027-01-10")
        });

        try {
            // 1. Salvar a carga
            await cargaRepository.salvar(carga);

            // 2. Salvar o documento associado
            await documentoRepository.salvar(
                carga.getID(),
                documento
            );

            // 3. Recuperar a carga do PostgreSQL
            const cargaEncontrada = await cargaRepository.buscar(
                carga.getID()
            );

            expect(cargaEncontrada).not.toBeNull();

            // 4. Verificar se o documento foi recuperado
            const documentos = cargaEncontrada!.getDocumentos();

            expect(documentos).toHaveLength(1);

            expect(documentos[0].getID()).toBe(
                documento.getID()
            );

            expect(documentos[0].getTipo()).toBe(
                "Licença Ambiental"
            );

            expect(documentos[0].getNumero()).toBe(
                "LA-TESTE-001"
            );

        } finally {

            garantirBancoDeTeste();

            // Remover primeiro os documentos relacionados
            await prisma.documento.deleteMany({
                where: {
                    cargaQuimicaId: carga.getID()
                }
            });

            // Remover a carga criada pelo teste
            await prisma.cargaQuimica.deleteMany({
                where: {
                    id: carga.getID()
                }
            });
        }
    });

    it("deve salvar e recuperar uma carga química no PostgreSQL", async () => {

        // 1. Confirmar que estamos no banco de testes
        garantirBancoDeTeste();

        const resultado = await prisma.$queryRaw<
            Array<{ nome: string }>
        >`SELECT current_database() AS nome`;

        expect(resultado[0]?.nome).toBe("quimiport_test");

        // 2. Criar a entidade
        const carga = new CargaQuimica();

        const repository = new PrismaCargaQuimicaRepository();

        try {
            // 3. Salvar no PostgreSQL
            await repository.salvar(carga);

            // 4. Buscar pelo ID
            const cargaEncontrada = await repository.buscar(
                carga.getID()
            );

            // 5. Validar os dados recuperados
            expect(cargaEncontrada).not.toBeNull();

            expect(cargaEncontrada?.getID()).toBe(
                carga.getID()
            );

            expect(cargaEncontrada?.getStatus()).toBe(
                carga.getStatus()
            );

            expect(cargaEncontrada?.getCriadoEm().getTime()).toBe(
                carga.getCriadoEm().getTime()
            );

        } finally {

            // 6. Remover apenas a carga criada pelo teste
            garantirBancoDeTeste();

            await prisma.cargaQuimica.deleteMany({
                where: {
                    id: carga.getID()
                }
            });
        }
    });
});
