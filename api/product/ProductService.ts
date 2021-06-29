import { Product } from '.prisma/client';
import * as fs from 'fs';
import {
  createProduct as RepoCreateProduct,
  findProductById as RepoFindProductById,
  readAllProduct as RepoReadAllProduct,
  readAllProductByKategori as RepoReadAllProductByKategori,
  updateProduct as RepoUpdateProduct,
} from './ProductRepo';

export interface ProductBody extends Body {
  product_id?: string;
  nama_produk?: string;
  deskripsi?: string;
  kategori?: string;
  harga?: number;
}

async function createProduct(body: ProductBody): Promise<[Product, boolean | string]> {
  const [result, status] = await RepoCreateProduct(body);

  return [result, status];
}

async function findProductById(params: string): Promise<[Product, boolean | string]> {
  const [result, status] = await RepoFindProductById(params);

  return [result, status];
}

async function readAllProduct(
  page: string
): Promise<[{ read: Product[]; count: number }, boolean | string]> {
  const [{ read, count }, status] = await RepoReadAllProduct(page);

  return [{ read, count }, status];
}

async function readAllProductByKategori(
  kategori: string,
  page: string
): Promise<[{ read: Product[]; count: number }, boolean | string]> {
  const [{ read, count }, status] = await RepoReadAllProductByKategori(kategori, page);

  return [{ read, count }, status];
}

async function updateProduct(
  params: string,
  body: ProductBody
): Promise<[Product, boolean | string]> {
  const [result, status] = await RepoUpdateProduct(params, body);

  return [result, status];
}

async function generateEnumProduct(
  page: string
): Promise<[{ read: Product[]; count: number }, boolean | string]> {
  const [{ read, count }, status] = await RepoReadAllProduct(page);

  const enumData = read.map((el) => {
    return `'${el.nama_produk}' = '${el.product_id}'`;
  });

  fs.writeFileSync(
    '/home/fadelfirmansyah/Documents/Lumos Final Project/lumos-api-ts/helper/product.ts',
    `export enum PRODUCT {
    ${enumData}\n
  }`
  );

  return [{ read, count }, status];
}

export {
  createProduct,
  findProductById,
  readAllProduct,
  updateProduct,
  readAllProductByKategori,
  generateEnumProduct,
};
