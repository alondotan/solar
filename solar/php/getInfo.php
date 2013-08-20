<?php
include "dbFunctions.php";
if (checkIdNPassword($_GET)){

	if (array_key_exists("allData",$_GET)&&$_GET["allData"] == "true"){
		$t = getAllComponents();
	}  
	else if (array_key_exists("history",$_GET)&&$_GET["history"] == "true"){
		$t = getHistoryData(false);
	}
	else
		$t = getAllComponentsValues();

	$encoded = json_encode($t);
	header('Content-type: application/json');
	exit($encoded);
}
?>