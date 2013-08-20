<?php
include "dbFunctions.php";
if (checkIdNPassword($_GET)){

	$user = $_GET["userId"];
	$value = $_GET["value"];

	dbConnect();

	$updateLine= "UPDATE `users` SET `inHome`='".$value."' where `id` = '".$user."'";
	$dbResult = mysql_query ($updateLine)
      or die(mysql_errno().":".mysql_error()." - Error. Product Listing failed .... use the browsers BACK button");
  }
?>
