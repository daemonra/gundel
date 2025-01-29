"use client"

import avatarPlaceholder from "@/assets/cover.jpeg";
import { AlbumData } from "@/lib/types";
import { cn, formatRelativeDate } from "@/lib/utils";
import Link from "next/link";
import { Media } from "@prisma/client";
import Image from "next/image";
import Linkify from "./Linkify";
import UserAvatar from "./UserAvatar";
import { useSession } from "@/app/(main)/SessionProvider";
import AlbumMoreButton from "./albums/AlbumMoreButton";
import UserTooltip from "./UserTooltip";
import BookmarkButton from "./albums/BookmarkButton";
import { useRouter } from "next/navigation";

interface AlbumProps {
    album: AlbumData;
}

export default function AlbumHeader({ album }: AlbumProps) {

    const { user } = useSession();
    const router = useRouter();

    return (
        <article className="group/album space-y-3 rounded-2xl bg-card p-5 shadow-sm h-full">
          <div className="flex justify-between gap-3">
            <div className="flex flex-wrap gap-3">
              <UserTooltip user={album.user}>
                <Link href={`/users/${album.user.username}`}>
                  <UserAvatar avatarUrl={album.user.avatarUrl} />
                </Link>
              </UserTooltip>
              <div>
                <UserTooltip user={album.user}>
                  <Link
                    href={`/users/${album.user.username}`}
                    className="block font-medium hover:underline"
                  >
                    {album.user.displayName}
                  </Link>
                </UserTooltip>
                <Link
                  href={`/albums/${album.id}`}
                  className="block text-sm text-muted-foreground hover:underline"
                  suppressHydrationWarning
                >
                  {formatRelativeDate(album.createdAt)}
                </Link>
              </div>
            </div>
            {album.user.id === user.id && (
              <AlbumMoreButton
                album={album}
                className="opacity-0 transition-opacity group-hover/album:opacity-100"
              />
            )}
          </div>
          <Linkify>
            <div className="whitespace-pre-line break-words">{album.content}</div>
          </Linkify>
        
          <hr className="text-muted-foreground" />
          <div className="flex justify-between gap-5">
            <BookmarkButton
              albumId={album.id}
              initialState={{
                isBookmarkedByUser: album.bookmarks.some(
                  (bookmark) => bookmark.userId === user.id,
                ),
              }}
              header={true}
            />
          </div>
        </article>
      );
}