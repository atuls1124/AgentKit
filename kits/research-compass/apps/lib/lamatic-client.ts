import { Lamatic } from "lamatic";

function createClient() {
  const missing = [
    "RESEARCH_COMPASS",
    "LAMATIC_API_URL",
    "LAMATIC_PROJECT_ID",
    "LAMATIC_API_KEY"
  ].filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing environment variables: ${missing.join(", ")}. Please add them to your .env.local file.`
    );
  }

  return new Lamatic({
    endpoint: process.env.LAMATIC_API_URL ?? "",
    projectId: process.env.LAMATIC_PROJECT_ID ?? null,
    apiKey: process.env.LAMATIC_API_KEY ?? ""
  });
}

let client: Lamatic | null = null;

export function getLamaticClient(): Lamatic {
  if (!client) {
    client = createClient();
  }
  return client;
}
