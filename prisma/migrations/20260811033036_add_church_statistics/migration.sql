-- CreateTable
CREATE TABLE "ChurchStatisticSnapshot" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "asOfDate" DATE NOT NULL,
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChurchStatisticSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChurchStatisticMetric" (
    "id" TEXT NOT NULL,
    "snapshotId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "unit" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChurchStatisticMetric_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChurchStatisticSnapshot_asOfDate_key" ON "ChurchStatisticSnapshot"("asOfDate");

-- CreateIndex
CREATE INDEX "ChurchStatisticSnapshot_asOfDate_idx" ON "ChurchStatisticSnapshot"("asOfDate");

-- CreateIndex
CREATE INDEX "ChurchStatisticSnapshot_isActive_idx" ON "ChurchStatisticSnapshot"("isActive");

-- CreateIndex
CREATE INDEX "ChurchStatisticMetric_snapshotId_sortOrder_idx" ON "ChurchStatisticMetric"("snapshotId", "sortOrder");

-- CreateIndex
CREATE INDEX "ChurchStatisticMetric_isActive_idx" ON "ChurchStatisticMetric"("isActive");

-- AddForeignKey
ALTER TABLE "ChurchStatisticMetric" ADD CONSTRAINT "ChurchStatisticMetric_snapshotId_fkey" FOREIGN KEY ("snapshotId") REFERENCES "ChurchStatisticSnapshot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
