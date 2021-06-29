import {
  createEmployee as RepoCreateEmployee,
  findEmployeeById as RepoFindEmployeeById,
  readAllEmployee as RepoReadAllEmployee,
  updateEmployee as RepoUpdateEmployee,
  readAllEmployeeByRole as RepoReadAllByRole,
} from './EmployeeRepo';
import bcrypt from 'bcrypt';

export interface EmployeeBody extends Body {
  employee_id?: string;
  nama?: string;
  tanggal_lahir?: string;
  email?: string;
  password?: string;
  role?: string;
}

async function createEmployee(body: EmployeeBody): Promise<[object, boolean | string]> {
  const hash = await bcrypt.hash(body.password, 10);
  const [result, status] = await RepoCreateEmployee(body, hash);

  return [result, status];
}

async function findEmployeeById(params: string): Promise<[object, boolean | string]> {
  const [result, status] = await RepoFindEmployeeById(params);

  return [result, status];
}

async function readAllEmployee(
  page: string
): Promise<[{ read: object[]; count: number }, boolean | string]> {
  const [{ read, count }, status] = await RepoReadAllEmployee(page);

  return [{ read, count }, status];
}

async function readAllEmployeeByRole(
  role: string,
  page: string
): Promise<[{ read: object[]; count: number }, boolean | string]> {
  const [{ read, count }, status] = await RepoReadAllByRole(role, page);
  
  return [{ read, count}, status];
}

async function updateEmployee(
  params: string,
  body: EmployeeBody
): Promise<[object, boolean | string]> {
  const [result, status] = await RepoUpdateEmployee(params, body);

  return [result, status];
}

export { createEmployee, findEmployeeById, readAllEmployee, updateEmployee, readAllEmployeeByRole };
