<?php
include "dbFunctions.php";
//if (checkIdNPassword($_GET)){
//	saveCurrentStateToScenario($_GET["name"],"",getAllComponentsValues($_GET["name"]));
//	addUser($_POST["name"],$_POST["id"],$_POST["scenarioName"]);
	$name = $_POST["name"];
	$id = $_POST["id"];
	$scenarioName = $_POST["scenarioName"];

	dbConnect();
	
	$defaultTemp = 24;
	$insertSql = "INSERT INTO `solar`.`users` (`name`, `id`, `airConditionScenario`, `favoriteTemperature`) select '".$name."','".$id."',id,'".$defaultTemp."' from `lights_scenarions` where name = '".$scenarioName."'";
	mysql_query ($insertSql)
      or die(mysql_errno().":".mysql_error()." - Error. Product Listing failed .... use the browsers BACK button");    

// }
// else
// 	echo "sssss";
?>
	<html><head>
		<link rel="stylesheet" href="../settingStyle.css" type="text/css" />	</head>
	</head><body>
	<br><br><br>
	<a href="../index.html">Back To solar Home</a>
	<br><br>
	<a href="../setting.html">Back To Settings</a>
	</body></html>