"use client";
import { Button } from "@/components/ui/button";
import { AlbumData, UserData } from "@/lib/types";
import { useState } from "react";
import EditAlbumDialog from "./EditAlbumDialog";
interface EditAlbumButtonProps {
  album: AlbumData;
}
export default function EditAlbumButton({ album }: EditAlbumButtonProps) {
  const [showDialog, setShowDialog] = useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setShowDialog(true)}>
        Edit album
      </Button>
      <EditAlbumDialog
        album={album}
        open={showDialog}
        onOpenChange={setShowDialog}
      />
    </>
  );
}