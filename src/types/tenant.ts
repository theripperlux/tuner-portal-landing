export interface Tenant {
  id: string;
  name: string;
  domain: string | null;
  logoUrl: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  ownerId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TenantSettings {
  id: string;
  tenantId: string;
  companyName: string | null;
  companyAddress: string | null;
  companyPhone: string | null;
  companyVat: string | null;
}
