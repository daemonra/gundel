import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getAlbumDataInclude, MediasPage, getMediaDataInclude } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params: { albumId } }: { params: { albumId: string } },
) {
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;

    const pageSize = 10;

    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const albums = await prisma.media.findMany({
      where: { albumId : albumId },
      include: getMediaDataInclude(user.id),
      orderBy: { createdAt: "desc" },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    const nextCursor = albums.length > pageSize ? albums[pageSize].id : null;

    const data: MediasPage = {
      media: albums.slice(0, pageSize),
      nextCursor,
    };

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}