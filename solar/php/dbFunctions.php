<?php
	$mysite ="localhost";
	$myuser ="root";
	$mypasswd = "";
	$dbname = "solar";
	$TIME_SLOT_SIZE = 4;

function checkIdNPassword($get){
	return true;
	// first check that id and password were pass
	if (array_key_exists("userId",$get) && array_key_exists("houseId",$get) && array_key_exists("housePassword",$get))
		// the check if they are corret TODO elad
		return ($get["userId"] == 5196300 && $get["houseId"] == 5196300 && $get["housePassword"] == "shenkar");
	else
		return false;
}

function dbConnect(){
	global $mysite, $myuser, $mypasswd, $dbname;
	mysql_connect($mysite, $myuser, $mypasswd)
      or die(mysql_errno().":".mysql_error()." - Error connecting to the mySQL .... use the browsers BACK button");
	mysql_select_db($dbname)
       or die(mysql_errno().":".mysql_error()." - Error opening the database .... use the browsers BACK button");
}

function getAllComponents(){
	dbConnect();

	$listQuery= "select * from component"; 
	$dbResult = mysql_query ($listQuery)
      or die(mysql_errno().":".mysql_error()." - Error. Product Listing failed .... use the browsers BACK button");


	$componentsArray = array();
	while ($row=mysql_fetch_assoc($dbResult)){
		array_push($componentsArray,$row);
	}
	
	mysql_free_result($dbResult);
	mysql_close();

	return $componentsArray;
}


function getAllComponentsValues(){
	dbConnect();

	$listQuery= "select id,value,kind,isMobile from component"; 
	$dbResult = mysql_query ($listQuery)
      or die(mysql_errno().":".mysql_error()." - Error. Product Listing failed .... use the browsers BACK button");


	$componentsArray = array();
	while ($row=mysql_fetch_assoc($dbResult)){
		array_push($componentsArray,$row);
	}
	
	mysql_free_result($dbResult);
	mysql_close();

	return $componentsArray;
}

function getHistoryData($header){
	dbConnect();

	$listQuery= "select h.componentId,h.value,h.time,c.name from history_data h,component c where h.componentId = c.id and h.time < now() order by h.time"; 
	$dbResult = mysql_query ($listQuery)
      or die(mysql_errno().":".mysql_error()." - Error. Product Listing failed .... use the browsers BACK button");


	$componentsArray = array();
	if ($header){
		$headerData = array();
		$headerData["componentId"] = "Component Id";
		$headerData["value"] = "value";
		$headerData["time"] = "time";
		$headerData["name"] = "Component Name";
		array_push($componentsArray,$headerData);
	}
	while ($row=mysql_fetch_assoc($dbResult)){
		array_push($componentsArray,$row);
	}
	
	mysql_free_result($dbResult);
	mysql_close();

	return $componentsArray;	
}

function getLastUpdateTime(){
	dbConnect();

	date_default_timezone_set("Israel"); ///// mybe prolem

	$selectLine= "select  `lastUpdateTime` from `solar`.`general_data`";
	$dbResult = mysql_query ($selectLine)
      or die(mysql_errno().":".mysql_error()." - Error. Product Listing failed .... use the browsers BACK button");

	$row=mysql_fetch_assoc($dbResult);

	return strtotime($row["lastUpdateTime"]);
}

function getTimerScenarios(){
	dbConnect();

	mysql_query('LOCK timmer_scenarios orders');

	$lapTime = "01:00";

	$selectLine = "SELECT  t.`scenarioId` as scenarioId,t.`isMessage`as isMessage,t.`userId` as userId,u.`regId` as regId,s.`name` as name FROM  `timmer_scenarios` t,`lights_scenarions` s,`users` u WHERE s.id = t.scenarioId and u.id = t.userId and TIME < NOW( ) AND SUBTIME( NOW( ) ,  '".$lapTime."' ) < TIME";
	$dbResult = mysql_query ($selectLine)
      or die(mysql_errno().":".mysql_error()." - Error. Product Listing failed .... use the browsers BACK button");

	$scenariosArray = array();
	$fullScenariosArray = array();
	while ($row=mysql_fetch_assoc($dbResult)){
		array_push($scenariosArray,$row["scenarioId"]);
		array_push($fullScenariosArray,$row);
	}
	$scenarioListStr = implode(",", $scenariosArray);
	$res = "";
	
	if ($scenarioListStr != ""){
		$selectLine = "SELECT  `newValue` ,  `componentId` FROM  `lights_scenarions_components` WHERE  `scenarioId` IN (".$scenarioListStr.")";

		$dbResult = mysql_query ($selectLine)
	      or die(mysql_errno().":".mysql_error()." - Error. Product Listing failed .... use the browsers BACK button");

		$compsArray = array();
		while ($row=mysql_fetch_assoc($dbResult)){
			array_push($compsArray,$row);
		}
		$res = array();	
		$res["compsArray"] = $compsArray;
		$res["scenariosArray"] = $fullScenariosArray;
		$deleteQuery= "delete FROM  `timmer_scenarios` WHERE  `scenarioId` IN (".$scenarioListStr.")";
		$dbResult = mysql_query ($deleteQuery)
	      or die(mysql_errno().":".mysql_error()." - Error. Product Listing failed .... use the browsers BACK button");
	}
	mysql_query('UNLOCK TABLES');
	mysql_close();

	return $res;	
}

