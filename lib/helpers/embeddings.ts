const EMBEDDING_MODEL =
  process.env.CLOUDFLARE_EMBEDDING_MODEL ?? "@cf/baai/bge-base-en-v1.5";

type CloudflareApiResponse<T> = {
  success: boolean;
  errors: Array<{ code: number; message: string }>;
  result: T;
};

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing env: ${name}`);
  }
  return value;
}

/** Embed text with Workers AI (@cf/baai/bge-base-en-v1.5 → 768-d). */
export async function embedText(text: string): Promise<number[]> {
  const accountId = requireEnv("CLOUDFLARE_ACCOUNT_ID");
  const token = requireEnv("CLOUDFLARE_API_TOKEN");

  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${EMBEDDING_MODEL}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: [text] }),
    },
  );

  const data = (await res.json()) as CloudflareApiResponse<{
    data: number[][];
  }>;

  if (!res.ok || !data.success || !data.result?.data?.[0]) {
    const message =
      data.errors?.map((e) => e.message).join("; ") ||
      `Workers AI embed failed (${res.status})`;
    throw new Error(message);
  }

  return data.result.data[0];
}
