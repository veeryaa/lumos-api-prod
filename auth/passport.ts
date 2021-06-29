import passport from 'passport';
import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptions as JwtStrategyOptions,
} from 'passport-jwt';
import { Strategy as LocalStrategy, IStrategyOptionsWithRequest } from 'passport-local';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { PrismaClient } from '.prisma/client';
import { Request } from 'express';

dotenv.config();

const prisma = new PrismaClient();

const employeeOpt: JwtStrategyOptions = {
  secretOrKey: process.env.EMPLOYEE_TOKEN,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const customerOpt: JwtStrategyOptions = {
  secretOrKey: process.env.CUSTOMER_TOKEN,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const localOptions: IStrategyOptionsWithRequest = {
  passReqToCallback: true,
};

export interface AuthRequest extends Request {
  isAuth: boolean;
}

passport.use(
  'employeeJwt',
  new JwtStrategy(employeeOpt, async (payload, done): Promise<any> => {
    const email = await prisma.employee.findUnique({
      where: { email: payload.username },
    });

    if (email === null) return done(null, false);
    if (email) return done(null, payload.username);
  })
);

passport.use(
  'customerJwt',
  new JwtStrategy(customerOpt, async (payload, done): Promise<any> => {
    const handphone = await prisma.customerAccount.findUnique({
      where: { handphone: payload.username },
    });

    if (handphone === null) return done(null, false);
    if (handphone) return done(null, payload.username);
  })
);

passport.use(
  'customerAuth',
  new LocalStrategy(
    localOptions,
    async (req: AuthRequest, username, password, done): Promise<any> => {
      try {
        console.log('Tryinggg');
        console.log(username);
        console.log(password);
        const user = await prisma.customerAccount.findUnique({
          where: {
            handphone: username,
          },
          select: {
            customer_id: true,
            handphone: true,
            password: true,
            customer: {
              select: {
                nama: true,
              },
            },
          },
        });

        console.log(user);

        const decrypt = await bcrypt.compare(password, user.password);

        if (!decrypt) return done(null, false);
        if (user == null) return done(null, false);
        if (user && decrypt) return done(null, user);
      } catch (err) {
        req.isAuth = false;
        return done(null, false);
      }
    }
  )
);

passport.use(
  'employeeAuth',
  new LocalStrategy(
    localOptions,
    async (req: AuthRequest, username, password, done): Promise<any> => {
      try {
        const user = await prisma.employee.findUnique({
          where: { email: username },
          select: {
            employee_id: true,
            email: true,
            password: true,
            role: true,
          },
        });

        const decrypt = await bcrypt.compare(password, user.password);

        if (!decrypt) return done(null, false);
        if (user === null) return done(null, false);
        if (user && decrypt) return done(null, user);
      } catch (err) {
        console.log(err);
        req.isAuth = false;
        return done(null, false);
      }
    }
  )
);

export { passport };
