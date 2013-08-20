<?php
include "dbFunctions.php";
if (checkIdNPassword($_GET)){
	$json = false;
	if(array_key_exists("json",$_GET))
		$json = $_GET["json"];

	if ($_GET["name"] == "")
		$t = getLightsScenarionsList($json);
	else
		$t = getLightsScenarionData($_GET["name"]);

	$encoded = json_encode($t);
	header('Content-type: application/json');
	exit($encoded);
}

?>