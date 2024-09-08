/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Rights` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Rights_userId_key" ON "Rights"("userId");
