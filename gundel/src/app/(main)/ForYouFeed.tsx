"use client";

import Album from "@/components/albums/album";
import AlbumsLoadingSkeleton from "@/components/albums/AlbumLoadingSkeleton";
import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import kyInstance from "@/lib/ky";
import { AlbumsPage } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

export default function ForYouFeed() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["album-feed", "for-you"],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          "/api/albums/for-you",
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        )
        .json<AlbumsPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const albums = data?.pages.flatMap((page) => page.albums) || [];

  if (status === "pending") {
    return <AlbumsLoadingSkeleton/ >;
  }

  if (status === "success" && !albums.length && !hasNextPage) {
    return (
      <p className="text-center text-muted-foreground">
        No one has albumed anything yet.
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
      className="w-full grid xl:grid-cols-3 lg:grid-cols-2 gap-4 sm:grid-cols-1 mt-4"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {albums.map((album) => (
        <Album key={album.id} album={album} />
      ))}
      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
  );
}