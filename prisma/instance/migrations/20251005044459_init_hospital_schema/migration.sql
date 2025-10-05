/*
  Warnings:

  - You are about to drop the `doctors` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `staff` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[staffNumber]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "StaffType" AS ENUM ('DOCTOR', 'NURSE', 'TECHNICIAN', 'PHARMACIST', 'RADIOLOGIST', 'THERAPIST', 'ADMINISTRATOR', 'SECURITY', 'MAINTENANCE', 'OTHER');

-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'CONSULTANT', 'INTERN');

-- DropForeignKey
ALTER TABLE "public"."doctors" DROP CONSTRAINT "doctors_staffId_fkey";

-- DropForeignKey
ALTER TABLE "public"."doctors" DROP CONSTRAINT "doctors_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."staff" DROP CONSTRAINT "staff_userId_fkey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "department" TEXT,
ADD COLUMN     "employmentType" "EmploymentType",
ADD COLUMN     "hireDate" TIMESTAMP(3),
ADD COLUMN     "middleName" TEXT,
ADD COLUMN     "position" TEXT,
ADD COLUMN     "salary" DECIMAL(65,30),
ADD COLUMN     "staffNumber" TEXT;

-- DropTable
DROP TABLE "public"."doctors";

-- DropTable
DROP TABLE "public"."staff";

-- CreateTable
CREATE TABLE "staff_credentials" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "staffType" "StaffType" NOT NULL,
    "licenseNumber" TEXT,
    "licenseExpiryDate" TIMESTAMP(3),
    "specialization" TEXT,
    "subSpecialization" TEXT,
    "boardCertification" TEXT[],
    "education" TEXT,
    "yearsOfExperience" INTEGER,
    "consultationFee" DECIMAL(65,30),
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "workingHours" JSONB,
    "hospitalAffiliation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "staff_credentials_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "staff_credentials_userId_key" ON "staff_credentials"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "users_staffNumber_key" ON "users"("staffNumber");

-- AddForeignKey
ALTER TABLE "staff_credentials" ADD CONSTRAINT "staff_credentials_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
