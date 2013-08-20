<?php
	include "dbFunctions.php";
	dbConnect();
	$id = $_POST["deletedSenarioId"];
	$deleteQuery= "delete FROM  `lights_scenarions` WHERE id = '".$id."'"; 
	$dbResult = mysql_query ($deleteQuery)
	  or die(mysql_errno().":".mysql_error()." - Error. Product Listing failed .... use the browsers BACK button");
	$deleteQuery= "delete FROM  `lights_scenarions_components` WHERE scenarioId = '".$id."'"; 
	$dbResult = mysql_query ($deleteQuery)
	  or die(mysql_errno().":".mysql_error()." - Error. Product Listing failed .... use the browsers BACK button");


	mysql_close();

?>
	<html><head>
		<link rel="stylesheet" href="../settingStyle.css" type="text/css" />	</head>
	</head><body>
	<br><br><br>
	<a href="../index.html">Back To solar Home</a>
	<br><br>
	<a href="../setting.html">Back To Settings</a>
	</body></html>