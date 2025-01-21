"use server";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getAlbumDataInclude } from "@/lib/types";

export async function deleteAlbum(id: string) {
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthorized");
  const album = await prisma.album.findUnique({
    where: { id },
  });
  if (!album) throw new Error("Album not found");
  if (album.userId !== user.id) throw new Error("Unauthorized");
  const deletedAlbum = await prisma.album.delete({
    where: { id },
    include: getAlbumDataInclude(user.id),
  });
  return deletedAlbum;
}
