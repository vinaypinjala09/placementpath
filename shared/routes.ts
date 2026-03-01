import { z } from "zod";
import { AnalysisResponseSchema } from "./schema";

export const errorSchemas = {
  notFound: z.object({ message: z.string() }),
  internal: z.object({ message: z.string() }),
  validation: z.object({ message: z.string() })
};

export const api = {
  analyze: {
    method: 'GET' as const,
    path: '/api/analyze' as const,
    input: z.object({
      username: z.string()
    }),
    responses: {
      200: AnalysisResponseSchema,
      400: errorSchemas.validation,
      404: errorSchemas.notFound,
      500: errorSchemas.internal
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
