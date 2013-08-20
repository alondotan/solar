var canEl = null;
var ctx = null;
var pageKind = '';
var isPHP = true;


var objArr = [];
var CANVAS_WIDTH = 0;
var CANVAS_HEIGHT = 0;

var TEMP_SENSOR_KIND = 0;
var OUTLET_KIND = 1;
var LIGHT_DIMMER_KIND = 2;
var LIGHT_SWITCH_KIND = 3;
var AC_KIND = 4;
var HUMIDTY_SENSOR_KIND = 5;
var PRESENCE_SENSOR_KIND = 6;
var SLIDER_KIND = 8;
var AUTO_SWITCH = 7;
var HISTORY_KIND = 111;
var WATT_KIND = 9;
var AC_SWITCH_KIND = 10;

var MODE_M = 0;
var MODE_A_LIGHT = 1;
var MODE_A_AC = 2;
var MODE_A = 3;

var ICON_SIZE = 0;
var CIRCLE_SIZE = 0;
var AC_CIRCLE_SIZE = 0;
var DIMMER_CIRCLE_SIZE =0;
var BACK_FRAME_W = 0.1;
var BACK_FRAME_H = 0.15;

var AC_MAX = 40;
var AC_MIN = 15;
var WATT_MAX = 300;
var WATT_MIN = 0;
var timerID;
var inter = 0;

var dataLoaded = false;
//var scenarionsPicker;
var scenarionsPickerPos = {x:400,y:300};
var lightScenarionsList = [];
var background = new Image();
var dimmerUpdateId = -1;
var idsAndPassword = "";
var lightOnImg = new Image();
var lightOffImg = new Image();
var isPresenceImg = new Image();
var acSliderImg = new Image();
var acSwitchOnImg = new Image();
var acSwitchOffImg = new Image();
var autoModeSwitchImgs = [];
var globalAlpha = 1;
autoModeSwitchImgs[MODE_M] = new Image();
autoModeSwitchImgs[MODE_A_LIGHT] = new Image();
autoModeSwitchImgs[MODE_A_AC] = new Image();
autoModeSwitchImgs[MODE_A] = new Image();
var fanSwitchImgs = [];
fanSwitchImgs[0] = new Image();
fanSwitchImgs[1] = new Image();
//fanSwitchImgs[2] = new Image();

var isFullHistory = false;
var moveToFullHistoy = 0;
var HISTORY_ANIMATION_TIME = 20;
var historyObj = "";

var BASE_GRAPH_H = 170;
var BASE_GRAPH_W = 450;
var MAX_GRAPH_H = 450;
var MAX_GRAPH_W = 800;

var BASE_GRAPH_Y = 780;
var BASE_GRAPH_X = 400;
var MIN_GRAPH_Y = 20;
var MIN_GRAPH_X = 70;
// var BASE_GRAPH_H = 180;
// var BASE_GRAPH_W = 250;
// var MAX_GRAPH_H = 450;
// var MAX_GRAPH_W = 800;

// var BASE_GRAPH_Y = 570;
// var BASE_GRAPH_X = 600;
// var MIN_GRAPH_Y = 20;
// var MIN_GRAPH_X = 60;
var BASE_BUTTON_X = 420;
var BASE_BUTTON_Y = 860;
// var BASE_BUTTON_X = 120;
// var BASE_BUTTON_Y = 400;
var BUTTON_W = 60;
var BUTTON_H = 50;
var BUTTON_GAP = 90;
var BACK_X = 900;
var BACK_Y = 600;
var graphSize = [{name:"10 M",tiks:5,gap:60*1000*2, // every 5 minutes
				  round: function(){	
						 //  	var currentTime = new Date();
						 //  	currentTime.setSeconds(0);
							// return currentTime;
						  	var currentTime = new Date();
							var minutes = currentTime.getMinutes();
							minutes = minutes - (minutes%2);
							currentTime.setMinutes(minutes);
							return currentTime;
						}},
				 {name:"1 H",tiks:12,gap:5*60*1000, // every 5 minutes
				  round: function(){	
						  	var currentTime = new Date();
							var minutes = currentTime.getMinutes();
							minutes = minutes - (minutes%5);
							currentTime.setMinutes(minutes);
							return currentTime;
						}},
				 {name:"1 D",tiks:24,gap:60*60*1000, // every hour
				  round: function(){	
						  	var currentTime = new Date();
							var minutes = currentTime.getMinutes();
							var diff = 60 - minutes;
							currentTime.setTime(currentTime.getTime()+(diff*60*1000));
							return currentTime;
						}},
				 {name:"1 W",tiks:7*4,gap:6*60*60*1000,//4 times a day = every 6 hours
				  round: function(){	
						  	var currentTime = new Date();
							var hours = currentTime.getHours();
							hours = hours - (hours%6);

							currentTime.setMinutes(0);
							currentTime.setHours(hours);
							return currentTime;
						}}];
