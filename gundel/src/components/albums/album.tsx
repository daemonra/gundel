import avatarPlaceholder from "@/assets/cover.jpeg";
import { AlbumData } from "@/lib/types";
import { formatRelativeDate } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import UserAvatar from "../UserAvatar";

interface AlbumProps {
  album: AlbumData;
}

export default function Album({ album }: AlbumProps) {
  return (
    <article className="rounded-2xl bg-card mb-5 relative shadow-sm h-[20rem] w-[30%] overflow-hidden hover:cursor-pointer hover:shadow-lg transition duration-150 ease-in-out hover:ease-in-out">
      <Image
        src={avatarPlaceholder}
        alt="User avatar"
        className="aspect-square object-cover top-0 left-0 h-full w-full"
      />

      <div className="absolute flex flex-col justify-between top-0 left-0 w-full h-full p-5 bg-black/30 hover:bg-black/50 transition duration-150 ease-in-out hover:ease-in-out">
      
        <div className="flex flex-wrap gap-3 text-white">
          <Link href={`/users/${album.user.username}`}>
            <UserAvatar avatarUrl={album.user.avatarUrl} />
          </Link>
          <div >
            <Link
              href={`/users/${album.user.username}`}
              className="block font-medium hover:underline"
            >
              {album.name}
            </Link>
            {/* <Link
              href={`/albums/${album.id}`}
              className="block text-sm text-gray-100 hover:underline"
            >
              {formatRelativeDate(album.createdAt)}
            </Link> */}

            <Link
              href={`/albums/${album.id}`}
              className="block text-sm text-gray-100 hover:underline"
            >
              By {album.user.displayName}
            </Link>
          </div>
        </div>
        <div className="whitespace-pre-line break-words text-white mb-3">{album.content}</div>
      </div>
    </article>
  );
}