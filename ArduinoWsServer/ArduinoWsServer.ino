#include <SPI.h>
#include <Ethernet.h>
#include <RCSwitch.h>

// Enabe debug tracing to Serial port.
#define DEBUG

// Here we define a maximum framelength to 64 bytes. Default is 256.
#define MAX_FRAME_LENGTH 64

#include <WebSocket.h>

RCSwitch mySwitch = RCSwitch();

byte mac[] = { 0x52, 0x4F, 0x43, 0x4B, 0x45, 0x54 };
byte ip[] = { 192, 168, 10 , 200 };

// Create a Websocket server
WebSocket wsServer;

void onConnect(WebSocket &socket) {
  Serial.println("onConnect called");
}


// You must have at least one function with the following signature.
// It will be called by the server when a data frame is received.
void onData(WebSocket &socket, char* dataString, byte frameLength) {
  
#ifdef DEBUG
  Serial.print("Got data: ");
  Serial.write((unsigned char*)dataString, frameLength);
  Serial.println();
#endif
  
  if (frameLength == 13)
  {
    Serial.println("Type A: 10 pole DIP switches");
    switchTypeA(dataString);
  } 
  else if (frameLength == 5)
  {
    Serial.println("Type B: Two rotary/sliding switches");
  } 
  else if (frameLength == 7)
  {
    Serial.println("Type C: Intertechno");
  }
  
  // Just echo back data for fun.
  socket.send(dataString, frameLength);
}

void switchTypeA(char* dataString)
{
  String cmd = String(dataString);
  
  char* systemcode = new char[6];
  cmd.substring(2, 7).toCharArray(systemcode, 6);
  char* unitcode = new char[6];
  cmd.substring(8, 13).toCharArray(unitcode, 6);
  
  if (dataString[0] == '1')
  {
    Serial.print("On: ");
    Serial.print(systemcode);
    Serial.print(",");
    Serial.println(unitcode);
    mySwitch.switchOn(systemcode, unitcode);
  }
  else
  {
    Serial.print("Off: ");
    Serial.print(systemcode);
    Serial.print(",");
    Serial.println(unitcode);
    mySwitch.switchOff(systemcode, unitcode);
  }
}

void onDisconnect(WebSocket &socket) {
  Serial.println("onDisconnect called");
}

void setup() {
#ifdef DEBUG  
  Serial.begin(57600);
#endif
  Ethernet.begin(mac, ip);
  
  wsServer.registerConnectCallback(&onConnect);
  wsServer.registerDataCallback(&onData);
  wsServer.registerDisconnectCallback(&onDisconnect);  
  wsServer.begin();
  
  delay(100); // Give Ethernet time to get ready
  
  //mySwitch.enableReceive(0);  // Receiver on inerrupt 0 => that is pin #2 (pin #3 on Arduino Leonardo)
  mySwitch.enableTransmit(8);  // Using Pin #8
}

void loop() {
  // Should be called for each loop.
  wsServer.listen();
  
  // Do other stuff here, but don't hang or cause long delays.
  delay(100);
  if (wsServer.isConnected()) {
    //wsServer.send("abc123", 6);
  }
}
