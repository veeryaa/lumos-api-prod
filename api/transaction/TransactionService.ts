import * as fs from 'fs';
import pdf from 'pdf-parse';
import { Transaction, Recommendation } from '.prisma/client';
import { PRODUCT } from '../../helper/product';
import {
  createDataTransaction as RepoCreateTransaction,
  readAllTransaction as RepoReadAllTransaction,
  readTransactionById as RepoReadTransactionById,
  claimTrxByCustomer as RepoClaimTrx,
  getListRecommendation as RepoListRecommendation,
  readTransactionByCustomerId as RepoTransactionByCustId,
  readTransactionByDate as RepoReadTrxByDate,
} from './TransactionRepo';

export type TrxDetail = {
  id: string;
  date: string;
  detail: any[];
  total: string;
};

async function exportTrxToCsv(tglawal, tglakhir): Promise<any> {
  const [result, status] = await RepoReadTrxByDate(tglawal, tglakhir);

  return [result, status];
}

async function createDataTransaction(
  body: TrxDetail,
  employee_id: string
): Promise<[any, boolean | string]> {
  const rewardPoint = Math.round(Number(body.total) / 1000);
  const detailProduct = [];

  body.detail.forEach((e) => {
    detailProduct.push({
      trx_id: body.id,
      product_id: PRODUCT[e.nama_produk],
      kuantiti: Number(e.kuantiti),
    });
  });

  const [result, status] = await RepoCreateTransaction(
    body,
    rewardPoint,
    detailProduct,
    employee_id
  );

  console.log(detailProduct);

  return [result, status];
}

async function claimTrxByCustomer(
  trx_id: string,
  cust_id: string
): Promise<[any, boolean | string]> {
  const [result, status] = await RepoClaimTrx(trx_id, cust_id);

  return [result, status];
}

async function getListRecommendation(): Promise<
  [{ read: Recommendation[]; count: number; trxCount: number }, boolean | string]
> {
  const [{ read, count, trxCount }, status] = await RepoListRecommendation();

  return [{ read, count, trxCount }, status];
}

async function readTransactionByCustomerId(customer_id: string): Promise<[any, boolean | string]> {
  const [read, status] = await RepoTransactionByCustId(customer_id);

  return [read, status];
}

async function readAllTransaction(
  page: string
): Promise<[{ read: Transaction[]; count: number }, boolean | string]> {
  const [{ read, count }, status] = await RepoReadAllTransaction(page);

  return [{ read, count }, status];
}

async function readTransactionByid(params: string): Promise<[Transaction, boolean | string]> {
  const [result, status] = await RepoReadTransactionById(params);

  return [result, status];
}

async function savePdfToStorage(content, employee_id: string, callback: Function) {
  const { size, data } = content;

  if (size > 1024 * 1024) return false;

  const read: TrxDetail = await readPdfToText(data, employee_id);

  if (!read) {
    callback(false);
  } else {
    callback(true, read);
  }
}

async function readPdfToText(buffer, employee_id: string) {
  try {
    let dataText: any = await pdf(buffer, { version: 'default' });
    dataText = dataText.text.trim();

    console.log('DATA CLEANING ----');
    console.log(dataText);

    const salesDetail = [];
    const csv = [];
    const refOrder = dataText.split('\n')[1].split(': ')[1].split('Member')[0];
    const orderDate = dataText.split('\n')[2].split(' ')[2];
    let total = dataText.split('\n')[4].split(' ')[2];
    let sales = dataText
      .split('NoNamaQTYHargaSubtotalDiscountTotal')[1]
      .split('Subtotal')[0]
      .trim()
      .split('\n');

    console.log('---- SALES');
    console.log(sales);
    const removeTea = sales.findIndex((e) => e === 'TEA');

    if (removeTea !== -1) {
      sales[removeTea - 1] = sales[removeTea - 1].concat(sales[removeTea + 1]);
      sales.splice(removeTea, 2);
    }

    total = total.slice(0, total.length - 3).replace(/\./g, '');

    sales.forEach((e) => {
      const split = e.split('Rp.');
      const productName = split[0].slice(1, split[0].length - 1).trim();
      const quantity = split[0].slice(split[0].length - 1);
      const price = split[1].slice(0, split[1].length - 3).replace(/\./g, '');
      const subtotal = split[2].slice(0, split[2].length - 3).replace(/\./g, '');

      csv.push(productName.toUpperCase());

      salesDetail.push({
        nama_produk: productName.toUpperCase(),
        kuantiti: quantity,
        price,
        total_transaksi_detail: subtotal,
      });
    });

    let commaCsv = ','.repeat(8 - csv.length);

    const [db, status] = await createDataTransaction(
      {
        id: orderDate.concat('-').concat(refOrder),
        date: orderDate,
        detail: salesDetail,
        total,
      },
      employee_id
    );

    console.log('----- ATTRIBUTE');
    console.log(db);

    console.log('----- CSV');
    console.log(csv);
    if (status) {
      fs.appendFileSync(
        '/home/fadelfirmansyah/Documents/Lumos Final Project/lumos-api-ts/api/transaction/lumos.csv',
        csv.toString().toUpperCase() + commaCsv + '\n'
      );

      return {
        id: orderDate.concat('-').concat(refOrder),
        date: orderDate,
        detail: salesDetail,
        total,
      };
    } else {
      return false;
    }
  } catch (err) {
    const read = readPdfToText(buffer, employee_id);
    console.log(err);
    return read;
  }
}

export {
  savePdfToStorage,
  createDataTransaction,
  readAllTransaction,
  readTransactionByid,
  claimTrxByCustomer,
  exportTrxToCsv, 
  getListRecommendation,
  readTransactionByCustomerId,
};
