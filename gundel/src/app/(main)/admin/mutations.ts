import { AlbumsPage, UsersPage } from "@/lib/types";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { deleteUser, approveUser } from "./actions";

export function useDeleteUserMutation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const mutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: async (deletedUser) => {
      const queryFilter: QueryFilters = { queryKey: ["pending-users"] };
      await queryClient.cancelQueries(queryFilter);      
      toast({
        description: "User deleted successfully",
      });
      router.refresh();
    },
    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Something went wrong. Please try again.",
      });
    },
  });
  return mutation;
}

export function useApproveUserMutation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const mutation = useMutation({
    mutationFn: approveUser,
    onSuccess: async (approvedUser) => {
      const queryFilter: QueryFilters = { queryKey: ["pending-users"] };
      await queryClient.cancelQueries(queryFilter);
      toast({
        description: "User approved successfully",
      });
      router.refresh();
    },
    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Something went wrong. Please try again.",
      });
    },
  });
  return mutation;
}
