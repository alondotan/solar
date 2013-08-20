#include <OneWire.h> 
#include "floatToString.h";
#include "getTemp.h";
#include <DateTime.h>  

// CONST
int NON_PRESENCE_TIMEOUT = 1000 * 3; // 3 sec
int GENERAL_NON_PRESENCE_TIMEOUT = 1000 * 60 *3; // 3
int PRESENCE_MIN_DIST = 30; // cm
boolean BED_ROOM_ONLY = false;
boolean DEBUG = false;
int LIGHT_AMPER = 3;
int LIGHT_VOLT = 3;
float AC_AMPER = 115;
int AC_VOLT = 1;
int MIN_LIGHT_IN_ROOM = 200;
int STRONG_AC_DELTA = 5;

int MODE_M = 0;
int MODE_A_LIGHT = 1;
int MODE_A_AC = 2;
int MODE_A = 3;

// divics ID
char const GET_DATA = '?';
char  const BED_ROOM_LIGHT_ID = '0';
char  const KITCHEN_LIGHT_ID = '1';
char const SALON_LIGHT_ID = '2';
char const BED_ROOM_AIR_C_ID = '3';
char const SALON_AIR_C_ID = '4';
char const BED_ROOM_TEMP_ID = '5';
char const SALON_TEMP_ID = '6';
char const BED_ROOM_PRESENCE_ID = '7';
char const SALON_PRESENCE_ID = '8';
char const BED_ROOM_HUMIDITY_ID = '9';
char const SALON_HUMIDITY_ID = '10';
char const AUTO_MODE_ID = 'a';//11
char const TO_TEMP_ID = 't';//12
char const CURR_LIGHT_WATT_ID = 'w';//13
char const CURR_AC_WATT_ID = 'w';//14
char const CURR_APPLIANE_WATT_ID = 'w';//15
char const CURR_PRODUCTION_ID = 'w';//16
char const AC_SWITCH_ID = 's';//17

String const ON = "1";
String const OFF = "0";

//// pins defs
//int const bedRoomLightPin = 1;
//int const bedRoomAirCondPin = 9;
//int const bedRoomTempPin = 2; //DS18S20 Signal pin on digital 2
//int const bedRoomPresencePin = 7;
//int const bedRoomPhotoElectricSensorPin = 1; // analog
//
//
//int const kitchenLightPin = 10;
//int const salonLightPin = 11; //dimmer
//int const salonAirCondPin = 6;
//int const salonTempPin = 4; //DS18S20 Signal pin on digital 4
//int const salonPresencePin = 8;
//int const salonPhotoElectricSensorPin = 1; // analog


int const bedRoomLightPin = 13;
int const bedRoomAirCondPin = 12;
int const bedRoomTempPin = 11; //DS18S20 Signal pin on digital 2
int const bedRoomPresencePin = 8;
int const bedRoomPhotoElectricSensorPin = 1; // analog


int const kitchenLightPin = 5;
int const salonLightPin = 3; //dimmer
int const salonAirCondPin = 6;
int const salonTempPin = 4; //DS18S20 Signal pin on digital 4
int const salonPresencePin = 7;
int const salonPhotoElectricSensorPin = 5; // analog

//Temperature chip i/o
OneWire bedRoomDs(bedRoomTempPin); // on digital pin 2
OneWire salonDs(salonTempPin); // on digital pin 

// currentValues
String bedRoomLightVal = OFF;
String bedRoomAcVal = OFF;
float bedRoomTemperatureVal;
boolean bedRoomPresenceVal;
int bedRoomPhotoElectricSensorVal;
unsigned long bedRoomLastPresenceTime;
String bedRoomHumidityVal = "32";

String kitchenLightVal = OFF;
String salonLightVal = OFF;
String salonAcVal = OFF;
float salonTemperatureVal;
boolean salonPresenceVal;
int salonPhotoElectricSensorVal;
unsigned long salonLastPresenceTime;
String salonHumidityVal = "32";
boolean acSwitchVal;

int toTemperature;
int autoMode;
float currLightWatt;
float currAcWatt;
float currApplianceWatt;
long currTime;
int production;

char buffer[25];
String readString = String(100); // saves the input string from serial
char id,value; // Indicator - char
String writeString = String(100);

