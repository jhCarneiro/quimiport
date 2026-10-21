-- CreateTable
CREATE TABLE "cargas_quimicas" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDENTE_DOCUMENTACAO',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cargas_quimicas_pkey" PRIMARY KEY ("id")
);
