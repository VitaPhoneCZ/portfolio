<?php
header('Content-Type: application/json; charset=utf-8');

// Configuration
$to_email = "vitek.f18@gmail.com";
$subject_prefix = "[Portfolio Kontakt] ";

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

// Prepare Email
$subject = $subject_prefix . "Zpráva od " . $hero_name;
$body = "Jméno: $hero_name\n";
$body .= "Email: $sender_email\n\n";
$body .= "Zpráva:\n$message_content\n";

$headers = "From: no-reply@portfolio.local\r\n"; // Or use sender_email if server allows spoofing
$headers .= "Reply-To: $sender_email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Send
if (mail($to_email, $subject, $body, $headers)) {
    echo json_encode(["status" => "success", "message" => "Zpráva byla úspěšně odeslána!"]);
} else {
    // In local XAMPP without SMTP configured, mail() returns false.
    // For testing purposes, we might want to simulate success or log it.
    // Uncomment next line to simulate success on local if mail() fails (for UI testing)
    // echo json_encode(["status" => "success", "message" => "Odesláno (Simulace pro localhost)."]); exit;

    echo json_encode(["status" => "error", "message" => "Chyba při odesílání emailu. (Zkontrolujte SMTP nastavení serveru)"]);
}
?>
