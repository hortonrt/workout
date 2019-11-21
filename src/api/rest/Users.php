<?php
include_once __DIR__.'/_rest.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = new DBClass();

if($method === "GET"){
  if(isset($_GET['i'])){    
    if(filter_var($_GET['i'], FILTER_VALIDATE_INT)){
      $id = intval($_GET['i']);
      $user = get('Users', $id);
      $user['Password'] = '';
      $user['Token'] = '';
      echo(json_encode(array($user)));
    }    
    else{
      http_response_code(400);
      $res = array('status'=> 400, 'message' => 'Invalid Request');
      echo(json_encode($res));
    }
  }
  else if($isAdmin === 1){
    $users = getAll('Users');
    foreach($users as $userKey => $user){
      $users[$userKey]['Password'] = '';
      $users[$userKey]['Token'] = '';
    }
    echo(json_encode($users));
  }
  else{
    http_response_code(400);
    $res = array('status'=> 400, 'message' => 'Invalid Request');
    echo(json_encode($res));
  }
}

if($method === "POST") {
  $payload = getPayload();
  $user = checkForTokenOrDie();
  if(isset($payload->UserID) && !empty($payload->UserID) && $payload->UserID == $user["UserID"]){
    //user is updating
    unset($payload->Password);
    upsert('Users', $payload);
    echo(json_encode(array('message'=> 'User profile has been updated.')));
  }
  else if($payload->UserID === -1 && $user['IsAdmin'] === 1){
    //admin creating
    if($payload->UserID === -1){
      $payload->Password = password_hash($payload->Password, PASSWORD_DEFAULT);
    }
    $exists = getBy('Users', $payload->Username, 'Username');
    if(count($exists) > 0){
      http_response_code(400);
      $res = array('status'=> 400, 'message' => 'Username already exists');
      echo(json_encode($res));
    }
    else{
      upsert('Users', $payload);
      echo(json_encode(array('message'=> 'User has been created.')));
    }
  }
  else if(isset($payload->UserID) && !empty($payload->UserID) && $user['IsAdmin'] === 1){
    //admin updating
    if(isset($payload->Password) && !empty($payload->Password)){
      $payload->Password = password_hash($payload->Password, PASSWORD_DEFAULT);
    }
    upsert('Users', $payload);
    echo(json_encode(array('message'=> 'User has been updated.')));
  }
  else{
    http_response_code(400);
    $res = array('status'=> 400, 'message' => 'Invalid Request');
    echo(json_encode($res));
  }
}