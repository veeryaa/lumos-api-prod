import { Router } from 'express';
import {
  pdfToTextController,
  readAllTransactionController,
  findByIdController,
  claimController,
  generateRecController,
  listRecommendationController,
  trxByCustController,
  exportCsvController
} from './TransactionController';

const TrxRoute: Router = Router();

TrxRoute.post('/transfer', pdfToTextController);
TrxRoute.get('/read', readAllTransactionController);
TrxRoute.get('/read/:id', findByIdController);
TrxRoute.get('/custread/:cust', trxByCustController);
TrxRoute.post('/recommendation', generateRecController);
TrxRoute.get('/listrecommendation', listRecommendationController);
TrxRoute.put('/claim/:trx', claimController);
TrxRoute.post('/export', exportCsvController);

export default TrxRoute;
