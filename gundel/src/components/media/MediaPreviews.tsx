"use client"

import Image from "next/image";
import { Media } from "@prisma/client";
import MediaMoreButton from "./MediaMoreButton";
import { AlbumData } from "@/lib/types";
import { customLoader } from "@/lib/utils";
import { useSession } from "@/app/(main)/SessionProvider";

  interface MediaPreviewProps {
    album: AlbumData;
    media: Media;
  }
  export function MediaPreview({ album, media }: MediaPreviewProps) {
    const { user } = useSession();

    if (media.type === "IMAGE") {
      return (
        <article
          className="relative 
          before:absolute
          before:h-full before:w-full
          before:rounded-2xl
          before:z-10
          hover:before:bg-gray-600
          before:transition before:duration-150 before:ease-in-out hover:before:ease-in-out hover:before:shadow-lg
          before:opacity-50
          cursor-pointer group/media"
        >
          {album.user.id === user.id && (
          <MediaMoreButton
            mediaId={media.id}
            className="absolute top-3 right-3 opacity-0 transition-opacity group-hover/media:opacity-100 z-20"
          />
          )}

          <Image
            loader={customLoader}
            src={media.url}
            alt="Attachment"
            width={500}
            height={500}
            className="mx-auto size-fit w-full rounded-2xl 
            cursor-pointer relative"
          />
          
        </article>
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