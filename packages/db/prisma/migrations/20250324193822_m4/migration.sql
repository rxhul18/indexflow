-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL,
    "image" TEXT,
    "role" TEXT DEFAULT 'user',
    "location" TEXT,
    "active" TIMESTAMP(3),
    "reputation" TEXT,
    "recentTags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "server" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "is_config" BOOLEAN NOT NULL DEFAULT false,
    "config_id" TEXT,
    "logo" TEXT,
    "invite_url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "server_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configs" (
    "id" TEXT NOT NULL,
    "server_id" TEXT NOT NULL,
    "qna_channels" TEXT[],
    "qna_channel_webhooks" TEXT[],
    "qna_endpoint" TEXT,
    "mod_role" TEXT,
    "log_channel" TEXT,
    "log_channel_webhook" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anonProfile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "pfp" TEXT,
    "uid" TEXT,
    "dc_uid" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "anonProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "indexedQns" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "ans_id" TEXT,
    "author" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "tldr" TEXT,
    "is_anon" BOOLEAN NOT NULL DEFAULT false,
    "is_nsfw" BOOLEAN NOT NULL DEFAULT false,
    "server_id" TEXT NOT NULL,
    "thread_id" TEXT NOT NULL,
    "thread_mems" TEXT[],
    "msg_url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "indexedQns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "indexedAns" (
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
    "is_correct" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "indexedAns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usedAt" TIMESTAMP(3),
    "posts" TEXT[],
    "usages" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "server_id_key" ON "server"("id");

-- CreateIndex
CREATE UNIQUE INDEX "configs_server_id_key" ON "configs"("server_id");

-- CreateIndex
CREATE UNIQUE INDEX "configs_id_key" ON "configs"("id");

-- CreateIndex
CREATE UNIQUE INDEX "anonProfile_name_key" ON "anonProfile"("name");

-- CreateIndex
CREATE UNIQUE INDEX "anonProfile_uid_key" ON "anonProfile"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "anonProfile_dc_uid_key" ON "anonProfile"("dc_uid");

-- CreateIndex
CREATE UNIQUE INDEX "anonProfile_id_key" ON "anonProfile"("id");

-- CreateIndex
CREATE UNIQUE INDEX "indexedQns_ans_id_key" ON "indexedQns"("ans_id");

-- CreateIndex
CREATE UNIQUE INDEX "indexedQns_id_key" ON "indexedQns"("id");

-- CreateIndex
CREATE UNIQUE INDEX "indexedAns_id_key" ON "indexedAns"("id");

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tags_id_key" ON "tags"("id");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configs" ADD CONSTRAINT "configs_server_id_fkey" FOREIGN KEY ("server_id") REFERENCES "server"("id") ON DELETE CASCADE ON UPDATE CASCADE;
