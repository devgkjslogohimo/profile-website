-- CreateEnum
CREATE TYPE "ChurchLocationType" AS ENUM ('CHURCH', 'PEPANTHAN');

-- CreateTable
CREATE TABLE "ChurchLocation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" "ChurchLocationType" NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChurchLocation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChurchLocation_slug_key" ON "ChurchLocation"("slug");

-- CreateIndex
CREATE INDEX "ChurchLocation_type_idx" ON "ChurchLocation"("type");

-- CreateIndex
CREATE INDEX "ChurchLocation_isActive_sortOrder_idx" ON "ChurchLocation"("isActive", "sortOrder");
