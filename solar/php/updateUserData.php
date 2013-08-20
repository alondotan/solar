<?php
include "dbFunctions.php";
if (checkIdNPassword($_GET)){
// update the values of the sensor and divices in the house from the controller
	$userId = $_GET["userId"];

	$setText = "";
	if (array_key_exists("regId",$_GET))
		 $setText = "`regId` =  '".$_GET["regId"]."'";
	
	if (array_key_exists("diffAlert",$_GET)){
		if ($setText != "") $setText = $setText." , "; 
		$setText = $setText."`diffAlert` =  '".$_GET["diffAlert"]."'";
	}
	
	if (array_key_exists("maxAlert",$_GET)){
		if ($setText != "") $setText = $setText." , "; 
		$setText = $setText."`maxAlert` =  '".$_GET["maxAlert"]."'";
	}

	if (array_key_exists("scenarioName",$_GET)){
		if ($setText != "") $setText = $setText." , "; 
		if ($_GET["scenarioName"] != "")
			$setText = $setText."`airConditionScenario` =  (select id from lights_scenarions where name ='".$_GET["scenarioName"]."') ";
		else
			$setText = $setText."`airConditionScenario` =  -1";
	}

	if ($setText != ""){
		dbConnect();
		$sqlUpdate = "UPDATE  `solar`.`users` SET  ".$setText." WHERE  `id` =".$userId;

		$dbResult = mysql_query ($sqlUpdate)
			or die(mysql_errno().":".mysql_error()." - Error. Product Listing failed .... use the browsers BACK button");

		// mysql_free_result($dbResult);
		mysql_close();
	}

}
?>
