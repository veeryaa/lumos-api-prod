import { Request, Response } from 'express';
import * as fs from 'fs';
import {
  savePdfToStorage,
  TrxDetail,
  readAllTransaction as ServiceReadAllTransaction,
  readTransactionByid as ServiceReadTrxById,
  claimTrxByCustomer as ServiceClaimTrx,
  readTransactionByCustomerId as ServiceTrxByCust,
  getListRecommendation as ServiceListRecommendation,
  exportTrxToCsv as ServiceExportTrx,
} from './TransactionService';
import { createDataRecommendation } from './TransactionRepo';
import cps from 'child_process';
import { SUCCESS_MESSAGE, FAIL_MESSAGE } from '../../helper/enum';

async function exportCsvController(req: Request, res: Response) {
  const { tglawal, tglakhir } = req.body;

  const [result, status] = await ServiceExportTrx(tglawal, tglakhir);

  if (status !== 'Error') { 
    const csv = [];

    for (let i = 0; i < result.read.length; i++) {
      const fillCsv = [];

      result.read[i].TransactionDetail.forEach((produk) =>
        fillCsv.push(produk.product.nama_produk)
      );
      csv.push(fillCsv);
    }

    const data: string[] = csv.map((e) => {
      return e.toString() + ','.repeat(8 - e.length) + '\n';  
    });

    fs.writeFileSync('/home/fadelfirmansyah/Documents/Lumos Final Project/lumos-api-prod/api/transaction/lumos.csv', data.join(''));

    res.status(200).json({
      status: 200,
      msg: SUCCESS_MESSAGE.READ_ALL,
      count: result.count,
      result: result.read,
    });
  } else {
    res.status(500).json({
      status: 500,
      msg: FAIL_MESSAGE.READ_ALL,
      result: null,
    });
  }
}

async function readAllTransactionController(req: Request, res: Response) {
  const page = String(req.query.page);
  const [result, status] = await ServiceReadAllTransaction(page);

  if (status !== 'Error') {
    res.status(200).json({
      status: 200,
      msg: SUCCESS_MESSAGE.READ_ALL,
      count: result.count,
      result: result.read,
    });
  } else {
    res.status(500).json({
      status: 500,
      msg: FAIL_MESSAGE.READ_ALL,
      result: null,
    });
  }
}

async function findByIdController(req: Request, res: Response) {
  const [result, status] = await ServiceReadTrxById(req.params.id);

  if (status !== 'Error') {
    res.status(200).json({
      status: 200,
      msg: SUCCESS_MESSAGE.READ_ID,
      result: [result],
    });
  } else {
    res.status(500).json({
      status: 500,
      msg: FAIL_MESSAGE.READ_ID,
      result: null,
    });
  }
}

type AssocRule = {
  antecedent: any;
  consequent: any;
  support: Number;
  confidence: Number;
  lift_ratio: Number;
  employee_id: string;
};

async function generateRecController(req: Request, res: Response) {
  const { support, confidence, total_data, employee_id } = req.body;
  
  cps.exec(
    `/home/fadelfirmansyah/Documents/"Lumos Final Project"/lumos-api-prod/api/transaction/job.sh ${support} ${confidence} ${total_data}`,
    { shell: '/bin/bash' },
    async (err, stdout, stderr) => {
      if (stdout !== '') {
        const result = stdout.trimEnd();
        const finalResult: AssocRule[] = [];

        result.split('\n').forEach((val, i) => {
          if (i !== 0) {
            const value = val.trimEnd().replace(/\s+/g, ' ');
            const innerValue = value.split('\n');

            console.log(innerValue);
            if (innerValue[0].toString().includes('Columns: [antecedents')) {
              res.status(500).json({
                status: 500,
                code: 'no',
                msg: 'Tidak ada rule yang dihasilkan.',
                result: null,
              });

              return;
            } else {
              innerValue.forEach((ival) => {
                const value = ival.replace(/[(\\]/g, '').split(') ');
                const valueScore = value[2].split(' ');
                const antecedent = value[0].slice(2, value[0].length).split(',');
                const consequent = value[1].split(',');

                finalResult.push({
                  antecedent,
                  consequent,
                  support: Number(valueScore[2]),
                  confidence: Number(valueScore[3]),
                  lift_ratio: Number(valueScore[4]),
                  employee_id,
                });
              });
            }
          }
        });

        const recommendation = await createDataRecommendation(finalResult);

        console.log(recommendation);

        res.status(200).json({
          status: 200,
          code: 'success',
          msg: 'Model berhasil dibentuk.',
          result: finalResult,
        });
      } else if (stderr !== '') {
        res.status(500).json({
          status: 500,
          code: 'error',
          msg: 'Gagal untuk melakukan training data.',
          result: null,
        });
      }
    }
  );
}

async function listRecommendationController(req: Request, res: Response) {
  const [result, status] = await ServiceListRecommendation();

  if (status !== 'Error') {
    res.status(200).json({
      status: 200,
      msg: SUCCESS_MESSAGE.READ_ALL,
      result,
    });
  } else {
    res.status(500).json({
      status: 500,
      msg: result,
      result: null,
    });
  }
}

async function trxByCustController(req: Request, res: Response) {
  const [result, status] = await ServiceTrxByCust(req.params.cust);

  if (status !== 'Error') {
    res.status(200).json({
      status: 200,
      msg: SUCCESS_MESSAGE.READ_ALL,
      result,
    });
  } else {
    res.status(500).json({
      status: 500,
      msg: result,
      result: null,
    });
  }
}

async function claimController(req: Request, res: Response) {
  const [result, status] = await ServiceClaimTrx(req.params.trx, String(req.body.cust_id));

  if (status !== 'Error') {
    res.status(200).json({
      status: 200,
      msg: 'Transaksi berhasil diklaim',
      result,
    });
  } else {
    res.status(500).json({
      status: 500,
      msg: result,
      result: null,
    });
  }
}

async function pdfToTextController(req: Request, res: Response) {
  console.log(req.files);
  console.log(req.body.id);
  if (!req.files) {
    res.send({
      status: 400,
      msg: 'File PDF tidak ditemukan.',
    });
  } else {
    try {
      await savePdfToStorage(
        req.files.data,
        req.body.id,
        async (response: boolean, result: TrxDetail) => {
          const { name }: any = req.files.data;

          if (!response) {
            res.status(500).json({
              status: 500,
              msg: 'Server tidak dapat membaca file yang diberikan.',
            });
          } else if (response) {
            res.status(201).json({
              status: 201,
              metadata: {
                name,
              },
              result,
              msg: 'File telah berhasil diupload',
            });
          }
        }
      );
    } catch (err) {
      console.error('Controller Error');
    }
  }
}

export {
  pdfToTextController,
  trxByCustController,
  readAllTransactionController,
  findByIdController,
  claimController,
  generateRecController,
  listRecommendationController,
  exportCsvController,
};
