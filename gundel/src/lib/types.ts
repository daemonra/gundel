import { Prisma } from "@prisma/client";

export const albumDataInclude = {
  user: {
    select: {
      username: true,
      displayName: true,
      avatarUrl: true,
    },
  },
} satisfies Prisma.AlbumInclude;

export type AlbumData = Prisma.AlbumGetPayload<{
  include: typeof albumDataInclude;
}>;