///////////////////////////////////////////////////////////////////////////////////////////////
//  setup
void setup()
{
  pinMode(bedRoomLightPin, OUTPUT);
  pinMode(bedRoomAirCondPin, OUTPUT);
  pinMode(bedRoomPresencePin, INPUT);
  pinMode(bedRoomPhotoElectricSensorPin, INPUT);
  digitalWrite(bedRoomLightPin, LOW);
  digitalWrite(bedRoomAirCondPin, LOW);

  if (!BED_ROOM_ONLY){      
    pinMode(kitchenLightPin, OUTPUT);
    pinMode(salonLightPin, OUTPUT);
    pinMode(salonAirCondPin, OUTPUT);
    pinMode(salonPresencePin, INPUT);
    pinMode(salonPhotoElectricSensorPin, INPUT);

    digitalWrite(kitchenLightPin, LOW);
    digitalWrite(salonLightPin, LOW);
    digitalWrite(salonAirCondPin, LOW);
  }
  Serial.begin(9600);

  bedRoomPresenceVal = false;
  salonPresenceVal = false;
  toTemperature = 30;
  autoMode = MODE_M;
  currLightWatt = 0;
  currAcWatt = 0;
  currApplianceWatt = 8;
  acSwitchVal = false;
  production = 128;
}

/////////////////////////////////////////////////////////////////////////////////
// loop
void loop()
{
  readString = "";
  writeString="";

  // read analog data  
  bedRoomTemperatureVal = getTemp(bedRoomDs);
  bedRoomPresenceVal = getPresence(bedRoomPresencePin);
  if (bedRoomPresenceVal)
    bedRoomLastPresenceTime =  millis();
  bedRoomPhotoElectricSensorVal = analogRead(bedRoomPhotoElectricSensorPin);

  if (!BED_ROOM_ONLY){
    salonTemperatureVal = getTemp(salonDs);
    salonPresenceVal = getPresence(salonPresencePin);
    if (salonPresenceVal)
      salonLastPresenceTime  =  millis();
    salonPhotoElectricSensorVal = analogRead(salonPhotoElectricSensorPin);
  }

  //// calc current watt
  currAcWatt = 0;
  currLightWatt = 0;
  currLightWatt += LIGHT_VOLT * LIGHT_AMPER*bedRoomLightVal.toInt();
  //   currWatt += LIGHT_VOLT * LIGHT_AMPER*salonLightVal.toInt()/250;
  currLightWatt += LIGHT_VOLT * LIGHT_AMPER*salonLightVal.toInt();
  currLightWatt += LIGHT_VOLT * LIGHT_AMPER*kitchenLightVal.toInt();
  currAcWatt += AC_VOLT * AC_AMPER*bedRoomAcVal.toInt();
  currAcWatt += AC_VOLT*AC_AMPER*salonAcVal.toInt();

  // create wrtieString
  String d = "_";
  String endSign = "~";

  //if (!DEBUG){
  writeString =  endSign + 
    bedRoomLightVal + d + 
    kitchenLightVal + d + 
    salonLightVal + d +
    bedRoomAcVal+d+
    salonAcVal+d+
    floatToString(buffer,bedRoomTemperatureVal,2 ) +d+
    floatToString(buffer,salonTemperatureVal,2 ) + d+
    boolToString(bedRoomPresenceVal ) +d+
    boolToString(salonPresenceVal ) + d +
    bedRoomHumidityVal + d +
    salonHumidityVal + d+
    String(autoMode) + d + 
    String(toTemperature) + d + 
    floatToString(buffer,currLightWatt,1) + d +
    floatToString(buffer,currAcWatt,1) + d +
    floatToString(buffer,currApplianceWatt,1) + d +
    String(production) + d + 
    boolToString(acSwitchVal) + d +
    String(bedRoomPhotoElectricSensorVal) + d +
    String(salonPhotoElectricSensorVal) + d +
    endSign;                             
  //  }
  //else{
  //  writeString =  "light-0: " + bedRoomLightVal +  
  //                               " Ac-3: " + bedRoomAcVal+ 
  //                               " temp: " + floatToString(buffer,bedRoomTemperatureVal,2 ) +
  //                               " pre: " +  boolToString(bedRoomPresenceVal ) +
  //                               " PhotoE: " + String(bedRoomPhotoElectricSensorVal) +
  //                               " 2T-t: " + String(toTemperature) + 
  //                               " Auto-a: " + String(autoMode) + 
  //                               " cWatt: " + String(currWatt);                             
  //}

  //     delay(3000);
  //            Serial.println( writeString);

  // read serial port
  boolean over = false;
  while (Serial.available() && !over) 
  {
    delay(10);
    if (Serial.available() >0) 
    {
      char c = Serial.read();  //gets one byte from serial buffer
      if (c != '~'){
        readString += c; // Creates input string
      }
      else{
        over = true;
      }
    }
  }
  // If there was input
  if (readString.length() >0) {
    String val = "";
    if (readString.length() >1) val = readString.substring(1);
    updateDevice(readString.charAt(0),val);
  }
  handleAutomatic();
}



