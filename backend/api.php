<?php
require_once __DIR__ . '/db.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

$today = date('Y-m-d');
$now = date('Y-m-d H:i:s');

$allowedStatuses = [
    'Wishlist',
    'Applied',
    'Followed Up',
    'Interviewing',
    'Offer',
    'Rejected',
];

$statusMap = [
    'wishlist' => 'Wishlist',
    'applied' => 'Applied',
    'followed-up' => 'Followed Up',
    'interviewing' => 'Interviewing',
    'offer' => 'Offer',
    'rejected' => 'Rejected',
];

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

function sendJson($data, int $status = 200): void {
    http_response_code($status);
    echo json_encode($data);
    exit();
}

function getJsonInput(): array {
    $input = json_decode(file_get_contents('php://input'), true);
    return is_array($input) ? $input : [];
}

// Parse the request path (without query string) for route matching
$requestPath = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// =========================
// GET ALL JOBS
// =========================
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $requestPath === '/api/jobs') {
    $sql = "
        SELECT id, company, position, salary, status, date_applied, followed_up_date, follow_up_dismissed, interview_date, `source`, hyperlink, notes, `order`, updated_at FROM jobs
        ORDER BY
            CASE status
                WHEN 'Wishlist' THEN 1
                WHEN 'Applied' THEN 2
                WHEN 'Followed Up' THEN 3
                WHEN 'Interviewing' THEN 4
                WHEN 'Offer' THEN 5
                WHEN 'Rejected' THEN 6
                ELSE 99
            END,
            `order` ASC,
            id ASC
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([]);

    sendJson($stmt->fetchAll());
}

