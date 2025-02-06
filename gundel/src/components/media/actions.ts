"use server";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getAlbumDataInclude } from "@/lib/types";

export async function deleteMedia(id: string) {
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthorized");
  const media = await prisma.media.findUnique({
    where: { id },
  });

  if (!media) throw new Error("Media not found");
  const album = await prisma.album.findUnique({
    where: { 
      id: media.albumId ?? undefined,
    },
  });
  if (!album) throw new Error("Album not found");

  if (album.userId !== user.id) throw new Error("Unauthorized");
  const deletedMedia = await prisma.media.update({
    where: { id },
    data: {
      albumId: null
    },
  });
  return album;
}
