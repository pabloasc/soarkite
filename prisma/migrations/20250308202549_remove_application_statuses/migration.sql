/*
  Warnings:

  - The values [DISTINGUISHED] on the enum `ExperienceLevel` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `availability` on the `dev_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `help_requests` table. All the data in the column will be lost.
  - You are about to drop the column `urgency` on the `help_requests` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `request_applications` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ExperienceLevel_new" AS ENUM ('INTERMEDIATE', 'SENIOR', 'LEAD', 'ARCHITECT', 'DIRECTOR');
ALTER TABLE "dev_profiles" ALTER COLUMN "experience_level" TYPE "ExperienceLevel_new" USING ("experience_level"::text::"ExperienceLevel_new");
ALTER TYPE "ExperienceLevel" RENAME TO "ExperienceLevel_old";
ALTER TYPE "ExperienceLevel_new" RENAME TO "ExperienceLevel";
DROP TYPE "ExperienceLevel_old";
COMMIT;

-- AlterTable
ALTER TABLE "dev_profiles" DROP COLUMN "availability";

-- AlterTable
ALTER TABLE "help_requests" DROP COLUMN "status",
DROP COLUMN "urgency";

-- AlterTable
ALTER TABLE "request_applications" DROP COLUMN "status";

-- DropEnum
DROP TYPE "ApplicationStatus";

-- DropEnum
DROP TYPE "RequestStatus";
