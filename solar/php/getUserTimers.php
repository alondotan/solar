<?php
include "dbFunctions.php";
if (checkIdNPassword($_GET)){

	$id = $_GET["userId"];

	dbConnect();

	$listQuery= "select * from timmer_scenarios where userId = ".$id;
	$dbResult = mysql_query ($listQuery)
      or die(mysql_errno().":".mysql_error()." - Error. Product Listing failed .... use the browsers BACK button");

	$timerArray = array();
	while ($row=mysql_fetch_assoc($dbResult)){
		array_push($timerArray,$row);
	}

	$encoded = json_encode($timerArray);
	header('Content-type: application/json');
	exit($encoded);

}
else
	echo "sssss";

?>