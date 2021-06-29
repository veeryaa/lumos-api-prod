-- CreateTable
CREATE TABLE "Employee" (
    "employee_id" VARCHAR(10) NOT NULL,
    "nama" VARCHAR(32) NOT NULL,
    "tanggal_lahir" DATE NOT NULL,
    "email" VARCHAR(32) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" VARCHAR(10) NOT NULL,

    PRIMARY KEY ("employee_id")
);

-- CreateTable
CREATE TABLE "Product" (
    "product_id" VARCHAR(10) NOT NULL,
    "nama_produk" VARCHAR(32) NOT NULL,
    "kategori" VARCHAR(16) NOT NULL,
    "deskripsi" VARCHAR(255) NOT NULL,

    PRIMARY KEY ("product_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Employee.email_unique" ON "Employee"("email");
