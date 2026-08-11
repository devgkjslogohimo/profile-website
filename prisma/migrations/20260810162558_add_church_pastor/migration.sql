-- CreateTable
CREATE TABLE "ChurchPastor" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "position" TEXT,
    "summary" TEXT,
    "biography" TEXT,
    "photoUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChurchPastor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChurchPastor_slug_key" ON "ChurchPastor"("slug");

-- CreateIndex
CREATE INDEX "ChurchPastor_sortOrder_idx" ON "ChurchPastor"("sortOrder");

-- CreateIndex
CREATE INDEX "ChurchPastor_isActive_idx" ON "ChurchPastor"("isActive");
