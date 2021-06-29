import { Router } from 'express';
import {
  createController,
  findByIdController,
  readAllByRole,
  readAllController,
  updateController,
} from './EmployeeController';

const EmployeeRoute: Router = Router();

EmployeeRoute.post('/create', createController);
EmployeeRoute.get('/read', readAllController);
EmployeeRoute.get('/read/:role', readAllByRole);
EmployeeRoute.get('/find/:id', findByIdController);
EmployeeRoute.put('/update/:id', updateController);

export default EmployeeRoute;
