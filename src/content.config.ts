import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const casinos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/casinos' }),
  schema: z.object({
    casino: z.string(),
    slug: z.string(),
    title: z.string(),
    byline: z.string().optional(),
    site: z.string().optional(),
    updated: z.coerce.string().optional(),
    verdict: z.string().nullable().optional(),
    played_since: z.string().nullable().optional(),
    wagered_usd: z.number().nullable().optional(),
    vip_level: z.string().nullable().optional(),
    kyc: z.string().nullable().optional(),
    speed: z.string().nullable().optional(),
    problems: z.string().nullable().optional(),
    referral: z.string().nullable().optional(),
    referral_code: z.string().nullable().optional(),
    author: z.string().optional(),
    status: z.string().optional(),
    limited_experience: z.boolean().optional(),
  }).passthrough(),
});

export const collections = { casinos };
