import { AlbumsPage } from "@/lib/types";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
import { deleteAlbum } from "./actions";

import { submitNewMedia } from "./actions";
import { useSession } from "@/app/(main)/SessionProvider";

export function useDeleteAlbumMutation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const mutation = useMutation({
    mutationFn: deleteAlbum,
    onSuccess: async (deletedAlbum) => {
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
              albums: page.albums.filter((p) => p.id !== deletedAlbum.id),
            })),
          };
        },
      );
      toast({
        description: "Album deleted",
      });
      if (pathname === `/albums/${deletedAlbum.id}`) {
        router.push(`/users/${deletedAlbum.user.username}`);
      }
    },
    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to delete album. Please try again.",
      });
    },
  });
  return mutation;
}

export function useSubmitNewMediaMutation() {
  const router = useRouter();

  const { toast } = useToast();

  const queryClient = useQueryClient();

  const { user } = useSession();

  const mutation = useMutation({
    mutationFn: submitNewMedia,
    onSuccess: async (newAlbum) => {
      const queryFilter = {
        queryKey: ["album-feed"],
        predicate(query) {
          return (
            query.queryKey.includes("for-you") ||
            (query.queryKey.includes("user-albums") &&
              query.queryKey.includes(user.id))
          );
        },
      } satisfies QueryFilters;

      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<InfiniteData<AlbumsPage, string | null>>(
        queryFilter,
        (oldData) => {
          const firstPage = oldData?.pages[0];

          if (firstPage) {
            return {
              pageParams: oldData.pageParams,
              pages: [
                {
                  albums: [newAlbum, ...firstPage.albums],
                  nextCursor: firstPage.nextCursor,
                },
                ...oldData.pages.slice(1),
              ],
            };
          }
        },
      );

      queryClient.invalidateQueries({
        queryKey: queryFilter.queryKey,
        predicate(query) {
          return queryFilter.predicate(query) && !query.state.data;
        },
      });

      router.refresh();

      toast({
        description: "Media uploaded",
      });
    },
    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to upload media. Please try again.",
      });
    },
  });

  return mutation;
}
