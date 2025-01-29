import { Skeleton } from "../ui/skeleton";

export default function AlbumsLoadingSkeleton() {
  return (
    <div className="w-full grid xl:grid-cols-3 lg:grid-cols-2 gap-4 sm:grid-cols-1">
      <AlbumLoadingSkeleton />
      <AlbumLoadingSkeleton />
      <AlbumLoadingSkeleton />
      <AlbumLoadingSkeleton />
    </div>
  );
}

function AlbumLoadingSkeleton() {
  return (
    <div className="w-full animate-pulse space-y-3 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex flex-wrap gap-3">
        <Skeleton className="size-12 rounded-full" />
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-4 w-20 rounded" />
        </div>
      </div>
      <Skeleton className="h-16 rounded" />
    </div>
  );
}