//////////////////////////////////////////////////////////////////////
//   updateDevice
void updateDevice(char id,String value){
  int tempVal;
  // if its get data query
  switch (id) {
  case  GET_DATA:
    Serial.println( writeString);
    break;
  case BED_ROOM_LIGHT_ID:
    if (value == ON) 
    {          
      digitalWrite(bedRoomLightPin,HIGH);   
    }
    else{
      digitalWrite(bedRoomLightPin,LOW);              
    }
    bedRoomLightVal = value;
    break;
  case  KITCHEN_LIGHT_ID:
    if (value == ON) 
    {
      digitalWrite(kitchenLightPin,HIGH);
    }
    else{
      digitalWrite(kitchenLightPin,LOW);
    }
    kitchenLightVal = value;
    break;
  case SALON_LIGHT_ID:
    if (value == ON) 
    {
      digitalWrite(salonLightPin,HIGH);
    }
    else{
      digitalWrite(salonLightPin,LOW);
    }
    salonLightVal = value;
    //          salonLightVal = value;
    //          analogWrite(salonLightPin,value.toInt());
    break;
  case BED_ROOM_AIR_C_ID:
    if (value != OFF) 
    {
      digitalWrite(bedRoomAirCondPin,HIGH);
    }
    else{
      digitalWrite(bedRoomAirCondPin,LOW);
    }
    bedRoomAcVal = value;
//    if (value.toInt() == 0) tempVal = 0;
//    else if (value.toInt() == 1) tempVal = 150;
//    else if (value.toInt() == 2) tempVal = 250;
//    // tempVal = value.toInt() * 125;
//    //          if (value == 0) tempVal = 0;
//    //          else tempVal = 250;
//    //tempVal = value.toInt();
//    analogWrite(bedRoomAirCondPin,tempVal);
    break;
  case SALON_AIR_C_ID:
    if (value != OFF) 
    {
      digitalWrite(salonAirCondPin,HIGH);
    }
    else{
      digitalWrite(salonAirCondPin,LOW);
    }
    salonAcVal = value;
//    tempVal = value.toInt() * 125;
//    analogWrite(salonAirCondPin, tempVal);
    break;
  case TO_TEMP_ID:
    toTemperature = value.toInt();
    break;
  case AUTO_MODE_ID:
    autoMode =  value.toInt();
    break;
  case AC_SWITCH_ID:
    acSwitchVal =  (value == ON) ;
    break;
  }
}


