-- CreateEnum
CREATE TYPE "PawartosStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateTable
CREATE TABLE "Pawartos" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "publicationDate" DATE NOT NULL,
    "description" TEXT,
    "googleDriveUrl" TEXT NOT NULL,
    "status" "PawartosStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pawartos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pawartos_slug_key" ON "Pawartos"("slug");

-- CreateIndex
CREATE INDEX "Pawartos_publicationDate_idx" ON "Pawartos"("publicationDate");

-- CreateIndex
CREATE INDEX "Pawartos_status_publicationDate_idx" ON "Pawartos"("status", "publicationDate");

-- CreateIndex
CREATE INDEX "Pawartos_authorId_idx" ON "Pawartos"("authorId");

-- AddForeignKey
ALTER TABLE "Pawartos" ADD CONSTRAINT "Pawartos_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
