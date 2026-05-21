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

| Column         | Type         | Constraints                        | Default                  | Description                 |
|----------------|--------------|------------------------------------|--------------------------|-----------------------------|
| `id`           | INTEGER      | PRIMARY KEY, AUTOINCREMENT         | —                        | Unique row identifier       |
| `company`      | TEXT         | NOT NULL                           | —                        | Company name                |
| `position`     | TEXT         | NOT NULL                           | —                        | Job title                   |
| `status`       | TEXT         | NOT NULL                           | `'Applied'`              | Application status          |
| `date_applied` | DATETIME     | —                                  | `CURRENT_TIMESTAMP`      | When the job was created    |
| `interview_date`| DATETIME    | —                                  | `NULL`                  | Scheduled interview date    |
| `notes`        | TEXT         | —                                  | `NULL`                  | Free-form notes             |
| `order`        | INTEGER      | NOT NULL                           | `1`                      | Kanban column ordering      |
| `updated_at`   | DATETIME     | —                                  | `CURRENT_TIMESTAMP`      | Last row update timestamp   |

### Valid `status` values

`Wishlist`, `Applied`, `Interviewing`, `Offer`, `Rejected`, `Withdrawn`

### Indexes

No explicit indexes beyond the implicit primary key index on `id`.

### Notes

- `date_applied` and `updated_at` rely on SQLite's `CURRENT_TIMESTAMP` for default values.
- `updated_at` is set manually via `CURRENT_TIMESTAMP` in UPDATE queries (not via a trigger), so it only updates when the API's PUT endpoint is called.
- The `order` column is backtick-quoted in SQL because `order` is a reserved keyword in SQL.
