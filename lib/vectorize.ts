type VectorizeQueryOptions = {
  vector: number[];
  topK?: number;
  returnValues?: boolean;
  returnMetadata?: "none" | "indexed" | "all";
  filter?: Record<string, unknown>;
};

type VectorizeMatch = {
  id: string;
  score: number;
  values?: number[];
  metadata?: Record<string, unknown>;
};

type CloudflareApiResponse<T> = {
  success: boolean;
  errors: Array<{ code: number; message: string }>;
  messages: string[];
  result: T;
};

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing env: ${name}`);
  }
  return value;
}

function vectorizeBaseUrl() {
  const accountId = requireEnv("CLOUDFLARE_ACCOUNT_ID");
  const index = requireEnv("CLOUDFLARE_VECTORIZE_INDEX");
  return `https://api.cloudflare.com/client/v4/accounts/${accountId}/vectorize/v2/indexes/${index}`;
}

async function vectorizeFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const token = requireEnv("CLOUDFLARE_API_TOKEN");
  const res = await fetch(`${vectorizeBaseUrl()}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const data = (await res.json()) as CloudflareApiResponse<T>;
  if (!res.ok || !data.success) {
    const message =
      data.errors?.map((e) => e.message).join("; ") ||
      `Vectorize request failed (${res.status})`;
    throw new Error(message);
  }

  return data.result;
}

/** Query nearest neighbors for an embedding vector. */
export async function queryVectorize(options: VectorizeQueryOptions) {
  const {
    vector,
    topK = 5,
    returnValues = false,
    returnMetadata = "all",
    filter,
  } = options;

  return vectorizeFetch<{
    count: number;
    matches: VectorizeMatch[];
  }>("/query", {
    method: "POST",
    body: JSON.stringify({
      vector,
      topK,
      returnValues,
      returnMetadata,
      ...(filter ? { filter } : {}),
    }),
  });
}

/** Upsert vectors into the index. */
export async function upsertVectors(
  vectors: Array<{
    id: string;
    values: number[];
    metadata?: Record<string, unknown>;
  }>,
) {
  return vectorizeFetch<{ mutationId: string }>("/upsert", {
    method: "POST",
    body: JSON.stringify({ vectors }),
  });
}
