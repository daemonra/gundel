import AlbumEditor from "@/components/albums/editor/albumEditor";
import Album from "@/components/albums/album"
import prisma from "@/lib/prisma";
import { albumDataInclude } from "@/lib/types";

export default async function Home() {
  const albums = await prisma.album.findMany({
    include: albumDataInclude,
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="w-full min-w-0">
      <div className="w-full min-w-0 space-y-5">
        <AlbumEditor />
        <div className="w-full flex flex-row justify-between flex-wrap">
          {albums.map((album) => (
            <Album key={album.id} album={album} />
          ))}
        </div>
      </div>
    </main>
  );
}