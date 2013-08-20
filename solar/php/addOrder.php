<?php
include "dbFunctions.php";
$AUTO_MODE_AIR_CONDITION = "2";
$AUTO_MODE_FULL = "3";

// var_dump($_GET);
// echo($_GET["scenarionName"]);
//echo($_GET["userId"]);
if (checkIdNPassword($_GET)){
	if (!array_key_exists("scenarionName",$_GET)&&!array_key_exists("returningTemp",$_GET)){
		$order = $_GET["compId"].$_GET["value"];
		$userStr = getUsersData("id","true");			
		if (isToTemp($_GET["compId"])){
			saveTempHistory($userStr,$_GET["value"]);
		}
		if (isChangeMode($_GET["compId"])){
			if ($_GET["value"] == $AUTO_MODE_AIR_CONDITION || $_GET["value"] == $AUTO_MODE_FULL)
			$order = $order."#t".getUserTemp($userStr,$_GET["userId"]);
		}
	}
	else if (array_key_exists("returningTemp",$_GET)){
		$order = "t".$_GET["returningTemp"]."#a0";
	}
	else{		
		// echo("...............".$_GET["scenarionName"]);
		$data = getLightsScenarionData($_GET["scenarionName"]);
		$order = "";
		foreach ($data["components"] as $key => $value) {
			if ($order != "") $order = $order."#";
			$order = $order.$value["componentId"].$value["newValue"];
		}
	}
	// echo $order;
	addOrder($order);
}

?>