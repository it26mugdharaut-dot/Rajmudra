<?php
header("Content-Type: application/json; charset=utf-8");
require_once "db.php";
$name=trim($_POST["name"]??"");$phone=trim($_POST["phone"]??"");$address=trim($_POST["address"]??"");$payment=trim($_POST["payment"]??"");$cartJSON=$_POST["cart"]??"";
if($name===""||$phone===""||$address===""||$cartJSON===""){echo json_encode(["success"=>false,"message"=>"Required information is missing."]);exit;}
$cart=json_decode($cartJSON,true);
if(!is_array($cart)||!count($cart)){echo json_encode(["success"=>false,"message"=>"Cart is empty."]);exit;}
$total=0;foreach($cart as $item){$p=floatval($item["price"]??0);$q=intval($item["quantity"]??0);if($q>0)$total+=$p*$q;}
$conn->begin_transaction();
try{
$stmt=$conn->prepare("INSERT INTO customers(name,phone,address) VALUES(?,?,?)");$stmt->bind_param("sss",$name,$phone,$address);$stmt->execute();$customerID=$stmt->insert_id;$stmt->close();
$stmt=$conn->prepare("INSERT INTO orders(customer_id,total_amount,payment_method,status) VALUES(?,?,?,'Pending')");$stmt->bind_param("ids",$customerID,$total,$payment);$stmt->execute();$orderID=$stmt->insert_id;$stmt->close();
$stmt=$conn->prepare("INSERT INTO order_items(order_id,product_name,price,quantity) VALUES(?,?,?,?)");
foreach($cart as $item){$pn=trim($item["name"]??"");$p=floatval($item["price"]??0);$q=intval($item["quantity"]??0);if($pn!==""&&$q>0){$stmt->bind_param("isdi",$orderID,$pn,$p,$q);$stmt->execute();}}
$stmt->close();$conn->commit();
echo json_encode(["success"=>true,"message"=>"Order saved successfully.","order_id"=>$orderID,"total"=>$total]);
}catch(Exception $e){$conn->rollback();echo json_encode(["success"=>false,"message"=>"Order could not be saved."]);}
$conn->close();
?>