var graphCurrentTime = 0;

var graphH = BASE_GRAPH_H;
var graphW = BASE_GRAPH_W;

var historyData = [];

var historyRefreshCounter = 0;
var HISTORY_REFRESH_TIME = 1000;

// Setup event handlers
window.onload = function() {
	canEl = document.getElementById("canvas");
	var index = document.URL.lastIndexOf("/") + 1;
	pageKind = document.URL.substr(index).substr(0,1);
	if(canEl && canEl.getContext) {
		var contextObj = canEl.getContext("2d");
		if (contextObj) {
			ctx = contextObj;

			ctx.lineWidth = 2;
			ctx.strokeStyle = "rgb(0, 0, 0)";
			ctx.beginPath();

			canEl.onmousedown = ev_mousedown;
			canEl.onmouseup = ev_mouseup;
			canEl.onmousemove = ev_mousemove;
			canEl.ontouchstart = ev_mousedown;
			canEl.ontouchend = ev_mouseup;

			canEl.ontouchcencel = ev_mouseup;
			canEl.ontouchmove = ev_mousemove;
//			idsAndPassword = "&userId="+urlQueryString.userId+"&houseId="+urlQueryString.houseId+"&housePassword="+urlQueryString.housePassword;
			idsAndPassword = "&userId="+"5196300"+"&houseId="+"5196300"+"&housePassword="+"shenkar";
			CANVAS_WIDTH = ctx.canvas.width;
			CANVAS_HEIGHT = ctx.canvas.height;
			ICON_SIZE = CANVAS_WIDTH * 0.025;
			CIRCLE_SIZE = CANVAS_WIDTH * 0.05;
			AC_CIRCLE_SIZE = CANVAS_WIDTH * 0.03;
			DIMMER_CIRCLE_SIZE = CANVAS_WIDTH * 0.025;
			if (isPHP)
			{
				doXmlhttpRequset('getInfo.php?allData=true'+idsAndPassword,importComponents,true);				
				timerID = setInterval( "moveBox()", 20 );
				doXmlhttpRequset('getInfo.php?history=true'+idsAndPassword,importHistoy,true);				
			}
			background.src = "images/backgroundBase.png";
			lightOnImg.src = "images/lightOn.png";
			lightOffImg.src = "images/lightOff.png";
			isPresenceImg.src = "images/person.png";
			acSliderImg.src = "images/acSlider.png";
			acSwitchOnImg.src = "images/acOn.png";
			acSwitchOffImg.src = "images/acOff.png";
			autoModeSwitchImgs[MODE_M].src = "images/modeM.png";
			autoModeSwitchImgs[MODE_A_LIGHT].src = "images/modeALight.png";
			autoModeSwitchImgs[MODE_A_AC].src = "images/modeAAC.png";
			autoModeSwitchImgs[MODE_A].src = "images/modeA.png";
			fanSwitchImgs[0].src = "images/nfan1.png";
			fanSwitchImgs[1].src = "images/nfan2.png";
//			fanSwitchImgs[2].src = "images/fan2.png";

			// Make sure the image is loaded first otherwise nothing will draw.
			background.onload = function(){
			   ctx.drawImage(background,0,0);   
			}
			drawCanvas();

		}
	}
}


