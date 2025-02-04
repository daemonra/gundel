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
  mediaIds: z.array(z.string()).max(5, "Cannot have more than 5 attachments"),
});

export type AlbumValues = z.infer<typeof createAlbumSchema>;

export const updateUserProfileSchema = z.object({
  displayName: requiredString,
  bio: z.string().max(1000, "Must be at most 1000 characters"),
});
export type UpdateUserProfileValues = z.infer<typeof updateUserProfileSchema>;

export const updateUserAlbumSchema = z.object({
  name: requiredString,
  content: requiredString,
});
export type UpdateUserAlbumValues = z.infer<typeof updateUserAlbumSchema>;

export const createMediaSchema = z.object({
  albumId: requiredString,
  mediaIds: z.array(z.string()).max(5, "Cannot have more than 5 attachments"),
});

export type MediaValues = z.infer<typeof createMediaSchema>;