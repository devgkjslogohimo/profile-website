/*
  Warnings:

  - You are about to drop the column `churchCouncilPeriodId` on the `ChurchCouncilMember` table. All the data in the column will be lost.
  - You are about to drop the `ChurchCouncilPeriod` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `periodStart` to the `ChurchCouncilMember` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ChurchCouncilMember" DROP CONSTRAINT "ChurchCouncilMember_churchCouncilPeriodId_fkey";

-- DropIndex
DROP INDEX "ChurchCouncilMember_churchCouncilPeriodId_sortOrder_idx";

-- AlterTable
ALTER TABLE "ChurchCouncilMember" DROP COLUMN "churchCouncilPeriodId",
ADD COLUMN     "periodEnd" DATE,
ADD COLUMN     "periodStart" DATE NOT NULL;

-- DropTable
DROP TABLE "ChurchCouncilPeriod";

-- CreateIndex
CREATE INDEX "ChurchCouncilMember_sortOrder_idx" ON "ChurchCouncilMember"("sortOrder");

-- CreateIndex
CREATE INDEX "ChurchCouncilMember_periodStart_idx" ON "ChurchCouncilMember"("periodStart");

-- CreateIndex
CREATE INDEX "ChurchCouncilMember_periodEnd_idx" ON "ChurchCouncilMember"("periodEnd");
