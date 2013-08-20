<?php
include "dbFunctions.php";
if (checkIdNPassword($_GET)){

	dbConnect();
	mysql_query('LOCK TABLES orders');
	$listQuery= "select * from orders"; 
	$dbResult = mysql_query ($listQuery)
      or die(mysql_errno().":".mysql_error()." - Error. Product Listing failed .... use the browsers BACK button");

	$res = "";//array();
	$deleteString = array();
	while ($row=mysql_fetch_assoc($dbResult)){
		if ($res != "") {
			$res = $res."#";
		}
		$res = $res.$row["order"];
		array_push($deleteString ,$row["order"]);
	}

	mysql_free_result($dbResult);

	foreach ($deleteString as $key => $value) {
		$deleteQuery= "delete from `orders` where `order` = '".$value."'"; 
		$dbResult = mysql_query ($deleteQuery)
	      or die(mysql_errno().":".mysql_error()." - Error. Product Listing failed .... use the browsers BACK button");
	}
	mysql_query('UNLOCK TABLES');

	mysql_close();
	//return $res;
	echo $res;
	// $t = getOrders();
	// echo $t;
}
else
	echo "sssss";

//$encoded = json_encode($t);
//header('Content-type: application/json');
//exit($encoded);
?>