import { z } from "zod";

export const formSchema = z.object({
  name: z.string(),
  description: z.string(),
  picture: z.unknown().transform((value) => {
    return value as FileList;
  }),
  prepTime: z.coerce.number().min(1),
  cookTime: z.coerce.number().min(1),
  servings: z.coerce.number().min(1),
  ingredients: z.array(z.object({ label: z.string() })),
  steps: z.array(z.object({ label: z.string() })),
});

export type FormSchema = z.infer<typeof formSchema>;
