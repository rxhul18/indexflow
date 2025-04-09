/*
  Warnings:

  - The `thread_mems` column on the `indexedQns` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "indexedQns" DROP COLUMN "thread_mems",
ADD COLUMN     "thread_mems" INTEGER;
