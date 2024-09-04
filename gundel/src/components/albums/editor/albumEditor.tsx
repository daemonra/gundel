"use client";

import { EditorContent, EditorProvider, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { submitAlbum } from "./actions";
import UserAvatar from "@/components/UserAvatar";
import { useSession } from "@/app/(main)/SessionProvider";
import { Button } from "@/components/ui/button";
import "./styles.css";

export default function AlbumEditor() {
  const { user } = useSession();

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

  async function onSubmit() {
    await submitAlbum({ name: inputAlbumName, content: inputAlbumDesc });
    editor1?.commands.clearContent();
    editor2?.commands.clearContent();
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
            className="w-full max-h-[20rem] min-h-[5rem] overflow-y-auto bg-background rounded-lg px-5 py-3 text-base"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          onClick={onSubmit}
          disabled={!inputAlbumName.trim()}
          className="min-w-20"
        >
          Create album
        </Button>
      </div>
    </div>
  );
}
