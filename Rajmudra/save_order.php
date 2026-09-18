<?php

header("Content-Type: application/json");

require_once "db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode([
        "success" => false,
        "message" => "Invalid request."
    ]);
    exit;
}

$name = trim($_POST["name"] ?? "");
$phone = trim($_POST["phone"] ?? "");
$address = trim($_POST["address"] ?? "");
$payment = trim($_POST["payment"] ?? "");
$cartJson = $_POST["cart"] ?? "";

if ($name === "" || $phone === "" || $address === "" || $cartJson === "") {
    echo json_encode([
        "success" => false,
        "message" => "Please fill all required details."
    ]);
    exit;
}

$cart = json_decode($cartJson, true);

if (!is_array($cart) || count($cart) === 0) {
    echo json_encode([
        "success" => false,
        "message" => "Cart is empty."
    ]);
    exit;
}

$total = 0;

foreach ($cart as $item) {

    $price = floatval($item["price"] ?? 0);
    $quantity = intval($item["quantity"] ?? 0);

    if ($price <= 0 || $quantity <= 0) {
        continue;
    }

    $total += $price * $quantity;
}

if ($total <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid order amount."
    ]);
    exit;
}

$conn->begin_transaction();

try {

    // 1. Save customer
    $customerSql = "INSERT INTO customers
                    (name, phone, address)
                    VALUES (?, ?, ?)";

    $customerStmt = $conn->prepare($customerSql);

    if (!$customerStmt) {
        throw new Exception($conn->error);
    }

    $customerStmt->bind_param(
        "sss",
        $name,
        $phone,
        $address
    );

    $customerStmt->execute();

    $customerId = $conn->insert_id;

    $customerStmt->close();


    // 2. Save order
    $orderSql = "INSERT INTO orders
                 (customer_id, total_amount, payment_method, status)
                 VALUES (?, ?, ?, 'Pending')";

    $orderStmt = $conn->prepare($orderSql);

    if (!$orderStmt) {
        throw new Exception($conn->error);
    }

    $orderStmt->bind_param(
        "ids",
        $customerId,
        $total,
        $payment
    );

    $orderStmt->execute();

    $orderId = $conn->insert_id;

    $orderStmt->close();


    // 3. Save order items
    $itemSql = "INSERT INTO order_items
                (order_id, product_name, price, quantity)
                VALUES (?, ?, ?, ?)";

    $itemStmt = $conn->prepare($itemSql);

    if (!$itemStmt) {
        throw new Exception($conn->error);
    }

    foreach ($cart as $item) {

        $productName = $item["name"] ?? "";
        $price = floatval($item["price"] ?? 0);
        $quantity = intval($item["quantity"] ?? 0);

        if ($productName === "" || $price <= 0 || $quantity <= 0) {
            continue;
        }

        $itemStmt->bind_param(
            "isdi",
            $orderId,
            $productName,
            $price,
            $quantity
        );

        $itemStmt->execute();
    }

    $itemStmt->close();

    $conn->commit();

    echo json_encode([
        "success" => true,
        "message" => "Order placed successfully!",
        "order_id" => $orderId,
        "total" => $total
    ]);

} catch (Exception $e) {

    $conn->rollback();

    echo json_encode([
        "success" => false,
        "message" => "Order could not be saved: " . $e->getMessage()
    ]);
}

$conn->close();

?>