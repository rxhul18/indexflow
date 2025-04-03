/*
  Warnings:

  - You are about to drop the column `usedAt` on the `tags` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "indexedAns" ADD COLUMN     "down_votes" INTEGER DEFAULT 0,
ADD COLUMN     "up_votes" INTEGER DEFAULT 0;

-- AlterTable
ALTER TABLE "indexedQns" ADD COLUMN     "down_votes" INTEGER DEFAULT 0,
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "up_votes" INTEGER DEFAULT 0;

-- AlterTable
ALTER TABLE "tags" DROP COLUMN "usedAt";
