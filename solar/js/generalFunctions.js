var PHP_FOLDER = 'php/';
function doXmlhttpRequset(url,callback,useResponse){
	var xmlhttp;
	if (window.XMLHttpRequest)
	{// code for IE7+, Firefox, Chrome, Opera, Safari
	  xmlhttp=new XMLHttpRequest();
	}
	else
	{// code for IE6, IE5
	  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange=function()
	  {
	  if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			// if (url != "getInfo.php?allData=false&id=5196300&password=shenkar")
			// 	document.getElementById("log").innerHTML = xmlhttp.responseText+"<br>";
			if (callback != "")
				if (useResponse) 
					callback(xmlhttp.responseText);
				else
					callback();
		}
	  }
	xmlhttp.open("GET",PHP_FOLDER+url,true);
	xmlhttp.send();	
}

function importComponents(a){
	tempObjects = JSON.parse(a);
	for (index in tempObjects){
		var currentY = parseInt(tempObjects[index].y)
		// if (pageKind == 'l'){
		// 	currentY -= 450;
		// 	historyY -= 450;
		// }
		objArr[parseInt(tempObjects[index].id)] =  
			new component(parseInt(tempObjects[index].id),
						  tempObjects[index].name,
						  parseInt(tempObjects[index].kind),
						  tempObjects[index].desc,
						  parseInt(tempObjects[index].x),
						  currentY,
						  tempObjects[index].isMobile,
						  tempObjects[index].color);

		if (parseInt(tempObjects[index].kind) == HISTORY_KIND)
			historyObj = objArr[parseInt(tempObjects[index].id)];
			// alert(tempObjects[index].name + " " + tempObjects[index].x + ","+tempObjects[index].y);
	}
	historyObj = new component('h',
							  		'show history',
							  		HISTORY_KIND,
							  		"",
							  		BASE_GRAPH_X,
							  		BASE_GRAPH_Y,
							  		"0");
//	objArr['h'] = historyObj;
	// if (needToDraw("0")){
	 
	// }
	// objArr['a'] = new component('a',
	// 					  		'auto switch',
	// 					  		AUTO_SWITCH,
	// 					  		"",
	// 					  		500,
	// 					  		150);
	// objArr['a'].setValue(0);

//	doXmlhttpRequset('getLightsScenarions.php?name='+idsAndPassword,drawLightsScenarioList,true);

}

function importHistoy(a){
	tempObjects = JSON.parse(a);
	for (index in tempObjects){
		var id = parseInt(tempObjects[index].componentId);
		var kind = objArr[id].kind;
		if (historyData[kind].components[id] == null) {
			historyData[kind].components[id] = {name: objArr[parseInt(id)].name,
											 color:objArr[parseInt(id)].color,
											 data:[]};
		}
		historyData[kind].components[id].data.push({time:tempObjects[index].time,value:tempObjects[index].value});
	}
}

function changeAutoMode(){
	var modes = document.getElementsByName('autoMode');
	for (var i = 0;i < modes.length; i++) {
	    if (modes[i].checked) {
			doXmlhttpRequset('addOrder.php?compId=a'+'&value='+modes[i].value+idsAndPassword,"",false);
	    }
	}
}

function updateComponents(a){
	tempObjects = JSON.parse(a);
	for (index in tempObjects){
		objArr[tempObjects[index].id].setValue(tempObjects[index].value);
	}
	dataLoaded = true;
}

function updateUsersList(a){
	var b = a;
//	document.getElementById('userList').innerHTML = b;
}

function saveNewScenario(){
	var scenarioName = document.getElementById('ScenarioName').value;
	doXmlhttpRequset('saveCurrent.php?name='+scenarioName+idsAndPassword,"",false);

}

function boxInteraction(mouse,pos,size){
 	return (mouse.x > pos.x && mouse.x < pos.x + size &&
 	 		mouse.y > pos.y && mouse.y < pos.y + size)
}

function rectInteraction(mouse,pos,w,h){
 	return (mouse.x > pos.x && mouse.x < pos.x + w &&
 	 		mouse.y > pos.y && mouse.y < pos.y + h)
}

function circleInteraction(mouse,pos,size){
	return (dist(mouse,pos) < size );
}

function dist(a,b){
	var disX = a.x - b.x;
	var disY = a.y - b.y;
	return (Math.sqrt(Math.pow(disX,2) + Math.pow(disY,2)));
}

