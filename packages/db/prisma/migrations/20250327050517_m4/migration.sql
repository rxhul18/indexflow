/*
  Warnings:

  - You are about to drop the column `qna_channel_webhooks` on the `configs` table. All the data in the column will be lost.
  - You are about to drop the column `qna_channels` on the `configs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "configs" DROP COLUMN "qna_channel_webhooks",
DROP COLUMN "qna_channels",
ADD COLUMN     "qna_channel" TEXT,
ADD COLUMN     "qna_channel_webhook" TEXT;
