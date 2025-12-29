"use server";

import { incrementMediaLikes } from "@/app/lib/prisma-db";

export async function likeMedia(mediaId: number) {
  const updated = await incrementMediaLikes(mediaId);
  return updated.likes; // renvoie le nouveau nombre
}
