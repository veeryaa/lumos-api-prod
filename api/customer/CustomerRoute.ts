import { Router } from 'express';
import {
  createController,
  readAllController,
  readAllByMembership,
  findIdByController,
  updateController,
} from './CustomerController';
import passport from 'passport';

const CustomerRoute: Router = Router();

CustomerRoute.post('/create', createController);
CustomerRoute.get('/read', readAllController);
CustomerRoute.get('/read/:member', readAllByMembership);
CustomerRoute.get('/find/:id', findIdByController);
CustomerRoute.put('/update/:id', updateController);

export default CustomerRoute;
