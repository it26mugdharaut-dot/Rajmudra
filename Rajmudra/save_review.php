<?php
header("Content-Type: application/json; charset=utf-8");
require_once "db.php";
$name=trim($_POST["name"]??"");$rating=intval($_POST["rating"]??0);$review=trim($_POST["review"]??"");
if($name===""||$review===""||$rating<1||$rating>5){echo json_encode(["success"=>false,"message"=>"Please enter valid review details."]);exit;}
$stmt=$conn->prepare("INSERT INTO reviews(name,rating,review) VALUES(?,?,?)");$stmt->bind_param("sis",$name,$rating,$review);
echo $stmt->execute()?json_encode(["success"=>true,"message"=>"Review saved successfully."]):json_encode(["success"=>false,"message"=>"Unable to save review."]);
$stmt->close();$conn->close();
?>