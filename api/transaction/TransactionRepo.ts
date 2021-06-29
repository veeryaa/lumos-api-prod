import { PrismaClient, Prisma, Transaction, Recommendation } from '.prisma/client';
import { findCustomerById } from '../customer/CustomerRepo';
import { findMembershipById } from '../membership/MembershipRepo';
import { TrxDetail } from './TransactionService';

const prisma = new PrismaClient({ rejectOnNotFound: true });

async function createDataRecommendation(recommendation: any[]): Promise<[any, boolean | string]> {
  try {
    const deleteFirst = prisma.recommendation.deleteMany();

    const result = prisma.recommendation.createMany({
      data: recommendation,
    });

    const finalQuery = await prisma.$transaction([deleteFirst, result]);

    return [finalQuery, true];
  } catch (err) {
    console.log(err);
    return [err, false];
  }
}

async function createDataTransaction(
  body: TrxDetail,
  point: number,
  detailTrx: any[],
  employee_id: string
): Promise<[any, boolean | string]> {
  try {
    const { id, date, total } = body;

    const trx: Prisma.TransactionCreateInput = {
      trx_id: id,
      tgl_transaksi: new Date(date),
      point,
      nilai_transaksi: Number(total),
      employee: {
        connect: {
          employee_id,
        },
      },
      customer: {
        connect: {
          customer_id: 4,
        },
      },
    };

    const insertTrx = prisma.transaction.create({
      data: trx,
    });

    const insertTrxDetail = prisma.transactionDetail.createMany({
      data: detailTrx,
    });

    const finalQuery = await prisma.$transaction([insertTrx, insertTrxDetail]);

    return [finalQuery, true];
  } catch (err) {
    console.log(err);
    return [err, false];
  }
}

async function readTransactionByCustomerId(customer_id: string): Promise<[any, boolean | string]> {
  try {
    const read = await prisma.transaction.findMany({
      where: {
        customer_id: Number(customer_id),
      },
    });

    return [read, true];
  } catch (err) {
    console.log(err);
    return [err, 'Error'];
  }
}

async function readTransactionByDate(
  tgl_awal,
  tgl_akhir
): Promise<[{ read: any[]; count: number }, boolean | string]> {
  try {
    console.log(tgl_awal)
    console.log(tgl_akhir)
    const readCount = await prisma.transaction.count({
      where: {
        tgl_transaksi: {
          gte: new Date(tgl_awal),
        },
        AND: {
          tgl_transaksi: {
            lte: new Date(tgl_akhir), 
          },
        },
      },
    });

    const read: any[] = await prisma.transaction.findMany({
      where: {
        tgl_transaksi: {
          gte: new Date(tgl_awal),
        },
        AND: {
          tgl_transaksi: {
            lte: new Date(tgl_akhir),
          },
        },
      },
      include: {
        TransactionDetail: {
          select: {
            product: {
              select: {
                nama_produk: true
              }
            }
          }
        }
      }
    });

    return [{ read, count: readCount}, true];
  } catch (err) {
    console.log(err)
    return [err, 'Error'];
  }
}

async function readAllTransaction(
  page: string
): Promise<[{ read: Transaction[]; count: number }, boolean | string]> {
  try {
    const readCount = await prisma.transaction.count();
    console.log(page);
    if (Number(page) > 0) {
      const read: Transaction[] = await prisma.transaction.findMany({
        skip: Number(page) * 25 - 25,
        take: 25,
      });

      return [{ read, count: readCount }, true];
    } else {
      const read: Transaction[] = await prisma.transaction.findMany();

      return [{ read, count: readCount }, true];
    }
  } catch (err) {
    return [err, 'Error'];
  }
}

async function getListRecommendation(): Promise<
  [{ read: Recommendation[]; count: number; trxCount: number }, boolean | string]
> {
  try {
    const readCount = await prisma.recommendation.count();
    const trxCount = await prisma.transaction.count();

    const read: Recommendation[] = await prisma.recommendation.findMany();

    return [{ read, count: readCount, trxCount }, true];
  } catch (err) {
    return [err, 'Error'];
  }
}

async function claimTrxByCustomer(
  trx_id: string,
  cust_id: string
): Promise<[any, boolean | string]> {
  try {
    const trx = await readTransactionById(trx_id);
    const customer = await findCustomerById(cust_id);
    const membership = await findMembershipById(customer[0].membership_id);

    const nextMinimum = await prisma.membership.findMany({
      where: {
        minimum_poin: {
          gt: membership[0].minimum_poin,
        },
      },
    });

    if (trx[0].trx.customer_id !== 4) return ['Transaksi ini telah diklaim', 'Error'];

    console.log('-MINIMUM');
    console.log(nextMinimum);

    const updateTrx = prisma.transaction.update({
      where: {
        trx_id,
      },
      data: {
        customer_id: Number(cust_id),
      },
    });

    if (customer[0].point + trx[0].trx.point > nextMinimum[0].minimum_poin) {
      let customerRank = customer[0].membership_id;
      console.log('KESINI');
      if (customerRank === 'Bronze') {
        customerRank = 'Silver';
      } else if (customerRank === 'Silver') {
        customerRank = 'Gold';
      }

      const updateProfile = prisma.customer.update({
        where: {
          customer_id: Number(cust_id),
        },
        data: {
          point: customer[0].point + trx[0].trx.point,
          membership_id: customerRank,
        },
      });

      const finalQuery = await prisma.$transaction([updateTrx, updateProfile]);
      return [finalQuery, true];
    } else {
      const updateProfile = prisma.customer.update({
        where: {
          customer_id: Number(cust_id),
        },
        data: {
          point: customer[0].point + trx[0].trx.point,
        },
      });

      const finalQuery = await prisma.$transaction([updateTrx, updateProfile]);
      return [finalQuery, true];
    }
  } catch (err) {
    console.log(err);
    return [err, 'Error'];
  }
}

async function readTransactionById(params: string): Promise<[any, boolean | string]> {
  try {
    const trxProduct = [];
    let trxAntecedent = [];
    let trxConsequent = [];

    const read = prisma.transaction.findUnique({
      where: {
        trx_id: params,
      },
      include: {
        TransactionDetail: {
          include: {
            product: true,
          },
        },
        customer: true,
      },
    });

    const recommendation = prisma.recommendation.findMany({
      where: {
        lift_ratio: {
          gt: 0.999999,
        },
      },
    });

    const [_read, _recommendation] = await prisma.$transaction([read, recommendation]);

    _read.TransactionDetail.forEach((el) => {
      trxProduct.push(el.product.nama_produk);
    });

    _recommendation.forEach((el) => {
      if (
        trxProduct.toString().includes(el.antecedent.toString()) &&
        !trxProduct.toString().includes(el.consequent.toString())
      ) {
        trxAntecedent = el.antecedent as Prisma.JsonArray;
        trxConsequent = el.consequent as Prisma.JsonArray;
        console.log(trxConsequent);
        console.log(trxAntecedent);
      }
    });

    const trxResult = {
      trx: _read,
      rekomendasi: {
        antecedent: trxAntecedent,
        consequent: trxConsequent,
      },
    };

    return [trxResult, true];
  } catch (err) {
    return [err, 'Error'];
  }
}

export {
  createDataTransaction,
  readAllTransaction,
  readTransactionById,
  claimTrxByCustomer,
  createDataRecommendation,
  getListRecommendation,
  readTransactionByCustomerId,
  readTransactionByDate,
};
