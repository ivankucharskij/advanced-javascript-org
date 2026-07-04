/*
  Warnings:

  - You are about to drop the column `code` on the `Challenge` table. All the data in the column will be lost.
  - Added the required column `snippetId` to the `Challenge` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Challenge" DROP COLUMN "code",
ADD COLUMN     "snippetId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "ChallengeSnippet" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "topicSlug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChallengeSnippet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChallengeSnippet_slug_key" ON "ChallengeSnippet"("slug");

-- CreateIndex
CREATE INDEX "ChallengeSnippet_topicSlug_idx" ON "ChallengeSnippet"("topicSlug");

-- CreateIndex
CREATE INDEX "Challenge_snippetId_idx" ON "Challenge"("snippetId");

-- AddForeignKey
ALTER TABLE "Challenge" ADD CONSTRAINT "Challenge_snippetId_fkey" FOREIGN KEY ("snippetId") REFERENCES "ChallengeSnippet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
