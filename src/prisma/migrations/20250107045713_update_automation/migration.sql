/*
  Warnings:

  - A unique constraint covering the columns `[pageaccesstoken]` on the table `Automationsettings` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Automationsettings_pageaccesstoken_key" ON "Automationsettings"("pageaccesstoken");
