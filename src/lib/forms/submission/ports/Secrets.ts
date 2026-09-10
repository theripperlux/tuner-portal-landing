export type AdapterSecretReference = {
  provider: "environment" | "secret_manager";
  key: string;
};

// This type is opaque to the generic pipeline
export type ResolvedAdapterSecret = unknown;

export interface AdapterSecretResolver {
  resolve(reference: AdapterSecretReference): Promise<ResolvedAdapterSecret>;
}
