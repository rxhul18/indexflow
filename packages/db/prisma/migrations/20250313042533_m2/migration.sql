-- AlterTable
ALTER TABLE "user" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'user';

-- CreateTable
CREATE TABLE "Server" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "isConfigured" BOOLEAN NOT NULL,
    "config_id" TEXT NOT NULL,
    "logo" TEXT,
    "invite_url" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Server_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Configs" (
    "id" TEXT NOT NULL,
    "server_id" TEXT NOT NULL,
    "qna_channels" TEXT[],
    "qna_channel_webhooks" TEXT[],
    "qna_endpoint" TEXT,
    "mod_role" TEXT,
    "log_channel" TEXT,
    "log_channel_webhook" TEXT,

    CONSTRAINT "Configs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Server_id_key" ON "Server"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Configs_server_id_key" ON "Configs"("server_id");

-- AddForeignKey
ALTER TABLE "Server" ADD CONSTRAINT "Server_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Configs" ADD CONSTRAINT "Configs_server_id_fkey" FOREIGN KEY ("server_id") REFERENCES "Server"("id") ON DELETE CASCADE ON UPDATE CASCADE;
