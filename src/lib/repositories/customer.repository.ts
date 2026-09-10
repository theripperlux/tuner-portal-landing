import { CustomerProfile } from '@/types/customer';
import { prisma } from '@/lib/prisma';

export interface ICustomerRepository {
  findById(id: string): Promise<CustomerProfile | null>;
  findByEmail(email: string): Promise<CustomerProfile | null>;
}

export class PrismaCustomerRepository implements ICustomerRepository {
  async findById(id: string): Promise<CustomerProfile | null> {
    const user = await prisma.user.findUnique({ where: { id } });
    return user ? (user as unknown as CustomerProfile) : null;
  }

  async findByEmail(email: string): Promise<CustomerProfile | null> {
    const user = await prisma.user.findUnique({ where: { email } });
    return user ? (user as unknown as CustomerProfile) : null;
  }
}
