import { Request, Response } from 'express';
import { SUCCESS_MESSAGE, FAIL_MESSAGE } from '../../helper/enum';
import {
  createEmployee as ServiceCreateEmployee,
  readAllEmployee as ServiceReadAllEmployee,
  findEmployeeById as ServiceFindById,
  updateEmployee as ServiceUpdateEmployee,
  readAllEmployeeByRole as ServiceReadAllByRole
} from './EmployeeService';

async function createController(req: Request, res: Response): Promise<void> {
  const [result, status] = await ServiceCreateEmployee(req.body);

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
    console.log(result);
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
  const [result, status] = await ServiceReadAllEmployee(page);

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

async function readAllByRole(req: Request, res: Response): Promise<void> {
  const { role } = req.params;
  const page = String(req.query.page);
  const [result, status] = await ServiceReadAllByRole(role, page);

  console.log('READ BY ROLE')

  if (status !== 'Error') {
    res.status(200).json({
      status: 200,
      msg: SUCCESS_MESSAGE.READ_ALL,
      count: result.count,
      result: result.read
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
  const [result, status] = await ServiceUpdateEmployee(req.params.id, req.body);

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

export { createController, findByIdController, readAllController, updateController, readAllByRole };
