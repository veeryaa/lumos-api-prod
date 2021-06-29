-- CreateTable
CREATE TABLE "Coupon" (
    "coupon_id" VARCHAR(8) NOT NULL,
    "nama_kupon" VARCHAR(32) NOT NULL,
    "product_id" VARCHAR(10) NOT NULL,
    "diskon" INTEGER NOT NULL,
    "tgl_mulai" DATE NOT NULL,
    "tgl_berakhir" DATE NOT NULL,

    PRIMARY KEY ("coupon_id")
);

-- AddForeignKey
ALTER TABLE "Coupon" ADD FOREIGN KEY ("product_id") REFERENCES "Product"("product_id") ON DELETE CASCADE ON UPDATE CASCADE;
