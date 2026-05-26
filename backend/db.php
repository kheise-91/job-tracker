<?php
// Database configuration
$dbPath = '/var/www/html/data/jobs.db';

try {
    // Create the data directory if it doesn't exist
    $dir = dirname($dbPath);
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }

    // Connect to SQLite
    $pdo = new PDO("sqlite:$dbPath");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

    // Create the jobs table if it doesn't exist
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS jobs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            company TEXT NOT NULL,
            position TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'Applied',
            date_applied DATETIME DEFAULT CURRENT_TIMESTAMP,
            interview_date DATETIME DEFAULT NULL,
            followed_up_date DATETIME DEFAULT NULL,
            follow_up_dismissed BOOLEAN DEFAULT 0,
            `source` TEXT,
            hyperlink TEXT,
            notes TEXT,
            `order` INTEGER NOT NULL DEFAULT 0,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ");

    // Add new columns for existing installations
    $columns = $pdo->query("PRAGMA table_info(jobs)")->fetchAll();
    $columnNames = array_column($columns, 'name');

    if (!in_array('followed_up_date', $columnNames)) {
        $pdo->exec("ALTER TABLE jobs ADD COLUMN followed_up_date DATETIME DEFAULT NULL");
    }

    if (!in_array('follow_up_dismissed', $columnNames)) {
        $pdo->exec("ALTER TABLE jobs ADD COLUMN follow_up_dismissed BOOLEAN DEFAULT 0");
    }

} catch (PDOException $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    exit;
}
?>
