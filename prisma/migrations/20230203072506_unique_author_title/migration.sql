/*
  Warnings:

  - A unique constraint covering the columns `[author,title]` on the table `Book` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Book_author_title_key" ON "Book"("author", "title");
