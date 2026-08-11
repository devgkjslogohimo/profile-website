-- CreateTable
CREATE TABLE "ChurchForm" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "googleFormUrl" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChurchForm_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ChurchForm_sortOrder_idx" ON "ChurchForm"("sortOrder");

-- CreateIndex
CREATE INDEX "ChurchForm_isActive_idx" ON "ChurchForm"("isActive");
