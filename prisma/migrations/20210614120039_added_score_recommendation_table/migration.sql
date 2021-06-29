/*
  Warnings:

  - Added the required column `support` to the `Recommendation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `confidence` to the `Recommendation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lift_ratio` to the `Recommendation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `conviction` to the `Recommendation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Recommendation" ADD COLUMN     "support" REAL NOT NULL,
ADD COLUMN     "confidence" REAL NOT NULL,
ADD COLUMN     "lift_ratio" REAL NOT NULL,
ADD COLUMN     "conviction" REAL NOT NULL;
