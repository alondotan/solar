<?php
include "dbFunctions.php";
if (checkIdNPassword($_GET)){
	$time = $_GET["time"];
	$name = $_GET["name"];
	$isMessage = $_GET["isMessage"];
	$userId = $_GET["userId"];
	date_default_timezone_set('Israel');
	
	dbConnect();
	$insertQuery = "INSERT INTO `timmer_scenarios`(`scenarioId`, `time`, `isMessage`, `userId`) select id,'".$time."','".$isMessage."','".$userId."' from lights_scenarions where name = '".$name."'";
	mysql_query ($insertQuery)
      or die(mysql_errno().":".mysql_error()." - Error. Product Listing failed .... use the browsers BACK button");   
}
else
	echo "sssss";
?>