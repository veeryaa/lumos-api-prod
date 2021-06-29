import { Customer } from '.prisma/client';
import { PrismaClient, Prisma } from '.prisma/client';
import { CustomerBody } from './CustomerService';

const prisma = new PrismaClient({ rejectOnNotFound: true });

async function createCustomer(
  body: CustomerBody,
  hash: string
): Promise<[object, boolean | string]> {
  try {
    const { handphone, email } = body;

    const customer: Prisma.CustomerCreateInput = {
      nama: '',
      kota: '',
      email,
      tanggal_lahir: new Date('2000-01-01'),
      point: 10,
      membership: {
        connect: {
          membership_id: 'Bronze',
        },
      },
      CustomerAccount: {
        create: {
          handphone,
          password: hash,
        },
      },
    };

    const insert = await prisma.customer.create({
      data: customer,
      select: {
        customer_id: true,
        email: true,
        CustomerAccount: {
          select: {
            handphone: true,
          },
        },
      },
    });

    console.log('SUKSES');

    return [insert, true];
  } catch (err) {
    console.log(err);
    return [err, 'Error'];
  }
}

async function findCustomerById(params: string): Promise<[Customer, string | boolean]> {
  try {
    const read = await prisma.customer.findUnique({
      where: {
        customer_id: Number(params),
      },
      include: {
        CustomerAccount: {
          select: {
            handphone: true,
          },
        },
      },
    });

    return [read, true];
  } catch (err) {
    return [err, 'Error'];
  }
}

async function readAllCustomer(
  page: string
): Promise<[{ read: Customer[]; count: number }, boolean | string]> {
  try {
    const readCount = await prisma.customer.count();

    if (Number(page) > 0) {
      const read: Customer[] = await prisma.customer.findMany({
        skip: Number(page) * 10 - 10,
        take: 10,
        where: {
          customer_id: {
            not: 4
          }
        }
      });

      return [{ read, count: readCount }, true];
    } else {
      const read: Customer[] = await prisma.customer.findMany({
        where: {
          customer_id: {
            not: 4
          }
        }
      });

      return [{ read, count: readCount }, true];
    }
  } catch (err) {
    return [err, 'Error'];
  }
}

async function readAllCustomerByMembership(
  membership: string,
  page: string
): Promise<[{ read: Customer[]; count: number }, boolean | string]> {
  try {
    const readCount = await prisma.customer.count({
      where: {
        membership_id: membership,
      },
    });
    console.log('count: ', readCount);
    if (Number(page) > 0) {
      const read: Customer[] = await prisma.customer.findMany({
        where: {
          membership_id: membership,
        },
        skip: Number(page) * 10 - 10,
        take: 10,
        include: {
          CustomerAccount: {
            select: { handphone: true },
          },
        },
      });
      return [{ read, count: readCount }, true];
    } else {
      const read: Customer[] = await prisma.customer.findMany({
        where: {
          membership_id: membership,
        },
        include: {
          CustomerAccount: {
            select: { handphone: true },
          },
        },
      });
      return [{ read, count: readCount }, true];
    }
  } catch (err) {
    return [err, 'Error'];
  }
}

async function updateCustomer(
  params: string,
  body: CustomerBody
): Promise<[Customer, string | boolean]> {
  try {
    const { nama, kota, tanggal_lahir } = body;
    console.log(params);

    const customer: Prisma.CustomerUpdateInput = {
      nama,
      kota,
      tanggal_lahir,
    };

    const update = await prisma.customer.update({
      where: {
        customer_id: Number(params),
      },
      data: customer,
    });

    return [update, true];
  } catch (err) {
    return [err, 'Error'];
  }
}

export {
  createCustomer,
  readAllCustomer,
  readAllCustomerByMembership,
  findCustomerById,
  updateCustomer,
};
