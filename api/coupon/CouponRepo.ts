import { Coupon } from '.prisma/client';
import { PrismaClient, Prisma } from '.prisma/client';
import { CouponOwner, Customer } from '@prisma/client';
import { CouponBody } from './CouponService';

const prisma = new PrismaClient({ rejectOnNotFound: true });

async function createCoupon(
  body: CouponBody
): Promise<[Coupon, string | boolean]> {
  try {
    const {
      coupon_id,
      nama_kupon,
      product_id,
      diskon,
      point,
      tgl_mulai,
      tgl_berakhir,
    } = body;

    const coupon: Prisma.CouponCreateInput = {
      coupon_id,
      nama_kupon,
      diskon: Number(diskon),
      tgl_mulai: new Date(tgl_mulai),
      tgl_berakhir: new Date(tgl_berakhir),
      point: Number(point),
      product: {
        connect: {
          product_id,
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

type CouponOwnerBody = {
  coupon_id: string;
  customer_id: number;
};
  
async function claimCouponByCustomer(
  body: CouponOwnerBody
): Promise<[any, string | boolean]> {
  try {
    const { coupon_id, customer_id } = body;

    const customer = prisma.customer.findUnique({
      where: {
        customer_id: Number(customer_id),
      }
    });

    const coupon = prisma.coupon.findUnique({
      where: {
        coupon_id
      }
    });

    const [_customer, _coupon] = await prisma.$transaction([customer, coupon]);

    const couponOwner: Prisma.CouponOwnerCreateInput = {
      coupon: {
        connect: {
          coupon_id,
        },
      },
      customer: {
        connect: {
          customer_id: Number(customer_id)
        },
      },
      isUsed: false,
    };

    if (_customer.point >= _coupon.point) {
      const insert = prisma.couponOwner.create({
        data: couponOwner,
      });
  
      const update = prisma.customer.update({
        data: {
          point: _customer.point - _coupon.point 
        },
        where: {
          customer_id: Number(customer_id),
        },
      });

      const finalQuery = await prisma.$transaction([insert, update]);

      return [finalQuery, true];
    } else {
      return ['Poin anda tidak cukup untuk mengklaim kupon ini.', 'Error'];
    }

  } catch (err) {
    console.log(err)
    return [err, 'Error'];
  }
}

async function findCouponById(
  params: string
): Promise<[Coupon, string | boolean]> {
  try {
    const read: Coupon = await prisma.coupon.findUnique({
      where: {
        coupon_id: params,
      },
      include: {
        product: {
          select: {
            nama_produk: true,
          },
        },
        CouponOwner: {
          select: {
            id: true,
            coupon_id: true,
            isUsed: true,
            customer: {
              select: {
                nama: true
              }
            }
          }
        }
      },
    });

    console.log(read)
    return [read, true];
  } catch (err) {
    return [err, 'Error'];
  }
}

async function readCouponOwner(id: number): Promise<[CouponOwner[], string | boolean]> {
  try {
    const read: CouponOwner[] = await prisma.couponOwner.findMany({
      include: {
        coupon: {
          select: {
            point: true,
            product: true
          }
        }
      },
      where: {
        customer_id: id,
        AND: {
          isUsed: false
        }
      }
    });

    return [read, true];
  } catch (err) {
    return [err, 'Error']
  }
}

async function readAllCoupon(): Promise<[Coupon[], string | boolean]> {
  try {
    const read: Coupon[] = await prisma.coupon.findMany({
      include: {
        product: {
          select: {
            nama_produk: true,
          },
        },
      },
      where: {
        tgl_berakhir: {
          gte: new Date()
        }
      }
    });

    return [read, true];
  } catch (err) {
    return [err, 'Error'];
  }
}

async function updateCoupon(
  params: string,
  body: CouponBody
): Promise<[Coupon, string | boolean]> {
  try {
    const { nama_kupon, product_id, diskon, tgl_mulai, tgl_berakhir, point } = body;
    console.log(params);
    const coupon: Prisma.CouponUpdateInput = {
      nama_kupon,
      diskon: Number(diskon),
      point: Number(point),
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

export { createCoupon, findCouponById, readAllCoupon, updateCoupon, claimCouponByCustomer, readCouponOwner };
