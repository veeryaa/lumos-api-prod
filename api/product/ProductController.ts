import { Request, Response } from 'express';
import { FAIL_MESSAGE, SUCCESS_MESSAGE } from '../../helper/enum';
import {
  createProduct as ServiceCreateProduct,
  findProductById as ServiceFindById,
  readAllProduct as ServiceReadAllProduct,
  updateProduct as ServiceUpdateProduct,
  readAllProductByKategori as ServiceReadAllByKategori,
  generateEnumProduct as ServiceGenerateEnum,
} from './ProductService';

async function createController(req: Request, res: Response): Promise<void> {
  const [result, status] = await ServiceCreateProduct(req.body);

  if (status !== 'Error') {
    res.status(201).json({
      status: 201,
      msg: SUCCESS_MESSAGE.CREATE,
      result,
    });
  } else {
    res.status(500).json({
      status: 500,
      msg: status,
      result,
    });
  }
}

async function findByIdController(req: Request, res: Response): Promise<void> {
  const [result, status] = await ServiceFindById(req.params.id);

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

async function readAllController(req: Request, res: Response): Promise<void> {
  const page = String(req.query.page);
  const [result, status] = await ServiceReadAllProduct(page);

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

async function generateEnumController(req: Request, res: Response): Promise<void> {
  const page = String(req.query.page);
  const [result, status] = await ServiceGenerateEnum(page);

  if (status !== 'Error') {
    console.log('Generating Enum Produk');
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

async function readAllByKategori(req: Request, res: Response): Promise<void> {
  const { kategori } = req.params;
  const page = String(req.query.page);
  const [result, status] = await ServiceReadAllByKategori(kategori, page);

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

async function updateController(req: Request, res: Response): Promise<void> {
  const [result, status] = await ServiceUpdateProduct(req.params.id, req.body);

  if (status !== 'Error') {
    res.status(200).json({
      status: 200,
      msg: SUCCESS_MESSAGE.UPDATE,
      result,
    });
  } else {
    res.status(500).json({
      status: 500,
      msg: FAIL_MESSAGE.UPDATE,
      result: null,
    });
  }
}

export {
  createController,
  findByIdController,
  readAllController,
  updateController,
  readAllByKategori,
  generateEnumController,
};
