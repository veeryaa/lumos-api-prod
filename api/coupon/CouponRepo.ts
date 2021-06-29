import { Coupon } from '.prisma/client';
import { PrismaClient, Prisma } from '.prisma/client';
import { CouponBody } from './CouponService';

const prisma = new PrismaClient({ rejectOnNotFound: true });

async function createCoupon(body: CouponBody): Promise<[Coupon, string | boolean]> {
  try {
    const { coupon_id, nama_kupon, product_id, diskon, tgl_mulai, tgl_berakhir } = body;

    const coupon: Prisma.CouponCreateInput = {
      coupon_id,
      nama_kupon,
      diskon: Number(diskon),
      tgl_mulai: new Date(tgl_mulai),
      tgl_berakhir: new Date(tgl_berakhir),
      product: {
        connect: {
          product_id
        },
      },
    };

    const insert = await prisma.coupon.create({
      data: coupon,
    });
    return [insert, true];
  } catch (err) {
    return [err, 'Error'];
  }
}

async function findCouponById(params: string): Promise<[Coupon, string | boolean]> {
  try {
    const read: Coupon = await prisma.coupon.findUnique({
      where: {
        coupon_id: params,
      },
      include: {
        product: {
          select: {
            nama_produk: true
          }
        }
      }
    });

    return [read, true];
  } catch (err) {
    return [err, 'Error'];
  }
}

async function readAllCoupon(): Promise<[Coupon[], string | boolean]> {
  try {
    const read: Coupon[] = await prisma.coupon.findMany({
      include: {
        product: {
          select: {
            nama_produk: true
          }
        }
      }
    });

    return [read, true];
  } catch (err) {
    return [err, 'Error'];
  }
}

async function updateCoupon(params: string, body: CouponBody): Promise<[Coupon, string | boolean]> {
  try {
    const { nama_kupon, product_id, diskon, tgl_mulai, tgl_berakhir } = body;
    console.log(params)
    const coupon: Prisma.CouponUpdateInput = {
      nama_kupon,
      diskon: Number(diskon),
      tgl_mulai: new Date(tgl_mulai),
      tgl_berakhir: new Date(tgl_berakhir),
      product: {
        connect: {
          product_id,
        },
      },
    };

    const update = await prisma.coupon.update({
      where: {
        coupon_id: params,
      },
      data: coupon,
    });

    return [update, true];
  } catch (err) {
    return [err, 'Error'];
  }
}

export { createCoupon, findCouponById, readAllCoupon, updateCoupon };
