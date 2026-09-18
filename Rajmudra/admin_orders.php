<?php

require_once "db.php";

$sql = "
    SELECT
        o.id AS order_id,
        c.name AS customer_name,
        c.phone,
        c.address,
        oi.product_name,
        oi.price,
        oi.quantity,
        o.total_amount,
        o.payment_method,
        o.status,
        o.created_at
    FROM orders o
    JOIN customers c
        ON c.id = o.customer_id
    JOIN order_items oi
        ON oi.order_id = o.id
    ORDER BY o.id DESC
";

$result = $conn->query($sql);

if (!$result) {
    die("Database Error: " . $conn->error);
}

?>

<!DOCTYPE html>
<html lang="en">

<head>

<meta charset="UTF-8">

<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Rajmudra - Admin Orders</title>

<style>

* {
    box-sizing: border-box;
}

body {
    margin: 0;
    padding: 0;
    font-family: Arial, Helvetica, sans-serif;
    background: #f7f3ed;
    color: #333;
}

/* HEADER */

.admin-header {
    background: #5a1f2b;
    color: white;
    padding: 25px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 3px 10px rgba(0,0,0,0.15);
}

.admin-header h1 {
    margin: 0;
    font-size: 28px;
}

.admin-header p {
    margin: 6px 0 0;
    color: #f3d9a4;
    font-size: 14px;
}

.back-btn {
    background: #d4a64a;
    color: #fff;
    text-decoration: none;
    padding: 11px 18px;
    border-radius: 7px;
    font-weight: bold;
}

.back-btn:hover {
    background: #b98b32;
}

/* MAIN */

.container {
    width: 95%;
    max-width: 1500px;
    margin: 35px auto;
}

/* SUMMARY */

.summary {
    display: flex;
    gap: 20px;
    margin-bottom: 25px;
    flex-wrap: wrap;
}

.summary-card {
    background: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 3px 12px rgba(0,0,0,0.08);
    min-width: 180px;
    flex: 1;
}

.summary-card h3 {
    margin: 0;
    color: #777;
    font-size: 14px;
}

.summary-card p {
    margin: 8px 0 0;
    font-size: 26px;
    font-weight: bold;
    color: #5a1f2b;
}

/* TABLE */

.table-container {
    background: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 3px 15px rgba(0,0,0,0.08);
    overflow-x: auto;
}

.table-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 18px;
    gap: 15px;
    flex-wrap: wrap;
}

.table-title h2 {
    margin: 0;
    color: #5a1f2b;
}

.refresh-btn {
    border: none;
    background: #5a1f2b;
    color: white;
    padding: 10px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
}

.refresh-btn:hover {
    background: #421620;
}

table {
    width: 100%;
    border-collapse: collapse;
    min-width: 1200px;
}

th {
    background: #5a1f2b;
    color: white;
    padding: 13px 10px;
    text-align: left;
    font-size: 14px;
    white-space: nowrap;
}

td {
    padding: 13px 10px;
    border-bottom: 1px solid #eee;
    font-size: 14px;
    vertical-align: middle;
}

tr:hover td {
    background: #fffaf2;
}

/* ORDER */

.order-id {
    font-weight: bold;
    color: #5a1f2b;
    white-space: nowrap;
}

/* CUSTOMER */

.customer-name {
    font-weight: bold;
    color: #333;
}

.phone {
    color: #666;
    margin-top: 4px;
}

/* PRODUCT */

.product-name {
    font-weight: bold;
    color: #5a1f2b;
}

/* STATUS FORM */

.status-form {
    display: flex;
    flex-direction: column;
    gap: 7px;
    min-width: 140px;
}

/* DROPDOWN */

.status-select {
    width: 145px;
    padding: 9px 10px;
    border: 1px solid #bbb;
    border-radius: 6px;
    background: white;
    color: #333;
    font-size: 14px;
    cursor: pointer;
}

.status-select:focus {
    outline: 2px solid #d4a64a;
}

/* UPDATE BUTTON */

.update-btn {
    width: 145px;
    padding: 9px 10px;
    border: none;
    border-radius: 6px;
    background: #5a1f2b;
    color: white;
    font-size: 13px;
    font-weight: bold;
    cursor: pointer;
}

.update-btn:hover {
    background: #7a2b3b;
}

/* EMPTY */

.empty {
    text-align: center;
    padding: 50px 20px;
    color: #777;
}

.empty-icon {
    font-size: 45px;
    margin-bottom: 10px;
}

/* MOBILE */

@media (max-width: 700px) {

    .admin-header {
        padding: 20px;
        flex-direction: column;
        align-items: flex-start;
        gap: 15px;
    }

    .container {
        width: 94%;
        margin: 20px auto;
    }

    .summary-card {
        min-width: 100%;
    }

}
.status-form {
    display: flex;
    flex-direction: column;
    gap: 7px;
    min-width: 145px;
}

.status-select {
    width: 145px;
    padding: 9px;
    border: 1px solid #bbb;
    border-radius: 6px;
    background: white;
    color: #333;
    font-size: 14px;
    cursor: pointer;
}

