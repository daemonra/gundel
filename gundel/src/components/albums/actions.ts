"use server";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getAlbumDataInclude } from "@/lib/types";
import { MediaValues, createMediaSchema } from "@/lib/validation";

export async function deleteAlbum(id: string) {
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthorized");
  const album = await prisma.album.findUnique({
    where: { id },
    select: { userId: true },
  });
  if (!album) throw new Error("Album not found");
  if (album.userId !== user.id) throw new Error("Unauthorized");
  const deletedAlbum = await prisma.album.delete({
    where: { id },
    include: getAlbumDataInclude(user.id),
  });
  return deletedAlbum;
}

export async function submitNewMedia(credentials: MediaValues) {
  const { user } = await validateRequest();

  if (!user) throw Error("Unauthorized");

  const { albumId, mediaIds } = createMediaSchema.parse(credentials);

  const album = await prisma.album.findUnique({
    where: { id: albumId },
    select: { userId: true },
  });

  if (album?.userId !== user.id) throw new Error("Unauthorized");

  const updateAlbum = await prisma.album.update({
    where: { id: albumId },
    data: {
      attachments: {
        connect: mediaIds.map((id) => ({ id })),
      },
    },
    include: getAlbumDataInclude(user.id),
  });

  return updateAlbum;
}
