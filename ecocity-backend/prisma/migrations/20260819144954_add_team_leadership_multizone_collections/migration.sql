/*
  Warnings:

  - You are about to drop the column `zoneId` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the `TeamMembership` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ZoneAssignment` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "TeamStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "TeamMemberRole" AS ENUM ('LEADER', 'AGENT');

-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI', 'DIMANCHE');

-- CreateEnum
CREATE TYPE "CollectionStatus" AS ENUM ('PLANIFIEE', 'EN_COURS', 'TERMINEE', 'ANNULEE', 'NON_EFFECTUEE');

-- DropForeignKey
ALTER TABLE "Team" DROP CONSTRAINT "Team_zoneId_fkey";

-- DropForeignKey
ALTER TABLE "TeamMembership" DROP CONSTRAINT "TeamMembership_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "ZoneAssignment" DROP CONSTRAINT "ZoneAssignment_zoneId_fkey";

-- DropIndex
DROP INDEX "Team_zoneId_idx";

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "status" "TeamStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "TeamMember" ADD COLUMN     "role" "TeamMemberRole" NOT NULL DEFAULT 'AGENT';

-- DropTable
DROP TABLE "TeamMembership";

-- DropTable
DROP TABLE "ZoneAssignment";

-- CreateTable
CREATE TABLE "TeamZone" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "zoneId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TeamZone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollectionSchedule" (
    "id" TEXT NOT NULL,
    "zoneId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "dayOfWeek" "DayOfWeek" NOT NULL,
    "startTime" TEXT,
    "endTime" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CollectionSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Collection" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "zoneId" TEXT NOT NULL,
    "scheduleId" TEXT,
    "scheduledDate" TIMESTAMP(3) NOT NULL,
    "dayOfWeek" "DayOfWeek" NOT NULL,
    "status" "CollectionStatus" NOT NULL DEFAULT 'PLANIFIEE',
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "comment" TEXT,
    "problemDescription" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollectionAttachment" (
    "id" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CollectionAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollectionStatusHistory" (
    "id" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,
    "status" "CollectionStatus" NOT NULL,
    "comment" TEXT,
    "changedById" TEXT NOT NULL,
    "changedByName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CollectionStatusHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TeamZone_zoneId_idx" ON "TeamZone"("zoneId");

-- CreateIndex
CREATE UNIQUE INDEX "TeamZone_teamId_zoneId_key" ON "TeamZone"("teamId", "zoneId");

-- DataMigration: backfill the old single Team.zoneId into the new TeamZone
-- join table before dropping the column, so any existing team/zone pairing
-- (dev data) survives the switch to multi-zone teams.
INSERT INTO "TeamZone" ("id", "teamId", "zoneId")
SELECT gen_random_uuid()::text, "id", "zoneId" FROM "Team" WHERE "zoneId" IS NOT NULL;

-- AlterTable
ALTER TABLE "Team" DROP COLUMN "zoneId";

-- CreateIndex
CREATE INDEX "CollectionSchedule_teamId_idx" ON "CollectionSchedule"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "CollectionSchedule_zoneId_teamId_dayOfWeek_key" ON "CollectionSchedule"("zoneId", "teamId", "dayOfWeek");

-- CreateIndex
CREATE INDEX "Collection_teamId_idx" ON "Collection"("teamId");

-- CreateIndex
CREATE INDEX "Collection_zoneId_idx" ON "Collection"("zoneId");

-- CreateIndex
CREATE INDEX "Collection_status_idx" ON "Collection"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Collection_scheduleId_scheduledDate_key" ON "Collection"("scheduleId", "scheduledDate");

-- CreateIndex
CREATE INDEX "CollectionAttachment_collectionId_idx" ON "CollectionAttachment"("collectionId");

-- CreateIndex
CREATE INDEX "CollectionStatusHistory_collectionId_idx" ON "CollectionStatusHistory"("collectionId");

-- AddForeignKey
ALTER TABLE "TeamZone" ADD CONSTRAINT "TeamZone_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamZone" ADD CONSTRAINT "TeamZone_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "Zone"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionSchedule" ADD CONSTRAINT "CollectionSchedule_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "Zone"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionSchedule" ADD CONSTRAINT "CollectionSchedule_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "Zone"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "CollectionSchedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionAttachment" ADD CONSTRAINT "CollectionAttachment_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionStatusHistory" ADD CONSTRAINT "CollectionStatusHistory_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
