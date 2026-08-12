ALTER TABLE "Pawartos"
ADD COLUMN "googleDriveFileId" TEXT;

UPDATE "Pawartos"
SET "googleDriveFileId" =
  substring("googleDriveUrl" from '/file/d/([^/?]+)');

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM "Pawartos"
    WHERE "googleDriveFileId" IS NULL
  ) THEN
    RAISE EXCEPTION 'Pawartos contains invalid Google Drive URL';
  END IF;

  IF EXISTS (
    SELECT "googleDriveFileId"
    FROM "Pawartos"
    GROUP BY "googleDriveFileId"
    HAVING COUNT(*) > 1
  ) THEN
    RAISE EXCEPTION 'Duplicate Google Drive file detected in Pawartos';
  END IF;
END
$$;

ALTER TABLE "Pawartos"
ALTER COLUMN "googleDriveFileId" SET NOT NULL;

CREATE UNIQUE INDEX "Pawartos_googleDriveFileId_key"
ON "Pawartos"("googleDriveFileId");