/////////////////////////////////////////////////////////////////////////
//  handleAutomatic
void handleAutomatic(){
  currTime =  millis();
  if (autoMode == MODE_A_LIGHT || autoMode == MODE_A){    
    // handle opening lights
    if (salonPresenceVal && 
      (salonLightVal != ON || kitchenLightVal == ON)&&
      needLight(salonPhotoElectricSensorVal) && 
      !BED_ROOM_ONLY){
      debug("someone in salon");  
      updateDevice(KITCHEN_LIGHT_ID,ON);
      updateDevice(SALON_LIGHT_ID,ON);
    }

    if (bedRoomPresenceVal && 
      bedRoomLightVal != ON &&
      needLight(bedRoomPhotoElectricSensorVal)){
      debug("someone in bed room");  
      updateDevice(BED_ROOM_LIGHT_ID,ON);
    }

    // handle closing lights

    if (currTime-salonLastPresenceTime > NON_PRESENCE_TIMEOUT && 
      !salonPresenceVal &&
      (salonLightVal == ON || kitchenLightVal == ON)&&
      !BED_ROOM_ONLY){
      updateDevice(KITCHEN_LIGHT_ID,OFF);
      updateDevice(SALON_LIGHT_ID,OFF);
    } 


    if (currTime-bedRoomLastPresenceTime > NON_PRESENCE_TIMEOUT && 
      !bedRoomPresenceVal &&
      bedRoomLightVal == ON){
      updateDevice(BED_ROOM_LIGHT_ID,OFF);
    }
  }

  // handle ac
  int bedRoomDeltaTemp = int(bedRoomTemperatureVal) - toTemperature;     
  int salonDeltaTemp = int(salonTemperatureVal) - toTemperature;     

  if (autoMode == MODE_A_AC || autoMode == MODE_A){
    acSwitchVal = false;
    if (bedRoomPresenceVal || salonPresenceVal ||
      currTime-bedRoomLastPresenceTime < NON_PRESENCE_TIMEOUT ||
      currTime-salonLastPresenceTime < NON_PRESENCE_TIMEOUT){
      debug("need to open  ac bed room");
      acSwitchVal = true;
    } 
  }

  if (acSwitchVal){
    if ( !(autoMode == MODE_A_AC || autoMode == MODE_A) || bedRoomPresenceVal
      || currTime-bedRoomLastPresenceTime < NON_PRESENCE_TIMEOUT ){
      if ( bedRoomDeltaTemp < 0){
        debug("to cold");
        updateDevice(BED_ROOM_AIR_C_ID,OFF);        
      }
      else if (bedRoomDeltaTemp <  STRONG_AC_DELTA){
        debug("little to hot");
        updateDevice(BED_ROOM_AIR_C_ID,"1");
      }
      else {
        debug("very to hot");
        updateDevice(BED_ROOM_AIR_C_ID,"2");
      }
    }
    else{
      updateDevice(BED_ROOM_AIR_C_ID,OFF);        
    }

    if (!BED_ROOM_ONLY){
      if ( !(autoMode == MODE_A_AC || autoMode == MODE_A) || salonPresenceVal
        || currTime-salonLastPresenceTime < NON_PRESENCE_TIMEOUT ){
        if ( salonDeltaTemp < 0){
          debug("to cold");
          updateDevice(SALON_AIR_C_ID,OFF);        
        }
        else if (salonDeltaTemp <  STRONG_AC_DELTA){
          debug("little to hot");
          updateDevice(SALON_AIR_C_ID,"1");
        }
        else {
          debug("very to hot");
          updateDevice(SALON_AIR_C_ID,"2");
        }
      }
      else{
        updateDevice(SALON_AIR_C_ID,OFF);        
      }

    }
  }
  else { // AC is close
    updateDevice(BED_ROOM_AIR_C_ID,OFF);
    updateDevice(SALON_AIR_C_ID,OFF);
  }


  /// defoult atoumatic - always working
  //       if (salonLastPresenceTime > GENERAL_NON_PRESENCE_TIMEOUT &&
  //              bedRoomLastPresenceTime > GENERAL_NON_PRESENCE_TIMEOUT){
  //               updateDevice(KITCHEN_LIGHT_ID,OFF);
  //               updateDevice(SALON_LIGHT_ID,OFF);
  //               updateDevice(BED_ROOM_LIGHT_ID,OFF);
  //               updateDevice(SALON_AIR_C_ID,OFF);        
  //               updateDevice(BED_ROOM_AIR_C_ID,OFF);        
  //       }

}

boolean getPresence(int pin){
  long pulse = pulseIn(pin, HIGH);
  long cm =  pulse/147* 2.54;
  return (cm<PRESENCE_MIN_DIST);
}

boolean needLight(int peVal){
  return (peVal < MIN_LIGHT_IN_ROOM);
}

String boolToString(boolean b){
  if (b)
    return ON;
  else
    return OFF;
}

void debug(String t){
  if (DEBUG)
    Serial.println( t);
}

