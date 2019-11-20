<?php

function getPayload(){
  $array = null;
  $method = $_SERVER['REQUEST_METHOD'];
  if($method === 'GET'){
    $q =  $_SERVER['QUERY_STRING'];
    parse_str($q, $array);
  }
  else{
    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);
    $array = array($request);
  }
  if(sizeof($array) === 1){
    return $array[0];
  }
  else{
    return $array;
  }  
}

function getResult($result) {
  $val = array();
  if ($result->num_rows > 0){
    $i=0;
    while ($row = $result->fetch_assoc()) {
      $val[]=$row;
    }
  }
  return $val;
}

function guid(){
  if (function_exists('com_create_guid') === true)
      return trim(com_create_guid(), '{}');
  
  $data = openssl_random_pseudo_bytes(16);
  $data[6] = chr(ord($data[6]) & 0x0f | 0x40);
  $data[8] = chr(ord($data[8]) & 0x3f | 0x80);
  return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}