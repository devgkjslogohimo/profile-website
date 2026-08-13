-- AlterTable
ALTER TABLE "Announcement" ADD COLUMN     "displayUntil" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Announcement_status_displayUntil_publishedAt_idx" ON "Announcement"("status", "displayUntil", "publishedAt");
