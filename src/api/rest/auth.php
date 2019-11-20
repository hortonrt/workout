<?php

include_once __DIR__.'/_headers.php';
include_once __DIR__.'/_functions.php';
include_once __DIR__.'/_db.php';

$payload = getPayload();
$db = new DBClass();
$stmt = $db->pdo->prepare("SELECT * FROM Users WHERE Username = ?;");
$stmt->execute([$payload->Username]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);
$stmt = null;
if($user){  
  if($user && password_verify($payload->Password, $user['Password'])){    
    //good auth    
    $user['Token'] = guid();
    $user['Expires'] = date("Y-m-d H:i:s", strtotime('+12 hours'));
    $newTokenQuery = "UPDATE Users SET Token = '" . $user['Token'] ."', Expires = '" . $user['Expires'] . "' Where UserID = " . $user['UserID'] . ";";
    $stmt = $db->pdo->prepare($newTokenQuery);
    $stmt->execute([]);
    $stmt = null;
    $user['Password'] = '';
    echo(json_encode($user));
  }
   else{    
     //bad auth
     http_response_code(401);
     exit();  
  }  
}
else{
  //no user
  http_response_code(401);
  exit();
}


