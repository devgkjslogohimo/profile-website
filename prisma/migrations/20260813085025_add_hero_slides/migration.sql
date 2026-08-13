-- CreateTable
CREATE TABLE "HeroSlide" (
    "id" TEXT NOT NULL,
    "slot" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "imageFileId" TEXT NOT NULL,
    "altText" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HeroSlide_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HeroSlide_slot_key" ON "HeroSlide"("slot");

-- CreateIndex
CREATE UNIQUE INDEX "HeroSlide_imageFileId_key" ON "HeroSlide"("imageFileId");

-- CreateIndex
CREATE INDEX "HeroSlide_isActive_slot_idx" ON "HeroSlide"("isActive", "slot");
