const ICD_TOKEN_URL = "https://icdaccessmanagement.who.int/connect/token";
const ICD_SEARCH_URL = "https://id.who.int/icd/entity/search";

// ─── TOKEN CACHE ──────────────────────────────────────────────
// Token WHO berlaku 1 jam — kita cache supaya tidak request token
// baru di setiap API call
let cachedToken: string | null = null;
let tokenExpiry: number = 0;

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const response = await fetch(ICD_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.ICD_CLIENT_ID!,
      client_secret: process.env.ICD_CLIENT_SECRET!,
      scope: "icdapi_access",
      grant_type: "client_credentials",
    }),
  });

  if (!response.ok) {
    throw new Error(`ICD auth failed: ${response.status}`);
  }

  const data = await response.json();
  cachedToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;

  return cachedToken!;
}

// ─── TYPES ────────────────────────────────────────────────────
export interface ICDResult {
  code: string;
  title: string;
  definition?: string;
}

// ─── SEARCH ───────────────────────────────────────────────────
export async function searchICD(query: string): Promise<ICDResult | null> {
  try {
    const token = await getAccessToken();

    const url = new URL(ICD_SEARCH_URL);
    url.searchParams.set("q", query);
    url.searchParams.set("releaseId", "2024-01");
    url.searchParams.set("linearizationname", "mms");
    url.searchParams.set("flatResults", "true");
    url.searchParams.set("highlightingEnabled", "false");

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Accept-Language": "en",
        "API-Version": "v2",
      },
    });

    if (!response.ok) {
      throw new Error(`ICD search failed: ${response.status}`);
    }

    const data = await response.json();
    const entities = data.destinationEntities ?? [];

    if (entities.length === 0) return null;

    const top = entities[0];

    return {
      code: top.theCode ?? "",
      title: top.title?.["@value"] ?? top.title ?? "",
      definition: top.definition?.["@value"] ?? undefined,
    };
  } catch (error) {
    // ICD API gagal = jangan crash app
    // Caller akan pakai data dari Gemini sebagai fallback
    console.error("[icd.ts] searchICD error:", error);
    return null;
  }
}

// ─── ENRICH ───────────────────────────────────────────────────
// Fungsi ini dipanggil dari route.ts untuk enrich semua conditions
// sekaligus dengan Promise.allSettled — parallel, tidak blocking
export async function enrichConditions(
  conditions: { name: string; icd: string; match: number }[]
) {
  const results = await Promise.allSettled(
    conditions.map(async (condition) => {
      const icdResult = await searchICD(condition.name);
      return {
        ...condition,
        icd: icdResult?.code || condition.icd, // fallback ke kode Gemini
      };
    })
  );

  return results.map((result, i) =>
    result.status === "fulfilled" ? result.value : conditions[i]
  );
}