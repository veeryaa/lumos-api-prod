import { PrismaClient, Prisma } from '.prisma/client';
import { EmployeeBody } from './EmployeeService';

const prisma = new PrismaClient({ rejectOnNotFound: true });

async function createEmployee(
  body: EmployeeBody,
  hash: string
): Promise<[object, boolean | string]> {
  try {
    const { employee_id, nama, tanggal_lahir, email, role } = body;

    const employee: Prisma.EmployeeCreateInput = {
      employee_id,
      nama,
      tanggal_lahir: new Date(tanggal_lahir),
      email,
      password: hash,
      role,
    };

    const insert = await prisma.employee.create({
      data: employee,
      select: {
        employee_id: true,
        nama: true,
        tanggal_lahir: true,
        email: true,
        role: true,
      },
    });

    return [insert, true];
  } catch (err) {
    return [err, 'Error'];
  }
}

async function findEmployeeById(params: string): Promise<[object, boolean | string]> {
  try {
    const read = await prisma.employee.findUnique({
      select: {
        employee_id: true,
        nama: true,
        tanggal_lahir: true,
        email: true,
        role: true,
      },
      where: { employee_id: params },
    });

    return [read, true];
  } catch (err) {
    return [err, 'Error'];
  }
}

async function readAllEmployee(
  page: string
): Promise<[{ read: object[]; count: number }, boolean | string]> {
  try {
    const readCount = await prisma.employee.count();

    if (Number(page) > 0) {
      const read = await prisma.employee.findMany({
        select: {
          employee_id: true,
          nama: true,
          tanggal_lahir: true,
          email: true,
          role: true,
        },
        skip: Number(page) * 10 - 10,
        take: 10,
      });

      return [{ read, count: readCount }, true];
    } else {
      const read = await prisma.employee.findMany({
        select: {
          employee_id: true,
          nama: true,
          tanggal_lahir: true,
          email: true,
          role: true,
        },
      });

      return [{ read, count: readCount }, true];
    }
  } catch (err) {
    return [err, 'Error'];
  }
}

async function readAllEmployeeByRole(
  role: string,
  page: string
): Promise<[{ read: object[]; count: number }, boolean | string]> {
  try {
    const readCount = await prisma.employee.count({
      where: { role },
    });

    if (Number(page) > 0) {
      const read: object[] = await prisma.employee.findMany({
        where: {
          role,
        },
        skip: Number(page) * 10 - 10,
        take: 10,
        select: {
          employee_id: true,
          nama: true,
          tanggal_lahir: true,
          email: true,
          role: true,
        },
      });

      return [{ read, count: readCount }, true];
    } else {
      const read: object[] = await prisma.employee.findMany({
        where: { role },
        select: {
          employee_id: true,
          nama: true,
          tanggal_lahir: true,
          email: true,
          role: true,
        },
      });

      return [{read, count: readCount}, true];
    }
  } catch (err) {
    return [err, 'Error'];
  }
}

async function updateEmployee(
  params: string,
  body: EmployeeBody
): Promise<[object, boolean | string]> {
  try {
    const { nama, tanggal_lahir, email, role } = body;

    const employee: Prisma.EmployeeUpdateInput = {
      nama,
      tanggal_lahir: new Date(tanggal_lahir),
      email,
      role,
    };

    const update = await prisma.employee.update({
      where: {
        employee_id: params,
      },
      select: {
        employee_id: true,
        nama: true,
        tanggal_lahir: true,
        email: true,
        role: true,
      },
      data: employee,
    });

    return [update, true];
  } catch (err) {
    return [err, 'Error'];
  }
}

export { createEmployee, findEmployeeById, readAllEmployee, updateEmployee, readAllEmployeeByRole };
