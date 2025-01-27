import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { BookmarkInfo } from "@/lib/types";
export async function GET(
  req: Request,
  { params: { albumId } }: { params: { albumId: string } },
) {
  try {
    const { user: loggedInUser } = await validateRequest();
    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const bookmark = await prisma.bookmark.findUnique({
      where: {
        userId_albumId: {
          userId: loggedInUser.id,
          albumId,
        },
      },
    });
    const data: BookmarkInfo = {
      isBookmarkedByUser: !!bookmark,
    };
    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
export async function POST(
  req: Request,
  { params: { albumId } }: { params: { albumId: string } },
) {
  try {
    const { user: loggedInUser } = await validateRequest();
    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    await prisma.bookmark.upsert({
      where: {
        userId_albumId: {
          userId: loggedInUser.id,
          albumId,
        },
      },
      create: {
        userId: loggedInUser.id,
        albumId,
      },
      update: {},
    });
    return new Response();
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
export async function DELETE(
  req: Request,
  { params: { albumId } }: { params: { albumId: string } },
) {
  try {
    const { user: loggedInUser } = await validateRequest();
    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    await prisma.bookmark.deleteMany({
      where: {
        userId: loggedInUser.id,
        albumId,
      },
    });
    return new Response();
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}