import { Request, Response, Router } from 'express';
import { AuthRequest, passport } from './passport';
import { AuthenticateOptions } from 'passport';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { PrismaClient } from '.prisma/client';

dotenv.config();

const authRouter = Router();
const prisma = new PrismaClient();

export interface EmployeeAuthRequest extends Request {
  user: {
    employee_id: string;
    email: string;
    role: string;
  };
}

export interface CustomerAuthRequest extends Request {
  user: {
    customer_id: string;
    handphone: string;
  };
}

const authOptions: AuthenticateOptions = {
  session: false,
  failWithError: true,
};

const verifyJwtToken = async (auth: string, type: string): Promise<boolean> => {
  if (type === 'employee') {
    const user = await prisma.employee.findUnique({
      where: { email: auth },
    });

    if (user === null) return false;
    return true;
  }

  if (type === 'customer') {
    const user = await prisma.customerAccount.findUnique({
      where: { handphone: auth },
    });

    if (user === null) return false;
    return true;
  }
};

// EMPLOYEE
authRouter.post(
  '/login',
  passport.authenticate('employeeAuth', authOptions),
  (req: EmployeeAuthRequest, res: Response): void => {
    const token = jwt.sign(
      { employee_id: req.user.employee_id, username: req.body.username, role: req.user.role },
      process.env.EMPLOYEE_TOKEN
    );

    res.status(200).json({
      status: 200,
      msg: 'Login sukses.',
      employee_id: req.user.employee_id,
      email: req.user.email,
      role: req.user.role,
      token: token,
    });
  },
  (err: JsonWebTokenError, req: AuthRequest, res: Response, next): void => {
    if (!req.isAuth) {
      res.status(401).json({
        status: 401,
        msg: 'Login gagal.',
      });
    }
  }
);

// CUSTOMER
authRouter.post(
  '/customer',
  passport.authenticate('customerAuth', authOptions),
  (req: CustomerAuthRequest, res: Response): void => {
    const token = jwt.sign(
      { customer_id: req.user.customer_id, username: req.body.username },
      process.env.CUSTOMER_TOKEN
    );

    console.log(token)

    res.status(200).json({
      status: 200,
      msg: 'Login sukses.',
      customer_id: req.user.customer_id,
      handphone: req.body.username,
      token: token,
    });
  },
  (err: JsonWebTokenError, req: AuthRequest, res: Response, next): void => {
    if (!req.isAuth) {
      console.log(err);
      res.status(401).json({
        status: 401,
        msg: 'Login gagal.',
      });
    }
  }
);

authRouter.post('/verifyToken', (req: Request, res: Response): void => {
  const { token } = req.body;

  jwt.verify(token, process.env.EMPLOYEE_TOKEN, async (err, payload): Promise<void> => {
    if (err) {
      res.status(401).json({
        status: 401,
        msg: 'Token tidak dapat diverifikasi.',
      });
    } else {
      const isJwtExist = await verifyJwtToken(payload.username, 'employee');

      console.log(payload);
      if (isJwtExist) {
        res.status(200).json({
          status: 200,
          msg: 'Token berhasil diverifikasi.',
          token,
          employee_id: payload.employee_id,
          role: payload.role,
          email: payload.username,
        });
      } else {
        res.status(401).json({
          status: 401,
          msg: 'Token tidak valid, dan user tidak terdaftar.',
        });
      }
    }
  });
});

authRouter.post('/verifyCustomer', (req: Request, res: Response): void => {
  const { token } = req.body;

  jwt.verify(token, process.env.CUSTOMER_TOKEN, async (err, payload): Promise<void> => {
    if (err) {
      res.status(401).json({
        status: 401,
        msg: 'Token tidak dapat diverifikasi.',
      });
    } else {
      const isJwtExist = await verifyJwtToken(payload.username, 'customer');
      console.log(payload);
      
      if (isJwtExist) {
        res.status(200).json({
          status: 200,
          msg: 'Token berhasil diverifikasi.',
          token,
          customer_id: payload.customer_id,
          handphone: payload.username,
        });
      } else {
        res.status(401).json({
          status: 401,
          msg: 'Token tidak valid, dan user tidak terdaftar.',
        });
      }
    }
  });
});

export { authRouter };
