/*
  Warnings:

  - A unique constraint covering the columns `[albumId,imageUrl]` on the table `GalleryImage` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "GalleryImage_albumId_imageUrl_key" ON "GalleryImage"("albumId", "imageUrl");
