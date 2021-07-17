/*
  Warnings:

  - You are about to drop the column `point` on the `CouponOwner` table. All the data in the column will be lost.
  - Added the required column `point` to the `Coupon` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Coupon" ADD COLUMN     "point" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "CouponOwner" DROP COLUMN "point";
