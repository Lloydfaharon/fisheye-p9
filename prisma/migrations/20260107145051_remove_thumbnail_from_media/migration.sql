/*
  Warnings:

  - You are about to drop the column `thumbnail` on the `Media` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Media" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "photographerId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "image" TEXT,
    "video" TEXT,
    "likes" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    CONSTRAINT "Media_photographerId_fkey" FOREIGN KEY ("photographerId") REFERENCES "Photographer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Media" ("date", "id", "image", "likes", "photographerId", "price", "title", "video") SELECT "date", "id", "image", "likes", "photographerId", "price", "title", "video" FROM "Media";
DROP TABLE "Media";
ALTER TABLE "new_Media" RENAME TO "Media";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
