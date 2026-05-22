<?php
require_once __DIR__ . '/db.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

$allowedStatuses = ['Wishlist', 'Applied', 'Interviewing', 'Offer', 'Rejected', 'Withdrawn'];

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Get all jobs
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $_SERVER['REQUEST_URI'] === '/api/jobs') {
    $stmt = $pdo->query("SELECT * FROM jobs ORDER BY date_applied DESC");
    $jobs = $stmt->fetchAll();
    echo json_encode($jobs);
    exit();
}

// Add a new job
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_SERVER['REQUEST_URI'] === '/api/jobs') {
    $input = json_decode(file_get_contents('php://input'), true);

    $company = $input['company'] ?? '';
    $position = $input['position'] ?? '';
    $status = $input['status'] ?? 'Applied';
    $interview_date = $input['interview_date'] ?? null;
    $notes = $input['notes'] ?? '';

    if (empty($company) || empty($position)) {
        http_response_code(400);
        echo json_encode(['error' => 'Company and position are required']);
        exit();
    }

    if (!in_array($status, $allowedStatuses)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid status']);
        exit();
    }

    $stmt = $pdo->prepare("INSERT INTO jobs (company, position, status, interview_date, notes) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$company, $position, $status, $interview_date, $notes]);
    
    $id = $pdo->lastInsertId();
    $stmt = $pdo->prepare("SELECT * FROM jobs WHERE id = ?");
    $stmt->execute([$id]);
    $job = $stmt->fetch();
    
    echo json_encode($job);
    exit();
}

// Update a job
if ($_SERVER['REQUEST_METHOD'] === 'PUT' && preg_match('/^\/api\/jobs\/(\d+)$/', $_SERVER['REQUEST_URI'], $matches)) {
    $id = $matches[1];
    $input = json_decode(file_get_contents('php://input'), true);
    
    $company = $input['company'] ?? null;
    $position = $input['position'] ?? null;
    $status = $input['status'] ?? null;
    $interview_date = $input['interview_date'] ?? null;
    $notes = $input['notes'] ?? null;

    $updates = [];
    $params = [];
    
    if ($company !== null) {
        $updates[] = "company = ?";
        $params[] = $company;
    }
    if ($position !== null) {
        $updates[] = "position = ?";
        $params[] = $position;
    }
    if ($status !== null) {
        $updates[] = "status = ?";
        $params[] = $status;
    }
    if ($interview_date !== null) {
        $updates[] = "interview_date = ?";
        $params[] = $interview_date;
    }
    if ($notes !== null) {
        $updates[] = "notes = ?";
        $params[] = $notes;
    }
    
    if (empty($updates)) {
        http_response_code(400);
        echo json_encode(['error' => 'No fields to update']);
        exit();
    }
    
    $params[] = $id;
    $sql = "UPDATE jobs SET " . implode(', ', $updates) . ", updated_at = CURRENT_TIMESTAMP WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    
    $stmt = $pdo->prepare("SELECT * FROM jobs WHERE id = ?");
    $stmt->execute([$id]);
    $job = $stmt->fetch();
    
    echo json_encode($job);
    exit();
}

// Delete a job
if ($_SERVER['REQUEST_METHOD'] === 'DELETE' && preg_match('/^\/api\/jobs\/(\d+)$/', $_SERVER['REQUEST_URI'], $matches)) {
    $id = $matches[1];
    
    $stmt = $pdo->prepare("DELETE FROM jobs WHERE id = ?");
    $stmt->execute([$id]);
    
    echo json_encode(['success' => true]);
    exit();
}

http_response_code(404);
echo json_encode(['error' => 'Endpoint not found']);
?>