import { TenantScope } from "../dashboard.repository.types";

export type CustomerFilesPageQuery = {
  readonly cursor?: string;
  readonly limit: number;
};

export type TuningJobListItem = {
  id: string;
  status: string;
  originalFilename: string;
  vehicleDetails?: string;
  calculatedCreditCost: number;
  createdAt: Date;
};

export type CustomerFilesPage = {
  readonly items: readonly TuningJobListItem[];
  readonly nextCursor: string | null;
};

export interface TuningJobDetails {
  id: string;
  status: string;
  originalFilename: string;
  originalFileId: string;
  tunedFileId: string | null;
  calculatedCreditCost: number;
  createdAt: Date;
}

export interface CustomerFilesRepository {
  findPage(
    scope: TenantScope,
    query: CustomerFilesPageQuery,
  ): Promise<CustomerFilesPage>;

  findById(
    scope: TenantScope,
    jobId: string,
  ): Promise<TuningJobDetails | null>;
}
