-- AlterTable
ALTER TABLE "server" ADD COLUMN     "description" TEXT,
ADD COLUMN     "members" INTEGER NOT NULL DEFAULT 0;
