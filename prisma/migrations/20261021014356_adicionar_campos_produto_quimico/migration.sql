-- AlterTable
ALTER TABLE "produtos_quimicos" ADD COLUMN     "descricao" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "grupoCompatibilidade" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'ATIVO';
