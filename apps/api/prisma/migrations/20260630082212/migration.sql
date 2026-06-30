/*
  Warnings:

  - You are about to drop the column `difficulty` on the `Challenge` table. All the data in the column will be lost.
  - You are about to drop the column `lastAnsweredAt` on the `ChallengeProgress` table. All the data in the column will be lost.
  - You are about to drop the column `nextReviewAt` on the `ChallengeProgress` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `ChallengeProgress` table. All the data in the column will be lost.
  - You are about to drop the column `wrongCount` on the `ChallengeProgress` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `GuestSession` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `ChallengeAttempt` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ChallengeAttempt" DROP CONSTRAINT "ChallengeAttempt_challengeId_fkey";

-- DropForeignKey
ALTER TABLE "ChallengeAttempt" DROP CONSTRAINT "ChallengeAttempt_guestSessionId_fkey";

-- DropForeignKey
ALTER TABLE "ChallengeAttempt" DROP CONSTRAINT "ChallengeAttempt_userId_fkey";

-- DropForeignKey
ALTER TABLE "GuestSession" DROP CONSTRAINT "GuestSession_userId_fkey";

-- DropIndex
DROP INDEX "Challenge_difficulty_idx";

-- DropIndex
DROP INDEX "ChallengeProgress_guestSessionId_nextReviewAt_idx";

-- DropIndex
DROP INDEX "ChallengeProgress_guestSessionId_status_idx";

-- DropIndex
DROP INDEX "ChallengeProgress_userId_nextReviewAt_idx";

-- DropIndex
DROP INDEX "ChallengeProgress_userId_status_idx";

-- DropIndex
DROP INDEX "GuestSession_userId_idx";

-- DropIndex
DROP INDEX "User_role_idx";

-- DropIndex
DROP INDEX "User_status_idx";

-- AlterTable
ALTER TABLE "Challenge" DROP COLUMN "difficulty";

-- AlterTable
ALTER TABLE "ChallengeProgress" DROP COLUMN "lastAnsweredAt",
DROP COLUMN "nextReviewAt",
DROP COLUMN "status",
DROP COLUMN "wrongCount",
ADD COLUMN     "answeredCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "needsReview" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "GuestSession" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "password",
DROP COLUMN "role",
DROP COLUMN "status";

-- DropTable
DROP TABLE "ChallengeAttempt";

-- DropEnum
DROP TYPE "ChallengeStatus";

-- DropEnum
DROP TYPE "UserRole";

-- DropEnum
DROP TYPE "UserStatus";

-- CreateIndex
CREATE INDEX "ChallengeProgress_userId_needsReview_idx" ON "ChallengeProgress"("userId", "needsReview");

-- CreateIndex
CREATE INDEX "ChallengeProgress_guestSessionId_needsReview_idx" ON "ChallengeProgress"("guestSessionId", "needsReview");
