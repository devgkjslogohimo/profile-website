-- CreateEnum
CREATE TYPE "WorshipLanguage" AS ENUM ('JAVANESE', 'INDONESIAN');

-- AlterTable
ALTER TABLE "WorshipService" ADD COLUMN     "languageOverride" "WorshipLanguage";