function moveBox(){
	doXmlhttpRequset('getInfo.php?allData=false'+idsAndPassword,updateComponents,true);
	doXmlhttpRequset('getUsersData.php?kind=name&inHome=true'+idsAndPassword,updateUsersList,true);
	// historyRefreshCounter++;
	// if (historyRefreshCounter >= HISTORY_REFRESH_TIME){
	// 	doXmlhttpRequset('getInfo.php?history=true'+idsAndPassword,importHistoy,true);
	// 	historyRefreshCounter = 0;
	// }

	if (dataLoaded){
		for (kindIndex in historyData){
			for (compIndex in historyData[kindIndex].components){
				var dataSize = historyData[kindIndex].components[compIndex].data.length;
				var lastObj = historyData[kindIndex].components[compIndex].data[dataSize-1];
				var d = new Date();
				var lastDate = new Date(lastObj.time);
				if (objArr[compIndex].value != lastObj.value || d-lastDate>20000)
					historyData[kindIndex].components[compIndex].data.push({time:d,value:objArr[compIndex].value});
			}
		}
	}

	drawCanvas();
}

// // init - reset the paint memory and clear the canvas
// function init(){
// 	objArr;
// 	lightScenarionsList = [];
// 	clearCanvas();
// }

// clearCanvas - draw clean canvas
function clearCanvas()
{
	// //background
	ctx.fillStyle="#132D12";
	ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
	// ctx.fillStyle="white";
	// ctx.fillRect(20,0,background.width-20,background.height);
	if (!isFullHistory){
		ctx.save();
		ctx.globalAlpha = globalAlpha;
	   	ctx.drawImage(background,0,0);   	
		ctx.restore();		
	}
}

// drawCanvas - draw all the objects from the paint memory to the canvas
function drawCanvas(){
	clearCanvas();
	// loop over the objects of the paint
	if (dataLoaded){
		if (!isFullHistory){
			ctx.save();
			ctx.globalAlpha = globalAlpha;
			for (index in objArr)
			{
				objArr[index].draw();
			}
			ctx.restore();

			historyObj.draw();
			if (moveToFullHistoy != 0){
			 	moveToFullHistoy--;
			 	var currInterval = (HISTORY_ANIMATION_TIME-moveToFullHistoy)/HISTORY_ANIMATION_TIME;
				graphW = BASE_GRAPH_W + ((MAX_GRAPH_W - BASE_GRAPH_W) * currInterval);
				graphH = BASE_GRAPH_H + ((MAX_GRAPH_H - BASE_GRAPH_H) * currInterval);
				historyObj.pos.x = MIN_GRAPH_X + ((BASE_GRAPH_X-MIN_GRAPH_X) * (moveToFullHistoy/HISTORY_ANIMATION_TIME));
				historyObj.pos.y = MIN_GRAPH_Y + ((BASE_GRAPH_Y-MIN_GRAPH_Y) * (moveToFullHistoy/HISTORY_ANIMATION_TIME));
				globalAlpha = 1-currInterval;
				if (moveToFullHistoy == 0){
					isFullHistory = true;
					moveToFullHistoy =-1;
				}
			}
		}
		else{
			historyObj.draw();
			for (index in objArr)
			{
				if (objArr[index].kind == WATT_KIND) 
					objArr[index].draw();
			}
			if (moveToFullHistoy != -1){
				moveToFullHistoy++;
			 	var currInterval = (HISTORY_ANIMATION_TIME-moveToFullHistoy)/HISTORY_ANIMATION_TIME;
				globalAlpha = 1;
				graphW = BASE_GRAPH_W + ((MAX_GRAPH_W - BASE_GRAPH_W) * currInterval);
				graphH = BASE_GRAPH_H + ((MAX_GRAPH_H - BASE_GRAPH_H) * currInterval);
				historyObj.pos.x = MIN_GRAPH_X + ((BASE_GRAPH_X-MIN_GRAPH_X) * (moveToFullHistoy/HISTORY_ANIMATION_TIME));
				historyObj.pos.y = MIN_GRAPH_Y + ((BASE_GRAPH_Y-MIN_GRAPH_Y) * (moveToFullHistoy/HISTORY_ANIMATION_TIME));
				if (moveToFullHistoy == HISTORY_ANIMATION_TIME){
					isFullHistory = false;
					moveToFullHistoy = 0;
				}
			}
		}
	}
}

