<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: X-Requested-With, Content-Type, Origin, Authorization, Accept, Client-Security-Token, Accept-Encoding');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH');
header("Cache-Control: no-cache, must-revalidate"); 
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); 
header("Content-Type: application/json;charset=UTF-8");

$method = $_SERVER['REQUEST_METHOD'];

// respond to preflights
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
  http_response_code(200);
  exit;
}