"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { AlbumValues, createAlbumSchema } from "@/lib/validation";

export async function submitAlbum(credentials: AlbumValues) {
  const { user } = await validateRequest();

  if (!user) throw Error("Unauthorized");

  const { name, content } = createAlbumSchema.parse(credentials);

  await prisma.album.create({
    data: {
      name: name,
      content: content,
      userId: user.id,
    },
  });
}
