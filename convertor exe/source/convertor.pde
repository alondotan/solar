import processing.serial.*;

boolean IS_ARDUINO = true;
int houseId = 5196300;
String housePassword = "shenkar";
String userId = "5196300";
String ID_N_PASS = "userId="+userId+"&houseId="+houseId+"&housePassword="+housePassword;
Serial myPort;
boolean startArduino;

final char  GET_DATA = '?';
final char  BED_ROOM_LIGHT_ID = '0';
final char  KITCHEN_LIGHT_ID = '1';
final char  SALON_LIGHT_ID = '2';
final char  BED_ROOM_AIR_C_ID = '3';
final char  SALON_AIR_C_ID = '4';
final char  BED_ROOM_TEMP_ID = '5';
final char  SALON_TEMP_ID = '6';
final char  BED_ROOM_PRESENCE_ID = '7';
final char  SALON_PRESENCE_ID = '8';
final char  AUTO_MODE_ID = 'a'; //11
final char  TO_TEMP_ID = 't';
final char  AC_SWITCH_ID = 's';

int BIG_TIME = 3;

int itsTime = BIG_TIME;

// text
int TEXT_SIZE = 32;
int TEXT_START_X = 100;
int TEXT_START_Y = 100;
int TEXT_NEW_LINE = 35;
String PHP_URL = "http://localhost:802/solar/php/";
  
int READ_LOOP = 9;
int readLoopCounter = 0;
int PARIODIC_LOOP = 200;
int pariodicLoopCounter = 0;

String lastBuffer = "";

int rectX, rectY;      // Position of square button
int circleX, circleY;  // Position of circle button
int rectSize = 40;     // Diameter of rect
int circleSize = 40;   // Diameter of circle
color rectColor, circleColor, baseColor;
color rectHighlight, circleHighlight;
color currentColor;
boolean rectOver = false;
boolean circleOver = false;
int prodCounter = 40;
int PROD_MAX = 100;

String logText = "";

Component bedRoomLight,kitchenLight,salonLight,bedRoomAc,salonAc,bedRoomTemp,salonTemp,
          bedRoomPres,salonPres,autoMode,toTemp,acSwitch,prod,lightWatt,acWatt,applianceWatt;
void setup() {
  size(640, 360);

  if (IS_ARDUINO){
    textSize(TEXT_SIZE);
    fill(0,0,0);
    t("Port List:",0);
    String [] a = Serial.list();
    for (int i = 0;i<a.length;i++){
          t(i+": "+a[i],i+1);
    }
    startArduino = false;
  }
  else {

    startArduino = true;
    bedRoomLight = new Component(BED_ROOM_LIGHT_ID,new PVector (100,100),3,"bed room light");
    kitchenLight = new Component(KITCHEN_LIGHT_ID,new PVector (400,100),3,"kitchen light");
//    salonLight = new Component(SALON_LIGHT_ID,new PVector (300,100),2,"salon light");
    salonLight = new Component(SALON_LIGHT_ID,new PVector (300,100),3,"salon light");
    bedRoomAc = new Component(BED_ROOM_AIR_C_ID,new PVector (100,250),3,"bed room air cond");
    salonAc = new Component(SALON_AIR_C_ID,new PVector (300,250),3,"salon air cond");
    bedRoomPres = new Component(BED_ROOM_PRESENCE_ID,new PVector (100,150),0,"bed room pres");
    salonPres = new Component(SALON_PRESENCE_ID,new PVector (300,150),0,"salon pres");
    bedRoomTemp = new Component(BED_ROOM_TEMP_ID,new PVector (100,200),0,"bed room temp");
    salonTemp = new Component(SALON_TEMP_ID,new PVector (300,200),0,"salon temp");
    autoMode = new Component(AUTO_MODE_ID,new PVector (400,300),3,"auto mode");
    toTemp = new Component(TO_TEMP_ID,new PVector (200,300),2,"to temp");
    acSwitch = new Component(AC_SWITCH_ID,new PVector (300,300),3,"ac switch");
    prod = new Component('p',new PVector (450,300),0,"prod");
    lightWatt = new Component('w',new PVector (500,300),0,"watt");
    acWatt = new Component('w',new PVector (500,300),0,"watt");
    applianceWatt = new Component('w',new PVector (500,300),0,"watt");
  }
  itsTime = BIG_TIME;
}

