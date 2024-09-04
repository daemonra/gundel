import { z } from "zod";

const requiredString = z.string().trim().min(1, "Required");

export const signUpSchema = z.object({
  email: requiredString.email("Invalid email address"),
  username: requiredString.regex(/^[a-zA-Z0-9_-]+$/),
  password: requiredString.min(8, "Must be atleast 8 chars"),
});

export type SignUpValues = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
  username: requiredString,
  password: requiredString,
});

export type LoginValues = z.infer<typeof loginSchema>;

export const createAlbumSchema = z.object({
  name: requiredString,
  content: requiredString,
});

export type AlbumValues = z.infer<typeof createAlbumSchema>;
