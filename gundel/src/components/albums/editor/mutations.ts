import { useToast } from "@/components/ui/use-toast";
import { AlbumsPage } from "@/lib/types";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { submitAlbum } from "./actions";
import { useSession } from "@/app/(main)/SessionProvider";

export function useSubmitAlbumMutation() {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const {user} = useSession();

  const mutation = useMutation({
    mutationFn: submitAlbum,
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

      toast({
        description: "Album created",
      });
    },
    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to album. Please try again.",
      });
    },
  });

  return mutation;
}