-- CreateTable
CREATE TABLE "inspecoes" (
    "id" TEXT NOT NULL,
    "cargaId" TEXT NOT NULL,
    "responsavelId" TEXT NOT NULL,
    "resultado" TEXT NOT NULL,
    "observacao" TEXT NOT NULL,
    "dataInspecao" TIMESTAMP(3) NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inspecoes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "inspecoes" ADD CONSTRAINT "inspecoes_cargaId_fkey" FOREIGN KEY ("cargaId") REFERENCES "cargas_quimicas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
