-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'VIBECODER');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "RequestUrgency" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "ExperienceLevel" AS ENUM ('INTERMEDIATE', 'SENIOR', 'LEAD', 'ARCHITECT', 'DISTINGUISHED');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "image_url" TEXT,
    "theme" TEXT DEFAULT 'light',
    "language" TEXT DEFAULT 'en',
    "country" TEXT,
    "timezone" TEXT,
    "email_notifications" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dev_profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "experience_level" "ExperienceLevel" NOT NULL,
    "years_of_experience" INTEGER NOT NULL,
    "bio" TEXT NOT NULL,
    "timezone" TEXT,
    "hourly_rate" DECIMAL(10,2),
    "github_url" TEXT,
    "linkedin_url" TEXT,
    "portfolio_url" TEXT,
    "skills" TEXT[],
    "ai_tools_experience" JSONB[],
    "specializations" TEXT[],
    "languages" TEXT[],
    "availability" JSONB NOT NULL,
    "certifications" JSONB[],
    "company" TEXT,
    "average_rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_reviews" INTEGER NOT NULL DEFAULT 0,
    "total_sessions" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dev_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dev_reviews" (
    "id" TEXT NOT NULL,
    "reviewer_id" TEXT NOT NULL,
    "developer_id" TEXT NOT NULL,
    "request_id" TEXT NOT NULL,
    "rating" SMALLINT NOT NULL,
    "comment" TEXT,
    "expertise" SMALLINT NOT NULL,
    "communication" SMALLINT NOT NULL,
    "helpfulness" SMALLINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dev_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "help_requests" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "vibecoder_id" TEXT,
    "title" TEXT NOT NULL,
    "tool" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "expected_outcome" TEXT NOT NULL,
    "urgency" "RequestUrgency" NOT NULL DEFAULT 'NORMAL',
    "screenshots" TEXT[],
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "help_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "request_applications" (
    "id" TEXT NOT NULL,
    "request_id" TEXT NOT NULL,
    "developer_id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "rate" DECIMAL(10,2),
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "request_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "request_id" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "receiver_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "dev_profiles_user_id_key" ON "dev_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "dev_reviews_reviewer_id_request_id_key" ON "dev_reviews"("reviewer_id", "request_id");

-- CreateIndex
CREATE UNIQUE INDEX "request_applications_request_id_developer_id_key" ON "request_applications"("request_id", "developer_id");

-- AddForeignKey
ALTER TABLE "dev_profiles" ADD CONSTRAINT "dev_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dev_reviews" ADD CONSTRAINT "dev_reviews_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dev_reviews" ADD CONSTRAINT "dev_reviews_developer_id_fkey" FOREIGN KEY ("developer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dev_reviews" ADD CONSTRAINT "dev_reviews_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "help_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "help_requests" ADD CONSTRAINT "help_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "help_requests" ADD CONSTRAINT "help_requests_vibecoder_id_fkey" FOREIGN KEY ("vibecoder_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_applications" ADD CONSTRAINT "request_applications_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "help_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_applications" ADD CONSTRAINT "request_applications_developer_id_fkey" FOREIGN KEY ("developer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "help_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
