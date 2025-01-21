"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
// import { albumDataInclude } from "@/lib/types";
import { getAlbumDataInclude } from "@/lib/types";
import { AlbumValues, createAlbumSchema } from "@/lib/validation";

export async function submitAlbum(credentials: AlbumValues) {
  const { user } = await validateRequest();

  if (!user) throw Error("Unauthorized");

  const { name, content } = createAlbumSchema.parse(credentials);

  const newAlbum = await prisma.album.create({
    data: {
      name: name,
      content: content,
      userId: user.id,
    },
    include: getAlbumDataInclude(user.id),
  });

  return newAlbum;
}
