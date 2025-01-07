/*
  Warnings:

  - A unique constraint covering the columns `[adminid]` on the table `Automationsettings` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Automationsettings_pageaccesstoken_key";

-- CreateIndex
CREATE UNIQUE INDEX "Automationsettings_adminid_key" ON "Automationsettings"("adminid");
