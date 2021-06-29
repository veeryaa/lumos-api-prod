/*
  Warnings:

  - A unique constraint covering the columns `[handphone]` on the table `CustomerAccount` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CustomerAccount.handphone_unique" ON "CustomerAccount"("handphone");
