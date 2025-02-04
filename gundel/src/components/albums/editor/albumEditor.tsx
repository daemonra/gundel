"use client";

import { EditorContent, EditorProvider, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { submitAlbum } from "./actions";
import UserAvatar from "@/components/UserAvatar";
import { useSession } from "@/app/(main)/SessionProvider";
import { Button } from "@/components/ui/button";
import "./styles.css";
import { useSubmitAlbumMutation } from "./mutations";
import LoadingButton from "@/components/LoadingButton";
import { cn } from "@/lib/utils";
import { ImageIcon, Loader2, X } from "lucide-react";
import Image from "next/image";
import useMediaUpload, { Attachment } from "./useMediaUpload";
import { ClipboardEvent, useRef } from "react";
import { useDropzone } from "@uploadthing/react";
import { AddAttachmentsButton, AttachmentPreviews } from "./AttachmentComp";

export default function AlbumEditor() {
  const { user } = useSession();

  const mutation = useSubmitAlbumMutation();

  const {
    startUpload,
    attachments,
    isUploading,
    uploadProgress,
    removeAttachment,
    reset: resetMediaUploads,
  } = useMediaUpload();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: startUpload,
  });
  const { onClick, ...rootProps } = getRootProps();


  const editor1 = useEditor({
    extensions: [
      StarterKit.configure({
        bold: false,
        italic: false,
      }),
      Placeholder.configure({
        placeholder: "Album name",
      }),
    ],
  });

  const editor2 = useEditor({
    extensions: [
      StarterKit.configure({
        bold: false,
        italic: false,
      }),
      Placeholder.configure({
        placeholder: "Album description...",
      }),
    ],
  });

  const inputAlbumName =
    editor1?.getText({
      blockSeparator: "\n",
    }) || "";

  const inputAlbumDesc =
    editor2?.getText({
      blockSeparator: "\n",
    }) || "";

  function onSubmit() {
    mutation.mutate({ name: inputAlbumName, content: inputAlbumDesc, mediaIds: attachments.map((a) => a.mediaId).filter(Boolean) as string[], }, {
      onSuccess: () => {
        editor1?.commands.clearContent();
        editor2?.commands.clearContent();
        resetMediaUploads();
      }
    })
  }

  function onPaste(e: ClipboardEvent<HTMLInputElement>) {
    const files = Array.from(e.clipboardData.items)
      .filter((item) => item.kind === "file")
      .map((item) => item.getAsFile()) as File[];
    startUpload(files);
  }

  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex gap-5">
        <div>
          <UserAvatar avatarUrl={user.avatarUrl} className="hidden sm:inline" />
        </div>
        <div className="w-full space-y-3">
          <EditorContent
            editor={editor1}
            className="w-1/2 max-h-[20rem] overflow-y-auto bg-background rounded-lg px-5 py-3 text-base"
          />
          <EditorContent
            editor={editor2}
            className={cn(
              "w-full max-h-[20rem] min-h-[5rem] overflow-y-auto bg-background rounded-lg px-5 py-3 text-base",
              isDragActive && "outline-dashed",
            )}
            onPaste={onPaste}
          />
        </div>
      </div>    
      {!!attachments.length && (
        <AttachmentPreviews
          attachments={attachments}
          removeAttachment={removeAttachment}
        />
      )}
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
          disabled={!inputAlbumName.trim() || isUploading}
          className="min-w-20"
        >
          Create album
        </LoadingButton>
      </div>
    </div>
  );
}
