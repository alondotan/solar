<?php
include "dbFunctions.php";
if (checkIdNPassword($_GET)){
// update the values of the sensor and divices in the house from the controller
	$componentsArray = explode("_",$_GET["val"]);
	// updateAllComponents($list);

	dbConnect();
	foreach ($componentsArray as $key => $value) {
		$sqlUpdate = "UPDATE  `solar`.`component` SET  `value` =  '".$value."' WHERE  `id` =".$key;

		$dbResult = mysql_query ($sqlUpdate)
			or die(mysql_errno().":".mysql_error()." - Error. Product Listing failed .... use the browsers BACK button");

	}

	mysql_free_result($dbResult);
	mysql_close();

}
?>