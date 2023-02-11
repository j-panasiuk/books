-- CreateTable
CREATE TABLE "BookVolumeCopy" (
    "bookId" TEXT NOT NULL,
    "volumeNo" INTEGER NOT NULL,
    "copyNo" INTEGER NOT NULL DEFAULT 1,
    "ownership" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,

    PRIMARY KEY ("bookId", "volumeNo", "copyNo"),
    CONSTRAINT "BookVolumeCopy_bookId_volumeNo_fkey" FOREIGN KEY ("bookId", "volumeNo") REFERENCES "BookVolume" ("bookId", "no") ON DELETE CASCADE ON UPDATE CASCADE
);
