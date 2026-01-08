<?php
header('Content-Type: application/json; charset=utf-8');

ini_set('display_errors', 0); // Hide potential warnings from response

// Check Method
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["status" => "error", "message" => "Neplatná metoda."]);
    exit;
}

// Get JSON data if sent via fetch body, or regular POST
$data = json_decode(file_get_contents("php://input"), true);
if (!$data) {
    $data = $_POST;
}

// Sanitize Input
$hero_name = trim($data["name"] ?? "");
$sender_email = filter_var(trim($data["email"] ?? ""), FILTER_SANITIZE_EMAIL);
$message_content = trim($data["message"] ?? "");

// Validation
if (empty($hero_name) || empty($sender_email) || empty($message_content)) {
    echo json_encode(["status" => "error", "message" => "Vyplňte prosím všechna pole."]);
    exit;
}

if (!filter_var($sender_email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["status" => "error", "message" => "Neplatný email."]);
    exit;
}

// Save to file
$log_entry = date('Y-m-d H:i:s') . " | Jméno: $hero_name | Email: $sender_email | Zpráva: $message_content" . PHP_EOL;
$log_file = 'formular.txt';

if (file_put_contents($log_file, $log_entry, FILE_APPEND)) {
    echo json_encode(["status" => "success", "message" => "Zpráva byla uložena!"]);
} else {
    echo json_encode(["status" => "error", "message" => "Chyba při ukládání zprávy."]);
}
?>