//--------------------------------------------------------------------------------
//    handle Mouse event
//--------------------------------------------------------------------------------

function ev_mousedown(e) {
	var mp = "";
	if (e.touches) {
		// Touch event
		if (e.touches.length>0){
			mp = getCoords(e.touches[0]);//i - 1]);
		}
	}
	else {
		// Mouse event
		mp = getCoords(e);
	//	canEl.onmousemove = ev_mousemove;
	}
	if (mp != ""){
		if (!isFullHistory){
			for (index in objArr)
			{
		 	 	objArr[index].onClick(mp);
			}
		}
		historyObj.onClick(mp);
		drawCanvas();
	}
	
	return false;
}

// Called whenever cursor position changes after drawing has started
function ev_mouseup(e) {
	//e.preventDefault();
	//canEl.onmousemove = null;
	if (dimmerUpdateId != -1)
		objArr[dimmerUpdateId].onMouseUp();
	dimmerUpdateId = -1;
}

function ev_mousemove(e) {
	var mp = "";
	if (e.touches) {
		// Touch Enabled
		if (e.touches.length>0){
			mp = getCoords(e.touches[0]);//i - 1]); // Get info for finger i
		}
	}
	else {
		// Not touch enabled
		mp = getCoords(e);
	}
	if (mp != ""){
		var isInteract = false;
		for (index in objArr)
		 {
	 	 	if (objArr[index].checkInteraction(mp))
	 	 		isInteract = true;
		 }
 	 	if (historyObj.checkInteraction(mp))
 	 		isInteract = true;

	 	if (isInteract)
			document.body.style.cursor = 'pointer';
		else
			document.body.style.cursor = 'auto';

		if (dimmerUpdateId != -1){
			objArr[dimmerUpdateId].onMouseMove(mp);
			drawCanvas();
		}
	}
	return false;
}

// Get the coordinates for a mouse or touch event
function getCoords(e) {
	if (e.offsetX) {
		return { x: e.offsetX, y: e.offsetY };
	}
	else if (e.layerX) {
		return { x: e.layerX, y: e.layerY };
	}
	else {
		return { x: e.pageX - canEl.offsetLeft, y: e.pageY - canEl.offsetTop };
	}
}

// function writelog(a){
// 	//document.getElementById("log").innerHTML += a;
// }
// function drawLightsScenarioList(a){
// 	lightScenarionsList = JSON.parse(a);
// 	var text = "<h1>Light Scenario List</h1><ul>";
// 	for (index in lightScenarionsList){
// 		text += '<li onClick="pickLightsScenario('+"'"+lightScenarionsList[index]+"')"+'">'+lightScenarionsList[index]+"</li>";
// 	}
// 	text += "</ul>";
// 	//document.getElementById("lightsScenarionPicker").innerHTML = text;
// }



// function pickLightsScenario(name){
// 	alert(name);
// 	doXmlhttpRequset('addOrder.php?scenarionName='+name+idsAndPassword,"",false);
// 	// tempObject = JSON.parse(a);
// 	// alert(JSON.stringify(tempObject.components));
// 	// doXmlhttpRequset('addOrder.php?list='+JSON.stringify(tempObject.components)+"&id=5196300&password=shenkar","",false);
// //	for (index in tempObject.components){
// //		alert('addOrder.php?compId='+index+'&value='+tempObject.components[index]+"&id=5196300&password=shenkar");
// //	}
// }

