<?php

include_once __DIR__.'/_setup.php';
include_once __DIR__.'/_db.php';
include_once __DIR__.'/_functions.php';

function get($table, $id){
  $dictionary = getDictionary();
  $db = new DBClass();
  $stmt = $db->pdo->prepare('SELECT * FROM ' . $table . ' WHERE ' . $dictionary[$table]['ID'] .' = ? and ' . $dictionary[$table]['ID'] .' != -1 ORDER BY ' . $dictionary[$table]['ORDER'] . ';');
  $stmt->execute([$id]);
  $result = $stmt->fetch(PDO::FETCH_ASSOC);
  $stmt = null;
  return $result;
}

function getCustom($table, $id, $customFilter){
  $dictionary = getDictionary();
  $db = new DBClass();
  $stmt = $db->pdo->prepare('SELECT * FROM ' . $table . ' WHERE ' . $dictionary[$table]['ID'] .' = ? and ' . $customFilter . '  and ' . $dictionary[$table]['ID'] .' != -1 ORDER BY ' . $dictionary[$table]['ORDER'] . ';');
  $stmt->execute([$id]);
  $result = $stmt->fetch(PDO::FETCH_ASSOC);
  $stmt = null;
  return $result;
}

function getBy($table, $val, $field){
  $dictionary = getDictionary();
  $val = strval($val);
  $db = new DBClass();
  $stmt = $db->pdo->prepare('SELECT * FROM ' . $table . ' WHERE ' . $field .' = ?  and ' . $dictionary[$table]['ID'] .' != -1 ORDER BY ' . $dictionary[$table]['ORDER'] . ';');
  $stmt->execute([$val]);
  $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
  $stmt = null;
  return $result;
}

function getByUser($table, $val, $field, $userID){
  $dictionary = getDictionary();
  $val = strval($val);
  $db = new DBClass();
  $stmt = $db->pdo->prepare('SELECT * FROM ' . $table . ' WHERE ' . $field .' = ? and UserID = ?  and ' . $dictionary[$table]['ID'] .' != -1 ORDER BY ' . $dictionary[$table]['ORDER'] . ';');
  $stmt->execute([$val, $userID]);
  $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
  $stmt = null;
  return $result;
}

function getAllByUser($table, $userID){
  $dictionary = getDictionary();
  $db = new DBClass();
  $stmt = $db->pdo->prepare('SELECT * FROM ' . $table . ' WHERE UserID = ?  and ' . $dictionary[$table]['ID'] .' != -1 ORDER BY ' . $dictionary[$table]['ORDER'] . ';');
  $stmt->execute([$userID]);
  $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
  $stmt = null;
  return $result;
}

function getAllByUserCustomFilter($table, $userID, $customFilter){
  $dictionary = getDictionary();
  $db = new DBClass();
  $stmt = $db->pdo->prepare('SELECT * FROM ' . $table . ' WHERE UserID = ? and ' . $customFilter . '  and ' . $dictionary[$table]['ID'] .' != -1 ORDER BY ' . $dictionary[$table]['ORDER'] . ';');
  $stmt->execute([$userID]);
  $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
  $stmt = null;
  return $result;
}

function getAll($table){
  $dictionary = getDictionary();
  $db = new DBClass();
  $stmt = $db->pdo->prepare('SELECT * FROM ' . $table . ' WHERE ' . $dictionary[$table]['ID'] .' != -1 ORDER BY ' . $dictionary[$table]['ORDER'] . ';');
  $stmt->execute([]);
  $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
  $stmt = null;
  return $result;
}

function custom($sql){
  $db = new DBClass();
  $stmt = $db->pdo->prepare($sql);
  $stmt->execute([]);
  $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
  $stmt = null;
  return $result;
}


function upsert($table, $data){
  $dictionary = getDictionary();
  $id = null;
  foreach($data as $key=>$val) {
    if($key === $dictionary[$table]['ID']){
      $id = $val;
    }
  }
  if(empty($id) || $id <= 0){
    return insert($table, $data);
  }
  else{
    return update($table, $data, $id);
  }
}

function insert($table, $data){
  $id = null;
  $dictionary = getDictionary();
  $db = new DBClass();
  foreach($data as $key=>$val) {
    if(!is_array($val) && $key !== $dictionary[$table]['ID']){
      $cols[] = "$key";
      $type = gettype($val);
      if($type === 'string'){
      $vals[] = "'$val'";
      }else if($type === 'boolean'){
          if(!empty($val)){
            $vals[] = $val;
          }
          else{
            $vals[] = 0;
          }
      }else{
        $vals[] = $val;
      }
    }
  }
  $sql = '';
  if(isset($dictionary[$table]['AddUserID']) && $dictionary[$table]['AddUserID'] === true){
    $user = checkForTokenOrDie();
    $sql = "INSERT INTO $table (" . implode(', ', $cols) . ", UserID) VALUES (" . implode(', ', $vals) . ", " . $user['UserID'] . ");";
  }
  else{
    $sql = "INSERT INTO $table (" . implode(', ', $cols) . ") VALUES (" . implode(', ', $vals) . ");";
  }
  $stmt = $db->pdo->prepare($sql);
  $stmt->execute();
  $id = $db->pdo->lastInsertId();
  $stmt = null;
  return $id;
}

function update($table, $data, $id) {
  $dictionary = getDictionary();
  $db = new DBClass();
  foreach($data as $key=>$val) {
    if(!is_array($val) && $key !== $dictionary[$table]['ID']){
      $type = gettype($val);
      if($type === 'string'){
        $cols[] = "$key = '$val'";
      }else if($type === 'boolean'){
          if(!empty($val)){
            $cols[] = "$key = $val";
          }
          else{
            $cols[] = "$key = 0";
          }
      }else{
        $cols[] = "$key = $val";
      }
    }
  }
  $sql = "UPDATE $table SET " . implode(', ', $cols) . " WHERE " . $dictionary[$table]['ID'] . ' = ' . $id . ';';
  $stmt = $db->pdo->prepare($sql);
  $stmt->execute();
  $stmt = null;
  return $id;
}

function deleteR($table, $id){
  $dictionary = getDictionary();
  $db = new DBClass();
  $sql = "DELETE FROM $table WHERE " . $dictionary[$table]['ID'] . ' = ' . $id . ';';
  $stmt = $db->pdo->prepare($sql);
  $stmt->execute();
  $stmt = null;
}

function executeR($sql){
  $dictionary = getDictionary();
  $db = new DBClass();
  $stmt = $db->pdo->prepare($sql);
  $stmt->execute();
  $stmt = null;
}
