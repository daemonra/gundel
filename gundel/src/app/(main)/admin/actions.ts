"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";

export async function approveUser(id: string) {
    
    const { user } = await validateRequest();
    if (!user || user.username !== "deaarash") throw new Error("Unauthorized");

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        approved: true,
      }
    });
    return updatedUser;
}

export async function deleteUser(id: string) {
    
    const { user } = await validateRequest();
    if (!user || user.username !== "deaarash") throw new Error("Unauthorized");

    const deletedUser = await prisma.user.delete({
      where: { id },
    });
    return deletedUser;
}