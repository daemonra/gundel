import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { createUploadthing, FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";

const f = createUploadthing();

export const fileRouter = {
  avatar: f({
    image: { maxFileSize: "512KB" },
  })
    .middleware(async () => {
      const { user } = await validateRequest();
      if (!user) throw new UploadThingError("Unauthorized");
      return { user };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const oldAvatarUrl = metadata.user.avatarUrl;
      if (oldAvatarUrl) {
        const key = oldAvatarUrl;
        await new UTApi().deleteFiles(key);
      }
      const newAvatarUrl = file.url;
      await prisma.user.update({
        where: { id: metadata.user.id },
        data: {
          avatarUrl: newAvatarUrl,
        },
      });
      return { avatarUrl: newAvatarUrl };
    }),
    attachment: f({
      image: { maxFileSize: "4MB", maxFileCount: 5 },
      video: { maxFileSize: "64MB", maxFileCount: 5 },
    })
      .middleware(async () => {
        const { user } = await validateRequest();
        if (!user) throw new UploadThingError("Unauthorized");
        return {};
      })
      .onUploadComplete(async ({ file }) => {
        const media = await prisma.media.create({
          data: {
            url: file.url,
            type: file.type.startsWith("image") ? "IMAGE" : "VIDEO",
          },
        });
        return { mediaId: media.id };
      }),
} satisfies FileRouter;
export type AppFileRouter = typeof fileRouter;