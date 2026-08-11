/*
  Warnings:

  - You are about to drop the column `position` on the `ChurchPastor` table. All the data in the column will be lost.
  - You are about to drop the column `sortOrder` on the `ChurchPastor` table. All the data in the column will be lost.
  - Added the required column `periodStart` to the `ChurchPastor` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ChurchPastor_sortOrder_idx";

-- AlterTable
ALTER TABLE "ChurchPastor" DROP COLUMN "position",
DROP COLUMN "sortOrder",
ADD COLUMN     "periodEnd" DATE,
ADD COLUMN     "periodStart" DATE NOT NULL;

-- CreateIndex
CREATE INDEX "ChurchPastor_periodStart_idx" ON "ChurchPastor"("periodStart");

-- CreateIndex
CREATE INDEX "ChurchPastor_periodEnd_idx" ON "ChurchPastor"("periodEnd");
