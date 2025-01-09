import { z } from "zod";

const create = z.object({
  body: z.object({
    name: z.string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    }),
    description: z
      .string({
        invalid_type_error: "Description must be a string",
      })
      .optional(),
  }),
});

const update = z.object({
  body: z.object({
    name: z
      .string({
        invalid_type_error: "Name must be a string",
      })
      .optional(),
    description: z
      .string({
        invalid_type_error: "Description must be a string",
      })
      .optional(),
  }),
});

export const CategoryValidation = {
  create,
  update,
};
