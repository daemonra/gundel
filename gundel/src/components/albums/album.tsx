import { AlbumData } from "@/lib/types";
import { formatRelativeDate } from "@/lib/utils";
import Link from "next/link";
import UserAvatar from "../UserAvatar";

interface AlbumProps {
  album: AlbumData;
}

export default function Album({ album }: AlbumProps) {
  return (
    <article className="space-y-3 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex flex-wrap gap-3">
        <Link href={`/users/${album.user.username}`}>
          <UserAvatar avatarUrl={album.user.avatarUrl} />
        </Link>
        <div>
          <Link
            href={`/users/${album.user.username}`}
            className="block font-medium hover:underline"
          >
            {album.user.displayName}
          </Link>
          <Link
            href={`/albums/${album.id}`}
            className="block text-sm text-muted-foreground hover:underline"
          >
            {formatRelativeDate(album.createdAt)}
          </Link>
        </div>
      </div>
      <div className="whitespace-pre-line break-words">{album.content}</div>
    </article>
  );
}