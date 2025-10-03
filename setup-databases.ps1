# PowerShell script to set up PostgreSQL databases for Marcher Hospital Management System
# Run this script as Administrator

Write-Host "Setting up PostgreSQL databases for Marcher Hospital Management System..." -ForegroundColor Green

# Add PostgreSQL to PATH for this session
$env:PATH += ";C:\Program Files\PostgreSQL\17\bin"

Write-Host "Please enter the PostgreSQL 'postgres' user password when prompted." -ForegroundColor Yellow

# Execute the database setup script
try {
    psql -U postgres -h localhost -f "setup-databases.sql"
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Databases created successfully!" -ForegroundColor Green
        
        # Test connection to both databases
        Write-Host "Testing database connections..." -ForegroundColor Yellow
        
        Write-Host "Testing marcher-global database..." -ForegroundColor Cyan
        psql -U marcher_user -h localhost -d "marcher-global" -c "SELECT current_database();"
        
        Write-Host "Testing marcher-instance database..." -ForegroundColor Cyan
        psql -U marcher_user -h localhost -d "marcher-instance" -c "SELECT current_database();"
        
        Write-Host "Database setup completed successfully!" -ForegroundColor Green
    } else {
        Write-Host "Failed to create databases. Please check the error messages above." -ForegroundColor Red
    }
} catch {
    Write-Host "Error occurred: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "Press any key to continue..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")