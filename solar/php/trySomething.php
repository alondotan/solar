<?php
include "dbFunctions.php";
include "/gcm_server_php/send_message.php";

// date_default_timezone_set("Israel"); 
// $phpTime = time();
// $mysqlTime = floor(date( 'H', $phpTime )/4);

$res = getAlertData() ;
var_dump($res);
$res = getAlertedUsers($res);
var_dump($res);

//sendMessage($_GET["regId"],$_GET["message"]);
?>
