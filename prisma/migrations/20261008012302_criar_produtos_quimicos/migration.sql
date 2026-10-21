-- CreateTable
CREATE TABLE "produtos_quimicos" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "numeroONU" TEXT NOT NULL,
    "classeRisco" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "produtos_quimicos_pkey" PRIMARY KEY ("id")
);
