-- AlterTable
ALTER TABLE "SitePage" ADD COLUMN     "navigationLabel" TEXT,
ADD COLUMN     "navigationOrder" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "showInNavigation" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "SitePage_showInNavigation_navigationOrder_idx" ON "SitePage"("showInNavigation", "navigationOrder");
