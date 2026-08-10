-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateTable
CREATE TABLE "BibleStudySchedule" (
    "id" TEXT NOT NULL,
    "groupName" TEXT NOT NULL,
    "dayOfWeek" "DayOfWeek" NOT NULL,
    "startTime" TEXT NOT NULL,
    "location" TEXT,
    "leaderName" TEXT,
    "notes" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BibleStudySchedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BibleStudySchedule_dayOfWeek_sortOrder_idx" ON "BibleStudySchedule"("dayOfWeek", "sortOrder");

-- CreateIndex
CREATE INDEX "BibleStudySchedule_isActive_idx" ON "BibleStudySchedule"("isActive");
