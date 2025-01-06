/*
  Warnings:

  - You are about to drop the column `max` on the `Automationsettings` table. All the data in the column will be lost.
  - You are about to drop the column `min` on the `Automationsettings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Automationsettings" DROP COLUMN "max",
DROP COLUMN "min",
ADD COLUMN     "commentmax" INTEGER,
ADD COLUMN     "commentmin" INTEGER,
ADD COLUMN     "messagemax" INTEGER,
ADD COLUMN     "messagemin" INTEGER;
