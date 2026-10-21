-- CreateTable
CREATE TABLE "itens_carga" (
    "id" TEXT NOT NULL,
    "quantidade" DOUBLE PRECISION NOT NULL,
    "unidade" TEXT NOT NULL,
    "cargaQuimicaId" TEXT NOT NULL,
    "produtoQuimicoId" TEXT NOT NULL,

    CONSTRAINT "itens_carga_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "itens_carga" ADD CONSTRAINT "itens_carga_cargaQuimicaId_fkey" FOREIGN KEY ("cargaQuimicaId") REFERENCES "cargas_quimicas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itens_carga" ADD CONSTRAINT "itens_carga_produtoQuimicoId_fkey" FOREIGN KEY ("produtoQuimicoId") REFERENCES "produtos_quimicos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
