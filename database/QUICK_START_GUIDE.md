# Quick Start Guide - Real Estate Microservices Databases

## Installation (3 Steps)

### Step 1: Ensure MySQL is Running
```bash
# Check if MySQL is running
sudo systemctl status mysql

# Start MySQL if needed
sudo systemctl start mysql
```

### Step 2: Run the Master Setup Script
```bash
cd /home/user/asgardeo-react-frontendapp/database
mysql -u root -p < SETUP_ALL_DATABASES.sql
```

### Step 3: Verify Installation
```bash
mysql -u root -p < VERIFY_DATABASES.sql
```

That's it! All 6 databases are now ready with dummy data.

---

## What You Get

### 6 Complete Microservice Databases

| # | Database Name | Table | Records | Description |
|---|---------------|-------|---------|-------------|
| 1 | `real_estate_property_db` | properties | 15 | Property listings with details |
| 2 | `real_estate_owner_db` | owners | 10 | Property owner information |
| 3 | `real_estate_tenant_db` | tenants | 12 | Tenant profiles with emergency contacts |
| 4 | `real_estate_lease_db` | leases | 10 | Lease agreements linking properties & tenants |
| 5 | `real_estate_payment_db` | payments | 25 | Payment transactions & history |
| 6 | `real_estate_maintenance_db` | maintenance_requests | 20 | Maintenance work orders |

**Total: 92 realistic, interconnected records**

---

## File Structure

```
/home/user/asgardeo-react-frontendapp/database/
│
├── property/01_create_property_db.sql          (4.5 KB, 55 lines)
├── owner/01_create_owner_db.sql                (2.2 KB, 40 lines)
├── tenant/01_create_tenant_db.sql              (2.5 KB, 43 lines)
├── lease/01_create_lease_db.sql                (3.1 KB, 55 lines)
├── payment/01_create_payment_db.sql            (4.2 KB, 82 lines)
├── maintenance/01_create_maintenance_db.sql    (6.2 KB, 71 lines)
│
├── SETUP_ALL_DATABASES.sql                     (Master setup script)
├── VERIFY_DATABASES.sql                        (Verification script)
├── MICROSERVICES_DATABASE_README.md            (Full documentation)
└── QUICK_START_GUIDE.md                        (This file)
```

**Total: 552 lines of SQL code**

---

## Quick Commands

### View All Databases
```sql
SHOW DATABASES LIKE 'real_estate%';
```

### Check Property Status Distribution
```sql
USE real_estate_property_db;
SELECT status, COUNT(*) AS count FROM properties GROUP BY status;
```

### View Active Leases
```sql
USE real_estate_lease_db;
SELECT * FROM leases WHERE status = 'Active';
```

### Check Payment Status
```sql
USE real_estate_payment_db;
SELECT status, COUNT(*) AS count FROM payments GROUP BY status;
```

### See Open Maintenance Requests
```sql
USE real_estate_maintenance_db;
SELECT * FROM maintenance_requests WHERE status = 'Open' ORDER BY priority DESC;
```

---

## Sample Data Highlights

### Properties
- **Types**: Apartment, House, Condo, Townhouse
- **Locations**: Seattle, Portland, San Francisco, Los Angeles, Austin, Denver, Phoenix, San Diego, Las Vegas, Albuquerque, Salt Lake City
- **Rent Range**: $1,200 - $3,500/month
- **Statuses**: Available (6), Occupied (7), Maintenance (1), Sold (1)

### Leases
- **Active**: 6 leases
- **Expired**: 1 lease
- **Terminated**: 1 lease
- **Pending**: 2 leases
- **Durations**: 6 months, 1 year, 2 years

### Payments
- **Paid**: 19 payments
- **Pending**: 3 payments
- **Overdue**: 1 payment
- **Partial**: 2 payments
- **Methods**: Credit Card, Bank Transfer, Check, Cash

### Maintenance
- **Open**: 4 requests
- **In Progress**: 4 requests
- **Completed**: 11 requests
- **Cancelled**: 1 request
- **Priorities**: Low, Medium, High, Urgent
- **Types**: Plumbing, Electrical, HVAC, Appliances, General

---

## Connection Strings for .NET APIs

```csharp
// Property API
"Server=localhost;Database=real_estate_property_db;User=root;Password=your_password;"

// Owner API
"Server=localhost;Database=real_estate_owner_db;User=root;Password=your_password;"

// Tenant API
"Server=localhost;Database=real_estate_tenant_db;User=root;Password=your_password;"

// Lease API
"Server=localhost;Database=real_estate_lease_db;User=root;Password=your_password;"

// Payment API
"Server=localhost;Database=real_estate_payment_db;User=root;Password=your_password;"

// Maintenance API
"Server=localhost;Database=real_estate_maintenance_db;User=root;Password=your_password;"
```

---

## Troubleshooting

### Problem: "Access denied for user"
**Solution**: Make sure you're using the correct MySQL username and password

### Problem: "Database already exists"
**Solution**: The scripts automatically drop and recreate databases. Just re-run the setup script.

### Problem: "Can't connect to MySQL server"
**Solution**: Ensure MySQL service is running: `sudo systemctl start mysql`

---

## Next Steps

1. Configure your .NET microservice APIs to connect to these databases
2. Update connection strings in `appsettings.json` for each microservice
3. Test API endpoints with the dummy data
4. Customize the data as needed for your specific use cases

---

## Need Help?

- **Full Documentation**: See `MICROSERVICES_DATABASE_README.md`
- **Sample Queries**: Check the README for complex cross-database queries
- **Verification**: Run `VERIFY_DATABASES.sql` to check everything is working

---

**Happy Coding!**

Last Updated: 2024-11-18
