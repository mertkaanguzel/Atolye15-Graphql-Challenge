/*
  Warnings:

  - The primary key for the `Message` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Message` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `parentId` column on the `Message` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_parentId_fkey";

-- AlterTable
ALTER TABLE "Message" DROP CONSTRAINT "Message_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "parentId",
ADD COLUMN     "parentId" INTEGER,
ADD CONSTRAINT "Message_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;