void draw() {
  background(150,150,150);
  itsTime--;
  if (itsTime == 0){
    itsTime = BIG_TIME;
    if (startArduino){

      if (!IS_ARDUINO){
        bedRoomLight.draw();
        kitchenLight.draw();
        salonLight.draw();
        bedRoomAc.draw();
        salonAc.draw();
        bedRoomPres.draw();
        salonPres.draw();
        bedRoomTemp.draw();
        salonTemp.draw();
        autoMode.draw();
        toTemp.draw();
        acSwitch.draw();
        lightWatt.draw();
        acWatt.draw();
        applianceWatt.draw();
        prod.draw();
      }
      
      // check for updates from php
      String [] response = loadStrings(PHP_URL+"getOrders.php?"+ID_N_PASS);
      if (response.length  >0) {
        println (response[0]);
        String [] orders = split(response[0],"#");
        for (String o : orders){
          println("o: "+o+"~");        
          if (IS_ARDUINO){
            myPort.write(o+"~");
          }
          else{
  //          String [] orderData = o.substring//split(o,"_");
            int value = Integer.parseInt(o.substring(1,o.length()));
            println(value);
            switch (o.charAt(0)){//Integer.parseInt(o.substring(0,1))){//orderData[0])){
              case BED_ROOM_LIGHT_ID :
                  bedRoomLight.value = value;          
                  break;
              case KITCHEN_LIGHT_ID :
                  kitchenLight.value = value;          
                  break;
              case SALON_LIGHT_ID :
                  salonLight.value = value;          
                  break;
              case BED_ROOM_AIR_C_ID :
                 bedRoomAc.value = value;          
                  break;
              case SALON_AIR_C_ID :
                 salonAc.value = value;          
                  break;
              case BED_ROOM_TEMP_ID :
                  bedRoomTemp.value = value;          
                  break;
              case SALON_TEMP_ID:
                  salonTemp.value = value;          
                  break;
              case BED_ROOM_PRESENCE_ID :
                 bedRoomPres.value = value;          
                  break;
              case SALON_PRESENCE_ID :
                  salonPres.value = value;          
                  break;
              case AUTO_MODE_ID :
                  autoMode.value = value;         
                  break;
              case TO_TEMP_ID :
                  toTemp.value = value;         
                  break;
              case AC_SWITCH_ID :
                  acSwitch.value = value;         
                  break;

            }
          }
        } 
      }
      if (readLoopCounter-- <= 0)
      {
        readLoopCounter =  READ_LOOP;
        String inBuffer = ""; 
        if (IS_ARDUINO){
  //            myPort.clear();
          myPort.write("?~");
              
          while (myPort.available() > 0) {
            inBuffer += myPort.readString();   
          }
        }
        else{ // not arduino
          inBuffer = "~"+bedRoomLight.value + "_" +
                      kitchenLight.value + "_" +
                      salonLight.value + "_" +
                      bedRoomAc.value + "_" +
                      salonAc.value + "_" +
                      bedRoomTemp.value + "_" +
                      salonTemp.value+"_" +
                      bedRoomPres.value + "_" +
                      salonPres.value + "_" +
                      "35_" +
                      "35_" +
                      autoMode.value + "_" +
                      toTemp.value + "_" +
                      lightWatt.value + "_" +
                      acWatt.value + "_" +
                      applianceWatt.value + "_" +
                      prodCounter  + "_" + 
                      acSwitch.value + "_" +
                      "~";
        }

        if (inBuffer != null && inBuffer.indexOf("~") == 0){
          if (inBuffer.indexOf("~",1)!=-1){
            String temp = inBuffer.substring(1,inBuffer.indexOf("~",1));        
            if (!lastBuffer.equals(temp) ) {
            // println("~"+inBuffer+"~");
              println("#"+temp+"#");
              String [] response2 = loadStrings(PHP_URL+"updateValues.php?val="+temp+"&"+ID_N_PASS);
              lastBuffer = temp;
            }
          }
          else { //only sub message

          }
        }
      }
      if (pariodicLoopCounter-- <= 0)
      {
        println("pariodic handle");
        pariodicLoopCounter =  PARIODIC_LOOP;
        String [] response2 = loadStrings(PHP_URL+"pariodicHandle.php?"+ID_N_PASS);
  //      pariodicHandle.php
        prodCounter++;
        if (prodCounter >= PROD_MAX){
          prodCounter=40;
        }
      }

    }
  } 
}


void mousePressed() {
  if (!IS_ARDUINO){
    PVector mouse = new PVector (mouseX,mouseY);
    bedRoomLight.click(mouse);
    kitchenLight.click(mouse);
    salonLight.click(mouse);
    bedRoomAc.click(mouse);
    salonAc.click(mouse);
    bedRoomPres.click(mouse);
    salonPres.click(mouse);
    bedRoomTemp.click(mouse);
    salonTemp.click(mouse);
    autoMode.click(mouse);
    toTemp.click(mouse);
    acSwitch.click(mouse);
    lightWatt.click(mouse);
    acWatt.click(mouse);
    applianceWatt.click(mouse);
  }
}

void mouseDragged() {
  if (!IS_ARDUINO){
    PVector mouse = new PVector (mouseX,mouseY);
    bedRoomLight.update(mouse);
    kitchenLight.update(mouse);
    salonLight.update(mouse);
    bedRoomAc.update(mouse);
    salonAc.update(mouse);
    bedRoomPres.update(mouse);
    salonPres.update(mouse);
    bedRoomTemp.update(mouse);
    salonTemp.update(mouse);
    autoMode.update(mouse);
    toTemp.update(mouse);
    acSwitch.update(mouse);
    lightWatt.update(mouse);
    acWatt.update(mouse);
    applianceWatt.update(mouse);
  }
}


void keyReleased() {

  if (!startArduino){
    int portKey = -1;
    if (key == '0'){
      portKey = 0;
    }
    else if (key == '1'){
      portKey = 1;
    }
    else if(key=='2'){
      portKey = 2;
    }

    println(portKey);
    if (IS_ARDUINO){
      // Open the port you are using at the rate you want:
      println("start opening port");
      myPort = new Serial(this, Serial.list()[portKey], 9600);
      println("port open");
    }
    if (portKey != -1)
      startArduino = true;
  }
}


void t(String t,int l){
       println(t);
      fill(0,0,0);
       text(t,TEXT_START_X,TEXT_START_Y + l*TEXT_NEW_LINE);  
}

float GetAngleABC( PVector p1, PVector p2, PVector p3 )
{
  float  s1 = p2.dist(p3);
  float  s2 = p1.dist(p3);
  float  s3 = p2.dist(p1);
    float angle = acos((-s2*s2  + s3*s3 + s1*s1) / (2*s1*s3));

  float tx = p3.x;
  float ty = (tx-p1.x)*((p2.y-p1.y)/(p2.x-p1.x)) + p1.y;

  if ((ty<p3.y && p2.x >= p1.x) || (ty>p3.y && p2.x < p1.x)) angle = radians(360) - angle;

  return angle;
}

