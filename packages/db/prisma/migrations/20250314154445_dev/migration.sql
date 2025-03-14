/*
  Warnings:

  - You are about to drop the column `isConfigured` on the `Server` table. All the data in the column will be lost.
  - Added the required column `is_config` to the `Server` table without a default value. This is not possible if the table is not empty.
  - Made the column `invite_url` on table `Server` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Server" DROP CONSTRAINT "Server_owner_id_fkey";

-- AlterTable
ALTER TABLE "Server" DROP COLUMN "isConfigured",
ADD COLUMN     "is_config" BOOLEAN NOT NULL,
ADD COLUMN     "userId" TEXT,
ALTER COLUMN "config_id" DROP NOT NULL,
ALTER COLUMN "invite_url" SET NOT NULL;

-- CreateTable
CREATE TABLE "AnonProfile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "pfp" TEXT,
    "uid" TEXT,
    "dc_uid" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnonProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IndexedQns" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "ans_id" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "tldr" TEXT,
    "is_anon" BOOLEAN NOT NULL DEFAULT false,
    "is_nsfw" BOOLEAN NOT NULL DEFAULT false,
    "server_id" TEXT NOT NULL,
    "thread_id" TEXT NOT NULL,
    "thread_mems" TEXT[],
    "msg_url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IndexedQns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IndexedAns" (
    "id" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "qns_id" TEXT NOT NULL,
    "tldr" TEXT,
    "server_id" TEXT NOT NULL,
    "thread_id" TEXT NOT NULL,
    "msg_url" TEXT NOT NULL,
    "is_anon" BOOLEAN NOT NULL DEFAULT false,
    "is_nsfw" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IndexedAns_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AnonProfile_name_key" ON "AnonProfile"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AnonProfile_uid_key" ON "AnonProfile"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "AnonProfile_dc_uid_key" ON "AnonProfile"("dc_uid");

-- CreateIndex
CREATE UNIQUE INDEX "IndexedQns_ans_id_key" ON "IndexedQns"("ans_id");

-- CreateIndex
CREATE UNIQUE INDEX "IndexedAns_qns_id_key" ON "IndexedAns"("qns_id");

-- AddForeignKey
ALTER TABLE "Server" ADD CONSTRAINT "Server_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
