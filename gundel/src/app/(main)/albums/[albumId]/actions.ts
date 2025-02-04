"use server";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";
import { getAlbumDataInclude } from "@/lib/types";
import {
  updateUserAlbumSchema,
  UpdateUserAlbumValues,
} from "@/lib/validation";

export async function updateUserAlbum(values: UpdateUserAlbumValues, albumId: string) {
  const validatedValues = updateUserAlbumSchema.parse(values);
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthorized");
  console.log("user", user);
  await prisma.album.update({
    where: { 
      id: albumId,
      userId: user.id,
    },
    data: validatedValues,
  });
 
  const updatedAlbum = await prisma.album.findUnique({
    where: {
      id: albumId,
    },
    include: getAlbumDataInclude(user.id),
  });

  return updatedAlbum;
}