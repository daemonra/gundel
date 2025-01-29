"use client"

import Image from "next/image";
import { Media } from "@prisma/client";


interface MediaPreviewsProps {
    attachments: Media[];
  }

export default function MediaPreviews({ attachments }: MediaPreviewsProps) {
    return (
      <>
          {attachments.map((m) => (
            <MediaPreview key={m.id} media={m} />
          ))}
      </>
      // <div
      //   className={cn(
      //     "flex flex-col gap-3",
      //     attachments.length > 1 && "sm:grid sm:grid-cols-2",
      //   )}
      //   className="flex flex-row max-h-24"
      // >
      //   {attachments.map((m) => (
      //     <MediaPreview key={m.id} media={m} />
      //   ))}
      // </div>
    );
  }
  interface MediaPreviewProps {
    media: Media;
  }
  function MediaPreview({ media }: MediaPreviewProps) {
    if (media.type === "IMAGE") {
      return (
        <article
          // className="rounded-2xl bg-card relative shadow-sm"
          className="relative 
          before:absolute
          before:h-full before:w-full
          before:rounded-2xl
          before:z-10
          hover:before:bg-gray-600
          before:transition before:duration-150 before:ease-in-out hover:before:ease-in-out hover:before:shadow-lg
          before:opacity-50
          cursor-pointer"
  
          onClick={() => window.open(media.url, "_blank")}
        >
          <Image
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