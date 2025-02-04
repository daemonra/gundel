import avatarPlaceholder from "@/assets/4.jpg";
import CropImageDialog from "@/components/CropImageDialog";
import LoadingButton from "@/components/LoadingButton";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlbumData } from "@/lib/types";
import {
  updateUserAlbumSchema,
  UpdateUserAlbumValues,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Resizer from "react-image-file-resizer";
import { useUpdateAlbumMutation } from "@/app/(main)/albums/[albumId]/mutations";

interface EditAlbumDialogProps {
  album: AlbumData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditAlbumDialog({
  album,
  open,
  onOpenChange,
}: EditAlbumDialogProps) {

  const form = useForm<UpdateUserAlbumValues>({
    resolver: zodResolver(updateUserAlbumSchema),
    defaultValues: {
      name: album.name,
      content: album.content || "",
      // mediaIds: album.attachments.map((attachment) => attachment.id),
    },
  });

  const mutation = useUpdateAlbumMutation(album.id);
  
  async function onSubmit(values: UpdateUserAlbumValues) {
    mutation.mutate(
      {
        values,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Album</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Album name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your album name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us a little bit about your album"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <LoadingButton type="submit" loading={mutation.isPending}>
                Save
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}