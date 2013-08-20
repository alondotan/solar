<?php
include "dbFunctions.php";
if (checkIdNPassword($_GET)){

	$long= $_POST["long"];
	$lat = $_POST["lat"];

	dbConnect();

	$updateLine= "UPDATE `general_data` SET `nzLong`='".$long."',`nzLat`='".$lat."'";
	$dbResult = mysql_query ($updateLine)
      or die(mysql_errno().":".mysql_error()." - Error. Product Listing failed .... use the browsers BACK button");
  }
?>
	<html><head>
		<link rel="stylesheet" href="../settingStyle.css" type="text/css" />	</head>
	</head><body>
	<br><br><br>
	<a href="../index.html">Back To solar Home</a>
	<br><br>
	<a href="../setting.html">Back To Settings</a>
	</body></html>