<?php
// Migration: Add salary column to jobs table
// Run via: php backend/migrations/add_salary_field.php

require_once __DIR__ . '/../db.php';

// Check if column already exists (idempotent)
$stmt = $pdo->query("PRAGMA table_info(jobs)");
$columns = $stmt->fetchAll(PDO::FETCH_COLUMN);

if (in_array('salary', $columns)) {
    echo "salary column already exists. Nothing to do.\n";
    exit(0);
}

// SQLite doesn't support ADD COLUMN in the middle of a table.
// We must recreate the table.

$pdo->exec("
    CREATE TABLE jobs_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        company TEXT NOT NULL,
        position TEXT NOT NULL,
        salary TEXT,
        status TEXT NOT NULL DEFAULT 'Applied',
        date_applied DATETIME DEFAULT CURRENT_TIMESTAMP,
        followed_up_date DATETIME DEFAULT NULL,
        follow_up_dismissed BOOLEAN DEFAULT 0,
        interview_date DATETIME DEFAULT NULL,
        `source` TEXT,
        hyperlink TEXT,
        notes TEXT,
        `order` INTEGER NOT NULL DEFAULT 0,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
");

$pdo->exec("INSERT INTO jobs_new SELECT * FROM jobs");
$pdo->exec("DROP TABLE jobs");
$pdo->exec("ALTER TABLE jobs_new RENAME TO jobs");

echo "Migration complete: salary column added to jobs table.\n";
?>
