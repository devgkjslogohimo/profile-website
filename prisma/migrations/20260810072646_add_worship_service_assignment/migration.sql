-- CreateTable
CREATE TABLE "WorshipServiceAssignment" (
    "id" TEXT NOT NULL,
    "worshipServiceId" TEXT NOT NULL,
    "worshipServiceRoleId" TEXT NOT NULL,
    "personName" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorshipServiceAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WorshipServiceAssignment_worshipServiceId_sortOrder_idx" ON "WorshipServiceAssignment"("worshipServiceId", "sortOrder");

-- CreateIndex
CREATE INDEX "WorshipServiceAssignment_worshipServiceRoleId_idx" ON "WorshipServiceAssignment"("worshipServiceRoleId");

-- AddForeignKey
ALTER TABLE "WorshipServiceAssignment" ADD CONSTRAINT "WorshipServiceAssignment_worshipServiceId_fkey" FOREIGN KEY ("worshipServiceId") REFERENCES "WorshipService"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorshipServiceAssignment" ADD CONSTRAINT "WorshipServiceAssignment_worshipServiceRoleId_fkey" FOREIGN KEY ("worshipServiceRoleId") REFERENCES "WorshipServiceRole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
