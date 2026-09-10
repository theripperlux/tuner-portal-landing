export type CustomerRole = "CUSTOMER" | "TENANT_OWNER" | "ADMIN";

export interface CustomerProfile {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  companyName: string | null;
  address: string | null;
  zip: string | null;
  country: string | null;
  euVat: string | null;
  phone: string | null;
  role: CustomerRole;
  tenantId: string | null;
  credits: number;
  createdAt: Date;
  updatedAt: Date;
}
