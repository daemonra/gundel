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
import AlbumMoreButton from "../albums/AlbumMoreButton";
import UserTooltip from "../UserTooltip";
import BookmarkButton from "../albums/BookmarkButton";
import { Edit } from "lucide-react";
import EditAlbumButton from "./EditAlbumButton";
import useMediaUpload, { Attachment } from "./editor/useMediaUpload";
import { ImageIcon, Loader2, X } from "lucide-react";
import LoadingButton from "@/components/LoadingButton";
import { AddAttachmentsButton, AttachmentPreviews } from "./editor/AttachmentComp";
import { useSubmitNewMediaMutation } from "./mutations";


interface AlbumProps {
    album: AlbumData;
}

export default function AlbumHeader({ album }: AlbumProps) {

    const { user } = useSession();

    const mutation = useSubmitNewMediaMutation();

    const {
      startUpload,
      attachments,
      isUploading,
      uploadProgress,
      removeAttachment,
      reset: resetMediaUploads,
    } = useMediaUpload();

    function onSubmit() {
      mutation.mutate({albumId: album.id, mediaIds: attachments.map((a) => a.mediaId).filter(Boolean) as string[], }, {
        onSuccess: () => {
          resetMediaUploads();
        }
      })
    }

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
                    href={`/albums/${album.id}`}
                    className="block font-medium hover:underline"
                  >
                    {album.name}
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

          {!!attachments.length && (
            <AttachmentPreviews
              attachments={attachments}
              removeAttachment={removeAttachment}
            />
          )}
        
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
            {album.user.id === user.id && (
              <div className="flex items-center justify-end gap-3">
                {isUploading && (
                  <>
                    <span className="text-sm">{uploadProgress ?? 0}%</span>
                    <Loader2 className="size-5 animate-spin text-primary" />
                  </>
                )}
                <AddAttachmentsButton
                  onFilesSelected={startUpload}
                  disabled={isUploading || attachments.length >= 5}
                />
                <LoadingButton
                  onClick={onSubmit}
                  loading={mutation.isPending}
                  disabled={attachments.length < 1 || isUploading}
                  className="min-w-20"
                >
                  Add pictures
                </LoadingButton>
                <EditAlbumButton album={album} />
              </div>
            )}
          </div>
        </article>
      );
}