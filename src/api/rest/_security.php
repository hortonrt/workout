<?php

include_once __DIR__."/_db.php";



function checkForTokenOrDie(){
  $token = null;
  $headers = apache_request_headers();
  if(isset($headers['Authorization']) === false){
    dieWithResult();
  }
  else{
    //check for valid token
    $db = new DBClass();
    $token = getToken();
    $stmt = $db->pdo->prepare("SELECT Expires, UserID, IsAdmin, Password FROM Users WHERE Token = ?;");
    $stmt->execute([$token]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    $stmt = null;
    if($user){        
      $now = date("Y-m-d H:i:s");
      $expires = date($user['Expires']);
      if(empty($user) || empty($user['Expires']) || $now > $expires){
        dieWithResult();
      }      
      else{
        return $user;
      }
    }
    else{
      dieWithResult();
    }
  } 
}

function getToken(){
  $token = null;
  $headers = apache_request_headers();
  if(isset($headers['Authorization'])){
    $token = $headers['Authorization'];
  } 
  return $token;
}

function dieWithResult(){
  http_response_code(401);
  $result = array(
    "status" => 401,
    "message" => 'Credentials are invlaid or have expired.'
  );
  echo(json_encode($result));
  die();
}