function setLastUpdateTime(){

	date_default_timezone_set("Israel"); 
	$phpTime = time();
	$mysqlTime = date( 'Y-m-d H:i:s', $phpTime );

	dbConnect();

	$updateLine= "UPDATE  `solar`.`general_data` SET  `lastUpdateTime` =  '".$mysqlTime."'";
	$dbResult = mysql_query ($updateLine)
      or die(mysql_errno().":".mysql_error()." - Error. Product Listing failed .... use the browsers BACK button");
}

function addOrder($order){
	dbConnect();

	$sqlAdd = "INSERT INTO `solar`.`orders` (`order`) VALUES ('".$order."')";


	$dbResult = mysql_query ($sqlAdd)
		or die(mysql_errno().":".mysql_error()." - Error. Product Listing failed .... use the browsers BACK button");
	
	mysql_close();
}

function saveHistory($time){
	dbConnect();

    $insertQuery =    "insert into `solar`.`history_data` (`componentId` ,`value` ,`time`) select `id`,`value`,'".date( 'Y-m-d H:i:s', $time )."' from `component` where `isHistory` = 1";
   echo $insertQuery;
	mysql_query ($insertQuery)
      or die(mysql_errno().":".mysql_error()." - Error. Product Listing failed .... use the browsers BACK button");    
}

function saveProdHistory($time){
	dbConnect();

    $insertQuery =    "insert into `solar`.`history_data` (`componentId` ,`value` ,`time`) select `id`,`value`,'".date( 'Y-m-d H:i:s', $time )."' from `component` where `id` = 15";
//    echo $insertQuery;
	mysql_query ($insertQuery)
      or die(mysql_errno().":".mysql_error()." - Error. Product Listing failed .... use the browsers BACK button");    
}

function getLightsScenarionsList($json){
	dbConnect();
	$res = array();

	$listQuery= "select * from lights_scenarions"; 
	$dbResult = mysql_query ($listQuery)
      or die(mysql_errno().":".mysql_error()." - Error. Product Listing failed .... use the browsers BACK button");

	while ($row=mysql_fetch_assoc($dbResult)){
		if ($json)
			array_push($res ,$row);
		else
			array_push($res ,$row["name"]);
	}

	mysql_free_result($dbResult);

	return $res;
}

function getLightsScenarionData($name){
	dbConnect();

	$res = array();

	$listQuery= "select ls.name,ls.description,lsc.scenarioId,lsc.componentId,lsc.newValue ".
				"from lights_scenarions_components lsc, lights_scenarions ls ".
				"where lsc.scenarioId = ls.id and ls.name = '".$name."'";
	$dbResult = mysql_query ($listQuery)
      or die(mysql_errno().":".mysql_error()." - Error. Product Listing failed .... use the browsers BACK button");

 	$first = true;
	while ($row=mysql_fetch_assoc($dbResult)){
		if ($first){
			$first = false;
			$res["name"] = $row["name"];
			$res["description"] = $row["description"];
			$res["components"] = array();
		}
		// $res["components"]["componentId"] = $row["componentId"];
		// $res["components"]["newValue"] = $row["newValue"];
		$value["componentId"] = $row["componentId"];
		$value["newValue"] = $row["newValue"];

		array_push($res["components"],$value);
	}

	mysql_free_result($dbResult);

	return $res;
}


function getUserTemp($usersList,$id){	
	dbConnect();
	global $TIME_SLOT_SIZE;

	date_default_timezone_set("Israel"); 
	$timeSlot = floor(date( 'H', time() )/$TIME_SLOT_SIZE);

	$res = array();

	$listQuery= "select distinct temp, count(temp) as CountOf from user_temp_history where usersList = '".$usersList."' and timeSlot = '".$timeSlot."' group by temp order by CountOf DESC";
	$dbResult = mysql_query ($listQuery)
      or die(mysql_errno().":".mysql_error()." - Error. Product Listing failed .... use the browsers BACK button");

	$row=mysql_fetch_assoc($dbResult);
	$value = $row["temp"];
	if ($value == ""){
		$listQuery= "select distinct temp, count(temp) as CountOf from user_temp_history where usersList = '".$usersList."' group by temp order by CountOf DESC";
		$dbResult = mysql_query ($listQuery)
	      or die(mysql_errno().":".mysql_error()." - Error. Product Listing failed .... use the browsers BACK button");

		$row=mysql_fetch_assoc($dbResult);
		$value = $row["temp"];
		if ($value == ""){
			$listQuery= "select distinct temp, count(temp) as CountOf from user_temp_history where usersList = '".$id."' and timeSlot = '".$timeSlot."' group by temp order by CountOf DESC";
			$dbResult = mysql_query ($listQuery)
		      or die(mysql_errno().":".mysql_error()." - Error. Product Listing failed .... use the browsers BACK button");

			$row=mysql_fetch_assoc($dbResult);
			$value = $row["temp"];
			if ($value == ""){
				$listQuery= "select distinct temp, count(temp) as CountOf from user_temp_history where usersList = '".$id."' group by temp order by CountOf DESC";
				$dbResult = mysql_query ($listQuery)
			      or die(mysql_errno().":".mysql_error()." - Error. Product Listing failed .... use the browsers BACK button");

				$row=mysql_fetch_assoc($dbResult);
				$value = $row["temp"];
				if ($value == "")
					$value = 24;
			}
		}
	}

	return $value;
	
}


