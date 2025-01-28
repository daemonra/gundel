import { Prisma } from "@prisma/client";

export const userDataSelect = {
  id: true,
  username: true,
  displayName: true,
  avatarUrl: true,
  bio: true,
  approved: true,
  createdAt: true,
  _count: {
    select: {
      albums: true,
    },
  },
} satisfies Prisma.UserSelect;

export const albumDataInclude = {
  user: {
    select: {
      id: true,
      username: true,
      displayName: true,
      avatarUrl: true,
    },
  },
} satisfies Prisma.AlbumInclude;


export function getUserDataSelect(loggedInUserId: string) {
  return {
    id: true,
    username: true,
    displayName: true,
    avatarUrl: true,
    bio: true,
    approved: true,
    createdAt: true,
    followers: {
      where: {
        followerId: loggedInUserId,
      },
      select: {
        followerId: true,
      },
    },
    _count: {
      select: {
        albums: true,
        followers: true,
      },
    },
  } satisfies Prisma.UserSelect;
}

export function getAlbumDataInclude(loggedInUserId: string, isPreview = false) {
  if (isPreview) {
    return {
      user: {
        select: getUserDataSelect(loggedInUserId),
      },
      attachments: {
        take: 1,
      },
      bookmarks: {
        where: {
          userId: loggedInUserId,
        },
        select: {
          userId: true,
        },
      },
    } satisfies Prisma.AlbumInclude;
  } else {
    return {
      user: {
        select: getUserDataSelect(loggedInUserId),
      },
      attachments: true,
      bookmarks: {
        where: {
          userId: loggedInUserId,
        },
        select: {
          userId: true,
        },
      },
    } satisfies Prisma.AlbumInclude;
  }
}

export type UserData = Prisma.UserGetPayload<{
  select: ReturnType<typeof getUserDataSelect>;
}>;

export type AlbumData = Prisma.AlbumGetPayload<{
  include: ReturnType<typeof getAlbumDataInclude>;
}>;

export interface AlbumsPage {
  albums: AlbumData[];
  nextCursor: string | null;
}


export interface UsersPage {
  users: UserData[];
  nextCursor: string | null;
}

export interface FollowerInfo {
  followers: number;
  isFollowedByUser: boolean;
}

export interface BookmarkInfo {
  isBookmarkedByUser: boolean;
}