function drawHistory(obj){
	if (!needToDraw(this.isMobile)) return;

	ctx.textAlign = "right";

	var pointSize = 4;
	var MAX_DATA_IN_GRAPH = graphSize[graphCurrentTime].tiks;
	var pointsXGap = graphW / MAX_DATA_IN_GRAPH;
	ctx.fillStyle = "black";
	ctx.fillRect(this.pos.x,this.pos.y,graphW,graphH);


	if (isFullHistory){
		// draw more data
		for (var i = 0; i < graphSize.length; i++) {
			var x = BASE_BUTTON_X+(i*(BUTTON_GAP+BUTTON_W));
			// ctx.fillRect(x,BASE_BUTTON_Y,BUTTON_W,BUTTON_H);
			ctx.fillStyle = "gray";
			ctx.beginPath();
			ctx.arc(x,BASE_BUTTON_Y,BUTTON_W,0,2*Math.PI);
			ctx.fill();
			ctx.strokeStyle = "black";		
			ctx.lineWidth = 5;
			ctx.beginPath();
			ctx.arc(x,BASE_BUTTON_Y,BUTTON_W-10,0,2*Math.PI);
			ctx.stroke();
			
			ctx.lineWidth = 1;

			ctx.fillStyle = "black";
			ctx.font="25px Arial";		
			ctx.fillText(graphSize[i].name,
						 x + (BUTTON_W/3),
						 BASE_BUTTON_Y  +10);//+(BUTTON_H/2));
		}
		ctx.fillStyle = "gray";
		ctx.beginPath();
		ctx.arc(BACK_X,BACK_Y,BUTTON_W,0,2*Math.PI);
		ctx.fill();
		ctx.strokeStyle = "black";		
		ctx.lineWidth = 5;
		ctx.beginPath();
		ctx.arc(BACK_X,BACK_Y,BUTTON_W-10,0,2*Math.PI);
		ctx.stroke();

		ctx.fillStyle = "black";
		ctx.fillText("back",BACK_X + (BUTTON_W/3),
					 BACK_Y + 10);

	}

	ctx.font="25px Arial";		

	var currentTime = new Date();
//	var currentTime = graphSize[graphCurrentTime].round();//new Date();
	var totalPositions = graphSize[graphCurrentTime].tiks*graphSize[graphCurrentTime].gap;

	// Left Side Tics
	var ticGap = historyData[TEMP_SENSOR_KIND].deltaTic * graphH / (AC_MAX - AC_MIN + 1);
	var p1 = {x:this.pos.x,y:this.pos.y+ticGap/2};
	var p2 = {x:this.pos.x-10,y:this.pos.y+ticGap/2};
	ctx.strokeStyle = "white";
	ctx.fillStyle = "white";
	for (var i = 0; i < AC_MAX-AC_MIN+1; i=i+historyData[TEMP_SENSOR_KIND].deltaTic) {
		if ((AC_MAX-i)%10==0){
			ctx.fillText(AC_MAX-i+"°",p2.x-15,p2.y+ticGap);///2+);
			p2.x -= 10;
		}
		drawLine(p1,p2);
		if ((AC_MAX-i)%10==0) p2.x += 10;
		p1.y += ticGap;
		p2.y += ticGap;
	};

	// Right Side Tics
	ticGap = historyData[WATT_KIND].deltaTic * graphH / (WATT_MAX - WATT_MIN + 1);
	p1 = {x:this.pos.x+graphW,y:this.pos.y};
	p2 = {x:this.pos.x+10+graphW,y:this.pos.y};
	ctx.strokeStyle = "white";
	ctx.fillStyle = "white";
	for (var i = 0; i < WATT_MAX-WATT_MIN+1; i=i+historyData[WATT_KIND].deltaTic) {
		if ((WATT_MAX-i)%100==0){
			ctx.fillText(WATT_MAX-i,p2.x+55,p2.y+ticGap);
			ctx.fillText(" kw",p2.x+95,p2.y+ticGap);
			p2.x += 10;
		}
		drawLine(p1,p2);
		if ((WATT_MAX-i)%100==0) p2.x -= 10;
		p1.y += ticGap;
		p2.y += ticGap;
	};

	for (kindIndex in historyData){
		for (compIndex in historyData[kindIndex].components){
			ctx.fillStyle = historyData[kindIndex].components[compIndex].color;
			ctx.strokeStyle = historyData[kindIndex].components[compIndex].color;
			var pointsYGap = graphH / (historyData[kindIndex].max - historyData[kindIndex].min + 1);
			ctx.beginPath();
			var isFirst = true;
			for (i in historyData[kindIndex].components[compIndex].data){
				var data = historyData[kindIndex].components[compIndex].data[i];
				var d = new Date(data.time);
				var delta = (currentTime-d)/totalPositions;
				if (delta <1){
					var yValue = historyData[kindIndex].components[compIndex].data[i].value-historyData[kindIndex].min;
					if (yValue < 0 ) yValue = 0;
					if (yValue > historyData[kindIndex].max-historyData[kindIndex].min) yValue = historyData[kindIndex].max- historyData[kindIndex].min;
					var p = {x :this.pos.x+graphW-(graphW*delta),
							 y :this.pos.y+parseInt(compIndex)+graphH-(pointsYGap*yValue)-historyData[kindIndex].deltaTic};
					// 	// var p = {x :this.pos.x+(i*pointsXGap),
					// 	// 		 y :this.pos.y+parseInt(compIndex)+graphH-(pointsYGap*(historyData[kindIndex].components[compIndex].data[i].value-historyData[kindIndex].min))};
					if (isFirst)
						ctx.moveTo(this.pos.x,p.y);
					ctx.lineTo(p.x,p.y);
					ctx.fillRect(p.x-(pointSize/2),p.y-(pointSize/2),
								pointSize,pointSize);
					isFirst = false;
				}
			}
//			ctx.lineTo(p.x-graphW,p.y);
			ctx.stroke();
		}
	}


	var displaytime = graphSize[graphCurrentTime].round();
	var delta = (currentTime-displaytime)/totalPositions;
	// document.getElementById("log").innerHTML = "currentTime:"+currentTime+" displaytime:"+displaytime;
	ctx.font="20px Arial";		

	// X axis
	ctx.strokeStyle = "white";
	p1 = {x:this.pos.x+graphW-(graphW*delta),y:this.pos.y+graphH};
	p2 = {x:this.pos.x+graphW-(graphW*delta),y:this.pos.y+graphH+10};
	for (var i =MAX_DATA_IN_GRAPH;i>=0;i--){
		if (p1.x>this.pos.x){
			drawLine(p1,p2);
			var hours = displaytime.getHours();
			var minutes = displaytime.getMinutes();
			var text = 	"";
			if (hours < 10) text = "0";
			text += hours+":";
			if (minutes < 10) text += "0";
			text += minutes;
			ctx.fillStyle = "white";
			ctx.fillText(text,p1.x+15,p1.y+30);
			p1.x -= pointsXGap;
			p2.x -= pointsXGap;
			displaytime.setTime ( displaytime.getTime() - graphSize[graphCurrentTime].gap );
		}

	}


//	ctx.strokeRect(20,this.pos.y,200,200);
	ctx.font="25px Arial";
	ctx.textAlign = "left";
	ctx.fillStyle = "white";


	var yBase = BASE_GRAPH_Y+40;
	var xBase = 40;
	var diffText = 50;
	var diffEnd = xBase+230;
	var lineSize = 40;
	var lineStart = diffEnd + 10;
	var lineY = -7;
	ctx.strokeStyle = objArr[6].color;
	ctx.fillText ("Bedroom Temp",xBase,yBase);
	ctx.fillText ("'",xBase+170,yBase);
	ctx.fillText (":",diffEnd,yBase);
	p1 = {x:lineStart,y:yBase+lineY};
	p2 = {x:lineStart+lineSize,y:yBase+lineY};
	drawLine(p1,p2);

	ctx.strokeStyle = objArr[5].color;
	ctx.fillText ("Living Room Temp",xBase,yBase+diffText);
	ctx.fillText ("'",xBase+215,yBase+diffText);
	ctx.fillText (":",diffEnd,yBase+diffText);
	ctx.textAlign = "right";
	p1 = {x:lineStart,y:yBase+lineY+diffText};
	p2 = {x:lineStart+lineSize,y:yBase+lineY+diffText};
	drawLine(p1,p2);

}

function drawLine(a,b){
	ctx.beginPath();
	ctx.moveTo(a.x,a.y);
	ctx.lineTo(b.x,b.y);
	ctx.stroke();
}

var currColor = 0;
function getNextColor(){
	var color = "red";
	switch (currColor){
		case 0:
			color = "red";
			break;
		case 1:
			color = "blue";
			break;
		case 2:
			color = "green";
			break;
		case 3:
			color = "yellow";
			break;
		case 4:
			color = "orange";
			break;
		case 5:
			color = "pink";
			break;
		case 6:
			color = "gray";
			break;
	}
	currColor++;
	if (currColor>6) currColor =0;
	return color;
}