import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Check, X } from "lucide-react";
import LoadingButton from "@/components/LoadingButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteUserMutation, useApproveUserMutation } from "./mutations";

interface ApproveButtonProps {
  userId: string;
}

export function ApproveButton({ userId }: ApproveButtonProps) {
  const mutation = useApproveUserMutation();

  return (
    <LoadingButton
      variant="default"
      onClick={() => mutation.mutate(userId)}
      loading={mutation.isPending}
    >
      <Check className="size-5" />
      Approve
    </LoadingButton>
  );
}

export function DeleteButton({ userId }: ApproveButtonProps) {
  const [showDialog, setShowDialog] = useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setShowDialog(true)}>
        <X />
      </Button>
      <DeleteUserDialog
        userId={userId}
        open={showDialog}
        onClose={() => setShowDialog(false)}
      />
    </>
  );
}

interface DeleteUserDialogProps {
  userId: string;
  open: boolean;
  onClose: () => void;
}

export function DeleteUserDialog({
  userId,
  open,
  onClose,
}: DeleteUserDialogProps) {
  const mutation = useDeleteUserMutation();

  function handleOpenChange(open: boolean) {
    if (!open || !mutation.isPending) {
      onClose();
    }
  }
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete user?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this user? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <LoadingButton
            variant="destructive"
            onClick={() => mutation.mutate(userId, { onSuccess: onClose })}
            loading={mutation.isPending}
          >
            Delete
          </LoadingButton>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// const mutation = useMutation({
//   mutationFn: () =>
//       kyInstance.delete(`/api/users/${userId}/approve-user`),
//   onMutate: async () => {
//     const queryFilter: QueryFilters = { queryKey: ["pending-users"] };
//     await queryClient.cancelQueries(queryFilter);
//     queryClient.setQueriesData<InfiniteData<UsersPage, string | null>>(
//       queryFilter,
//       (oldData) => {
//         if (!oldData) return;
//         return {
//           pageParams: oldData.pageParams,
//           pages: oldData.pages.map((page) => ({
//             nextCursor: page.nextCursor,
//             albums: page.users.filter((u) => u.id !== userId),
//           })),
//         };
//       },
//     );
//     toast({
//       description: `User deleted successfully.`,
//     });
//   },
//   onSuccess: () => {
//     onClose();
//     router.refresh();
//   } ,
//   onError(error) {
//     console.error(error);
//     toast({
//       variant: "destructive",
//       description: "Something went wrong. Please try again.",
//     });
//   },
// });

// const mutation = useMutation({
//   mutationFn: () =>
//       kyInstance.post(`/api/users/${userId}/approve-user`).json(),
//   onMutate: async () => {
//     toast({
//       description: `User approved successfully.`,
//     });
//     await queryClient.cancelQueries({ queryKey });
//   },
//   onSuccess: () => {
//     router.refresh();
//   },
//   onError(error) {
//     console.error(error);
//     toast({
//       variant: "destructive",
//       description: "Something went wrong. Please try again.",
//     });
//   },
// });
