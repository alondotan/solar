function component(id,name,kind,desc,x,y,isMobile,color){
	this.id = id;
	this.name = name;
	this.kind = kind;
	this.desc = desc;
	this.pos = {x:x,y:y};
	this.isMobile = isMobile;
	this.value = 0;
	this.color = color;
	this.mousePos = "";

	// fan params
	this.currentImg = 0;
	this.imgCounter = 0;

	// dimmer params
	this.baseAngle = 0;
	this.displayValue = -1;

	// slider params
	this.sliderSize = 400;
	this.sliderW = 80;
	this.sliderH = 90;
	this.sliderPos = {x:0,y:this.pos.y-((this.sliderH-60)/2)};
	this.deltaX = 0;
	this.isMoving = false;

	//history kind params
	this.buttonHit = "";
	this.setValue = function(value){
		if (kind == LIGHT_DIMMER_KIND)
			this.value = toRad(value);
		else if (kind == SLIDER_KIND){
			// document.getElementById("log").innerHTML = 	 this.isMoving + " " +  this.displayValue + " == "+ value;
			if (!this.isMoving||this.displayValue==-1 || this.displayValue == value){
			//	 alert( this.displayValue + " == "+ this.value);
					this.value = value;
					this.isMoving = false;
					this.displayValue = this.value
					this.sliderPos.x = this.pos.x + (this.sliderSize-this.sliderW)*((1/(AC_MAX-AC_MIN))*(parseInt(this.value)-AC_MIN));
			}			
		}
		else{
			this.value = value;
			
		}

	}
	switch(kind){
		case TEMP_SENSOR_KIND:
			this.draw = function (){
				if (!needToDraw(this.isMobile)) return;
				ctx.strokeStyle = "black";
				ctx.fillStyle = "black";
				ctx.font="40px Arial";		
				ctx.fillText(this.value+"°",this.pos.x+(ICON_SIZE/2),this.pos.y+(ICON_SIZE/2));
				ctx.font="10px Arial";		
			};
			this.checkInteraction = function (mouse){
				return (boxInteraction(mouse,this.pos,ICON_SIZE));
			};
			this.onClick = function (mouse){
				if (this.checkInteraction(mouse))
			 	 {
			 	 	// alert("sensor");
				}
			};
			break;
		case HUMIDTY_SENSOR_KIND:
			this.draw = function (){
				if (!needToDraw(this.isMobile)) return;
				ctx.strokeStyle = "black";
				ctx.fillStyle = "black";
				ctx.font="40px Arial";		
				ctx.fillText(this.value+"%",this.pos.x+(ICON_SIZE/2),this.pos.y+(ICON_SIZE/2));
				ctx.font="10px Arial";		
			};
			this.checkInteraction = function (mouse){
				return (boxInteraction(mouse,this.pos,ICON_SIZE));
			};
			this.onClick = function (mouse){
				if (this.checkInteraction(mouse))
			 	 {
			 	 	alert("sensor");
				}
			};
			break;
		case PRESENCE_SENSOR_KIND:
			this.draw = function (){
				if (!needToDraw(this.isMobile)) return;
				if (this.value != 0){
					ctx.drawImage(isPresenceImg,this.pos.x-40,this.pos.y-40,100,100); 
				}
				// ctx.strokeStyle = "black";
				// ctx.fillStyle = "black";
				// ctx.font="20px Arial";		
				// ctx.fillText(this.name + " " + this.pos.x +","+this.pos.y,this.pos.x+(ICON_SIZE/2),this.pos.y+(ICON_SIZE/2));
				// ctx.font="10px Arial";		
			};
			this.checkInteraction = function (mouse){
				return (boxInteraction(mouse,this.pos,ICON_SIZE));
			};
			this.onClick = function (mouse){
				if (this.checkInteraction(mouse))
			 	 {
			 	 	alert("sensor");
				}
			};
			break;
		case OUTLET_KIND:
			this.checkInteraction = function (mouse){
				return (boxInteraction(mouse,this.pos,ICON_SIZE));
			};
 			this.onClick = function (mouse){
				if (this.checkInteraction(mouse))
			 	 {
			 	 	alert("outlet");
				}
			};
			break;
		case LIGHT_SWITCH_KIND:
			this.draw = function (){
				if (!needToDraw(this.isMobile)) return;
				if (this.value == 0)
					ctx.drawImage(lightOffImg,this.pos.x-20,this.pos.y-40,40,80); 
				else
					ctx.drawImage(lightOnImg,this.pos.x-20,this.pos.y-40,40,80); 
			}
			this.checkInteraction = function (mouse){
				return (circleInteraction(mouse,this.pos,CIRCLE_SIZE));
			};
			this.onClick = function (mouse){
				if (this.checkInteraction(mouse))
  				{
  					doXmlhttpRequset('addOrder.php?compId='+this.id+'&value='+(1-this.value)+idsAndPassword,"",false);
				}
			}
			break;
		case LIGHT_DIMMER_KIND:
			this.draw = function (){
				if (!needToDraw(this.isMobile)) return;
				ctx.lineWidth = 2;
				var size = CIRCLE_SIZE;
				var currDisplayValue = this.value;
				ctx.fillStyle = "gold";
				size = DIMMER_CIRCLE_SIZE;
				if (this.mousePos != ""){
					currDisplayValue = this.displayValue;
					ctx.beginPath();
	//				ctx.moveTo(this.base.x,this.base.y);
					ctx.moveTo(this.pos.x,this.pos.y);
					ctx.lineTo(this.mousePos.x,this.mousePos.y);
					ctx.stroke();
				}
					
				ctx.beginPath();
				ctx.arc(this.pos.x,this.pos.y,size,0,2*Math.PI);
				ctx.fill();
				ctx.strokeStyle = "black";		
				ctx.strokeText(Math.floor(toDeg(currDisplayValue)),this.pos.x,this.pos.y);

				// tikker
				var startLine = angleAndDist(this.pos,currDisplayValue,size*0.7);
				var endLine = angleAndDist(this.pos,currDisplayValue,size);
				ctx.strokeStyle = "black";		
				ctx.beginPath();
				ctx.moveTo(startLine.x,startLine.y);
				ctx.lineTo(endLine.x,endLine.y);
				ctx.closePath();
				ctx.stroke();
				
			}		
			this.checkInteraction = function (mouse){
				return (circleInteraction(mouse,this.pos,DIMMER_CIRCLE_SIZE));
			};
			this.onClick = function (mouse){
				if (this.checkInteraction(mouse))
			 	 {
		 	 		dimmerUpdateId = this.id;
		 	 		//this.base = mouse;
		 	 		var t = {x:this.pos.x-20,y:this.pos.y};
		 	 		this.baseAngle = GetAngleABC(t,this.pos,mouse);
		 	 		this.displayValue = this.value;
				}
			}
			this.onMouseMove = function(mouse){
				this.mousePos = mouse;
				var tt = {x:this.pos.x-20,y:this.pos.y};
				var t = GetAngleABC(tt,this.pos,mouse);
				this.displayValue = this.displayValue + t - this.baseAngle;
				// this.displayValue += toRad(dist(mouse,this.pos));
				this.value = this.displayValue;
//				document.getElementById("log").innerHTML = toDeg(this.displayValue) + " " + toDeg(t) + " " + toDeg(this.baseAngle);// - this.baseAngle;//this.value));
				this.baseAngle = t;
				//this.value = Math.floor(this.value * 100)/100;

				doXmlhttpRequset('addOrder.php?compId='+this.id+'&value='+(Math.floor(toDeg(this.displayValue)))+idsAndPassword,"",false);
			}
			this.onMouseUp = function(){
				this.mousePos = "";
			}
			break;
		case TEMP_SENSOR_KIND:
			this.draw = function (){
				if (!needToDraw(this.isMobile)) return;
				ctx.fillStyle = "green";
				ctx.fillRect(this.pos.x,this.pos.y,ICON_SIZE,ICON_SIZE);
			}
			this.checkInteraction = function (mouse){
				return (boxInteraction(mouse,this.pos,ICON_SIZE));
			};
			this.onClick = function (mouse){
				if (this.checkInteraction(mouse))
			 	 {
  					doXmlhttpRequset('getLightsScenarions.php?name=&'+idsAndPassword,drawLightsScenarioList,true);
				}
			}
			break;
		case AC_KIND:
			this.draw = function (){
				if (!needToDraw(this.isMobile)) return;
				// ctx.drawImage(fanSwitchImgs[parseInt(this.value)],this.pos.x-40,this.pos.y-40,80,80); 
				ctx.drawImage(fanSwitchImgs[this.currentImg],this.pos.x-40,this.pos.y-40,80,80); 
				if (parseInt(this.value) == 2){
					this.imgCounter++;
					if (this.imgCounter >= 5){
						this.currentImg = 1-this.currentImg;
						this.imgCounter = 0;
					}
				}
				else if (parseInt(this.value) == 1){
					this.imgCounter++;
					if (this.imgCounter >= 10){
						this.currentImg = 1-this.currentImg;
						this.imgCounter = 0;
					}
				}
			}
			this.checkInteraction = function (mouse){
				return false; //(circleInteraction(mouse,this.pos,CIRCLE_SIZE));
			};
			this.onClick = function (mouse){
				if (this.checkInteraction(mouse))
			 	 {
					var tempValue = parseInt(this.value)+1;
					if (tempValue > 2) tempValue = 0; 
  					doXmlhttpRequset('addOrder.php?compId='+this.id+'&value='+tempValue+idsAndPassword,"",false);
				}
			}
			break;
		case WATT_KIND:
			this.draw = function (){
			ctx.save();
			ctx.globalAlpha = 1;
				if (!needToDraw(this.isMobile)) return;				
				ctx.font="30px Arial";
				ctx.textAlign = "left";
				ctx.fillStyle = "white";
				var baseX = 440;
				ctx.fillText(this.name,this.pos.x,this.pos.y); 
				ctx.fillText(" : ",this.pos.x+baseX,this.pos.y); 
				ctx.textAlign = "right";	
				ctx.fillText(this.value,this.pos.x+baseX+60,this.pos.y); 
				ctx.fillText(" KW ",this.pos.x+baseX+120,this.pos.y); 
				ctx.font="10px Arial";
				ctx.strokeStyle=this.color;
				var p1 = {x:baseX+180,y:this.pos.y-15};
				var p2 = {x:baseX+240,y:this.pos.y-15};
				drawLine(p1,p2);		
			ctx.restore();
			}
			this.checkInteraction = function (mouse){
				return false; //(circleInteraction(mouse,this.pos,CIRCLE_SIZE));
			};
			this.onClick = function (mouse){
				if (this.checkInteraction(mouse))
			 	 {

				}
			}
			break;
		case AUTO_SWITCH:
			this.draw = function (){
				if (!needToDraw(this.isMobile)) return;
				ctx.drawImage(autoModeSwitchImgs[this.value],this.pos.x-40,this.pos.y-40,80,80);
			}
			this.checkInteraction = function (mouse){
				return (circleInteraction(mouse,this.pos,CIRCLE_SIZE));
			};
			this.onClick = function (mouse){
				if (this.checkInteraction(mouse))
			 	 {
			 	 	var newValue = parseInt(this.value) + 1;
			 	 	if (newValue > MODE_A) newValue = MODE_M;
  					doXmlhttpRequset('addOrder.php?compId=a'+'&value='+newValue+idsAndPassword,"",false);
				}
			}
			break;
		case AC_SWITCH_KIND:
			this.draw = function (){
				if (!needToDraw(this.isMobile)) return;
				if (this.value == 0)
					ctx.drawImage(acSwitchOffImg,this.pos.x,this.pos.y,40,40);
				else
					ctx.drawImage(acSwitchOnImg,this.pos.x,this.pos.y,40,40);					
			}
			this.checkInteraction = function (mouse){
				return (circleInteraction(mouse,this.pos,CIRCLE_SIZE));
			};
			this.onClick = function (mouse){
				if (this.checkInteraction(mouse))
			 	 {
  					doXmlhttpRequset('addOrder.php?compId=s'+'&value='+(1-this.value)+idsAndPassword,"",false);
				}
			}
			break;
		case HISTORY_KIND:
			this.draw = drawHistory;
			this.checkInteraction = function (mouse){
				this.buttonHit = "";
				if (!isFullHistory){
					return (rectInteraction(mouse,this.pos,graphW,graphH));
				}
				else{
					for (var i = 0; i < graphSize.length; i++) {
						var x = BASE_BUTTON_X+(i*(BUTTON_GAP+BUTTON_W));
						var pos = {x:x,y:BASE_BUTTON_Y};
						if (circleInteraction(mouse,pos,BUTTON_W)) this.buttonHit = ""+i;
					}
					pos = {x:BACK_X,y:BACK_Y};
					if (rectInteraction(mouse,pos,BUTTON_W,BUTTON_H)) this.buttonHit = "b";
					return (this.buttonHit != "");
				}
			};
			this.onClick = function (mouse){
				if (!isFullHistory){
					if (this.checkInteraction(mouse))
				 	 {
				 	 	showHistory();
					}
				}
				else{
					if (this.buttonHit != ""){
						if (this.buttonHit == "b") showHistory();
						else{
							graphCurrentTime = this.buttonHit;
							//alert(graphSize[graphCurrentTime].name);
						}
					}
				}

			}
			break;
		case SLIDER_KIND:
			this.draw = function (){
				if (!needToDraw(this.isMobile)) return;
				var tempValue = this.displayValue;
				if (this.displayValue == -1) tempValue = this.value; 
				ctx.drawImage(acSliderImg,this.pos.x,this.pos.y,this.sliderSize,60); 
				ctx.fillStyle = "gray";
				ctx.fillRect(this.sliderPos.x ,this.sliderPos.y,this.sliderW,this.sliderH);
				ctx.fillStyle = "white";		
				ctx.font="50px Arial";		
				ctx.fillText(tempValue+"°",this.pos.x+this.sliderSize+90,this.pos.y+50);
				ctx.font="10px Arial";		

			}
			this.checkInteraction = function (mouse){

				return (rectInteraction(mouse,this.sliderPos,this.sliderW,this.sliderH));
			};
			this.onClick = function (mouse){
				if (this.checkInteraction(mouse))
			 	 {
		 	 		dimmerUpdateId = this.id;
		 	 		this.deltaX = mouse.x - this.sliderPos.x;
		 	 		this.isMoving = true;
				}
			}
			this.onMouseMove = function(mouse){
		 	 	this.isMoving = true;
				this.sliderPos.x = mouse.x - this.deltaX;
				var maxX = this.pos.x+this.sliderSize-this.sliderW;
				if (this.sliderPos.x > maxX) this.sliderPos.x = maxX;
				var minX = this.pos.x;
				if (this.sliderPos.x < minX) this.sliderPos.x = minX;
				this.displayValue = Math.round(((this.sliderPos.x - this.pos.x ) / (this.sliderSize-this.sliderW) )*(AC_MAX-AC_MIN) + AC_MIN);
			}
			this.onMouseUp = function(){
//				this.value = this.displayValue;
//  				this.isMoving = false;
  				doXmlhttpRequset('addOrder.php?compId=t'+'&value='+parseInt(this.displayValue)+idsAndPassword,"",false);
			}
			break;
	}
}

