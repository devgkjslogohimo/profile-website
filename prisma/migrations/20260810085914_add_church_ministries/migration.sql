-- CreateTable
CREATE TABLE "ChurchMinistry" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT,
    "description" TEXT,
    "imageUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChurchMinistry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChurchMinistry_slug_key" ON "ChurchMinistry"("slug");

-- CreateIndex
CREATE INDEX "ChurchMinistry_sortOrder_idx" ON "ChurchMinistry"("sortOrder");

-- CreateIndex
CREATE INDEX "ChurchMinistry_isActive_idx" ON "ChurchMinistry"("isActive");
