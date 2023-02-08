-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Book" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "author" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "suggestedBy" TEXT NOT NULL DEFAULT ''
);
INSERT INTO "new_Book" ("author", "createdAt", "id", "suggestedBy", "title", "updatedAt") SELECT "author", "createdAt", "id", coalesce("suggestedBy", '') AS "suggestedBy", "title", "updatedAt" FROM "Book";
DROP TABLE "Book";
ALTER TABLE "new_Book" RENAME TO "Book";
CREATE UNIQUE INDEX "Book_author_title_key" ON "Book"("author", "title");
CREATE TABLE "new_BookVolume" (
    "no" INTEGER NOT NULL DEFAULT 1,
    "bookId" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',

    PRIMARY KEY ("bookId", "no"),
    CONSTRAINT "BookVolume_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_BookVolume" ("bookId", "no", "title") SELECT "bookId", "no", coalesce("title", '') AS "title" FROM "BookVolume";
DROP TABLE "BookVolume";
ALTER TABLE "new_BookVolume" RENAME TO "BookVolume";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
