"use client";

import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import AlbumsLoadingSkeleton from "@/components/albums/AlbumLoadingSkeleton";
import Album from "@/components/albums/album";
import { MediaPreview } from "@/components/media/MediaPreviews";
import kyInstance from "@/lib/ky";
import { AlbumData, MediasPage } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

interface AlbumMediaProps {
  album: AlbumData;
}

export default function AlbumMedia({ album }: AlbumMediaProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["album-media", album.id],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          `/api/albums/${album.id}/media`,
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        )
        .json<MediasPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const medias = data?.pages.flatMap((page) => page.media) || [];

  if (status === "pending") {
    return <AlbumsLoadingSkeleton />;
  }

  if (status === "success" && !medias.length && !hasNextPage) {
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
      className="w-full mt-7
      columns-2 md:columns-3
      lg:columns-3 mb-4
      space-y-4 mx-auto"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {medias.map((media) => (
        // <Album key={album.id} album={album} />
        <MediaPreview key={media.id} album={album} media={media} />
      ))}
      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
  );
}