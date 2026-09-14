import photographersData from "../../data/photographer.json";
import rawMediasData from "../../data/media.json";
import type { Photographer } from "@/app/types/photographer";

export type MediaItem = {
  id: number;
  photographerId: number;
  title: string;
  image: string | null;
  video: string | null;
  likes: number;
  date: string;
  price: number;
};

// In-memory store for JSON mode
const jsonMediasStore: MediaItem[] = rawMediasData.map((m, index) => ({
  id: index + 1,
  photographerId: m.photographerId,
  title: m.title,
  image: m.image ?? null,
  video: ("video" in m && typeof m.video === "string" ? m.video : null),
  likes: m.likes,
  date: m.date,
  price: m.price,
}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let prisma: any = null;
let prismaFailed = false;

/**
 * Détermine si le mode Prisma doit être tenté ou non.
 * - Si DATA_SOURCE === "json" : utilise JSON
 * - Si DATA_SOURCE === "prisma" : tente Prisma
 * - Sinon (auto) : tente Prisma si on n'est pas dans un environnement Edge/Cloudflare
 */
function shouldTryPrisma(): boolean {
  if (prismaFailed) return false;
  if (process.env.DATA_SOURCE === "json") return false;
  if (process.env.DATA_SOURCE === "prisma") return true;

  // Détection automatique de l'environnement Edge / Cloudflare Workers
  // où les binaires C++ natifs (SQLite) ne sont pas pris en charge.
  if (
    "WebSocketPair" in globalThis ||
    process.env.CF_PAGES === "1" ||
    process.env.NEXT_RUNTIME === "edge"
  ) {
    return false;
  }

  return true;
}

/**
 * Initialisation paresseuse (lazy) du client Prisma pour éviter tout
 * chargement de binaire natif au démarrage dans les environnements edge.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getPrisma(): any {
  if (!shouldTryPrisma()) return null;
  if (prisma) return prisma;

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaClient } = require("../generated/prisma/client");
    prisma = new PrismaClient();
    return prisma;
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.warn(
      "[DB Switcher] Prisma indisponible, bascule automatique sur JSON :",
      errorMsg
    );
    prismaFailed = true;
    return null;
  }
}

/**
 * Exécute une opération avec Prisma si disponible,
 * avec bascule automatique (fallback) transparente sur JSON en cas d'erreur.
 */
async function runWithFallback<T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prismaAction: (db: any) => Promise<T>,
  jsonAction: () => Promise<T> | T
): Promise<T> {
  const client = getPrisma();
  if (client) {
    try {
      return await prismaAction(client);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.warn(
        "[DB Switcher] Erreur requête Prisma, bascule sur JSON :",
        errorMsg
      );
      prismaFailed = true;
    }
  }
  return await jsonAction();
}

export const getAllPhotographers = async (): Promise<Photographer[]> => {
  return runWithFallback<Photographer[]>(
    (db) => db.photographer.findMany(),
    () => photographersData as Photographer[]
  );
};

export const getPhotographer = async (
  id: number | string
): Promise<Photographer | null> => {
  const numId = Number(id);
  return runWithFallback<Photographer | null>(
    (db) => db.photographer.findUnique({ where: { id: numId } }),
    () => {
      const found = (photographersData as Photographer[]).find(
        (p) => p.id === numId
      );
      return found || null;
    }
  );
};

export const getAllMediasForPhotographer = async (
  photographerId: number | string
): Promise<MediaItem[]> => {
  const numId = Number(photographerId);
  return runWithFallback<MediaItem[]>(
    (db) => db.media.findMany({ where: { photographerId: numId } }),
    () => jsonMediasStore.filter((m) => m.photographerId === numId)
  );
};

export const updateNumberOfLikes = async (
  mediaId: number | string,
  newNumberOfLikes: number
): Promise<MediaItem | null> => {
  const numId = Number(mediaId);
  return runWithFallback<MediaItem | null>(
    (db) =>
      db.media.update({
        where: { id: numId },
        data: { likes: newNumberOfLikes },
      }),
    () => {
      const media = jsonMediasStore.find((m) => m.id === numId);
      if (media) {
        media.likes = newNumberOfLikes;
        return { ...media };
      }
      return null;
    }
  );
};

export const incrementMediaLikes = async (
  mediaId: number | string
): Promise<{ id: number; likes: number }> => {
  const numId = Number(mediaId);
  return runWithFallback<{ id: number; likes: number }>(
    (db) =>
      db.media.update({
        where: { id: numId },
        data: { likes: { increment: 1 } },
        select: { id: true, likes: true },
      }),
    () => {
      const media = jsonMediasStore.find((m) => m.id === numId);
      if (media) {
        media.likes += 1;
        return { id: media.id, likes: media.likes };
      }
      return { id: numId, likes: 0 };
    }
  );
};
