---
name: database-documentation
title: Database Documentation
description: A list of databases and their schemas used in this app.
---

# Database Schema

The ATS uses a single SQLite database stored at `/var/www/html/data/jobs.db` (mounted from `./data/jobs.db` on the host).

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

| Column               | Type         | Constraints                        | Default                  | Description                 |
|----------------------|--------------|------------------------------------|--------------------------|-----------------------------|
| `id`                 | INTEGER      | PRIMARY KEY, AUTOINCREMENT         | —                        | Unique row identifier       |
| `company`            | TEXT         | NOT NULL                           | —                        | Company name                |
| `position`           | TEXT         | NOT NULL                           | —                        | Job title                   |
| `status`             | TEXT         | NOT NULL                           | `'Applied'`              | Application status          |
| `date_applied`       | DATETIME     | —                                  | `CURRENT_TIMESTAMP`      | When the job was created    |
| `followed_up_date`   | DATETIME     | —                                  | `NULL`                   | When user followed up       |
| `follow_up_dismissed`| BOOLEAN      | —                                  | `0`                      | Reminder dismissed flag     |
| `interview_date`     | DATETIME     | —                                  | `NULL`                   | Scheduled interview date    |
| `source`             | TEXT         | —                                  | `NULL`                   | Where job was found         |
| `hyperlink`          | TEXT         | —                                  | `NULL`                   | Link to job posting         |
| `notes`              | TEXT         | —                                  | `NULL`                   | Free-form notes             |
| `order`              | INTEGER      | NOT NULL                           | `0`                      | Per-column display order    |
| `updated_at`         | DATETIME     | —                                  | `CURRENT_TIMESTAMP`      | Last row update timestamp   |

### Valid `status` values

`Wishlist`, `Applied`, `Followed Up`, `Interviewing`, `Offer`, `Rejected`, `Withdrawn`

### Indexes

No explicit indexes beyond the implicit primary key index on `id`.

### Notes

- `date_applied` and `updated_at` rely on SQLite's `CURRENT_TIMESTAMP` for default values.
- `updated_at` is set manually via `CURRENT_TIMESTAMP` in UPDATE queries (not via a trigger), so it only updates when the API's PUT endpoint is called.
