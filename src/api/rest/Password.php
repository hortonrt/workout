<?php
include_once __DIR__.'/_rest.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = new DBClass();

if($method === "POST") {
  $payload = getPayload();
  $user = checkForTokenOrDie();
  if(isset($payload->UserID) && !empty($payload->UserID) && $payload->UserID == $user["UserID"]){
    //user is updating
    error_log($user['Password']);
    if(password_verify($payload->OldPassword, $user['Password'])){
      //good password
      $pwUp = array('UserID'=> $user['UserID'], 'Password'=> password_hash($payload->NewPassword, PASSWORD_DEFAULT));
      upsert('Users', $pwUp);
      echo(json_encode(array('message'=> 'Password has been changed.')));
    }
    else {
      //bad password
      http_response_code(400);
      $res = array('status'=> 400, 'message' => 'Invalid Current Password');
      echo(json_encode($res));
    }
  } else if($user['IsAdmin'] === 1){
    //admin is updating
    $pwUp = array('UserID'=> $user['UserID'], 'Password'=> password_hash($payload->NewPassword, PASSWORD_DEFAULT));
    upsert('Users', $pwUp);
    echo(json_encode(array('message'=> 'Password has been changed for '. $user['FirstName'] . ' ' . $user['LastName'])));
  } 
}