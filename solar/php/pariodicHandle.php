<?php
$HISTORY_DELTA = 1;
$PROD_HISTORY_DELTA = 30;
include "dbFunctions.php";
include "/gcm_server_php/send_message.php";
if (checkIdNPassword($_GET)){

	$lastTime = getLastUpdateTime();
	date_default_timezone_set("Israel"); 
	$currTime = time();

	echo "$currTime: ".date("i",$currTime)." - $lastTime: ".date("i",$lastTime). " >= $HISTORY_DELTA: ".$HISTORY_DELTA; //diffrent minute
	if (date("i",$currTime) - date("i",$lastTime) >= $HISTORY_DELTA) //diffrent minute
	{
//		echo "in here";
		saveHistory($currTime);
	}

	if (date("i",$currTime) - date("i",$lastTime) >= $PROD_HISTORY_DELTA) //30 minute
	{
		saveProdHistory($currTime);
	}

	// handle timers
	$timmerData = getTimerScenarios();
	if ($timmerData != ""){
		$order = "";
		foreach ($timmerData["compsArray"] as $key => $value) {
			if ($order != "") $order = $order."#";
			$order = $order.$value["componentId"].$value["newValue"];
		}
		addOrder($order);
		foreach ($timmerData["scenariosArray"] as $value) {
			if ($value["isMessage"] == 1){
				$message = "The scenario ".$value["name"]." was activated";
				sendMessage($value["regId"],$message);
			}
		}
	}

	// handle alerts
	$alertData = getAlertData() ;
	$alertedUsers = getAlertedUsers($alertData);

	foreach ($alertedUsers["diffAlert"] as $user) {
		$message = "There Power Consumption is Higher then ".$user["diffAlert"]." KW from the Production";
		sendMessage($user["regId"],$message);
		setLastAlertTime($user["id"],"lastDiffAlert");
	}

	foreach ($alertedUsers["totalAlert"] as $user) {
		$message = "There Power Consumption is Higher then ".$user["maxAlert"]." KW";
		sendMessage($user["regId"],$message);		
		setLastAlertTime($user["id"],"lastMaxAlert");
	}

	setLastUpdateTime();

	///
}
else
	echo "sssss";

//$encoded = json_encode($t);
//header('Content-type: application/json');
//exit($encoded);
?>