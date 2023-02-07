-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BookVolume" (
    "no" INTEGER NOT NULL DEFAULT 1,
    "bookId" TEXT NOT NULL,
    "title" TEXT,

    PRIMARY KEY ("bookId", "no"),
    CONSTRAINT "BookVolume_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_BookVolume" ("bookId", "no") SELECT "bookId", "no" FROM "BookVolume";
DROP TABLE "BookVolume";
ALTER TABLE "new_BookVolume" RENAME TO "BookVolume";
CREATE TABLE "new_BookVolumeSellerStock" (
    "stock" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "volumeNo" INTEGER NOT NULL,
    "sellerName" TEXT NOT NULL,
    CONSTRAINT "BookVolumeSellerStock_bookId_volumeNo_fkey" FOREIGN KEY ("bookId", "volumeNo") REFERENCES "BookVolume" ("bookId", "no") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "BookVolumeSellerStock_sellerName_fkey" FOREIGN KEY ("sellerName") REFERENCES "Seller" ("name") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_BookVolumeSellerStock" ("bookId", "sellerName", "stock", "volumeNo") SELECT "bookId", "sellerName", "stock", "volumeNo" FROM "BookVolumeSellerStock";
DROP TABLE "BookVolumeSellerStock";
ALTER TABLE "new_BookVolumeSellerStock" RENAME TO "BookVolumeSellerStock";
CREATE UNIQUE INDEX "BookVolumeSellerStock_bookId_volumeNo_sellerName_key" ON "BookVolumeSellerStock"("bookId", "volumeNo", "sellerName");
CREATE TABLE "new_Seller" (
    "name" TEXT NOT NULL PRIMARY KEY,
    "icon" TEXT NOT NULL
);
INSERT INTO "new_Seller" ("icon", "name") SELECT "icon", "name" FROM "Seller";
DROP TABLE "Seller";
ALTER TABLE "new_Seller" RENAME TO "Seller";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
