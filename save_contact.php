<?php
header("Content-Type: application/json; charset=utf-8");
require_once "db.php";
$name=trim($_POST["name"]??"");$email=trim($_POST["email"]??"");$phone=trim($_POST["phone"]??"");$product=trim($_POST["product"]??"");$message=trim($_POST["message"]??"");
if($name===""||$email===""||$phone===""){echo json_encode(["success"=>false,"message"=>"Please fill all required fields."]);exit;}
$stmt=$conn->prepare("INSERT INTO enquiries(name,email,phone,product,message) VALUES(?,?,?,?,?)");$stmt->bind_param("sssss",$name,$email,$phone,$product,$message);
echo $stmt->execute()?json_encode(["success"=>true,"message"=>"Enquiry saved successfully."]):json_encode(["success"=>false,"message"=>"Unable to save enquiry."]);
$stmt->close();$conn->close();
?>