/*
  Warnings:

  - You are about to drop the column `useId` on the `Credential` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Credential` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Credential" DROP CONSTRAINT "Credential_useId_fkey";

-- AlterTable
ALTER TABLE "Credential" DROP COLUMN "useId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Credential" ADD CONSTRAINT "Credential_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
