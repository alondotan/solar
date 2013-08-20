<?php
	include "dbFunctions.php";
	dbConnect();
	$id = $_GET["timerId"];
	$deleteQuery= "delete FROM  `timmer_scenarios` WHERE id = '".$id."'"; 
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