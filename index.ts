import express, { Application } from 'express';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import router from './api/routes';
import { authRouter } from './auth/auth';

dotenv.config();
const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(fileUpload());

app.use('/auth', authRouter);
app.use('/api', router);

app.listen(process.env.PORT, (): void => {
  console.log(`It's running! PORT: ${process.env.PORT}`);
});
 