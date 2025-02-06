import { AlbumsPage } from "@/lib/types";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
import { deleteMedia } from "./actions";

export function useDeleteMediaMutation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const mutation = useMutation({
    mutationFn: deleteMedia,
    onSuccess: async (albumOfDeletedMedia) => {
      const queryFilter: QueryFilters = { queryKey: ["album-feed"] };
      await queryClient.cancelQueries(queryFilter);
      queryClient.setQueriesData<InfiniteData<AlbumsPage, string | null>>(
        queryFilter,
        (oldData) => {
          if (!oldData) return;
          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              nextCursor: page.nextCursor,
              albums: page.albums.filter((p) => p.id !== albumOfDeletedMedia.id),
            })),
          };
        },
      );
      router.refresh();
      toast({
        description: "Picture deleted",
      });
    },
    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to delete picture. Please try again.",
      });
    },
  });
  return mutation;
}