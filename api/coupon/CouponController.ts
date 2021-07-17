import { Request, Response } from 'express';
import { FAIL_MESSAGE, SUCCESS_MESSAGE } from '../../helper/enum';
import { claimCouponByCustomer, readCouponOwner } from './CouponRepo';
import {
  createCoupon as ServiceCreateCoupon,
  findCouponById as ServiceFindCouponById,
  readAllCoupon as ServiceReadAllCoupon,
  updateCoupon as ServiceUpdateCoupon,
} from './CouponService';

async function createController(req: Request, res: Response): Promise<void> {
  const [result, status] = await ServiceCreateCoupon(req.body);

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

async function claimCouponController(
  req: Request,
  res: Response
): Promise<void> {
  const [result, status] = await claimCouponByCustomer(req.body);
  if (status !== 'Error') {
    res.status(201).json({
      status: 201,
      msg: 'Anda berhasil mengklaim kupon ini.',
      result,
    });
  } else {
    res.status(500).json({
      status: 500,
      msg: status,
      result
    })
  }
}

async function findByIdController(req: Request, res: Response): Promise<void> {
  const [result, status] = await ServiceFindCouponById(req.params.id);

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
  const [result, status] = await ServiceReadAllCoupon();

  if (status !== 'Error') {
    res.status(200).json({
      status: 500,
      msg: SUCCESS_MESSAGE.READ_ALL,
      result,
    });
  } else {
    res.status(500).json({
      status: 500,
      msg: FAIL_MESSAGE.READ_ALL,
      result: null,
    });
  }
}

async function readCouponOwnerController(req: Request, res: Response): Promise<void> {
  const [result, status] = await readCouponOwner(Number(req.params.id));

  if (status !== 'Error') {
    res.status(200).json({
      status: 200,
      msg: SUCCESS_MESSAGE.READ_ALL,
      result
    }) 
  } else {
    res.status(500).json({
      status: 500,
      msg: FAIL_MESSAGE.READ_ALL,
      result: null
    })
  }
  
}

async function updateController(req: Request, res: Response): Promise<void> {
  const [result, status] = await ServiceUpdateCoupon(req.params.id, req.body);

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
  claimCouponController,
  readCouponOwnerController
};
