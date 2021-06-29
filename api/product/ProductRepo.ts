import { Product, PrismaClient, Prisma  } from '.prisma/client';
import { ProductBody } from './ProductService';

const prisma = new PrismaClient({ rejectOnNotFound: true });

async function createProduct(body: ProductBody): Promise<[Product, boolean | string]> {
  try {
    const { product_id, nama_produk, deskripsi, kategori, harga } = body;

    const product: Prisma.ProductCreateInput = {
      product_id,
      nama_produk,
      deskripsi,
      kategori,
      harga: Number(harga),
    };

    const insert = await prisma.product.create({
      data: product,
    });

    return [insert, true];
  } catch (err) {
    console.error(err);
    return [err, 'Error'];
  }
}

async function findProductById(params: string): Promise<[Product, boolean | string]> {
  try {
    const read: Product = await prisma.product.findUnique({
      where: {
        product_id: params,
      },
    });

    return [read, true];
  } catch (err) {
    return [err, 'Error'];
  }
}

async function readAllProduct(
  page: string
): Promise<[{ read: Product[]; count: number }, boolean | string]> {
  try {
    const readCount = await prisma.product.count();

    if (Number(page) > 0) {
      const read: Product[] = await prisma.product.findMany({
        skip: Number(page) * 10 - 10,
        take: 10,
      });

      return [{ read, count: readCount }, true];
    } else {
      const read: Product[] = await prisma.product.findMany();

      return [{ read, count: readCount }, true];
    }
  } catch (err) {
    return [err, 'Error'];
  }
}

async function readAllProductByKategori(
  kategori: string,
  page: string
): Promise<[{ read: Product[]; count: number }, boolean | string]> {
  try {
    const readCount = await prisma.product.count({ where: { kategori } });

    if (Number(page) > 0) {
      const read: Product[] = await prisma.product.findMany({
        where: {
          kategori,
        },
        skip: Number(page) * 10 - 10,
        take: 10,
      });

      return [{ read, count: readCount }, true];
    } else {
      const read: Product[] = await prisma.product.findMany({ where: { kategori } });

      return [{ read, count: readCount }, true];
    }
  } catch (err) {
    return [err, 'Error'];
  }
}

async function updateProduct(
  params: string,
  body: ProductBody
): Promise<[Product, boolean | string]> {
  try {
    const { nama_produk, deskripsi, kategori, harga } = body;

    const product: Prisma.ProductUpdateInput = {
      nama_produk,
      deskripsi,
      kategori,
      harga: Number(harga),
    };

    const update = await prisma.product.update({
      where: {
        product_id: params,
      },
      data: product,
    });

    return [update, true];
  } catch (err) {
    console.error(err);
    return [err, 'Error'];
  }
}

export { createProduct, findProductById, readAllProduct, updateProduct, readAllProductByKategori };
