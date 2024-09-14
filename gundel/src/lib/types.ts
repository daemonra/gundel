import { Prisma } from "@prisma/client";

export const userDataSelect = {
  id: true,
  username: true,
  displayName: true,
  avatarUrl: true,
  bio: true,
  createdAt: true,
  _count: {
    select: {
      albums: true,
    },
  },
} satisfies Prisma.UserSelect;

export type UserData = Prisma.UserGetPayload<{
  select: typeof userDataSelect;
}>;

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

export interface AlbumsPage {
  albums: AlbumData[];
  nextCursor: string | null;
}