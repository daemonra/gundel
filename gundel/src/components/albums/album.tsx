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

interface AlbumProps {
  album: AlbumData;
}

export default function Album({ album }: AlbumProps) {
  const { user } = useSession();

  return (
    <article className="rounded-2xl bg-card relative shadow-sm h-[20rem] overflow-hidden hover:cursor-pointer hover:shadow-lg transition duration-150 ease-in-out hover:ease-in-out">
      <Image
        src={avatarPlaceholder}
        alt="User avatar"
        className="aspect-square object-cover top-0 left-0 h-full w-full"
      />

      <div className="group/album absolute flex flex-col justify-between top-0 left-0 w-full h-full p-5 bg-black/30 hover:bg-black/50 transition duration-150 ease-in-out hover:ease-in-out">

        <div className="flex justify-between gap-3">
          <div className="flex flex-wrap gap-3 text-white">
            <UserTooltip user={album.user}>
              <Link href={`/users/${album.user.username}`}>
                <UserAvatar avatarUrl={album.user.avatarUrl} />
              </Link>
            </UserTooltip>
            <div>
              <Link
                href={`/albums/${album.id}`}
                className="block font-medium hover:underline"
                suppressHydrationWarning
              >
                {album.name}
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
                  By {album.user.displayName}
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
          <div className="whitespace-pre-line break-words text-white mb-3">{album.content}</div>
        </Linkify>

        <BookmarkButton
          albumId={album.id}
          initialState={{
            isBookmarkedByUser: album.bookmarks.some(
              (bookmark) => bookmark.userId === user.id,
            ),
          }}
        />

        {!!album.attachments.length && (
        <MediaPreviews attachments={album.attachments} />
        )}
      </div>
    </article>
  );
}

interface MediaPreviewsProps {
  attachments: Media[];
}
function MediaPreviews({ attachments }: MediaPreviewsProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        attachments.length > 1 && "sm:grid sm:grid-cols-2",
      )}
    >
      {attachments.map((m) => (
        <MediaPreview key={m.id} media={m} />
      ))}
    </div>
  );
}
interface MediaPreviewProps {
  media: Media;
}
function MediaPreview({ media }: MediaPreviewProps) {
  if (media.type === "IMAGE") {
    return (
      <Image
        src={media.url}
        alt="Attachment"
        width={500}
        height={500}
        className="mx-auto size-fit max-h-[30rem] rounded-2xl"
      />
    );
  }
  if (media.type === "VIDEO") {
    return (
      <div>
        <video
          src={media.url}
          controls
          className="mx-auto size-fit max-h-[30rem] rounded-2xl"
        />
      </div>
    );
  }
  return <p className="text-destructive">Unsupported media type</p>;
}