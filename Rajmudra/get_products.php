<?php
header("Content-Type: application/json; charset=utf-8");
require_once "db.php";
$category=trim($_GET["category"]??"");
if($category===""){echo json_encode(["success"=>false,"message"=>"Category is required"]);exit;}
$stmt=$conn->prepare("SELECT id,category,name,description,price,image,rating,reviews_count FROM products WHERE category=? ORDER BY id ASC");
$stmt->bind_param("s",$category);$stmt->execute();$result=$stmt->get_result();$products=[];
while($row=$result->fetch_assoc())$products[]=$row;
echo json_encode(["success"=>true,"products"=>$products],JSON_UNESCAPED_UNICODE);
$stmt->close();$conn->close();
?>