.update-btn {
    width: 145px;
    padding: 9px;
    border: none;
    border-radius: 6px;
    background: #5a1f2b;
    color: white;
    font-weight: bold;
    cursor: pointer;
}

.update-btn:hover {
    background: #7a2b3b;
}

</style>

</head>

<body>

<!-- HEADER -->

<header class="admin-header">

    <div>

        <h1>👑 Rajmudra Admin</h1>

        <p>Order Management Dashboard</p>

    </div>

    <a href="index.html" class="back-btn">
        ← Back to Website
    </a>

</header>


<!-- MAIN -->

<main class="container">


    <!-- SUMMARY -->

    <div class="summary">

        <div class="summary-card">

            <h3>Total Orders</h3>

            <p>
                <?php echo $result->num_rows; ?>
            </p>

        </div>

        <div class="summary-card">

            <h3>Order Management</h3>

            <p>📦</p>

        </div>

        <div class="summary-card">

            <h3>Customer Details</h3>

            <p>👤</p>

        </div>

    </div>


    <!-- ORDERS -->

    <div class="table-container">

        <div class="table-title">

            <h2>📋 Customer Orders</h2>

            <button
                class="refresh-btn"
                onclick="location.reload()">

                🔄 Refresh

            </button>

        </div>


        <?php if ($result->num_rows > 0): ?>

        <table>

            <thead>

                <tr>

                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Address</th>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Date</th>

                </tr>

            </thead>


            <tbody>

            <?php while ($row = $result->fetch_assoc()): ?>

                <tr>

                    <!-- ORDER ID -->

                    <td>

                        <span class="order-id">

                            #<?php
                            echo (int)$row["order_id"];
                            ?>

                        </span>

                    </td>


                    <!-- CUSTOMER -->

                    <td>

                        <div class="customer-name">

                            <?php
                            echo htmlspecialchars(
                                $row["customer_name"]
                            );
                            ?>

                        </div>

                        <div class="phone">

                            📞

                            <?php
                            echo htmlspecialchars(
                                $row["phone"]
                            );
                            ?>

                        </div>

                    </td>


                    <!-- ADDRESS -->

                    <td>

                        <?php
                        echo nl2br(
                            htmlspecialchars(
                                $row["address"]
                            )
                        );
                        ?>

                    </td>


                    <!-- PRODUCT -->

                    <td>

                        <div class="product-name">

                            <?php
                            echo htmlspecialchars(
                                $row["product_name"]
                            );
                            ?>

                        </div>

                    </td>


                    <!-- PRICE -->

                    <td>

                        ₹<?php
                        echo number_format(
                            (float)$row["price"],
                            2
                        );
                        ?>

                    </td>


                    <!-- QUANTITY -->

                    <td>

                        <?php
                        echo (int)$row["quantity"];
                        ?>

                    </td>


                    <!-- TOTAL -->

                    <td>

                        <strong>

                            ₹<?php
                            echo number_format(
                                (float)$row["total_amount"],
                                2
                            );
                            ?>

                        </strong>

                    </td>


                    <!-- PAYMENT -->

                    <td>

                        <?php
                        echo htmlspecialchars(
                            $row["payment_method"]
                        );
                        ?>

                    </td>


                    <!-- STATUS -->

                    <td>
    <form action="update_order_status.php" method="POST" class="status-form">

        <input
            type="hidden"
            name="order_id"
            value="<?php echo (int)$row["order_id"]; ?>"
        >

        <select name="status" class="status-select">

            <option value="Pending"
                <?php if (strtolower($row["status"]) === "pending") echo "selected"; ?>>
                Pending
            </option>

            <option value="Confirmed"
                <?php if (strtolower($row["status"]) === "confirmed") echo "selected"; ?>>
                Confirmed
            </option>

            <option value="Shipped"
                <?php if (strtolower($row["status"]) === "shipped") echo "selected"; ?>>
                Shipped
            </option>

            <option value="Delivered"
                <?php if (strtolower($row["status"]) === "delivered") echo "selected"; ?>>
                Delivered
            </option>

            <option value="Cancelled"
                <?php if (strtolower($row["status"]) === "cancelled") echo "selected"; ?>>
                Cancelled
            </option>

        </select>

        <button type="submit" class="update-btn">
            Update
        </button>

    </form>
</td>


                    <!-- DATE -->

                    <td>

                        <?php
                        echo htmlspecialchars(
                            $row["created_at"] ?? ""
                        );
                        ?>

                    </td>

                </tr>

            <?php endwhile; ?>

            </tbody>

        </table>


        <?php else: ?>

            <div class="empty">

                <div class="empty-icon">
                    📦
                </div>

                <h3>No orders yet</h3>

                <p>
                    Customer orders will appear here
                    after someone places an order.
                </p>

            </div>

        <?php endif; ?>

    </div>

</main>


<?php

$conn->close();

?>

</body>

</html>