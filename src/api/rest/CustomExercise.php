<?php
include_once __DIR__.'/_rest.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = new DBClass();

if($method === "GET"){
  if(isset($_GET['i'])){    
    // get nested
    $exercise = custom('CALL custom_exercise(' . $userID . ',' . $_GET['i'].');');
    echo(json_encode($exercise[0], JSON_NUMERIC_CHECK));
  }
}