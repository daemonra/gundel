import { useToast } from "@/components/ui/use-toast";
import { AlbumsPage } from "@/lib/types";
import { useUploadThing } from "@/lib/uploadthing";
import { UpdateUserAlbumValues } from "@/lib/validation";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { updateUserAlbum } from "./actions";


export function useUpdateAlbumMutation(albumId: string) {
  const { toast } = useToast();
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: async ({
      values,
    }: {
      values: UpdateUserAlbumValues;
    }) => {
      return Promise.all([
        updateUserAlbum(values, albumId),
      ]);
    },
    onSuccess: () => {
      router.refresh();
      toast({
        description: "Album updated",
      });
    },
    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to update album. Please try again.",
      });
    },
  });
  return mutation;
}