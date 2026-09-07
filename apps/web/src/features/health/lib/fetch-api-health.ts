import { z } from "zod";

import { apiFetch } from "@/lib/api";

/**
 * Throwaway. The portal has no real data to render yet, so the home page reads
 * the API's health endpoint instead — enough to prove the server-rendered path
 * end to end. Delete this feature once real resources land.
 */
const apiHealthSchema = z.object({
  status: z.literal("ok"),
  checkedAt: z.iso.datetime(),
});

export type ApiHealth =
  | z.infer<typeof apiHealthSchema>
  | { status: "unreachable" };

export async function fetchApiHealth(): Promise<ApiHealth> {
  try {
    const response = await apiFetch("/health");

    if (!response.ok) {
      return { status: "unreachable" };
    }

    const parsed = apiHealthSchema.safeParse(await response.json());

    return parsed.success ? parsed.data : { status: "unreachable" };
  } catch {
    // A page that exists to be indexed should still render when the API is
    // down, so an unreachable API is a state, not an error.
    return { status: "unreachable" };
  }
}
