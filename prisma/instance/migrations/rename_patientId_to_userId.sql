-- Migration: Rename patientId to userId in appointments table
-- This aligns the appointments table with the actual data structure where userId references users.id

-- Step 1: Rename the column
ALTER TABLE appointments RENAME COLUMN "patientId" TO "userId";

-- Step 2: Drop old index if exists
DROP INDEX IF EXISTS "appointments_patientId_idx";

-- Step 3: Create new index on userId
CREATE INDEX "appointments_userId_idx" ON appointments("userId");

-- Note: The data remains the same, we're just renaming the column to reflect its actual purpose
