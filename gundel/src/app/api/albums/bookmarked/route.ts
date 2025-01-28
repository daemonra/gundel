import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getAlbumDataInclude, AlbumsPage } from "@/lib/types";
import { NextRequest } from "next/server";
export async function GET(req: NextRequest) {
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
    const pageSize = 10;
    const { user } = await validateRequest();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const bookmarks = await prisma.bookmark.findMany({
      where: {
        userId: user.id,
      },
      include: {
        album: {
          include: getAlbumDataInclude(user.id, true),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });
    const nextCursor =
      bookmarks.length > pageSize ? bookmarks[pageSize].id : null;
    const data: AlbumsPage = {
      albums: bookmarks.slice(0, pageSize).map((bookmark) => bookmark.album),
      nextCursor,
    };
    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}