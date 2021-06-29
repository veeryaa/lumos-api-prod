-- CreateTable
CREATE TABLE "CouponOwner" (
    "id" SERIAL NOT NULL,
    "coupon_id" VARCHAR(8) NOT NULL,
    "customer_id" VARCHAR(16) NOT NULL,
    "isUsed" BOOLEAN NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CouponOwner" ADD FOREIGN KEY ("coupon_id") REFERENCES "Coupon"("coupon_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CouponOwner" ADD FOREIGN KEY ("customer_id") REFERENCES "Customer"("customer_id") ON DELETE CASCADE ON UPDATE CASCADE;
