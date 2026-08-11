-- CreateTable
CREATE TABLE "ChurchCouncilPeriod" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "periodStart" DATE NOT NULL,
    "periodEnd" DATE NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChurchCouncilPeriod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChurchCouncilMember" (
    "id" TEXT NOT NULL,
    "churchCouncilPeriodId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "photoUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChurchCouncilMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ChurchCouncilPeriod_periodStart_periodEnd_idx" ON "ChurchCouncilPeriod"("periodStart", "periodEnd");

-- CreateIndex
CREATE INDEX "ChurchCouncilPeriod_isActive_idx" ON "ChurchCouncilPeriod"("isActive");

-- CreateIndex
CREATE INDEX "ChurchCouncilMember_churchCouncilPeriodId_sortOrder_idx" ON "ChurchCouncilMember"("churchCouncilPeriodId", "sortOrder");

-- CreateIndex
CREATE INDEX "ChurchCouncilMember_isActive_idx" ON "ChurchCouncilMember"("isActive");

-- AddForeignKey
ALTER TABLE "ChurchCouncilMember" ADD CONSTRAINT "ChurchCouncilMember_churchCouncilPeriodId_fkey" FOREIGN KEY ("churchCouncilPeriodId") REFERENCES "ChurchCouncilPeriod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
