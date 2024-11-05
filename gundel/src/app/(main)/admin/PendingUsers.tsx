"use client";

import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import AlbumsLoadingSkeleton from "@/components/albums/AlbumLoadingSkeleton";
// import Album from "@/components/albums/album";
import kyInstance from "@/lib/ky";
import { UsersPage } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import UserFeed from "@/components/UserFeed";


export default function PendingUsers() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["users-feed", "pending-users"],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          `/api/users/pending-users`,
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        )
        .json<UsersPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const users = data?.pages.flatMap((page) => page.users) || [];

  if (status === "pending") {
    return <AlbumsLoadingSkeleton />;
  }

  if (status === "success" && !users.length && !hasNextPage) {
    return (
      <p className="text-center text-muted-foreground">
        There is no pending users at the moment.
      </p>
    );
  }

  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        An error occurred while loading users.
      </p>
    );
  }

  return (
    <InfiniteScrollContainer
      className="w-full grid grid-cols-2 gap-5"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {users.map((user) => (
        <UserFeed key={user.id} user={user} />
      ))}
      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
  );
}