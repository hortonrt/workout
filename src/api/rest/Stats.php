<?php
include_once __DIR__.'/_rest.php';

$method = $_SERVER['REQUEST_METHOD'];

if($method === "GET"){
  $stats = array();
  $rmh = custom("CALL rep_max_history(" . $userID . ");");
  $stats["RepMaxHistory"] = $rmh;
  $rmc = custom("CALL rep_max_current(" . $userID . ");");
  $stats["RepMaxCurrent"] = $rmc;
  echo(json_encode($stats,  JSON_NUMERIC_CHECK));
}