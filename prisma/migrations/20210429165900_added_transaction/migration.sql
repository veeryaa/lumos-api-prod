-- CreateTable
CREATE TABLE "Transaction" (
    "trx_id" VARCHAR(32) NOT NULL,
    "tgl_transaksi" DATE NOT NULL,
    "point" INTEGER NOT NULL,
    "nilai_transaksi" INTEGER NOT NULL,
    "customer_id" VARCHAR(16) NOT NULL,
    "employee_id" VARCHAR(16) NOT NULL,

    PRIMARY KEY ("trx_id")
);

-- CreateTable
CREATE TABLE "TransactionDetail" (
    "id" SERIAL NOT NULL,
    "trx_id" VARCHAR(32) NOT NULL,
    "product_id" VARCHAR(10) NOT NULL,
    "kuantiti" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Transaction" ADD FOREIGN KEY ("customer_id") REFERENCES "Customer"("customer_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD FOREIGN KEY ("employee_id") REFERENCES "Employee"("employee_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionDetail" ADD FOREIGN KEY ("trx_id") REFERENCES "Transaction"("trx_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionDetail" ADD FOREIGN KEY ("product_id") REFERENCES "Product"("product_id") ON DELETE CASCADE ON UPDATE CASCADE;
