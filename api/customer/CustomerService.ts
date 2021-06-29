import {
  createCustomer as RepoCreateCustomer,
  readAllCustomer as RepoReadAllCustomer,
  readAllCustomerByMembership as RepoReadByMembership,
  findCustomerById as RepoFindCustomerByid,
  updateCustomer as RepoUpdateCustomer,
} from './CustomerRepo';
import bcrypt from 'bcrypt';
import { Customer } from '.prisma/client';

export interface CustomerBody extends Body {
  nama?: string;
  kota?: string;
  email?: string;
  tanggal_lahir?: string;
  point?: number;
  membership_id?: string;
  handphone?: string;
  password?: string;
}

async function createCustomer(body: CustomerBody): Promise<[object, boolean | string]> {
  const hash = await bcrypt.hash(body.password, 10);
  const [result, status] = await RepoCreateCustomer(body, hash);

  return [result, status];
}

async function readAllCustomer(
  page: string
): Promise<[{ read: Customer[]; count: number }, boolean | string]> {
  const [{ read, count }, status] = await RepoReadAllCustomer(page);

  return [{ read, count }, status];
}

async function readAllCustomerByMembership(
  membership: string,
  page: string
): Promise<[{ read: Customer[]; count: number }, boolean | string]> {
  const [{ read, count }, status] = await RepoReadByMembership(membership, page);
  console.log(read);
  return [{ read, count }, status];
}

async function findCustomerById(params: string): Promise<[Customer, string | boolean]> {
  const [result, status] = await RepoFindCustomerByid(params);

  return [result, status];
}

async function updateCustomer(params: string, body: CustomerBody): Promise<[Customer, string | boolean]> {
  const [result, status] = await RepoUpdateCustomer(params, body);

  return [result, status];
}

export { createCustomer, readAllCustomer, readAllCustomerByMembership, findCustomerById, updateCustomer };
