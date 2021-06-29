import { Router } from 'express';
import {
  createController,
  findByIdController,
  readAllController,
  updateController,
} from './MembershipController';

const MembershipRoute: Router = Router();

MembershipRoute.post('/create', createController);
MembershipRoute.get('/read', readAllController);
MembershipRoute.get('/find/:id', findByIdController);
MembershipRoute.put('/update/:id', updateController);

export default MembershipRoute