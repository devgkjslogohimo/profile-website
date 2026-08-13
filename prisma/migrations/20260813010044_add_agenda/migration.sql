-- CreateEnum
CREATE TYPE "AgendaStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateTable
CREATE TABLE "Agenda" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3),
    "location" TEXT,
    "googleMapsUrl" TEXT,
    "coverImageUrl" TEXT,
    "coverImageFileId" TEXT,
    "status" "AgendaStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Agenda_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Agenda_slug_key" ON "Agenda"("slug");

-- CreateIndex
CREATE INDEX "Agenda_status_startsAt_idx" ON "Agenda"("status", "startsAt");

-- CreateIndex
CREATE INDEX "Agenda_startsAt_idx" ON "Agenda"("startsAt");

-- CreateIndex
CREATE INDEX "Agenda_authorId_idx" ON "Agenda"("authorId");

-- AddForeignKey
ALTER TABLE "Agenda" ADD CONSTRAINT "Agenda_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
