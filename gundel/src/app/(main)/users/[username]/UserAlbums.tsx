"use client";

import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import AlbumsLoadingSkeleton from "@/components/albums/AlbumLoadingSkeleton";
import Album from "@/components/albums/album";
import kyInstance from "@/lib/ky";
import { AlbumsPage } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

interface UserAlbumsProps {
  userId: string;
}

export default function UserAlbums({ userId }: UserAlbumsProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["album-feed", "user-albums", userId],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          `/api/users/${userId}/albums`,
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        )
        .json<AlbumsPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const albums = data?.pages.flatMap((page) => page.albums) || [];

  if (status === "pending") {
    return <AlbumsLoadingSkeleton />;
  }

  if (status === "success" && !albums.length && !hasNextPage) {
    return (
      <p className="text-center text-muted-foreground">
        This user hasn&apos;t albumed anything yet.
      </p>
    );
  }

  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        An error occurred while loading albums.
      </p>
    );
  }

  return (
    <InfiniteScrollContainer
      className="w-full grid grid-cols-3 gap-5"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {albums.map((album) => (
        <Album key={album.id} album={album} />
      ))}
      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
  );
}