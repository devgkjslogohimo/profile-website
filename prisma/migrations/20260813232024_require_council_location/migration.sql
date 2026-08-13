/*
  Warnings:

  - Made the column `churchLocationId` on table `ChurchCouncilMember` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ChurchCouncilMember" ALTER COLUMN "churchLocationId" SET NOT NULL;
