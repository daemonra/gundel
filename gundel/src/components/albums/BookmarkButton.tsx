import kyInstance from "@/lib/ky";
import { BookmarkInfo } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Bookmark } from "lucide-react";
import { useToast } from "../ui/use-toast";
interface BookmarkButtonProps {
  albumId: string;
  initialState: BookmarkInfo;
}
export default function BookmarkButton({
  albumId,
  initialState,
}: BookmarkButtonProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const queryKey: QueryKey = ["bookmark-info", albumId];
  const { data } = useQuery({
    queryKey,
    queryFn: () =>
      kyInstance.get(`/api/albums/${albumId}/bookmark`).json<BookmarkInfo>(),
    initialData: initialState,
    staleTime: Infinity,
  });
  const { mutate } = useMutation({
    mutationFn: () =>
      data.isBookmarkedByUser
        ? kyInstance.delete(`/api/albums/${albumId}/bookmark`)
        : kyInstance.post(`/api/albums/${albumId}/bookmark`),
    onMutate: async () => {
      toast({
        description: `Album ${data.isBookmarkedByUser ? "un" : ""}bookmarked`,
      });
      await queryClient.cancelQueries({ queryKey });
      const previousState = queryClient.getQueryData<BookmarkInfo>(queryKey);
      queryClient.setQueryData<BookmarkInfo>(queryKey, () => ({
        isBookmarkedByUser: !previousState?.isBookmarkedByUser,
      }));
      return { previousState };
    },
    onError(error, variables, context) {
      queryClient.setQueryData(queryKey, context?.previousState);
      console.error(error);
      toast({
        variant: "destructive",
        description: "Something went wrong. Please try again.",
      });
    },
  });
  return (
    <button onClick={() => mutate()} className="flex items-center gap-2">
      <Bookmark
        className={cn(
          "size-5 text-white",
          data.isBookmarkedByUser && "fill-primary text-primary",
        )}
      />
    </button>
  );
}