class Component{

  int SWITCH_KIND = 3;
  int DIMMER_KIND = 2;
  int SENSOR_KIND = 0;
  int READ_ONLY_KIND = 9;
  float HANDLE_SIZE = 0.7;
  char id;
  PVector pos;
  int kind;
  int value;
  PVector handlePos;
  boolean handleHold = false;
  String name;
  int SIZE = 30;  

  Component( char id,PVector pos,  int kind,String name){
      this.id = id;
      this.pos = pos;
      this.kind = kind;
      this.value = 0;
      this.name = name;
      if (kind == SENSOR_KIND || kind == DIMMER_KIND )
        handlePos = new PVector(pos.x+SIZE*2,pos.y);
  }


  void click(PVector mouse){
    if (kind == SWITCH_KIND){      
      if (mouse.dist(pos)<SIZE){
          value = 1-value;
      }
    }
    else if (kind == SENSOR_KIND|| kind == DIMMER_KIND){
      handleHold = (mouse.dist(handlePos)<SIZE*HANDLE_SIZE);      
    }
  }

  void draw (){
      fill(200,200,250);
      text(id+" "+name,pos.x,pos.y-SIZE/2);
      if (kind == SENSOR_KIND){
        fill(0,0,0);
        ellipse(pos.x,pos.y,SIZE,SIZE);
        fill(200,200,250);
        text(value,pos.x,pos.y);
        ellipse(handlePos.x, handlePos.y, SIZE*HANDLE_SIZE, SIZE*HANDLE_SIZE);
        line(pos.x,pos.y,handlePos.x,handlePos.y);
      }
      else if (kind == DIMMER_KIND) {
        fill(0,200,0);
        ellipse(pos.x,pos.y,SIZE,SIZE);
        fill(200,200,250);
        text(value,pos.x,pos.y);
        ellipse(handlePos.x, handlePos.y, SIZE*HANDLE_SIZE, SIZE*HANDLE_SIZE);
        line(pos.x,pos.y,handlePos.x,handlePos.y);
        
      }
      else if (kind == SWITCH_KIND) {
        if (value==1)
          fill(0,200,0);
        else
          fill(200,0,0);
        ellipse(pos.x,pos.y,SIZE,SIZE);
        fill(200,200,250);
        text(value,pos.x,pos.y);
        
      }      
  }

  void update(PVector mouse){
    if ((kind == SENSOR_KIND || kind == DIMMER_KIND)&& handleHold){
      handlePos = mouse;
      calcCurrAngle();
    }
  }

  void calcCurrAngle(){
    value = (int) degrees(GetAngleABC(new PVector(pos.x,pos.y-10),pos,handlePos));
  }

}
