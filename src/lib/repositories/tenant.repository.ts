import { Tenant } from '@/types/tenant';
import { prisma } from '@/lib/prisma';

export interface ITenantRepository {
  findById(id: string): Promise<Tenant | null>;
  findByDomain(domain: string): Promise<Tenant | null>;
}

export class PrismaTenantRepository implements ITenantRepository {
  async findById(id: string): Promise<Tenant | null> {
    return prisma.tenant.findUnique({ where: { id } });
  }

  async findByDomain(domain: string): Promise<Tenant | null> {
    return prisma.tenant.findUnique({ where: { domain } });
  }
}
