import { Request, Response } from 'express';
import { FAIL_MESSAGE, SUCCESS_MESSAGE } from '../../helper/enum';
import {
  createMembership as ServiceCreateMembership,
  findMembershipById as ServiceFindById,
  readAllMembership as ServiceReadAllMembership,
  updateMembership as ServiceUpdateMembership,
} from './MembershipService';

async function createController(req: Request, res: Response): Promise<void> {
  const [result, status] = await ServiceCreateMembership(req.body);

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
  const [result, status] = await ServiceReadAllMembership();

  if (status !== 'Error') {
    res.status(200).json({
      status: 200,
      msg: SUCCESS_MESSAGE.READ_ALL,
      count: result.length,
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

async function updateController(req: Request, res: Response): Promise<void> {
  const [result, status] = await ServiceUpdateMembership(req.params.id, req.body);

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

export { createController, findByIdController, readAllController, updateController };
