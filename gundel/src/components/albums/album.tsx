"use client"

import avatarPlaceholder from "@/assets/cover.jpeg";
import { AlbumData } from "@/lib/types";
import { cn, formatRelativeDate } from "@/lib/utils";
import Link from "next/link";
import { Media } from "@prisma/client";
import Image from "next/image";
import Linkify from "../Linkify";
import UserAvatar from "../UserAvatar";
import { useSession } from "@/app/(main)/SessionProvider";
import AlbumMoreButton from "./AlbumMoreButton";
import UserTooltip from "../UserTooltip";
import BookmarkButton from "./BookmarkButton";
import { useRouter } from "next/navigation";

interface AlbumProps {
  album: AlbumData;
}

export default function Album({ album }: AlbumProps) {
  const { user } = useSession();
  const router = useRouter();

  return (
    <article className="rounded-2xl bg-card relative shadow-sm h-[20rem] overflow-hidden hover:cursor-pointer hover:shadow-lg transition duration-150 ease-in-out hover:ease-in-out">
      <Image
        src={album.attachments[0]?.url || avatarPlaceholder}
        alt="User avatar"
        width={1000}
        height={1000}
        className="aspect-square object-cover top-0 left-0 h-full w-full"
      />

      {/* <Link href={`/albums/${album.id}`}> */}
      <div className="group/album absolute flex flex-col justify-between top-0 left-0 w-full h-full p-5 bg-black/30 hover:bg-black/50 transition duration-150 ease-in-out hover:ease-in-out"
        // onClick={(e : any) => {if (e.target) router.push(`/albums/${album.id}`)}}
      >

        <div className="flex justify-between gap-3">
          <div className="flex flex-wrap gap-3 text-white">
            <UserTooltip user={album.user}>
              <Link href={`/users/${album.user.username}`}>
                <UserAvatar avatarUrl={album.user.avatarUrl} />
              </Link>
            </UserTooltip>
            <div className="max-w-[65%]">
              <Link
                href={`/albums/${album.id}`}
                className="block font-medium hover:underline"
                suppressHydrationWarning
              >
                <p className="line-clamp-1">{album.name}</p>
              </Link>
              {/* <Link
                href={`/albums/${album.id}`}
                className="block text-sm text-gray-100 hover:underline"
              >
                {formatRelativeDate(album.createdAt)}
              </Link> */}

              <UserTooltip user={album.user}>
                <Link
                  href={`/users/${album.user.username}`}
                  className="block text-sm text-gray-100 hover:underline"
                >
                  <p className="line-clamp-1">By {album.user.username}</p>
                </Link>
              </UserTooltip>
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
          <div className="whitespace-pre-line break-words text-white mb-3">
            <div className="mb-[1rem]">
              {album.content}
            </div>
            <Link href={"/nothing"} scroll={false} onClick={(e) => { e.preventDefault()}}>
            <BookmarkButton
              albumId={album.id}
              initialState={{
                isBookmarkedByUser: album.bookmarks.some(
                  (bookmark) => bookmark.userId === user.id,
                ),
              }}
            />  
            </Link>
          </div>
        </Linkify>

        

        {/* {!!album.attachments.length && (
        <MediaPreviews attachments={album.attachments} />
        )} */}
      </div>
      {/* </Link> */}
    </article>
  );
}
