/*
  Warnings:

  - You are about to drop the column `city` on the `Station` table. All the data in the column will be lost.
  - You are about to drop the column `operator` on the `Station` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Station" DROP COLUMN "city",
DROP COLUMN "operator";
