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

interface AddAttachmentsButtonProps {
  onFilesSelected: (files: File[]) => void;
  disabled: boolean;
}
function AddAttachmentsButton({
  onFilesSelected,
  disabled,
}: AddAttachmentsButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="text-primary hover:text-primary"
        disabled={disabled}
        onClick={() => fileInputRef.current?.click()}
      >
        <ImageIcon size={20} />
      </Button>
      <input
        type="file"
        accept="image/*, video/*"
        multiple
        ref={fileInputRef}
        className="sr-only hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          if (files.length) {
            onFilesSelected(files);
            e.target.value = "";
          }
        }}
      />
    </>
  );
}
interface AttachmentPreviewsProps {
  attachments: Attachment[];
  removeAttachment: (fileName: string) => void;
}
function AttachmentPreviews({
  attachments,
  removeAttachment,
}: AttachmentPreviewsProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        attachments.length > 1 && "sm:grid sm:grid-cols-2",
      )}
    >
      {attachments.map((attachment) => (
        <AttachmentPreview
          key={attachment.file.name}
          attachment={attachment}
          onRemoveClick={() => removeAttachment(attachment.file.name)}
        />
      ))}
    </div>
  );
}
interface AttachmentPreviewProps {
  attachment: Attachment;
  onRemoveClick: () => void;
}
function AttachmentPreview({
  attachment: { file, mediaId, isUploading },
  onRemoveClick,
}: AttachmentPreviewProps) {
  const src = URL.createObjectURL(file);
  return (
    <div
      className={cn("relative mx-auto size-fit", isUploading && "opacity-50")}
    >
      {file.type.startsWith("image") ? (
        <Image
          src={src}
          alt="Attachment preview"
          width={500}
          height={500}
          className="size-fit max-h-[30rem] rounded-2xl"
        />
      ) : (
        <video controls className="size-fit max-h-[30rem] rounded-2xl">
          <source src={src} type={file.type} />
        </video>
      )}
      {!isUploading && (
        <button
          onClick={onRemoveClick}
          className="absolute right-3 top-3 rounded-full bg-foreground p-1.5 text-background transition-colors hover:bg-foreground/60"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
}
