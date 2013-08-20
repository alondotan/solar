<?php
include "dbFunctions.php";
if (checkIdNPassword($_GET)){

	$kind = $_GET["kind"];
	$inHome = $_GET["inHome"];
	$str = getUsersData($kind,$inHome);
	if ($kind != "json")
		echo $str;
	else{
		$encoded = json_encode($str);
		header('Content-type: application/json');
		exit($encoded);		
	}
}
else
	echo "sssss";


?>