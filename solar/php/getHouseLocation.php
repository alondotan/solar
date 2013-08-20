<?php
include "dbFunctions.php";
if (checkIdNPassword($_GET)){

	dbConnect();
	$listQuery= "SELECT `nzLong`,`nzLat` FROM `general_data`"; 
	$dbResult = mysql_query ($listQuery)
      or die(mysql_errno().":".mysql_error()." - Error. Product Listing failed .... use the browsers BACK button");

	$row=mysql_fetch_assoc($dbResult);
$encoded = json_encode($row);
header('Content-type: application/json');
exit($encoded);

}
else
	echo "sssss";

?>