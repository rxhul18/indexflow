-- DropIndex
DROP INDEX "anonProfile_name_key";

-- AlterTable
ALTER TABLE "anonProfile" ADD COLUMN     "dc_name" TEXT,
ADD COLUMN     "dc_pfp" TEXT,
ALTER COLUMN "pfp" SET DEFAULT 'https://avatar.vercel.sh/jill';
