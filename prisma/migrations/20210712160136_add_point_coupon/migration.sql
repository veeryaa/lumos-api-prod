/*
  Warnings:

  - Added the required column `point` to the `CouponOwner` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CouponOwner" ADD COLUMN     "point" INTEGER NOT NULL;
