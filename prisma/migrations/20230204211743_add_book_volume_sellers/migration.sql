-- CreateTable
CREATE TABLE "BookVolumeSellerStock" (
    "stock" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "volumeNo" INTEGER NOT NULL,
    "sellerName" TEXT NOT NULL,
    CONSTRAINT "BookVolumeSellerStock_bookId_volumeNo_fkey" FOREIGN KEY ("bookId", "volumeNo") REFERENCES "BookVolume" ("bookId", "no") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BookVolumeSellerStock_sellerName_fkey" FOREIGN KEY ("sellerName") REFERENCES "Seller" ("name") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Seller" (
    "name" TEXT NOT NULL PRIMARY KEY,
    "icon" BLOB NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "BookVolumeSellerStock_bookId_volumeNo_sellerName_key" ON "BookVolumeSellerStock"("bookId", "volumeNo", "sellerName");
