/*
  Warnings:

  - The primary key for the `Employee` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_pkey",
ALTER COLUMN "employee_id" SET DATA TYPE VARCHAR(16),
ADD PRIMARY KEY ("employee_id");

-- CreateTable
CREATE TABLE "Customer" (
    "customer_id" VARCHAR(16) NOT NULL,
    "nama" VARCHAR(32) NOT NULL,
    "kota" VARCHAR(24) NOT NULL,
    "email" VARCHAR(64) NOT NULL,
    "tanggal_lahir" DATE NOT NULL,
    "point" INTEGER NOT NULL,
    "membership_id" VARCHAR(10) NOT NULL,

    PRIMARY KEY ("customer_id")
);

-- CreateTable
CREATE TABLE "CustomerAccount" (
    "id" SERIAL NOT NULL,
    "customer_id" VARCHAR(16) NOT NULL,
    "handphone" VARCHAR(13) NOT NULL,
    "password" VARCHAR(255) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CustomerAccount.customer_id_unique" ON "CustomerAccount"("customer_id");

-- AddForeignKey
ALTER TABLE "Customer" ADD FOREIGN KEY ("membership_id") REFERENCES "Membership"("membership_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerAccount" ADD FOREIGN KEY ("customer_id") REFERENCES "Customer"("customer_id") ON DELETE CASCADE ON UPDATE CASCADE;
