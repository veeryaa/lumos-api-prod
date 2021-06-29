import { Request, Response } from 'express';
import { FAIL_MESSAGE, SUCCESS_MESSAGE } from '../../helper/enum';
import {
  createCustomer as ServiceCreateCustomer,
  readAllCustomer as ServiceReadAllCustomer,
  readAllCustomerByMembership as ServiceReadAllByMembership,
  findCustomerById as ServiceFindCustomerById,
  updateCustomer as ServiceUpdateCustomer
} from './CustomerService';

async function createController(req: Request, res: Response): Promise<void> {
  const [result, status] = await ServiceCreateCustomer(req.body);

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

async function findIdByController(req: Request, res: Response): Promise<void> {
  const [result, status] = await ServiceFindCustomerById(req.params.id);

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
  const [result, status] = await ServiceReadAllCustomer(page);

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

async function readAllByMembership(req: Request, res: Response): Promise<void> {
  const { member } = req.params;
  const page = String(req.query.page);
  const [result, status] = await ServiceReadAllByMembership(member, page);

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
  const [result, status] = await ServiceUpdateCustomer(req.params.id, req.body);

  if (status !== 'Error') {
    res.status(200).json({
      status: 200,
      msg: SUCCESS_MESSAGE.UPDATE,
      result
    })
  } else {
    res.status(500).json({
      status: 500,
      msg: FAIL_MESSAGE.UPDATE,
      result: null
    })
  }
}

export { createController, readAllController, readAllByMembership, findIdByController, updateController };
