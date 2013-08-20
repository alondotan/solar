<?php
include "dbFunctions.php";
if (checkIdNPassword($_GET)){

	$LOCATION_ALERT_TIMEOUT = 30*60;
	$id = $_GET["userId"];

	$userTemp = getUserTemp($id,$id);

	date_default_timezone_set("Israel"); 
	$phpTime = time();
	$mysqlTime = date( 'Y-m-d H:i:s', $phpTime );


	dbConnect();

	$listQuery= "select now() - u.lastLocationAlert as diff, now(),u.lastLocationAlert,s.name as scenario from users u,lights_scenarions s where u.id = ".$id." and s.id = u.airConditionScenario";
	$dbResult = mysql_query ($listQuery)
      or die(mysql_errno().":".mysql_error()." - Error. Product Listing failed .... use the browsers BACK button");

	$row=mysql_fetch_assoc($dbResult);


	$listQuery= "select count(*) as count from users where inHome = 1 and id != ".$id;
	$dbResult = mysql_query ($listQuery)
      or die(mysql_errno().":".mysql_error()." - Error. Product Listing failed .... use the browsers BACK button");

	$rowCount=mysql_fetch_assoc($dbResult);


	$res["needAlert"] = "false";
	if ($row["diff"]>$LOCATION_ALERT_TIMEOUT && $rowCount["count"] == 0){
		$res["needAlert"] = "true";
		$res["scenario"] = $row["scenario"];
		$res["userTemp"] = $userTemp;
		setLastAlertTime($id,"lastLocationAlert");
	}

	$encoded = json_encode($res);
	header('Content-type: application/json');
	exit($encoded);

}
else
	echo "sssss";

?>