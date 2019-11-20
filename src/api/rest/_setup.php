<?php

include_once __DIR__.'/_headers.php';
include_once __DIR__.'/_functions.php';
include_once __DIR__.'/_security.php';
include_once __DIR__.'/_dictionary.php';

$res = checkForTokenOrDie();

$userID = $res['UserID'];
$isAdmin = $res['IsAdmin'];