function isToTemp($compId){
	return ($compId == "t");
}

function isChangeMode($compId){
	return ($compId == "a");
}

function saveTempHistory($userId,$value){

	global $TIME_SLOT_SIZE;
	dbConnect();

	date_default_timezone_set("Israel"); 
	$timeSlot = floor(date( 'H', time() )/$TIME_SLOT_SIZE);

    $insertQuery = "insert into `solar`.`user_temp_history` (`usersList` ,`temp`,`time`,`timeSlot`) VALUES ('".$userId."','".$value."',now(),'".$timeSlot."')";
	mysql_query ($insertQuery)
      or die(mysql_errno().":".mysql_error()." - Error. Product Listing failed .... use the browsers BACK button");    

 // 	$selectCount = "SELECT COUNT(*) as count FROM `solar`.`user_temp_history` where `userId` = '".$userId."'";

 // 	$dbResult = mysql_query ($selectCount)
 //      or die(mysql_errno().":".mysql_error()." - Error. Product Listing failed .... use the browsers BACK button");

	// $row=mysql_fetch_assoc($dbResult);
	// if (intval ($row["count"])>10)
	// {

	// }
}

function addScenarionOrders($scenarionName){

}		

function getUsersData($kind,$inHome){
	dbConnect();
	$res = array();

	$listQuery= "select id,name from users";
	if ($inHome == "true"){
		$listQuery= $listQuery." where inHome = '1'";
	}
	$dbResult = mysql_query ($listQuery)
      or die(mysql_errno().":".mysql_error()." - Error. Product Listing failed .... use the browsers BACK button");

	while ($row=mysql_fetch_assoc($dbResult)){
		array_push($res,$row);
	}	

	if($kind = "json"){
		return $res;
	}
	else{
		$first = true;
		$str = "";
		foreach ($res as $value) {
			if (!$first) $str = $str.",";
			$first = false;
			if($kind == "name")
				$str =  $str.$value["name"];
			else
				$str =  $str.$value["id"];
		}
		return $str;
	}
}

function getAlertData(){
	dbConnect();

	$listQuery= "select id,value from component where kind = 9"; 
	$dbResult = mysql_query ($listQuery)
      or die(mysql_errno().":".mysql_error()." - Error. Product Listing failed .... use the browsers BACK button");


	$res = array();
    $res["totalWatt"] = 0;
    $prod = 0;
	while ($row=mysql_fetch_assoc($dbResult)){
		// array_push($componentsArray,$row);
		if ($row["id"] == 16)
			$prod = $row["value"];
		else
			$res["totalWatt"] += $row["value"];
	}
	
	$res["diff"] = $res["totalWatt"] - $prod;
	mysql_free_result($dbResult);
	mysql_close();


	return $res;
}

function getAlertedUsers($data){
	$ALERT_TIMEOUT = 30 * 60;
	dbConnect();
	$res = array();
	$res["diffAlert"] = array();
	$res["totalAlert"] = array();

	$listQuery= "select id,name,regId,diffAlert from users where regId != '' and diffAlert != -1 and diffAlert < ".$data["diff"]." and  lastDiffAlert < NOW( ) - ".$ALERT_TIMEOUT;
	$dbResult = mysql_query ($listQuery)
      or die(mysql_errno().":".mysql_error()." - Error. Product Listing failed .... use the browsers BACK button");

	while ($row=mysql_fetch_assoc($dbResult)){
		array_push($res["diffAlert"],$row);
	}	

	$listQuery= "select id,name,regId,maxAlert from users where regId != '' and maxAlert != -1 and maxAlert < ".$data["totalWatt"]." and  lastMaxAlert < NOW( ) - ".$ALERT_TIMEOUT;
	$dbResult = mysql_query ($listQuery)
      or die(mysql_errno().":".mysql_error()." - Error. Product Listing failed .... use the browsers BACK button");

	while ($row=mysql_fetch_assoc($dbResult)){
		array_push($res["totalAlert"],$row);
	}	

	return $res;
}

function setLastAlertTime($userId,$kind){

	date_default_timezone_set("Israel"); 
	$phpTime = time();
	$mysqlTime = date( 'Y-m-d H:i:s', $phpTime );

	dbConnect();

	$updateLine= "UPDATE  `solar`.`users` SET  `".$kind."` =  '".$mysqlTime."' where id = ".$userId;
	$dbResult = mysql_query ($updateLine)
      or die(mysql_errno().":".mysql_error()." - Error. Product Listing failed .... use the browsers BACK button");
}
?>