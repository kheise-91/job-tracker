---
name: database-documentation
title: Database Documentation
description: A list of databases and their schemas used in this app.
---

# Database Schema

The ATS uses a single SQLite database stored at `/var/www/html/data/jobs.db` (mounted from `./data/jobs.db` on the host). The schema is created once via `CREATE TABLE IF NOT EXISTS` in `db.php` on every request. There is no migration system — any future schema changes must be handled manually via raw SQL executed through `$pdo->exec()`.

## Database Configuration

| Setting              | Value                                          |
|----------------------|------------------------------------------------|
| Engine               | SQLite                                         |
| File path            | `/var/www/html/data/jobs.db`                   |
| Error mode           | `PDO::ERRMODE_EXCEPTION`                       |
| Fetch mode           | `PDO::FETCH_ASSOC`                             |
| Emulate prepares     | `false` (real prepared statements)             |

The database file and its parent directory are created automatically on startup if they do not exist.

---

## Table: `jobs`

Stores individual job application entries for tracking through the hiring pipeline.

| Column               | Type      | Constraints                  | Default                 | Description                      |
|----------------------|-----------|------------------------------|-------------------------|----------------------------------|
| `id`                 | INTEGER   | PRIMARY KEY, AUTOINCREMENT   | —                       | Unique auto-incrementing ID      |
| `company`            | TEXT      | NOT NULL                     | —                       | Company name                     |
| `position`           | TEXT      | NOT NULL                     | —                       | Job title/position               |
| `status`             | TEXT      | NOT NULL                     | `'Applied'`             | Pipeline stage                   |
| `date_applied`       | DATETIME  | —                            | `CURRENT_TIMESTAMP`     | When the job was created         |
| `followed_up_date`   | DATETIME  | —                            | `NULL`                  | Date of last follow-up           |
| `follow_up_dismissed`| BOOLEAN   | —                            | `0`                     | Whether follow-up reminder dismissed (stored as 0/1) |
| `interview_date`     | DATETIME  | —                            | `NULL`                  | Scheduled interview date/time    |
| `source`             | TEXT      | —                            | `NULL`                  | Where the job listing was found  |
| `hyperlink`          | TEXT      | —                            | `NULL`                  | URL to the job posting           |
| `notes`              | TEXT      | —                            | `NULL`                  | Free-form notes                  |
| `order`              | INTEGER   | NOT NULL                     | `0`                     | Display order within a status column |
| `updated_at`         | DATETIME  | —                            | `CURRENT_TIMESTAMP`     | Last modification timestamp      |

### Valid `status` values

`Wishlist`, `Applied`, `Followed Up`, `Interviewing`, `Offer`, `Rejected`, `Withdrawn`

### Relationships / Foreign Keys

None. No foreign key constraints are defined (SQLite FK enforcement is off by default and no `FOREIGN KEY` clause appears in the schema).

### Indexes

None explicitly defined beyond the implicit primary key index on `id`. Ordering is done via `ORDER BY` clauses in queries using `CASE` expressions on `status` and the `order` column.

### Migration history

No migration system exists. The schema is created once via `CREATE TABLE IF NOT EXISTS` in `db.php`. There are no version columns, migration tables, or ALTER statements — the schema has grown organically (the `follow_up_dismissed`, `followed_up_date`, and `interview_date` columns suggest prior additions beyond the original minimal schema).

### Notes

- `date_applied` and `updated_at` rely on SQLite's `CURRENT_TIMESTAMP` for default values.
- `updated_at` is set manually via `CURRENT_TIMESTAMP` in UPDATE queries (not via a trigger), so it only updates when the API's PUT endpoint is called.
