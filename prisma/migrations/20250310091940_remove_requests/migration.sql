/*
  Warnings:

  - You are about to drop the `help_requests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `request_applications` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "dev_reviews" DROP CONSTRAINT "dev_reviews_request_id_fkey";

-- DropForeignKey
ALTER TABLE "help_requests" DROP CONSTRAINT "help_requests_user_id_fkey";

-- DropForeignKey
ALTER TABLE "help_requests" DROP CONSTRAINT "help_requests_vibecoder_id_fkey";

-- DropForeignKey
ALTER TABLE "request_applications" DROP CONSTRAINT "request_applications_developer_id_fkey";

-- DropForeignKey
ALTER TABLE "request_applications" DROP CONSTRAINT "request_applications_request_id_fkey";

-- DropTable
DROP TABLE "help_requests";

-- DropTable
DROP TABLE "request_applications";
