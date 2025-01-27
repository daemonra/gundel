"use client";

import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import Album from "@/components/albums/album";
import AlbumsLoadingSkeleton from "@/components/albums/AlbumLoadingSkeleton";
import kyInstance from "@/lib/ky";
import { AlbumsPage } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

export default function Bookmarks() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["album-feed", "bookmarks"],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          "/api/albums/bookmarked",
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
        You don&apos;t have any bookmarks yet.
      </p>
    );
  }

  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        An error occurred while loading bookmarks.
      </p>
    );
  }

  return (
    <InfiniteScrollContainer
      className="space-y-5"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {albums.map((album) => (
        <Album key={album.id} album={album} />
      ))}
      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
  );
}