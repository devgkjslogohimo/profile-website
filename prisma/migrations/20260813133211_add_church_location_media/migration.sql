-- AlterTable
ALTER TABLE "ChurchLocation" ADD COLUMN     "coverAltText" TEXT,
ADD COLUMN     "coverImageFileId" TEXT,
ADD COLUMN     "coverImageUrl" TEXT;

-- CreateTable
CREATE TABLE "ChurchLocationImage" (
    "id" TEXT NOT NULL,
    "churchLocationId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "imageFileId" TEXT NOT NULL,
    "caption" TEXT,
    "altText" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChurchLocationImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ChurchLocationImage_churchLocationId_sortOrder_idx" ON "ChurchLocationImage"("churchLocationId", "sortOrder");

-- CreateIndex
CREATE INDEX "ChurchLocationImage_churchLocationId_isActive_sortOrder_idx" ON "ChurchLocationImage"("churchLocationId", "isActive", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "ChurchLocationImage_churchLocationId_imageFileId_key" ON "ChurchLocationImage"("churchLocationId", "imageFileId");

-- AddForeignKey
ALTER TABLE "ChurchLocationImage" ADD CONSTRAINT "ChurchLocationImage_churchLocationId_fkey" FOREIGN KEY ("churchLocationId") REFERENCES "ChurchLocation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
