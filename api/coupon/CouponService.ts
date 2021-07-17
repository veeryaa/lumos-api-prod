import { Coupon } from '.prisma/client';
import {
  createCoupon as RepoCreateCoupon,
  findCouponById as RepoFindCouponById,
  readAllCoupon as RepoReadAllCoupon,
  updateCoupon as RepoUpdateCoupon,
} from './CouponRepo';

export interface CouponBody extends Body {
  coupon_id?: string;
  nama_kupon?: string;
  product_id?: string;
  diskon?: number;
  point?: number;
  tgl_mulai?: string;
  tgl_berakhir?: string;
}  
   
async function createCoupon(body: CouponBody): Promise<[Coupon, string | boolean]> {
  const [result, status] = await RepoCreateCoupon(body);

  return [result, status];
}

async function findCouponById(params: string): Promise<[Coupon, string | boolean]> {
  const [result, status] = await RepoFindCouponById(params);

  return [result, status];
}
  
async function readAllCoupon(): Promise<[Coupon[], string | boolean]> {
  const [result, status] = await RepoReadAllCoupon();

  return [result, status];
}

async function updateCoupon(params: string, body: CouponBody): Promise<[Coupon, string | boolean]> {
  const [result, status] = await RepoUpdateCoupon(params, body);

  return [result, status];
}

export { createCoupon, findCouponById, readAllCoupon, updateCoupon };
