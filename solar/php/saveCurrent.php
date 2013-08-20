<?php
include "dbFunctions.php";
if (checkIdNPassword($_GET)){
	//saveCurrentStateToScenario($_GET["name"],"",getAllComponentsValues($_GET["name"]));


	$name = $_GET["name"];
	$description = "";
	$components = getAllComponentsValues($_GET["name"]);

	dbConnect();
	$listQuery= "INSERT INTO  `solar`.`lights_scenarions` (`id` ,`name` ,`description`)".
			" VALUES (NULL ,  '".$name."','".$description."')";

	$dbResult = mysql_query ($listQuery)
      or die(mysql_errno().":".mysql_error()." - Error. Product Listing failed .... use the browsers BACK button");

	$listQuery= "select id from `solar`.`lights_scenarions` where `name` = '".$name."'";

	$dbResult = mysql_query ($listQuery)
      or die(mysql_errno().":".mysql_error()." - Error. Product Listing failed .... use the browsers BACK button");

	$row=mysql_fetch_assoc($dbResult);
	$id = $row["id"];

	$insertQuery= "INSERT INTO `solar`.`lights_scenarions_components` (`scenarioId`, `componentId`, `newValue`) VALUES ('";
	$first = true;
	foreach ($components as $value) {
		if ($value["kind"] == 3 || $value["kind"] == 2){
			if (!$first){
				$insertQuery = $insertQuery."'), ('";
			}
			$first = false;
			$insertQuery = $insertQuery.$id."', '".$value["id"]."','".$value["value"];			
		}
	}
	$insertQuery = $insertQuery."')";
	$dbResult = mysql_query ($insertQuery)
      or die(mysql_errno().":".mysql_error()." - Error. Product Listing failed .... use the browsers BACK button");

}
else
	echo "sssss";
?>