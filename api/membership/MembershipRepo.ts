import { PrismaClient, Prisma, Membership } from '.prisma/client';
import { MembershipBody } from './MembershipService';

const prisma = new PrismaClient({ rejectOnNotFound: true });

async function createMembership(body: MembershipBody): Promise<[Membership, string | boolean]> {
  try {
    const { membership_id, deskripsi, minimum_poin } = body;

    const membership: Prisma.MembershipCreateInput = {
      membership_id,
      deskripsi,
      minimum_poin: Number(minimum_poin),
    };

    const insert = await prisma.membership.create({
      data: membership,
    });

    return [insert, true];
  } catch (err) {
    return [err, 'Error'];
  }
}

async function findMembershipById(params: string): Promise<[Membership, string | boolean]> {
  try {
    const read = await prisma.membership.findUnique({
      where: { membership_id: params },
    });

    return [read, true];
  } catch (err) {
    return [err, 'Error'];
  }
}

async function readAllMembership(): Promise<[Membership[], string | boolean]> {
  try {
    const read = await prisma.membership.findMany();

    return [read, true];
  } catch (err) {
    return [err, 'Error'];
  }
}

async function updateMembership(
  params: string,
  body: MembershipBody
): Promise<[Membership, string | boolean]> {
  try {
    const { deskripsi, minimum_poin } = body;

    const membership: Prisma.MembershipUpdateInput = {
      deskripsi,
      minimum_poin: Number(minimum_poin),
    };

    const update = await prisma.membership.update({
      where: {
        membership_id: params,
      },
      data: membership,
    });

    return [update, true];
  } catch (err) {
    return [err, 'Error'];
  }
}

export { createMembership, findMembershipById, readAllMembership, updateMembership };
