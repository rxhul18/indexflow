-- AlterTable
ALTER TABLE "user" ADD COLUMN     "active" TIMESTAMP(3),
ADD COLUMN     "location" TEXT,
ADD COLUMN     "recentTags" TEXT[],
ADD COLUMN     "reputation" TEXT,
ALTER COLUMN "role" DROP NOT NULL;