// =========================
// CREATE JOB
// =========================
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $requestPath === '/api/jobs') {
    $input = getJsonInput();

    $company = trim($input['company'] ?? '');
    $position = trim($input['position'] ?? '');
    $salary = trim($input['salary'] ?? '');
    $status = $input['status'] ?? 'Applied';
    $followedUpDate = $input['followed_up_date'] ?? null;
    $followUpDismissed = $input['follow_up_dismissed'] ?? false;
    // Ensure follow_up_dismissed is always 0 or 1 (integer)
    // Handle empty string, null, boolean false, string "false", or integer 0
    if ($followUpDismissed === '' || $followUpDismissed === null || $followUpDismissed === false || $followUpDismissed === 'false' || $followUpDismissed === '0') {
        $followUpDismissed = 0;
    } else {
        $followUpDismissed = 1;
    }
    $interviewDate = $input['interview_date'] ?? null;
    $source = $input['source'] ?? '';
    $hyperlink = $input['hyperlink'] ?? '';
    $notes = $input['notes'] ?? '';

    if (!$company || !$position) {
        sendJson([
            'error' => 'Company and position are required'
        ], 400);
    }

    if (!in_array($status, $allowedStatuses, true)) {
        sendJson([
            'error' => 'Invalid status'
        ], 400);
    }

    $stmt = $pdo->prepare("SELECT COALESCE(MAX(`order`), -1) + 1 FROM jobs WHERE status = ?");
    $stmt->execute([$status]);
    $nextOrder = (int)$stmt->fetchColumn();

    $stmt = $pdo->prepare("
        INSERT INTO jobs (
            company,
            position,
            salary,
            status,
            date_applied,
            followed_up_date,
            follow_up_dismissed,
            interview_date,
            `source`,
            hyperlink,
            notes,
            `order`,
            updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");

    $stmt->execute([
        $company,
        $position,
        $salary,
        $status,
        $today,
        $followedUpDate,
        $followUpDismissed,
        $interviewDate,
        $source,
        $hyperlink,
        $notes,
        $nextOrder,
        $now
    ]);

    $id = $pdo->lastInsertId();

    $stmt = $pdo->prepare("SELECT * FROM jobs WHERE id = ?");
    $stmt->execute([$id]);

    sendJson($stmt->fetch(), 201);
}

// =========================
// REORDER JOBS
// =========================
if ($_SERVER['REQUEST_METHOD'] === 'PUT' && $requestPath === '/api/jobs/reorder') {
    $input = getJsonInput();

    $columns = $input['columns'] ?? null;

    if (!is_array($columns)) {
        sendJson([
            'error' => 'Invalid payload'
        ], 400);
    }

    try {
        $pdo->beginTransaction();

        foreach ($columns as $columnId => $jobIds) {
            if (!isset($statusMap[$columnId])) {
                continue;
            }

            $status = $statusMap[$columnId];

            if (!is_array($jobIds)) {
                continue;
            }

            foreach ($jobIds as $index => $jobId) {
                // Check if status is changing from "Applied" to "Followed Up"
                $setFollowedUpDate = false;
                if ($status === 'Followed Up') {
                    $checkStmt = $pdo->prepare("SELECT `status`, followed_up_date FROM jobs WHERE id = ?");
                    $checkStmt->execute([(int)$jobId]);
                    $current = $checkStmt->fetch();
                    if ($current && $current['status'] === 'Applied' && empty($current['followed_up_date'])) {
                        $setFollowedUpDate = true;
                    }
                }

                if ($setFollowedUpDate) {
                    $stmt = $pdo->prepare("
                        UPDATE jobs
                        SET
                            status = ?,
                            `order` = ?,
                            followed_up_date = ?,
                            updated_at = ?
                        WHERE id = ?
                    ");

                    $stmt->execute([
                        $status,
                        $index,
                        $today,
                        $now,
                        (int)$jobId
                    ]);
                } else {
                    $stmt = $pdo->prepare("
                        UPDATE jobs
                        SET
                            status = ?,
                            `order` = ?,
                            updated_at = ?
                        WHERE id = ?
                    ");

                    $stmt->execute([
                        $status,
                        $index,
                        $now,
                        (int)$jobId
                    ]);
                }
            }
        }

        $pdo->commit();

        sendJson([
            'success' => true
        ]);
    } catch (Exception $e) {
        $pdo->rollBack();

        sendJson([
            'error' => $e->getMessage()
        ], 500);
    }
}

// =========================
// UPDATE JOB
// =========================
if (
    $_SERVER['REQUEST_METHOD'] === 'PUT' &&
    preg_match('/^\/api\/jobs\/(\d+)$/', $_SERVER['REQUEST_URI'], $matches)
) {
    $jobId = (int)$matches[1];
    $input = getJsonInput();

    $updates = [];
    $params = [];

    if (array_key_exists('company', $input)) {
        $updates[] = 'company = ?';
        $params[] = trim($input['company']);
    }

    if (array_key_exists('position', $input)) {
        $updates[] = 'position = ?';
        $params[] = trim($input['position']);
    }

    if (array_key_exists('salary', $input)) {
        $updates[] = 'salary = ?';
        $params[] = trim($input['salary']);
    }

    if (array_key_exists('status', $input)) {
        if (!in_array($input['status'], $allowedStatuses, true)) {
            sendJson([
                'error' => 'Invalid status'
            ], 400);
        }

        $updates[] = 'status = ?';
        $params[] = $input['status'];
    }

    if (array_key_exists('followed_up_date', $input)) {
        $updates[] = 'followed_up_date = ?';
        $params[] = $input['followed_up_date'] === null || $input['followed_up_date'] === '' ? null : $input['followed_up_date'];
    }

    if (array_key_exists('follow_up_dismissed', $input)) {
        $updates[] = 'follow_up_dismissed = ?';
        $value = $input['follow_up_dismissed'];
        // Normalize boolean/string values (true/false, 1/0, "true"/"false")
        if (is_string($value)) {
            $value = strtolower($value) === 'true' || $value === '1';
        }
        $params[] = $value ? 1 : 0;
    }

    if (array_key_exists('interview_date', $input)) {
        $updates[] = 'interview_date = ?';
        $params[] = $input['interview_date'] === null || $input['interview_date'] === '' ? null : $input['interview_date'];
    }

    if (array_key_exists('notes', $input)) {
        $updates[] = 'notes = ?';
        $params[] = $input['notes'];
    }

    if (array_key_exists('source', $input)) {
        $updates[] = '`source` = ?';
        $params[] = $input['source'];
    }

    if (array_key_exists('hyperlink', $input)) {
        $updates[] = 'hyperlink = ?';
        $params[] = $input['hyperlink'];
    }

    if (empty($updates)) {
        sendJson([
            'error' => 'No fields to update'
        ], 400);
    }

    $updates[] = 'updated_at = ?';
    $params[] = $now;
    $params[] = $jobId;

    $sql = "
        UPDATE jobs
        SET
            " . implode(', ', $updates) . "
        WHERE id = ?
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    $stmt = $pdo->prepare("SELECT * FROM jobs WHERE id = ?");
    $stmt->execute([$jobId]);

    sendJson($stmt->fetch());
}

// =========================
// DELETE JOB
// =========================
if (
    $_SERVER['REQUEST_METHOD'] === 'DELETE' &&
    preg_match('/^\/api\/jobs\/(\d+)$/', $_SERVER['REQUEST_URI'], $matches)
) {
    $jobId = (int)$matches[1];

    $stmt = $pdo->prepare("DELETE FROM jobs WHERE id = ?");
    $stmt->execute([$jobId]);

    sendJson([
        'success' => true
    ]);
}

sendJson([
    'error' => 'Endpoint not found'
], 404);