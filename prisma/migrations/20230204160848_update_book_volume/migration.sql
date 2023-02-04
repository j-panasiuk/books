/*
  Warnings:

  - The primary key for the `BookVolume` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BookVolume" (
    "no" INTEGER NOT NULL DEFAULT 1,
    "bookId" TEXT NOT NULL,

    PRIMARY KEY ("bookId", "no"),
    CONSTRAINT "BookVolume_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_BookVolume" ("bookId", "no") SELECT "bookId", "no" FROM "BookVolume";
DROP TABLE "BookVolume";
ALTER TABLE "new_BookVolume" RENAME TO "BookVolume";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
