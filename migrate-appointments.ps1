# Migration Script: Update Appointments to use userId instead of patientId

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "APPOINTMENT SCHEMA MIGRATION" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Run the SQL migration
Write-Host "Step 1: Running database migration..." -ForegroundColor Yellow
$sqlFile = "prisma\instance\migrations\rename_patientId_to_userId.sql"
$env:PGPASSWORD = "postgres"
psql -U postgres -d marcher_hospital_instance -f $sqlFile

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Database migration completed successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Database migration failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 2: Generate Prisma Client
Write-Host "Step 2: Generating Prisma Client..." -ForegroundColor Yellow
npx prisma generate --schema=prisma/instance/schema.prisma

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Prisma Client generated successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Prisma Client generation failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ MIGRATION COMPLETED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Restart your development server: npm run dev" -ForegroundColor White
Write-Host "2. Navigate to /patient/appointments" -ForegroundColor White
Write-Host "3. Your appointments should now display!" -ForegroundColor White
Write-Host ""
