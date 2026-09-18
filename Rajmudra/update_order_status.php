<?php

require_once "db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    die("Invalid request.");
}

$order_id = intval($_POST["order_id"] ?? 0);
$status = trim($_POST["status"] ?? "");

$allowed_status = [
    "Pending",
    "Confirmed",
    "Shipped",
    "Delivered",
    "Cancelled"
];

if ($order_id <= 0) {
    die("Invalid Order ID.");
}

if (!in_array($status, $allowed_status, true)) {
    die("Invalid status.");
}

$sql = "UPDATE orders SET status = ? WHERE id = ?";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    die("Database error: " . $conn->error);
}

$stmt->bind_param("si", $status, $order_id);

if (!$stmt->execute()) {
    die("Update failed: " . $stmt->error);
}

$stmt->close();
$conn->close();

header("Location: admin_orders.php?updated=1");
exit;

?>