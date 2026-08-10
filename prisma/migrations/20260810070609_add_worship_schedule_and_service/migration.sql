-- CreateTable
CREATE TABLE "WorshipSchedule" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorshipSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorshipService" (
    "id" TEXT NOT NULL,
    "worshipScheduleId" TEXT NOT NULL,
    "churchLocationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorshipService_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WorshipSchedule_date_key" ON "WorshipSchedule"("date");

-- CreateIndex
CREATE INDEX "WorshipService_worshipScheduleId_sortOrder_idx" ON "WorshipService"("worshipScheduleId", "sortOrder");

-- CreateIndex
CREATE INDEX "WorshipService_churchLocationId_idx" ON "WorshipService"("churchLocationId");

-- CreateIndex
CREATE INDEX "WorshipService_startsAt_idx" ON "WorshipService"("startsAt");

-- CreateIndex
CREATE UNIQUE INDEX "WorshipService_worshipScheduleId_churchLocationId_startsAt_key" ON "WorshipService"("worshipScheduleId", "churchLocationId", "startsAt");

-- AddForeignKey
ALTER TABLE "WorshipService" ADD CONSTRAINT "WorshipService_worshipScheduleId_fkey" FOREIGN KEY ("worshipScheduleId") REFERENCES "WorshipSchedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorshipService" ADD CONSTRAINT "WorshipService_churchLocationId_fkey" FOREIGN KEY ("churchLocationId") REFERENCES "ChurchLocation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
