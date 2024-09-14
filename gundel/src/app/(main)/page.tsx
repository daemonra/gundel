import AlbumEditor from "@/components/albums/editor/albumEditor";
import Album from "@/components/albums/album"
import prisma from "@/lib/prisma";
import { albumDataInclude } from "@/lib/types";
import ForYouFeed from "./ForYouFeed";

export default async function Home() {
  const albums = await prisma.album.findMany({
    include: albumDataInclude,
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="w-full min-w-0">
      <div className="w-full min-w-0 space-y-5">
        <AlbumEditor />
        <ForYouFeed />
        {/* <div className="w-full grid grid-cols-3 gap-5">
          {albums.map((album) => (
            <Album key={album.id} album={album} />
          ))}
        </div> */}
      </div>
    </main>
  );
}