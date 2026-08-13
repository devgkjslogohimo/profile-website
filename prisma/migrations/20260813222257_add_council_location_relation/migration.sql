-- AlterTable
ALTER TABLE "ChurchCouncilMember" ADD COLUMN     "churchLocationId" TEXT;

-- CreateIndex
CREATE INDEX "ChurchCouncilMember_churchLocationId_idx" ON "ChurchCouncilMember"("churchLocationId");

-- CreateIndex
CREATE INDEX "ChurchCouncilMember_churchLocationId_sortOrder_idx" ON "ChurchCouncilMember"("churchLocationId", "sortOrder");

-- AddForeignKey
ALTER TABLE "ChurchCouncilMember" ADD CONSTRAINT "ChurchCouncilMember_churchLocationId_fkey" FOREIGN KEY ("churchLocationId") REFERENCES "ChurchLocation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