// toRad - convert from degrees to radian
function toRad(degrees)
{ 
	return (Math.PI / 180) * degrees;
}
function toDeg(rad)
{ 
	return rad/(Math.PI / 180);
}

function angleAndDist(pos,angle,dist){
  var result = {x:0,y:0};
  result.x = pos.x + (dist * Math.cos(angle));
  result.y = pos.y + (dist * Math.sin(angle));
  return result;
}
function GetAngleABC(p1,p2,p3)
{
  var dist1 = dist(p2,p3);
  var angle = Math.acos((p3.x - p2.x )/dist1);
  return angle;

  // var s1 = dist(p2,p3);
  // var s2 = dist(p1,p3);
  // var s3 = dist(p2,p1);
  // var angle = Math.acos((-s2*s2  + s3*s3 + s1*s1) / (2*s1*s3));

  // var tx = p3.x;
  // var ty = (tx-p1.x)*((p2.y-p1.y)/(p2.x-p1.x)) + p1.y;

  // if ((ty<p3.y && p2.x >= p1.x) || (ty>p3.y && p2.x < p1.x)) angle = toRad(360) - angle;

  // return angle;
}


var urlQueryString = function () {
  // This function is anonymous, is executed immediately and 
  // the return value is assigned to QueryString!
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    	// If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = pair[1];
    	// If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]], pair[1] ];
      query_string[pair[0]] = arr;
    	// If third or later entry with this name
    } else {
      query_string[pair[0]].push(pair[1]);
    }
  } 
    return query_string;
} ();

function getCookie(c_name)
{
	var c_value = document.cookie;
	var c_start = c_value.indexOf(" " + c_name + "=");
	if (c_start == -1){
	  c_start = c_value.indexOf(c_name + "=");
	}
	if (c_start == -1){
	  c_value = null;
	}
	else{
	  c_start = c_value.indexOf("=", c_start) + 1;
	  var c_end = c_value.indexOf(";", c_start);
	  if (c_end == -1){
		c_end = c_value.length;
	  }
	  c_value = unescape(c_value.substring(c_start,c_end));
	}
	return c_value;
}

function setCookie(c_name,value,exdays)
{
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
	document.cookie=c_name + "=" + c_value;
}


function showHistory(){
	// for (compIndex in historyData){
	// 	for (dataIndex in historyData[compIndex].data){
	// 		alert(historyData[compIndex].data[dataIndex].data);
	// 	}
	// }

	if (!isFullHistory)
		moveToFullHistoy = HISTORY_ANIMATION_TIME;
	else
		moveToFullHistoy = 0;
}

function getScenarios(){
	idsAndPassword = "&userId="+"5196300"+"&houseId="+"5196300"+"&housePassword="+"shenkar";
	doXmlhttpRequset('getLightsScenarions.php?name='+idsAndPassword,setScenariosMenu,true);
}
function setScenariosMenu(a){
	var options = JSON.parse(a);

	var select = document.getElementById("scenarioSelector"); 
//var options = ["1", "2", "3", "4", "5"]; 

	for(var i = 0; i < options.length; i++) {
	    var opt = options[i];
	    var el = document.createElement("option");
	    el.textContent = opt;
	    el.value = opt;
	    select.appendChild(el);
	}
}

function setDeletedUsersMenu(a){
	var options = JSON.parse(a);

	var select = document.getElementById("deletedUserId"); 

	for(var i = 0; i < options.length; i++) {
	    var opt = options[i].name;
	    var el = document.createElement("option");
	    el.textContent = opt;
	    el.value = options[i].id;
	    select.appendChild(el);
	}
}
function setDeletedSenariosMenu(a){
	var options = JSON.parse(a);

	var select = document.getElementById("deletedSenarioId"); 

	for(var i = 0; i < options.length; i++) {
	    var opt = options[i].name;
	    var el = document.createElement("option");
	    el.textContent = opt;
	    el.value = options[i].id;
	    select.appendChild(el);
	}
}


function needToDraw(isMobile){
   return (pageKind == 'i' || 
   pageKind == 'p' ||
   (pageKind == 'l' && isMobile == "1" ));
}

function doSenario(){
	var select = document.getElementById("senarioSelector");
	var value = select.options[select.selectedIndex].value;
	// alert(value); 

	doXmlhttpRequset('addOrder.php?scenarionName='+value+idsAndPassword,"",false);
}