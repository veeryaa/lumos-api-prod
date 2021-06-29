import { Membership } from '.prisma/client';
import {
  createMembership as RepoCreateMembership,
  findMembershipById as RepoFindMembershipById,
  readAllMembership as RepoReadAllMembership,
  updateMembership as RepoUpdateMembership,
} from './MembershipRepo';

export interface MembershipBody extends Body {
  membership_id?: string;
  deskripsi?: string;
  minimum_poin?: string;
}

async function createMembership(body: MembershipBody): Promise<[Membership, boolean | string]> {
  const [result, status] = await RepoCreateMembership(body);

  return [result, status];
}

async function findMembershipById(params: string): Promise<[Membership, string | boolean]> {
  const [result, status] = await RepoFindMembershipById(params);

  return [result, status];
}

async function readAllMembership(): Promise<[Membership[], string | boolean]> {
  const [result, status] = await RepoReadAllMembership();

  return [result, status];
}

async function updateMembership(
  params: string,
  body: MembershipBody
): Promise<[Membership, string | boolean]> {
  const [result, status] = await RepoUpdateMembership(params, body);

  return [result, status];
}

export { createMembership, findMembershipById, readAllMembership, updateMembership };
