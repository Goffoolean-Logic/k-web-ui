import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: z.object({
        /** Component pages: does it need the JS import, or is it CSS only? */
        kind: z.enum(['css', 'js']).optional(),
      }),
    }),
  }),
};
