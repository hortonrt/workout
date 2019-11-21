<?php

class DBClass {

    private $host = "";
    private $username = "";
    private $password = "";
    private $database = "";

    public $pdo;

    public function __construct(){
        $this->host = "localhost";
        $this->username = "porktig3_workout";
        $this->password = "vN99iwbv7!";
        $this->database = "porktig3_workout";
        $this->getConnection();      
    }

    // get the database connection
    public function getConnection(){
        $dsn = "mysql:host=" . $this->host . ";dbname=" . $this->database . ";charset=utf8";
        $options = [
            PDO::ATTR_EMULATE_PREPARES   => false, // turn off emulation mode for "real" prepared statements
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, //turn on errors in the form of exceptions
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC, //make the default fetch be an associative array
        ];
        try {
            $this->pdo = new PDO($dsn, $this->username, $this->password, $options);
        } catch (Exception $e) {
            error_log($e->getMessage());
            exit('Could not connect to DB'); //something a user can understand
        }
    }
}
?>